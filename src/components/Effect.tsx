import RainEffect from "./effects/RainEffect";
import SnowEffect from "./effects/SnowEffect";
import { EffectType } from "./selectors/EffectSelector";

export default function Effect({ effect }: { effect: EffectType }) {
  if (effect === "rain") return <RainEffect />;
  if (effect === "snow") return <SnowEffect />;
  return null;
}
