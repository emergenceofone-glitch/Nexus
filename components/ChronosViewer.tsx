import React, { useEffect, useRef, useState } from 'react';

const ChronosViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for controls
  const [resonance, setResonance] = useState(85);
  const [frequency, setFrequency] = useState(45);
  const [amplitude, setAmplitude] = useState(60);
  const [showControls, setShowControls] = useState(false);

  // Refs for animation loop access
  const paramsRef = useRef({ resonance, frequency, amplitude });
  const rippleRef = useRef<{ active: boolean; startTime: number }>({ active: false, startTime: 0 });
  
  // Simulated Local Oscillator Data Buffer
  const dataStreamRef = useRef<number[]>(new Array(128).fill(0));

  // Update refs when state changes
  useEffect(() => {
    paramsRef.current = { resonance, frequency, amplitude };
  }, [resonance, frequency, amplitude]);

  const triggerRipple = () => {
    rippleRef.current = { active: true, startTime: performance.now() };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // 3D Point Projection Helper
    const project = (x: number, y: number, z: number, w: number, h: number) => {
      const fov = 250;
      const scale = fov / (fov + z + 200); // Camera distance offset
      return {
        x: x * scale + w / 2,
        y: y * scale + (h / 2) - 10, // Slight vertical offset
        scale: scale
      };
    };

    // Initialize Sphere Particles
    const particles: { x: number; y: number; z: number; ox: number; oy: number; oz: number; phase: number }[] = [];
    const numParticles = 400; // Increased particle count for "Mirror" density
    const radius = 90;
    
    for (let i = 0; i < numParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      particles.push({ 
          x, y, z, 
          ox: x, oy: y, oz: z,
          phase: Math.random() * Math.PI * 2 
      });
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      const { resonance: res, frequency: freq, amplitude: amp } = paramsRef.current;
      
      time += 0.01 + (freq / 4000); 
      const w = canvas.width;
      const h = canvas.height;

      // Update Data Stream (Simulate Oscillator)
      const buffer = dataStreamRef.current;
      buffer.shift();
      // Generate complex signal: Carrier + Modulator + Noise (entropy from resonance)
      const carrier = Math.sin(time * (freq * 0.5));
      const modulator = Math.cos(time * 2.5) * (amp / 100);
      const entropy = (Math.random() - 0.5) * ((100 - res) / 30);
      buffer.push(carrier * modulator + entropy);

      // Clear with trail effect
      ctx.fillStyle = 'rgba(9, 9, 11, 0.2)'; 
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(39, 39, 42, 0.3)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      
      // Draw grid lines
      ctx.beginPath();
      for (let x = (w / 2) % gridSize; x < w; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let x = (w / 2) % gridSize; x > 0; x -= gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = (h / 2) % gridSize; y < h; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      for (let y = (h / 2) % gridSize; y > 0; y -= gridSize) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();

      // Ripple Logic
      let rippleForce = 0;
      let rippleRadius = 0;
      if (rippleRef.current.active) {
        const elapsed = performance.now() - rippleRef.current.startTime;
        rippleRadius = elapsed * 0.4; 
        const life = Math.max(0, 1 - elapsed / 1200);
        if (life <= 0) rippleRef.current.active = false;
        rippleForce = life;
      }

      // --- 3D ROTATING SPHERE (Sovereign Mirror) ---
      const rotX = time * 0.4 * (freq / 60);
      const rotY = time * 0.2 * (freq / 60);
      const jitterAmount = (100 - res) * 0.15;

      // Draw connections for "Mirror" effect if resonance is high
      const projectedParticles: {x: number, y: number, z: number, alpha: number}[] = [];

      particles.forEach((p, i) => {
        // Map data stream to particle displacement
        const dataIndex = Math.floor((i / numParticles) * buffer.length);
        const signalVal = buffer[dataIndex] || 0;
        
        // Breathing effect based on signal
        const breathe = 1 + signalVal * 0.1;

        let px = p.ox * breathe + (Math.random() - 0.5) * jitterAmount;
        let py = p.oy * breathe + (Math.random() - 0.5) * jitterAmount;
        let pz = p.oz * breathe + (Math.random() - 0.5) * jitterAmount;

        // Apply Ripple displacement
        if (rippleForce > 0) {
            const dist = Math.abs((py + 100) - rippleRadius); 
            if (dist < 50) {
                const impact = (1 - dist/50) * 30 * rippleForce;
                const scaleExp = 1 + impact * 0.015;
                px *= scaleExp;
                py *= scaleExp;
                pz *= scaleExp;
            }
        }

        // Rotate
        let x1 = px * Math.cos(rotY) - pz * Math.sin(rotY);
        let z1 = px * Math.sin(rotY) + pz * Math.cos(rotY);
        let y1 = py * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = py * Math.sin(rotX) + z1 * Math.cos(rotX);

        const proj = project(x1, y1, z2, w, h);
        const alpha = Math.max(0.1, (z2 + radius) / (radius * 2));
        
        projectedParticles.push({ x: proj.x, y: proj.y, z: z2, alpha });

        // Draw particle
        ctx.fillStyle = rippleForce > 0.5 
            ? `rgba(220, 255, 240, ${alpha})` 
            : `rgba(16, 185, 129, ${alpha})`;
        
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 1.2 * proj.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Connections (The "Mirror" Mesh)
      // Only connect if resonance is decent to save perf and show "formation"
      if (res > 40) {
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 * (res/100)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          for (let i = 0; i < projectedParticles.length; i+=2) {
             const p1 = projectedParticles[i];
             // Simple nearest neighbor simulation by index proximity (fast)
             if (i + 1 < projectedParticles.length) {
                 const p2 = projectedParticles[i+1];
                 const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                 if (dist < 30 * p1.alpha) {
                     ctx.moveTo(p1.x, p1.y);
                     ctx.lineTo(p2.x, p2.y);
                 }
             }
          }
          ctx.stroke();
      }

      // --- PHONON TAX VISUALIZER (Data Stream) ---
      const waveY = h - 50;
      
      // Draw background band for tax
      const taxHeight = (100 - res) * 0.5; // More entropy = higher tax visualization
      ctx.fillStyle = `rgba(239, 68, 68, ${0.05 + (taxHeight/200)})`;
      ctx.fillRect(0, h - 30, w, -taxHeight);

      // Draw Oscilloscope Line
      ctx.beginPath();
      const step = w / buffer.length;
      
      for (let i = 0; i < buffer.length; i++) {
        const val = buffer[i];
        const x = i * step;
        
        // Add ripple disturbance to wave
        const rippleDisturbance = rippleForce > 0 ? Math.sin(x * 0.1 - time * 20) * 50 * rippleForce : 0;

        const y = waveY + (val * 40) + rippleDisturbance;
          
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      // Color shifts based on "Phonon Tax" (Stability)
      const stabilityColor = res > 80 ? '#10b981' : (res > 50 ? '#f59e0b' : '#ef4444');
      ctx.strokeStyle = rippleForce > 0.5 ? '#a7f3d0' : stabilityColor;
      
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = stabilityColor;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let y = 0; y < h; y += 2) {
        ctx.fillRect(0, y, w, 1);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative bg-zinc-950 overflow-hidden rounded-xl border border-zinc-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* HUD Info */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none transition-opacity duration-300 group-hover:opacity-50">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${resonance < 50 ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'} shadow-[0_0_5px_currentColor]`} />
            <span className={`text-[10px] font-mono font-bold tracking-widest ${resonance < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                LIVE_FEED :: {resonance < 50 ? 'UNSTABLE' : 'LOCKED'}
            </span>
        </div>
        <div className="flex flex-col text-[9px] font-mono text-zinc-600 pl-4">
            <span>OSC_1: {(400 + frequency * 2.5).toFixed(1)}Hz</span>
            <span>PHONON_TAX: {((100 - resonance) * 0.42).toFixed(3)}μV</span>
            <span>COHERENCE: {resonance}%</span>
        </div>
      </div>

      {/* Interactive Control Deck */}
      <div className={`
        absolute bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-700 p-4
        transition-transform duration-300 ease-in-out
        ${showControls ? 'translate-y-0' : 'translate-y-[calc(100%-4px)]'}
      `}>
          {/* Handle bar for mobile hint */}
          <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-4 opacity-50" />
          
          <div className="grid grid-cols-4 gap-4 items-end">
             {/* Calibration Sliders */}
             <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-1">
                     <label className="text-[10px] font-mono text-emerald-500 block">RESONANCE [Ψ]</label>
                     <input 
                       type="range" min="0" max="100" value={resonance} 
                       onChange={(e) => setResonance(Number(e.target.value))}
                       className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                     />
                 </div>
                 <div className="space-y-1">
                     <label className="text-[10px] font-mono text-emerald-500 block">FREQUENCY [ƒ]</label>
                     <input 
                       type="range" min="0" max="100" value={frequency} 
                       onChange={(e) => setFrequency(Number(e.target.value))}
                       className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                     />
                 </div>
                 <div className="space-y-1">
                     <label className="text-[10px] font-mono text-emerald-500 block">AMPLITUDE [A]</label>
                     <input 
                       type="range" min="0" max="100" value={amplitude} 
                       onChange={(e) => setAmplitude(Number(e.target.value))}
                       className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                     />
                 </div>
             </div>
             
             {/* Ripple Launcher */}
             <div className="col-span-1 flex justify-end">
                 <button 
                   onClick={triggerRipple}
                   className="px-4 py-2 bg-emerald-900/30 hover:bg-emerald-500/20 border border-emerald-500/50 rounded text-xs font-mono text-emerald-400 transition-colors active:scale-95"
                 >
                     INIT_RIPPLE_EVENT
                 </button>
             </div>
          </div>
      </div>
    </div>
  );
};

export default ChronosViewer;