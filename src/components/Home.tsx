"use client";

import { useState } from "react";
import Timer from "@/components/Timer";
import WeatherSelector, { WeatherType } from "./selectors/WeatherSelector";
import { backgroundImages } from "@/components/BackgroundCarousel";
import WeatherEffect from "@/components/WeatherEffect";
import NavButton from "@/components/buttons/NavButton";

export default function Home() {
  const [bgIndex, setBgIndex] = useState(0);
  const [weather, setWeather] = useState<WeatherType>("clear");

  return (
    <main
      className="relative flex flex-col items-center justify-center gap-16 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImages[bgIndex]})` }}
    >
      <WeatherEffect weather={weather} />
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

      <div className="absolute top-4 right-4 z-30">
        <WeatherSelector onChange={setWeather} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-16">
        <Timer />
      </div>
    </main>
  );
}
