"use client";

import { useState } from "react";
import Timer from "@/components/Timer";
import { CaretLeft, CaretRight } from "phosphor-react";
import RainEffect from "./effects/RainEffect";
import SnowEffect from "./effects/SnowEffect";
import WeatherSelector, { WeatherType } from "./WeatherSelector";

const backgrounds = [
  "/images/background_01.png",
  "/images/background_02.png",
  "/images/background_03.png",
  "/images/background_04.png",
  "/images/background_05.png",
  "/images/background_06.png",
];

export default function Home() {
  const [bgIndex, setBgIndex] = useState(0);
  const [weather, setWeather] = useState<WeatherType>("clear");

  const nextBg = () => setBgIndex((prev) => (prev + 1) % backgrounds.length);
  const prevBg = () =>
    setBgIndex((prev) => (prev === 0 ? backgrounds.length - 1 : prev - 1));

  return (
    <main
      className="relative flex flex-col items-center justify-center gap-16 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
    >
      {weather === "rain" && <RainEffect />}
      {weather === "snow" && <SnowEffect />}
      <div className="absolute inset-0 bg-black/25 z-0" />

      <div className="absolute left-0 top-0 bottom-0 flex items-center group p-16 z-20">
        <button
          onClick={prevBg}
          className="p-2 rounded-full bg-black/50 hover:bg-black hover:text-white opacity-0 group-hover:opacity-100 transition duration-500 cursor-pointer"
        >
          <CaretLeft size={32} />
        </button>
      </div>

      <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end group p-16 z-20">
        <button
          onClick={nextBg}
          className="p-2 rounded-full bg-black/50 hover:bg-black hover:text-white opacity-0 group-hover:opacity-100 transition duration-500 cursor-pointer"
        >
          <CaretRight size={32} />
        </button>
      </div>

      <div className="absolute top-4 right-4 z-30">
        <WeatherSelector onChange={setWeather} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-16">
        <Timer />
      </div>
    </main>
  );
}
