"use client";

import { useState } from "react";
import type { ContactSettingsItem } from "@/lib/data";

const defaultContact: ContactSettingsItem = {
  logoUrl: null,
  faviconUrl: null,
  companyName: "บริษัท ท๊อปฟอร์ม อสังหาริมทรัพย์ จำกัด",
  companyNameEn: "TOPFORM REAL ESTATE CO., LTD.",
  registrationNumber: "0205567002163",
  phone: null,
  email: null,
  lineUrl: null,
  address: "84/22 หมู่ที่ 7 ตำบลสุรศักดิ์ อำเภอศรีราชา จ.ชลบุรี 20110",
  mapUrl: null,
  facebookUrl: "https://www.facebook.com/topformrealestateforinvesment/",
};

export default function ContactContent({ contact }: { contact: ContactSettingsItem | null }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const c = contact ?? defaultContact;
  const telHref = c.phone ? `tel:${c.phone.replace(/\D/g, "")}` : "#";
  const lineHref = c.lineUrl ?? "#";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          interest: fd.get("interest"),
          message: fd.get("message"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="w-full min-w-0 max-w-3xl">
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-navy">
          ติดต่อทีมงาน {c.companyName ?? c.companyNameEn ?? "ท๊อปฟอร์ม อสังหาริมทรัพย์"}
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          สำหรับนักลงทุนที่ต้องการข้อมูลเชิงลึก หรือนัดหมายดูบ้านแต่ละหลัง
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
        <section className="space-y-4">
          <div className="flex flex-col gap-3">
            {c.phone && (
              <a
                href={telHref}
                className="flex items-center justify-center min-h-[48px] sm:min-h-[44px] gap-2 py-3 sm:py-3.5 rounded-xl bg-blue text-white font-medium text-sm sm:text-base active:opacity-90"
              >
                โทรคุยกับทีมงาน
              </a>
            )}
            {c.lineUrl && (
              <a
                href={lineHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center min-h-[48px] sm:min-h-[44px] gap-2 py-3 sm:py-3.5 rounded-xl bg-[#06C755] text-white font-medium text-sm sm:text-base active:opacity-90"
              >
                ติดต่อผ่าน Line
              </a>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 space-y-3">
            <h2 className="font-semibold text-navy text-sm md:text-base">
              เหมาะสำหรับการติดต่อในกรณี
            </h2>
            <ul className="text-gray-700 text-sm md:text-base space-y-1 list-disc list-inside">
              <li>ต้องการรายละเอียดการลงทุนของบ้านแต่ละหลัง</li>
              <li>ต้องการดูประมาณการ ROI / รายรับ–รายจ่ายจริง</li>
              <li>ต้องการนัดดูบ้าน หรือนัดคุยแบบตัวต่อตัว</li>
              <li>มีพูลวิลล่าที่ต้องการให้เราช่วยบริหารหรือช่วยขาย</li>
            </ul>
            <p className="text-gray-500 text-xs md:text-sm">
              ทีมงานจะติดต่อกลับภายใน 1 วันทำการหลังได้รับข้อมูลของคุณ
            </p>
          </div>

          <div className="bg-offwhite rounded-2xl p-4 md:p-5 space-y-2">
            {c.registrationNumber && (
              <p className="text-gray-600 text-sm">เลขทะเบียน {c.registrationNumber}</p>
            )}
            <h2 className="font-semibold text-navy mb-2 md:text-base">ที่อยู่</h2>
            <p className="text-gray-600 text-sm md:text-base">
              {c.address ?? "(ที่อยู่สำนักงาน)"}
            </p>
            {c.mapUrl && (
              <a
                href={c.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue text-sm font-medium hover:underline"
              >
                เปิด Google Map
              </a>
            )}
            {c.facebookUrl && (
              <a
                href={c.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-blue text-sm font-medium hover:underline"
              >
                เพจ Facebook
              </a>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy mb-3 md:text-lg">ส่งข้อมูลให้ทีมงานติดต่อกลับ</h2>
          {sent ? (
            <p className="text-gray-600 text-sm md:text-base py-4 text-center">
              ส่งข้อมูลเรียบร้อย ทีมงานจะติดต่อกลับภายใน 1 วันทำการ
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}
              <div className="space-y-1">
                <label className="block text-xs md:text-sm text-gray-700">
                  ชื่อ–นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="เช่น คุณสมชาย นักลงทุน"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs md:text-sm text-gray-700">
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="กรอกเบอร์ที่สะดวกรับสาย"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs md:text-sm text-gray-700">อีเมล</label>
                <input
                  name="email"
                  type="email"
                  placeholder="หากสะดวกให้ติดต่อกลับทางอีเมล"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs md:text-sm text-gray-700">
                  ความสนใจหลักของคุณ <span className="text-red-500">*</span>
                </label>
                <select
                  name="interest"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy"
                  required
                >
                  <option value="">เลือกความสนใจ</option>
                  <option value="สนใจซื้อ/ร่วมลงทุนพูลวิลล่า">สนใจซื้อ/ร่วมลงทุนพูลวิลล่า</option>
                  <option value="ต้องการข้อมูลตัวเลขการลงทุนเพิ่มเติม">ต้องการข้อมูลตัวเลขการลงทุนเพิ่มเติม</option>
                  <option value="ต้องการนัดดูบ้าน/ดูโครงการ">ต้องการนัดดูบ้าน/ดูโครงการ</option>
                  <option value="มีบ้านต้องการให้ช่วยบริหารหรือช่วยขาย">มีบ้านต้องการให้ช่วยบริหารหรือช่วยขาย</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs md:text-sm text-gray-700">รายละเอียดเพิ่มเติม</label>
                <textarea
                  name="message"
                  placeholder="ระบุงบประมาณ ทำเลที่สนใจ หรือบ้านหลังที่ต้องการทราบรายละเอียดเพิ่มเติม"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl bg-navy text-white font-semibold disabled:opacity-70"
              >
                {sending ? "กำลังส่ง..." : "ส่งข้อมูลให้ทีมงานติดต่อกลับ"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
