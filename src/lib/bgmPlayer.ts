import { Howl } from "howler";

const bgm = new Howl({
  src: ["/sounds/bgm_01.mp3"],
  volume: 0.5,
  loop: true,
});

export const playBgm = () => {
  if (!bgm.playing()) bgm.play();
};

export const stopBgm = () => {
  if (bgm.playing()) bgm.stop();
};
