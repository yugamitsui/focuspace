"use client";

import { useState } from "react";
import Timer from "@/components/Timer";
import EffectSelector, { EffectType } from "./selectors/EffectSelector";
import { backgroundImages } from "@/components/BackgroundCarousel";
import Effect from "@/components/Effect";
import NavButton from "@/components/buttons/NavButton";

export default function Home() {
  const [bgIndex, setBgIndex] = useState(0);
  const [effect, setEffect] = useState<EffectType>("sun");

  return (
    <main
      className="relative flex flex-col items-center justify-center gap-16 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImages[bgIndex]})` }}
    >
      <Effect effect={effect} />
      <div className="absolute inset-0 bg-black/25 z-0" />

      <NavButton
        direction="left"
        onClick={() =>
          setBgIndex((prev) =>
            prev === 0 ? backgroundImages.length - 1 : prev - 1
          )
        }
      />
      <NavButton
        direction="right"
        onClick={() =>
          setBgIndex((prev) => (prev + 1) % backgroundImages.length)
        }
      />

      <div className="absolute bottom-4 right-4 z-30">
        <EffectSelector onChange={setEffect} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-16">
        <Timer />
      </div>
    </main>
  );
}
