"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "หน้าแรก", icon: "🏠" },
  { href: "/villas", label: "วิลล่า", icon: "🏡" },
  { href: "/investment", label: "ลงทุน", icon: "📊" },
  { href: "/contact", label: "ติดต่อ", icon: "📞" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(({ href, label, icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
                isActive ? "text-blue" : "text-gray-500"
              }`}
            >
              <span className="text-lg mb-0.5">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
