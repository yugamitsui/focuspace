"use client";

import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import Timer from "@/components/Timer";
import Effect from "@/components/Effect";
import FullscreenButton from "./buttons/FullscreenButton";
import BackgroundSelector from "./selectors/BackgroundSelector";
import BgmSelector from "./selectors/BgmSelector";
import EffectSelector, { EffectType } from "./selectors/EffectSelector";
import { bgmTracks } from "@/constants/bgmTracks";
import { backgroundImages } from "@/constants/BackgroundImages";
import { useTimer } from "@/hooks/useTimer";
import { playBgm, stopBgm } from "@/lib/bgmPlayer";
import { getBackgroundImage, getBackgroundMusic } from "@/lib/spaceSettings";

export default function Home() {
  const user = useUser();

  const [trackId, setTrackId] = useState<string | null>(null);
  const selected = bgmTracks.find((t) => t.id === trackId) ?? bgmTracks[4];

  const [background, setBackground] = useState(backgroundImages[0].url);
  const [effect, setEffect] = useState<EffectType>("sun");

  const { mode, timeLeft, isRunning, changeMode, toggle, reset, modes } =
    useTimer("25-5", () => selected.bgm);

  useEffect(() => {
    const fetchSpaceSettings = async () => {
      if (!user) return;
      try {
        const musicId = await getBackgroundMusic(user.id);
        if (musicId) setTrackId(musicId);

        const bgUrl = await getBackgroundImage(user.id);
        if (bgUrl) setBackground(bgUrl);
      } catch (err) {
        console.error("Failed to fetch space settings:", err);
      }
    };

    fetchSpaceSettings();
  }, [user]);

  return (
    <main
      className="relative flex flex-col items-center justify-center gap-16 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Effect effect={effect} />
      <div className="absolute inset-0 bg-black/25 z-0" />

      <div className="absolute bottom-4 right-4 z-30 flex gap-2">
        <BgmSelector
          current={selected.id}
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
