"use client";

import { useState } from "react";
import {
  CloudSunIcon,
  CloudRainIcon,
  CloudSnowIcon,
} from "@phosphor-icons/react";

export type EffectType = "sun" | "rain" | "snow";

interface EffectSelectorProps {
  onChange: (effect: EffectType) => void;
}

export default function EffectSelector({ onChange }: EffectSelectorProps) {
  const [effect, setEffect] = useState<EffectType>("sun");
  const effectOrder: EffectType[] = ["sun", "rain", "snow"];

  const iconMap: Record<EffectType, React.JSX.Element> = {
    sun: <CloudSunIcon size={32} />,
    rain: <CloudRainIcon size={32} />,
    snow: <CloudSnowIcon size={32} />,
  };

  const handleClick = () => {
    const currentIndex = effectOrder.indexOf(effect);
    const nextEffect = effectOrder[(currentIndex + 1) % effectOrder.length];
    setEffect(nextEffect);
    onChange(nextEffect);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full bg-black/50 hover:bg-black hover:text-white transition-colors duration-500 cursor-pointer"
      aria-label={`Effect: ${effect}`}
    >
      {iconMap[effect]}
    </button>
  );
}
