import { useEffect, useRef, useState } from "react";
import { playBgmPlaylist, stopBgm } from "@/lib/bgmPlayer";
import { getDurations, Mode } from "@/lib/durations";
import { playTimerEndSe } from "@/lib/sePlayer";

export function useTimer(initialMode: Mode = "25-5", trackList: string[] = []) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [timeLeft, setTimeLeft] = useState(getDurations(initialMode).workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          playTimerEndSe();
          setIsBreak(!isBreak);
          const { workTime, breakTime } = getDurations(mode);
          return isBreak ? workTime : breakTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [isRunning, isBreak, mode]);

  const toggle = () => {
    setIsRunning((prev) => {
      if (prev) {
        clearInterval(timerRef.current!);
        stopBgm();
      } else {
        playBgmPlaylist(trackList);
      }
      return !prev;
    });
  };

  const reset = () => {
    setIsRunning(false);
    clearInterval(timerRef.current!);
    stopBgm();
    const { workTime, breakTime } = getDurations(mode);
    setTimeLeft(isBreak ? breakTime : workTime);
  };

  const changeMode = (newMode: Mode) => {
    if (newMode === mode) return;
    setIsRunning(false);
    clearInterval(timerRef.current!);
    stopBgm();
    setMode(newMode);
    setIsBreak(false);
    setTimeLeft(getDurations(newMode).workTime);
  };

  const modes: Mode[] = ["25-5", "52-17", "112-26"];

  return { mode, timeLeft, isRunning, changeMode, toggle, reset, modes };
}
