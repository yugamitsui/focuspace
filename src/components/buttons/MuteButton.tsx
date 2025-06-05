"use client";

import { useState } from "react";
import { Howler } from "howler";
import {
  SpeakerSimpleXIcon,
  SpeakerSimpleHighIcon,
} from "@phosphor-icons/react";

export default function MuteButton() {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    Howler.volume(newMuted ? 0 : 1);
  };

  return (
    <button
      onClick={toggleMute}
      className="p-2 hover:text-white transition-colors duration-500 cursor-pointer"
      aria-label="Toggle Mute"
    >
      {isMuted ? (
        <SpeakerSimpleXIcon size={32} />
      ) : (
        <SpeakerSimpleHighIcon size={32} />
      )}
    </button>
  );
}
