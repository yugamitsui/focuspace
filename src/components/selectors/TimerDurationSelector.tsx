"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { timerDurations } from "@/constants/timerDurations";
import { updateTimerDurationId } from "@/lib/supabase/spaceSettings";

type TimerDurationSelectorProps = {
  current: string;
  onSelect: (id: string) => void;
  hasStarted: boolean;
};

export default function TimerDurationSelector({
  current,
  onSelect,
  hasStarted,
}: TimerDurationSelectorProps) {
  const user = useUser();

  const handleSelect = async (id: string) => {
    if (id === current) return;

    if (hasStarted) {
      const confirmed = confirm(
        "Changing time now will reset your progress. Do you want to proceed?"
      );
      if (!confirmed) return;
    }

    onSelect(id);
    if (user?.id) {
      try {
        await updateTimerDurationId(user.id, id);
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
          disabled={current === duration.id}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            current === duration.id
              ? "bg-black text-white cursor-default"
              : "bg-black/50 hover:bg-black hover:text-white duration-500 cursor-pointer"
          }`}
        >
          {duration.label}
        </button>
      ))}
    </div>
  );
}
