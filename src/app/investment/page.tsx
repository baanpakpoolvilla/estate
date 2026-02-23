import Link from "next/link";
import type { Metadata } from "next";
import { getPortfolioStats } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ลงทุนกับเรา",
  description:
    "ลงทุนพูลวิลล่ากับผู้เชี่ยวชาญ เข้าถึงโอกาสที่คนอื่นเข้าถึงไม่ได้ จองล่วงหน้า ซื้อขายล่วงหน้า รับเงินได้ทันที",
  openGraph: {
    title: "ลงทุนกับเรา | ท๊อปฟอร์ม อสังหาริมทรัพย์",
    description: "ลงทุนพูลวิลล่ากับผู้เชี่ยวชาญ เข้าถึงดีลพิเศษ",
  },
  alternates: { canonical: "/investment" },
};

export default async function InvestmentPage() {
  const stats = await getPortfolioStats();
  return (
    <div className="w-full min-w-0">
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-navy">
          ลงทุนพูลวิลล่ากับผู้เชี่ยวชาญ
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base md:text-lg">
          เข้าถึงโอกาสที่คนอื่นเข้าถึงไม่ได้ จองล่วงหน้า ซื้อขายล่วงหน้า รับเงินได้ทันที
        </p>
      </div>

      <div className="space-y-5 sm:space-y-6 md:space-y-10">
        {/* ข้อความหลัก: เราคือผู้เชี่ยวชาญ เข้าถึงได้ที่อื่นไม่มี */}
        <section className="bg-navy text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8">
          <h2 className="font-semibold text-lg md:text-xl mb-4">
            เราคือผู้เชี่ยวชาญที่เข้าถึงพูลวิลล่าที่คนอื่นไม่สามารถเข้าถึงได้
          </h2>
          <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4">
            โครงการของเราเชื่อมต่อกับพูลวิลล่าคุณภาพในทำเลดี ที่ไม่เปิดขายผ่านช่องทางทั่วไป
            นักลงทุนที่ร่วมงานกับเราได้เปรียบจากการเข้าถึงดีลพิเศษ การันตีคุณภาพและความต้องการของตลาด
            ไม่ใช่สินค้าค้างหรือบ้านที่ตลาดไม่ต้องการ
          </p>
          <ul className="text-white/90 text-sm md:text-base space-y-2 list-disc list-inside">
            <li>เข้าถึงพูลวิลล่าที่จำกัดวง ไม่เปิดขายในตลาดทั่วไป</li>
            <li>ทำเลและคุณภาพผ่านการคัดสรร โอกาสที่คนอื่นหาไม่ได้</li>
            <li>ไม่ใช่บ้านขายไม่ออกหรือสินค้าที่ตลาดไม่ต้องการ</li>
          </ul>
        </section>

        {/* จองล่วงหน้า / ซื้อขายล่วงหน้า */}
        <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy text-lg md:text-xl mb-3">
            จองล่วงหน้า ซื้อขายล่วงหน้า ได้กับเรา
          </h2>
          <p className="text-gray-700 text-sm md:text-base mb-4">
            ทำงานกับเรา คุณสามารถจองสิทธิ์ลงทุนล่วงหน้า หรือซื้อขายหน่วยลงทุนล่วงหน้าได้
            ไม่ต้องรอให้โครงการเปิดขายตามปกติ ลดความเสี่ยงจากความไม่แน่นอนของตลาด
          </p>
          <ul className="text-gray-700 text-sm md:text-base space-y-2 list-disc list-inside">
            <li>จองสิทธิ์ลงทุนล่วงหน้าก่อนโครงการเปิดขายทั่วไป</li>
            <li>ซื้อขายหน่วยลงทุนล่วงหน้า ตามเงื่อนไขที่เราจัดเตรียมไว้</li>
            <li>วางแผนการลงทุนและสภาพคล่องได้ล่วงหน้า</li>
          </ul>
        </section>

        {/* ลงทุนรับเงินได้เลย ไม่มีช่องว่าง */}
        <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy text-lg md:text-xl mb-3">
            ลงทุนรับเงินได้เลย ไม่ต้องมีช่องว่าง
          </h2>
          <p className="text-gray-700 text-sm md:text-base mb-4">
            โมเดลของเราออกแบบให้คุณเริ่มรับรายได้จากวันแรกที่ลงทุน
            ไม่มีช่วงว่างรอโครงการก่อสร้างหรือรอผู้เช่า บ้านที่เรานำเสนอพร้อมสร้างรายได้ให้คุณทันที
          </p>
          <ul className="text-gray-700 text-sm md:text-base space-y-2 list-disc list-inside">
            <li>รับรายได้ตั้งแต่เริ่มลงทุน ไม่มีช่องว่างรอโครงการหรือผู้เช่า</li>
            <li>บ้านพร้อมปล่อยเช่า หรือมีสัญญาบริหารต่อเนื่อง</li>
            <li>ไม่ใช่สินค้าค้างหรือบ้านที่ขายไม่ออกจนต้องรอสภาพคล่อง</li>
          </ul>
        </section>

        {/* ไม่ใช่บ้านขายไม่ออก / ตลาดไม่ต้องการ */}
        <section className="bg-offwhite rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100">
          <h2 className="font-semibold text-navy text-lg md:text-xl mb-3">
            โอกาสคุณภาพ ไม่ใช่สินค้าค้างหรือที่ตลาดไม่ต้องการ
          </h2>
          <p className="text-gray-700 text-sm md:text-base mb-4">
            ทุกหน่วยที่เราเสนอเป็นพูลวิลล่าที่ผ่านการคัดสรรจากทีมผู้เชี่ยวชาญ
            ทำเลมี demand ชัดเจน ไม่ใช่บ้านที่ขายไม่ออกหรือสินค้าที่ตลาดไม่ต้องการ
            เราช่วยคุณหลีกเลี่ยงความเสี่ยงจากการลงทุนในสินทรัพย์ที่ขาดสภาพคล่องหรือความน่าสนใจในตลาด
          </p>
          <ul className="text-gray-700 text-sm md:text-base space-y-2 list-disc list-inside">
            <li>คัดสรรเฉพาะพูลวิลล่าที่มี demand และความน่าสนใจในตลาด</li>
            <li>ไม่นำเสนอสินค้าค้างหรือบ้านที่ขายไม่ออก</li>
            <li>โปร่งใสเรื่องประวัติการเช่าและความต้องการของตลาด</li>
          </ul>
        </section>

        {/* ตัวเลขรวมโครงการ (ข้อมูลจริง) */}
        <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy mb-3 md:text-lg">ตัวเลขรวมโครงการ</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: "วิลล่าทั้งหมด", value: `${stats.totalVillas} หลัง` },
              { label: "มูลค่ารวม", value: `฿${formatNumber(stats.totalValue)}` },
              { label: "กำไรเฉลี่ย/เดือน", value: `฿${formatNumber(stats.avgProfitMonthly)}` },
              { label: "ROI เฉลี่ย", value: `~${stats.avgRoi}%` },
            ].map((item) => (
              <div key={item.label} className="bg-offwhite rounded-xl p-3 md:p-4">
                <p className="text-gray-500 text-xs md:text-sm">{item.label}</p>
                <p className="font-semibold text-navy text-sm md:text-base">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/villas"
            className="flex-1 block py-3 text-center font-semibold rounded-xl bg-blue text-white"
          >
            ดูรายการบ้านที่พร้อมลงทุน
          </Link>
          <Link
            href="/contact"
            className="flex-1 block py-3 text-center font-semibold rounded-xl border border-blue text-blue bg-white"
          >
            ปรึกษาทีมงาน / ขอข้อมูลเพิ่มเติม
          </Link>
        </section>
      </div>
    </div>
  );
}
