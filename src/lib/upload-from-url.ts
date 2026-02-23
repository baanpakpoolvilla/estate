import sharp from "sharp";
import { supabaseAdmin, UPLOAD_BUCKET } from "@/lib/supabase-server";

const MAX_SIZE = 20 * 1024 * 1024;
const SKIP_SHARP_TYPES = ["image/svg+xml", "image/gif"];
const FETCH_TIMEOUT_MS = 25_000;
const MAX_RETRIES = 2;

/**
 * ดึงรูปจาก URL แล้วอัปโหลดขึ้น Supabase bucket villa-images
 * คืน URL สาธารณะของรูปที่อัปโหลด หรือ null ถ้าล้มเหลว (มี retry และ timeout ยาวขึ้นเพื่อให้ดึงรูปจำนวนมากได้)
 */
export async function uploadImageFromUrl(imageUrl: string): Promise<string | null> {
  if (!supabaseAdmin) return null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(imageUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
        referrerPolicy: "no-referrer",
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        return null;
      }
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) return null;
      const rawBuffer = Buffer.from(await res.arrayBuffer());
      if (rawBuffer.length > MAX_SIZE) return null;

      let uploadBuffer: Buffer;
      let finalContentType: string;
      let ext: string;

      if (SKIP_SHARP_TYPES.some((t) => contentType.includes(t))) {
        uploadBuffer = rawBuffer;
        finalContentType = contentType.split(";")[0].trim();
        ext = contentType.includes("svg") ? "svg" : "gif";
      } else {
        uploadBuffer = await sharp(rawBuffer)
          .webp({ quality: 80 })
          .toBuffer();
        finalContentType = "image/webp";
        ext = "webp";
      }

      const path = `import-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
      const { error } = await supabaseAdmin.storage
        .from(UPLOAD_BUCKET)
        .upload(path, uploadBuffer, {
          contentType: finalContentType,
          upsert: true,
        });
      if (error) return null;
      const { data } = supabaseAdmin.storage.from(UPLOAD_BUCKET).getPublicUrl(path);
      return data.publicUrl;
    } catch (e) {
      lastError = e;
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
      return null;
    }
  }
  return null;
}
