import type { MetadataRoute } from "next";
import { getVillasForList, getArticlesForList } from "@/lib/data";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://topform-realestate.com");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let villas: Awaited<ReturnType<typeof getVillasForList>> = [];
  let articles: Awaited<ReturnType<typeof getArticlesForList>> = [];
  try {
    const [v, a] = await Promise.all([
      getVillasForList(),
      getArticlesForList(),
    ]);
    villas = v;
    articles = a;
  } catch {
    // DB error — ใช้เฉพาะ static pages
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/villas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/investment`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const villaUrls: MetadataRoute.Sitemap = villas.map((v) => ({
    url: `${baseUrl}/villas/${v.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/articles/${a.slug || a.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...villaUrls, ...articleUrls];
}
