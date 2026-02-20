"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import ArticleForm from "../../ArticleForm";

export default function AdminArticleNewPage() {
  const router = useRouter();

  async function handleSubmit(body: Record<string, unknown>) {
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "เกิดข้อผิดพลาด");
    }
    router.push("/admin/articles");
    router.refresh();
    return res.json();
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-6">
        <Link href="/admin/articles" className="text-gray-600 hover:text-navy text-sm">
          กลับไปรายการบทความ
        </Link>
      </div>
      <h1 className="font-bold text-xl md:text-2xl text-navy mb-2">เพิ่มบทความ</h1>
      <ArticleForm onSubmit={handleSubmit} />
    </div>
  );
}
