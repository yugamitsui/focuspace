export type Mode = "25-5" | "52-17" | "112-26";

export const DURATIONS: Record<Mode, { work: number; break: number }> = {
  "25-5": { work: 25 * 60, break: 5 * 60 },
  "52-17": { work: 52 * 60, break: 17 * 60 },
  "112-26": { work: 112 * 60, break: 26 * 60 },
};

export const getDurations = (mode: Mode) => DURATIONS[mode];
