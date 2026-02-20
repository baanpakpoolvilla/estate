import Link from "next/link";
import type { Metadata } from "next";
import { getVillasForList } from "@/lib/data";

export const metadata: Metadata = {
  title: "รายการบ้าน",
  description:
    "รายการพูลวิลล่าพร้อมปล่อยเช่า ราคา ROI กำไรต่อเดือน เลือกหลังที่สนใจ ดูวิดีโอ แกลลอรี่ และตัวเลขการลงทุน",
  openGraph: {
    title: "รายการบ้าน | ท๊อปฟอร์ม อสังหาริมทรัพย์",
    description: "รายการพูลวิลล่าพร้อมปล่อยเช่า ราคา ROI กำไรต่อเดือน",
  },
  alternates: { canonical: "/villas" },
};

export default async function VillasPage() {
  let villasList: Awaited<ReturnType<typeof getVillasForList>> = [];
  try {
    villasList = await getVillasForList();
  } catch {
    // DB error — แสดงหน้ารายการว่าง
  }
  return (
    <div className="w-full min-w-0">
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-navy">รายการบ้าน</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          เลือกหลังที่สนใจ ดูวิดีโอ แกลลอรี่ ประวัติการเช่า และตัวเลขการลงทุนแบบละเอียด
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {villasList.map((villa) => (
          <Link
            key={villa.id}
            href={`/villas/${villa.id}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:border-blue/20"
          >
            {/* Thumbnail: URL รูปหลัก หรือ YouTube */}
            <div className="relative aspect-[16/10] bg-navy overflow-hidden">
              <img
                src={villa.imageUrl || `https://img.youtube.com/vi/${villa.mainVideoId}/mqdefault.jpg`}
                alt={villa.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
              {villa.tag && (
                <span className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-white/95 text-navy text-xs font-medium">
                  {villa.tag}
                </span>
              )}
              <span className="absolute bottom-2 left-2 text-white/90 text-xs font-medium">
                ดูวิดีโอ + รายละเอียดการลงทุน
              </span>
            </div>

            <div className="p-4 sm:p-5">
              <h2 className="font-semibold text-navy text-base sm:text-lg group-hover:text-blue">
                {villa.name}
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">{villa.location}</p>

              {/* ตัวเลขหลัก: ราคา, ROI, กำไร/เดือน */}
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

              {/* สเปกบ้าน */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-sm text-gray-600">
                <span>{villa.beds} ห้องนอน</span>
                <span>{villa.baths} ห้องน้ำ</span>
                <span>{villa.sqm} ตร.ม.</span>
              </div>

              <p className="mt-3 pt-3 border-t border-gray-100 text-blue text-sm font-medium">
                ดูรายละเอียดการลงทุน
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
