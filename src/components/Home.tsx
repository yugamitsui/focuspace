"use client";

import { useState } from "react";
import Timer from "@/components/Timer";
import Effect from "@/components/Effect";
import EffectSelector, { EffectType } from "./selectors/EffectSelector";
import BackgroundSelector from "./selectors/BackgroundSelector";

export default function Home() {
  const [background, setBackground] = useState("/images/background_01.png");
  const [effect, setEffect] = useState<EffectType>("sun");

  return (
    <main
      className="relative flex flex-col items-center justify-center gap-16 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Effect effect={effect} />
      <div className="absolute inset-0 bg-black/25 z-0" />

      <div className="absolute bottom-4 right-4 z-30 flex gap-2">
        <BackgroundSelector current={background} onSelect={setBackground} />
        <EffectSelector onChange={setEffect} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-16">
        <Timer />
      </div>
    </main>
  );
}
