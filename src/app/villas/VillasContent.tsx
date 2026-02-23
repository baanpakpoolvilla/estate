"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice, formatNumber } from "@/lib/format";
import { isExternalImage } from "@/lib/image-utils";
import type { VillaListItem } from "@/lib/data";

type Filters = {
  search: string;
  location: string;
  status: string;
  propertyType: string;
  priceMin: string;
  priceMax: string;
  bedsMin: string;
  bathsMin: string;
  sort: string;
};

const defaultFilters: Filters = {
  search: "", location: "", status: "", propertyType: "",
  priceMin: "", priceMax: "",
  bedsMin: "", bathsMin: "", sort: "default",
};

const STATUS_LABELS: Record<string, string> = { sale: "ขาย", rent: "เช่า" };
const RENT_PERIOD_LABELS: Record<string, string> = { monthly: "/เดือน", yearly: "/ปี" };
const TYPE_LABELS: Record<string, string> = { "pool-villa": "พูลวิลล่า", townhouse: "ทาวน์เฮาส์", residential: "บ้านอยู่อาศัย", land: "ที่ดินเปล่า" };
const STATUS_COLORS: Record<string, string> = { sale: "bg-blue text-white", rent: "bg-amber-500 text-white" };
const TYPE_COLORS: Record<string, string> = { "pool-villa": "bg-navy/90 text-white", townhouse: "bg-violet-600/90 text-white", residential: "bg-emerald-600/90 text-white", land: "bg-orange-600/90 text-white" };

export default function VillasContent({ villas }: { villas: VillaListItem[] }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters, search: initialSearch });
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((p) => ({ ...p, [key]: value }));
  }

  const locations = useMemo(() => {
    const locs = new Set(villas.map((v) => v.location));
    return Array.from(locs).sort();
  }, [villas]);

  const filtered = useMemo(() => {
    let list = [...villas];
    const q = filters.search.toLowerCase().trim();
    if (q) list = list.filter((v) => v.name.toLowerCase().includes(q) || v.location.toLowerCase().includes(q));
    if (filters.location) list = list.filter((v) => v.location === filters.location);
    if (filters.status) list = list.filter((v) => (v.status ?? "sale") === filters.status);
    if (filters.propertyType) list = list.filter((v) => (v.propertyType ?? "pool-villa") === filters.propertyType);
    const pMin = parseFloat(filters.priceMin);
    if (!isNaN(pMin)) list = list.filter((v) => parseFloat(v.price) >= pMin);
    const pMax = parseFloat(filters.priceMax);
    if (!isNaN(pMax)) list = list.filter((v) => parseFloat(v.price) <= pMax);
    const bMin = parseInt(filters.bedsMin);
    if (!isNaN(bMin)) list = list.filter((v) => v.beds >= bMin);
    const btMin = parseInt(filters.bathsMin);
    if (!isNaN(btMin)) list = list.filter((v) => v.baths >= btMin);
    if (filters.sort === "price-asc") list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    else if (filters.sort === "price-desc") list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    else if (filters.sort === "roi-desc") list.sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi));
    return list;
  }, [villas, filters]);

  const hasActiveFilter = filters.search || filters.location || filters.status || filters.propertyType || filters.priceMin || filters.priceMax || filters.bedsMin || filters.bathsMin;

  const selectCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-navy text-sm bg-white";
  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-navy text-sm";

  const filterContent = (
    <div className="space-y-5">
      {/* ค้นหา */}
      <div>
        <label className="block text-xs font-semibold text-navy mb-1.5">ค้นหา</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="ชื่อวิลล่า, ทำเล..."
          className={inputCls}
        />
      </div>

      {/* ทำเล */}
      <div>
        <label className="block text-xs font-semibold text-navy mb-1.5">ทำเล</label>
        <select value={filters.location} onChange={(e) => set("location", e.target.value)} className={selectCls}>
          <option value="">ทั้งหมด</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* สถานะ & ประเภท */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">สถานะ</label>
          <select value={filters.status} onChange={(e) => set("status", e.target.value)} className={selectCls}>
            <option value="">ทั้งหมด</option>
            <option value="sale">ขาย</option>
            <option value="rent">เช่า</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">ประเภท</label>
          <select value={filters.propertyType} onChange={(e) => set("propertyType", e.target.value)} className={selectCls}>
            <option value="">ทั้งหมด</option>
            <option value="pool-villa">พูลวิลล่า</option>
            <option value="townhouse">ทาวน์เฮาส์</option>
            <option value="residential">บ้านอยู่อาศัย</option>
            <option value="land">ที่ดินเปล่า</option>
          </select>
        </div>
      </div>

      {/* ราคา */}
      <div>
        <label className="block text-xs font-semibold text-navy mb-1.5">ราคา (บาท)</label>
        <div className="flex gap-2 items-center">
          <input type="number" value={filters.priceMin} onChange={(e) => set("priceMin", e.target.value)} placeholder="ต่ำสุด" className={inputCls} min={0} step={100000} />
          <span className="text-gray-400 text-xs shrink-0">—</span>
          <input type="number" value={filters.priceMax} onChange={(e) => set("priceMax", e.target.value)} placeholder="สูงสุด" className={inputCls} min={0} step={100000} />
        </div>
      </div>

      {/* ห้องนอน & ห้องน้ำ */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">ห้องนอน (ขั้นต่ำ)</label>
          <select value={filters.bedsMin} onChange={(e) => set("bedsMin", e.target.value)} className={selectCls}>
            <option value="">ไม่จำกัด</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">ห้องน้ำ (ขั้นต่ำ)</label>
          <select value={filters.bathsMin} onChange={(e) => set("bathsMin", e.target.value)} className={selectCls}>
            <option value="">ไม่จำกัด</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>
      </div>

      {/* เรียงลำดับ */}
      <div>
        <label className="block text-xs font-semibold text-navy mb-1.5">เรียงตาม</label>
        <select value={filters.sort} onChange={(e) => set("sort", e.target.value)} className={selectCls}>
          <option value="default">ค่าเริ่มต้น</option>
          <option value="price-asc">ราคาต่ำ → สูง</option>
          <option value="price-desc">ราคาสูง → ต่ำ</option>
          <option value="roi-desc">ROI สูงสุด</option>
        </select>
      </div>

      {/* ล้างตัวกรอง */}
      {hasActiveFilter && (
        <button
          type="button"
          onClick={() => setFilters(defaultFilters)}
          className="w-full py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          ล้างตัวกรองทั้งหมด
        </button>
      )}
    </div>
  );

  return (
    <div className="flex gap-6">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy text-sm mb-4">ค้นหาและกรอง</h2>
          {filterContent}
        </div>
      </aside>

      {/* Mobile filter overlay */}
      {showMobileFilter && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
          <div className="relative ml-auto w-[min(320px,85vw)] bg-white h-full overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-semibold text-navy">ค้นหาและกรอง</h2>
              <button type="button" onClick={() => setShowMobileFilter(false)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">✕</button>
            </div>
            <div className="p-4">
              {filterContent}
              <button
                type="button"
                onClick={() => setShowMobileFilter(false)}
                className="w-full mt-5 py-2.5 rounded-xl bg-blue text-white text-sm font-semibold"
              >
                ดูผลลัพธ์ ({filtered.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile filter button */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">{filtered.length} รายการ</span>
          <button
            type="button"
            onClick={() => setShowMobileFilter(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-navy bg-white hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            ค้นหา / กรอง
            {hasActiveFilter && <span className="w-2 h-2 rounded-full bg-blue" />}
          </button>
        </div>

        {/* Desktop result count */}
        <div className="hidden lg:block mb-4">
          <span className="text-sm text-gray-500">พบ {filtered.length} รายการ{hasActiveFilter ? " (กรองแล้ว)" : ""}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">ไม่พบรายการที่ตรงกับเงื่อนไข</p>
            <button type="button" onClick={() => setFilters(defaultFilters)} className="text-sm text-blue hover:underline">ล้างตัวกรอง</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((villa) => (
              <Link
                key={villa.id}
                href={`/villas/${villa.id}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:border-blue/20"
              >
                <div className="relative aspect-[16/10] bg-navy overflow-hidden">
                  {villa.imageUrl ? (
                    <Image src={villa.imageUrl} alt={villa.name} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized={isExternalImage(villa.imageUrl)} />
                  ) : villa.mainVideoId ? (
                    <Image src={`https://img.youtube.com/vi/${villa.mainVideoId}/mqdefault.jpg`} alt={villa.name} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-navy via-blue/30 to-navy" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold ${STATUS_COLORS[villa.status ?? "sale"] ?? "bg-blue text-white"}`}>
                      {STATUS_LABELS[villa.status ?? "sale"] ?? "ขาย"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold ${TYPE_COLORS[villa.propertyType ?? "pool-villa"] ?? "bg-navy/90 text-white"}`}>
                      {TYPE_LABELS[villa.propertyType ?? "pool-villa"] ?? "พูลวิลล่า"}
                    </span>
                  </div>
                  {villa.tag && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/95 text-navy text-[10px] sm:text-xs font-medium">{villa.tag}</span>
                  )}
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="font-semibold text-navy text-base md:text-lg group-hover:text-blue line-clamp-1">{villa.name}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{villa.location}</p>
                  <p className="text-blue font-bold text-base md:text-lg mt-2">
                    ฿{formatPrice(villa.price)}{(villa.status ?? "sale") === "rent" ? (RENT_PERIOD_LABELS[villa.rentPeriod ?? "monthly"] ?? "/เดือน") : ""}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-sm text-gray-600">
                    {villa.beds > 0 && <span>{villa.beds} ห้องนอน</span>}
                    {villa.baths > 0 && <span>{villa.baths} ห้องน้ำ</span>}
                    {villa.sqm > 0 && <span>{villa.sqm} ตร.ม.</span>}
                  </div>
                  {(villa.roi || villa.profitMonthly) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                      {villa.roi && <span className="text-navy font-medium">ROI ~{villa.roi}%</span>}
                      {villa.profitMonthly && <span className="text-green-700 font-medium">รายได้ ฿{formatNumber(villa.profitMonthly)}/เดือน</span>}
                    </div>
                  )}
                  <p className="mt-3 pt-3 border-t border-gray-100 text-blue text-sm font-medium">ดูรายละเอียด</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
