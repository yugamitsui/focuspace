"use client";

import type { Mode } from "@/lib/durations";

type ModeSelectorProps = {
  mode: Mode;
  modes: Mode[];
  changeMode: (mode: Mode) => void;
};

export default function ModeSelector({
  mode,
  modes,
  changeMode,
}: ModeSelectorProps) {
  return (
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
  );
}
