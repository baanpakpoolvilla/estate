"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "หน้าแรก" },
  { href: "/villas", label: "วิลล่า" },
  { href: "/investment", label: "ลงทุน" },
  { href: "/contact", label: "ติดต่อ" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 w-full max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
    >
      <div className="flex justify-around items-center h-14 px-2 md:px-4">
        {tabs.map(({ href, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors ${
                isActive ? "text-blue" : "text-gray-500"
              }`}
            >
              <span
                className={`px-3 py-1 rounded-full border text-[11px] ${
                  isActive ? "border-blue bg-blue/5" : "border-transparent bg-transparent"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
