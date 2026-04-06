import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";
import { blogPosts } from "@/data/blog";
import { createMetadata } from "@/lib/metadata";

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
        "El casting digital no reemplaza al casting real. Lo que hace es abrir una etapa de preproducción que antes no existía: podés explorar 40 perfiles de personaje en una tarde y llegar a la reunión con el cliente con opciones concretas, no con ideas."
        <cite>— Milivoy Yutronic, Yutro</cite>
      </blockquote>

      <h3>Los tres momentos del flujo</h3>
      <p>
        El flujo que presentamos tiene tres momentos diferenciados:
      </p>
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
      <p>
        Además de presentar, escuchamos. Y eso fue igual de valioso. Algunos temas que resonaron durante la jornada:
      </p>
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

function TertuliasIAContentEN() {
  return (
    <div className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
      <p className="text-lg leading-relaxed font-medium">
        On March 27, Yutro participated in <strong>Tertulias IA</strong>, a conversation and exchange event organized by <strong>Universidad Mayor</strong> focused on the current state of creative artificial intelligence in Chile. A 7-hour day with 12 panelists and over 2,400 LinkedIn impressions — a clear sign that the industry's conversation around AI is far from exhausted.
      </p>

      <h2>The event</h2>
      <p>
        Tertulias IA brought together professionals from different disciplines — design, advertising, audiovisual production, education, and technology — to share real experiences with generative AI tools. It wasn't a conference with experts speaking from a stage: it was a horizontal conversation where each panelist shared their concrete practice, their mistakes, and their discoveries.
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
        "Digital casting doesn't replace real casting. What it does is open a pre-production stage that didn't exist before: you can explore 40 character profiles in an afternoon and arrive at the client meeting with concrete options, not just ideas."
        <cite>— Milivoy Yutronic, Yutro</cite>
      </blockquote>

      <h3>The three stages of the workflow</h3>
      <p>
        The workflow we presented has three distinct stages:
      </p>
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
      <p>
        Beyond presenting, we listened. And that was equally valuable. Some themes that resonated throughout the day:
      </p>
      <ul>
        <li>The gap between what agencies promise clients with AI and what they can actually deliver remains large.</li>
        <li>The most effective workflows aren't the most sophisticated ones — they're the ones the team understands and can reproduce.</li>
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
        For Yutro, participating in these spaces is part of how we build knowledge. We don't just show what we do — we listen to how others are solving the same problems we face. That always comes back in the form of better projects.
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

  return (
    <section className="py-20 lg:py-28">
      <Container className="max-w-3xl">
        <CTAButton href="/blog" variant="outline" className="mb-8 text-sm px-4 py-2">
          &larr; {locale === "es" ? "Volver al blog" : "Back to blog"}
        </CTAButton>

        {/* Hero Image */}
        <div className="aspect-video overflow-hidden rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-lg">
          {post.title}
        </div>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          <span>&middot;</span>
          <span>
            {post.readingTime} {locale === "es" ? "min de lectura" : "min read"}
          </span>
          {(slug === "tertulias-ia-universidad-mayor-comfyui-casting-digital" || slug === "tertulias-ia-universidad-mayor-comfyui-digital-casting") && (
            <>
              <span>&middot;</span>
              <span>Milivoy Yutronic</span>
              <span>&middot;</span>
              <span className="text-primary font-medium">{locale === "es" ? "Eventos · Industria" : "Events · Industry"}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {/* Content */}
        {slug === "tertulias-ia-universidad-mayor-comfyui-casting-digital" ? (
          <TertuliasIAContent />
        ) : slug === "tertulias-ia-universidad-mayor-comfyui-digital-casting" ? (
          <TertuliasIAContentEN />
        ) : (
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
