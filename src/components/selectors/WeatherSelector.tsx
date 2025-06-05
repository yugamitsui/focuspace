"use client";

import { useState } from "react";
import {
  CloudSunIcon,
  CloudRainIcon,
  CloudSnowIcon,
} from "@phosphor-icons/react";

export type WeatherType = "clear" | "rain" | "snow";

interface WeatherSelectorProps {
  onChange: (weather: WeatherType) => void;
}

export default function WeatherSelector({ onChange }: WeatherSelectorProps) {
  const [weather, setWeather] = useState<WeatherType>("clear");

  const weatherOrder: WeatherType[] = ["clear", "rain", "snow"];
  const iconMap: Record<WeatherType, React.JSX.Element> = {
    clear: <CloudSunIcon size={32} />,
    rain: <CloudRainIcon size={32} />,
    snow: <CloudSnowIcon size={32} />,
  };

  const handleClick = () => {
    const currentIndex = weatherOrder.indexOf(weather);
    const nextWeather = weatherOrder[(currentIndex + 1) % weatherOrder.length];
    setWeather(nextWeather);
    onChange(nextWeather);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full bg-black/50 hover:bg-black hover:text-white transition-colors duration-500 cursor-pointer"
      aria-label={`Weather: ${weather}`}
    >
      {iconMap[weather]}
    </button>
  );
}
