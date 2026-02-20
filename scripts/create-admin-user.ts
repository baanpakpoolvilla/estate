/**
 * สร้างผู้ใช้แอดมินใน Supabase Auth (อีเมล + รหัสผ่าน)
 * รัน: npx tsx scripts/create-admin-user.ts
 * ต้องมี .env.local มี NEXT_PUBLIC_SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY
 */
import { readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

// โหลด .env.local และ .env
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const path = join(process.cwd(), file);
      const content = readFileSync(path, "utf8");
      content.split("\n").forEach((line) => {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) {
          const key = m[1].trim();
          const value = m[2].trim().replace(/^["']|["']$/g, "");
          if (!process.env[key]) process.env[key] = value;
        }
      });
    } catch {
      // ข้ามไฟล์ที่ไม่มี
    }
  }
}

function randomPassword(length = 16): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let s = "";
  for (let i = 0; i < length; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

const DEFAULT_ADMIN_EMAIL = "admin@poolvilla.local";

async function main() {
  loadEnv();

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "กรุณาตั้งค่า NEXT_PUBLIC_SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY ใน .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = process.env.ADMIN_CREATE_EMAIL ?? DEFAULT_ADMIN_EMAIL;
  const password = process.env.ADMIN_CREATE_PASSWORD ?? randomPassword(16);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already been registered")) {
      console.log("อีเมลนี้มีในระบบแล้ว:", email);
      console.log("ถ้าจำรหัสผ่านไม่ได้ ให้รีเซ็ตใน Supabase Dashboard → Authentication → Users");
      console.log("และตั้ง ADMIN_EMAIL (หรือ ADMIN_EMAILS) ใน .env.local ให้ตรงกับอีเมลนี้");
      return;
    }
    console.error("สร้างผู้ใช้ไม่สำเร็จ:", error.message);
    process.exit(1);
  }

  console.log("\n=== บัญชีแอดมินที่สร้างแล้ว ===\n");
  console.log("อีเมล:   ", email);
  console.log("รหัสผ่าน:", password);
  console.log("\nให้ตั้งค่าใน .env.local:");
  console.log("  ADMIN_EMAIL=" + email);
  console.log("\nจากนั้นเปิด /admin/login แล้วล็อกอินด้วยอีเมลและรหัสผ่านด้านบน\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
