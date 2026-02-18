"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProjectForm from "../../../ProjectForm";

export default function AdminProjectEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/projects/${id}`)
      .then((r) => {
        if (!r.ok) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setInitial(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(body: Record<string, unknown>) {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "เกิดข้อผิดพลาด");
    }
    router.push("/admin/projects");
    router.refresh();
    return res.json();
  }

  if (loading) return <div className="p-8 text-gray-500">กำลังโหลด...</div>;
  if (notFound || !initial)
    return (
      <div className="p-8">
        <p className="text-gray-600 mb-4">ไม่พบรายการโครงการ</p>
        <Link href="/admin/projects" className="text-blue font-medium hover:underline">
          กลับไปรายการโครงการ
        </Link>
      </div>
    );

  return (
    <div className="w-full min-w-0">
      <div className="mb-6">
        <Link href="/admin/projects" className="text-gray-600 hover:text-navy text-sm">
          กลับไปรายการโครงการ
        </Link>
      </div>
      <h1 className="font-bold text-xl md:text-2xl text-navy mb-2">แก้ไขโครงการ</h1>
      <ProjectForm initial={initial} onSubmit={handleSubmit} />
    </div>
  );
}
