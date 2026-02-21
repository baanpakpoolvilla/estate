"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatPrice, formatNumber } from "@/lib/format";

export type HeroVilla = {
  id: string;
  name: string;
  location: string;
  price: string;
  roi: string;
  profitMonthly?: string;
  tag?: string;
  imageUrl?: string | null;
  mainVideoId?: string;
};

const SLIDE_INTERVAL_MS = 5000;

export default function HeroSlider({ villas }: { villas: HeroVilla[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (villas.length <= 0) return;
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % villas.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [villas.length]);

  if (villas.length === 0) return null;

  const go = (index: number) => {
    setCurrent((index + villas.length) % villas.length);
  };

  return (
    <section className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-navy aspect-[9/10] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/9]">
      {villas.map((villa, i) => (
        <div
          key={villa.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {(villa.imageUrl || villa.mainVideoId) && (
            <Image
              src={villa.imageUrl || `https://img.youtube.com/vi/${villa.mainVideoId}/maxresdefault.jpg`}
              alt={villa.name}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6 lg:p-8 pb-10 sm:pb-10 text-white overflow-hidden">
            {villa.tag && (
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 text-navy text-[10px] sm:text-xs font-medium">
                {villa.tag}
              </span>
            )}
            <p className="text-white/80 text-[10px] sm:text-xs md:text-sm mb-0.5">บ้านแนะนำ</p>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight truncate">
              {villa.name}
            </h2>
            <p className="text-white/80 text-xs sm:text-sm md:text-base mt-0.5 truncate">
              {villa.location}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 mb-3">
              <span className="font-semibold text-blue-light text-sm sm:text-base whitespace-nowrap">
                ฿{formatPrice(villa.price)}
              </span>
              <span className="text-white/90 text-xs sm:text-sm whitespace-nowrap">
                ROI ~{villa.roi}%
              </span>
              {villa.profitMonthly && (
                <span className="text-white/90 text-xs sm:text-sm whitespace-nowrap">
                  กำไร/เดือน ฿{formatNumber(villa.profitMonthly)}
                </span>
              )}
            </div>
            <Link
              href={`/villas/${villa.id}`}
              className="inline-flex items-center justify-center min-h-[44px] w-full sm:w-auto text-center py-2.5 px-6 rounded-xl bg-blue text-white font-semibold text-sm hover:bg-blue-light active:opacity-90 transition-colors"
            >
              ดูรายละเอียด
            </Link>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-2.5 sm:bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
        {villas.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`ไปสไลด์ที่ ${i + 1}`}
            onClick={() => go(i)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors touch-manipulation ${
              i === current ? "bg-white" : "bg-white/40 active:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Arrows - desktop */}
      {villas.length > 1 && (
        <>
          <button
            type="button"
            aria-label="ก่อนหน้า"
            onClick={() => go(current - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/20 hover:bg-black/30 text-white hidden md:flex items-center justify-center transition-colors"
          >
            <span className="text-xl md:text-2xl leading-none">‹</span>
          </button>
          <button
            type="button"
            aria-label="ถัดไป"
            onClick={() => go(current + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/20 hover:bg-black/30 text-white hidden md:flex items-center justify-center transition-colors"
          >
            <span className="text-xl md:text-2xl leading-none">›</span>
          </button>
        </>
      )}
    </section>
  );
}
