import { Suspense } from "react";
import type { Metadata } from "next";
import { getVillasForList } from "@/lib/data";
import VillasContent from "./VillasContent";

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

export const dynamic = "force-dynamic";

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

      <Suspense>
        <VillasContent villas={villasList} />
      </Suspense>
    </div>
  );
}
