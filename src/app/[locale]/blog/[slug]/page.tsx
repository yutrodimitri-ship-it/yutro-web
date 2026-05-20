export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPosts } from "@/data/blog";
import { createMetadata } from "@/lib/metadata";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yutro.cl";

/* ─── Tertulias IA (ES) ─── */
function TertuliasIAContent() {
  return (
    <div className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
      <p className="text-lg leading-relaxed font-medium">
        El pasado 27 de marzo, Yutro participó en <strong>Tertulias IA</strong>, una jornada de conversación e intercambio organizada por la <strong>Universidad Mayor</strong> en torno al estado actual de la inteligencia artificial creativa en Chile. Una tarde de 7 horas, 12 panelistas y más de 2.400 impresiones en LinkedIn que dejó en claro que la conversación sobre IA en la industria está lejos de agotarse.
      </p>

      <h2>El evento</h2>
      <p>
        Tertulias IA reunió a profesionales de distintas disciplinas —diseño, publicidad, audiovisual, educación y tecnología— para compartir experiencias reales con herramientas de inteligencia artificial generativa. No fue una conferencia de expertos hablando desde el escenario: fue una conversación horizontal donde cada panelista compartió su práctica concreta, sus errores y sus descubrimientos.
      </p>
      <p>
        El formato funcionó. La sala se mantuvo activa durante toda la jornada, con preguntas que desbordaron el tiempo asignado y conversaciones que continuaron en los pasillos.
      </p>

      <h2>Lo que presentamos: casting digital con ComfyUI</h2>
      <p>
        Desde Yutro presentamos nuestro flujo de trabajo para <strong>casting digital de personajes</strong> usando <strong>ComfyUI</strong>. El problema que resolvemos es uno de los más frustrantes de la producción con IA generativa: ¿cómo mantener un mismo personaje consistente a través de múltiples imágenes, ángulos y situaciones?
      </p>
      <p>
        La respuesta corta es que no hay un solo modelo que lo haga bien por defecto. La respuesta larga es el flujo que mostramos: combinación de IP-Adapter, ControlNet y prompting estructurado para anclar identidad visual sin sacrificar variedad compositiva.
      </p>

      <blockquote>
        &ldquo;El casting digital no reemplaza al casting real. Lo que hace es abrir una etapa de preproducción que antes no existía: podés explorar 40 perfiles de personaje en una tarde y llegar a la reunión con el cliente con opciones concretas, no con ideas.&rdquo;
        <cite>— Milivoy Yutronic, Yutro</cite>
      </blockquote>

      <h3>Los tres momentos del flujo</h3>
      <p>El flujo que presentamos tiene tres momentos diferenciados:</p>
      <ol>
        <li>
          <strong>Definición de identidad:</strong> se trabaja con imágenes de referencia reales o generadas para establecer los rasgos que deben mantenerse. Esto incluye estructura facial, colorimetría de piel, tipo de cabello y expresión base.
        </li>
        <li>
          <strong>Generación con ancla:</strong> usando IP-Adapter en ComfyUI, se conecta esa identidad a nuevas generaciones. El personaje puede cambiar de ropa, fondo, iluminación y pose manteniendo coherencia reconocible.
        </li>
        <li>
          <strong>Validación de consistencia:</strong> se genera una batería de pruebas —distintos ángulos, diferentes contextos, variaciones de luz— para evaluar cuánto se sostiene la identidad antes de llevar el personaje a producción.
        </li>
      </ol>

      <h2>Lo que aprendimos escuchando a los otros panelistas</h2>
      <p>Además de presentar, escuchamos. Y eso fue igual de valioso. Algunos temas que resonaron durante la jornada:</p>
      <ul>
        <li>La brecha entre lo que las agencias prometen a sus clientes con IA y lo que realmente pueden entregar sigue siendo grande.</li>
        <li>Los flujos de trabajo más efectivos no son los más sofisticados: son los que el equipo entiende y puede reproducir.</li>
        <li>La pregunta sobre autoría e identidad de los personajes generados empieza a volverse urgente para las marcas.</li>
        <li>ComfyUI sigue siendo la herramienta más potente para trabajo profesional, pero la curva de entrada aleja a muchos equipos creativos.</li>
      </ul>

      <h2>Los números del evento</h2>
      <div className="not-prose my-8 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-primary">12</p>
          <p className="mt-1 text-sm text-muted-foreground">panelistas</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-primary">+2.400</p>
          <p className="mt-1 text-sm text-muted-foreground">impresiones LinkedIn</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-primary">7 hrs</p>
          <p className="mt-1 text-sm text-muted-foreground">de jornada</p>
        </div>
      </div>

      <h2>¿Por qué vale la pena participar en estos espacios?</h2>
      <p>
        La IA generativa avanza rápido y la mayoría de ese avance ocurre en comunidades online dispersas. Eventos como Tertulias IA hacen algo que ningún tutorial de YouTube puede hacer: ponen a las personas en la misma sala y generan conversación real sobre práctica real.
      </p>
      <p>
        Para Yutro, participar en estos espacios es parte de cómo construimos conocimiento. No solo mostramos lo que hacemos: escuchamos cómo otros están resolviendo los mismos problemas que nosotros. Eso siempre vuelve en forma de mejores proyectos.
      </p>

      <div className="not-prose mt-8 flex flex-wrap gap-2">
        {["ComfyUI", "Casting Digital", "Tertulias IA", "Universidad Mayor", "IA Generativa", "IP-Adapter", "ControlNet", "Influencers Digitales"].map((tag) => (
          <span key={tag} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Tertulias IA (EN) ─── */
function TertuliasIAContentEN() {
  return (
    <div className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
      <p className="text-lg leading-relaxed font-medium">
        On March 27, Yutro participated in <strong>Tertulias IA</strong>, a conversation and exchange event organized by <strong>Universidad Mayor</strong> focused on the current state of creative artificial intelligence in Chile. A 7-hour day with 12 panelists and over 2,400 LinkedIn impressions — a clear sign that the industry&apos;s conversation around AI is far from exhausted.
      </p>

      <h2>The event</h2>
      <p>
        Tertulias IA brought together professionals from different disciplines — design, advertising, audiovisual production, education, and technology — to share real experiences with generative AI tools. It wasn&apos;t a conference with experts speaking from a stage: it was a horizontal conversation where each panelist shared their concrete practice, their mistakes, and their discoveries.
      </p>
      <p>
        The format worked. The room stayed active throughout the entire day, with questions overflowing the allotted time and conversations continuing in the hallways.
      </p>

      <h2>What we presented: digital casting with ComfyUI</h2>
      <p>
        From Yutro, we presented our workflow for <strong>digital character casting</strong> using <strong>ComfyUI</strong>. The problem we solve is one of the most frustrating in AI generative production: how do you keep the same character consistent across multiple images, angles, and situations?
      </p>
      <p>
        The short answer is that no single model does this well by default. The long answer is the workflow we showed: a combination of IP-Adapter, ControlNet, and structured prompting to anchor visual identity without sacrificing compositional variety.
      </p>

      <blockquote>
        &ldquo;Digital casting doesn&apos;t replace real casting. What it does is open a pre-production stage that didn&apos;t exist before: you can explore 40 character profiles in an afternoon and arrive at the client meeting with concrete options, not just ideas.&rdquo;
        <cite>— Milivoy Yutronic, Yutro</cite>
      </blockquote>

      <h3>The three stages of the workflow</h3>
      <p>The workflow we presented has three distinct stages:</p>
      <ol>
        <li>
          <strong>Identity definition:</strong> we work with real or generated reference images to establish the features that must be maintained. This includes facial structure, skin colorimetry, hair type, and base expression.
        </li>
        <li>
          <strong>Anchored generation:</strong> using IP-Adapter in ComfyUI, that identity is connected to new generations. The character can change outfit, background, lighting, and pose while maintaining recognizable coherence.
        </li>
        <li>
          <strong>Consistency validation:</strong> a battery of tests is generated — different angles, contexts, and lighting variations — to evaluate how well the identity holds up before taking the character into production.
        </li>
      </ol>

      <h2>What we learned listening to other panelists</h2>
      <p>Beyond presenting, we listened. And that was equally valuable. Some themes that resonated throughout the day:</p>
      <ul>
        <li>The gap between what agencies promise clients with AI and what they can actually deliver remains large.</li>
        <li>The most effective workflows aren&apos;t the most sophisticated ones — they&apos;re the ones the team understands and can reproduce.</li>
        <li>The question of authorship and identity of generated characters is becoming urgent for brands.</li>
        <li>ComfyUI remains the most powerful tool for professional work, but the entry curve pushes many creative teams away.</li>
      </ul>

      <h2>Event numbers</h2>
      <div className="not-prose my-8 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-primary">12</p>
          <p className="mt-1 text-sm text-muted-foreground">panelists</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-primary">+2,400</p>
          <p className="mt-1 text-sm text-muted-foreground">LinkedIn impressions</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-primary">7 hrs</p>
          <p className="mt-1 text-sm text-muted-foreground">of programming</p>
        </div>
      </div>

      <h2>Why these spaces matter</h2>
      <p>
        Generative AI moves fast, and most of that movement happens in scattered online communities. Events like Tertulias IA do something no YouTube tutorial can: they put people in the same room and generate real conversation about real practice.
      </p>
      <p>
        For Yutro, participating in these spaces is part of how we build knowledge. We don&apos;t just show what we do — we listen to how others are solving the same problems we face. That always comes back in the form of better projects.
      </p>

      <div className="not-prose mt-8 flex flex-wrap gap-2">
        {["ComfyUI", "Digital Casting", "Tertulias IA", "Universidad Mayor", "Generative AI", "IP-Adapter", "ControlNet", "Digital Influencers"].map((tag) => (
          <span key={tag} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Seedance 2.0 (ES) ─── */
function SeedanceContent() {
  return (
    <div className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
      <p className="text-lg leading-relaxed font-medium border-l-3 border-primary pl-5">
        ByteDance lanzó Seedance 2.0 en febrero de 2026 y en menos de 48 horas ya había generado clips tan realistas de Tom Cruise peleando con Brad Pitt que Hollywood reaccionó con cartas de cese. El lanzamiento global se pausó, se rediseñaron los filtros y hoy el modelo está disponible en CapCut y Dreamina — con el Elo más alto del mundo en generación de video.
      </p>

      {/* Stats */}
      <div className="not-prose my-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-2xl font-bold text-primary">Elo 1.269</p>
          <p className="mt-1 text-xs text-muted-foreground">text-to-video — #1 mundial</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-2xl font-bold text-primary">Elo 1.351</p>
          <p className="mt-1 text-xs text-muted-foreground">image-to-video — #1 mundial</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-2xl font-bold text-primary">15 seg</p>
          <p className="mt-1 text-xs text-muted-foreground">duración máx. · 1080p</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-2xl font-bold text-primary">12 refs</p>
          <p className="mt-1 text-xs text-muted-foreground">inputs multimodales</p>
        </div>
      </div>

      <h2>Qué es Seedance 2.0 y por qué importa</h2>
      <p>
        Seedance 2.0 es el modelo de generación de video de ByteDance — la empresa detrás de TikTok — lanzado el 10 de febrero de 2026. No es una actualización incremental: usa una arquitectura Dual-Branch Diffusion Transformer que genera audio y video de forma simultánea y nativa, algo que ningún competidor de la misma categoría hacía antes. Acepta hasta 12 archivos de referencia en una sola generación: 9 imágenes, 3 videos y 3 audios.
      </p>
      <p>
        Los analistas lo llamaron el &ldquo;momento DeepSeek para el video con IA&rdquo;: al igual que DeepSeek sacudió el mercado de los LLMs, Seedance 2.0 provocó caídas en acciones tecnológicas de EE.UU. y subidas en bolsas chinas. En el benchmark de Artificial Analysis, superó a Google Veo 3, OpenAI Sora 2 y Runway Gen-4.5 en las dos categorías principales.
      </p>

      <div className="not-prose my-8 rounded-lg border-l-3 border-primary bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Por qué es diferente técnicamente</p>
        <p className="text-sm leading-relaxed">
          La mayoría de los modelos generan video silencioso y añaden audio en postproducción. Seedance 2.0 genera ambos en el mismo paso, con sincronización labial nativa en más de 8 idiomas. Además, su sistema @ permite referenciar personajes, movimiento, cámara y sonido por separado — control a nivel de director, no de usuario de prompt.
        </p>
      </div>

      <h2>La cronología del escándalo</h2>

      <div className="not-prose my-6 border-l-2 border-border ml-3 pl-6 space-y-6">
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-primary bg-background" />
          <p className="text-xs font-mono text-primary">7 feb 2026</p>
          <p className="text-sm mt-1">Beta limitada en China. En menos de 48 horas se viralizan clips de Tom Cruise peleando con Brad Pitt, personajes de Friends como nutrias, y Will Smith en batalla con un monstruo de espagueti.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-border bg-background" />
          <p className="text-xs font-mono text-primary">10 feb 2026</p>
          <p className="text-sm mt-1">Lanzamiento oficial. El guionista de Deadpool &amp; Wolverine, Rhett Reese, publica en redes: &ldquo;Odio decirlo. Probablemente se acabó para nosotros.&rdquo; La Motion Picture Association exige a ByteDance que cese la actividad infractora.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-border bg-background" />
          <p className="text-xs font-mono text-primary">13 feb 2026</p>
          <p className="text-sm mt-1">Disney envía carta de cese y desistimiento acusando a ByteDance de &ldquo;robo virtual de IP de Disney&rdquo;. Paramount Skydance suma acusaciones por Star Trek, South Park y Dora the Explorer.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-border bg-background" />
          <p className="text-xs font-mono text-primary">16 feb 2026</p>
          <p className="text-sm mt-1">ByteDance declara que &ldquo;respeta los derechos de propiedad intelectual&rdquo; y anuncia refuerzo de filtros. Restringe temporalmente inputs con rostros reales.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-border bg-background" />
          <p className="text-xs font-mono text-primary">16 mar 2026</p>
          <p className="text-sm mt-1">Los senadores estadounidenses Marsha Blackburn y Peter Welch exigen por carta al CEO Liang Rubo el cierre inmediato de Seedance, calificándolo como &ldquo;el ejemplo más flagrante de infracción de copyright de un producto ByteDance hasta la fecha&rdquo;.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-border bg-background" />
          <p className="text-xs font-mono text-primary">15–25 mar 2026</p>
          <p className="text-sm mt-1">Pausa del lanzamiento global mientras ingenieros y abogados rediseñan los filtros de IP. Se implementa red-teaming con empresa tercera y watermarks invisibles estándar C2PA.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-primary bg-background" />
          <p className="text-xs font-mono text-primary">26 mar 2026</p>
          <p className="text-sm mt-1">Relanzamiento en CapCut para Brasil, Indonesia, México, Filipinas, Tailandia y Vietnam. Dos días después de que OpenAI cerrara su app Sora, dejando el mercado de video IA cada vez más dominado por empresas chinas.</p>
        </div>
      </div>

      <h2>Por qué reaccionó tan fuerte Hollywood</h2>
      <p>
        El problema no era solo la calidad — era la precisión. Un creador de contenido que subió una foto de la entrada de su empresa descubrió que el modelo generó el otro lado del edificio (que nunca había fotografiado) y replicó su voz con exactitud. Eso no es un filtro creativo: es identidad generada sin consentimiento.
      </p>

      <blockquote>
        <p>&ldquo;En poco tiempo, una persona va a poder sentarse frente a un computador y crear una película indistinguible de lo que Hollywood produce hoy.&rdquo;</p>
        <cite>— Rhett Reese, guionista de Deadpool &amp; Wolverine y Zombieland</cite>
      </blockquote>

      <p>
        La pregunta que también surgió entre profesionales del sector fue técnica: ¿los clips virales eran generación pura o workflows de video-a-video con green screen de stuntmen? Seedance mostraba ejemplos de workflows R2V en su sitio, lo que sugiere que parte del impacto visual puede venir de referencias de video reales — algo relevante para quienes evalúen el modelo para producción.
      </p>

      <h2>Qué puede hacer hoy el modelo</h2>

      <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: "Resolución máxima", value: "1080p (demo hasta 2K en versión china)" },
          { label: "Duración máxima", value: "15 segundos · 6 aspect ratios" },
          { label: "Inputs simultáneos", value: "9 imágenes + 3 videos + 3 audios + texto" },
          { label: "Audio nativo", value: "Sí — lip-sync en 8+ idiomas, incluido español" },
          { label: "Dónde acceder", value: "CapCut, Dreamina, Pippit · API vía plataformas terceras" },
          { label: "Restricciones actuales", value: "Sin generación de rostros reales · Sin IP no autorizada · No disponible en EE.UU. aún" },
        ].map((spec) => (
          <div key={spec.label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">{spec.label}</p>
            <p className="text-sm">{spec.value}</p>
          </div>
        ))}
      </div>

      <h2>El panorama competitivo en abril 2026</h2>
      <p>
        Seedance 2.0 lidera en control multimodal y benchmarks, pero el mercado tiene cuatro opciones serias con roles distintos. Esta es la lectura práctica para quien produce:
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Modelo</th>
              <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Fortaleza principal</th>
              <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Mejor para</th>
              <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Precio ref.</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-3 font-medium">Seedance 2.0 <span className="inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">#1 Elo</span></td>
              <td className="p-3">Control multimodal · audio nativo · consistencia narrativa</td>
              <td className="p-3">Publicidad, musicales, trabajo con plantillas</td>
              <td className="p-3">Variable · API terceros</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-3 font-medium">Kling 3.0</td>
              <td className="p-3">Movimiento humano · videos hasta 3 min · precio bajo</td>
              <td className="p-3">Redes sociales · prototipado rápido · volumen</td>
              <td className="p-3">~$7/mes</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-3 font-medium">Veo 3.1</td>
              <td className="p-3">Fotorrealismo · 4K 60fps · ciencia de color</td>
              <td className="p-3">Entregables finales · producción premium</td>
              <td className="p-3">$250/mes</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Runway Gen-4.5</td>
              <td className="p-3">Herramientas de edición profesional · integración postpro</td>
              <td className="p-3">Flujos de postproducción · cineastas</td>
              <td className="p-3">$12–76/mes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        El dato más relevante del mercado en este momento: OpenAI cerró su app Sora el 24 de marzo de 2026, dos días antes del relanzamiento de Seedance. El espacio de video IA está quedando dominado por empresas chinas — ByteDance y Kuaishou — y Google. Los jugadores occidentales van retrasados.
      </p>

      <blockquote>
        <p>&ldquo;Muchos equipos de producción ya usan múltiples modelos: Seedance 2.0 para trabajo basado en referencias y plantillas, Kling 3.0 para prototipado rápido, y Veo 3.1 para entregas finales.&rdquo;</p>
        <cite>— WaveSpeed AI, comparativa de modelos de video 2026</cite>
      </blockquote>

      <h2>¿Llegó otro modelo que lo supera?</h2>
      <p>
        No todavía. A abril de 2026, Seedance 2.0 mantiene el Elo más alto en ambas categorías según Artificial Analysis, por encima de Veo 3, Sora 2 y Runway Gen-4.5. Kling 3.0 es el competidor más cercano en calidad general y lo supera en precio y disponibilidad de API.
      </p>
      <p>
        Lo que sí es claro es que el ciclo de actualización en este espacio es de semanas, no de meses. La ventaja de Seedance hoy no es garantía de nada en 60 días. Para quien trabaja en producción, el movimiento inteligente no es casarse con un modelo — es conocer el ecosistema completo y saber cuándo usar cuál.
      </p>

      <div className="not-prose my-8 rounded-lg border-l-3 border-primary bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Lectura para producción publicitaria IA</p>
        <p className="text-sm leading-relaxed">
          Seedance 2.0 es el modelo más potente hoy para trabajo con referencias, consistencia de personajes y control de cámara. Pero su disponibilidad limitada — sin EE.UU., API solo vía terceros — lo hace menos predecible para flujos de producción comercial que necesitan estabilidad. Kling 3.0 sigue siendo la opción más práctica para volumen. Veo 3.1 para calidad máxima de entrega.
        </p>
      </div>

      <div className="not-prose mt-8 flex flex-wrap gap-2">
        {["Seedance 2.0", "ByteDance", "Video IA", "Hollywood", "Copyright IA", "Kling 3.0", "Veo 3", "Producción Publicitaria IA", "IA Generativa Chile"].map((tag) => (
          <span key={tag} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Seedance 2.0 (EN) ─── */
function SeedanceContentEN() {
  return (
    <div className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
      <p className="text-lg leading-relaxed font-medium border-l-3 border-primary pl-5">
        ByteDance launched Seedance 2.0 in February 2026 and within 48 hours had generated clips so realistic — Tom Cruise fighting Brad Pitt — that Hollywood responded with cease-and-desist letters. The global launch was paused, filters were redesigned, and today the model is available on CapCut and Dreamina — with the world&apos;s highest Elo in video generation.
      </p>

      {/* Stats */}
      <div className="not-prose my-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-2xl font-bold text-primary">Elo 1,269</p>
          <p className="mt-1 text-xs text-muted-foreground">text-to-video — #1 worldwide</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-2xl font-bold text-primary">Elo 1,351</p>
          <p className="mt-1 text-xs text-muted-foreground">image-to-video — #1 worldwide</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-2xl font-bold text-primary">15 sec</p>
          <p className="mt-1 text-xs text-muted-foreground">max duration · 1080p</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-2xl font-bold text-primary">12 refs</p>
          <p className="mt-1 text-xs text-muted-foreground">multimodal inputs</p>
        </div>
      </div>

      <h2>What is Seedance 2.0 and why it matters</h2>
      <p>
        Seedance 2.0 is ByteDance&apos;s video generation model — the company behind TikTok — launched on February 10, 2026. It&apos;s not an incremental update: it uses a Dual-Branch Diffusion Transformer architecture that generates audio and video simultaneously and natively, something no competitor in the same category did before. It accepts up to 12 reference files in a single generation: 9 images, 3 videos, and 3 audios.
      </p>
      <p>
        Analysts called it the &ldquo;DeepSeek moment for AI video&rdquo;: just as DeepSeek shook up the LLM market, Seedance 2.0 triggered drops in U.S. tech stocks and gains in Chinese exchanges. In the Artificial Analysis benchmark, it surpassed Google Veo 3, OpenAI Sora 2, and Runway Gen-4.5 in both major categories.
      </p>

      <div className="not-prose my-8 rounded-lg border-l-3 border-primary bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Why it&apos;s technically different</p>
        <p className="text-sm leading-relaxed">
          Most models generate silent video and add audio in post-production. Seedance 2.0 generates both in the same step, with native lip-sync in 8+ languages. Additionally, its @ system allows referencing characters, movement, camera, and sound separately — director-level control, not prompt-user control.
        </p>
      </div>

      <h2>The scandal timeline</h2>

      <div className="not-prose my-6 border-l-2 border-border ml-3 pl-6 space-y-6">
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-primary bg-background" />
          <p className="text-xs font-mono text-primary">Feb 7, 2026</p>
          <p className="text-sm mt-1">Limited beta in China. Within 48 hours, clips of Tom Cruise fighting Brad Pitt, Friends characters as otters, and Will Smith battling a spaghetti monster go viral.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-border bg-background" />
          <p className="text-xs font-mono text-primary">Feb 10, 2026</p>
          <p className="text-sm mt-1">Official launch. Deadpool &amp; Wolverine screenwriter Rhett Reese posts: &ldquo;I hate to say it. It&apos;s probably over for us.&rdquo; The Motion Picture Association demands ByteDance cease infringing activity.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-border bg-background" />
          <p className="text-xs font-mono text-primary">Feb 13, 2026</p>
          <p className="text-sm mt-1">Disney sends a cease-and-desist letter accusing ByteDance of &ldquo;virtual theft of Disney IP.&rdquo; Paramount Skydance adds accusations over Star Trek, South Park, and Dora the Explorer.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-border bg-background" />
          <p className="text-xs font-mono text-primary">Feb 16, 2026</p>
          <p className="text-sm mt-1">ByteDance states it &ldquo;respects intellectual property rights&rdquo; and announces filter reinforcement. Temporarily restricts inputs with real faces.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-border bg-background" />
          <p className="text-xs font-mono text-primary">Mar 16, 2026</p>
          <p className="text-sm mt-1">U.S. senators Marsha Blackburn and Peter Welch demand by letter that CEO Liang Rubo immediately shut down Seedance, calling it &ldquo;the most egregious example of copyright infringement by a ByteDance product to date.&rdquo;</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-border bg-background" />
          <p className="text-xs font-mono text-primary">Mar 15–25, 2026</p>
          <p className="text-sm mt-1">Global launch pause while engineers and lawyers redesign IP filters. Third-party red-teaming and C2PA standard invisible watermarks are implemented.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[1.85rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-primary bg-background" />
          <p className="text-xs font-mono text-primary">Mar 26, 2026</p>
          <p className="text-sm mt-1">Relaunch on CapCut for Brazil, Indonesia, Mexico, Philippines, Thailand, and Vietnam. Two days after OpenAI shut down its Sora app, leaving the AI video market increasingly dominated by Chinese companies.</p>
        </div>
      </div>

      <h2>Why Hollywood reacted so strongly</h2>
      <p>
        The problem wasn&apos;t just quality — it was precision. A content creator who uploaded a photo of their office entrance discovered the model generated the other side of the building (which they had never photographed) and replicated their voice exactly. That&apos;s not a creative filter: it&apos;s identity generated without consent.
      </p>

      <blockquote>
        <p>&ldquo;In a short time, a person will be able to sit in front of a computer and create a movie indistinguishable from what Hollywood produces today.&rdquo;</p>
        <cite>— Rhett Reese, screenwriter of Deadpool &amp; Wolverine and Zombieland</cite>
      </blockquote>

      <p>
        The question that also arose among industry professionals was technical: were the viral clips pure generation or video-to-video workflows with green screen stuntmen? Seedance showed R2V workflow examples on its site, suggesting some of the visual impact may come from real video references — something relevant for anyone evaluating the model for production.
      </p>

      <h2>What the model can do today</h2>

      <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: "Max resolution", value: "1080p (demo up to 2K in Chinese version)" },
          { label: "Max duration", value: "15 seconds · 6 aspect ratios" },
          { label: "Simultaneous inputs", value: "9 images + 3 videos + 3 audios + text" },
          { label: "Native audio", value: "Yes — lip-sync in 8+ languages, including Spanish" },
          { label: "Where to access", value: "CapCut, Dreamina, Pippit · API via third parties" },
          { label: "Current restrictions", value: "No real face generation · No unauthorized IP · Not available in the U.S. yet" },
        ].map((spec) => (
          <div key={spec.label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">{spec.label}</p>
            <p className="text-sm">{spec.value}</p>
          </div>
        ))}
      </div>

      <h2>The competitive landscape in April 2026</h2>
      <p>
        Seedance 2.0 leads in multimodal control and benchmarks, but the market has four serious options with distinct roles. Here&apos;s the practical breakdown for producers:
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Model</th>
              <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Main strength</th>
              <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Best for</th>
              <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Ref. price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-3 font-medium">Seedance 2.0 <span className="inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">#1 Elo</span></td>
              <td className="p-3">Multimodal control · native audio · narrative consistency</td>
              <td className="p-3">Advertising, musicals, template-based work</td>
              <td className="p-3">Variable · third-party APIs</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-3 font-medium">Kling 3.0</td>
              <td className="p-3">Human movement · videos up to 3 min · low price</td>
              <td className="p-3">Social media · rapid prototyping · volume</td>
              <td className="p-3">~$7/mo</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-3 font-medium">Veo 3.1</td>
              <td className="p-3">Photorealism · 4K 60fps · color science</td>
              <td className="p-3">Final deliverables · premium production</td>
              <td className="p-3">$250/mo</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">Runway Gen-4.5</td>
              <td className="p-3">Professional editing tools · post-pro integration</td>
              <td className="p-3">Post-production workflows · filmmakers</td>
              <td className="p-3">$12–76/mo</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        The most relevant market data right now: OpenAI shut down its Sora app on March 24, 2026, two days before Seedance&apos;s relaunch. The AI video space is increasingly dominated by Chinese companies — ByteDance and Kuaishou — and Google. Western players are falling behind.
      </p>

      <blockquote>
        <p>&ldquo;Many production teams already use multiple models: Seedance 2.0 for reference-based and template work, Kling 3.0 for rapid prototyping, and Veo 3.1 for final deliverables.&rdquo;</p>
        <cite>— WaveSpeed AI, 2026 video model comparison</cite>
      </blockquote>

      <h2>Has another model surpassed it?</h2>
      <p>
        Not yet. As of April 2026, Seedance 2.0 holds the highest Elo in both categories according to Artificial Analysis, above Veo 3, Sora 2, and Runway Gen-4.5. Kling 3.0 is the closest competitor in overall quality and surpasses it in price and API availability.
      </p>
      <p>
        What is clear is that the update cycle in this space is weeks, not months. Seedance&apos;s advantage today is no guarantee of anything in 60 days. For anyone working in production, the smart move is not to marry a model — it&apos;s to know the full ecosystem and know when to use which.
      </p>

      <div className="not-prose my-8 rounded-lg border-l-3 border-primary bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Takeaway for AI ad production</p>
        <p className="text-sm leading-relaxed">
          Seedance 2.0 is the most powerful model today for reference-based work, character consistency, and camera control. But its limited availability — no U.S., API only via third parties — makes it less predictable for commercial production workflows that need stability. Kling 3.0 remains the most practical option for volume. Veo 3.1 for maximum delivery quality.
        </p>
      </div>

      <div className="not-prose mt-8 flex flex-wrap gap-2">
        {["Seedance 2.0", "ByteDance", "AI Video", "Hollywood", "AI Copyright", "Kling 3.0", "Veo 3", "AI Ad Production", "Generative AI"].map((tag) => (
          <span key={tag} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Slug → content mapping ─── */
const SLUG_ES_TERTULIAS = "tertulias-ia-universidad-mayor-comfyui-casting-digital";
const SLUG_EN_TERTULIAS = "tertulias-ia-universidad-mayor-comfyui-digital-casting";
const SLUG_ES_SEEDANCE = "seedance-2-bytedance-video-ia-escandalo-hollywood-benchmarks";
const SLUG_EN_SEEDANCE = "seedance-2-bytedance-video-ai-hollywood-scandal-benchmarks";

const SLUGS_WITH_IMAGE = [SLUG_ES_TERTULIAS, SLUG_EN_TERTULIAS, SLUG_ES_SEEDANCE, SLUG_EN_SEEDANCE];
const SLUGS_WITH_AUTHOR = SLUGS_WITH_IMAGE;

function getArticleContent(slug: string) {
  switch (slug) {
    case SLUG_ES_TERTULIAS:
      return <TertuliasIAContent />;
    case SLUG_EN_TERTULIAS:
      return <TertuliasIAContentEN />;
    case SLUG_ES_SEEDANCE:
      return <SeedanceContent />;
    case SLUG_EN_SEEDANCE:
      return <SeedanceContentEN />;
    default:
      return null;
  }
}

function getArticleImage(slug: string): string | null {
  if (slug === SLUG_ES_TERTULIAS || slug === SLUG_EN_TERTULIAS) return "/blog/tertulias-ia-umayor.webp";
  if (slug === SLUG_ES_SEEDANCE || slug === SLUG_EN_SEEDANCE) return "/blog/seedance-2-bytedance.webp";
  return null;
}

function getArticleCategory(slug: string, locale: string): string | null {
  if (slug === SLUG_ES_TERTULIAS || slug === SLUG_EN_TERTULIAS) {
    return locale === "es" ? "Eventos · Industria" : "Events · Industry";
  }
  if (slug === SLUG_ES_SEEDANCE || slug === SLUG_EN_SEEDANCE) {
    return locale === "es" ? "Modelos · Video IA" : "Models · AI Video";
  }
  return null;
}

/* ─── Page ─── */

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = blogPosts.find((p) => p.slug === slug && p.locale === locale);
  if (!post) return {};
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    locale,
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = blogPosts.find((p) => p.slug === slug && p.locale === locale);

  if (!post) notFound();

  const articleImage = getArticleImage(slug);
  const articleContent = getArticleContent(slug);
  const articleCategory = getArticleCategory(slug, locale);

  return (
    <section className="py-20 lg:py-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: {
            "@type": "Person",
            name: "Milivoy Yutronic",
          },
          publisher: {
            "@type": "Organization",
            name: "YUTRO.",
            url: SITE_URL,
          },
          ...(post.image && {
            image: `${SITE_URL}${post.image}`,
          }),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/${locale}/blog/${slug}`,
          },
          inLanguage: locale,
        }}
      />
      <Container className="max-w-3xl">
        <CTAButton href="/blog" variant="outline" className="mb-8 text-sm px-4 py-2">
          &larr; {locale === "es" ? "Volver al blog" : "Back to blog"}
        </CTAButton>

        {/* Hero Image */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          {articleImage ? (
            <Image
              src={articleImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-lg">
              {post.title}
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          <span>&middot;</span>
          <span>
            {post.readingTime} {locale === "es" ? "min de lectura" : "min read"}
          </span>
          {SLUGS_WITH_AUTHOR.includes(slug) && (
            <>
              <span>&middot;</span>
              <span>Milivoy Yutronic</span>
            </>
          )}
          {articleCategory && (
            <>
              <span>&middot;</span>
              <span className="text-primary font-medium">{articleCategory}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {/* Content */}
        {articleContent ?? (
          <div className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed">{post.excerpt}</p>
            <p className="text-muted-foreground">
              {locale === "es"
                ? "Contenido completo próximamente. Este es un artículo de ejemplo."
                : "Full content coming soon. This is a sample article."}
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
