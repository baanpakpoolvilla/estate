import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen pb-6">
      {/* App bar */}
      <header className="sticky top-0 z-40 bg-navy text-white px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-lg">Pool Villa Estate</span>
        <a href="tel:0812345678" className="p-2 rounded-full bg-white/10 text-sm">
          โทร
        </a>
      </header>

      {/* Hero */}
      <section className="relative bg-navy text-white rounded-b-3xl overflow-hidden mx-4 mt-2">
        <div className="absolute inset-0 bg-gradient-to-b from-blue/30 to-navy" />
        <div className="relative px-5 py-8 min-h-[200px] flex flex-col justify-end">
          <h1 className="text-xl font-bold mb-1">
            ลงทุนพูลวิลล่าตากอากาศ
          </h1>
          <p className="text-white/90 text-sm mb-4">
            ทำเลดี ผลตอบแทนชัดเจน บริหารจัดการให้ครบวงจร
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/investment"
              className="block w-full py-3 text-center font-semibold rounded-xl bg-blue text-white"
            >
              ดูแพ็กเกจลงทุน
            </Link>
            <Link
              href="/contact"
              className="block w-full py-3 text-center font-semibold rounded-xl border border-blue text-blue bg-transparent"
            >
              ปรึกษาทันที
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats - horizontal scroll */}
      <section className="px-4 -mt-4 relative z-10">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {[
            { label: "ROI เฉลี่ย", value: "8-10%", unit: "ต่อปี" },
            { label: "คืนทุนประมาณ", value: "10-12", unit: "ปี" },
            { label: "วิลล่า", value: "24", unit: "หลัง" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex-shrink-0 w-32 bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
            >
              <p className="text-gray-500 text-xs mb-0.5">{item.label}</p>
              <p className="text-navy font-bold text-lg">{item.value}</p>
              <p className="text-gray-600 text-xs">{item.unit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured villas */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-navy">วิลล่าแนะนำ</h2>
          <Link href="/villas" className="text-blue text-sm font-medium">
            ดูทั้งหมด
          </Link>
        </div>
        <div className="space-y-4">
          {[
            { id: "1", name: "วิลล่า บีช 101", location: "หาดบางแสน", price: "12.9", roi: "8.5" },
            { id: "2", name: "วิลล่า ฮิลล์ 202", location: "เขาใหญ่", price: "15.5", roi: "9.2" },
            { id: "3", name: "วิลล่า เลค 303", location: "พัทยา", price: "14.2", roi: "8.8" },
          ].map((villa) => (
            <Link
              key={villa.id}
              href={`/villas/${villa.id}`}
              className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.99] transition-transform"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-blue/20 to-navy/30" />
              <div className="p-4">
                <h3 className="font-semibold text-navy">{villa.name}</h3>
                <p className="text-gray-500 text-sm">{villa.location}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-blue font-semibold">
                    ฿{villa.price} ลบ.
                  </span>
                  <span className="text-navy text-sm font-medium">
                    ROI ~{villa.roi}%
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-1">ดูรายละเอียดการลงทุน →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Investment highlight */}
      <section className="mx-4 mt-8 bg-navy text-white rounded-2xl p-5">
        <h2 className="font-bold text-lg mb-3">จุดเด่นการลงทุน</h2>
        <ul className="space-y-2 text-sm text-white/90">
          <li className="flex items-start gap-2">
            <span className="text-blue">•</span>
            ทำเลติดทะเล/ธรรมชาติ ค่าเช่าสูง
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue">•</span>
            บริการบริหารปล่อยเช่าให้ ครบวงจร
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue">•</span>
            ตัวเลข ROI เปิดเผย โปร่งใส
          </li>
        </ul>
        <Link
          href="/investment"
          className="mt-4 block w-full py-3 text-center font-semibold rounded-xl bg-blue text-white"
        >
          ดูรายละเอียดการลงทุน
        </Link>
      </section>

      {/* Sticky CTA - optional, above bottom nav */}
      <section className="fixed bottom-20 left-4 right-4 z-30 md:max-w-lg md:left-auto md:right-auto md:mx-auto">
        <Link
          href="/contact"
          className="block w-full py-3 text-center font-semibold rounded-xl bg-blue text-white shadow-lg"
        >
          นัดหมายดูโครงการ
        </Link>
      </section>
    </main>
  );
}
