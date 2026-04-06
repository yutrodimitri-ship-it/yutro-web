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
    slug: "avatar-camila",
    name: "Camila",
    handle: "",
    image: "/influencers/Camila/avatar.webp",
    bio: {
      es: "Avatar digital 👗 Moda & Fotografía\n🤖 Creado con IA por @yutro_ia\n📸 Outfits, amigas y buena vibra",
      en: "Digital Avatar 👗 Fashion & Photography\n🤖 AI-created by @yutro_ia\n📸 Outfits, friends and good vibes",
    },
    stats: {
      posts: 47,
      followers: "12.5K",
      following: 89,
    },
    highlights: [
      { label: "Moda", image: "/influencers/Camila/hl-01.jpg" },
      { label: "Sesiones", image: "/influencers/Camila/hl-02.jpg" },
      { label: "Amigas", image: "/influencers/Camila/hl-03.jpg" },
      { label: "Reels", image: "/influencers/Camila/hl-04.jpg" },
    ],
    reelUrl: "",
    gallery: [
      "/influencers/Camila/01.webp",
      "/influencers/Camila/02.webp",
      "/influencers/Camila/03.webp",
      "/influencers/Camila/04.webp",
      "/influencers/Camila/05.webp",
      "/influencers/Camila/06.webp",
      "/influencers/Camila/07.webp",
      "/influencers/Camila/08.webp",
      "/influencers/Camila/09.webp",
    ],
  },
  {
    slug: "avatar-antonia",
    name: "Antonia",
    handle: "",
    image: "/influencers/antonia/avatar.webp",
    bio: {
      es: "Avatar digital 🧴 Skincare & Lifestyle\n🤖 Creado con IA por @yutro_ia\n✨ Viajes, bienestar y comer bien",
      en: "Digital Avatar 🧴 Skincare & Lifestyle\n🤖 AI-created by @yutro_ia\n✨ Travel, wellness and good food",
    },
    stats: {
      posts: 32,
      followers: "8.2K",
      following: 45,
    },
    highlights: [
      { label: "Skincare", image: "/influencers/antonia/hl-01.jpg" },
      { label: "Viajes", image: "/influencers/antonia/hl-02.jpg" },
      { label: "Foodie", image: "/influencers/antonia/hl-03.jpg" },
      { label: "Lifestyle", image: "/influencers/antonia/hl-04.jpg" },
    ],
    reelUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "/influencers/antonia/01.webp",
      "/influencers/antonia/02.webp",
      "/influencers/antonia/03.webp",
      "/influencers/antonia/04.webp",
      "/influencers/antonia/05.webp",
      "/influencers/antonia/06.webp",
      "/influencers/antonia/07.webp",
      "/influencers/antonia/08.webp",
      "/influencers/antonia/09.webp",
    ],
  },
  {
    slug: "avatar-sofi",
    name: "Sofi",
    handle: "",
    image: "/influencers/sofi/avatar.webp",
    bio: {
      es: "Avatar digital 👾 Dev · Gamer · Cultura Pop\n🤖 Creada con IA por @yutro_ia\n🎮 Tiene opiniones fuertes. No las suaviza.",
      en: "Digital Avatar 👾 Dev · Gamer · Pop Culture\n🤖 AI-created by @yutro_ia\n🎮 Strong opinions. Unfiltered.",
    },
    stats: {
      posts: 41,
      followers: "10.8K",
      following: 76,
    },
    highlights: [
      { label: "Gaming", image: "/influencers/sofi/11.webp" },
      { label: "Dev", image: "/influencers/sofi/12.webp" },
      { label: "Pop", image: "/influencers/sofi/13.webp" },
      { label: "IRL", image: "/influencers/sofi/15.webp" },
    ],
    reelUrl: "",
    gallery: [
      "/influencers/sofi/01.webp",
      "/influencers/sofi/02.webp",
      "/influencers/sofi/04.webp",
      "/influencers/sofi/05.webp",
      "/influencers/sofi/06.webp",
      "/influencers/sofi/07.webp",
      "/influencers/sofi/08.webp",
      "/influencers/sofi/09.webp",
      "/influencers/sofi/10.webp",
      "/influencers/sofi/11.webp",
      "/influencers/sofi/12.webp",
      "/influencers/sofi/13.webp",
    ],
  },
];
