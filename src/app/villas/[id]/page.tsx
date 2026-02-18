import Link from "next/link";
import { notFound } from "next/navigation";

type VillaDetail = {
  name: string;
  location: string;
  price: string;
  roi: string;
  beds: number;
  baths: number;
  sqm: number;
  land: number;
  desc: string;
  mainVideoId: string;
  areaVideos: { label: string; youtubeId: string }[];
  gallery: { label: string; area: string }[];
  rentalHistory: { period: string; occupancy: string; avgRate: string; note?: string }[];
  businessHistory: string;
  salePlan: string;
  investmentMonthly: { revenue: string; expenses: string; profit: string };
  accountingSummary: { period: string; revenue: string; profit: string }[];
};

const villas: Record<string, VillaDetail> = {
  "1": {
    name: "วิลล่า บีช 101",
    location: "หาดบางแสน",
    price: "12.9",
    roi: "8.5",
    beds: 4,
    baths: 4,
    sqm: 280,
    land: 120,
    desc: "พูลวิลล่าหน้าทะเล วิวเปิด สะอาด เหมาะสำหรับทั้งครอบครัวและกลุ่มเพื่อน พร้อมทีมบริหารปล่อยเช่าแบบมืออาชีพ",
    mainVideoId: "dQw4w9WgXcQ",
    areaVideos: [
      { label: "โถงนั่งเล่นและครัว", youtubeId: "dQw4w9WgXcQ" },
      { label: "ห้องนอนมาสเตอร์และห้องน้ำ", youtubeId: "dQw4w9WgXcQ" },
      { label: "สระว่ายน้ำและดาดฟ้า", youtubeId: "dQw4w9WgXcQ" },
    ],
    gallery: [
      { label: "มุมมองด้านหน้า", area: "ด้านนอก" },
      { label: "สระว่ายน้ำ", area: "ด้านนอก" },
      { label: "ห้องนั่งเล่น", area: "ภายในบ้าน" },
      { label: "ห้องนอนหลัก", area: "ภายในบ้าน" },
      { label: "ครัวและโต๊ะอาหาร", area: "ภายในบ้าน" },
    ],
    rentalHistory: [
      { period: "ปี 2566", occupancy: "72%", avgRate: "฿8,200/คืน", note: "สูงสุดในช่วงไฮซีซัน" },
      { period: "ปี 2565", occupancy: "68%", avgRate: "฿7,900/คืน" },
    ],
    businessHistory:
      "เริ่มเปิดให้บริการปล่อยเช่าตั้งแต่ปี 2563 บริหารโดยทีมมืออาชีพ มีฐานลูกค้าประจำจากทั้งตลาดไทยและต่างชาติ คะแนนรีวิวเฉลี่ย 4.7/5 จากแพลตฟอร์มชั้นนำ",
    salePlan:
      "ปัจจุบันเปิดขายพร้อมสัญญาบริหารปล่อยเช่าเดิมต่อเนื่อง ผู้ซื้อใหม่สามารถรับรายได้จากการจองล่วงหน้าที่มีอยู่แล้วในระบบทันที",
    investmentMonthly: {
      revenue: "฿120,000",
      expenses: "฿40,000",
      profit: "฿80,000",
    },
    accountingSummary: [
      { period: "ไตรมาส 1/2567", revenue: "฿360,000", profit: "฿225,000" },
      { period: "ไตรมาส 4/2566", revenue: "฿410,000", profit: "฿260,000" },
      { period: "ไตรมาส 3/2566", revenue: "฿320,000", profit: "฿195,000" },
    ],
  },
  "2": {
    name: "วิลล่า ฮิลล์ 202",
    location: "เขาใหญ่",
    price: "15.5",
    roi: "9.2",
    beds: 5,
    baths: 5,
    sqm: 320,
    land: 150,
    desc: "วิลล่าบนเนินเขา ล้อมรอบด้วยต้นไม้และวิวภูเขา บรรยากาศเงียบสงบเหมาะกับกลุ่มครอบครัวและองค์กร",
    mainVideoId: "dQw4w9WgXcQ",
    areaVideos: [
      { label: "โถงนั่งเล่นเพดานสูง", youtubeId: "dQw4w9WgXcQ" },
      { label: "ระเบียงวิวเขา", youtubeId: "dQw4w9WgXcQ" },
    ],
    gallery: [
      { label: "วิวจากระเบียง", area: "ด้านนอก" },
      { label: "ห้องนั่งเล่น", area: "ภายในบ้าน" },
      { label: "สระว่ายน้ำ", area: "ด้านนอก" },
    ],
    rentalHistory: [
      { period: "ปี 2566", occupancy: "70%", avgRate: "฿9,500/คืน" },
    ],
    businessHistory:
      "เน้นกลุ่มลูกค้าองค์กรและครอบครัวขนาดใหญ่ มีแพ็กเกจจัดประชุม/ปาร์ตี้ พร้อมบริการเสริมจากทีมโครงการ",
    salePlan:
      "เปิดขายแบบ Pre-sale เฟส 2 พร้อมแผนการันตีรายได้ในช่วง 2 ปีแรก เงื่อนไขเจรจาได้",
    investmentMonthly: {
      revenue: "฿140,000",
      expenses: "฿45,000",
      profit: "฿95,000",
    },
    accountingSummary: [
      { period: "ปี 2566 รวม", revenue: "฿1,650,000", profit: "฿1,050,000" },
    ],
  },
  "3": {
    name: "วิลล่า เลค 303",
    location: "พัทยา",
    price: "14.2",
    roi: "8.8",
    beds: 4,
    baths: 4,
    sqm: 300,
    land: 100,
    desc: "วิลล่าวิวทะเลสาบ ใกล้สิ่งอำนวยความสะดวกในเมืองพัทยา รายได้เช่าค่อนข้างสม่ำเสมอทั้งปี",
    mainVideoId: "dQw4w9WgXcQ",
    areaVideos: [],
    gallery: [
      { label: "วิวทะเลสาบยามเย็น", area: "ด้านนอก" },
      { label: "ห้องนั่งเล่น", area: "ภายในบ้าน" },
    ],
    rentalHistory: [
      { period: "ปี 2566", occupancy: "69%", avgRate: "฿7,800/คืน" },
    ],
    businessHistory:
      "บ้านปล่อยเช่ามาแล้วมากกว่า 4 ปี มีฐานลูกค้าประจำ และได้รับรีวิวดีต่อเนื่อง",
    salePlan: "ขายพร้อมผู้เช่าปัจจุบัน และสามารถโอนสัญญาบริหารให้ผู้ซื้อใหม่ได้ทันที",
    investmentMonthly: {
      revenue: "฿110,000",
      expenses: "฿38,000",
      profit: "฿72,000",
    },
    accountingSummary: [
      { period: "ปี 2566 รวม", revenue: "฿1,320,000", profit: "฿860,000" },
    ],
  },
  "4": {
    name: "วิลล่า ซันเซ็ต 404",
    location: "หัวหิน",
    price: "18.0",
    roi: "9.5",
    beds: 6,
    baths: 6,
    sqm: 380,
    land: 200,
    desc: "วิลล่าระดับพรีเมียมริมทะเลหัวหิน พื้นที่กว้าง รองรับกลุ่มลูกค้าระดับไฮเอนด์และงานอีเวนต์ส่วนตัว",
    mainVideoId: "dQw4w9WgXcQ",
    areaVideos: [],
    gallery: [
      { label: "สระว่ายน้ำริมทะเล", area: "ด้านนอก" },
      { label: "ห้องรับแขก", area: "ภายในบ้าน" },
    ],
    rentalHistory: [
      { period: "ปี 2566", occupancy: "74%", avgRate: "฿12,000/คืน" },
    ],
    businessHistory:
      "ใช้สำหรับจัดงานส่วนตัว งานเลี้ยง และกลุ่มครอบครัวที่มีกำลังซื้อสูง มีทีมดูแลประจำ",
    salePlan:
      "เปิดขายแบบ Exclusive พร้อมดีลการันตีรายได้เมื่อใช้บริการบริหารของโครงการ",
    investmentMonthly: {
      revenue: "฿180,000",
      expenses: "฿55,000",
      profit: "฿125,000",
    },
    accountingSummary: [
      { period: "ปี 2566 รวม", revenue: "฿2,100,000", profit: "฿1,350,000" },
    ],
  },
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
    <div className="w-full min-w-0 space-y-8 md:space-y-10">
      {/* ส่วนบน: ปุ่มกลับและติดต่อด่วน */}
      <div className="flex items-center justify-between">
        <Link href="/villas" className="text-blue text-sm font-medium hover:underline">
          กลับไปหน้ารายการ
        </Link>
        <a href="tel:0812345678" className="text-sm text-navy font-medium">
          โทรสอบถาม
        </a>
      </div>

      {/* วิดีโอหลัก (Auto play YouTube) */}
      <section className="space-y-3">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${villa.mainVideoId}?autoplay=1&mute=1&loop=1&playlist=${villa.mainVideoId}`}
            title={villa.name}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="text-xs text-gray-500">
          * วิดีโอตัวอย่างบรรยากาศจริงของบ้าน (เปิดอัตโนมัติแบบปิดเสียง)
        </p>
      </section>

      {/* ภาพรวมบ้าน + ตัวเลขสรุปหลัก */}
      <section className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
        <div className="md:col-span-2 space-y-3">
          <h1 className="font-bold text-xl md:text-2xl lg:text-3xl text-navy">
            {villa.name}
          </h1>
          <p className="text-gray-600 md:text-lg">{villa.location}</p>
          <p className="text-gray-700 text-sm md:text-base mt-2">{villa.desc}</p>
          <ul className="mt-3 text-sm md:text-base text-gray-700 space-y-1">
            <li>ที่ดิน {villa.land} ตร.ว.</li>
            <li>พื้นที่ใช้สอย {villa.sqm} ตร.ม.</li>
            <li>ห้องนอน {villa.beds} ห้อง / ห้องน้ำ {villa.baths} ห้อง</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-navy mb-2 md:text-lg">ตัวเลขหลักของบ้าน</h2>
            <div className="space-y-2 text-sm md:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">ราคาขาย</span>
                <span className="font-semibold text-blue">฿{villa.price} ลบ.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ROI คาดการณ์</span>
                <span className="font-semibold text-blue">~{villa.roi}% ต่อปี</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">กำไรสุทธิต่อเดือน (ประมาณการ)</span>
                <span className="font-semibold text-green-700">
                  {villa.investmentMonthly.profit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* วิดีโอแต่ละส่วนของบ้าน + รูปภาพแต่ละส่วน */}
      <section className="space-y-4">
        <h2 className="font-semibold text-navy text-lg md:text-xl">
          วิดีโอและรูปภาพแต่ละส่วนของบ้าน
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* วิดีโอแต่ละส่วน */}
          <div className="space-y-3">
            <h3 className="font-medium text-navy">วิดีโอส่วนต่าง ๆ ภายในบ้าน</h3>
            {villa.areaVideos.length === 0 ? (
              <p className="text-gray-600 text-sm">
                ข้อมูลวิดีโอแต่ละส่วนของบ้านจะถูกอัปเดตเพิ่มเติมในภายหลัง
              </p>
            ) : (
              <div className="space-y-4">
                {villa.areaVideos.map((v) => (
                  <div key={v.label} className="space-y-2">
                    <p className="text-sm font-medium text-navy">{v.label}</p>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.youtubeId}?mute=1`}
                        title={v.label}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* รูปภาพแต่ละส่วน / แกลลอรี่สั้น */}
          <div className="space-y-3">
            <h3 className="font-medium text-navy">รูปภาพไฮไลต์แต่ละส่วน</h3>
            <div className="grid grid-cols-2 gap-3">
              {villa.gallery.map((item) => (
                <div
                  key={`${item.label}-${item.area}`}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue/10 to-navy/20" />
                  <div className="p-2">
                    <p className="text-xs font-medium text-navy truncate">{item.label}</p>
                    <p className="text-[11px] text-gray-500 truncate">{item.area}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              * สามารถแนบรูปจริงความละเอียดสูงเพิ่มเติม เพื่อใช้ประกอบการตัดสินใจของนักลงทุน
            </p>
          </div>
        </div>
      </section>

      {/* แกลลอรี่รวม */}
      <section className="space-y-3">
        <h2 className="font-semibold text-navy text-lg md:text-xl">แกลลอรี่ภาพรวมของบ้าน</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-[4/3] rounded-xl bg-gradient-to-br from-blue/15 via-offwhite to-navy/20 border border-gray-100"
            />
          ))}
        </div>
      </section>

      {/* ประวัติการเช่า / ประวัติการทำธุรกิจ */}
      <section className="space-y-4">
        <h2 className="font-semibold text-navy text-lg md:text-xl">
          ประวัติการเช่าและการดำเนินธุรกิจของบ้าน
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <h3 className="font-medium text-navy mb-2">ภาพรวมการดำเนินธุรกิจ</h3>
            <p className="text-gray-700 text-sm md:text-base">{villa.businessHistory}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <h3 className="font-medium text-navy mb-2">ประวัติการเช่า</h3>
            <div className="space-y-2 text-sm md:text-base">
              {villa.rentalHistory.map((row) => (
                <div key={row.period} className="border-b last:border-none border-gray-100 pb-2">
                  <p className="font-medium text-navy">{row.period}</p>
                  <p className="text-gray-600 text-xs md:text-sm">
                    อัตราการเข้าพัก: {row.occupancy}
                  </p>
                  <p className="text-gray-600 text-xs md:text-sm">
                    ราคาเฉลี่ยต่อคืน: {row.avgRate}
                  </p>
                  {row.note && (
                    <p className="text-gray-500 text-xs md:text-sm mt-1">{row.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* กำหนดการขาย / แผนปล่อยเช่าล่วงหน้า */}
      <section className="space-y-3">
        <h2 className="font-semibold text-navy text-lg md:text-xl">
          กำหนดการขายและแผนปล่อยเช่าล่วงหน้า
        </h2>
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
          <p className="text-gray-700 text-sm md:text-base">{villa.salePlan}</p>
        </div>
      </section>

      {/* ส่วนการลงทุน: รายได้/กำไรต่อเดือน */}
      <section className="space-y-3">
        <h2 className="font-semibold text-navy text-lg md:text-xl">
          ตัวเลขการลงทุนรายเดือน (ประมาณการ)
        </h2>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs md:text-sm mb-1">รายได้เฉลี่ยต่อเดือน</p>
            <p className="font-semibold text-green-700 text-lg md:text-xl">
              {villa.investmentMonthly.revenue}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs md:text-sm mb-1">ค่าใช้จ่ายเฉลี่ยต่อเดือน</p>
            <p className="font-semibold text-navy text-lg md:text-xl">
              {villa.investmentMonthly.expenses}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs md:text-sm mb-1">กำไรสุทธิเฉลี่ยต่อเดือน</p>
            <p className="font-semibold text-green-700 text-lg md:text-xl">
              {villa.investmentMonthly.profit}
            </p>
          </div>
        </div>
      </section>

      {/* ดูรายละเอียดทางบัญชี รายรับ-รายจ่ายย้อนหลัง */}
      <section className="space-y-3">
        <h2 className="font-semibold text-navy text-lg md:text-xl">
          รายรับ-รายจ่ายย้อนหลัง (สรุปทางบัญชี)
        </h2>
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm md:text-base">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2 pr-4">รอบระยะเวลา</th>
                  <th className="py-2 pr-4">รายได้รวม</th>
                  <th className="py-2 pr-4">กำไรสุทธิ</th>
                </tr>
              </thead>
              <tbody>
                {villa.accountingSummary.map((row) => (
                  <tr key={row.period} className="border-b last:border-none border-gray-100">
                    <td className="py-2 pr-4">{row.period}</td>
                    <td className="py-2 pr-4">{row.revenue}</td>
                    <td className="py-2 pr-4 text-green-700 font-medium">{row.profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl bg-blue text-white text-sm font-semibold hover:bg-blue-light"
            >
              ดาวน์โหลดรายงานละเอียด (PDF)
            </button>
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl border border-blue text-blue text-sm font-semibold hover:bg-blue/5"
            >
              ดาวน์โหลดไฟล์ข้อมูล (Excel)
            </button>
          </div>
          <p className="text-xs text-gray-500">
            * ข้อมูลตัวเลขดังกล่าวเป็นตัวอย่างการจัดวาง สามารถเชื่อมต่อกับระบบบัญชีจริงของโครงการได้ภายหลัง
          </p>
        </div>
      </section>

      {/* CTA ปรึกษาทีมงานหน้ารายละเอียดบ้าน */}
      <section className="pt-2">
        <Link
          href="/contact"
          className="block w-full md:max-w-sm mx-auto py-3 text-center font-semibold rounded-xl bg-blue text-white"
        >
          ปรึกษาทีมงาน / ขอข้อมูลรายละเอียดเพิ่มเติม
        </Link>
      </section>
    </div>
  );
}
