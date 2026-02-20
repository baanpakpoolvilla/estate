import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import { getVillasForList, getProjectPromos, getArticlesForList } from "@/lib/data";

// ให้ render ฝั่ง server ทุกครั้ง เพื่อไม่ให้ build ล้มเหลวเมื่อไม่มี DB
export const dynamic = "force-dynamic";

function formatDate(d: Date | string | null | undefined): string {
  if (d == null) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function HomePage() {
  let villasList: Awaited<ReturnType<typeof getVillasForList>> = [];
  let featuredProjects: Awaited<ReturnType<typeof getProjectPromos>> = [];
  let articlesList: Awaited<ReturnType<typeof getArticlesForList>> = [];
  try {
    const [villas, projects, articles] = await Promise.all([
      getVillasForList(),
      getProjectPromos(),
      getArticlesForList(),
    ]);
    villasList = villas;
    featuredProjects = projects;
    articlesList = articles;
  } catch {
    // DB/Prisma error — แสดงหน้าแรกได้ แต่ไม่มีข้อมูลวิลล่า/โครงการ/บทความ
  }
  const heroVillas = villasList.map((v) => ({
    id: v.id,
    name: v.name,
    location: v.location,
    price: v.price,
    roi: v.roi,
    profitMonthly: v.profitMonthly,
    tag: v.tag ?? undefined,
  }));
  const featuredVillas = villasList.slice(0, 3);
  const featuredArticles = articlesList.slice(0, 3);

  return (
    <div className="w-full min-w-0">
      {/* Hero - สไลด์บ้านแนะนำ */}
      <HeroSlider villas={heroVillas} />

      {/* Quick stats - มือถือ: scroll แนวนอน, แท็บเล็ตขึ้นไป: grid */}
      <section className="mt-4 sm:mt-6 md:mt-8">
        <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 sm:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-4 scroll-smooth snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { label: "ROI เฉลี่ย", value: "8–10%", unit: "ต่อปี" },
            { label: "คืนทุนประมาณ", value: "10–12", unit: "ปี" },
            { label: "วิลล่า", value: "24", unit: "หลัง" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex-shrink-0 w-[140px] xs:w-36 sm:w-auto sm:flex-1 md:flex-none snap-start bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 border border-gray-100"
            >
              <p className="text-gray-500 text-[10px] sm:text-xs mb-0.5">{item.label}</p>
              <p className="text-navy font-bold text-base sm:text-lg md:text-xl">{item.value}</p>
              <p className="text-gray-600 text-[10px] sm:text-xs">{item.unit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured villas - การ์ดสไตล์เดียวกับหน้ารายการบ้าน */}
      <section className="mt-6 sm:mt-8 md:mt-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-navy">วิลล่าแนะนำ</h2>
          <Link href="/villas" className="text-blue text-sm font-medium hover:underline min-h-[44px] flex items-center">
            ดูทั้งหมด
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {featuredVillas.map((villa) => (
            <Link
              key={villa.id}
              href={`/villas/${villa.id}`}
              className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:border-blue/20"
            >
              <div className="relative aspect-[16/10] bg-navy overflow-hidden">
                <img
                  src={villa.imageUrl || `https://img.youtube.com/vi/${villa.mainVideoId}/mqdefault.jpg`}
                  alt={villa.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                {villa.tag && (
                  <span className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-white/95 text-navy text-xs font-medium">
                    {villa.tag}
                  </span>
                )}
              </div>
              <div className="p-4 md:p-5">
                <h3 className="font-semibold text-navy text-base md:text-lg group-hover:text-blue">
                  {villa.name}
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">{villa.location}</p>
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="bg-offwhite rounded-lg py-2 px-1">
                    <p className="text-gray-500 text-[10px] md:text-xs truncate">ราคา</p>
                    <p className="text-blue font-semibold text-xs md:text-sm truncate">
                      ฿{villa.price} ลบ.
                    </p>
                  </div>
                  <div className="bg-offwhite rounded-lg py-2 px-1">
                    <p className="text-gray-500 text-[10px] md:text-xs truncate">ROI</p>
                    <p className="text-navy font-semibold text-xs md:text-sm">~{villa.roi}%</p>
                  </div>
                  <div className="bg-offwhite rounded-lg py-2 px-1">
                    <p className="text-gray-500 text-[10px] md:text-xs truncate">กำไร/เดือน</p>
                    <p className="text-green-700 font-semibold text-xs md:text-sm truncate">
                      {villa.profitMonthly}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-blue text-sm font-medium">
                  ดูวิดีโอ แกลลอรี่ และรายละเอียดการลงทุน
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* โครงการพูลวิลล่าหรู / โครงการใหม่ */}
      <section className="mt-6 sm:mt-8 md:mt-10">
        <div className="mb-3 sm:mb-4">
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-navy">
            โครงการพูลวิลล่าหรู และโครงการใหม่
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            โครงการที่เราคัดสรรสำหรับนักลงทุน เข้าถึงได้ผ่านเราเท่านั้น
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {featuredProjects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:border-blue/20"
            >
              <div className="relative aspect-[21/10] bg-gradient-to-br from-navy via-blue/30 to-navy overflow-hidden">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue/40 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 text-white">
                  {project.badge && (
                    <span className="inline-block w-fit mb-2 px-2 py-1 rounded-lg bg-white/95 text-navy text-xs font-semibold">
                      {project.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-lg md:text-xl text-white drop-shadow-sm">
                    {project.name}
                  </h3>
                  <p className="text-white/90 text-sm mt-0.5">{project.tagline}</p>
                  <p className="text-white/80 text-xs mt-1">{project.location}</p>
                </div>
              </div>
              <div className="p-4 md:p-5">
                <p className="text-blue text-sm font-medium group-hover:underline">
                  สนใจโครงการนี้
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* บทความแนะนำ */}
      {featuredArticles.length > 0 && (
        <section className="mt-6 sm:mt-8 md:mt-10">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-navy">บทความแนะนำ</h2>
            <Link href="/articles" className="text-blue text-sm font-medium hover:underline min-h-[44px] flex items-center">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug || article.id}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:border-blue/20"
              >
                <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy/10 to-blue/10">
                      <span className="text-gray-400 text-2xl font-light">บทความ</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-4 md:p-5">
                  <h3 className="font-semibold text-navy text-base md:text-lg group-hover:text-blue line-clamp-2">
                    {article.title}
                  </h3>
                  {article.publishedAt && (
                    <p className="text-gray-500 text-xs mt-1">{formatDate(article.publishedAt)}</p>
                  )}
                  {article.excerpt && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-1">
                      {article.excerpt}
                    </p>
                  )}
                  <span className="inline-flex items-center justify-center min-h-[44px] mt-4 py-3 sm:py-2.5 px-4 rounded-xl bg-blue text-white text-sm font-medium group-hover:bg-blue/90 transition-colors w-fit">
                    อ่านต่อ
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* จุดเด่นการลงทุน - สอดคล้องกับหน้าลงทุน */}
      <section className="mt-6 sm:mt-8 md:mt-10 bg-navy text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8">
        <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">ทำไมต้องลงทุนกับเรา</h2>
        <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-white/90 list-disc list-inside">
          <li>ผู้เชี่ยวชาญที่เข้าถึงพูลวิลล่าที่คนอื่นเข้าถึงไม่ได้</li>
          <li>จองล่วงหน้า ซื้อขายล่วงหน้าได้ ลงทุนรับเงินได้เลย ไม่มีช่องว่าง</li>
          <li>คัดสรรเฉพาะบ้านที่ตลาดต้องการ ไม่ใช่สินค้าค้างหรือขายไม่ออก</li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-5">
          <Link
            href="/investment"
            className="flex-1 flex items-center justify-center min-h-[48px] sm:min-h-[44px] py-3 sm:py-2.5 text-center font-semibold rounded-xl bg-blue text-white active:opacity-90"
          >
            ดูรายละเอียดการลงทุน
          </Link>
          <Link
            href="/contact"
            className="flex-1 flex items-center justify-center min-h-[48px] sm:min-h-[44px] py-3 sm:py-2.5 text-center font-semibold rounded-xl border border-white/50 text-white active:bg-white/10"
          >
            ปรึกษาทีมงาน
          </Link>
        </div>
      </section>
    </div>
  );
}
