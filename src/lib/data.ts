import { prisma } from "@/lib/db";

export type VillaListItem = {
  id: string;
  name: string;
  location: string;
  price: string;
  roi: string;
  beds: number;
  baths: number;
  sqm: number;
  profitMonthly: string;
  mainVideoId: string;
  tag?: string | null;
};

export type VillaDetail = {
  name: string;
  location: string;
  price: string;
  roi: string;
  beds: number;
  baths: number;
  sqm: number;
  land: number;
  desc: string;
  mainVideoId: string;
  areaVideos: { label: string; youtubeId: string }[];
  gallery: { label: string; area: string }[];
  rentalHistory: { period: string; occupancy: string; avgRate: string; note?: string }[];
  businessHistory: string;
  salePlan: string;
  investmentMonthly: { revenue: string; expenses: string; profit: string };
  accountingSummary: { period: string; revenue: string; profit: string }[];
};

export type ProjectPromoItem = {
  id: string;
  name: string;
  tagline: string | null;
  location: string | null;
  badge: string | null;
  targetUrl: string | null;
  href: string;
};

export type ContactSettingsItem = {
  phone: string | null;
  email: string | null;
  lineUrl: string | null;
  address: string | null;
  mapUrl: string | null;
};

function profitFromVilla(v: { investmentMonthly?: unknown }): string {
  const m = v.investmentMonthly as { profit?: string } | null | undefined;
  return (m?.profit as string) ?? "";
}

export async function getVillasForList(): Promise<VillaListItem[]> {
  const list = await prisma.villa.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
  return list.map((v) => ({
    id: v.id,
    name: v.name,
    location: v.location,
    price: v.price,
    roi: v.roi,
    beds: v.beds,
    baths: v.baths,
    sqm: v.sqm,
    profitMonthly: profitFromVilla(v),
    mainVideoId: v.mainVideoId ?? "",
    tag: v.tag,
  }));
}

export async function getVillaForDetail(id: string): Promise<VillaDetail | null> {
  const v = await prisma.villa.findFirst({
    where: { id, isPublished: true },
  });
  if (!v) return null;
  const inv = (v.investmentMonthly as { revenue?: string; expenses?: string; profit?: string }) ?? {};
  const areaVideos = (v.areaVideos as { label: string; youtubeId: string }[]) ?? [];
  const gallery = (v.gallery as { label: string; area: string }[]) ?? [];
  const rentalHistory =
    (v.rentalHistory as { period: string; occupancy: string; avgRate: string; note?: string }[]) ?? [];
  const accountingSummary =
    (v.accountingSummary as { period: string; revenue: string; profit: string }[]) ?? [];
  return {
    name: v.name,
    location: v.location,
    price: v.price,
    roi: v.roi,
    beds: v.beds,
    baths: v.baths,
    sqm: v.sqm,
    land: v.land ?? 0,
    desc: v.description ?? "",
    mainVideoId: v.mainVideoId ?? "",
    areaVideos,
    gallery,
    rentalHistory,
    businessHistory: v.businessHistory ?? "",
    salePlan: v.salePlan ?? "",
    investmentMonthly: {
      revenue: inv.revenue ?? "",
      expenses: inv.expenses ?? "",
      profit: inv.profit ?? "",
    },
    accountingSummary,
  };
}

export async function getProjectPromos(): Promise<ProjectPromoItem[]> {
  const list = await prisma.projectPromo.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return list.map((p) => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    location: p.location,
    badge: p.badge,
    targetUrl: p.targetUrl,
    href: p.targetUrl ?? "/villas",
  }));
}

export async function getContactSettings(): Promise<ContactSettingsItem | null> {
  const c = await prisma.contactSettings.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!c) return null;
  return {
    phone: c.phone,
    email: c.email,
    lineUrl: c.lineUrl,
    address: c.address,
    mapUrl: c.mapUrl,
  };
}
