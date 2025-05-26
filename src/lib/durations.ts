export type Mode = "25-5" | "52-17" | "112-26";

export const DURATIONS: Record<Mode, { workTime: number; breakTime: number }> =
  {
    "25-5": { workTime: 5 * 1, breakTime: 4 * 1 },
    "52-17": { workTime: 6 * 1, breakTime: 5 * 1 },
    "112-26": { workTime: 7 * 1, breakTime: 6 * 1 },
  };

export const getDurations = (mode: Mode) => DURATIONS[mode];
