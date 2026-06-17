/// <reference types="vitest" />
// Triggering config reload to clear Analog content cache - 2026-05-16T21:33:35

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Helper to resolve lightningcss path in pnpm's virtual store
function findPackageInPnpm(packageName: string): string | null {
  const pnpmDir = path.resolve('node_modules/.pnpm');
  if (!fs.existsSync(pnpmDir)) return null;
  const files = fs.readdirSync(pnpmDir);
  for (const file of files) {
    if (file.startsWith(`${packageName}@`)) {
      const pkgPath = path.join(pnpmDir, file, 'node_modules', packageName);
      if (fs.existsSync(pkgPath)) {
        return pkgPath;
      }
    }
  }
  return null;
}

// Instantiate css minifier using lightningcss, with regex fallback
function getCssMinifier() {
  const lightningcssPath = findPackageInPnpm('lightningcss');
  if (lightningcssPath) {
    try {
      const { transform } = require(lightningcssPath);
      return (css: string) => {
        const { code } = transform({
          filename: 'style.css',
          code: Buffer.from(css),
          minify: true,
          sourceMap: false,
        });
        return code.toString();
      };
    } catch (e) {
      console.warn('[minify-css] Failed to load lightningcss from pnpm path:', e);
    }
  }

  try {
    const { transform } = require('lightningcss');
    return (css: string) => {
      const { code } = transform({
        filename: 'style.css',
        code: Buffer.from(css),
        minify: true,
        sourceMap: false,
      });
      return code.toString();
    };
  } catch (e) {
    // Safe fallback below
  }

  console.warn('[minify-css] lightningcss not found. Falling back to regex minification.');
  return (css: string) => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
  };
}

const minifyCss = getCssMinifier();


// Normalizing base path for production builds (e.g., GitHub Pages subpaths)
let base = process.env['VITE_BASE_URL'] || '/';
if (!base.startsWith('/')) {
  base = '/' + base;
}
if (!base.endsWith('/')) {
  base = base + '/';
}

// Helper to wrap Rollup hooks to conditionally bypass execution during SSR builds (Vite 6/8 Environment API compatibility)
function wrapClientOnlyHook(
  hook: any,
  checkSSR: (ctx: any, ...args: any[]) => boolean
) {
  if (!hook) return undefined;

  const handler = typeof hook === 'function' ? hook : hook.handler;
  const order = typeof hook === 'object' ? hook.order : undefined;
  const sequential = typeof hook === 'object' ? hook.sequential : undefined;

  return {
    order,
    sequential,
    async handler(this: any, ...args: any[]) {
      if (checkSSR(this, ...args)) {
        return;
      }
      return await handler.call(this, ...args);
    }
  };
}


// Wrapper to constrain VitePWA to the client build environment (Vite 6/8 Environment API).
// Root cause: configResolved runs for both client and SSR. The SSR call overwrites the plugin's
// shared ctx.viteConfig, so closeBundle sees build.ssr=true and skips SW generation.
function clientPwa(pwaPlugins: any[]) {
  return pwaPlugins.flat().map((plugin: any) => {
    const wrapped = { ...plugin };

    // Guard configResolved: prevent SSR environment from overwriting client config in shared context
    if (plugin.configResolved) {
      const orig = typeof plugin.configResolved === 'function'
        ? plugin.configResolved
        : plugin.configResolved.handler;
      const guardedFn = async function (this: any, config: any) {
        if (config.build?.ssr) return;
        return orig.call(this, config);
      };
      wrapped.configResolved = typeof plugin.configResolved === 'function'
        ? guardedFn
        : { ...plugin.configResolved, handler: guardedFn };
    }

    return wrapped;
  });
}

// Custom plugin to inline client CSS directly into index.html at build time (Vite 6/8 Environment API compatibility)
function inlineCssPlugin() {
  return {
    name: 'inline-css-plugin',
    apply: 'build' as const,
    enforce: 'post' as const,
    applyToEnvironment(environment: any) {
      return environment.name === 'client';
    },
    generateBundle(options: any, bundle: any) {
      const cssAssets = Object.keys(bundle).filter((key) => key.endsWith('.css'));
      const htmlAssets = Object.keys(bundle).filter((key) => key.endsWith('.html'));

      console.log('[inline-css-plugin] cssAssets:', cssAssets, 'htmlAssets:', htmlAssets);

      if (cssAssets.length === 0 || htmlAssets.length === 0) return;

      cssAssets.forEach((cssKey) => {
        const cssAsset = bundle[cssKey];
        if (cssAsset && cssAsset.type === 'asset') {
          const cssContent = cssAsset.source.toString();

          htmlAssets.forEach((htmlKey) => {
            const htmlAsset = bundle[htmlKey];
            if (htmlAsset && htmlAsset.type === 'asset') {
              let htmlSource = htmlAsset.source.toString();

              const cssFilename = cssAsset.fileName.split('/').pop();
              const regex = new RegExp(`<link[^>]*href=["'][^"']*${cssFilename}["'][^>]*>`, 'g');

              console.log(`[inline-css-plugin] Checking link tag for ${cssFilename} in ${htmlKey}`);

              if (regex.test(htmlSource)) {
                htmlSource = htmlSource.replace(regex, `<style>${cssContent}</style>`);
                htmlAsset.source = htmlSource;
                console.log(`[inline-css-plugin] Successfully inlined ${cssKey} into ${htmlKey}`);

                // Remove the CSS asset from the bundle so it's not written to disk
                delete bundle[cssKey];
              }
            }
          });
        }
      });
    },
  };
}

// Custom plugin to prevent Analog's content plugin from crashing on Vite virtual modules (e.g. HMR or CSS proxies with null bytes)
function safeAnalogVirtualModulesPlugin() {
  return {
    name: 'safe-analog-virtual-modules',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (id.startsWith('\x00') && (id.includes('analog-content-list=true') || id.includes('analog-content-file=true'))) {
        const safeId = id
          .replace('analog-content-list=true', 'analog-content-list-stale=true')
          .replace('analog-content-file=true', 'analog-content-file-stale=true');
        return safeId;
      }
      return null;
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base,
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    safeAnalogVirtualModulesPlugin(),
      analog({
      content: {
        highlighter: 'prism',
      },
      prerender: {
        routes: [
          '/',
          '/about',
          '/resume',
          {
            contentDir: 'src/content/projects',
            transform: (file: { name: string }) => `/projects/${file.name.replace('.md', '')}`,
          },
        ],
        sitemap: {
          host: 'https://yolandasantacruz.com',
        },
      },
      nitro: {
        routeRules: {
          '/assets/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
          '/images/**': { headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' } },
          '/favicon.ico': { headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' } },
          '/favicon-*.png': { headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' } },
          '/apple-touch-icon.png': { headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' } },
          '/android-chrome-*.png': { headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' } },
          '/sw.js': { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } },
          '/**': { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
        },
        hooks: {
          'prerender:generate'(route) {
            if (route.fileName?.endsWith('.html') && route.contents) {
              route.contents = route.contents.replace(
                /(<style[^>]*>)([\s\S]*?)(<\/style>)/gi,
                (match, openTag, cssContent, closeTag) => {
                  try {
                    return openTag + minifyCss(cssContent) + closeTag;
                  } catch (err) {
                    console.error(`[minify-css] Error minifying styles in ${route.fileName}:`, err);
                    return match;
                  }
                }
              );
            }
          }
        }
      }
    }),
    inlineCssPlugin(),
    ...clientPwa(VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        navigateFallback: undefined,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/images\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      manifest: {
        name: 'Yolanda Santa Cruz - Product Design Portfolio',
        short_name: 'YSC Portfolio',
        description: 'Professional portfolio of Yolanda Santa Cruz, Product Designer.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: base,
        start_url: base,
        icons: [
          { src: 'android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'android-chrome-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'android-chrome-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    })),
    {
      name: 'transform-base-href',
      transformIndexHtml(html) {
        return html
          .replace('<base href="/" />', `<base href="${base}" />`)
          .replace('<base href="/"', `<base href="${base}"`);
      }
    }
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
    server: {
      deps: {
        inline: [/@analogjs\/content/]
      }
    }
  },
}));
