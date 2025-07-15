type TimerDuration = {
  id: string;
  label: string;
  focusTime: number;
  restTime: number;
};

export const timerDurations: TimerDuration[] = [
  {
    id: "default_25_5",
    label: "25-5",
    focusTime: 25 * 60,
    restTime: 5 * 60,
  },
  {
    id: "default_52_17",
    label: "52-17",
    focusTime: 52 * 60,
    restTime: 17 * 60,
  },
  {
    id: "default_112_26",
    label: "112-26",
    focusTime: 112 * 60,
    restTime: 26 * 60,
  },
];
