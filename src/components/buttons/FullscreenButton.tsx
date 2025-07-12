"use client";

import { useEffect, useState } from "react";
import { ArrowsOutSimpleIcon, ArrowsInSimpleIcon } from "@phosphor-icons/react";

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== "undefined" && !!document.fullscreenElement
  );

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Failed to exit fullscreen:", err);
      });
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="p-2 rounded-full bg-black/50 hover:bg-black hover:text-white transition-colors duration-500 cursor-pointer"
      aria-label="Toggle fullscreen"
    >
      {isFullscreen ? (
        <ArrowsInSimpleIcon size={32} />
      ) : (
        <ArrowsOutSimpleIcon size={32} />
      )}
    </button>
  );
}
