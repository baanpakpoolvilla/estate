"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message ?? "ไม่สามารถเข้าสู่ระบบได้");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <h1 className="font-bold text-xl md:text-2xl text-navy mb-4">เข้าสู่ระบบผู้ดูแล (Admin)</h1>
      <p className="text-gray-600 text-sm mb-6">
        ใช้บัญชีผู้ดูแลระบบเพื่อจัดการข้อมูลพูลวิลล่า ช่องทางติดต่อ และโฆษณา
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
        <div className="space-y-1">
          <label className="block text-xs md:text-sm text-gray-700">
            ชื่อผู้ใช้
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
            placeholder="admin"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs md:text-sm text-gray-700">
            รหัสผ่าน
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
            placeholder="••••••••"
            required
          />
        </div>
        {error && (
          <p className="text-red-600 text-xs md:text-sm">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-navy text-white font-semibold disabled:opacity-70"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
      <p className="mt-4 text-xs text-gray-500">
        ค่าดีฟอลต์: ชื่อผู้ใช้ <span className="font-semibold">admin</span> / รหัสผ่าน{" "}
        <span className="font-semibold">poolvilla@2026</span> (สามารถเปลี่ยนได้ในโค้ดภายหลัง)
      </p>
    </div>
  );
}

