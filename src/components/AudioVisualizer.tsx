"use client";

import { useEffect, useRef } from "react";
import { Howler } from "howler";

type AudioVisualizerProps = {
  width?: number;
  height?: number;
  barCount?: number;
  gap?: number;
};

export default function AudioVisualizer({
  width = 196,
  height = 64,
  barCount = 20,
  gap = 4,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    const audioCtx = Howler.ctx;
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;

    Howler.masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const barWidth = (width - gap * (barCount - 1)) / barCount;
      const radius = barWidth / 2;
      const adjustedCenterX =
        barCount % 2 === 0 ? centerX + gap / 2 : centerX - barWidth / 2;
      const dataArray = dataArrayRef.current;

      const barPositions: number[] = [];
      let step = 0;

      while (barPositions.length < barCount) {
        const offset = (barWidth + gap) * Math.ceil(step / 2);
        const x =
          step % 2 === 0 ? adjustedCenterX + offset : adjustedCenterX - offset;
        barPositions.push(x);
        step++;
      }

      barPositions.forEach((x, i) => {
        const value = dataArray[i] ?? 0;
        const heightRatio = value / 255;
        const totalHeight = Math.max(barWidth, heightRatio * height);
        const halfBarHeight = totalHeight / 2;

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.roundRect(
          x,
          centerY - halfBarHeight,
          barWidth,
          totalHeight,
          radius
        );
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      analyser.disconnect();
    };
  }, [width, height, barCount, gap]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
