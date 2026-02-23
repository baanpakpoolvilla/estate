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
  imageUrl?: string | null;
  tag?: string | null;
  status?: string | null;
  rentPeriod?: string | null;
  propertyType?: string | null;
};

export type VillaDetail = {
  id: string;
  name: string;
  location: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  price: string;
  roi: string;
  status: string;
  rentPeriod: string | null;
  propertyType: string;
  beds: number;
  baths: number;
  sqm: number;
  land: number;
  desc: string;
  imageUrl: string | null;
  mainVideoId: string;
  areaVideos: { label: string; youtubeId: string }[];
  gallery: { label: string; area: string; imageUrls: string[] }[];
  rentalHistory: { period: string; occupancy: string; avgRate: string; note?: string }[];
  businessHistory: string;
  salePlan: string;
  investmentMonthly: { revenue: string; expenses: string; profit: string };
  accountingSummary: { period: string; revenue: string; profit: string }[];
  amenities: {
    pool: boolean; kidsPool: boolean; karaoke: boolean; pingpong: boolean;
    snooker: boolean; kitchen: boolean; wifi: boolean; parking: boolean; parkingSlots: number;
  };
};

export type ProjectPromoItem = {
  id: string;
  name: string;
  tagline: string | null;
  location: string | null;
  badge: string | null;
  targetUrl: string | null;
  imageUrl: string | null;
  href: string;
};

export type ContactSettingsItem = {
  logoUrl: string | null;
  faviconUrl: string | null;
  companyName: string | null;
  companyNameEn: string | null;
  registrationNumber: string | null;
  phone: string | null;
  email: string | null;
  lineUrl: string | null;
  address: string | null;
  mapUrl: string | null;
  facebookUrl: string | null;
};

export type ArticleListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
};

export type ArticleDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  coverImageUrl: string | null;
  seoKeywords: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

/** รวม gallery groups ที่ label เหมือนกัน (หรือว่าง) ให้เป็นก้อนเดียว */
function mergeGalleryGroups(
  items: { label: string; area: string; imageUrls: string[] }[],
): { label: string; area: string; imageUrls: string[] }[] {
  const map = new Map<string, { label: string; area: string; imageUrls: string[] }>();
  for (const item of items) {
    const key = (item.label || "").trim().toLowerCase() || "__unlabeled__";
    const existing = map.get(key);
    if (existing) {
      for (const url of item.imageUrls) {
        if (!existing.imageUrls.includes(url)) existing.imageUrls.push(url);
      }
      if (!existing.area && item.area) existing.area = item.area;
    } else {
      map.set(key, { label: item.label || "รูปภาพ", area: item.area, imageUrls: [...item.imageUrls] });
    }
  }
  return Array.from(map.values()).filter((g) => g.imageUrls.length > 0);
}

function profitFromVilla(v: { investmentMonthly?: unknown }): string {
  const m = v.investmentMonthly as { profit?: string } | null | undefined;
  return (m?.profit as string) ?? "";
}

export type PortfolioStats = {
  totalVillas: number;
  avgRoi: string;
  avgProfitMonthly: string;
  totalValue: string;
};

export async function getPortfolioStats(): Promise<PortfolioStats> {
  const villas = await prisma.villa.findMany({
    where: { isPublished: true },
    select: { roi: true, price: true, investmentMonthly: true },
  });

  const totalVillas = villas.length;

  const rois = villas
    .map((v) => parseFloat(v.roi))
    .filter((n) => !isNaN(n) && n > 0);
  const avgRoi = rois.length > 0
    ? (rois.reduce((a, b) => a + b, 0) / rois.length).toFixed(1)
    : "0";

  const profits = villas
    .map((v) => {
      const m = v.investmentMonthly as { profit?: string } | null | undefined;
      return parseFloat(String(m?.profit ?? "").replace(/,/g, ""));
    })
    .filter((n) => !isNaN(n) && n > 0);
  const avgProfitMonthly = profits.length > 0
    ? Math.round(profits.reduce((a, b) => a + b, 0) / profits.length).toString()
    : "0";

  const prices = villas
    .map((v) => parseFloat(v.price))
    .filter((n) => !isNaN(n) && n > 0);
  const totalValueMillion = prices.reduce((a, b) => a + b, 0);
  const totalValue = Math.round(totalValueMillion * 1_000_000).toString();

  return { totalVillas, avgRoi, avgProfitMonthly, totalValue };
}

export async function getVillasForList(): Promise<VillaListItem[]> {
  const list = await prisma.villa.findMany({
    where: { isPublished: true },
    orderBy: [{ createdAt: "desc" }, { sortOrder: "asc" }],
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
    imageUrl: v.imageUrl ?? null,
    tag: v.tag,
    status: v.status ?? "sale",
    rentPeriod: v.rentPeriod ?? null,
    propertyType: v.propertyType ?? "pool-villa",
  }));
}

export async function getVillaForDetail(id: string): Promise<VillaDetail | null> {
  const v = await prisma.villa.findFirst({
    where: { id, isPublished: true },
  });
  if (!v) return null;
  const inv = (v.investmentMonthly as { revenue?: string; expenses?: string; profit?: string }) ?? {};
  const areaVideosRaw = v.areaVideos as { label: string; youtubeId: string }[] | null | undefined;
  const areaVideos = Array.isArray(areaVideosRaw) ? areaVideosRaw : [];
  const galleryRaw = v.gallery as { label: string; area: string; imageUrl?: string; imageUrls?: unknown }[] | null | undefined;
  const gallery = mergeGalleryGroups(
    (Array.isArray(galleryRaw) ? galleryRaw : []).map((item) => {
      let urls: string[] = [];
      const iu = item.imageUrls;
      if (Array.isArray(iu)) {
        urls = iu.filter((u): u is string => typeof u === "string" && u.startsWith("http"));
      } else if (iu && typeof iu === "object") {
        urls = Object.values(iu).filter((u): u is string => typeof u === "string" && u.startsWith("http"));
      } else if (item.imageUrl && typeof item.imageUrl === "string" && item.imageUrl.startsWith("http")) {
        urls = [item.imageUrl];
      }
      return { label: item.label || "", area: item.area || "", imageUrls: urls };
    }),
  );
  const rentalHistoryRaw = v.rentalHistory as { period: string; occupancy: string; avgRate: string; note?: string }[] | null | undefined;
  const rentalHistory = Array.isArray(rentalHistoryRaw) ? rentalHistoryRaw : [];
  const accountingSummaryRaw = v.accountingSummary as { period: string; revenue: string; profit: string }[] | null | undefined;
  const accountingSummary = Array.isArray(accountingSummaryRaw) ? accountingSummaryRaw : [];
  return {
    id: v.id,
    name: v.name,
    location: v.location,
    address: v.address ?? null,
    latitude: v.latitude ?? null,
    longitude: v.longitude ?? null,
    price: v.price,
    roi: v.roi,
    status: v.status ?? "sale",
    rentPeriod: v.rentPeriod ?? null,
    propertyType: v.propertyType ?? "pool-villa",
    beds: v.beds,
    baths: v.baths,
    sqm: v.sqm,
    land: v.land ?? 0,
    desc: v.description ?? "",
    imageUrl: v.imageUrl ?? null,
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
    amenities: {
      pool: false, kidsPool: false, karaoke: false, pingpong: false,
      snooker: false, kitchen: false, wifi: false, parking: false, parkingSlots: 0,
      ...((v.amenities as Record<string, unknown>) ?? {}),
    },
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
    imageUrl: p.imageUrl ?? null,
    href: `/projects/${p.id}`,
  }));
}

export type ProjectDetail = {
  id: string;
  name: string;
  tagline: string | null;
  location: string | null;
  badge: string | null;
  imageUrl: string | null;
  description: string | null;
  videoId: string | null;
  gallery: { label: string; imageUrl: string }[];
  highlights: { label: string; value: string }[];
};

export async function getProjectDetail(id: string): Promise<ProjectDetail | null> {
  const p = await prisma.projectPromo.findFirst({
    where: { id, isActive: true },
  });
  if (!p) return null;
  const galleryRaw = p.gallery as { label: string; imageUrl: string }[] | null | undefined;
  const highlightsRaw = p.highlights as { label: string; value: string }[] | null | undefined;
  return {
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    location: p.location,
    badge: p.badge,
    imageUrl: p.imageUrl,
    description: p.description,
    videoId: p.videoId,
    gallery: Array.isArray(galleryRaw) ? galleryRaw : [],
    highlights: Array.isArray(highlightsRaw) ? highlightsRaw : [],
  };
}

export async function getContactSettings(): Promise<ContactSettingsItem | null> {
  const c = await prisma.contactSettings.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!c) return null;
  return {
    logoUrl: c.logoUrl,
    faviconUrl: c.faviconUrl,
    companyName: c.companyName,
    companyNameEn: c.companyNameEn,
    registrationNumber: c.registrationNumber,
    phone: c.phone,
    email: c.email,
    lineUrl: c.lineUrl,
    address: c.address,
    mapUrl: c.mapUrl,
    facebookUrl: c.facebookUrl,
  };
}

export async function getArticlesForList(): Promise<ArticleListItem[]> {
  const list = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: [
      { publishedAt: { sort: "desc", nulls: "last" } },
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
  });
  return list.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    coverImageUrl: a.coverImageUrl,
    publishedAt: a.publishedAt,
  }));
}

export async function getArticleBySlugOrId(slugOrId: string): Promise<ArticleDetail | null> {
  const article = await prisma.article.findFirst({
    where: { isPublished: true, OR: [{ slug: slugOrId }, { id: slugOrId }] },
  });
  if (!article) return null;
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    body: article.body,
    coverImageUrl: article.coverImageUrl,
    seoKeywords: article.seoKeywords,
    metaDescription: article.metaDescription,
    publishedAt: article.publishedAt,
    createdAt: article.createdAt,
  };
}
