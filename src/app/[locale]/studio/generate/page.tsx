"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ChevronRight, ChevronLeft, RefreshCw, Check, Download, ZoomIn } from "lucide-react";
import { GenerationLoader } from "@/components/studio/GenerationLoader";
import { ImageLightbox } from "@/components/studio/ImageLightbox";
import { downloadImage } from "@/lib/download";
/* eslint-disable @next/next/no-img-element */

// All calls go through our API — no direct tunnel access from browser

const GENDERS = ["Mujer", "Hombre"];
const AGE_RANGES = ["Adolescente (16-22)", "Joven adulto (23-32)", "Adulto (33-45)", "Adulto mayor (46-60)", "Senior (60+)"];
const ETHNICITIES = ["Mestizo Chileno", "Europeo", "Asiático", "Afrodescendiente", "Árabe", "Indígena Latinoamericano", "Mixto"];
const HAIR_COLORS = ["Negro", "Castaño oscuro", "Castaño", "Rubio", "Pelirrojo", "Gris/Plata", "Platino"];
const HAIR_TEXTURES = ["Liso", "Ondulado", "Rizado", "Afro"];
const HAIR_CUTS = ["Sin definir", "Bob Clásico", "Pixie", "Largo suelto", "Recogido", "Trenzas", "Rapado", "Crew Cut", "Undercut"];
const HAIR_LENGTHS = ["Muy corto", "Corto", "Medio", "Largo", "Muy largo"];
const EYE_COLORS = ["Marrón oscuro", "Marrón medio", "Avellana", "Verde", "Azul claro", "Azul oscuro", "Gris"];
const EYE_SHAPES = ["Almendrados", "Redondos", "Rasgados", "Hundidos"];
const EYE_EXPRESSIONS = ["Neutral", "Calmada", "Seria", "Cálida", "Enfocada", "Intensa"];
const SKIN_TONES = ["Muy claro", "Claro", "Medio", "Oliva", "Moreno", "Oscuro"];
const FACIAL_HAIR = ["Sin vello", "Barba completa larga", "Barba completa media", "Barba completa corta", "Barba de candado", "Bigote solo", "Bigote + candado", "Barba de 3 días"];
const NOSE_SIZES = ["Pequeña", "Media", "Grande"];
const NOSE_WIDTHS = ["Estrecha", "Media", "Ancha"];
const NOSE_BRIDGES = ["Alto", "Medio", "Bajo", "Recto", "Arqueado"];
const LIP_SIZES = ["Finos", "Medios", "Gruesos", "Muy gruesos"];
const LIP_SHAPES = ["Rectos", "Arco cupido definido", "Arco cupido sutil", "Inferior más grueso", "Superior más grueso", "Iguales"];
const EYEBROW_THICKNESS = ["Finas", "Medias", "Gruesas"];
const EYEBROW_SHAPES = ["Rectas", "Arqueadas", "Angulosas", "Redondeadas", "Ascendentes"];
const EYEBROW_DENSITY = ["Ralas", "Normales", "Pobladas", "Muy pobladas"];
const EXPRESSIONS = ["Neutral", "Sonrisa suave", "Sonrisa amplia", "Seria", "Confiada", "Pensativa", "Relajada", "Alegre"];
const LIGHTINGS = ["Rembrandt", "Butterfly", "Loop", "Split", "Broad", "Short", "Natural suave", "Flat (sin sombras)"];

const WARDROBE_PRESETS = [
  "Athleisure", "Avant-Garde", "Business Elegant", "Business Professional",
  "Cocktail Ready", "Corporate Casual", "Evening Elegant", "Executive Suit",
  "Layered Casual", "Minimalist Fashion", "Night Out", "Smart Business",
  "Smart Casual", "Sporty Active", "Streetwear Premium", "Summer Casual",
  "Urban Streetwear", "Vintage Retro", "Weekend Relaxed", "Yoga Casual",
];

type Phase = "config" | "step1-loading" | "step1-review" | "step2-select" | "step2-loading" | "step2-review" | "step3-loading" | "step3-review";

function SelectGrid({ options, value, onChange, columns = 3 }: {
  options: string[]; value: string; onChange: (v: string) => void; columns?: number;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className={`rounded-lg border px-3 py-2 text-sm transition-all ${
            value === opt ? "border-primary bg-primary/10 text-primary font-medium" : "border-[#222] hover:border-primary/50 hover:bg-[#1e1e1e]"
          }`}>{opt}</button>
      ))}
    </div>
  );
}

export default function GeneratePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [phase, setPhase] = useState<Phase>("config");
  const [error, setError] = useState("");
  const [configStep, setConfigStep] = useState(0); // 0=demo, 1=pelo, 2=rostro, 3=composicion

  // Form state
  const [form, setForm] = useState({
    gender: "", ageRange: "", ethnicity: "",
    hairTexture: "", hairCut: "", hairLength: "", hairColor: "",
    eyeShape: "", eyeColor: "", eyeExpression: "", skinTone: "", skinSubtone: "",
    facialHair: "", noseSize: "", noseWidth: "", noseBridge: "",
    lipSize: "", lipShape: "",
    eyebrowThickness: "", eyebrowShape: "", eyebrowDensity: "",
    expression: "", lighting: "",
  });
  const [wardrobePreset, setWardrobePreset] = useState("");
  const [generationId, setGenerationId] = useState("");

  // Image results
  const [step1Image, setStep1Image] = useState("");
  const [step2Image, setStep2Image] = useState("");
  const [step3Image, setStep3Image] = useState("");
  const [lightboxSrc, setLightboxSrc] = useState("");

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const isLoading = phase.includes("loading");

  // Prevent accidental navigation during generation
  useEffect(() => {
    if (!isLoading) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isLoading]);
  // --- Helpers ---

  async function finishGeneration() {
    await updateStatus(generationId, "completed");
    router.push(`/${locale}/studio/history/${generationId}`);
  }

  async function updateStatus(genId: string, status: string, image?: string, step?: number) {
    await fetch(`/api/studio/generations/${genId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        imageUrl: image ? `/api/studio/images/${image}` : undefined,
        imageStep: step,
        imageFilename: image,
      }),
    }).catch(() => {});
  }

  // --- API calls ---

  async function startStep1() {
    if (!confirm("Se descontará 1 crédito. ¿Continuar?")) return;
    setPhase("step1-loading");
    setError("");
    try {
      // Deduct credit via our API
      const apiRes = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, wardrobePreset: wardrobePreset || "Smart Casual" }),
      });
      const apiData = await apiRes.json();
      if (!apiRes.ok) { setError(apiData.error); setPhase("config"); return; }
      setGenerationId(apiData.generationId);

      // Call pipeline runner step 1
      const res = await fetch(`/api/studio/step1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId: apiData.generationId, ...form }),
      });
      const data = await res.json();
      if (data.success) {
        setStep1Image(`/api/studio/images/${data.image}`);
        await updateStatus(apiData.generationId, "step1", data.image, 1);
        setPhase("step1-review");
      } else {
        await updateStatus(apiData.generationId, "failed");
        setError(data.error || "Error generando retrato");
        setPhase("config");
      }
    } catch (e) {
      setError("Error de conexión con el servidor");
      setPhase("config");
    }
  }

  async function regenerateStep1() {
    setPhase("step1-loading");
    setError("");
    try {
      const res = await fetch(`/api/studio/step1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId, ...form }),
      });
      const data = await res.json();
      if (data.success) {
        setStep1Image(`/api/studio/images/${data.image}`);
        await updateStatus(generationId, "step1", data.image, 1);
        setPhase("step1-review");
      } else { setError(data.error); setPhase("step1-review"); }
    } catch { setError("Error de conexión"); setPhase("step1-review"); }
  }

  async function startStep2() {
    setPhase("step2-loading");
    setError("");
    try {
      const inputImage = step1Image.split("/images/")[1];
      const res = await fetch(`/api/studio/step2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId, inputImage, wardrobePreset, gender: form.gender }),

      });
      const data = await res.json();
      if (data.success) {
        setStep2Image(`/api/studio/images/${data.image}`);
        await updateStatus(generationId, "step2", data.image, 2);
        setPhase("step2-review");
      } else { setError(data.error); setPhase("step2-select"); }
    } catch { setError("Error de conexión"); setPhase("step2-select"); }
  }

  async function startStep3() {
    setPhase("step3-loading");
    setError("");
    try {
      const inputImage = step2Image.split("/images/")[1];
      const res = await fetch(`/api/studio/step3`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId, inputImage }),

      });
      const data = await res.json();
      if (data.success) {
        setStep3Image(`/api/studio/images/${data.image}`);
        await updateStatus(generationId, "completed", data.image, 3);
        setPhase("step3-review");
      } else { setError(data.error); setPhase("step2-review"); }
    } catch { setError("Error de conexión"); setPhase("step2-review"); }
  }

  // --- Render ---

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Crear Avatar</h1>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      {/* === PHASE: Config === */}
      {phase === "config" && (
        <>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setConfigStep(0)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${configStep === 0 ? "bg-primary text-primary-foreground" : "bg-[#1e1e1e] text-white/40"}`}>
              1. Demografía
            </button>
            <button onClick={() => setConfigStep(1)} disabled={!form.gender}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${configStep === 1 ? "bg-primary text-primary-foreground" : "bg-[#1e1e1e] text-white/40"} disabled:opacity-30`}>
              2. Pelo
            </button>
            <button onClick={() => setConfigStep(2)} disabled={!form.gender}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${configStep === 2 ? "bg-primary text-primary-foreground" : "bg-[#1e1e1e] text-white/40"} disabled:opacity-30`}>
              3. Rostro
            </button>
            <button onClick={() => setConfigStep(3)} disabled={!form.gender}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${configStep === 3 ? "bg-primary text-primary-foreground" : "bg-[#1e1e1e] text-white/40"} disabled:opacity-30`}>
              4. Composición
            </button>
          </div>
          <p className="text-xs text-white/30">Solo la demografía es obligatoria. El resto es opcional.</p>

          <div className="rounded-xl border border-[#222] bg-[#1a1a1a] p-6 space-y-6">
            {/* Tab 1: Demografía */}
            {configStep === 0 && (<>
              <div><h3 className="mb-3 text-sm font-medium">Género</h3><SelectGrid options={GENDERS} value={form.gender} onChange={v => set("gender", v)} columns={2} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Rango de edad</h3><SelectGrid options={AGE_RANGES} value={form.ageRange} onChange={v => set("ageRange", v)} columns={2} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Etnia / Rasgos</h3><SelectGrid options={ETHNICITIES} value={form.ethnicity} onChange={v => set("ethnicity", v)} columns={2} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Tono de piel</h3><SelectGrid options={SKIN_TONES} value={form.skinTone} onChange={v => set("skinTone", v)} /></div>
            </>)}

            {/* Tab 2: Pelo */}
            {configStep === 1 && (<>
              <div><h3 className="mb-3 text-sm font-medium">Color de cabello</h3><SelectGrid options={HAIR_COLORS} value={form.hairColor} onChange={v => set("hairColor", v)} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Textura</h3><SelectGrid options={HAIR_TEXTURES} value={form.hairTexture} onChange={v => set("hairTexture", v)} columns={4} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Corte</h3><SelectGrid options={HAIR_CUTS} value={form.hairCut} onChange={v => set("hairCut", v)} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Largo</h3><SelectGrid options={HAIR_LENGTHS} value={form.hairLength} onChange={v => set("hairLength", v)} columns={5} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Vello facial</h3><SelectGrid options={FACIAL_HAIR} value={form.facialHair} onChange={v => set("facialHair", v)} columns={2} /></div>
            </>)}

            {/* Tab 3: Rostro */}
            {configStep === 2 && (<>
              <div><h3 className="mb-3 text-sm font-medium">Forma de ojos</h3><SelectGrid options={EYE_SHAPES} value={form.eyeShape} onChange={v => set("eyeShape", v)} columns={4} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Color de ojos</h3><SelectGrid options={EYE_COLORS} value={form.eyeColor} onChange={v => set("eyeColor", v)} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Expresión de ojos</h3><SelectGrid options={EYE_EXPRESSIONS} value={form.eyeExpression} onChange={v => set("eyeExpression", v)} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Tamaño de nariz</h3><SelectGrid options={NOSE_SIZES} value={form.noseSize} onChange={v => set("noseSize", v)} columns={3} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Anchura de nariz</h3><SelectGrid options={NOSE_WIDTHS} value={form.noseWidth} onChange={v => set("noseWidth", v)} columns={3} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Puente nasal</h3><SelectGrid options={NOSE_BRIDGES} value={form.noseBridge} onChange={v => set("noseBridge", v)} columns={5} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Tamaño de labios</h3><SelectGrid options={LIP_SIZES} value={form.lipSize} onChange={v => set("lipSize", v)} columns={4} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Forma de labios</h3><SelectGrid options={LIP_SHAPES} value={form.lipShape} onChange={v => set("lipShape", v)} columns={3} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Grosor de cejas</h3><SelectGrid options={EYEBROW_THICKNESS} value={form.eyebrowThickness} onChange={v => set("eyebrowThickness", v)} columns={3} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Forma de cejas</h3><SelectGrid options={EYEBROW_SHAPES} value={form.eyebrowShape} onChange={v => set("eyebrowShape", v)} columns={5} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Densidad de cejas</h3><SelectGrid options={EYEBROW_DENSITY} value={form.eyebrowDensity} onChange={v => set("eyebrowDensity", v)} columns={4} /></div>
            </>)}

            {/* Tab 4: Composición */}
            {configStep === 3 && (<>
              <div><h3 className="mb-3 text-sm font-medium">Expresión facial</h3><SelectGrid options={EXPRESSIONS} value={form.expression} onChange={v => set("expression", v)} columns={2} /></div>
              <div><h3 className="mb-3 text-sm font-medium">Iluminación</h3><SelectGrid options={LIGHTINGS} value={form.lighting} onChange={v => set("lighting", v)} columns={2} /></div>
            </>)}
          </div>

          <div className="flex justify-end">
            <button onClick={startStep1} disabled={!form.gender || !form.ageRange || !form.ethnicity}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              <Sparkles className="h-4 w-4" /> Generar Retrato
            </button>
          </div>
        </>
      )}

      {/* === PHASE: Step 1 Loading === */}
      {phase === "step1-loading" && (
        <GenerationLoader
          title="Generando retrato base"
          duration={20}
          messages={[
            "Cargando modelo Z-Image Turbo...",
            "Construyendo rasgos faciales...",
            "Aplicando iluminación de estudio...",
            "Renderizando en alta resolución...",
            "Casi listo...",
          ]}
        />
      )}

      {/* === PHASE: Step 1 Review === */}
      {phase === "step1-review" && (
        <>
          <div className="flex justify-center">
            <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#222] bg-[#1a1a1a]" onClick={() => setLightboxSrc(step1Image)}>
              <div className="border-b border-[#222] px-4 py-2.5 text-sm font-medium">Retrato base</div>
              <img src={step1Image} alt="Retrato base" className="block w-auto max-h-[60vh]" />
              <div className="absolute inset-0 top-10 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/10 group-hover:opacity-100">
                <ZoomIn className="h-6 w-6 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => { setPhase("config"); setStep1Image(""); }} className="inline-flex items-center gap-2 rounded-lg border border-[#222] px-4 py-2 text-sm text-white/40 hover:bg-[#1e1e1e]">
                <ChevronLeft className="h-4 w-4" /> Reconfigurar
              </button>
              <button onClick={regenerateStep1} className="inline-flex items-center gap-2 rounded-lg border border-[#222] px-4 py-2 text-sm hover:bg-[#1e1e1e]">
                <RefreshCw className="h-4 w-4" /> Regenerar
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={finishGeneration} className="inline-flex items-center gap-2 rounded-lg border border-[#222] px-4 py-2 text-sm text-white/40 hover:bg-[#1e1e1e]">
                Finalizar sin vestuario
              </button>
              <button onClick={() => setPhase("step2-select")} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Check className="h-4 w-4" /> Elegir vestuario
              </button>
            </div>
          </div>
        </>
      )}

      {/* === PHASE: Step 2 Select Wardrobe === */}
      {phase === "step2-select" && (
        <>
          <div className="flex gap-4">
            <div className="w-32 shrink-0">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-[#222] bg-[#1e1e1e]">
                <img src={step1Image} alt="Base" className="h-full w-full object-cover" />
              </div>
              <p className="mt-1 text-center text-xs text-white/40">Tu avatar</p>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="font-medium">Elige el vestuario</h3>
              <SelectGrid options={WARDROBE_PRESETS} value={wardrobePreset} onChange={setWardrobePreset} columns={2} />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={startStep2} disabled={!wardrobePreset}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              <Sparkles className="h-4 w-4" /> Aplicar vestuario
            </button>
          </div>
        </>
      )}

      {/* === PHASE: Step 2 Loading === */}
      {phase === "step2-loading" && (
        <GenerationLoader
          title={`Aplicando vestuario — ${wardrobePreset}`}
          duration={90}
          messages={[
            "Analizando rasgos del personaje...",
            "Gemini 3 Pro procesando identidad facial...",
            "Generando descripción del outfit...",
            "Seedream 4.5 creando imagen de cuerpo completo...",
            "Preservando identidad facial...",
            "Aplicando vestuario al personaje...",
            "Renderizando en alta resolución (1440x2560)...",
            "Últimos detalles...",
          ]}
        />
      )}

      {/* === PHASE: Step 2 Review === */}
      {phase === "step2-review" && (
        <>
          <div className="flex justify-center gap-4">
            <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#222] bg-[#1a1a1a]" onClick={() => setLightboxSrc(step1Image)}>
              <div className="border-b border-[#222] px-3 py-2 text-xs font-medium text-white/40">Antes</div>
              <img src={step1Image} alt="Base" className="block w-auto max-h-[55vh]" />
              <div className="absolute inset-0 top-8 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/10 group-hover:opacity-100">
                <ZoomIn className="h-5 w-5 text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-primary/30 bg-[#1a1a1a]" onClick={() => setLightboxSrc(step2Image)}>
              <div className="border-b border-primary/30 px-3 py-2 text-xs font-medium text-primary">{wardrobePreset}</div>
              <img src={step2Image} alt="Con vestuario" className="block w-auto max-h-[55vh]" />
              <div className="absolute inset-0 top-8 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/10 group-hover:opacity-100">
                <ZoomIn className="h-5 w-5 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => setPhase("step2-select")} className="inline-flex items-center gap-2 rounded-lg border border-[#222] px-4 py-2 text-sm hover:bg-[#1e1e1e]">
              <RefreshCw className="h-4 w-4" /> Cambiar vestuario
            </button>
            <div className="flex items-center gap-2">
              <button onClick={finishGeneration} className="inline-flex items-center gap-2 rounded-lg border border-[#222] px-4 py-2 text-sm text-white/40 hover:bg-[#1e1e1e]">
                Finalizar sin sesión
              </button>
              <button onClick={startStep3} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Check className="h-4 w-4" /> Sesión de fotos
              </button>
            </div>
          </div>
        </>
      )}

      {/* === PHASE: Step 3 Loading === */}
      {phase === "step3-loading" && (
        <GenerationLoader
          title="Generando sesión de fotos — 9 poses"
          duration={120}
          messages={[
            "Preparando contact sheet...",
            "Gemini 3 Pro analizando personaje...",
            "Definiendo 9 poses y locaciones...",
            "Calculando ángulos de cámara...",
            "Generando variaciones de iluminación...",
            "Nano Banana Pro renderizando grid...",
            "Manteniendo consistencia de identidad...",
            "Procesando poses 1-3...",
            "Procesando poses 4-6...",
            "Procesando poses 7-9...",
            "Finalizando composición...",
          ]}
        />
      )}

      {/* === PHASE: Step 3 Review (Final) === */}
      {phase === "step3-review" && (
        <>
          <div className="flex items-center gap-3 rounded-lg border border-green-800 bg-green-900/20 px-4 py-3">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-300">Avatar completado</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Retrato", src: step1Image, file: "retrato.png", position: "object-center" },
              { label: "Vestuario", src: step2Image, file: "vestuario.png", position: "object-top" },
              { label: "Sesión", src: step3Image, file: "sesion.png", position: "object-center" },
            ].map((item) => (
              <div key={item.label} className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-[#222] bg-black" onClick={() => setLightboxSrc(item.src)}>
                <img
                  src={item.src}
                  alt={item.label}
                  className={`absolute inset-0 h-full w-full object-cover ${item.position}`}
                />
                {/* Overlay con label + acciones */}
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-10">
                  <span className="text-xs font-medium text-white">{item.label}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setLightboxSrc(item.src); }}
                      className="rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                      title="Ampliar"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadImage(item.src, item.file); }}
                      className="rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                      title="Descargar"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href={`/${locale}/studio/history/${generationId}`} className="rounded-lg border border-[#333] px-5 py-2.5 text-sm text-white/60 hover:bg-white/[0.04] hover:text-white/80">
              Ver en historial
            </Link>
            <Link href={`/${locale}/studio/generate`} onClick={() => { setPhase("config"); setStep1Image(""); setStep2Image(""); setStep3Image(""); setGenerationId(""); setError(""); }}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
              Crear otro avatar
            </Link>
          </div>
        </>
      )}

      {lightboxSrc && <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc("")} />}
    </div>
  );
}
