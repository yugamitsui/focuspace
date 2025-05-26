import { Howl } from "howler";

const bgm = new Howl({
  src: ["/sounds/bgm_01.mp3"],
  volume: 0.5,
  loop: true,
  html5: true,
});

export const playBgm = () => {
  if (!bgm.playing()) {
    bgm.fade(0, 0.5, 1000);
    bgm.play();
  }
};

export const stopBgm = () => {
  if (bgm.playing()) bgm.stop();
};
