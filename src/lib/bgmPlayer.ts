import { Howl } from "howler";

let currentIndex = 0;
let currentTracks: string[] = [];
let sound: Howl | null = null;
let isPaused = false;

export const playBgm = (tracks: string[] = []) => {
  if (sound && sound.playing()) return;
  if (tracks.length === 0) return;

  if (sound) return;

  currentTracks = tracks;
  currentIndex = 0;
  playCurrent();
};

const playCurrent = () => {
  if (!currentTracks[currentIndex]) return;

  sound = new Howl({
    src: [currentTracks[currentIndex]],
    volume: 1,
    loop: false,
    onend: () => {
      currentIndex = (currentIndex + 1) % currentTracks.length;
      playCurrent();
    },
  });

  sound.play();
  isPaused = false;
};

export const pauseBgm = () => {
  if (sound?.playing()) {
    sound.pause();
    isPaused = true;
  }
};

export const resumeBgm = () => {
  if (sound && !sound.playing() && isPaused) {
    sound.play();
    isPaused = false;
  }
};

export const stopBgm = () => {
  sound?.stop();
  sound = null;
  currentTracks = [];
  currentIndex = 0;
  isPaused = false;
};
