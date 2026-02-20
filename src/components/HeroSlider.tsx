"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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
    <section className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-navy aspect-[16/10] min-h-[240px] xs:min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[400px]">
      {villas.map((villa, i) => (
        <div
          key={villa.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {(villa.imageUrl || villa.mainVideoId) && (
            <img
              src={villa.imageUrl || `https://img.youtube.com/vi/${villa.mainVideoId}/maxresdefault.jpg`}
              alt={villa.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-navy/10" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6 lg:p-8 text-white">
            {villa.tag && (
              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-1 rounded-lg bg-white/95 text-navy text-[10px] sm:text-xs font-medium">
                {villa.tag}
              </span>
            )}
            <p className="text-white/90 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">บ้านแนะนำ</p>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-0.5 leading-tight">
              {villa.name}
            </h2>
            <p className="text-white/85 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
              {villa.location}
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <span className="font-semibold text-blue-light text-sm sm:text-base">
                ฿{villa.price} ลบ.
              </span>
              <span className="text-white/90 text-xs sm:text-sm">
                ROI ~{villa.roi}%
              </span>
              {villa.profitMonthly && (
                <span className="text-white/90 text-xs sm:text-sm">
                  กำไร/เดือน {villa.profitMonthly}
                </span>
              )}
            </div>
            <Link
              href={`/villas/${villa.id}`}
              className="inline-flex items-center justify-center min-h-[44px] w-full sm:w-auto text-center py-3 sm:py-2.5 px-5 rounded-xl bg-blue text-white font-semibold text-sm hover:bg-blue-light active:opacity-90"
            >
              ดูรายละเอียด
            </Link>
          </div>
        </div>
      ))}

      {/* Dots - ขนาดใหญ่บนมือถือเพื่อให้กดง่าย */}
      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 z-20 flex justify-center gap-2 sm:gap-2.5">
        {villas.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`ไปสไลด์ที่ ${i + 1}`}
            onClick={() => go(i)}
            className={`min-w-[10px] min-h-[10px] w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full transition-colors touch-manipulation ${
              i === current ? "bg-white" : "bg-white/50 hover:bg-white/70 active:bg-white/80"
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
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/30 text-white hidden md:flex items-center justify-center transition-colors"
          >
            <span className="text-xl md:text-2xl leading-none">‹</span>
          </button>
          <button
            type="button"
            aria-label="ถัดไป"
            onClick={() => go(current + 1)}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/30 text-white hidden md:flex items-center justify-center transition-colors"
          >
            <span className="text-xl md:text-2xl leading-none">›</span>
          </button>
        </>
      )}
    </section>
  );
}
