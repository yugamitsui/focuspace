"use client";

import { Play, Pause, ArrowClockwise } from "phosphor-react";
import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/formatTime";

export default function Timer() {
  const { mode, timeLeft, isRunning, changeMode, toggle, reset, modes } =
    useTimer();

  return (
    <div className="flex flex-col items-center justify-center gap-16">
      <div className="flex gap-4">
        {modes.map((label) => (
          <button
            key={label}
            onClick={() => changeMode(label)}
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
          onClick={toggle}
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
          onClick={reset}
          className="p-2 transition-colors hover:text-gray-500 cursor-pointer"
          aria-label="Reset Timer"
        >
          <ArrowClockwise size={32} weight="bold" />
        </button>
      </div>
    </div>
  );
}
