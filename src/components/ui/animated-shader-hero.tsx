import React, { useRef, useEffect } from 'react';

// Types for component props
export interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
  className?: string;
}

// Reusable Shader Background Hook
const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const rendererRef = useRef<any>(null);
  const pointersRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // WebGL Renderer class
    class WebGLRenderer {
      private canvas: HTMLCanvasElement;
      private gl: WebGL2RenderingContext;
      private program: WebGLProgram | null = null;
      private vs: WebGLShader | null = null;
      private fs: WebGLShader | null = null;
      private buffer: WebGLBuffer | null = null;
      private scale: number;
      private shaderSource: string;
      private mouseMove = [0, 0];
      private mouseCoords = [0, 0];
      private pointerCoords = [0, 0];
      private nbrOfPointers = 0;

      private vertexSrc = `#version 300 es
  precision highp float;
  in vec4 position;
  void main(){gl_Position=position;}`;

      private vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

      constructor(canvas: HTMLCanvasElement, scale: number) {
        this.canvas = canvas;
        this.scale = scale;
        this.gl = canvas.getContext('webgl2')!;
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.shaderSource = defaultShaderSource;
      }

      updateShader(source: string) {
        this.reset();
        this.shaderSource = source;
        this.setup();
        this.init();
      }

      updateMove(deltas: number[]) {
        this.mouseMove = deltas;
      }

      updateMouse(coords: number[]) {
        this.mouseCoords = coords;
      }

      updatePointerCoords(coords: number[]) {
        this.pointerCoords = coords;
      }

      updatePointerCount(nbr: number) {
        this.nbrOfPointers = nbr;
      }

      updateScale(scale: number) {
        this.scale = scale;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      }

      compile(shader: WebGLShader, source: string) {
        const gl = this.gl;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const error = gl.getShaderInfoLog(shader);
          console.error('Shader compilation error:', error);
        }
      }

      test(source: string) {
        let result = null;
        const gl = this.gl;
        const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          result = gl.getShaderInfoLog(shader);
        }
        gl.deleteShader(shader);
        return result;
      }

      reset() {
        const gl = this.gl;
        if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
          if (this.vs) {
            gl.detachShader(this.program, this.vs);
            gl.deleteShader(this.vs);
          }
          if (this.fs) {
            gl.detachShader(this.program, this.fs);
            gl.deleteShader(this.fs);
          }
          gl.deleteProgram(this.program);
        }
      }

      setup() {
        const gl = this.gl;
        this.vs = gl.createShader(gl.VERTEX_SHADER)!;
        this.fs = gl.createShader(gl.FRAGMENT_SHADER)!;
        this.compile(this.vs, this.vertexSrc);
        this.compile(this.fs, this.shaderSource);
        this.program = gl.createProgram()!;
        gl.attachShader(this.program, this.vs);
        gl.attachShader(this.program, this.fs);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
          console.error(gl.getProgramInfoLog(this.program));
        }
      }

      init() {
        const gl = this.gl;
        const program = this.program!;
        
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        const position = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

        (program as any).resolution = gl.getUniformLocation(program, 'resolution');
        (program as any).time = gl.getUniformLocation(program, 'time');
        (program as any).move = gl.getUniformLocation(program, 'move');
        (program as any).touch = gl.getUniformLocation(program, 'touch');
        (program as any).pointerCount = gl.getUniformLocation(program, 'pointerCount');
        (program as any).pointers = gl.getUniformLocation(program, 'pointers');
      }

      render(now = 0) {
        const gl = this.gl;
        const program = this.program;
        
        if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        
        gl.uniform2f((program as any).resolution, this.canvas.width, this.canvas.height);
        gl.uniform1f((program as any).time, now * 1e-3);
        gl.uniform2f((program as any).move, ...this.mouseMove);
        gl.uniform2f((program as any).touch, ...this.mouseCoords);
        gl.uniform1i((program as any).pointerCount, this.nbrOfPointers);
        gl.uniform2fv((program as any).pointers, this.pointerCoords);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }

    // Pointer Handler class
    class PointerHandler {
      private scale: number;
      private active = false;
      private pointers = new Map<number, number[]>();
      private lastCoords = [0, 0];
      private moves = [0, 0];

      constructor(element: HTMLCanvasElement, scale: number) {
        this.scale = scale;
        
        const map = (element: HTMLCanvasElement, scale: number, x: number, y: number) => 
          [x * scale, element.height - y * scale];

        element.addEventListener('pointerdown', (e) => {
          this.active = true;
          this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
        });

        element.addEventListener('pointerup', (e) => {
          if (this.count === 1) {
            this.lastCoords = this.first;
          }
          this.pointers.delete(e.pointerId);
          this.active = this.pointers.size > 0;
        });

        element.addEventListener('pointerleave', (e) => {
          if (this.count === 1) {
            this.lastCoords = this.first;
          }
          this.pointers.delete(e.pointerId);
          this.active = this.pointers.size > 0;
        });

        element.addEventListener('pointermove', (e) => {
          if (!this.active) return;
          this.lastCoords = [e.clientX, e.clientY];
          this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
          this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
        });
      }

      getScale() {
        return this.scale;
      }

      updateScale(scale: number) {
        this.scale = scale;
      }

      get count() {
        return this.pointers.size;
      }

      get move() {
        return this.moves;
      }

      get coords() {
        return this.pointers.size > 0 
          ? Array.from(this.pointers.values()).flat() 
          : [0, 0];
      }

      get first() {
        return this.pointers.values().next().value || this.lastCoords;
      }
    }

    const canvas = canvasRef.current;
    // Capping DPR to max 0.8 ensures buttery smooth 60fps on vercel deployments even on weak mobile GPUs
    const dpr = Math.min(0.8, window.devicePixelRatio * 0.7);
    
    rendererRef.current = new WebGLRenderer(canvas, dpr);
    pointersRef.current = new PointerHandler(canvas, dpr);
    
    rendererRef.current.setup();
    rendererRef.current.init();

    const resize = () => {
      const dpr = Math.min(0.8, window.devicePixelRatio * 0.7);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      if (rendererRef.current) {
        rendererRef.current.updateScale(dpr);
      }
    };
    
    resize();
    
    if (rendererRef.current.test(defaultShaderSource) === null) {
      rendererRef.current.updateShader(defaultShaderSource);
    }
    
    const loop = (now: number) => {
      if (!rendererRef.current || !pointersRef.current) return;
      
      rendererRef.current.updateMouse(pointersRef.current.first);
      rendererRef.current.updatePointerCount(pointersRef.current.count);
      rendererRef.current.updatePointerCoords(pointersRef.current.coords);
      rendererRef.current.updateMove(pointersRef.current.move);
      rendererRef.current.render(now);
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop(0);
    
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.reset();
      }
    };
  }, []);

  return canvasRef;
};

// Reusable Hero Component
export const AnimatedShaderHero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = ""
}) => {
  const canvasRef = useShaderBackground();

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain touch-none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'black', objectFit: 'cover' }}
      />
      
      {/* Hero Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white" style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Trust Badge */}
        {trustBadge && (
          <div className="mb-6 animate-fade-in-down" style={{ marginBottom: '1.5rem' }}>
            <div 
              className="inline-flex items-center gap-2.5" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '8px 20px', 
                background: 'rgba(15, 23, 60, 0.65)', 
                backdropFilter: 'blur(12px)', 
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(0, 245, 255, 0.35)', 
                borderRadius: '9999px', 
                fontSize: '0.85rem',
                color: '#e0f2fe',
                fontFamily: 'var(--font-mono)',
                boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)'
              }}
            >
              <span 
                className="trust-badge-dot" 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: '#00F5FF', 
                  boxShadow: '0 0 10px #00F5FF', 
                  display: 'inline-block',
                  animation: 'trust-dot-blink 1.4s ease-in-out infinite',
                  flexShrink: 0
                }}
              ></span>
              <span style={{ fontWeight: 500 }}>{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="text-center max-w-5xl mx-auto px-4" style={{ textAlign: 'center', maxWidth: '64rem', padding: '0 1rem' }}>
          {/* Main Heading with Animation */}
          <div 
            className="flex flex-wrap justify-center items-center" 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              alignItems: 'center', 
              columnGap: '1rem', 
              rowGap: '0.25rem',
              width: '100%' 
            }}
          >
            <h1 
              className="animate-fade-in-up animation-delay-200" 
              style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 7.5vw, 5.2rem)', 
                lineHeight: '1.12', 
                fontWeight: 800, 
                letterSpacing: '-0.02em',
                color: '#ffffff', 
                animationFillMode: 'forwards',
                margin: 0
              }}
            >
              {headline.line1}
            </h1>
            <h1 
              className="animate-fade-in-up animation-delay-400" 
              style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 7.5vw, 5.2rem)', 
                lineHeight: '1.12', 
                fontWeight: 800, 
                letterSpacing: '-0.02em',
                color: 'var(--accent-blue-light)', 
                animationFillMode: 'forwards',
                margin: 0
              }}
            >
              {headline.line2}
            </h1>
          </div>
          
          {/* Subtitle with Animation */}
          <div className="max-w-3xl mx-auto animate-fade-in-up animation-delay-600" style={{ maxWidth: '48rem', margin: '1.5rem auto' }}>
            <p 
              style={{ 
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', 
                color: 'rgba(224, 242, 254, 0.92)', 
                fontWeight: 400, 
                lineHeight: 1.65 
              }}
            >
              {subtitle}
            </p>
          </div>
          
          {/* CTA Buttons with Animation */}
          {buttons && (
            <div 
              className="hero-cta-buttons animate-fade-in-up animation-delay-800" 
              style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '1rem', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginTop: '2.5rem' 
              }}
            >
              {buttons.primary && (
                <button 
                  onClick={buttons.primary.onClick}
                  className="transition-all duration-300 hover:scale-105"
                  style={{ 
                    padding: '0.9rem 2.2rem', 
                    background: 'var(--accent-blue)', 
                    color: '#ffffff', 
                    borderRadius: '9999px', 
                    fontWeight: 700, 
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem', 
                    letterSpacing: '0.5px',
                    border: 'none', 
                    cursor: 'pointer',
                    boxShadow: '0 0 25px rgba(37, 99, 235, 0.45)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {buttons.primary.text}
                </button>
              )}
              {buttons.secondary && (
                <button 
                  onClick={buttons.secondary.onClick}
                  className="transition-all duration-300 hover:scale-105"
                  style={{ 
                    padding: '0.9rem 2.2rem', 
                    background: 'rgba(15, 23, 60, 0.65)', 
                    border: '1px solid rgba(56, 189, 248, 0.35)', 
                    color: '#f8fafc', 
                    borderRadius: '9999px', 
                    fontWeight: 600, 
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem', 
                    letterSpacing: '0.5px',
                    cursor: 'pointer', 
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: '0 0 15px rgba(37, 99, 235, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {buttons.secondary.text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const defaultShaderSource = `#version 300 es
// Modified shader: blue theme mapping instead of orange/brown
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}

float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  // OPTIMIZATION: Reduced from 5 to 3 iterations
  for (int i=0; i<3; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}

float clouds(vec2 p) {
	float d=1., t=.0;
    // OPTIMIZATION: Reduced from 3. to 2. iterations
	for (float i=.0; i<2.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}

void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.5,-st.y));
	uv*=1.-.3*(sin(T*.2)*.5+.5);
    // OPTIMIZATION: Reduced main scatter from 12 to 7 rays
	for (float i=1.; i<7.; i++) {
		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
		vec2 p=uv;
		float d=length(p);
		// BOOSTED: Increased point light intensity from .00125 to .004 for larger light heads
		col+=.004/d*(cos(sin(i)*vec3(3,2,1))+1.); 
		float b=noise(i+p+bg*1.731);
		// BOOSTED: Increased tail intensity from .002 to .008, and thickness scale from .02 to .05
		col+=.008*b/length(max(p,vec2(b*p.x*.05,p.y)));
		// Changed mix color from orange/brown (bg*.25, bg*.137, bg*.05) to blue/cyan
		col=mix(col,vec3(bg*.05,bg*.15,bg*.35),d);
	}
	// Reduce background brightness structurally by multiplying final color by 0.35
	O=vec4(col * 0.35, 1.0);
}`;

export default AnimatedShaderHero;
