import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * ทุก path ใต้ /admin (รวมหน้าแดชบอร์ด /admin) ต้องล็อกอินก่อน
 * ถ้าไม่ล็อกอินหรือไม่มีสิทธิ์แอดมิน → redirect ไป /admin/login
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    return await updateSession(request);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
