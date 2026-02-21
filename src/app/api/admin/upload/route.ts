import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin, UPLOAD_BUCKET } from "@/lib/supabase-server";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB (raw before compression)
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
const SKIP_SHARP_TYPES = ["image/svg+xml", "image/gif"];

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok)
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "ไฟล์ใหญ่เกิน 20MB" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "รองรับเฉพาะรูปภาพ (JPEG, PNG, WebP, GIF, SVG)" },
        { status: 400 }
      );
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    let uploadBuffer: Buffer;
    let contentType: string;
    let ext: string;

    if (SKIP_SHARP_TYPES.includes(file.type)) {
      uploadBuffer = rawBuffer;
      contentType = file.type;
      ext = file.name.split(".").pop() || "bin";
    } else {
      uploadBuffer = await sharp(rawBuffer)
        .webp({ quality: 80 })
        .toBuffer();
      contentType = "image/webp";
      ext = "webp";
    }

    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    const { data: bucketList } = await supabaseAdmin.storage.listBuckets();
    const exists = bucketList?.some((b) => b.name === UPLOAD_BUCKET);
    if (!exists) {
      await supabaseAdmin.storage.createBucket(UPLOAD_BUCKET, { public: true });
    }

    const { error: uploadError } = await supabaseAdmin.storage
      .from(UPLOAD_BUCKET)
      .upload(path, uploadBuffer, { contentType, upsert: true });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { error: "Upload failed: " + uploadError.message },
        { status: 500 }
      );
    }

    const { data: urlData } = supabaseAdmin.storage
      .from(UPLOAD_BUCKET)
      .getPublicUrl(path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
