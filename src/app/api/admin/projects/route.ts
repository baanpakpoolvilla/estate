import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const list = await prisma.projectPromo.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  try {
    const body = await request.json();
    const { name, tagline, location, badge, targetUrl, imageUrl, sortOrder, isActive } = body;
    const project = await prisma.projectPromo.create({
      data: {
        name: String(name ?? ""),
        tagline: tagline != null ? String(tagline) : null,
        location: location != null ? String(location) : null,
        badge: badge != null ? String(badge) : null,
        targetUrl: targetUrl != null ? String(targetUrl) : null,
        imageUrl: imageUrl != null ? String(imageUrl) : null,
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== false,
      },
    });
    return NextResponse.json(project);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
