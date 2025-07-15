"use client";

import { useEffect, useRef } from "react";

export default function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const snowflakeCount = 96;
    const snowflakes = Array.from({ length: snowflakeCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4 + 2,
      speedY: Math.random() * 0.6 + 0.4,
      driftX: Math.random() * 0.5 - 0.25,
      phase: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      snowflakes.forEach((flake) => {
        flake.y += flake.speedY;
        flake.x += flake.driftX + Math.sin(flake.phase) * 0.3;
        flake.phase += 0.01;

        if (flake.y > height) {
          flake.y = 0;
          flake.x = Math.random() * width;
        }
        if (flake.x > width) flake.x = 0;
        if (flake.x < 0) flake.x = width;

        ctx.beginPath();
        ctx.globalAlpha = flake.alpha;
        ctx.fillStyle = "#ffffff";
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10"
    />
  );
}
