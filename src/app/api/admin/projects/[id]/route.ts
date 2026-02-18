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
  const project = await prisma.projectPromo.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
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
    const { name, tagline, location, badge, targetUrl, imageUrl, sortOrder, isActive } = body;
    const project = await prisma.projectPromo.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name) }),
        ...(tagline !== undefined && { tagline: tagline == null ? null : String(tagline) }),
        ...(location !== undefined && { location: location == null ? null : String(location) }),
        ...(badge !== undefined && { badge: badge == null ? null : String(badge) }),
        ...(targetUrl !== undefined && { targetUrl: targetUrl == null ? null : String(targetUrl) }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl == null ? null : String(imageUrl) }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) || 0 }),
        ...(isActive !== undefined && { isActive: isActive !== false }),
      },
    });
    return NextResponse.json(project);
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
    await prisma.projectPromo.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
