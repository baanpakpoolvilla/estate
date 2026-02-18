import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import { getVillasForList, getProjectPromos } from "@/lib/data";

export default async function HomePage() {
  const [villasList, featuredProjects] = await Promise.all([
    getVillasForList(),
    getProjectPromos(),
  ]);
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

  return (
    <div className="w-full min-w-0">
      {/* Hero - สไลด์บ้านแนะนำ */}
      <HeroSlider villas={heroVillas} />

      {/* Quick stats */}
      <section className="mt-6">
        <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 md:overflow-visible md:grid md:grid-cols-3 md:gap-4 scroll-smooth">
          {[
            { label: "ROI เฉลี่ย", value: "8–10%", unit: "ต่อปี" },
            { label: "คืนทุนประมาณ", value: "10–12", unit: "ปี" },
            { label: "วิลล่า", value: "24", unit: "หลัง" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex-shrink-0 w-32 md:w-auto bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
            >
              <p className="text-gray-500 text-xs mb-0.5">{item.label}</p>
              <p className="text-navy font-bold text-lg md:text-xl">{item.value}</p>
              <p className="text-gray-600 text-xs">{item.unit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured villas - การ์ดสไตล์เดียวกับหน้ารายการบ้าน */}
      <section className="mt-8 md:mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg md:text-xl text-navy">วิลล่าแนะนำ</h2>
          <Link href="/villas" className="text-blue text-sm font-medium hover:underline">
            ดูทั้งหมด
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredVillas.map((villa) => (
            <Link
              key={villa.id}
              href={`/villas/${villa.id}`}
              className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:border-blue/20"
            >
              <div className="relative aspect-[16/10] bg-navy overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${villa.mainVideoId}/mqdefault.jpg`}
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
      <section className="mt-8 md:mt-10">
        <div className="mb-4">
          <h2 className="font-bold text-lg md:text-xl text-navy">
            โครงการพูลวิลล่าหรู และโครงการใหม่
          </h2>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            โครงการที่เราคัดสรรสำหรับนักลงทุน เข้าถึงได้ผ่านเราเท่านั้น
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {featuredProjects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:border-blue/20"
            >
              <div className="relative aspect-[21/10] bg-gradient-to-br from-navy via-blue/30 to-navy overflow-hidden">
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

      {/* จุดเด่นการลงทุน - สอดคล้องกับหน้าลงทุน */}
      <section className="mt-8 md:mt-10 bg-navy text-white rounded-2xl p-5 md:p-6 lg:p-8">
        <h2 className="font-bold text-lg md:text-xl mb-3">ทำไมต้องลงทุนกับเรา</h2>
        <ul className="space-y-2 text-sm md:text-base text-white/90 list-disc list-inside">
          <li>ผู้เชี่ยวชาญที่เข้าถึงพูลวิลล่าที่คนอื่นเข้าถึงไม่ได้</li>
          <li>จองล่วงหน้า ซื้อขายล่วงหน้าได้ ลงทุนรับเงินได้เลย ไม่มีช่องว่าง</li>
          <li>คัดสรรเฉพาะบ้านที่ตลาดต้องการ ไม่ใช่สินค้าค้างหรือขายไม่ออก</li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <Link
            href="/investment"
            className="flex-1 block py-3 text-center font-semibold rounded-xl bg-blue text-white"
          >
            ดูรายละเอียดการลงทุน
          </Link>
          <Link
            href="/contact"
            className="flex-1 block py-3 text-center font-semibold rounded-xl border border-white/50 text-white"
          >
            ปรึกษาทีมงาน
          </Link>
        </div>
      </section>
    </div>
  );
}
