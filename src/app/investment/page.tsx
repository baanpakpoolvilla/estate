import Link from "next/link";

export default function InvestmentPage() {
  return (
    <main className="min-h-screen pb-6">
      <header className="sticky top-0 z-40 bg-navy text-white px-4 py-3">
        <h1 className="font-semibold text-lg">ภาพรวมการลงทุน</h1>
        <p className="text-white/80 text-sm">ตัวเลขและโมเดลรายได้</p>
      </header>

      <div className="px-4 py-4 space-y-6">
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy mb-3">ตัวเลขรวมโครงการ</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "วิลล่าทั้งหมด", value: "24 หลัง" },
              { label: "Occupancy เฉลี่ย", value: "65–75%" },
              { label: "ADR เฉลี่ย", value: "฿8,000+/คืน" },
              { label: "ROI เฉลี่ย", value: "8–10%" },
            ].map((item) => (
              <div key={item.label} className="bg-offwhite rounded-xl p-3">
                <p className="text-gray-500 text-xs">{item.label}</p>
                <p className="font-semibold text-navy">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-navy text-white rounded-2xl p-5">
          <h2 className="font-semibold mb-3">โมเดลรายได้</h2>
          <ul className="text-sm text-white/90 space-y-2">
            <li>• รายได้จากค่าเช่ารายวัน/รายเดือน</li>
            <li>• บริหารปล่อยเช่าและทำความสะอาดให้</li>
            <li>• หักค่าใช้จ่ายแล้วได้กำไรสุทธิต่อปี</li>
          </ul>
          <Link
            href="/villas"
            className="mt-4 inline-block py-2 px-4 rounded-xl bg-blue text-white text-sm font-medium"
          >
            ดูวิลล่าแต่ละหลัง
          </Link>
        </section>

        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy mb-3">ประมาณการคร่าวๆ</h2>
          <p className="text-gray-600 text-sm mb-4">
            เงินลงทุน ฿12–18 ลบ. คาดการณ์รายได้เช่า ฿1.0–1.5 ลบ./ปี (ขึ้นกับทำเลและอัตราการเข้าพัก)
          </p>
          <Link
            href="/contact"
            className="block w-full py-3 text-center font-semibold rounded-xl bg-blue text-white"
          >
            ขอไฟล์ ROI แบบละเอียด
          </Link>
        </section>
      </div>
    </main>
  );
}
