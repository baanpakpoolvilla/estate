import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVillaForDetail, getContactSettings } from "@/lib/data";
import { formatPrice, formatNumber } from "@/lib/format";
import { isExternalImage } from "@/lib/image-utils";
import MapDisplay from "@/components/MapDisplay";
import DetailGallery from "@/components/DetailGallery";

const STATUS_LABELS: Record<string, string> = { sale: "ขาย", rent: "เช่า" };
const RENT_PERIOD_LABELS: Record<string, string> = { monthly: "/เดือน", yearly: "/ปี" };
const TYPE_LABELS: Record<string, string> = { "pool-villa": "พูลวิลล่า", townhouse: "ทาวน์เฮาส์", residential: "บ้านอยู่อาศัย", land: "ที่ดินเปล่า" };
const STATUS_COLORS: Record<string, string> = { sale: "bg-blue text-white", rent: "bg-amber-500 text-white" };
const TYPE_COLORS: Record<string, string> = { "pool-villa": "bg-navy/90 text-white", townhouse: "bg-violet-600/90 text-white", residential: "bg-emerald-600/90 text-white", land: "bg-orange-600/90 text-white" };

type Params = { id: string };

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://topformestate.com");

export const dynamic = "force-dynamic";

/** ลบ HTML tags + entities ออกจาก description */
function stripHtml(text: string): string {
  let t = text;
  t = t.replace(/<br\s*\/?>/gi, "\n");
  t = t.replace(/<\/p>/gi, "\n");
  t = t.replace(/<[^>]+>/g, "");
  t = t.replace(/&nbsp;/gi, " ");
  t = t.replace(/&amp;/gi, "&");
  t = t.replace(/&lt;/gi, "<");
  t = t.replace(/&gt;/gi, ">");
  t = t.replace(/&quot;/gi, '"');
  t = t.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  return t.trim();
}

/** แปลง description ที่มี 【หัวข้อ】 เป็น array ของ { title, body } */
function parseDescriptionSections(desc: string | null): { title: string; body: string }[] {
  if (!desc || !desc.trim()) return [];
  const clean = stripHtml(desc);
  const sections: { title: string; body: string }[] = [];
  const re = /【([^】]+)】\s*\n?([\s\S]*?)(?=【|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean)) !== null) {
    const title = m[1].trim();
    const body = m[2].replace(/\s+/g, " ").trim();
    if (title && body) sections.push({ title, body });
  }
  if (sections.length === 0 && clean.trim()) {
    sections.push({ title: "รายละเอียด", body: clean.trim() });
  }
  return sections;
}

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
      villa.desc?.replace(/【[^】]+】/g, "").slice(0, 160) ||
      `พูลวิลล่า ${villa.name} ทำเล${villa.location} ราคา ฿${formatPrice(villa.price)}`;
    return {
      title,
      description,
      openGraph: { title: `${title} | ท๊อปฟอร์ม อสังหาริมทรัพย์`, description },
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
  const descSections = parseDescriptionSections(villa.desc || null);
  const galleryByLabel = villa.gallery.filter((g) => (g.imageUrls?.length ?? 0) > 0);

  return (
    <div className="w-full min-w-0 space-y-8 md:space-y-10">
      <div className="flex items-center justify-between">
        <Link href="/villas" className="text-blue text-sm font-medium hover:underline">
          กลับไปหน้ารายการ
        </Link>
        <a href={telHref} className="text-sm text-navy font-medium">
          โทรสอบถาม
        </a>
      </div>

      {/* Hero: วิดีโอหลัก หรือ รูปหลัก */}
      {villa.mainVideoId ? (
        <section className="space-y-2">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${villa.mainVideoId}?autoplay=0&mute=1`}
              title={villa.name}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="text-xs text-gray-500">วีดีโอที่พัก YouTube</p>
        </section>
      ) : (villa.imageUrl || villa.gallery[0]?.imageUrls?.[0]) ? (
        <section>
          <div className="relative aspect-[21/9] sm:aspect-[21/8] rounded-2xl overflow-hidden bg-navy">
            <Image
              src={villa.imageUrl || villa.gallery[0]?.imageUrls?.[0] || ""}
              alt={villa.name}
              fill
              sizes="100vw"
              priority
              className="object-cover"
              unoptimized={isExternalImage(villa.imageUrl || villa.gallery[0]?.imageUrls?.[0] || "")}
            />
          </div>
        </section>
      ) : null}

      {/* ชื่อ ทำเล แบดจ์ */}
      <section>
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${STATUS_COLORS[villa.status] ?? "bg-blue text-white"}`}>
            {STATUS_LABELS[villa.status] ?? "ขาย"}
          </span>
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${TYPE_COLORS[villa.propertyType] ?? "bg-navy/90 text-white"}`}>
            {TYPE_LABELS[villa.propertyType] ?? "พูลวิลล่า"}
          </span>
        </div>
        <h1 className="font-bold text-xl md:text-2xl lg:text-3xl text-navy">
          {villa.name}
        </h1>
        <p className="text-gray-600 md:text-lg mt-1">{villa.location}</p>
      </section>

      {/* ตัวเลขหลัก + สเปกห้อง/พื้นที่ */}
      <section className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-navy mb-3 text-lg">ตัวเลขหลักของบ้าน</h2>
            <div className="space-y-2 text-sm md:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">{villa.status === "rent" ? "ค่าเช่า" : "ราคาขาย"}</span>
                <span className="font-semibold text-blue">
                  ฿{formatPrice(villa.price)}{villa.status === "rent" ? (RENT_PERIOD_LABELS[villa.rentPeriod ?? "monthly"] ?? "/เดือน") : ""}
                </span>
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
                  <span className="font-semibold text-green-700">฿{formatNumber(villa.investmentMonthly.profit)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {villa.beds > 0 && (
              <div className="flex items-center gap-2.5 bg-offwhite rounded-xl px-3.5 py-3 border border-gray-100">
                <span className="text-navy font-bold text-lg">{villa.beds}</span>
                <span className="text-gray-500 text-xs">ห้องนอน</span>
              </div>
            )}
            {villa.baths > 0 && (
              <div className="flex items-center gap-2.5 bg-offwhite rounded-xl px-3.5 py-3 border border-gray-100">
                <span className="text-navy font-bold text-lg">{villa.baths}</span>
                <span className="text-gray-500 text-xs">ห้องน้ำ</span>
              </div>
            )}
            {villa.sqm > 0 && (
              <div className="flex items-center gap-2.5 bg-offwhite rounded-xl px-3.5 py-3 border border-gray-100">
                <span className="text-navy font-bold text-lg">{villa.sqm}</span>
                <span className="text-gray-500 text-xs">ตร.ม.</span>
              </div>
            )}
            {villa.land > 0 && (
              <div className="flex items-center gap-2.5 bg-offwhite rounded-xl px-3.5 py-3 border border-gray-100">
                <span className="text-navy font-bold text-lg">{villa.land}</span>
                <span className="text-gray-500 text-xs">ตร.ว.</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy mb-3 text-lg">สนใจบ้านหลังนี้?</h2>
          <div className="space-y-2.5">
            <a href={telHref} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue text-white font-semibold text-sm hover:bg-blue/90 transition">
              <span>โทร {contact?.phone || "091-410-5011"}</span>
            </a>
            <a href={contact?.facebookUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-[#166FE5] transition">
              <span>Inbox Facebook</span>
            </a>
            {contact?.lineUrl && (
              <a href={contact.lineUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#06C755] text-white font-semibold text-sm hover:bg-[#05B64C] transition">
                <span>Line</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* รายละเอียดบ้าน (แยกตาม 【หัวข้อ】 จากข้อมูลนำเข้า) */}
      {descSections.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-semibold text-navy text-lg md:text-xl">รายละเอียดบ้าน</h2>
          <div className="space-y-4">
            {descSections.map((sec, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-navy mb-2 text-base">{sec.title}</h3>
                <div className="text-gray-700 text-sm md:text-base whitespace-pre-line">{sec.body}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* แกลเลอรี่ แยกตาม label (รูปที่พัก / รูปรีวิว) */}
      {galleryByLabel.length > 0 && (
        <section className="space-y-6">
          {galleryByLabel.map((group, idx) => {
            const images = (group.imageUrls ?? [])
              .filter(Boolean)
              .map((url) => ({ url, label: group.label || "", area: group.area || "" }));
            if (images.length === 0) return null;
            return (
              <div key={idx}>
                <h2 className="font-semibold text-navy text-lg md:text-xl mb-3">
                  {group.label || "รูปภาพ"} ({images.length})
                </h2>
                <DetailGallery images={images} />
              </div>
            );
          })}
        </section>
      )}

      {/* รายได้ย้อนหลัง (accountingSummary) */}
      {villa.accountingSummary.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-navy text-lg md:text-xl">รายได้ย้อนหลัง (จากวันที่ถูกจอง)</h2>
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 overflow-x-auto">
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
                    <td className="py-2 pr-4">฿{formatNumber(row.revenue)}</td>
                    <td className="py-2 pr-4 text-green-700 font-medium">฿{formatNumber(row.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ตัวเลขการลงทุนรายเดือน */}
      {(villa.investmentMonthly.revenue || villa.investmentMonthly.expenses || villa.investmentMonthly.profit) && (
        <section className="space-y-3">
          <h2 className="font-semibold text-navy text-lg md:text-xl">ตัวเลขการลงทุนรายเดือน (ประมาณการ)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {villa.investmentMonthly.revenue && (
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm mb-1">รายได้เฉลี่ยต่อเดือน</p>
                <p className="font-semibold text-green-700 text-lg md:text-xl">฿{formatNumber(villa.investmentMonthly.revenue)}</p>
              </div>
            )}
            {villa.investmentMonthly.expenses && (
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm mb-1">ค่าใช้จ่ายเฉลี่ยต่อเดือน</p>
                <p className="font-semibold text-navy text-lg md:text-xl">฿{formatNumber(villa.investmentMonthly.expenses)}</p>
              </div>
            )}
            {villa.investmentMonthly.profit && (
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm mb-1">กำไรสุทธิเฉลี่ยต่อเดือน</p>
                <p className="font-semibold text-green-700 text-lg md:text-xl">฿{formatNumber(villa.investmentMonthly.profit)}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ที่ตั้งและแผนที่ */}
      {(villa.address || (villa.latitude != null && villa.longitude != null)) && (
        <section className="space-y-3">
          <h2 className="font-semibold text-navy text-lg md:text-xl">ที่ตั้งของบ้าน</h2>
          {villa.address && <p className="text-gray-700 text-sm md:text-base">{villa.address}</p>}
          {villa.latitude != null && villa.longitude != null && (
            <div className="rounded-2xl overflow-hidden border border-gray-100" style={{ height: 320 }}>
              <MapDisplay lat={villa.latitude} lng={villa.longitude} name={villa.name} />
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      <section className="pt-2 pb-20 md:pb-0">
        <Link href="/contact" className="block w-full md:max-w-sm mx-auto py-3 text-center font-semibold rounded-xl bg-blue text-white">
          ปรึกษาทีมงาน / ขอข้อมูลรายละเอียดเพิ่มเติม
        </Link>
      </section>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 pt-2 pb-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <p className="text-center text-xs font-semibold text-navy mb-2">สนใจหลังนี้ ติดต่อด่วน</p>
        <div className="flex gap-2">
          <a href={telHref} className="flex-1 py-3 rounded-xl bg-blue text-white font-semibold text-sm text-center">โทร</a>
          <a href={contact?.facebookUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-xl bg-[#1877F2] text-white font-semibold text-sm text-center">Facebook</a>
          {contact?.lineUrl && (
            <a href={contact.lineUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-xl bg-[#06C755] text-white font-semibold text-sm text-center">Line</a>
          )}
        </div>
      </div>
    </div>
  );
}
