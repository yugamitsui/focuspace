import RainEffect from "./effects/RainEffect";
import SnowEffect from "./effects/SnowEffect";
import { WeatherType } from "./selectors/WeatherSelector";

export default function WeatherEffect({ weather }: { weather: WeatherType }) {
  if (weather === "rain") return <RainEffect />;
  if (weather === "snow") return <SnowEffect />;
  return null;
}
