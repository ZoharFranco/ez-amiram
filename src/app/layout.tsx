'use client';

import AuthDialog from '@/frontend/components/AuthDialog';
import { LanguageProvider } from '@/frontend/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/frontend/contexts/auth-context';
import { Rubik } from 'next/font/google';
import { useEffect, useState, useRef } from 'react';
import './globals.css';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setShowDialog(!loading && !user);
  }, [user, loading]);

  // Remove background from here, let the canvas be the background
  return (
    <>
      <div style={{ minHeight: '100vh', width: '100%' }}>
        {children}
      </div>
      <AuthDialog isOpen={showDialog} onClose={() => { }} forceMode />
    </>
  );
}

// Enhanced, more robust and visually stronger particles background
function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    function checkDesktop() {
      setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 1024);
    }
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Stronger: More particles, more vivid colors, more dynamic movement
    const PARTICLE_COUNT = 64;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      color: string;
    }[] = [];

    const colors = [
      '#10b981', // emerald-500
      '#059669', // emerald-600
      '#34d399', // emerald-400
      '#22d3ee', // cyan-400
      '#2563eb', // blue-600
    ];

    function randomBetween(a: number, b: number) {
      return a + Math.random() * (b - a);
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: randomBetween(0, width),
          y: randomBetween(0, height),
          vx: randomBetween(-0.5, 0.5),
          vy: randomBetween(-0.5, 0.5),
          radius: randomBetween(1.5, 3.5),
          opacity: 1, // FULLY OPAQUE
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Draw lines between close particles, stronger color and glow
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.save();
            ctx.globalAlpha = 1; // FULLY OPAQUE
            ctx.strokeStyle = particles[i].color;
            ctx.shadowColor = particles[j].color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      // Draw particles, stronger color and glow
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = 1; // FULLY OPAQUE
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }
    }

    function animate() {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Stronger: Bounce off edges with more energy
        if (p.x < 0) { p.x = 0; p.vx *= -1.05; }
        if (p.x > width) { p.x = width; p.vx *= -1.05; }
        if (p.y < 0) { p.y = 0; p.vy *= -1.05; }
        if (p.y > height) { p.y = height; p.vy *= -1.05; }
      }
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
      initParticles();
    }

    initParticles();
    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, [isDesktop]);

  if (!isDesktop) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Make sure canvas is at the background
        pointerEvents: 'none',
        background: '#fff',
        transition: 'background 0.5s',
      }}
      aria-hidden="true"
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he">
      <head>
        <title>
          לימודי אנגלית למבחן פסיכומטרי\אמירם
        </title>
        <meta name="description" content="התחזק באנגלית לפסיכומטרי או אמירם עם תרגול חכם, מעקב התקדמות, וממשק עוצמתי." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={rubik.className}
        style={{
          position: 'relative',
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #f0fdfa 0%, #d1fae5 100%)',
          overflow: 'hidden', // Prevent scrollbars from canvas
        }}
      >
        <ParticlesBackground />
        <AuthProvider>
          <LanguageProvider>
            <AuthGate>
              {children}
            </AuthGate>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
