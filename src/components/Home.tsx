"use client";

import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import Timer from "@/components/Timer";
import FullscreenButton from "./buttons/FullscreenButton";
import BackgroundSelector from "./selectors/BackgroundSelector";
import BgmSelector from "./selectors/BgmSelector";
import EffectSelector from "./selectors/EffectSelector";
import { bgmTracks } from "@/constants/bgmTracks";
import { backgroundImages } from "@/constants/backgroundImages";
import { visualEffects } from "@/constants/visualEffects";
import { timerDurations } from "@/constants/timerDurations";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { useTimer } from "@/hooks/useTimer";
import { playBgm, stopBgm } from "@/lib/bgmPlayer";
import {
  getBackgroundImage,
  getBackgroundMusic,
  getVisualEffect,
  getTimerDuration,
} from "@/lib/supabase/spaceSettings";

export default function Home() {
  const user = useUser();

  const [trackId, setTrackId] = useState<string | null>(null);
  const [background, setBackground] = useState(backgroundImages[0].url);
  const [visualEffectId, setVisualEffectId] = useState(visualEffects[0].id);
  const [selectedDurationId, setSelectedDurationId] = useState(
    timerDurations[0].id
  );

  const selectedTrack = bgmTracks.find((t) => t.id === trackId) ?? bgmTracks[4];
  const selectedEffect =
    visualEffects.find((v) => v.id === visualEffectId)?.component ??
    visualEffects[0].component;

  const { timeLeft, isRunning, hasStarted, toggle, reset } = useTimer(
    selectedDurationId,
    () => selectedTrack.bgm
  );

  useNavigationGuard(hasStarted);

  useEffect(() => {
    const fetchSpaceSettings = async () => {
      if (!user) return;
      try {
        const [musicId, bgUrl, effectId, durationId] = await Promise.all([
          getBackgroundMusic(user.id),
          getBackgroundImage(user.id),
          getVisualEffect(user.id),
          getTimerDuration(user.id),
        ]);

        if (musicId) setTrackId(musicId);
        if (bgUrl) setBackground(bgUrl);
        if (effectId) setVisualEffectId(effectId);
        if (durationId) setSelectedDurationId(durationId);
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
      {selectedEffect}
      <div className="absolute inset-0 bg-black/25 z-0" />

      <div className="absolute bottom-4 right-4 z-30 flex gap-2">
        <BgmSelector
          current={selectedTrack.id}
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
        <EffectSelector
          current={visualEffectId}
          onSelect={(id) => setVisualEffectId(id)}
        />
        <FullscreenButton />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-16">
        <Timer
          currentId={selectedDurationId}
          onSelect={setSelectedDurationId}
          timeLeft={timeLeft}
          isRunning={isRunning}
          hasStarted={hasStarted}
          toggle={toggle}
          reset={reset}
        />
      </div>
    </main>
  );
}
