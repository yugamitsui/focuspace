type BgmTrack = {
  id: number;
  title: string;
  bgm: string[];
  cover: string;
  decade: string;
};

export const bgmTracks: BgmTrack[] = [
  {
    id: 1,
    title: "50s Piano Lounge",
    bgm: ["/sounds/bgm/50s/bgm_50s_01.mp3", "/sounds/bgm/50s/bgm_50s_02.mp3"],
    cover: "/images/covers/cover_50s.png",
    decade: "50s",
  },
  {
    id: 2,
    title: "60s Bossa Chill",
    bgm: ["/sounds/bgm/60s/bgm_60s_01.mp3", "/sounds/bgm/60s/bgm_60s_02.mp3"],
    cover: "/images/covers/cover_60s.png",
    decade: "60s",
  },
  {
    id: 3,
    title: "70s Groove Jazz",
    bgm: ["/sounds/bgm/70s/bgm_70s_01.mp3", "/sounds/bgm/70s/bgm_70s_02.mp3"],
    cover: "/images/covers/cover_70s.png",
    decade: "70s",
  },
  {
    id: 4,
    title: "80s 8-bit Arcade",
    bgm: ["/sounds/bgm/80s/bgm_80s_01.mp3", "/sounds/bgm/80s/bgm_80s_02.mp3"],
    cover: "/images/covers/cover_80s.png",
    decade: "80s",
  },
  {
    id: 5,
    title: "90s Lo-fi Beats",
    bgm: ["/sounds/bgm/90s/bgm_90s_01.mp3", "/sounds/bgm/90s/bgm_90s_02.mp3"],
    cover: "/images/covers/cover_90s.png",
    decade: "90s",
  },
  {
    id: 6,
    title: "00s Chill Pop",
    bgm: ["/sounds/bgm/00s/bgm_00s_01.mp3", "/sounds/bgm/00s/bgm_00s_02.mp3"],
    cover: "/images/covers/cover_00s.png",
    decade: "00s",
  },
  {
    id: 7,
    title: "10s Kawaii Future",
    bgm: ["/sounds/bgm/10s/bgm_10s_01.mp3", "/sounds/bgm/10s/bgm_10s_02.mp3"],
    cover: "/images/covers/cover_10s.png",
    decade: "10s",
  },
  {
    id: 8,
    title: "20s Synthwave Neon",
    bgm: ["/sounds/bgm/20s/bgm_20s_01.mp3", "/sounds/bgm/20s/bgm_20s_02.mp3"],
    cover: "/images/covers/cover_20s.png",
    decade: "20s",
  },
  {
    id: 9,
    title: "30s Ambient Horizon",
    bgm: ["/sounds/bgm/30s/bgm_30s_01.mp3", "/sounds/bgm/30s/bgm_30s_02.mp3"],
    cover: "/images/covers/cover_30s.png",
    decade: "30s",
  },
];
