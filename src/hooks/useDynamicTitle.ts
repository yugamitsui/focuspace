import { useEffect } from "react";

/**
 * Dynamically updates the document.title based on timer state.
 *
 * @param timeLeft - Remaining time in seconds.
 * @param isRunning - Whether the timer is actively running.
 * @param isResting - Whether the user is in resting mode.
 * @param hasStarted - Whether the timer session has started.
 */
export function useDynamicTitle(
  timeLeft: number,
  isRunning: boolean,
  isResting: boolean,
  hasStarted: boolean
) {
  useEffect(() => {
    // If timer hasn't started yet, use default title
    if (!hasStarted) {
      document.title = "Focuspace";
      return;
    }

    // Format time as mm:ss
    const minutes = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");

    // Determine status label
    let label = "";
    if (!isRunning) {
      label = "Paused";
    } else {
      label = isResting ? "Resting..." : "Focusing...";
    }

    // Set dynamic title like: "22:43 | Focusing..."
    document.title = `${minutes}:${seconds} | ${label}`;
  }, [timeLeft, isRunning, isResting, hasStarted]);
}
