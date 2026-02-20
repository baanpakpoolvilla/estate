import Link from "next/link";
import type { Metadata } from "next";
import { getArticlesForList } from "@/lib/data";

export const metadata: Metadata = {
  title: "บทความ",
  description:
    "บทความและแนวทางเกี่ยวกับการลงทุนพูลวิลล่า การเลือกทำเล สัญญาบริหาร และการประมาณการรายได้",
  openGraph: {
    title: "บทความ | ท๊อปฟอร์ม อสังหาริมทรัพย์",
    description: "บทความและแนวทางเกี่ยวกับการลงทุนพูลวิลล่า",
  },
  alternates: { canonical: "/articles" },
};

// ให้ Vercel/production ดึงข้อมูลจาก DB ทุกครั้ง เหมือน localhost
export const dynamic = "force-dynamic";

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

export default async function ArticlesPage() {
  let articles: Awaited<ReturnType<typeof getArticlesForList>> = [];
  try {
    articles = await getArticlesForList();
  } catch {
    // DB error — แสดงหน้ารายการว่าง
  }
  return (
    <div className="w-full min-w-0">
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-navy">บทความ</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          บทความและแนวทางเกี่ยวกับการลงทุนพูลวิลล่า
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
          ยังไม่มีบทความ
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug || article.id}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:border-blue/20"
            >
              {/* รูปปก */}
              <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                {article.coverImageUrl ? (
                  <img
                    src={article.coverImageUrl}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy/10 to-blue/10">
                    <span className="text-gray-400 text-4xl font-light">บทความ</span>
                  </div>
                )}
              </div>
              {/* เนื้อหาการ์ด */}
              <div className="flex flex-col flex-1 p-4 sm:p-5">
                <h2 className="font-semibold text-navy text-base sm:text-lg group-hover:text-blue line-clamp-2">
                  {article.title}
                </h2>
                {article.publishedAt && (
                  <p className="text-gray-500 text-xs mt-1">
                    {formatDate(article.publishedAt)}
                  </p>
                )}
                {article.excerpt && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-1">
                    {article.excerpt}
                  </p>
                )}
                <span className="inline-flex items-center justify-center min-h-[44px] mt-4 py-3 sm:py-2.5 px-4 rounded-xl bg-blue text-white text-sm font-medium group-hover:bg-blue/90 transition-colors">
                  อ่านต่อ
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
