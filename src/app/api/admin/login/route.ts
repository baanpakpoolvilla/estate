import { NextResponse } from "next/server";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "poolvilla@2026";
const COOKIE_NAME = "adminAuth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, "1", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
    });
    return res;
  }

  return NextResponse.json({ ok: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
}

