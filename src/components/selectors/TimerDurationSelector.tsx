"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { timerDurations } from "@/constants/timerDurations";
import { updateTimerDuration } from "@/lib/spaceSettings";

type TimerDurationSelectorProps = {
  current: string;
  onSelect: (id: string) => void;
};

export default function TimerDurationSelector({
  current,
  onSelect,
}: TimerDurationSelectorProps) {
  const user = useUser();

  const handleSelect = async (id: string) => {
    onSelect(id);
    if (user?.id) {
      try {
        await updateTimerDuration(user.id, id);
      } catch (err) {
        console.error("Failed to update timer duration:", err);
      }
    }
  };

  return (
    <div className="flex gap-4">
      {timerDurations.map((duration) => (
        <button
          key={duration.id}
          onClick={() => handleSelect(duration.id)}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            current === duration.id
              ? "bg-black text-white"
              : "bg-black/50 hover:bg-black hover:text-white duration-500 cursor-pointer"
          }`}
        >
          {duration.label}
        </button>
      ))}
    </div>
  );
}
