'use client';
import { useEffect, useRef } from 'react';

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Aurora blob configurations
    const blobs = [
      { x: 0.15, y: 0.2,  r: 0.45, rgb: [124, 92, 255], speed: 0.0007, phase: 0 },
      { x: 0.85, y: 0.25, r: 0.42, rgb: [91, 140, 255], speed: 0.0009, phase: 2 },
      { x: 0.5,  y: 0.65, r: 0.48, rgb: [168, 85, 247], speed: 0.0006, phase: 4 },
      { x: 0.25, y: 0.85, r: 0.38, rgb: [6, 182, 212],  speed: 0.0008, phase: 1 },
    ];

    // Floating particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      // Render glowing aurora blobs
      blobs.forEach((b) => {
        const x = W * (b.x + 0.1 * Math.sin(t * b.speed + b.phase));
        const y = H * (b.y + 0.08 * Math.cos(t * b.speed * 0.8 + b.phase));
        const radius = Math.min(W, H) * b.r;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, `rgba(${b.rgb.join(',')}, 0.11)`);
        grad.addColorStop(0.5, `rgba(${b.rgb.join(',')}, 0.04)`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Render stars/sparkles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(185, 167, 255, ${p.alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.y < 0) {
          p.y = H;
          p.x = Math.random() * W;
        }
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
      });

      t++;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
