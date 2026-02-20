import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVillaForDetail, getContactSettings } from "@/lib/data";

type Params = { id: string };

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://topform-realestate.com");

// ให้ Vercel/production ดึงข้อมูลจาก DB ทุกครั้ง เหมือน localhost
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params> | Params;
}): Promise<Metadata> {
  const { id } = await Promise.resolve(params);
  try {
    const villa = await getVillaForDetail(id);
    if (!villa) return { title: "ไม่พบบ้าน" };
    const title = `${villa.name} | พูลวิลล่า ${villa.location}`;
    const description =
      villa.desc ||
      `พูลวิลล่า ${villa.name} ทำเล${villa.location} ราคา ฿${villa.price} ลบ. ROI ~${villa.roi}% กำไรประมาณ ${villa.investmentMonthly.profit}/เดือน`;
    return {
      title,
      description,
      openGraph: {
        title: `${title} | ท๊อปฟอร์ม อสังหาริมทรัพย์`,
        description,
      },
      alternates: { canonical: `/villas/${id}` },
    };
  } catch {
    return { title: "ไม่พบบ้าน" };
  }
}

export default async function VillaDetailPage({
  params,
}: {
  params: Promise<Params> | Params;
}) {
  const { id } = await Promise.resolve(params);
  let villa: Awaited<ReturnType<typeof getVillaForDetail>> = null;
  let contact: Awaited<ReturnType<typeof getContactSettings>> = null;
  try {
    const [vData, cData] = await Promise.all([
      getVillaForDetail(id),
      getContactSettings(),
    ]);
    villa = vData;
    contact = cData;
  } catch {
    notFound();
  }
  if (!villa) notFound();
  const telHref = contact?.phone ? `tel:${contact.phone.replace(/\D/g, "")}` : "tel:0812345678";

  const villaJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: villa.name,
    description: villa.desc || undefined,
    address: { "@type": "PostalAddress", addressLocality: villa.location },
    ...(villa.land && { numberOfRooms: villa.beds }),
    url: `${siteUrl}/villas/${id}`,
  };

  return (
    <div className="w-full min-w-0 space-y-8 md:space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(villaJsonLd) }}
      />
      {/* ส่วนบน: ปุ่มกลับและติดต่อด่วน */}
      <div className="flex items-center justify-between">
        <Link href="/villas" className="text-blue text-sm font-medium hover:underline">
          กลับไปหน้ารายการ
        </Link>
        <a href={telHref} className="text-sm text-navy font-medium">
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
              {villa.gallery.map((item, idx) => {
                const urls = item.imageUrls ?? [];
                const firstUrl = urls[0];
                return (
                  <div
                    key={`gallery-item-${idx}-${String(item.label)}-${String(item.area)}`}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                  >
                    {firstUrl ? (
                      <div className="aspect-[4/3] bg-gray-100">
                        <img src={firstUrl} alt={item.label || ""} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-gradient-to-br from-blue/10 to-navy/20" />
                    )}
                    <div className="p-2">
                      <p className="text-xs font-medium text-navy truncate">{item.label}</p>
                      <p className="text-[11px] text-gray-500 truncate">{item.area}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* แกลลอรี่รวม */}
      <section className="space-y-3">
        <h2 className="font-semibold text-navy text-lg md:text-xl">แกลลอรี่ภาพรวมของบ้าน</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {(() => {
            const allUrls: { url: string; label: string }[] = [];
            villa.gallery.forEach((item) => {
              const urls = item.imageUrls ?? [];
              urls.forEach((url) => allUrls.push({ url, label: item.label || item.area || "" }));
            });
            if (allUrls.length > 0) {
              return allUrls.map(({ url, label }, idx) => (
                <div key={`gallery-${idx}-${url}`} className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 bg-gray-100">
                  <img src={url} alt={label || "รูปแกลลอรี่"} className="w-full h-full object-cover" />
                </div>
              ));
            }
            return Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-blue/15 via-offwhite to-navy/20 border border-gray-100" />
            ));
          })()}
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
