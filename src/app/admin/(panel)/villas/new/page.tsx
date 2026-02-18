"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import VillaForm from "../../VillaForm";

export default function AdminVillaNewPage() {
  const router = useRouter();

  async function handleSubmit(body: Record<string, unknown>) {
    const res = await fetch("/api/admin/villas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "เกิดข้อผิดพลาด");
    }
    const villa = await res.json();
    router.push("/admin/villas");
    router.refresh();
    return villa;
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/villas" className="text-gray-600 hover:text-navy text-sm">
          กลับไปรายการวิลล่า
        </Link>
      </div>
      <h1 className="font-bold text-xl md:text-2xl text-navy mb-2">เพิ่มวิลล่า</h1>
      <p className="text-gray-600 text-sm md:text-base mb-6">
        กรอกข้อมูลหลัก แล้วบันทึก ข้อมูลเพิ่มเติม (วิดีโอส่วนต่างๆ แกลลอรี่ ประวัติการเช่า ฯลฯ) แก้ไขได้ในขั้นตอนแก้ไข
      </p>
      <VillaForm onSubmit={handleSubmit} />
    </div>
  );
}
