"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type GalleryImage = { url: string; label?: string };

type Props = {
  images: GalleryImage[];
};

export default function GalleryLightbox({ images }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const isOpen = lightboxIdx !== null;

  const close = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(() => {
    setLightboxIdx((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  }, [images.length]);
  const next = useCallback(() => {
    setLightboxIdx((i) => (i !== null ? (i + 1) % images.length : null));
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

  const showCount = Math.min(images.length, 5);
  const remaining = images.length - showCount;

  return (
    <>
      {/* Bento Grid */}
      <div className="grid gap-1.5 sm:gap-2 rounded-2xl overflow-hidden" style={bentoStyle(images.length)}>
        {images.slice(0, showCount).map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxIdx(i)}
            className="relative overflow-hidden bg-gray-100 focus:outline-none group"
            style={cellStyle(i, images.length)}
          >
            <Image
              src={img.url}
              alt={img.label || `ภาพที่ ${i + 1}`}
              fill
              sizes={i === 0 ? "(max-width:640px) 100vw, 66vw" : "(max-width:640px) 50vw, 33vw"}
              priority={i === 0}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {i === showCount - 1 && (
              <div className="absolute inset-0 z-10 bg-black/70 flex flex-col items-center justify-center gap-1">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                <span className="text-white text-xs sm:text-sm font-semibold">ดูรูปภาพทั้งหมด</span>
                {remaining > 0 && <span className="text-white/70 text-xs">+{remaining} ภาพ</span>}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          onClick={close}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 text-white shrink-0" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-medium">
              {lightboxIdx + 1} / {images.length}
              {images[lightboxIdx].label && <span className="ml-2 text-white/70">— {images[lightboxIdx].label}</span>}
            </span>
            <button type="button" onClick={close} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition text-2xl">
              ✕
            </button>
          </div>

          {/* Main image */}
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
                key={lightboxIdx}
                src={images[lightboxIdx].url}
                alt={images[lightboxIdx].label || ""}
                fill
                sizes="100vw"
                className="object-contain"
                priority
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

          {/* Thumbnail strip */}
          <div className="shrink-0 px-4 py-3 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIdx(i)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition ${i === lightboxIdx ? "border-white" : "border-transparent opacity-50 hover:opacity-80"}`}
                >
                  <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function bentoStyle(count: number): React.CSSProperties {
  if (count === 1) {
    return { display: "grid", gridTemplateColumns: "1fr", aspectRatio: "16/9" };
  }
  if (count === 2) {
    return { display: "grid", gridTemplateColumns: "1fr 1fr", aspectRatio: "2/1" };
  }
  // 3+ images: bento layout
  return {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gridTemplateRows: "1fr 1fr",
    aspectRatio: "16/9",
  };
}

function cellStyle(index: number, count: number): React.CSSProperties {
  if (count === 1) return {};
  if (count === 2) return {};
  // 3+ images: first image spans 2 rows
  if (index === 0) return { gridRow: "1 / -1" };
  return {};
}
