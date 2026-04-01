import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-sanity-secret");

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let body: { _type?: string; slug?: { current?: string } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const type = body._type;
  const slug = body.slug?.current;

  // Revalidate paths based on document type
  const pathMap: Record<string, string> = {
    project: "/proyectos",
    blogPost: "/blog",
    service: "/servicios",
    influencer: "/influencer",
  };

  if (type && pathMap[type]) {
    // Revalidate list page
    revalidatePath(`/es${pathMap[type]}`);
    revalidatePath(`/en${pathMap[type]}`);

    // Revalidate individual page if slug exists
    if (slug) {
      revalidatePath(`/es${pathMap[type]}/${slug}`);
      revalidatePath(`/en${pathMap[type]}/${slug}`);
    }
  }

  // Also revalidate home page (featured content)
  revalidatePath("/es");
  revalidatePath("/en");

  return NextResponse.json({
    revalidated: true,
    type,
    slug,
    timestamp: new Date().toISOString(),
  });
}
