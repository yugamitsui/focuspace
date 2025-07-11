"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";

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
      {isRunning ? <PauseIcon size={32} /> : <PlayIcon size={32} />}
    </button>
  );
}
