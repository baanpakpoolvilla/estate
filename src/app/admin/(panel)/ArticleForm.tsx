"use client";

import { useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import QuillEditor from "@/components/admin/QuillEditor";

type ArticleFormData = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImageUrl: string;
  isPublished: boolean;
  publishedAt: string;
  sortOrder: number;
};

function slugFromTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0e00-\u0e7f\-]/g, "");
}

const defaultValues: ArticleFormData = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverImageUrl: "",
  isPublished: false,
  publishedAt: "",
  sortOrder: 0,
};

type ArticleFormProps = {
  initial?: Record<string, unknown>;
  onSubmit: (body: Record<string, unknown>) => Promise<unknown>;
};

export default function ArticleForm({ initial, onSubmit }: ArticleFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleFormData>(() => {
    if (!initial) return defaultValues;
    const pubAt = initial.publishedAt;
    return {
      title: String(initial.title ?? ""),
      slug: String(initial.slug ?? ""),
      excerpt: String(initial.excerpt ?? ""),
      body: String(initial.body ?? ""),
      coverImageUrl: String(initial.coverImageUrl ?? ""),
      isPublished: initial.isPublished === true,
      publishedAt:
        pubAt instanceof Date
          ? pubAt.toISOString().slice(0, 16)
          : pubAt
            ? new Date(String(pubAt)).toISOString().slice(0, 16)
            : "",
      sortOrder: Number(initial.sortOrder) || 0,
    };
  });

  function update<K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    update("title", title);
    if (!initial || !form.slug) update("slug", slugFromTitle(title));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit({
        title: form.title,
        slug: form.slug.trim() || slugFromTitle(form.title),
        excerpt: form.excerpt.trim() || null,
        body: form.body,
        coverImageUrl: form.coverImageUrl.trim() || null,
        isPublished: form.isPublished,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        sortOrder: form.sortOrder,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อบทความ *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="เช่น invest-pool-villa-guide"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">ใช้ใน URL: /articles/[slug]</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">สรุปย่อ (excerpt)</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          rows={2}
          placeholder="ข้อความสั้นๆ แสดงในรายการบทความ"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">เนื้อหาบทความ *</label>
        <QuillEditor
          value={form.body}
          onChange={(v) => update("body", v)}
          height={380}
        />
      </div>
      <div>
        <ImageUploadField
          label="รูปปก (cover)"
          value={form.coverImageUrl}
          onChange={(url) => update("coverImageUrl", url)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ลำดับแสดง</label>
        <input
          type="number"
          value={form.sortOrder}
          onChange={(e) => update("sortOrder", Number(e.target.value) || 0)}
          className="w-full max-w-24 px-4 py-2.5 rounded-xl border border-gray-200 text-navy"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => update("isPublished", e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">เผยแพร่ (แสดงในหน้ารายการบทความ)</span>
        </label>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">วันเผยแพร่</label>
          <input
            type="datetime-local"
            value={form.publishedAt}
            onChange={(e) => update("publishedAt", e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-navy text-sm"
          />
        </div>
      </div>
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
