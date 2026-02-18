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
};

const SLIDE_INTERVAL_MS = 5000;

export default function HeroSlider({ villas }: { villas: HeroVilla[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
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
    <section className="relative rounded-2xl overflow-hidden bg-navy aspect-[16/10] min-h-[280px] md:min-h-[320px] lg:min-h-[380px]">
      {villas.map((villa, i) => (
        <div
          key={villa.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue/40 via-navy/60 to-navy" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 lg:p-8 text-white">
            {villa.tag && (
              <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/95 text-navy text-xs font-medium">
                {villa.tag}
              </span>
            )}
            <p className="text-white/90 text-xs md:text-sm mb-1">บ้านแนะนำ</p>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-0.5">
              {villa.name}
            </h2>
            <p className="text-white/85 text-sm md:text-base mb-3">
              {villa.location}
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-semibold text-blue-light">
                ฿{villa.price} ลบ.
              </span>
              <span className="text-white/90 text-sm">
                ROI ~{villa.roi}%
              </span>
              {villa.profitMonthly && (
                <span className="text-white/90 text-sm">
                  กำไร/เดือน {villa.profitMonthly}
                </span>
              )}
            </div>
            <Link
              href={`/villas/${villa.id}`}
              className="inline-block w-full sm:w-auto text-center py-2.5 px-5 rounded-xl bg-blue text-white font-semibold text-sm hover:bg-blue-light"
            >
              ดูรายละเอียด
            </Link>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {villas.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`ไปสไลด์ที่ ${i + 1}`}
            onClick={() => go(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/50 hover:bg-white/70"
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white hidden md:flex items-center justify-center"
          >
            <span className="text-xl leading-none">‹</span>
          </button>
          <button
            type="button"
            aria-label="ถัดไป"
            onClick={() => go(current + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white hidden md:flex items-center justify-center"
          >
            <span className="text-xl leading-none">›</span>
          </button>
        </>
      )}
    </section>
  );
}
