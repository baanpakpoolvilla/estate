"use client";

import { useState } from "react";

export type VillaFormData = {
  name: string;
  location: string;
  price: string;
  roi: string;
  beds: number;
  baths: number;
  sqm: number;
  land: number | "";
  description: string;
  mainVideoId: string;
  tag: string;
  sortOrder: number;
  isPublished: boolean;
  areaVideos: { label: string; youtubeId: string }[];
  gallery: { label: string; area: string }[];
  rentalHistory: string;
  businessHistory: string;
  salePlan: string;
  investmentMonthly: string;
  accountingSummary: string;
};

const defaultValues: VillaFormData = {
  name: "",
  location: "",
  price: "",
  roi: "",
  beds: 0,
  baths: 0,
  sqm: 0,
  land: "",
  description: "",
  mainVideoId: "",
  tag: "",
  sortOrder: 0,
  isPublished: true,
  areaVideos: [],
  gallery: [],
  rentalHistory: "[]",
  businessHistory: "",
  salePlan: "",
  investmentMonthly: "{}",
  accountingSummary: "[]",
};

function safeJsonParse<T>(s: string, fallback: T): T {
  try {
    if (!s.trim()) return fallback;
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

type VillaFormProps = {
  initial?: Record<string, unknown>;
  onSubmit: (body: Record<string, unknown>) => Promise<unknown>;
};

export default function VillaForm({ initial, onSubmit }: VillaFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<VillaFormData>(() => {
    if (!initial) return defaultValues;
    const parsedArea =
      safeJsonParse<{ label: string; youtubeId: string }[]>(
        JSON.stringify(initial.areaVideos ?? []),
        []
      ) ?? [];
    const parsedGallery =
      safeJsonParse<{ label: string; area: string }[]>(
        JSON.stringify(initial.gallery ?? []),
        []
      ) ?? [];
    return {
      name: String(initial.name ?? ""),
      location: String(initial.location ?? ""),
      price: String(initial.price ?? ""),
      roi: String(initial.roi ?? ""),
      beds: Number(initial.beds) || 0,
      baths: Number(initial.baths) || 0,
      sqm: Number(initial.sqm) || 0,
      land: initial.land != null ? Number(initial.land) : "",
      description: String(initial.description ?? ""),
      mainVideoId: String(initial.mainVideoId ?? ""),
      tag: String(initial.tag ?? ""),
      sortOrder: Number(initial.sortOrder) || 0,
      isPublished: initial.isPublished !== false,
      areaVideos: parsedArea,
      gallery: parsedGallery,
      rentalHistory: JSON.stringify(initial.rentalHistory ?? [], null, 2),
      businessHistory: String(initial.businessHistory ?? ""),
      salePlan: String(initial.salePlan ?? ""),
      investmentMonthly: JSON.stringify(initial.investmentMonthly ?? {}, null, 2),
      accountingSummary: JSON.stringify(initial.accountingSummary ?? [], null, 2),
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
        price: form.price,
        roi: form.roi,
        beds: form.beds,
        baths: form.baths,
        sqm: form.sqm,
        land: form.land === "" ? null : form.land,
        description: form.description || null,
        mainVideoId: form.mainVideoId || null,
        tag: form.tag || null,
        sortOrder: form.sortOrder,
        isPublished: form.isPublished,
        areaVideos: form.areaVideos,
        gallery: form.gallery,
        rentalHistory: safeJsonParse(form.rentalHistory, []),
        businessHistory: form.businessHistory || null,
        salePlan: form.salePlan || null,
        investmentMonthly: safeJsonParse(form.investmentMonthly, {}),
        accountingSummary: safeJsonParse(form.accountingSummary, []),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อวิลล่า *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ทำเล *</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (ล้านบาท) *</label>
          <input
            type="text"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="12.9"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ROI (%)</label>
          <input
            type="text"
            value={form.roi}
            onChange={(e) => update("roi", e.target.value)}
            placeholder="8.5"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ห้องนอน</label>
          <input
            type="number"
            min={0}
            value={form.beds || ""}
            onChange={(e) => update("beds", e.target.value === "" ? 0 : Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ห้องน้ำ</label>
          <input
            type="number"
            min={0}
            value={form.baths || ""}
            onChange={(e) => update("baths", e.target.value === "" ? 0 : Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">พื้นที่ใช้สอย (ตร.ม.)</label>
          <input
            type="number"
            min={0}
            value={form.sqm || ""}
            onChange={(e) => update("sqm", e.target.value === "" ? 0 : Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ที่ดิน (ตร.ว.)</label>
          <input
            type="number"
            min={0}
            value={form.land === "" ? "" : form.land}
            onChange={(e) =>
              update("land", e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายสั้น</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video ID หลัก</label>
          <input
            type="text"
            value={form.mainVideoId}
            onChange={(e) => update("mainVideoId", e.target.value)}
            placeholder="dQw4w9WgXcQ"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">แท็ก (เช่น พร้อมผู้เช่า, Pre-sale)</label>
          <input
            type="text"
            value={form.tag}
            onChange={(e) => update("tag", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ลำดับแสดง</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => update("sortOrder", Number(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={form.isPublished}
            onChange={(e) => update("isPublished", e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="isPublished" className="text-sm text-gray-700">
            แสดงบนเว็บไซต์
          </label>
        </div>
      </div>

      {/* วิดีโอแต่ละส่วนของบ้าน */}
      <section className="border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-medium text-navy text-sm md:text-base">
            วิดีโอส่วนต่าง ๆ ภายในบ้าน
          </h2>
          <button
            type="button"
            onClick={() =>
              update("areaVideos", [
                ...form.areaVideos,
                { label: "", youtubeId: "" },
              ])
            }
            className="px-3 py-1.5 rounded-lg bg-offwhite text-xs md:text-sm text-navy font-medium border border-gray-200"
          >
            + เพิ่มวิดีโอ
          </button>
        </div>
        {form.areaVideos.length === 0 ? (
          <p className="text-gray-500 text-xs md:text-sm">
            ยังไม่มีวิดีโอส่วนต่าง ๆ – กด “เพิ่มวิดีโอ” เพื่อเริ่มต้น (เช่น โถงนั่งเล่น, ห้องนอนหลัก, สระว่ายน้ำ)
          </p>
        ) : (
          <div className="space-y-3">
            {form.areaVideos.map((v, idx) => (
              <div
                key={idx}
                className="grid gap-2 sm:grid-cols-[1.2fr_1fr_auto] items-center"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    ชื่อส่วนของบ้าน
                  </label>
                  <input
                    type="text"
                    value={v.label}
                    onChange={(e) => {
                      const next = [...form.areaVideos];
                      next[idx] = { ...next[idx], label: e.target.value };
                      update("areaVideos", next);
                    }}
                    placeholder="เช่น โถงนั่งเล่นและครัว"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-navy text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    YouTube Video ID
                  </label>
                  <input
                    type="text"
                    value={v.youtubeId}
                    onChange={(e) => {
                      const next = [...form.areaVideos];
                      next[idx] = { ...next[idx], youtubeId: e.target.value };
                      update("areaVideos", next);
                    }}
                    placeholder="dQw4w9WgXcQ"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-navy text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = form.areaVideos.filter((_, i) => i !== idx);
                    update("areaVideos", next);
                  }}
                  className="mt-5 text-xs text-red-600 hover:underline"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* แกลลอรี่รูปภาพ */}
      <section className="border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-medium text-navy text-sm md:text-base">
            แกลลอรี่รูปภาพแต่ละส่วน
          </h2>
          <button
            type="button"
            onClick={() =>
              update("gallery", [
                ...form.gallery,
                { label: "", area: "" },
              ])
            }
            className="px-3 py-1.5 rounded-lg bg-offwhite text-xs md:text-sm text-navy font-medium border border-gray-200"
          >
            + เพิ่มรูปภาพ
          </button>
        </div>
        {form.gallery.length === 0 ? (
          <p className="text-gray-500 text-xs md:text-sm">
            ยังไม่มีรายการแกลลอรี่ – ใช้สำหรับตั้งชื่อมุมต่าง ๆ (เช่น สระว่ายน้ำ, ห้องนั่งเล่น, ห้องนอนหลัก)
          </p>
        ) : (
          <div className="space-y-3">
            {form.gallery.map((g, idx) => (
              <div
                key={idx}
                className="grid gap-2 sm:grid-cols-[1.2fr_1fr_auto] items-center"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    ชื่อรูปภาพ / มุมมอง
                  </label>
                  <input
                    type="text"
                    value={g.label}
                    onChange={(e) => {
                      const next = [...form.gallery];
                      next[idx] = { ...next[idx], label: e.target.value };
                      update("gallery", next);
                    }}
                    placeholder="เช่น สระว่ายน้ำริมทะเล"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-navy text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    พื้นที่ (ภายในบ้าน / ด้านนอก ฯลฯ)
                  </label>
                  <input
                    type="text"
                    value={g.area}
                    onChange={(e) => {
                      const next = [...form.gallery];
                      next[idx] = { ...next[idx], area: e.target.value };
                      update("gallery", next);
                    }}
                    placeholder="เช่น ด้านนอก, ภายในบ้าน"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-navy text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = form.gallery.filter((_, i) => i !== idx);
                    update("gallery", next);
                  }}
                  className="mt-5 text-xs text-red-600 hover:underline"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <details className="border border-gray-200 rounded-xl overflow-hidden">
        <summary className="px-4 py-3 bg-offwhite cursor-pointer font-medium text-navy">
          ข้อมูลเพิ่มเติม (JSON)
        </summary>
        <div className="p-4 space-y-3 border-t border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">rentalHistory</label>
            <textarea
              value={form.rentalHistory}
              onChange={(e) => update("rentalHistory", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-navy font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">businessHistory</label>
            <textarea
              value={form.businessHistory}
              onChange={(e) => update("businessHistory", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-navy text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">salePlan</label>
            <textarea
              value={form.salePlan}
              onChange={(e) => update("salePlan", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-navy text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">investmentMonthly</label>
            <textarea
              value={form.investmentMonthly}
              onChange={(e) => update("investmentMonthly", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-navy font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">accountingSummary</label>
            <textarea
              value={form.accountingSummary}
              onChange={(e) => update("accountingSummary", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-navy font-mono text-xs"
            />
          </div>
        </div>
      </details>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 rounded-xl bg-blue text-white font-semibold disabled:opacity-70"
      >
        {saving ? "กำลังบันทึก..." : "บันทึก"}
      </button>
    </form>
  );
}
