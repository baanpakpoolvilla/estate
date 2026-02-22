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
      address,
      latitude,
      longitude,
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
      status,
      rentPeriod,
      propertyType,
      sortOrder,
      isPublished,
      areaVideos,
      gallery,
      rentalHistory,
      businessHistory,
      salePlan,
      investmentMonthly,
      accountingSummary,
      amenities,
      ownerInfo,
    } = body;
    const villa = await prisma.villa.create({
      data: {
        name: String(name ?? ""),
        location: String(location ?? ""),
        address: address != null ? String(address) : null,
        latitude: latitude != null ? Number(latitude) : null,
        longitude: longitude != null ? Number(longitude) : null,
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
        status: status != null ? String(status) : "sale",
        rentPeriod: rentPeriod != null ? String(rentPeriod) : null,
        propertyType: propertyType != null ? String(propertyType) : "pool-villa",
        sortOrder: Number(sortOrder) || 0,
        isPublished: isPublished !== false,
        areaVideos: areaVideos ?? null,
        gallery: gallery ?? null,
        rentalHistory: rentalHistory ?? null,
        businessHistory: businessHistory != null ? String(businessHistory) : null,
        salePlan: salePlan != null ? String(salePlan) : null,
        investmentMonthly: investmentMonthly ?? null,
        accountingSummary: accountingSummary ?? null,
        amenities: amenities ?? null,
        ownerInfo: ownerInfo ?? null,
      },
    });
    return NextResponse.json(villa);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
