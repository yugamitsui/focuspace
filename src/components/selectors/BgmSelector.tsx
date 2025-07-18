"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MusicNotesSimpleIcon } from "@phosphor-icons/react";
import { bgmTracks } from "@/constants/bgmTracks";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { updateBackgroundMusicId } from "@/lib/supabase/spaceSettings";

export default function BgmSelector({
  current,
  onSelect,
}: {
  current: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useCurrentUser();

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const handleSelect = async (trackId: string) => {
    onSelect(trackId);
    if (user?.id) {
      try {
        await updateBackgroundMusicId(user.id, trackId);
      } catch (error) {
        console.error("Failed to update background music:", error);
      }
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-full transition-colors duration-500 cursor-pointer ${
          open
            ? "bg-black text-white"
            : "bg-black/50 hover:bg-black hover:text-white"
        }`}
        aria-label="Select music"
      >
        <MusicNotesSimpleIcon size={32} />
      </button>

      {open && (
        <div className="fixed right-4 bottom-18 bg-black/50 rounded p-4 grid grid-cols-3 gap-4 z-50">
          {bgmTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => handleSelect(track.id)}
              className={`group ${
                track.id === current ? "" : "cursor-pointer"
              }`}
            >
              <Image
                src={track.cover}
                alt={track.title}
                width={128}
                height={128}
                className={`rounded-full transition duration-500 ${
                  track.id === current
                    ? "ring-2 ring-white"
                    : "group-hover:ring-2 group-hover:ring-white/75"
                }`}
              />
              <span
                className={`block mt-2 text-xs text-center transition-color duration-500 ${
                  track.id === current ? "text-white" : "group-hover:text-white"
                }`}
              >
                {track.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
