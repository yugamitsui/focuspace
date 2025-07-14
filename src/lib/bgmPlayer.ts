import { Howl } from "howler";

let currentIndex = 0;
let currentTracks: string[] = [];
let sound: Howl | null = null;

export const playBgm = (tracks: string[] = []) => {
  if (tracks.length === 0) return;
  currentTracks = tracks;
  currentIndex = 0;
  playCurrent();
};

const playCurrent = () => {
  if (!currentTracks[currentIndex]) return;

  sound = new Howl({
    src: [currentTracks[currentIndex]],
    volume: 0.5,
    loop: false,
    onend: () => {
      currentIndex = (currentIndex + 1) % currentTracks.length;
      playCurrent();
    },
  });

  sound.play();
};

export const stopBgm = () => {
  sound?.stop();
  sound = null;
  currentTracks = [];
  currentIndex = 0;
};
