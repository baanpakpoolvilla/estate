import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const { id } = await params;
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      body: bodyText,
      coverImageUrl,
      isPublished,
      publishedAt,
      sortOrder,
    } = body;
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title) }),
        ...(slug !== undefined && String(slug).trim() && { slug: String(slug).trim() }),
        ...(excerpt !== undefined && { excerpt: excerpt == null ? null : String(excerpt) }),
        ...(bodyText !== undefined && { body: String(bodyText) }),
        ...(coverImageUrl !== undefined && { coverImageUrl: coverImageUrl == null ? null : String(coverImageUrl) }),
        ...(isPublished !== undefined && { isPublished: isPublished === true }),
        ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : null }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) || 0 }),
      },
    });
    return NextResponse.json(article);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const { id } = await params;
  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
