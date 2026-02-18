import Link from "next/link";
import { notFound } from "next/navigation";

const villas: Record<string, { name: string; location: string; price: string; roi: string; beds: number; baths: number; sqm: number; land: number; desc: string }> = {
  "1": { name: "วิลล่า บีช 101", location: "หาดบางแสน", price: "12.9", roi: "8.5", beds: 4, baths: 4, sqm: 280, land: 120, desc: "พูลวิลล่าหน้าทะเล วิวเปิด สะอาด บริหารปล่อยเช่าให้ครบ" },
  "2": { name: "วิลล่า ฮิลล์ 202", location: "เขาใหญ่", price: "15.5", roi: "9.2", beds: 5, baths: 5, sqm: 320, land: 150, desc: "วิลล่าบนเขา ใกล้ธรรมชาติ อากาศดี ค่าเช่าสูงช่วงยาว" },
  "3": { name: "วิลล่า เลค 303", location: "พัทยา", price: "14.2", roi: "8.8", beds: 4, baths: 4, sqm: 300, land: 100, desc: "ใกล้ชายหาดพัทยา สะดวก รายได้สม่ำเสมอ" },
  "4": { name: "วิลล่า ซันเซ็ต 404", location: "หัวหิน", price: "18.0", roi: "9.5", beds: 6, baths: 6, sqm: 380, land: 200, desc: "วิลล่าหน้าทะเลหัวหิน พื้นที่กว้าง กลุ่มลูกค้าพรีเมียม" },
};

export default function VillaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const villa = villas[id];
  if (!villa) notFound();

  return (
    <main className="min-h-screen pb-6">
      <header className="sticky top-0 z-40 bg-navy text-white px-4 py-3 flex items-center justify-between">
        <Link href="/villas" className="text-white/90 text-sm">← กลับ</Link>
        <a href="tel:0812345678" className="text-sm">โทร</a>
      </header>

      <div className="aspect-[4/3] bg-gradient-to-br from-blue/30 to-navy/50" />

      <div className="px-4 -mt-2 rounded-t-3xl bg-offwhite pt-6 pb-8">
        <h1 className="font-bold text-xl text-navy">{villa.name}</h1>
        <p className="text-gray-500">{villa.location}</p>

        <div className="grid grid-cols-3 gap-2 my-4 text-center">
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <p className="text-gray-500 text-xs">ราคา</p>
            <p className="font-semibold text-blue">฿{villa.price} ลบ.</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <p className="text-gray-500 text-xs">ขนาด</p>
            <p className="font-semibold text-navy">{villa.sqm} ตร.ม.</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <p className="text-gray-500 text-xs">ห้องนอน</p>
            <p className="font-semibold text-navy">{villa.beds} ห้อง</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h2 className="font-semibold text-navy mb-2">สรุปการลงทุน</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">เงินลงทุนเริ่มต้น</span>
              <span className="font-medium">฿{villa.price} ลบ.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">รายได้เช่าคาดการณ์/ปี</span>
              <span className="font-medium text-green-600">~฿1.0–1.2 ลบ.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ROI คาดการณ์</span>
              <span className="font-semibold text-blue">~{villa.roi}%</span>
            </div>
          </div>
          <Link
            href="/investment"
            className="mt-3 block w-full py-2 text-center text-blue font-medium text-sm"
          >
            ดูรายละเอียดตัวเลข →
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h2 className="font-semibold text-navy mb-2">รายละเอียดบ้าน</h2>
          <p className="text-gray-600 text-sm">{villa.desc}</p>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li>ที่ดิน {villa.land} ตร.ว.</li>
            <li>พื้นที่ใช้สอย {villa.sqm} ตร.ม.</li>
            <li>ห้องนอน {villa.beds} / ห้องน้ำ {villa.baths}</li>
          </ul>
        </div>

        <div className="fixed bottom-20 left-4 right-4 z-30 md:max-w-lg md:mx-auto">
          <Link
            href="/contact"
            className="block w-full py-3 text-center font-semibold rounded-xl bg-blue text-white"
          >
            ขอข้อมูลเพิ่ม / นัดดูโครงการ
          </Link>
        </div>
      </div>
    </main>
  );
}
