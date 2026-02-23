import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  validateImportUrl,
  fetchAndParseVilla,
} from "@/lib/import-villa";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok)
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });

  try {
    const body = await request.json().catch(() => ({}));
    const url = typeof body.url === "string" ? body.url.trim() : "";

    const validation = validateImportUrl(url);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error ?? "URL ไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const data = await fetchAndParseVilla(url);
    return NextResponse.json(data);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "ดึงข้อมูลไม่สำเร็จ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
