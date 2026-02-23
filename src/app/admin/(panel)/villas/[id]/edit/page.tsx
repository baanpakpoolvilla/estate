"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import VillaForm from "../../../VillaForm";

export default function AdminVillaEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/villas/${id}`)
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
    const res = await fetch(`/api/admin/villas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "เกิดข้อผิดพลาด");
    }
    router.push("/admin/villas");
    router.refresh();
    return res.json();
  }

  if (loading) return <div className="p-8 text-gray-500">กำลังโหลด...</div>;
  if (notFound || !initial)
    return (
      <div className="p-8">
        <p className="text-gray-600 mb-4">ไม่พบรายการวิลล่า</p>
        <Link href="/admin/villas" className="text-blue font-medium hover:underline">
          กลับไปรายการวิลล่า
        </Link>
      </div>
    );

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/villas" className="text-gray-600 hover:text-navy text-sm">
          กลับไปรายการวิลล่า
        </Link>
        <a
          href={`/villas/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue text-sm hover:underline"
        >
          ดูบนเว็บ
        </a>
      </div>
      <h1 className="font-bold text-xl md:text-2xl text-navy mb-2">แก้ไขวิลล่า</h1>
      <p className="text-gray-600 text-sm md:text-base mb-6">
        แก้ไขข้อมูลแล้วกดบันทึก
      </p>
      <VillaForm key={id} initial={initial} onSubmit={handleSubmit} />
    </div>
  );
}
