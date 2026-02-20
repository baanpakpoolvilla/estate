/**
 * สร้างบัญชีทดสอบแอดมินใน Supabase (ใช้เฉพาะโหมด development)
 * ถ้าไม่มี Supabase จะตั้งคุกกี้ bypass ให้เข้าแอดมินได้ (เทสเท่านั้น)
 */
import { supabaseAdmin } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const TEST_EMAIL = "admin@poolvilla.local";
const TEST_PASSWORD = "PoolVilla@Admin2026";
const DEV_BYPASS_COOKIE = "adminDevBypass";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  if (!supabaseAdmin) {
    const res = NextResponse.json({ ok: true, bypass: true });
    res.cookies.set(DEV_BYPASS_COOKIE, "1", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
    });
    return res;
  }

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already been registered")) {
      return NextResponse.json({ ok: true, message: "User already exists" });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "User created" });
}
