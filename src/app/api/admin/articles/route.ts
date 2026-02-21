import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const list = await prisma.article.findMany({
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      body: bodyText,
      coverImageUrl,
      seoKeywords,
      metaDescription,
      isPublished,
      publishedAt,
      sortOrder,
    } = body;
    const article = await prisma.article.create({
      data: {
        title: String(title ?? ""),
        slug: String(slug ?? "").trim() || String(title ?? "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        excerpt: excerpt != null ? String(excerpt) : null,
        body: String(bodyText ?? ""),
        coverImageUrl: coverImageUrl != null ? String(coverImageUrl) : null,
        seoKeywords: seoKeywords != null ? String(seoKeywords) : null,
        metaDescription: metaDescription != null ? String(metaDescription) : null,
        isPublished: isPublished === true,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        sortOrder: Number(sortOrder) || 0,
      },
    });
    return NextResponse.json(article);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
