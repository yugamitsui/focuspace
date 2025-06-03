export type Mode = "25-5" | "52-17" | "112-26";

export const DURATIONS: Record<Mode, { workTime: number; breakTime: number }> =
  {
    "25-5": { workTime: 25 * 60, breakTime: 5 * 60 },
    "52-17": { workTime: 52 * 60, breakTime: 17 * 60 },
    "112-26": { workTime: 112 * 60, breakTime: 26 * 60 },
  };

export const getDurations = (mode: Mode) => DURATIONS[mode];
