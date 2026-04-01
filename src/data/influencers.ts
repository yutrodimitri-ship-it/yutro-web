export interface Influencer {
  slug: string;
  name: string;
  handle: string;
  image: string;
  bio: {
    es: string;
    en: string;
  };
  stats: {
    posts: number;
    followers: string;
    following: number;
  };
  highlights: {
    label: string;
    image: string;
  }[];
  reelUrl: string;
  gallery: string[];
}

export const influencers: Influencer[] = [
  {
    slug: "avatar-luna",
    name: "Luna",
    handle: "@luna.ai",
    image: "/influencers/luna/avatar.jpg",
    bio: {
      es: "Avatar digital ✨ Moda & Lifestyle\n🤖 Creada con IA por @yutro_ia\n📍 Santiago, Chile",
      en: "Digital Avatar ✨ Fashion & Lifestyle\n🤖 AI-created by @yutro_ia\n📍 Santiago, Chile",
    },
    stats: {
      posts: 47,
      followers: "12.5K",
      following: 89,
    },
    highlights: [
      { label: "Moda", image: "/influencers/luna/hl-01.jpg" },
      { label: "BTS", image: "/influencers/luna/hl-02.jpg" },
      { label: "Collabs", image: "/influencers/luna/hl-03.jpg" },
      { label: "Viajes", image: "/influencers/luna/hl-04.jpg" },
    ],
    reelUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "/influencers/luna/01.jpg",
      "/influencers/luna/02.jpg",
      "/influencers/luna/03.jpg",
      "/influencers/luna/04.jpg",
      "/influencers/luna/05.jpg",
      "/influencers/luna/06.jpg",
      "/influencers/luna/07.jpg",
      "/influencers/luna/08.jpg",
      "/influencers/luna/09.jpg",
    ],
  },
  {
    slug: "avatar-kai",
    name: "Kai",
    handle: "@kai.ai",
    image: "/influencers/kai/avatar.jpg",
    bio: {
      es: "Avatar digital 🎮 Tech & Gaming\n🤖 Creado con IA por @yutro_ia\n⚡ Next-gen content",
      en: "Digital Avatar 🎮 Tech & Gaming\n🤖 AI-created by @yutro_ia\n⚡ Next-gen content",
    },
    stats: {
      posts: 32,
      followers: "8.2K",
      following: 45,
    },
    highlights: [
      { label: "Gaming", image: "/influencers/kai/hl-01.jpg" },
      { label: "Tech", image: "/influencers/kai/hl-02.jpg" },
      { label: "Reels", image: "/influencers/kai/hl-03.jpg" },
      { label: "Setup", image: "/influencers/kai/hl-04.jpg" },
    ],
    reelUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "/influencers/kai/01.jpg",
      "/influencers/kai/02.jpg",
      "/influencers/kai/03.jpg",
      "/influencers/kai/04.jpg",
      "/influencers/kai/05.jpg",
      "/influencers/kai/06.jpg",
      "/influencers/kai/07.jpg",
      "/influencers/kai/08.jpg",
      "/influencers/kai/09.jpg",
    ],
  },
  {
    slug: "avatar-nova",
    name: "Nova",
    handle: "@nova.ai",
    image: "/influencers/nova/avatar.jpg",
    bio: {
      es: "Avatar digital 💫 Beauty & Wellness\n🤖 Creada con IA por @yutro_ia\n🌿 Innovación & sofisticación",
      en: "Digital Avatar 💫 Beauty & Wellness\n🤖 AI-created by @yutro_ia\n🌿 Innovation & sophistication",
    },
    stats: {
      posts: 56,
      followers: "15.1K",
      following: 112,
    },
    highlights: [
      { label: "Beauty", image: "/influencers/nova/hl-01.jpg" },
      { label: "Skincare", image: "/influencers/nova/hl-02.jpg" },
      { label: "Collabs", image: "/influencers/nova/hl-03.jpg" },
      { label: "Wellness", image: "/influencers/nova/hl-04.jpg" },
    ],
    reelUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "/influencers/nova/01.jpg",
      "/influencers/nova/02.jpg",
      "/influencers/nova/03.jpg",
      "/influencers/nova/04.jpg",
      "/influencers/nova/05.jpg",
      "/influencers/nova/06.jpg",
      "/influencers/nova/07.jpg",
      "/influencers/nova/08.jpg",
      "/influencers/nova/09.jpg",
    ],
  },
];
