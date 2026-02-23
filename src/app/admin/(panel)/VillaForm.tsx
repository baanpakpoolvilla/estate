"use client";

import { useState } from "react";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import QuillEditor from "@/components/admin/QuillEditor";
import MapPicker from "@/components/admin/MapPicker";
import MapSearchBox from "@/components/admin/MapSearchBox";

type AreaVideo = { label: string; youtubeId: string };
/** แกลเลอรี่เป็นกลุ่ม (เช่น รูปที่พัก / รูปรีวิว) แต่ละกลุ่มมีหลายรูป */
type GalleryItem = { label: string; area: string; imageUrls: string[] };
type RentalRow = { period: string; occupancy: string; avgRate: string; note: string };
type AccountingRow = { period: string; revenue: string; profit: string };
type Amenities = {
  pool: boolean;
  kidsPool: boolean;
  karaoke: boolean;
  pingpong: boolean;
  snooker: boolean;
  kitchen: boolean;
  wifi: boolean;
  parking: boolean;
  parkingSlots: number;
};
const defaultAmenities: Amenities = {
  pool: false, kidsPool: false, karaoke: false, pingpong: false,
  snooker: false, kitchen: false, wifi: false, parking: false, parkingSlots: 0,
};
type OwnerInfo = {
  propertyCode: string;
  ownerName: string;
  ownerContact: string;
  wholesalePrice: string;
  commission: string;
  titleDeedType: string;
  transferFee: string;
  viewingNotice: string;
};
const defaultOwnerInfo: OwnerInfo = {
  propertyCode: "", ownerName: "", ownerContact: "",
  wholesalePrice: "", commission: "", titleDeedType: "",
  transferFee: "", viewingNotice: "",
};

export type VillaFormData = {
  name: string;
  location: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  price: string;
  roi: string;
  beds: number;
  baths: number;
  sqm: number;
  land: number | "";
  description: string;
  mainVideoId: string;
  imageUrl: string;
  tag: string;
  status: string;
  rentPeriod: string;
  propertyType: string;
  sortOrder: number;
  isPublished: boolean;
  areaVideos: AreaVideo[];
  gallery: GalleryItem[];
  rentalHistory: RentalRow[];
  businessHistory: string;
  salePlan: string;
  investmentRevenue: string;
  investmentExpenses: string;
  investmentProfit: string;
  accountingSummary: AccountingRow[];
  amenities: Amenities;
  ownerInfo: OwnerInfo;
};

function parseArr<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  return [];
}

type VillaFormProps = {
  initial?: Record<string, unknown>;
  onSubmit: (body: Record<string, unknown>) => Promise<unknown>;
};

export default function VillaForm({ initial, onSubmit }: VillaFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<VillaFormData>(() => {
    if (!initial) {
      return {
        name: "", location: "", address: "",
        latitude: null, longitude: null,
        price: "", roi: "",
        beds: 0, baths: 0, sqm: 0, land: "",
        description: "", mainVideoId: "", imageUrl: "", tag: "",
        status: "sale", rentPeriod: "", propertyType: "pool-villa",
        sortOrder: 0, isPublished: true,
        areaVideos: [], gallery: [], rentalHistory: [],
        businessHistory: "", salePlan: "",
        investmentRevenue: "", investmentExpenses: "", investmentProfit: "",
        accountingSummary: [],
        amenities: { ...defaultAmenities },
        ownerInfo: { ...defaultOwnerInfo },
      };
    }
    const inv = (initial.investmentMonthly as Record<string, string> | null) ?? {};
    const rawGallery = parseArr<Record<string, unknown>>(initial.gallery).map((g) => {
      let urls: string[] = [];
      const raw = g.imageUrls;
      if (Array.isArray(raw)) {
        urls = (raw as unknown[]).filter((u): u is string => typeof u === "string" && u.startsWith("http"));
      } else if (raw != null && typeof raw === "object" && !Array.isArray(raw)) {
        urls = Object.values(raw).filter((u): u is string => typeof u === "string" && u.startsWith("http"));
      } else if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          urls = Array.isArray(parsed) ? parsed.filter((u: unknown) => typeof u === "string" && (u as string).startsWith("http")) : [];
        } catch {
          urls = [];
        }
      } else if (g.imageUrl != null && typeof g.imageUrl === "string") {
        urls = [(g.imageUrl as string).trim()].filter(Boolean);
      }
      return { label: String(g.label ?? ""), area: String(g.area ?? ""), imageUrls: urls };
    });
    return {
      name: String(initial.name ?? ""),
      location: String(initial.location ?? ""),
      address: String(initial.address ?? ""),
      latitude: initial.latitude != null ? Number(initial.latitude) : null,
      longitude: initial.longitude != null ? Number(initial.longitude) : null,
      price: String(initial.price ?? ""),
      roi: String(initial.roi ?? ""),
      beds: Number(initial.beds) || 0,
      baths: Number(initial.baths) || 0,
      sqm: Number(initial.sqm) || 0,
      land: initial.land != null ? Number(initial.land) : "",
      description: String(initial.description ?? ""),
      mainVideoId: String(initial.mainVideoId ?? ""),
      imageUrl: String(initial.imageUrl ?? ""),
      tag: String(initial.tag ?? ""),
      status: String(initial.status ?? "sale"),
      rentPeriod: String(initial.rentPeriod ?? ""),
      propertyType: String(initial.propertyType ?? "pool-villa"),
      sortOrder: Number(initial.sortOrder) || 0,
      isPublished: initial.isPublished !== false,
      areaVideos: parseArr<AreaVideo>(initial.areaVideos),
      gallery: rawGallery,
      rentalHistory: parseArr<RentalRow>(initial.rentalHistory).map((r) => ({
        period: r.period ?? "", occupancy: r.occupancy ?? "", avgRate: r.avgRate ?? "", note: r.note ?? "",
      })),
      businessHistory: String(initial.businessHistory ?? ""),
      salePlan: String(initial.salePlan ?? ""),
      investmentRevenue: String(inv.revenue ?? ""),
      investmentExpenses: String(inv.expenses ?? ""),
      investmentProfit: String(inv.profit ?? ""),
      accountingSummary: parseArr<AccountingRow>(initial.accountingSummary).map((a) => ({
        period: a.period ?? "", revenue: a.revenue ?? "", profit: a.profit ?? "",
      })),
      amenities: { ...defaultAmenities, ...((initial.amenities as Partial<Amenities>) ?? {}) },
      ownerInfo: { ...defaultOwnerInfo, ...((initial.ownerInfo as Partial<OwnerInfo>) ?? {}) },
    };
  });

  function update<K extends keyof VillaFormData>(key: K, value: VillaFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit({
        name: form.name,
        location: form.location,
        address: form.address || null,
        latitude: form.latitude,
        longitude: form.longitude,
        price: form.price,
        roi: form.roi,
        beds: form.beds,
        baths: form.baths,
        sqm: form.sqm,
        land: form.land === "" ? null : form.land,
        description: form.description || null,
        mainVideoId: form.mainVideoId || null,
        imageUrl: form.imageUrl || null,
        tag: form.tag || null,
        status: form.status,
        rentPeriod: form.status === "rent" ? (form.rentPeriod || "monthly") : null,
        propertyType: form.propertyType,
        sortOrder: form.sortOrder,
        isPublished: form.isPublished,
        areaVideos: form.areaVideos.filter((v) => v.label || v.youtubeId),
        gallery: form.gallery.filter((g) => g.imageUrls.length > 0 || g.label).map((g) => ({
          label: g.label, area: g.area, imageUrls: g.imageUrls,
        })),
        rentalHistory: form.rentalHistory.filter((r) => r.period),
        businessHistory: form.businessHistory || null,
        salePlan: form.salePlan || null,
        investmentMonthly: {
          revenue: form.investmentRevenue || "",
          expenses: form.investmentExpenses || "",
          profit: form.investmentProfit || "",
        },
        accountingSummary: form.accountingSummary.filter((a) => a.period),
        amenities: form.amenities,
        ownerInfo: form.ownerInfo,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const smallInputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-navy text-sm bg-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl min-w-0">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {/* ข้อมูลพื้นฐาน */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">ข้อมูลพื้นฐาน</legend>
        <div>
          <label className={labelCls}>ชื่อวิลล่า *</label>
          <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>ทำเล *</label>
            <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)} className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>แท็ก (เช่น พร้อมผู้เช่า, Pre-sale)</label>
            <input type="text" value={form.tag} onChange={(e) => update("tag", e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>ตำแหน่งบนแผนที่ (ค้นหาหรือกดที่แผนที่เพื่อปักหมุด)</label>
          <MapSearchBox onSelect={(lat, lng, address) => {
            update("latitude", lat);
            update("longitude", lng);
            if (address) update("address", address);
          }} />
          <div className="rounded-xl overflow-hidden border border-gray-200 mt-2" style={{ height: 320 }}>
            <MapPicker
              lat={form.latitude}
              lng={form.longitude}
              onChange={async (lat, lng) => {
                update("latitude", lat);
                update("longitude", lng);
                try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=th`, { headers: { "User-Agent": "poolvilla-estate/1.0" } });
                  const data = await res.json();
                  if (data?.display_name) update("address", data.display_name);
                } catch { /* ignore */ }
              }}
            />
          </div>
          {form.latitude != null && form.longitude != null && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-500">
                พิกัด: {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
              </span>
              <button
                type="button"
                onClick={() => { update("latitude", null); update("longitude", null); }}
                className="text-xs text-red-500 hover:underline"
              >
                ลบหมุด
              </button>
            </div>
          )}
        </div>
        <div>
          <label className={labelCls}>ที่อยู่ / บ้านเลขที่</label>
          <textarea
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            rows={2}
            placeholder="ปักหมุดบนแผนที่เพื่อดึงที่อยู่อัตโนมัติ หรือพิมพ์เอง"
            className={`${inputCls} resize-y`}
          />
          <p className="text-xs text-gray-400 mt-1">ที่อยู่ดึงจากตำแหน่งหมุดอัตโนมัติ สามารถแก้ไขให้ถูกต้องได้</p>
        </div>
        <div>
          <label className={labelCls}>คำอธิบาย</label>
          <QuillEditor value={form.description} onChange={(v) => update("description", v)} placeholder="รายละเอียดวิลล่า..." height={200} />
        </div>
      </fieldset>

      {/* ข้อมูลบ้าน */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">สเปกบ้าน</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>สถานะ</label>
            <select value={form.status} onChange={(e) => update("status", e.target.value)} className={inputCls}>
              <option value="sale">ขาย</option>
              <option value="rent">เช่า</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>ประเภท</label>
            <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className={inputCls}>
              <option value="pool-villa">พูลวิลล่า</option>
              <option value="townhouse">ทาวน์เฮาส์</option>
              <option value="residential">บ้านอยู่อาศัย</option>
              <option value="land">ที่ดินเปล่า</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>{form.status === "rent" ? "ค่าเช่า (บาท) *" : "ราคา (บาท) *"}</label>
            <input type="number" min={0} step={1} value={form.price} onChange={(e) => update("price", e.target.value)} placeholder={form.status === "rent" ? "35000" : "20500000"} className={inputCls} required />
          </div>
          {form.status === "rent" && (
            <div>
              <label className={labelCls}>ระยะเวลาเช่า</label>
              <select value={form.rentPeriod || "monthly"} onChange={(e) => update("rentPeriod", e.target.value)} className={inputCls}>
                <option value="monthly">บาท/เดือน</option>
                <option value="yearly">บาท/ปี</option>
              </select>
            </div>
          )}
          <div>
            <label className={labelCls}>ROI (%)</label>
            <input type="text" value={form.roi} onChange={(e) => update("roi", e.target.value)} placeholder="8.5" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>ห้องนอน</label>
            <input type="number" min={0} value={form.beds || ""} onChange={(e) => update("beds", e.target.value === "" ? 0 : Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>ห้องน้ำ</label>
            <input type="number" min={0} value={form.baths || ""} onChange={(e) => update("baths", e.target.value === "" ? 0 : Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>พื้นที่ใช้สอย (ตร.ม.)</label>
            <input type="number" min={0} value={form.sqm || ""} onChange={(e) => update("sqm", e.target.value === "" ? 0 : Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>ที่ดิน (ตร.ว.)</label>
            <input type="number" min={0} value={form.land === "" ? "" : form.land} onChange={(e) => update("land", e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
          </div>
        </div>
      </fieldset>

      {/* สิ่งอำนวยความสะดวก */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">สิ่งอำนวยความสะดวก</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {([
            { key: "pool", label: "สระว่ายน้ำ", icon: "🏊" },
            { key: "kidsPool", label: "สระว่ายน้ำเด็ก", icon: "👶" },
            { key: "karaoke", label: "คาราโอเกะ", icon: "🎤" },
            { key: "pingpong", label: "โต๊ะปิงปอง", icon: "🏓" },
            { key: "snooker", label: "โต๊ะสนุ้ก/พูล", icon: "🎱" },
            { key: "kitchen", label: "อุปกรณ์ครัว", icon: "🍳" },
            { key: "wifi", label: "Wi-Fi", icon: "📶" },
          ] as const).map(({ key, label, icon }) => (
            <label
              key={key}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition ${
                form.amenities[key] ? "border-blue bg-blue/5" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={form.amenities[key] as boolean}
                onChange={(e) => update("amenities", { ...form.amenities, [key]: e.target.checked })}
                className="rounded border-gray-300 text-blue"
              />
              <span className="text-base">{icon}</span>
              <span className="text-sm text-navy">{label}</span>
            </label>
          ))}
          <label
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition ${
              form.amenities.parking ? "border-blue bg-blue/5" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={form.amenities.parking}
              onChange={(e) => update("amenities", { ...form.amenities, parking: e.target.checked, parkingSlots: e.target.checked ? (form.amenities.parkingSlots || 1) : 0 })}
              className="rounded border-gray-300 text-blue"
            />
            <span className="text-base">🚗</span>
            <span className="text-sm text-navy">ที่จอดรถ</span>
            {form.amenities.parking && (
              <input
                type="number"
                min={1}
                value={form.amenities.parkingSlots || ""}
                onChange={(e) => update("amenities", { ...form.amenities, parkingSlots: Number(e.target.value) || 0 })}
                className="w-12 px-1.5 py-0.5 rounded border border-gray-200 text-navy text-sm text-center ml-auto"
                placeholder="คัน"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </label>
        </div>
      </fieldset>

      {/* รูปปกและวิดีโอ */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">รูปปกและวิดีโอ</legend>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">รูปปกวิลล่า (แสดงในหน้ารายการ / Hero)</p>
          <p className="text-xs text-gray-500 mb-2">ไม่ต้องอัปโหลดแยก — เลือกจากแกลเลอรี่ด้านล่าง โดยกดปุ่ม &quot;ตั้งเป็นภาพปก&quot; ที่รูปที่ต้องการ</p>
          {form.imageUrl ? (
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                <img src={form.imageUrl} alt="รูปปก" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-gray-600">รูปปกปัจจุบัน</span>
              <button type="button" onClick={() => update("imageUrl", "")} className="text-xs text-red-500 hover:underline">ล้างรูปปก</button>
            </div>
          ) : (
            <p className="text-xs text-amber-600">ยังไม่ได้เลือกรูปปก — เลือกจากแกลเลอรี่ด้านล่าง</p>
          )}
        </div>
        <div>
          <label className={labelCls}>YouTube Video ID หลัก (ไม่บังคับ)</label>
          <input type="text" value={form.mainVideoId} onChange={(e) => update("mainVideoId", e.target.value)} placeholder="LXb3EKWsInQ" className={inputCls} />
          <p className="text-xs text-gray-400 mt-1">ใส่เฉพาะ ID จากลิงก์วิดีโอ (ไม่บังคับ)</p>
        </div>
      </fieldset>

      {/* วิดีโอแต่ละส่วน */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">วิดีโอส่วนต่างๆ ของบ้าน</legend>
        <p className="text-xs text-gray-500">เช่น โถงนั่งเล่น, ห้องนอนหลัก, สระว่ายน้ำ</p>
        {form.areaVideos.map((v, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <input type="text" value={v.label} onChange={(e) => { const next = [...form.areaVideos]; next[i] = { ...next[i], label: e.target.value }; update("areaVideos", next); }} placeholder="ชื่อส่วน เช่น สระว่ายน้ำ" className={smallInputCls} />
            </div>
            <div className="flex-1">
              <input type="text" value={v.youtubeId} onChange={(e) => { const next = [...form.areaVideos]; next[i] = { ...next[i], youtubeId: e.target.value }; update("areaVideos", next); }} placeholder="YouTube ID" className={smallInputCls} />
            </div>
            <button type="button" onClick={() => update("areaVideos", form.areaVideos.filter((_, j) => j !== i))} className="mt-1 text-red-400 hover:text-red-600 text-sm px-2 py-2">ลบ</button>
          </div>
        ))}
        <button type="button" onClick={() => update("areaVideos", [...form.areaVideos, { label: "", youtubeId: "" }])} className="text-sm text-blue hover:underline">+ เพิ่มวิดีโอ</button>
      </fieldset>

      {/* แกลเลอรี่ (แยกกลุ่ม เช่น รูปที่พัก / รูปรีวิว) */}
      <GallerySection
        gallery={form.gallery}
        onChange={(g) => update("gallery", g)}
        onAdd={(url, groupIndex) => {
          setForm((prev) => {
            const next = [...prev.gallery];
            if (groupIndex != null && groupIndex >= 0 && groupIndex < next.length) {
              next[groupIndex] = { ...next[groupIndex], imageUrls: [...next[groupIndex].imageUrls, url] };
            } else {
              next.push({ label: "", area: "", imageUrls: [url] });
            }
            return { ...prev, gallery: next };
          });
        }}
        onSetCover={(url) => update("imageUrl", url)}
        coverUrl={form.imageUrl}
        smallInputCls={smallInputCls}
      />

      {/* ตัวเลขการลงทุนรายเดือน */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">ตัวเลขการลงทุนรายเดือน (ประมาณการ)</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>รายได้เฉลี่ย/เดือน</label>
            <input type="text" value={form.investmentRevenue} onChange={(e) => update("investmentRevenue", e.target.value)} placeholder="฿85,000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>ค่าใช้จ่ายเฉลี่ย/เดือน</label>
            <input type="text" value={form.investmentExpenses} onChange={(e) => update("investmentExpenses", e.target.value)} placeholder="฿30,000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>กำไรสุทธิ/เดือน</label>
            <input type="text" value={form.investmentProfit} onChange={(e) => update("investmentProfit", e.target.value)} placeholder="฿55,000" className={inputCls} />
          </div>
        </div>
      </fieldset>

      {/* ประวัติการเช่า */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">ประวัติการเช่า</legend>
        {form.rentalHistory.map((r, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">รอบที่ {i + 1}</span>
              <button type="button" onClick={() => update("rentalHistory", form.rentalHistory.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs">ลบ</button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input type="text" value={r.period} onChange={(e) => { const next = [...form.rentalHistory]; next[i] = { ...next[i], period: e.target.value }; update("rentalHistory", next); }} placeholder="ช่วงเวลา เช่น ม.ค.-มี.ค. 2568" className={smallInputCls} />
              <input type="text" value={r.occupancy} onChange={(e) => { const next = [...form.rentalHistory]; next[i] = { ...next[i], occupancy: e.target.value }; update("rentalHistory", next); }} placeholder="อัตราเข้าพัก เช่น 78%" className={smallInputCls} />
              <input type="text" value={r.avgRate} onChange={(e) => { const next = [...form.rentalHistory]; next[i] = { ...next[i], avgRate: e.target.value }; update("rentalHistory", next); }} placeholder="ราคาเฉลี่ย/คืน เช่น ฿8,500" className={smallInputCls} />
              <input type="text" value={r.note} onChange={(e) => { const next = [...form.rentalHistory]; next[i] = { ...next[i], note: e.target.value }; update("rentalHistory", next); }} placeholder="หมายเหตุ (ไม่บังคับ)" className={smallInputCls} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => update("rentalHistory", [...form.rentalHistory, { period: "", occupancy: "", avgRate: "", note: "" }])} className="text-sm text-blue hover:underline">+ เพิ่มประวัติการเช่า</button>
      </fieldset>

      {/* รายรับ-รายจ่ายย้อนหลัง */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">รายรับ-รายจ่ายย้อนหลัง (สรุปทางบัญชี)</legend>
        {form.accountingSummary.map((a, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <input type="text" value={a.period} onChange={(e) => { const next = [...form.accountingSummary]; next[i] = { ...next[i], period: e.target.value }; update("accountingSummary", next); }} placeholder="ไตรมาส 1/2568" className={smallInputCls} />
            </div>
            <div className="flex-1">
              <input type="text" value={a.revenue} onChange={(e) => { const next = [...form.accountingSummary]; next[i] = { ...next[i], revenue: e.target.value }; update("accountingSummary", next); }} placeholder="รายได้ เช่น ฿280,000" className={smallInputCls} />
            </div>
            <div className="flex-1">
              <input type="text" value={a.profit} onChange={(e) => { const next = [...form.accountingSummary]; next[i] = { ...next[i], profit: e.target.value }; update("accountingSummary", next); }} placeholder="กำไร เช่น ฿190,000" className={smallInputCls} />
            </div>
            <button type="button" onClick={() => update("accountingSummary", form.accountingSummary.filter((_, j) => j !== i))} className="mt-1 text-red-400 hover:text-red-600 text-sm px-2 py-2">ลบ</button>
          </div>
        ))}
        <button type="button" onClick={() => update("accountingSummary", [...form.accountingSummary, { period: "", revenue: "", profit: "" }])} className="text-sm text-blue hover:underline">+ เพิ่มรอบบัญชี</button>
      </fieldset>

      {/* ข้อมูลธุรกิจ */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">ข้อมูลธุรกิจ</legend>
        <div>
          <label className={labelCls}>ภาพรวมการดำเนินธุรกิจ</label>
          <QuillEditor value={form.businessHistory} onChange={(v) => update("businessHistory", v)} placeholder="เปิดให้บริการตั้งแต่..." height={160} />
        </div>
        <div>
          <label className={labelCls}>กำหนดการขายและแผนปล่อยเช่าล่วงหน้า</label>
          <QuillEditor value={form.salePlan} onChange={(v) => update("salePlan", v)} placeholder="ขายพร้อมสัญญาเช่า..." height={160} />
        </div>
      </fieldset>

      {/* ตั้งค่า */}
      <fieldset className="space-y-4 bg-white rounded-xl p-4 border border-gray-100">
        <legend className="text-sm font-semibold text-navy px-2">ตั้งค่า</legend>
        <div>
          <label className={labelCls}>ลำดับแสดง</label>
          <input type="number" value={form.sortOrder} onChange={(e) => update("sortOrder", Number(e.target.value) || 0)} className={inputCls} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} className="rounded border-gray-300" />
          <label htmlFor="isPublished" className="text-sm text-gray-700">แสดงบนเว็บไซต์</label>
        </div>
      </fieldset>

      {/* ข้อมูลเจ้าของบ้าน (admin only) */}
      <fieldset className="space-y-4 bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-xl p-4 border border-amber-200/60">
        <legend className="text-sm font-semibold text-amber-800 px-2 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 0 0-8 0v4h8Z" /></svg>
          ข้อมูลเจ้าของบ้าน (เฉพาะแอดมิน)
        </legend>
        <p className="text-xs text-amber-700/70">ข้อมูลนี้จะไม่แสดงบนเว็บไซต์สาธารณะ</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>รหัสทรัพย์</label>
            <input type="text" value={form.ownerInfo.propertyCode} onChange={(e) => update("ownerInfo", { ...form.ownerInfo, propertyCode: e.target.value })} placeholder="เช่น PV-001" className={smallInputCls} />
          </div>
          <div>
            <label className={labelCls}>ชื่อเจ้าของ</label>
            <input type="text" value={form.ownerInfo.ownerName} onChange={(e) => update("ownerInfo", { ...form.ownerInfo, ownerName: e.target.value })} placeholder="ชื่อ-นามสกุล" className={smallInputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>เบอร์ / Line / Facebook</label>
            <input type="text" value={form.ownerInfo.ownerContact} onChange={(e) => update("ownerInfo", { ...form.ownerInfo, ownerContact: e.target.value })} placeholder="เช่น 081-234-5678 / Line: @owner / FB: ชื่อ" className={smallInputCls} />
          </div>
          <div>
            <label className={labelCls}>ราคาส่ง</label>
            <input type="text" value={form.ownerInfo.wholesalePrice} onChange={(e) => update("ownerInfo", { ...form.ownerInfo, wholesalePrice: e.target.value })} placeholder="เช่น 14,000,000" className={smallInputCls} />
          </div>
          <div>
            <label className={labelCls}>ค่าคอม</label>
            <input type="text" value={form.ownerInfo.commission} onChange={(e) => update("ownerInfo", { ...form.ownerInfo, commission: e.target.value })} placeholder="เช่น 3% หรือ 500,000" className={smallInputCls} />
          </div>
          <div>
            <label className={labelCls}>โฉนด (บริษัท/บุคคล)</label>
            <input type="text" value={form.ownerInfo.titleDeedType} onChange={(e) => update("ownerInfo", { ...form.ownerInfo, titleDeedType: e.target.value })} placeholder="เช่น บริษัท / บุคคล" className={smallInputCls} />
          </div>
          <div>
            <label className={labelCls}>ค่าโอน</label>
            <input type="text" value={form.ownerInfo.transferFee} onChange={(e) => update("ownerInfo", { ...form.ownerInfo, transferFee: e.target.value })} placeholder="เช่น คนละครึ่ง / ผู้ซื้อออก" className={smallInputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>ก่อนเข้าดู (ต้องติดต่อก่อนกี่ ชม.)</label>
            <input type="text" value={form.ownerInfo.viewingNotice} onChange={(e) => update("ownerInfo", { ...form.ownerInfo, viewingNotice: e.target.value })} placeholder="เช่น 24 ชม. / 1 วัน / นัดล่วงหน้า 2 วัน" className={smallInputCls} />
          </div>
        </div>
      </fieldset>

      <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-blue text-white font-semibold disabled:opacity-70">
        {saving ? "กำลังบันทึก..." : "บันทึก"}
      </button>
    </form>
  );
}

const GALLERY_PAGE_SIZE = 30;

function GalleryImageGrid({
  urls,
  coverUrl,
  onSetCover,
  onRemove,
}: {
  urls: string[];
  coverUrl: string;
  onSetCover: (url: string) => void;
  onRemove: (idx: number) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(GALLERY_PAGE_SIZE);
  const visible = urls.slice(0, visibleCount);
  const remaining = urls.length - visibleCount;

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {visible.map((url, ui) => (
          <div key={ui} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            <img src={url} alt="" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onSetCover(url)}
                className="px-2 py-1 rounded bg-white/90 text-navy text-[10px] font-medium hover:bg-white"
              >
                ตั้งเป็นภาพปก
              </button>
              <button
                type="button"
                onClick={() => onRemove(ui)}
                className="px-2 py-1 rounded bg-red-500/90 text-white text-[10px] font-medium hover:bg-red-500"
              >
                ลบ
              </button>
            </div>
            {coverUrl === url && (
              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-blue text-white text-[10px] font-medium">รูปปก</span>
            )}
          </div>
        ))}
      </div>
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisibleCount((c) => c + GALLERY_PAGE_SIZE)}
          className="text-sm text-blue font-medium hover:underline"
        >
          ดูเพิ่มอีก {Math.min(remaining, GALLERY_PAGE_SIZE)} รูป (เหลือ {remaining} รูป)
        </button>
      )}
    </>
  );
}

function GallerySection({
  gallery,
  onChange,
  onAdd,
  onSetCover,
  coverUrl,
  smallInputCls,
}: {
  gallery: GalleryItem[];
  onChange: (g: GalleryItem[]) => void;
  onAdd: (url: string, groupIndex?: number) => void;
  onSetCover: (url: string) => void;
  coverUrl: string;
  smallInputCls: string;
}) {
  const [addToGroupIndex, setAddToGroupIndex] = useState<number | null>(null);

  function updateGroup(groupIdx: number, patch: Partial<GalleryItem>) {
    const next = [...gallery];
    next[groupIdx] = { ...next[groupIdx], ...patch };
    onChange(next);
  }

  function removeImage(groupIdx: number, imgIdx: number) {
    const next = [...gallery];
    next[groupIdx] = { ...next[groupIdx], imageUrls: next[groupIdx].imageUrls.filter((_, i) => i !== imgIdx) };
    if (next[groupIdx].imageUrls.length === 0) next.splice(groupIdx, 1);
    onChange(next);
  }

  function removeGroup(groupIdx: number) {
    onChange(gallery.filter((_, i) => i !== groupIdx));
  }

  return (
    <fieldset className="space-y-6 bg-white rounded-xl p-4 border border-gray-100">
      <legend className="text-sm font-semibold text-navy px-2">แกลเลอรี่รูปภาพ (แยกกลุ่ม เช่น รูปที่พัก / รูปรีวิว)</legend>

      {gallery.map((group, gi) => (
        <div key={gi} className="space-y-2 border border-gray-100 rounded-xl p-3 bg-gray-50/50">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={group.label}
              onChange={(e) => updateGroup(gi, { label: e.target.value })}
              placeholder="ชื่อกลุ่ม เช่น รูปที่พัก, รูปรีวิว"
              className={`${smallInputCls} max-w-[200px]`}
            />
            <span className="text-xs text-gray-500">({group.imageUrls.length} รูป)</span>
            <button type="button" onClick={() => removeGroup(gi)} className="text-xs text-red-500 hover:underline">ลบกลุ่ม</button>
          </div>
          <GalleryImageGrid
            urls={group.imageUrls}
            coverUrl={coverUrl}
            onSetCover={onSetCover}
            onRemove={(ui) => removeImage(gi, ui)}
          />
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-600">เพิ่มรูปเข้า:</span>
        <select
          value={addToGroupIndex === null ? "new" : addToGroupIndex}
          onChange={(e) => setAddToGroupIndex(e.target.value === "new" ? null : Number(e.target.value))}
          className="rounded-lg border border-gray-200 text-navy text-sm px-2 py-1.5"
        >
          <option value="new">กลุ่มใหม่</option>
          {gallery.map((g, i) => (
            <option key={i} value={i}>{g.label || `กลุ่มที่ ${i + 1}`}</option>
          ))}
        </select>
        <MultiImageUpload
          onUploaded={(url) => onAdd(url, addToGroupIndex ?? undefined)}
        />
      </div>
      <p className="text-xs text-gray-400">เลือกรูปแล้วกด &quot;ตั้งเป็นภาพปก&quot; ที่รูปที่ต้องการ — อัปโหลดหลายรูปได้</p>
    </fieldset>
  );
}
