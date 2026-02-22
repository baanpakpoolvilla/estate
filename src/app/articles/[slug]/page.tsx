import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlugOrId } from "@/lib/data";
import ArticleBody from "@/components/ArticleBody";
import ShareButtons from "@/components/ShareButtons";

function formatDate(d: Date | string | null | undefined): string {
  if (d == null) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type Params = { slug: string };

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://topformestate.com");

// ให้ Vercel/production ดึงข้อมูลจาก DB ทุกครั้ง เหมือน localhost
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params> | Params;
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  try {
    const article = await getArticleBySlugOrId(slug);
    if (!article) return { title: "ไม่พบบทความ" };
    const title = article.title;
    const description = article.metaDescription || article.excerpt || article.body.replace(/<[^>]*>/g, "").slice(0, 160);
    const keywords = article.seoKeywords
      ? article.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
      : undefined;
    return {
      title,
      description,
      ...(keywords && { keywords }),
      openGraph: {
        title: `${title} | ท๊อปฟอร์ม อสังหาริมทรัพย์`,
        description,
        url: `${siteUrl}/articles/${article.slug}`,
        type: "article",
        publishedTime: article.publishedAt
          ? new Date(article.publishedAt).toISOString()
          : undefined,
        ...(keywords && { tags: keywords }),
        ...(article.coverImageUrl && {
          images: [{ url: article.coverImageUrl, width: 1200, height: 630, alt: title }],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(article.coverImageUrl && { images: [article.coverImageUrl] }),
      },
      alternates: { canonical: `/articles/${article.slug}` },
    };
  } catch {
    return { title: "ไม่พบบทความ" };
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<Params> | Params;
}) {
  const { slug } = await Promise.resolve(params);
  let article: Awaited<ReturnType<typeof getArticleBySlugOrId>> = null;
  try {
    article = await getArticleBySlugOrId(slug);
  } catch {
    notFound();
  }
  if (!article) notFound();

  const seoDescription = article.metaDescription || article.excerpt || undefined;
  const seoKeywordsList = article.seoKeywords
    ? article.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : [];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: seoDescription,
    ...(seoKeywordsList.length > 0 && { keywords: seoKeywordsList.join(", ") }),
    ...(article.coverImageUrl && { image: article.coverImageUrl }),
    ...(article.publishedAt && {
      datePublished: new Date(article.publishedAt).toISOString(),
    }),
    dateModified: new Date(article.createdAt).toISOString(),
    author: {
      "@type": "Organization",
      name: "บริษัท ท๊อปฟอร์ม อสังหาริมทรัพย์ จำกัด",
    },
    publisher: {
      "@type": "Organization",
      name: "ท๊อปฟอร์ม อสังหาริมทรัพย์",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/articles/${article.slug}`,
    },
  };

  return (
    <article className="w-full min-w-0 max-w-3xl mx-auto" itemScope itemType="https://schema.org/Article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="mb-4">
        <Link href="/articles" className="text-blue text-sm font-medium hover:underline">
          ← กลับไปรายการบทความ
        </Link>
      </div>

      {/* รูปปกด้านบนเต็มความกว้าง */}
      {article.coverImageUrl ? (
        <div className="rounded-2xl overflow-hidden bg-gray-100 mb-6 md:mb-8">
          <img
            src={article.coverImageUrl}
            alt=""
            className="w-full aspect-[21/9] md:aspect-[3/1] object-cover"
          />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-navy/10 to-blue/10 aspect-[21/9] md:aspect-[3/1] flex items-center justify-center mb-6 md:mb-8">
          <span className="text-gray-400 text-lg md:text-xl">รูปปกบทความ</span>
        </div>
      )}

      {/* หัวข้อและเมตาดาต้า */}
      <header className="mb-4 md:mb-6">
        <h1 className="font-bold text-xl md:text-2xl lg:text-3xl text-navy leading-tight" itemProp="headline">
          {article.title}
        </h1>
        {article.publishedAt && (
          <p className="text-gray-500 text-sm mt-2">
            เผยแพร่เมื่อ {formatDate(article.publishedAt)}
          </p>
        )}
        <div className="mt-3">
          <ShareButtons url={`${siteUrl}/articles/${article.slug}`} title={article.title} />
        </div>
      </header>

      {/* คำอธิบายย่อ */}
      {article.excerpt && (
        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8 pb-6 border-b border-gray-100">
          {article.excerpt}
        </p>
      )}

      {/* เนื้อหาบทความ (Markdown + รูปแทรกในเนื้อหา) */}
      <div className="article-body" itemProp="articleBody" style={{ wordBreak: "break-word" }}>
        <ArticleBody content={article.body} />
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue text-white text-sm font-medium hover:bg-blue/90 transition-colors"
        >
          ดูบทความอื่นๆ
        </Link>
      </div>
    </article>
  );
}
