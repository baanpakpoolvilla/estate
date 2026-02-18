import { cookies } from "next/headers";

const COOKIE_NAME = "adminAuth";

export async function requireAdmin(): Promise<{ ok: true } | { ok: false; status: number }> {
  const store = await cookies();
  const session = store.get(COOKIE_NAME)?.value;
  if (!session) return { ok: false, status: 401 };
  return { ok: true };
}
