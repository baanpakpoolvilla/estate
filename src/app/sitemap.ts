import type { MetadataRoute } from "next";
import {
  getVillasForList,
  getArticlesForList,
  getProjectPromos,
} from "@/lib/data";

export const dynamic = "force-dynamic";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://topformestate.com");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let villas: Awaited<ReturnType<typeof getVillasForList>> = [];
  let articles: Awaited<ReturnType<typeof getArticlesForList>> = [];
  let projects: Awaited<ReturnType<typeof getProjectPromos>> = [];

  try {
    const [v, a, p] = await Promise.all([
      getVillasForList(),
      getArticlesForList(),
      getProjectPromos(),
    ]);
    villas = v;
    articles = a;
    projects = p;
  } catch {
    // DB error — static pages only
  }

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/villas`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/investment`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const villaUrls: MetadataRoute.Sitemap = villas.map((v) => ({
    url: `${baseUrl}/villas/${v.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
    ...(v.imageUrl ? { images: [v.imageUrl] } : {}),
  }));

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/articles/${a.slug || a.id}`,
    lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    ...(a.coverImageUrl ? { images: [a.coverImageUrl] } : {}),
  }));

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    ...(p.imageUrl ? { images: [p.imageUrl] } : {}),
  }));

  return [...staticPages, ...villaUrls, ...articleUrls, ...projectUrls];
}
