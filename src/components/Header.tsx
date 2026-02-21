"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { ContactSettingsItem } from "@/lib/data";

const navItems = [
  { href: "/", label: "หน้าแรก" },
  { href: "/villas", label: "รายการบ้าน" },
  { href: "/projects", label: "โครงการ" },
  { href: "/articles", label: "บทความ" },
  { href: "/investment", label: "ลงทุน" },
  { href: "/contact", label: "ติดต่อ" },
];

export default function Header({ contact }: { contact?: ContactSettingsItem | null }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tel =
    contact?.phone?.replace(/\D/g, "") ||
    "0812345678";

  // ใช้หลัง mount เท่านั้น เพื่อไม่ให้ server กับ client เรนเดอร์ต่างกัน (แก้ hydration error)
  useEffect(() => {
    setMounted(true);
  }, []);

  // ปิด sidebar เมื่อเปลี่ยน route (กดเลือกเมนู)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // ล็อค scroll ของ body เมื่อ sidebar เปิด (มือถือ/แท็บเล็ต)
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-navy text-white shadow-md safe-top">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 flex items-center justify-between min-h-[56px] sm:min-h-[60px] md:min-h-[64px]">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-base sm:text-lg md:text-xl text-white hover:text-white/90 shrink-0 min-h-[44px]"
        >
          {mounted && contact?.logoUrl ? (
            <>
              <img src={contact.logoUrl} alt={contact?.companyName ?? ""} className="h-7 sm:h-8 md:h-9 w-auto max-w-[100px] sm:max-w-[140px] md:max-w-[180px] object-contain" />
              <span className="truncate text-xs sm:text-sm lg:text-base">
                {contact?.companyNameEn ?? contact?.companyName ?? ""}
              </span>
            </>
          ) : (
            <span className="truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none">
              {contact?.companyNameEn ?? contact?.companyName ?? "ท๊อปฟอร์ม อสังหาริมทรัพย์"}
            </span>
          )}
        </Link>

        {/* Desktop เท่านั้น: เมนูแนวนอน (lg = 1024px ขึ้นไป) */}
        <nav className="hidden lg:flex items-center justify-end gap-1 md:gap-2">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`min-h-[44px] min-w-[44px] flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <a
            href={`tel:${tel}`}
            className="ml-1 min-h-[44px] min-w-[44px] flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-blue text-white hover:bg-blue-light shrink-0"
          >
            โทร
          </a>
        </nav>

        {/* Mobile + Tablet: ปุ่มเบอร์เกอร์ (แสดงเมื่อจอเล็กกว่า lg = 1024px) */}
        <button
          type="button"
          aria-label="เปิดเมนู"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex flex-col justify-center items-center w-12 h-12 rounded-lg text-white hover:bg-white/10 active:bg-white/15 transition-colors"
        >
          <span className="w-6 h-0.5 bg-current rounded-full block mb-1.5" />
          <span className="w-6 h-0.5 bg-current rounded-full block mb-1.5" />
          <span className="w-6 h-0.5 bg-current rounded-full block" />
        </button>
      </div>

      {/* Sidebar overlay (มือถือ/แท็บเล็ต) */}
      <div
        role="presentation"
        aria-hidden={!sidebarOpen}
        onClick={() => setSidebarOpen(false)}
        className={`lg:hidden fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar ด้านซ้าย */}
      <aside
        aria-label="เมนูนำทาง"
        aria-hidden={!sidebarOpen}
        className={`lg:hidden fixed top-0 left-0 z-[70] h-full w-[min(280px,85vw)] max-w-[280px] bg-navy shadow-xl flex flex-col transition-transform duration-300 ease-out safe-top ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between min-h-[56px] px-4 border-b border-white/10">
          <span className="font-semibold text-white text-sm">เมนู</span>
          <button
            type="button"
            aria-label="ปิดเมนู"
            onClick={() => setSidebarOpen(false)}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-white/10 active:bg-white/15"
          >
            <span className="sr-only">ปิด</span>
            <span className="block w-5 h-0.5 bg-current rounded-full rotate-45 absolute" />
            <span className="block w-5 h-0.5 bg-current rounded-full -rotate-45 absolute" />
          </button>
        </div>
        <nav className="flex flex-col p-3 overflow-y-auto">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center min-h-[48px] px-4 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/90 hover:bg-white/10 active:bg-white/15"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <a
            href={`tel:${tel}`}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center min-h-[48px] px-4 mt-2 rounded-xl text-base font-medium bg-blue text-white hover:bg-blue-light active:opacity-90"
          >
            โทรติดต่อ
          </a>
        </nav>
      </aside>
    </header>
  );
}
