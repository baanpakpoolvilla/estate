import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVillaForDetail, getContactSettings } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import MapDisplay from "@/components/MapDisplay";

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
      `พูลวิลล่า ${villa.name} ทำเล${villa.location} ราคา ฿${formatPrice(villa.price)}${villa.roi ? ` ROI ~${villa.roi}%` : ""}${villa.investmentMonthly.profit ? ` กำไรประมาณ ${villa.investmentMonthly.profit}/เดือน` : ""}`;
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

      {/* Hero: วิดีโอหลัก หรือ รูปภาพหลัก */}
      {villa.mainVideoId ? (
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
      ) : villa.gallery.length > 0 || villa.imageUrl ? (
        <section>
          <div className="relative aspect-[21/9] sm:aspect-[21/8] rounded-2xl overflow-hidden bg-navy">
            <Image
              src={villa.imageUrl || villa.gallery[0]?.imageUrls?.[0] || ""}
              alt={villa.name}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
          </div>
        </section>
      ) : null}

      {/* ภาพรวมบ้าน + ตัวเลขสรุปหลัก */}
      <section className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
        <div className="md:col-span-2 space-y-3">
          <h1 className="font-bold text-xl md:text-2xl lg:text-3xl text-navy">
            {villa.name}
          </h1>
          <p className="text-gray-600 md:text-lg">{villa.location}</p>
          {villa.desc && (
            <div
              className="text-gray-700 text-sm md:text-base mt-2 prose prose-sm max-w-none prose-p:my-2 prose-headings:my-3 prose-img:rounded-xl prose-img:max-w-full prose-a:text-blue"
              dangerouslySetInnerHTML={{ __html: villa.desc }}
            />
          )}
          <ul className="mt-3 text-sm md:text-base text-gray-700 space-y-1">
            {villa.land > 0 && <li>ที่ดิน {villa.land} ตร.ว.</li>}
            {villa.sqm > 0 && <li>พื้นที่ใช้สอย {villa.sqm} ตร.ม.</li>}
            {(villa.beds > 0 || villa.baths > 0) && (
              <li>
                {villa.beds > 0 && `ห้องนอน ${villa.beds} ห้อง`}
                {villa.beds > 0 && villa.baths > 0 && " / "}
                {villa.baths > 0 && `ห้องน้ำ ${villa.baths} ห้อง`}
              </li>
            )}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-navy mb-2 md:text-lg">ตัวเลขหลักของบ้าน</h2>
            <div className="space-y-2 text-sm md:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">ราคาขาย</span>
                <span className="font-semibold text-blue">฿{formatPrice(villa.price)}</span>
              </div>
              {villa.roi && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ROI คาดการณ์</span>
                  <span className="font-semibold text-blue">~{villa.roi}% ต่อปี</span>
                </div>
              )}
              {villa.investmentMonthly.profit && (
                <div className="flex justify-between">
                  <span className="text-gray-600">กำไรสุทธิต่อเดือน</span>
                  <span className="font-semibold text-green-700">{villa.investmentMonthly.profit}</span>
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:block bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-navy mb-3 md:text-lg">สนใจบ้านหลังนี้?</h2>
            <div className="space-y-2.5">
              <a
                href={`tel:${contact?.phone?.replace(/\D/g, "") || "0914105011"}`}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue text-white font-semibold text-sm hover:bg-blue-light transition"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>โทร {contact?.phone || "091-410-5011"}</span>
              </a>
              <a
                href={contact?.facebookUrl || "https://www.facebook.com/topformrealestateforinvesment"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-[#166FE5] transition"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span>Inbox Facebook</span>
              </a>
              {contact?.lineUrl && (
                <a
                  href={contact.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#06C755] text-white font-semibold text-sm hover:bg-[#05B64C] transition"
                >
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 01-.63-.629V8.108a.63.63 0 01.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016a.63.63 0 01-.63.629.626.626 0 01-.51-.262l-2.418-3.294v2.927a.63.63 0 01-1.26 0V8.108a.63.63 0 01.63-.63c.201 0 .385.096.51.262l2.418 3.294V8.108a.63.63 0 011.26 0v4.771zm-5.741 0a.63.63 0 01-1.26 0V8.108a.63.63 0 011.26 0v4.771zm-2.527.629H4.856a.63.63 0 01-.63-.629V8.108a.63.63 0 011.26 0v4.141h1.756c.349 0 .63.283.63.63a.63.63 0 01-.63.629zM24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314z"/></svg>
                  <span>Line</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* วิดีโอแต่ละส่วนของบ้าน */}
      {villa.areaVideos.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-semibold text-navy text-lg md:text-xl">วิดีโอส่วนต่างๆ ของบ้าน</h2>
          <div className="grid sm:grid-cols-2 gap-4">
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
        </section>
      )}

      {/* แกลเลอรี่รูปภาพ */}
      {villa.gallery.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-navy text-lg md:text-xl">รูปภาพของบ้าน</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {villa.gallery.map((item, idx) => {
              const url = (item.imageUrls ?? [])[0];
              if (!url) return null;
              return (
                <div
                  key={`gallery-${idx}`}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm"
                >
                  <Image src={url} alt={item.label || ""} fill sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw" className="object-cover" />
                  {(item.label || item.area) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/70 to-transparent p-2.5">
                      <p className="text-white text-xs font-medium truncate">{item.label}</p>
                      {item.area && <p className="text-white/70 text-[11px] truncate">{item.area}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ที่ตั้งและแผนที่ */}
      {/* สิ่งอำนวยความสะดวก */}
      {(() => {
        const a = villa.amenities;
        const items: { label: string; icon: string; active: boolean; extra?: string }[] = [
          { label: "สระว่ายน้ำ", icon: "🏊", active: a.pool },
          { label: "สระว่ายน้ำเด็ก", icon: "👶", active: a.kidsPool },
          { label: "คาราโอเกะ", icon: "🎤", active: a.karaoke },
          { label: "โต๊ะปิงปอง", icon: "🏓", active: a.pingpong },
          { label: "โต๊ะสนุ้ก/พูล", icon: "🎱", active: a.snooker },
          { label: "อุปกรณ์ครัว", icon: "🍳", active: a.kitchen },
          { label: "Wi-Fi", icon: "📶", active: a.wifi },
          { label: "ที่จอดรถ", icon: "🚗", active: a.parking, extra: a.parkingSlots ? `${a.parkingSlots} คัน` : undefined },
        ];
        const active = items.filter((i) => i.active);
        if (active.length === 0) return null;
        return (
          <section className="space-y-3">
            <h2 className="font-semibold text-navy text-lg md:text-xl">สิ่งอำนวยความสะดวก</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {active.map((item) => (
                <div key={item.label} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-navy">{item.label}</p>
                    {item.extra && <p className="text-xs text-gray-500">{item.extra}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {(villa.address || (villa.latitude != null && villa.longitude != null)) && (
        <section className="space-y-3">
          <h2 className="font-semibold text-navy text-lg md:text-xl">ที่ตั้งของบ้าน</h2>
          {villa.address && (
            <p className="text-gray-700 text-sm md:text-base">{villa.address}</p>
          )}
          {villa.latitude != null && villa.longitude != null && (
            <div className="rounded-2xl overflow-hidden border border-gray-100" style={{ height: 320 }}>
              <MapDisplay lat={villa.latitude} lng={villa.longitude} name={villa.name} />
            </div>
          )}
        </section>
      )}

      {/* ประวัติการเช่า / ประวัติการทำธุรกิจ */}
      {(villa.businessHistory || villa.rentalHistory.length > 0) && (
        <section className="space-y-4">
          <h2 className="font-semibold text-navy text-lg md:text-xl">
            ประวัติการเช่าและการดำเนินธุรกิจของบ้าน
          </h2>
          <div className={`grid gap-6 ${villa.businessHistory && villa.rentalHistory.length > 0 ? "md:grid-cols-3" : ""}`}>
            {villa.businessHistory && (
              <div className={`bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 ${villa.rentalHistory.length > 0 ? "md:col-span-2" : ""}`}>
                <h3 className="font-medium text-navy mb-2">ภาพรวมการดำเนินธุรกิจ</h3>
                <div className="text-gray-700 text-sm md:text-base prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: villa.businessHistory }} />
              </div>
            )}
            {villa.rentalHistory.length > 0 && (
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                <h3 className="font-medium text-navy mb-2">ประวัติการเช่า</h3>
                <div className="space-y-2 text-sm md:text-base">
                  {villa.rentalHistory.map((row) => (
                    <div key={row.period} className="border-b last:border-none border-gray-100 pb-2">
                      <p className="font-medium text-navy">{row.period}</p>
                      <p className="text-gray-600 text-xs md:text-sm">อัตราการเข้าพัก: {row.occupancy}</p>
                      <p className="text-gray-600 text-xs md:text-sm">ราคาเฉลี่ยต่อคืน: {row.avgRate}</p>
                      {row.note && <p className="text-gray-500 text-xs md:text-sm mt-1">{row.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* กำหนดการขาย */}
      {villa.salePlan && (
        <section className="space-y-3">
          <h2 className="font-semibold text-navy text-lg md:text-xl">
            กำหนดการขายและแผนปล่อยเช่าล่วงหน้า
          </h2>
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="text-gray-700 text-sm md:text-base prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: villa.salePlan }} />
          </div>
        </section>
      )}

      {/* ตัวเลขการลงทุนรายเดือน */}
      {(villa.investmentMonthly.revenue || villa.investmentMonthly.expenses || villa.investmentMonthly.profit) && (
        <section className="space-y-3">
          <h2 className="font-semibold text-navy text-lg md:text-xl">
            ตัวเลขการลงทุนรายเดือน (ประมาณการ)
          </h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {villa.investmentMonthly.revenue && (
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xs md:text-sm mb-1">รายได้เฉลี่ยต่อเดือน</p>
                <p className="font-semibold text-green-700 text-lg md:text-xl">{villa.investmentMonthly.revenue}</p>
              </div>
            )}
            {villa.investmentMonthly.expenses && (
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xs md:text-sm mb-1">ค่าใช้จ่ายเฉลี่ยต่อเดือน</p>
                <p className="font-semibold text-navy text-lg md:text-xl">{villa.investmentMonthly.expenses}</p>
              </div>
            )}
            {villa.investmentMonthly.profit && (
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xs md:text-sm mb-1">กำไรสุทธิเฉลี่ยต่อเดือน</p>
                <p className="font-semibold text-green-700 text-lg md:text-xl">{villa.investmentMonthly.profit}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* รายรับ-รายจ่ายย้อนหลัง */}
      {villa.accountingSummary.length > 0 && (
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
          </div>
        </section>
      )}

      {/* CTA ปรึกษาทีมงานหน้ารายละเอียดบ้าน */}
      <section className="pt-2 pb-20 md:pb-0">
        <Link
          href="/contact"
          className="block w-full md:max-w-sm mx-auto py-3 text-center font-semibold rounded-xl bg-blue text-white"
        >
          ปรึกษาทีมงาน / ขอข้อมูลรายละเอียดเพิ่มเติม
        </Link>
      </section>

      {/* Mobile sticky bottom CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 pt-2 pb-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <p className="text-center text-xs font-semibold text-navy mb-2">สนใจหลังนี้ ติดต่อด่วน</p>
        <div className="flex gap-2">
        <a
          href={`tel:${contact?.phone?.replace(/\D/g, "") || "0914105011"}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue text-white font-semibold text-sm active:opacity-90"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          โทร
        </a>
        <a
          href={contact?.facebookUrl || "https://www.facebook.com/topformrealestateforinvesment"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1877F2] text-white font-semibold text-sm active:opacity-90"
        >
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </a>
        {contact?.lineUrl && (
          <a
            href={contact.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#06C755] text-white font-semibold text-sm active:opacity-90"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 01-.63-.629V8.108a.63.63 0 01.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016a.63.63 0 01-.63.629.626.626 0 01-.51-.262l-2.418-3.294v2.927a.63.63 0 01-1.26 0V8.108a.63.63 0 01.63-.63c.201 0 .385.096.51.262l2.418 3.294V8.108a.63.63 0 011.26 0v4.771zm-5.741 0a.63.63 0 01-1.26 0V8.108a.63.63 0 011.26 0v4.771zm-2.527.629H4.856a.63.63 0 01-.63-.629V8.108a.63.63 0 011.26 0v4.141h1.756c.349 0 .63.283.63.63a.63.63 0 01-.63.629zM24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314z"/></svg>
            Line
          </a>
        )}
        </div>
      </div>
    </div>
  );
}
