import { useEffect, useRef, useState, useMemo } from "react";
import { pauseBgm, playBgm, resumeBgm, stopBgm } from "@/lib/bgmPlayer";
import { playTimerEndSe } from "@/lib/sePlayer";
import { timerDurations } from "@/constants/timerDurations";

export function useTimer(durationId: string, getTrackList: () => string[]) {
  const [timeLeft, setTimeLeft] = useState(timerDurations[0].focusTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const duration = useMemo(() => {
    return timerDurations.find((d) => d.id === durationId) ?? timerDurations[0];
  }, [durationId]);

  useEffect(() => {
    clearInterval(timerRef.current!);
    stopBgm();
    setIsRunning(false);
    setIsResting(false);
    setTimeLeft(duration.focusTime);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          playTimerEndSe();
          setIsResting(!isResting);
          return isResting ? duration.focusTime : duration.restTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [isRunning, isResting, duration]);

  const hasStarted = useMemo(() => {
    return (
      isRunning ||
      isResting ||
      timeLeft < (isResting ? duration.restTime : duration.focusTime)
    );
  }, [isRunning, isResting, timeLeft, duration]);

  const toggle = () => {
    setIsRunning((prev) => {
      if (prev) {
        clearInterval(timerRef.current!);
        pauseBgm();
      } else {
        resumeBgm();
        if (!hasStarted) {
          playBgm(getTrackList());
        }
      }
      return !prev;
    });
  };

  const reset = () => {
    setIsRunning(false);
    clearInterval(timerRef.current!);
    stopBgm();
    setTimeLeft(isResting ? duration.restTime : duration.focusTime);
  };

  return {
    timeLeft,
    isRunning,
    isResting,
    hasStarted,
    toggle,
    reset,
  };
}
