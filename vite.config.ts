/// <reference types="vitest" />
// Triggering config reload to clear Analog content cache - 2026-05-16T21:33:35

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { VitePWA } from 'vite-plugin-pwa';

// Normalizing base path for production builds (e.g., GitHub Pages subpaths)
let base = process.env['VITE_BASE_URL'] || '/';
if (!base.startsWith('/')) {
  base = '/' + base;
}
if (!base.endsWith('/')) {
  base = base + '/';
}

// Wrapper to ensure VitePWA only runs in the client environment (Vite 6/8 Environment API compatibility)
function clientPwa(options: any) {
  const res = VitePWA(options);
  const plugins = Array.isArray(res) ? res : [res];
  return plugins.map((plugin) => {
    if (!plugin) return plugin;
    const wrapped: any = { ...plugin };

    const configResolved = plugin.configResolved;
    if (configResolved) {
      wrapped.configResolved = async function (config: any) {
        if (config.build?.ssr) {
          // Bypassing SSR to keep shared ctx.viteConfig pointed to the client config
          return;
        }
        return await configResolved.call(this, config);
      };
    }

    const generateBundle = plugin.generateBundle;
    if (generateBundle) {
      wrapped.generateBundle = async function (this: any, options: any, bundle: any, isWrite: any) {
        if (this.environment?.config?.build?.ssr) {
          return;
        }
        return await generateBundle.call(this, options, bundle, isWrite);
      };
    }

    if (plugin.closeBundle) {
      const handler = typeof plugin.closeBundle === 'function' ? plugin.closeBundle : (plugin.closeBundle as any).handler;
      const order = typeof plugin.closeBundle === 'object' ? (plugin.closeBundle as any).order : undefined;
      const sequential = typeof plugin.closeBundle === 'object' ? (plugin.closeBundle as any).sequential : undefined;

      wrapped.closeBundle = {
        order,
        sequential,
        async handler(this: any, error: any) {
          if (this.environment?.config?.build?.ssr) {
            return;
          }
          return await handler.call(this, error);
        }
      };
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
    analog({
      content: {
        highlighter: 'prism',
      },
      prerender: {
        routes: [
          '/',
          '/projects',
          {
            contentDir: 'src/content/projects',
            transform: (file: { name: string }) => `/projects/${file.name.replace('.md', '')}`,
          },
        ],
      },
      nitro: {
        routeRules: {
          '/assets/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
          '/images/**': { headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' } },
          '/favicon.ico': { headers: { 'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' } }
        }
      }
    }),
    ...clientPwa({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      manifest: {
        name: 'Yolanda Santa Cruz - Portfolio',
        short_name: 'Yolanda SC',
        description: 'Professional portfolio of Yolanda Santa Cruz, Web Designer & Developer',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: base,
        start_url: base,
        icons: [
          {
            src: 'favicon.ico',
            sizes: '32x32',
            type: 'image/x-icon'
          }
        ]
      }
    }),
    inlineCssPlugin(),
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
