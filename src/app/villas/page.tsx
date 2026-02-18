import Link from "next/link";

const villas = [
  { id: "1", name: "วิลล่า บีช 101", location: "หาดบางแสน", price: "12.9", roi: "8.5", beds: 4, sqm: 280 },
  { id: "2", name: "วิลล่า ฮิลล์ 202", location: "เขาใหญ่", price: "15.5", roi: "9.2", beds: 5, sqm: 320 },
  { id: "3", name: "วิลล่า เลค 303", location: "พัทยา", price: "14.2", roi: "8.8", beds: 4, sqm: 300 },
  { id: "4", name: "วิลล่า ซันเซ็ต 404", location: "หัวหิน", price: "18.0", roi: "9.5", beds: 6, sqm: 380 },
];

export default function VillasPage() {
  return (
    <main className="min-h-screen pb-6">
      <header className="sticky top-0 z-40 bg-navy text-white px-4 py-3">
        <h1 className="font-semibold text-lg">พูลวิลล่าทั้งหมด</h1>
        <p className="text-white/80 text-sm">เลือกหลังที่สนใจดูรายละเอียดการลงทุน</p>
      </header>

      <div className="px-4 py-4 space-y-4">
        {villas.map((villa) => (
          <Link
            key={villa.id}
            href={`/villas/${villa.id}`}
            className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.99]"
          >
            <div className="aspect-[16/10] bg-gradient-to-br from-blue/20 to-navy/30" />
            <div className="p-4">
              <h2 className="font-semibold text-navy">{villa.name}</h2>
              <p className="text-gray-500 text-sm">{villa.location}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                <span>{villa.beds} ห้องนอน</span>
                <span>{villa.sqm} ตร.ม.</span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className="text-blue font-semibold">฿{villa.price} ลบ.</span>
                <span className="text-navy font-medium">ROI ~{villa.roi}%</span>
              </div>
              <p className="text-blue text-sm font-medium mt-1">ดูรายละเอียดการลงทุน →</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
