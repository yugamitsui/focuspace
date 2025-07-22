"use client";

import { formatTime } from "@/lib/formatTime";
import AudioVisualizer from "./AudioVisualizer";
import MuteButton from "./buttons/MuteButton";
import PlayPauseButton from "./buttons/PlayPauseButton";
import ResetButton from "./buttons/ResetButton";
import TimerDurationSelector from "./selectors/TimerDurationSelector";

type TimerProps = {
  currentId: string;
  timeLeft: number;
  isRunning: boolean;
  hasStarted: boolean;
  onSelect: (id: string) => void;
  toggle: () => void;
  reset: () => void;
};

export default function Timer({
  currentId,
  timeLeft,
  isRunning,
  hasStarted,
  onSelect,
  toggle,
  reset,
}: TimerProps) {
  return (
    <div className="flex flex-col items-center gap-16">
      <TimerDurationSelector
        current={currentId}
        onSelect={onSelect}
        hasStarted={hasStarted}
      />

      <div className="flex flex-col items-center justify-center gap-10">
        <p className="text-white font-medium text-8xl">
          {formatTime(timeLeft)}
        </p>
        <AudioVisualizer />
      </div>

      <div className="px-6 py-2 rounded-full flex items-center justify-center gap-2 bg-black/50">
        <MuteButton />
        <PlayPauseButton isRunning={isRunning} onClick={toggle} />
        <ResetButton onClick={reset} />
      </div>
    </div>
  );
}
