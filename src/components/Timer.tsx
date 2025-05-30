"use client";

import { Play, Pause, ArrowClockwise } from "phosphor-react";
import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/formatTime";
import AudioVisualizer from "./AudioVisualizer";
import MuteButton from "./MuteButton";

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
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              mode === label
                ? "bg-black text-white"
                : "bg-black/50 hover:bg-black hover:text-white duration-500 cursor-pointer"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="text-white font-medium text-8xl">
        {formatTime(timeLeft)}
      </div>

      <AudioVisualizer />

      <div className="px-6 py-2 rounded-full flex items-center justify-center gap-2 bg-black/50">
        <MuteButton />
        <button
          onClick={toggle}
          className="p-2 hover:text-white transition-colorss duration-500 cursor-pointer"
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button
          onClick={reset}
          className="p-2 hover:text-white transition-colors duration-500 cursor-pointer"
          aria-label="Reset Timer"
        >
          <ArrowClockwise size={32} />
        </button>
      </div>
    </div>
  );
}
