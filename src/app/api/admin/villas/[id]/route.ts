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
  const villa = await prisma.villa.findUnique({ where: { id } });
  if (!villa) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(villa);
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
      name,
      location,
      price,
      roi,
      beds,
      baths,
      sqm,
      land,
      description,
      mainVideoId,
      tag,
      sortOrder,
      isPublished,
      areaVideos,
      gallery,
      rentalHistory,
      businessHistory,
      salePlan,
      investmentMonthly,
      accountingSummary,
    } = body;
    const villa = await prisma.villa.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name) }),
        ...(location !== undefined && { location: String(location) }),
        ...(price !== undefined && { price: String(price) }),
        ...(roi !== undefined && { roi: String(roi) }),
        ...(beds !== undefined && { beds: Number(beds) || 0 }),
        ...(baths !== undefined && { baths: Number(baths) || 0 }),
        ...(sqm !== undefined && { sqm: Number(sqm) || 0 }),
        ...(land !== undefined && { land: land == null ? null : Number(land) }),
        ...(description !== undefined && { description: description == null ? null : String(description) }),
        ...(mainVideoId !== undefined && { mainVideoId: mainVideoId == null ? null : String(mainVideoId) }),
        ...(tag !== undefined && { tag: tag == null ? null : String(tag) }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) || 0 }),
        ...(isPublished !== undefined && { isPublished: isPublished !== false }),
        ...(areaVideos !== undefined && { areaVideos }),
        ...(gallery !== undefined && { gallery }),
        ...(rentalHistory !== undefined && { rentalHistory }),
        ...(businessHistory !== undefined && { businessHistory: businessHistory == null ? null : String(businessHistory) }),
        ...(salePlan !== undefined && { salePlan: salePlan == null ? null : String(salePlan) }),
        ...(investmentMonthly !== undefined && { investmentMonthly }),
        ...(accountingSummary !== undefined && { accountingSummary }),
      },
    });
    return NextResponse.json(villa);
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
    await prisma.villa.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
