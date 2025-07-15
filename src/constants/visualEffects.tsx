import React from "react";
import {
  CloudSunIcon,
  CloudRainIcon,
  CloudSnowIcon,
} from "@phosphor-icons/react";
import RainEffect from "@/components/visualEffects/RainEffect";
import SnowEffect from "@/components/visualEffects/SnowEffect";

type VisualEffect = {
  id: string;
  label: string;
  icon: React.ReactElement;
  component: React.ReactElement | null;
};

export const visualEffects: VisualEffect[] = [
  {
    id: "weather_sun_01",
    label: "Sun",
    icon: <CloudSunIcon size={32} />,
    component: null,
  },
  {
    id: "weather_rain_01",
    label: "Rain",
    icon: <CloudRainIcon size={32} />,
    component: <RainEffect />,
  },
  {
    id: "weather_snow_01",
    label: "Snow",
    icon: <CloudSnowIcon size={32} />,
    component: <SnowEffect />,
  },
];
