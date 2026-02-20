import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const list = await prisma.villa.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
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
      imageUrl,
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
    const villa = await prisma.villa.create({
      data: {
        name: String(name ?? ""),
        location: String(location ?? ""),
        price: String(price ?? ""),
        roi: String(roi ?? ""),
        beds: Number(beds) || 0,
        baths: Number(baths) || 0,
        sqm: Number(sqm) || 0,
        land: land != null ? Number(land) : null,
        description: description != null ? String(description) : null,
        mainVideoId: mainVideoId != null ? String(mainVideoId) : null,
        imageUrl: imageUrl != null ? String(imageUrl) : null,
        tag: tag != null ? String(tag) : null,
        sortOrder: Number(sortOrder) || 0,
        isPublished: isPublished !== false,
        areaVideos: areaVideos ?? null,
        gallery: gallery ?? null,
        rentalHistory: rentalHistory ?? null,
        businessHistory: businessHistory != null ? String(businessHistory) : null,
        salePlan: salePlan != null ? String(salePlan) : null,
        investmentMonthly: investmentMonthly ?? null,
        accountingSummary: accountingSummary ?? null,
      },
    });
    return NextResponse.json(villa);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
