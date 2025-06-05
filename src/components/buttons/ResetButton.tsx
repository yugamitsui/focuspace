"use client";

import { ArrowClockwiseIcon } from "@phosphor-icons/react";

type ResetButtonProps = {
  onClick: () => void;
};

export default function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:text-white transition-colors duration-500 cursor-pointer"
      aria-label="Reset Timer"
    >
      <ArrowClockwiseIcon size={32} />
    </button>
  );
}
