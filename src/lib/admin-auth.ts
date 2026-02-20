import { createClient } from "@/lib/supabase/server";

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const single = process.env.ADMIN_EMAIL?.trim();
  const list = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase());
  const lower = email.toLowerCase();
  if (single && lower === single.toLowerCase()) return true;
  if (list?.length && list.includes(lower)) return true;
  return false;
}

export async function requireAdmin(): Promise<
  { ok: true } | { ok: false; status: number }
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, status: 401 };
    if (!isAdminEmail(user.email ?? undefined)) return { ok: false, status: 403 };
    return { ok: true };
  } catch {
    return { ok: false, status: 401 };
  }
}
