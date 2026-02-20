import Link from "next/link";
import type { ContactSettingsItem } from "@/lib/data";

const defaultContact = {
  logoUrl: null as string | null,
  faviconUrl: null as string | null,
  companyName: "บริษัท ท๊อปฟอร์ม อสังหาริมทรัพย์ จำกัด",
  companyNameEn: "TOPFORM REAL ESTATE CO., LTD.",
  registrationNumber: "0205567002163",
  phone: null as string | null,
  email: null as string | null,
  lineUrl: null as string | null,
  address: "84/22 หมู่ที่ 7 ตำบลสุรศักดิ์ อำเภอศรีราชา จ.ชลบุรี 20110",
  mapUrl: null as string | null,
  facebookUrl: "https://www.facebook.com/topformrealestateforinvesment/" as string | null,
};

export default function Footer({ contact }: { contact: ContactSettingsItem | null }) {
  const c = contact ?? defaultContact;
  const tel = c.phone?.replace(/\D/g, "") ?? "";
  return (
    <footer className="w-full bg-navy text-white mt-auto safe-bottom">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 py-8 sm:py-9 md:py-10 lg:py-12 space-y-8 sm:space-y-8 md:space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* แบรนด์และข้อความสั้น */}
          <div className="space-y-2">
            {c.logoUrl ? (
              <img src={c.logoUrl} alt="" className="h-8 sm:h-9 md:h-10 w-auto max-w-[160px] sm:max-w-[180px] object-contain" />
            ) : (
              <p className="font-semibold text-base sm:text-lg md:text-xl">
                {c.companyNameEn ?? c.companyName ?? "ท๊อปฟอร์ม อสังหาริมทรัพย์"}
              </p>
            )}
            {c.registrationNumber && (
              <p className="text-white/70 text-xs">เลขทะเบียน {c.registrationNumber}</p>
            )}
            {c.address && (
              <p className="text-white/80 text-sm md:text-base">
                {c.address}
              </p>
            )}
            {c.facebookUrl && (
              <a
                href={c.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-sm mt-1"
              >
                Facebook
              </a>
            )}
          </div>

          {/* ลิงก์นำทาง */}
          <div className="space-y-2 text-sm md:text-base">
            <p className="font-semibold text-white">เมนูหลัก</p>
            <div className="flex flex-col gap-0.5 mt-1">
              <Link href="/" className="text-white/85 hover:text-white py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 flex items-center">
                หน้าแรก
              </Link>
              <Link href="/villas" className="text-white/85 hover:text-white py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 flex items-center">
                รายการบ้าน
              </Link>
              <Link href="/investment" className="text-white/85 hover:text-white py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 flex items-center">
                ลงทุนกับเรา
              </Link>
              <Link href="/contact" className="text-white/85 hover:text-white py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 flex items-center">
                ติดต่อทีมงาน
              </Link>
            </div>
          </div>

          {/* ข้อมูลติดต่อสั้นๆ */}
          <div className="space-y-2 text-sm md:text-base">
            <p className="font-semibold text-white">ติดต่อ</p>
            {c.phone && (
              <p className="text-white/85">
                โทร: <a href={tel ? `tel:${tel}` : "#"} className="hover:text-white">{c.phone}</a>
              </p>
            )}
            {c.email && (
              <p className="text-white/85">
                อีเมล: <a href={`mailto:${c.email}`} className="hover:text-white">{c.email}</a>
              </p>
            )}
            {c.lineUrl && (
              <p className="text-white/85">
                Line:{" "}
                <a
                  href={c.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  เพิ่มเพื่อน Line
                </a>
              </p>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[44px] mt-2 px-5 py-3 sm:py-2 rounded-xl bg-blue text-white text-sm font-semibold hover:bg-blue-light active:opacity-90"
            >
              ปรึกษาทีมงาน / ขอข้อมูลเพิ่ม
            </Link>
          </div>
        </div>

        <div className="border-t border-white/15 pt-4 sm:pt-5 md:pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <p className="text-white/60 text-xs sm:text-sm">
            © {new Date().getFullYear()} {c.companyNameEn ?? c.companyName ?? "ท๊อปฟอร์ม อสังหาริมทรัพย์"}. All rights reserved.
          </p>
          <p className="text-white/50 text-xs sm:text-sm">
            ข้อมูลบนเว็บไซต์นี้มีวัตถุประสงค์เพื่อการนำเสนอเบื้องต้นเท่านั้น รายละเอียดการลงทุนจริงเป็นไปตามสัญญา
          </p>
        </div>
      </div>
    </footer>
  );
}
