import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const row = await prisma.contactSettings.findFirst({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(row ?? { phone: null, email: null, lineUrl: null, address: null, mapUrl: null });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  try {
    const body = await request.json();
    const { phone, email, lineUrl, address, mapUrl } = body;
    const existing = await prisma.contactSettings.findFirst({ orderBy: { updatedAt: "desc" } });
    const data = {
      phone: phone != null ? String(phone) : null,
      email: email != null ? String(email) : null,
      lineUrl: lineUrl != null ? String(lineUrl) : null,
      address: address != null ? String(address) : null,
      mapUrl: mapUrl != null ? String(mapUrl) : null,
    };
    if (existing) {
      const updated = await prisma.contactSettings.update({
        where: { id: existing.id },
        data,
      });
      return NextResponse.json(updated);
    }
    const created = await prisma.contactSettings.create({ data });
    return NextResponse.json(created);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
