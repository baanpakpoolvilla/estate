"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "แดชบอร์ด" },
  { href: "/admin/inquiries", label: "ข้อมูลลูกค้า" },
  { href: "/admin/villas", label: "จัดการพูลวิลล่า" },
  { href: "/admin/projects", label: "จัดการโฆษณา/โครงการ" },
  { href: "/admin/articles", label: "จัดการบทความ" },
  { href: "/admin/settings", label: "ตั้งค่าเว็บไซต์" },
  { href: "/admin/test", label: "ทดสอบระบบ" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="w-full md:w-60 lg:w-64 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 h-fit md:sticky md:top-24">
      <div className="mb-4">
        <p className="font-semibold text-navy text-sm md:text-base">
          แผงควบคุมผู้ดูแลระบบ
        </p>
        <p className="text-gray-500 text-xs md:text-sm">
          จัดการข้อมูลบนเว็บไซต์ ท๊อปฟอร์ม อสังหาริมทรัพย์
        </p>
      </div>
      <nav className="space-y-1 mb-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-blue text-white"
                : "text-gray-700 hover:bg-offwhite hover:text-navy"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-200 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-70"
      >
        {loggingOut ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
      </button>
    </aside>
  );
}

