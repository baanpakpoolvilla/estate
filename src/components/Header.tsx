"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "หน้าแรก" },
  { href: "/villas", label: "รายการบ้าน" },
  { href: "/investment", label: "ลงทุน" },
  { href: "/contact", label: "ติดต่อ" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-navy text-white shadow-md">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between h-14 md:h-16">
        <Link href="/" className="font-semibold text-lg md:text-xl text-white hover:text-white/90">
          Pool Villa Estate
        </Link>
        <nav className="flex items-center flex-wrap justify-end gap-1 md:gap-2">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-base font-medium transition-colors ${
                  isActive ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <a
            href="tel:0812345678"
            className="ml-1 md:ml-2 px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-base font-medium bg-blue text-white hover:bg-blue-light shrink-0"
          >
            โทร
          </a>
        </nav>
      </div>
    </header>
  );
}
