type BgmTrack = {
  id: string;
  title: string;
  bgm: string[];
  cover: string;
};

export const bgmTracks: BgmTrack[] = [
  {
    id: "decade_50s_piano_01",
    title: "50s Piano Lounge",
    bgm: ["/sounds/bgm/50s/bgm_50s_01.mp3", "/sounds/bgm/50s/bgm_50s_02.mp3"],
    cover: "/images/covers/cover_50s.png",
  },
  {
    id: "decade_60s_bossa_01",
    title: "60s Bossa Chill",
    bgm: ["/sounds/bgm/60s/bgm_60s_01.mp3", "/sounds/bgm/60s/bgm_60s_02.mp3"],
    cover: "/images/covers/cover_60s.png",
  },
  {
    id: "decade_70s_jazz_01",
    title: "70s Groove Jazz",
    bgm: ["/sounds/bgm/70s/bgm_70s_01.mp3", "/sounds/bgm/70s/bgm_70s_02.mp3"],
    cover: "/images/covers/cover_70s.png",
  },
  {
    id: "decade_80s_8bit_01",
    title: "80s 8-bit Arcade",
    bgm: ["/sounds/bgm/80s/bgm_80s_01.mp3", "/sounds/bgm/80s/bgm_80s_02.mp3"],
    cover: "/images/covers/cover_80s.png",
  },
  {
    id: "decade_90s_lofi_01",
    title: "90s Lo-fi Beats",
    bgm: ["/sounds/bgm/90s/bgm_90s_01.mp3", "/sounds/bgm/90s/bgm_90s_02.mp3"],
    cover: "/images/covers/cover_90s.png",
  },
  {
    id: "decade_00s_chill_01",
    title: "00s Chill Pop",
    bgm: ["/sounds/bgm/00s/bgm_00s_01.mp3", "/sounds/bgm/00s/bgm_00s_02.mp3"],
    cover: "/images/covers/cover_00s.png",
  },
  {
    id: "decade_10s_kawaii_01",
    title: "10s Kawaii Future",
    bgm: ["/sounds/bgm/10s/bgm_10s_01.mp3", "/sounds/bgm/10s/bgm_10s_02.mp3"],
    cover: "/images/covers/cover_10s.png",
  },
  {
    id: "decade_20s_synthwave_01",
    title: "20s Synthwave Neon",
    bgm: ["/sounds/bgm/20s/bgm_20s_01.mp3", "/sounds/bgm/20s/bgm_20s_02.mp3"],
    cover: "/images/covers/cover_20s.png",
  },
  {
    id: "decade_30s_ambient_01",
    title: "30s Ambient Horizon",
    bgm: ["/sounds/bgm/30s/bgm_30s_01.mp3", "/sounds/bgm/30s/bgm_30s_02.mp3"],
    cover: "/images/covers/cover_30s.png",
  },
];
