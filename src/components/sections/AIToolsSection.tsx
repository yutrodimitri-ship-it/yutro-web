"use client";

import Image from "next/image";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";
import { Container } from "@/components/shared/Container";

// ─── Tool definitions ─────────────────────────────────────────────────────────

type LogoType = "img" | "svg";

interface Tool {
  name: string;
  category: string;
  logo: { type: LogoType; src?: string; svg?: React.ReactNode };
}

// Adobe-accurate inline SVGs (brand colors)
const AeSVG = () => (
  <svg viewBox="0 0 36 36" className="h-7 w-7">
    <rect width="36" height="36" rx="6" fill="#00005B"/>
    <text x="18" y="24" textAnchor="middle" fill="#9999FF" fontSize="15" fontWeight="bold" fontFamily="Arial,sans-serif">Ae</text>
  </svg>
);
const PrSVG = () => (
  <svg viewBox="0 0 36 36" className="h-7 w-7">
    <rect width="36" height="36" rx="6" fill="#00005B"/>
    <text x="18" y="24" textAnchor="middle" fill="#E77DFF" fontSize="15" fontWeight="bold" fontFamily="Arial,sans-serif">Pr</text>
  </svg>
);
const SeedanceSVG = () => (
  <svg viewBox="0 0 36 36" className="h-7 w-7">
    <rect width="36" height="36" rx="6" fill="#ffffff"/>
    {/* Three blue rectangles forming a W */}
    <rect x="5"  y="10" width="7" height="18" rx="1.5" fill="#1060FF"/>
    <rect x="14" y="10" width="7" height="18" rx="1.5" fill="#1060FF"/>
    <rect x="23" y="10" width="7" height="18" rx="1.5" fill="#1060FF"/>
  </svg>
);
const NanoBananaSVG = () => (
  <svg viewBox="0 0 36 36" className="h-7 w-7">
    <rect width="36" height="36" rx="6" fill="#1a1a2e"/>
    {/* Banana body */}
    <path d="M10 26 Q8 16 14 10 Q20 5 28 9 Q32 11 30 16 Q28 20 22 22 Q16 24 12 28 Z" fill="#F5C518"/>
    {/* Banana highlight */}
    <path d="M13 11 Q18 7 25 10 Q28 12 27 15 Q24 11 18 12 Q14 13 13 11Z" fill="#FFE566" opacity="0.7"/>
    {/* Banana tip top */}
    <path d="M14 10 Q13 7 15 6 Q17 5 18 7 Q16 8 14 10Z" fill="#8B6914"/>
    {/* Banana tip bottom */}
    <path d="M12 28 Q10 30 11 31 Q13 32 14 30 Q13 29 12 28Z" fill="#8B6914"/>
  </svg>
);
const MagnificSVG = () => (
  <svg viewBox="0 0 36 36" className="h-7 w-7">
    <defs>
      <linearGradient id="magnific-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#8B5CF6"/>
        <stop offset="25%"  stopColor="#3B82F6"/>
        <stop offset="50%"  stopColor="#06B6D4"/>
        <stop offset="75%"  stopColor="#F97316"/>
        <stop offset="100%" stopColor="#FBBF24"/>
      </linearGradient>
    </defs>
    <polygon points="18,4 33,30 3,30" fill="none" stroke="url(#magnific-grad)" strokeWidth="3" strokeLinejoin="round"/>
  </svg>
);

const LupaSVG = () => (
  <svg viewBox="0 0 36 36" className="h-7 w-7">
    <rect width="36" height="36" rx="6" fill="#0A0A0A"/>
    <circle cx="15" cy="15" r="9" fill="none" stroke="#A78BFA" strokeWidth="2.5"/>
    <line x1="21" y1="21" x2="31" y2="31" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="15" cy="15" r="4" fill="#A78BFA" opacity="0.25"/>
  </svg>
);
const TopazSVG = () => (
  <svg viewBox="0 0 36 36" className="h-7 w-7">
    <rect width="36" height="36" rx="6" fill="#111"/>
    <rect x="9"  y="19" width="8" height="8" rx="1" fill="white"/>
    <rect x="19" y="11" width="8" height="8" rx="1" fill="white"/>
    <rect x="19" y="21" width="4" height="4" rx="1" fill="white" opacity="0.5"/>
  </svg>
);

const ZBrushSVG = () => (
  <svg viewBox="0 0 36 36" className="h-7 w-7">
    <rect width="36" height="36" rx="6" fill="#1A1A1A"/>
    <text x="18" y="26" textAnchor="middle" fill="#CC3333" fontSize="20" fontWeight="bold" fontFamily="Arial,sans-serif">Z</text>
  </svg>
);

const tools: Tool[] = [
  { name: "Flux 2",          category: "Imagen",        logo: { type: "img", src: "/logos/flux.png" } },
  { name: "Seedreams 5",     category: "Imagen",        logo: { type: "svg", svg: <SeedanceSVG /> } },
  { name: "Nano Banana Pro", category: "Imagen",        logo: { type: "svg", svg: <NanoBananaSVG /> } },
  { name: "Nanano Banana",   category: "Imagen",        logo: { type: "svg", svg: <NanoBananaSVG /> } },
  { name: "Kling 3.5",       category: "Video",         logo: { type: "img", src: "/logos/kling.png" } },
  { name: "Kling 3.0",       category: "Video",         logo: { type: "img", src: "/logos/kling.png" } },
  { name: "Kling Control",   category: "Video",         logo: { type: "img", src: "/logos/kling.png" } },
  { name: "ElevenLabs",      category: "Audio",         logo: { type: "img", src: "/logos/elevenlabs.svg" } },
  { name: "Suno",            category: "Audio",         logo: { type: "img", src: "/logos/suno.svg" } },
  { name: "Cinema 4D",       category: "3D",            logo: { type: "img", src: "/logos/cinema4d.svg" } },
  { name: "Blender",         category: "3D",            logo: { type: "img", src: "/logos/blender.svg" } },
  { name: "ZBrush",          category: "3D",            logo: { type: "svg", svg: <ZBrushSVG /> } },
  { name: "After Effects",   category: "Post",          logo: { type: "svg", svg: <AeSVG /> } },
  { name: "Premiere Pro",    category: "Post",          logo: { type: "svg", svg: <PrSVG /> } },
  { name: "DaVinci Resolve", category: "Post",          logo: { type: "img", src: "/logos/davinciresolve.svg" } },
  { name: "Topaz",           category: "Upscaling",     logo: { type: "svg", svg: <TopazSVG /> } },
  { name: "Magnific",        category: "Upscaling",     logo: { type: "svg", svg: <MagnificSVG /> } },
  { name: "Lupa",            category: "Upscaling",     logo: { type: "svg", svg: <LupaSVG /> } },
];

// ─── Tool Pill ────────────────────────────────────────────────────────────────

function ToolPill({ tool }: { tool: Tool }) {
  return (
    <div className="group mx-3 flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/10">
      {/* Logo */}
      <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
        {tool.logo.type === "img" && tool.logo.src ? (
          <Image
            src={tool.logo.src}
            alt={tool.name}
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
            style={tool.logo.src.endsWith(".svg") ? { filter: "invert(1) brightness(2)" } : undefined}
          />
        ) : (
          tool.logo.svg
        )}
      </div>

      {/* Name + category */}
      <div>
        <p className="whitespace-nowrap text-sm font-semibold text-white/90 leading-none">
          {tool.name}
        </p>
        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-white/35">
          {tool.category}
        </p>
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

// Split tools into two rows for opposite-direction marquees
const rowA = tools.slice(0, Math.ceil(tools.length / 2));
const rowB = tools.slice(Math.ceil(tools.length / 2));

export function AIToolsSection() {
  const doubledA = [...rowA, ...rowA, ...rowA];
  const doubledB = [...rowB, ...rowB, ...rowB];

  return (
    <section className="relative overflow-hidden border-t border-border/50 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[130px]" />
      </div>

      <Container>
        <FadeInOnScroll>
          <div className="mb-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Stack Tecnológico
            </p>
            <h2 className="font-heading text-2xl font-bold tracking-tighter leading-none sm:text-3xl lg:text-4xl">
              Herramientas de producción
            </h2>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground">
              Los modelos de IA y software más avanzados del mercado para producción audiovisual profesional.
            </p>
          </div>
        </FadeInOnScroll>
      </Container>

      {/* Edge fades shared by both rows */}
      <div className="relative mt-4 space-y-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-background to-transparent" />

        {/* Row A — left to right */}
        <div className="flex overflow-hidden py-1">
          <div className="flex animate-[marquee_36s_linear_infinite]">
            {doubledA.map((tool, i) => (
              <ToolPill key={`a-${i}`} tool={tool} />
            ))}
          </div>
        </div>

        {/* Row B — right to left */}
        <div className="flex overflow-hidden py-1">
          <div className="flex animate-[marquee-reverse_42s_linear_infinite]">
            {doubledB.map((tool, i) => (
              <ToolPill key={`b-${i}`} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
