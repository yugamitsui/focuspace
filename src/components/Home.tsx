"use client";

import { useState } from "react";
import Timer from "@/components/Timer";
import Effect from "@/components/Effect";
import EffectSelector, { EffectType } from "./selectors/EffectSelector";
import BackgroundSelector from "./selectors/BackgroundSelector";
import FullscreenButton from "./buttons/FullscreenButton";
import BgmSelector from "./selectors/BgmSelector";
import { bgmTracks } from "@/constants/bgmTracks";
import { useTimer } from "@/hooks/useTimer";
import { playBgm, stopBgm } from "@/lib/bgmPlayer";

export default function Home() {
  const [background, setBackground] = useState(
    "/images/backgrounds/background_01.png"
  );
  const [effect, setEffect] = useState<EffectType>("sun");
  const [trackId, setTrackId] = useState(bgmTracks[4].id);
  const selected = bgmTracks.find((t) => t.id === trackId);

  const { mode, timeLeft, isRunning, changeMode, toggle, reset, modes } =
    useTimer("25-5", () => selected?.bgm ?? []);

  return (
    <main
      className="relative flex flex-col items-center justify-center gap-16 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Effect effect={effect} />
      <div className="absolute inset-0 bg-black/25 z-0" />

      <div className="absolute bottom-4 right-4 z-30 flex gap-2">
        <BgmSelector
          current={trackId}
          onSelect={(id) => {
            setTrackId(id);
            if (isRunning) {
              const selected = bgmTracks.find((t) => t.id === id);
              if (selected) {
                stopBgm();
                playBgm(selected.bgm);
              }
            }
          }}
        />
        <BackgroundSelector current={background} onSelect={setBackground} />
        <EffectSelector onChange={setEffect} />
        <FullscreenButton />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-16">
        <Timer
          mode={mode}
          timeLeft={timeLeft}
          isRunning={isRunning}
          changeMode={changeMode}
          toggle={toggle}
          reset={reset}
          modes={modes}
        />
      </div>
    </main>
  );
}
