import { Howl } from "howler";

let currentTrackIndex = 0;
let currentPlaylist: string[] = [];
let currentHowl: Howl | null = null;

export const playBgmPlaylist = (playlist: string[]) => {
  stopBgm();
  currentPlaylist = playlist;
  currentTrackIndex = 0;
  playCurrentTrack();
};

const playCurrentTrack = () => {
  if (currentTrackIndex >= currentPlaylist.length) {
    currentTrackIndex = 0;
  }

  const track = currentPlaylist[currentTrackIndex];
  currentHowl = new Howl({
    src: [track],
    volume: 0.5,
    onend: () => {
      currentTrackIndex++;
      playCurrentTrack();
    },
  });

  currentHowl.play();
};

export const stopBgm = () => {
  if (currentHowl) {
    currentHowl.stop();
    currentHowl.unload();
    currentHowl = null;
  }
};
