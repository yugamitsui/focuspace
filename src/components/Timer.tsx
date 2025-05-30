"use client";

import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/lib/formatTime";
import AudioVisualizer from "./AudioVisualizer";
import MuteButton from "./buttons/MuteButton";
import PlayPauseButton from "./buttons/PlayPauseButton";
import ResetButton from "./buttons/ResetButton";
import ModeSelector from "./selectors/ModeSelector";

export default function Timer() {
  const { mode, timeLeft, isRunning, changeMode, toggle, reset, modes } =
    useTimer();

  return (
    <div className="flex flex-col items-center justify-center gap-16">
      <ModeSelector mode={mode} modes={modes} changeMode={changeMode} />

      <div className="text-white font-medium text-8xl">
        {formatTime(timeLeft)}
      </div>

      <AudioVisualizer />

      <div className="px-6 py-2 rounded-full flex items-center justify-center gap-2 bg-black/50">
        <MuteButton />
        <PlayPauseButton isRunning={isRunning} onClick={toggle} />
        <ResetButton onClick={reset} />
      </div>
    </div>
  );
}
