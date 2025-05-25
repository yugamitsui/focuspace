"use client";

import { useEffect, useState, useRef } from "react";
import { getDurations, Mode } from "@/lib/durations";
import { Play, Pause, ArrowClockwise } from "phosphor-react";

export default function Timer() {
  const [mode, setMode] = useState<Mode>("25-5");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          const nextIsBreak = !isBreak;
          const { work, break: breakTime } = getDurations(mode);
          setIsBreak(nextIsBreak);
          setTimeLeft(nextIsBreak ? breakTime : work);
          return nextIsBreak ? breakTime : work;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [isRunning, isBreak, mode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(timerRef.current!);
    } else {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    clearInterval(timerRef.current!);
    const { work, break: breakTime } = getDurations(mode);
    setTimeLeft(isBreak ? breakTime : work);
  };

  const handleModeChange = (selected: Mode) => {
    if (selected === mode) return;

    setIsRunning(false);
    clearInterval(timerRef.current!);
    setMode(selected);
    setIsBreak(false);
    const { work } = getDurations(selected);
    setTimeLeft(work);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-16">
      <div className="flex gap-4">
        {["25-5", "52-17", "112-26"].map((label) => (
          <button
            key={label}
            onClick={() => handleModeChange(label as Mode)}
            className={`px-6 py-2 rounded-full font-medium transition-colors shadow-lg ${
              mode === label
                ? "bg-gray-800 text-white"
                : "bg-white hover:bg-gray-100 cursor-pointer"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="font-medium text-8xl tracking-tight">
        {formatTime(timeLeft)}
      </div>

      <div className="px-6 py-2 rounded-full flex items-center justify-center gap-2 shadow-lg bg-white">
        <button
          onClick={handleToggle}
          className="p-2 transition-colors hover:text-gray-500 cursor-pointer"
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? (
            <Pause size={32} weight="bold" />
          ) : (
            <Play size={32} weight="bold" />
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2 transition-colors hover:text-gray-500 cursor-pointer"
          aria-label="Reset Timer"
        >
          <ArrowClockwise size={32} weight="bold" />
        </button>
      </div>
    </div>
  );
}
