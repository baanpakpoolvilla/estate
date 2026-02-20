import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const single = process.env.ADMIN_EMAIL?.trim();
  const list = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase());
  const lower = email.toLowerCase();
  if (single && lower === single.toLowerCase()) return true;
  if (list?.length && list.includes(lower)) return true;
  return false;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  if (!url || !key) {
    // Supabase Auth not configured: allow only /admin/login for admin routes
    const { pathname } = request.nextUrl;
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname.startsWith("/admin/login");

  if (isAdminRoute && !isLoginPage) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const allowed = isAdminEmail(user.email ?? undefined);
    if (!allowed) {
      return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
    }
  }

  if (isLoginPage && user && isAdminEmail(user.email ?? undefined)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}
