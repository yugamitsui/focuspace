"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ImageSquareIcon } from "@phosphor-icons/react";
import { backgroundImages } from "../BackgroundImages";

export default function BackgroundSelector({
  onSelect,
  current,
}: {
  current: string;
  onSelect: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-full transition-colors duration-500 cursor-pointer
    ${
      open
        ? "bg-black text-white"
        : "bg-black/50 hover:bg-black hover:text-white"
    }`}
      >
        <ImageSquareIcon size={32} />
      </button>

      {open && (
        <div className="fixed right-4 bottom-18 w-136 bg-black/50 rounded p-4 grid grid-cols-3 gap-4 z-50">
          {backgroundImages.map((bg) => (
            <button
              key={bg.id}
              onClick={() => {
                onSelect(bg.url);
              }}
            >
              <Image
                src={bg.url}
                alt={bg.label}
                width={160}
                height={90}
                className={`rounded transition duration-500 ${
                  bg.url === current
                    ? "ring-2 ring-white"
                    : "cursor-pointer hover:ring-2 hover:ring-white/75"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
