import { Injectable, NgZone, inject } from '@angular/core';

export interface MouseTrailConfig {
  trailLength: number;
  physicsSpeed: number;
  physicsFriction: number;
}

const DEFAULT_CONFIG: MouseTrailConfig = {
  trailLength: 40,
  physicsSpeed: 0.82,
  physicsFriction: 0.54,
};

@Injectable({
  providedIn: 'root',
})
export class MouseTrailService {
  private ngZone = inject(NgZone);

  private canvas: HTMLCanvasElement | null = null;
  private config: MouseTrailConfig = DEFAULT_CONFIG;

  private gl: WebGL2RenderingContext | null = null;
  private rafId?: number;
  private targetX = 0;
  private targetY = 0;
  private lastX = 0;
  private lastY = 0;
  private velocity = 0;
  private startTime = 0;
  private pixelRatio = 1;
  private hasMouseMoved = false;

  private trail: { x: number; y: number }[] = [];
  private trailData: Float32Array = new Float32Array(0);

  private program: WebGLProgram | null = null;
  private uResolution: WebGLUniformLocation | null = null;
  private uTime: WebGLUniformLocation | null = null;
  private uVelocity: WebGLUniformLocation | null = null;
  private uTrail: WebGLUniformLocation | null = null;

  public init(canvas: HTMLCanvasElement, config: MouseTrailConfig = DEFAULT_CONFIG) {
    this.canvas = canvas;
    this.config = config;
    this.hasMouseMoved = false;
    this.targetX = 0;
    this.targetY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.velocity = 0;

    this.trail = Array.from({ length: this.config.trailLength }, () => ({ x: 0, y: 0 }));
    this.trailData = new Float32Array(this.config.trailLength * 2);

    this.gl = this.canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false });
    if (!this.gl) return;

    const gl = this.gl;
    const vsSource = this.getVertexShaderSource();
    const fsSource = this.getFragmentShaderSource();

    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return;

    this.program = gl.createProgram();
    if (!this.program) return;

    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(this.program));
      return;
    }

    gl.useProgram(this.program);

    this.setupBuffers(gl);
    this.setupUniforms(gl);

    this.startTime = performance.now();
    this.startAnimation();
  }

  public setMousePosition(x: number, y: number) {
    if (!this.hasMouseMoved) {
      this.hasMouseMoved = true;
      this.targetX = x;
      this.targetY = y;
      this.lastX = x;
      this.lastY = y;
      for (let i = 0; i < this.trail.length; i++) {
        const point = this.trail.at(i);
        if (point) {
          point.x = x;
          point.y = y;
        }
      }
    } else {
      this.targetX = x;
      this.targetY = y;
    }
  }

  public resize(width: number, height: number, pixelRatio: number) {
    if (!this.gl || !this.program || !this.canvas) return;

    this.pixelRatio = pixelRatio;
    const gl = this.gl;
    this.canvas.width = width * pixelRatio;
    this.canvas.height = height * pixelRatio;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.useProgram(this.program);
    gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height);
  }

  public destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    // Clean up WebGL resources if needed
    this.gl = null;
    this.canvas = null;
    this.program = null;
  }

  private startAnimation() {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.updatePhysics();
        this.render();
        this.rafId = requestAnimationFrame(animate);
      };
      animate();
    });
  }

  private updatePhysics() {
    // The head tracks the target
    const head = this.trail.at(0);
    if (head) {
      head.x += (this.targetX - head.x) * this.config.physicsSpeed;
      head.y += (this.targetY - head.y) * this.config.physicsSpeed;
    }

    // Follower segments
    for (let i = 1; i < this.config.trailLength; i++) {
      const prev = this.trail.at(i - 1);
      const curr = this.trail.at(i);
      if (prev && curr) {
        curr.x += (prev.x - curr.x) * this.config.physicsFriction;
        curr.y += (prev.y - curr.y) * this.config.physicsFriction;
      }
    }

    // Velocity calculation
    const currentHead = this.trail.at(0);
    if (currentHead) {
      const dx = currentHead.x - this.lastX;
      const dy = currentHead.y - this.lastY;
      const currentSpeed = Math.sqrt(dx * dx + dy * dy) / 10.0;
      this.velocity += (Math.min(currentSpeed, 1.0) - this.velocity) * 0.1;

      this.lastX = currentHead.x;
      this.lastY = currentHead.y;
    }
  }

  private render() {
    const gl = this.gl;
    if (!gl || !this.program || !this.canvas) return;

    const currentTime = (performance.now() - this.startTime) / 1000.0;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    // Update trail data for uniforms
    for (let i = 0; i < this.config.trailLength; i++) {
      const point = this.trail.at(i);
      if (point) {
        this.trailData[i * 2] = point.x / (this.canvas.width / this.pixelRatio);
        this.trailData[i * 2 + 1] = 1.0 - (point.y / (this.canvas.height / this.pixelRatio));
      }
    }

    gl.uniform1f(this.uTime, currentTime);
    gl.uniform1f(this.uVelocity, this.velocity);
    gl.uniform2fv(this.uTrail, this.trailData);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  private setupBuffers(gl: WebGL2RenderingContext) {
    if (!this.program) return;
    const positionAttributeLocation = gl.getAttribLocation(this.program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1,
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  }

  private setupUniforms(gl: WebGL2RenderingContext) {
    if (!this.program) return;
    this.uResolution = gl.getUniformLocation(this.program, 'u_resolution');
    this.uTime = gl.getUniformLocation(this.program, 'u_time');
    this.uVelocity = gl.getUniformLocation(this.program, 'u_velocity');
    this.uTrail = gl.getUniformLocation(this.program, 'u_trail');
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

  private getVertexShaderSource() {
    return `#version 300 es
      in vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
  }

  private getFragmentShaderSource() {
    return `#version 300 es
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_velocity;
      uniform vec2 u_trail[40];

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
        vec3 totalColor = vec3(0.0);
        
        float thickness = 12.0 - u_velocity * 7.0;

        vec3 c1 = vec3(0.37, 0.84, 0.80);
        vec3 c2 = vec3(0.56, 0.87, 0.68);
        vec3 c3 = vec3(0.96, 0.92, 0.55);
        vec3 c4 = vec3(0.97, 0.95, 0.80);

        vec2 baseOffset = vec2(noise(st * 3.0 + u_time * 1.5), noise(st * 3.0 - u_time * 1.5)) * 0.06 * u_velocity;

        for(int i = 0; i < 39; i++) {
            float t = float(i) / 38.0;
            
            vec2 p1 = u_trail[i];
            vec2 p2 = u_trail[i+1];
            p1.x *= aspect;
            p2.x *= aspect;
            
            vec2 stNoise = st + baseOffset * t;
            
            float d = sdSegment(stNoise, p1, p2);
            float sizeScale = mix(4.2, 8.5, t); 
            float pGlow = max(1.0 - d * sizeScale * thickness, 0.0);
            pGlow = pow(pGlow, 1.6); 
            pGlow *= mix(1.0, 0.0, pow(t, 1.8));
            
            vec3 segColor = mix(c1, c2, smoothstep(0.0, 0.60, t));
            segColor = mix(segColor, c3, smoothstep(0.60, 0.82, t));
            segColor = mix(segColor, c4, smoothstep(0.82, 1.00, t));

            totalColor += segColor * pGlow;
            glow += pGlow;
        }

        vec3 finalColor = glow > 0.0001 ? totalColor / glow : c1;
        glow = clamp(glow, 0.0, 1.0);
        float alpha = glow * min(u_velocity * 2.5, 1.0);

        outColor = vec4(finalColor, alpha);
      }
    `;
  }
}
