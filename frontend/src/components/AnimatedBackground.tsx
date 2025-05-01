import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class SmokeParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      hue: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 150 + 100; // Increased size for more coverage
        this.speedX = (Math.random() - 0.5) * 1; // Reduced speed for more subtle movement
        this.speedY = -Math.random() * 1.5 - 0.5; // Slower upward movement
        this.opacity = Math.random() * 0.15 + 0.05; // Reduced opacity for softer look
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01; // Slower rotation
        this.hue = Math.random() * 40 + 210; // Slightly adjusted blue-purple range
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // More gentle wavering
        this.x += Math.sin(this.y * 0.005) * 0.3;

        // Slower fade out
        if (this.y < canvas.height * 0.7) {
          this.opacity -= 0.001;
        }

        if (this.opacity <= 0 || this.y < -this.size) {
          this.reset();
        }
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + this.size;
        this.opacity = Math.random() * 0.15 + 0.05;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size / 1.5);
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, ${this.opacity})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 70%, 50%, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 60%, 40%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles: SmokeParticle[] = [];
    const particleCount = 40; // Increased particle count

    for (let i = 0; i < particleCount; i++) {
      particles.push(new SmokeParticle());
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        '& canvas': {
          display: 'block',
          filter: 'blur(30px)',
        },
      }}
    >
      <canvas ref={canvasRef} />
    </Box>
  );
};

export default AnimatedBackground; 