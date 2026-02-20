"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const urlError = searchParams.get("error");
  const displayError =
    error ??
    (urlError === "unauthorized"
      ? "บัญชีนี้ไม่มีสิทธิ์เข้าสู่ระบบแอดมิน"
      : urlError === "callback"
        ? "ไม่สามารถยืนยันตัวตนได้ กรุณาลองใหม่อีกครั้ง"
        : null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) {
        setError(signError.message === "Invalid login credentials" ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : signError.message);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      if (msg.includes("Missing") || msg.includes("NEXT_PUBLIC_SUPABASE")) {
        setError("กรุณาตั้งค่า NEXT_PUBLIC_SUPABASE_URL และคีย์ใน .env.local");
      } else {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGitHub() {
    setError(null);
    setGithubLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/admin` },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      if (msg.includes("Missing") || msg.includes("NEXT_PUBLIC_SUPABASE")) {
        setError("กรุณาตั้งค่า NEXT_PUBLIC_SUPABASE_URL และคีย์ใน .env.local");
      } else {
        setError("ไม่สามารถเข้าสู่ระบบด้วย GitHub ได้");
      }
    } finally {
      setGithubLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <h1 className="font-bold text-xl md:text-2xl text-navy mb-4">
        เข้าสู่ระบบผู้ดูแล (Admin)
      </h1>
      <p className="text-gray-600 text-sm mb-6">
        ใช้บัญชีผู้ดูแลระบบเพื่อจัดการข้อมูลพูลวิลล่า ช่องทางติดต่อ และโฆษณา
      </p>
      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100"
      >
        <div className="space-y-1">
          <label className="block text-xs md:text-sm text-gray-700">อีเมล</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
            placeholder="admin@example.com"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs md:text-sm text-gray-700">รหัสผ่าน</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
            placeholder="••••••••"
            required
          />
        </div>
        {displayError && (
          <p className="text-red-600 text-xs md:text-sm">{displayError}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-navy text-white font-semibold disabled:opacity-70"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
        <div className="relative my-4">
          <span className="block text-center text-xs text-gray-500">หรือ</span>
        </div>
        <button
          type="button"
          onClick={handleGitHub}
          disabled={githubLoading}
          className="w-full py-3 rounded-xl border border-gray-200 text-navy font-medium hover:bg-gray-50 disabled:opacity-70"
        >
          {githubLoading ? "กำลังส่ง..." : "เข้าสู่ระบบด้วย GitHub"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm mx-auto animate-pulse rounded-2xl h-80 bg-gray-100" />}>
      <LoginForm />
    </Suspense>
  );
}
