import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    return await updateSession(request);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
