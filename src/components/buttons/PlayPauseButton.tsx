"use client";

import { Play, Pause } from "phosphor-react";

type PlayPauseButtonProps = {
  isRunning: boolean;
  onClick: () => void;
};

export default function PlayPauseButton({
  isRunning,
  onClick,
}: PlayPauseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:text-white transition-colors duration-500 cursor-pointer"
      aria-label={isRunning ? "Pause Timer" : "Start Timer"}
    >
      {isRunning ? <Pause size={32} /> : <Play size={32} />}
    </button>
  );
}
