"use client";

import { useEffect, useRef, useState } from "react";
import { visualEffects } from "@/constants/visualEffects";
import { useUser } from "@supabase/auth-helpers-react";
import { updateVisualEffectId } from "@/lib/supabase/spaceSettings";

interface EffectSelectorProps {
  current: string;
  onSelect: (id: string) => void;
}

export default function EffectSelector({
  current,
  onSelect,
}: EffectSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = async (id: string) => {
    onSelect(id);
    if (user?.id) {
      try {
        await updateVisualEffectId(user.id, id);
      } catch (err) {
        console.error("Failed to update effect:", err);
      }
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-full transition-colors duration-500 cursor-pointer ${
          open
            ? "bg-black text-white"
            : "bg-black/50 hover:bg-black hover:text-white"
        }`}
        aria-label="Select visual effect"
      >
        {visualEffects.find((e) => e.id === current)?.icon}
      </button>

      {open && (
        <div className="fixed right-4 bottom-18 bg-black/50 rounded p-4 grid grid-cols-3 gap-2 z-50">
          {visualEffects.map((effect) => (
            <button
              key={effect.id}
              onClick={() => handleSelect(effect.id)}
              className={`flex flex-col items-center justify-center aspect-square p-4 rounded-full transition duration-500 ${
                effect.id === current
                  ? "bg-black text-white"
                  : "cursor-pointer hover:bg-black/50 hover:text-white/87.5"
              }`}
            >
              <div>{effect.icon}</div>
              <span className="text-xs text-white">{effect.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
