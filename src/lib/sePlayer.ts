import { Howl } from "howler";

const timerEndSe = new Howl({
  src: ["/sounds/se/se_windchime.mp3"],
  volume: 0.7,
  html5: true,
});

export const playTimerEndSe = () => {
  timerEndSe.play();
};
