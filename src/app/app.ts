import { ChangeDetectionStrategy, Component, ElementRef, HostListener, NgZone, OnDestroy, PLATFORM_ID, ViewChild, inject, afterNextRender } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'portfolio-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nitro-background">
      <!-- High-Performance WebGL2 Shader Canvas -->
      <canvas #shaderCanvas class="shader-canvas"></canvas>
    </div>

    <div class="content-wrapper">
      <router-outlet />
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      position: relative;
      background-color: #ffffff !important;
    }

    .nitro-background {
      position: fixed;
      inset: 0;
      z-index: 5;
      overflow: hidden;
      pointer-events: none;
      background: transparent !important;
    }

    .shader-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      mix-blend-mode: multiply;
      opacity: 0.72;
    }

    .content-wrapper {
      position: relative;
      z-index: 20;
    }
  `,
})
export class App implements OnDestroy {
  @ViewChild('shaderCanvas', { static: true }) shaderCanvas!: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private document = inject(DOCUMENT);
  private get window() { return this.document.defaultView; }

  // Interaction tracking
  private targetX = 0;
  private targetY = 0;
  private lastX = 0;
  private lastY = 0;
  private velocity = 0;

  private rafId?: number;
  private gl?: WebGL2RenderingContext | null;

  constructor() {
    afterNextRender(() => {
      this.initShader();
    });
  }

  private initShader() {
    const canvas = this.shaderCanvas?.nativeElement;
    const win = this.window;
    if (!canvas || !win) return;

    this.gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false });
    if (!this.gl) return;

    const gl = this.gl;

    // Vertex Shader (Full-screen Quad)
    const vsSource = `#version 300 es
      in vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader (Fluid Shooting Star)
    const fsSource = `#version 300 es
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_velocity;
      uniform vec2 u_trail[20];

      out vec4 outColor;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float sdSegment( vec2 p, vec2 a, vec2 b ) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp( dot(pa,ba)/max(dot(ba,ba), 0.0001), 0.0, 1.0 );
          return length( pa - ba*h );
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        st.x *= aspect;

        float glow = 0.0;
        
        // Make the entire trail thinner when moving fast
        float thickness = 1.0 + u_velocity * 4.0;

        for(int i = 0; i < 19; i++) {
            float t = float(i) / 18.0;
            
            vec2 p1 = u_trail[i];
            vec2 p2 = u_trail[i+1];
            p1.x *= aspect;
            p2.x *= aspect;
            
            // Add fluid turbulence that ripples down the tail
            vec2 offset = vec2(noise(st * 8.0 + u_time * 3.0 + t), noise(st * 8.0 - u_time * 3.0 + t)) * 0.05 * t;
            vec2 stNoise = st + offset * u_velocity;
            
            float d = sdSegment(stNoise, p1, p2);
            
            // Taper from head to tail - securely balanced for a fat ribbon
            float sizeScale = mix(4.6, 8.5, t); 
            
            // Calculate glow for this segment
            float pGlow = max(1.0 - d * sizeScale * thickness, 0.0);
            pGlow = pow(pGlow, 3.0); 
            
            // Fade opacity slower towards the tail to keep it thick and visible
            pGlow *= mix(1.0, 0.0, pow(t, 1.5));
            
            // Additive accumulation creates a seamless fluid body
            glow += pGlow;
        }

        glow = clamp(glow, 0.0, 1.0);
        
        // Hide when stationary with sharp ignition
        float alpha = glow * min(u_velocity * 2.0, 1.0);

        // Rich Dark Prism Palette optimized for CSS Multiply Blending on White BG
        vec3 deepCyan = vec3(0.0, 0.45, 0.75);
        vec3 deepPurple = vec3(0.25, 0.05, 0.85);
        vec3 deepPink = vec3(0.80, 0.05, 0.35);

        // Color flows along the screen and time
        vec3 color = mix(deepCyan, deepPurple, st.y);
        color = mix(color, deepPink, sin(u_time * 3.0 + st.x * 6.0) * 0.5 + 0.5);

        outColor = vec4(color, alpha);
      }
    `;

    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad Buffer
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uVelocity = gl.getUniformLocation(program, 'u_velocity');
    const uTrail = gl.getUniformLocation(program, 'u_trail');

    const resize = () => {
      canvas.width = win.innerWidth * win.devicePixelRatio;
      canvas.height = win.innerHeight * win.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    win.addEventListener('resize', resize);
    resize();

    // Initialize shooting star trail
    const trail = Array.from({ length: 20 }, () => ({ x: win.innerWidth / 2, y: win.innerHeight / 2 }));
    const trailData = new Float32Array(40);
    this.targetX = win.innerWidth / 2;
    this.targetY = win.innerHeight / 2;
    this.lastX = this.targetX;
    this.lastY = this.targetY;

    this.ngZone.runOutsideAngular(() => {
      const startTime = performance.now();

      const animate = () => {
        const currentTime = (performance.now() - startTime) / 1000.0;

        // The head perfectly tracks the mouse
        trail[0].x += (this.targetX - trail[0].x) * 0.35;
        trail[0].y += (this.targetY - trail[0].y) * 0.35;

        // Fluid snake physics: each segment pulls the next one
        for (let i = 1; i < 20; i++) {
          trail[i].x += (trail[i - 1].x - trail[i].x) * 0.45;
          trail[i].y += (trail[i - 1].y - trail[i].y) * 0.45;
        }

        // Calculate master velocity based on the head
        const dx = trail[0].x - this.lastX;
        const dy = trail[0].y - this.lastY;
        const currentSpeed = Math.sqrt(dx * dx + dy * dy) / 10.0; 
        this.velocity += (Math.min(currentSpeed, 1.0) - this.velocity) * 0.1;
        
        this.lastX = trail[0].x;
        this.lastY = trail[0].y;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Populate trail uniform data
        for (let i = 0; i < 20; i++) {
          trailData[i * 2] = trail[i].x / win.innerWidth;
          trailData[i * 2 + 1] = 1.0 - (trail[i].y / win.innerHeight); // WebGL Y invert
        }

        gl.uniform1f(uTime, currentTime);
        gl.uniform1f(uVelocity, this.velocity);
        gl.uniform2fv(uTrail, trailData);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        this.rafId = requestAnimationFrame(animate);
      };

      animate();
    });
  }

  private createShader(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
