import { useEffect, useRef, useState } from "react";
import { getDurations, Mode } from "@/lib/durations";

export function useTimer(initialMode: Mode = "25-5") {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [timeLeft, setTimeLeft] = useState(getDurations(initialMode).work);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          const nextIsBreak = !isBreak;
          const { work, break: breakTime } = getDurations(mode);
          setIsBreak(nextIsBreak);
          setTimeLeft(nextIsBreak ? breakTime : work);
          return nextIsBreak ? breakTime : work;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [isRunning, isBreak, mode]);

  const toggle = () => {
    setIsRunning((prev) => {
      if (prev) clearInterval(timerRef.current!);
      return !prev;
    });
  };

  const reset = () => {
    setIsRunning(false);
    clearInterval(timerRef.current!);
    const { work, break: breakTime } = getDurations(mode);
    setTimeLeft(isBreak ? breakTime : work);
  };

  const changeMode = (newMode: Mode) => {
    if (newMode === mode) return;
    setIsRunning(false);
    clearInterval(timerRef.current!);
    setMode(newMode);
    setIsBreak(false);
    setTimeLeft(getDurations(newMode).work);
  };

  const modes: Mode[] = ["25-5", "52-17", "112-26"];

  return { mode, timeLeft, isRunning, changeMode, toggle, reset, modes };
}
