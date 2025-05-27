"use client";

import { useState } from "react";
import Timer from "@/components/Timer";
import AvatarSelector from "./AvatarSelector";
import { CaretLeft, CaretRight } from "phosphor-react";

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

  const nextBg = () => setBgIndex((prev) => (prev + 1) % backgrounds.length);
  const prevBg = () =>
    setBgIndex((prev) => (prev === 0 ? backgrounds.length - 1 : prev - 1));

  return (
    <main
      className="relative flex flex-col items-center justify-center gap-16 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="absolute left-0 top-0 bottom-0 flex items-center group p-16 z-20">
        <button
          onClick={prevBg}
          className="ml-2 p-2 rounded-full text-gray-300 hover:text-gray-100 bg-black/30 hover:bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500"
        >
          <CaretLeft size={32} weight="bold" />
        </button>
      </div>

      <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end group p-16 z-20">
        <button
          onClick={nextBg}
          className="mr-2 p-2 rounded-full text-gray-300 hover:text-gray-100 bg-black/30 hover:bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500"
        >
          <CaretRight size={32} weight="bold" />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-16">
        <Timer />
        <AvatarSelector />
      </div>
    </main>
  );
}
