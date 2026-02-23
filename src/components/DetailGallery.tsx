"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { isExternalImage } from "@/lib/image-utils";

type GalleryImage = { url: string; label?: string; area?: string };

export default function DetailGallery({ images }: { images: GalleryImage[] }) {
  const [idx, setIdx] = useState<number | null>(null);
  const isOpen = idx !== null;

  const close = useCallback(() => setIdx(null), []);
  const prev = useCallback(() => {
    setIdx((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  }, [images.length]);
  const next = useCallback(() => {
    setIdx((i) => (i !== null ? (i + 1) % images.length : null));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm group focus:outline-none"
          >
            <Image
              src={img.url}
              alt={img.label || `ภาพที่ ${i + 1}`}
              fill
              sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized={isExternalImage(img.url)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            {(img.label || img.area) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/70 to-transparent p-2.5">
                {img.label && <p className="text-white text-xs font-medium truncate">{img.label}</p>}
                {img.area && <p className="text-white/70 text-[11px] truncate">{img.area}</p>}
              </div>
            )}
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {isOpen && idx !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" onClick={close}>
          <div className="flex items-center justify-between px-4 py-3 text-white shrink-0" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-medium">
              {idx + 1} / {images.length}
              {images[idx].label && <span className="ml-2 text-white/70">— {images[idx].label}</span>}
            </span>
            <button type="button" onClick={close} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition text-2xl">
              ✕
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center min-h-0 px-2 sm:px-12" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="relative w-full h-full max-w-5xl mx-auto">
              <Image
                key={idx}
                src={images[idx].url}
                alt={images[idx].label || ""}
                fill
                sizes="100vw"
                className="object-contain"
                priority
                unoptimized={isExternalImage(images[idx].url)}
              />
            </div>

            <button
              type="button"
              onClick={next}
              className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="shrink-0 px-4 py-3 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition ${i === idx ? "border-white" : "border-transparent opacity-50 hover:opacity-80"}`}
                >
                  <Image src={img.url} alt="" fill sizes="64px" className="object-cover" unoptimized={isExternalImage(img.url)} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
