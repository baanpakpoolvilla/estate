# บัญชีแอดมิน (Admin Login)

ระบบแอดมินใช้ **Supabase Auth** ไม่เก็บอีเมล/รหัสผ่านใน database (Prisma) โดยตรง

---

## วิธีที่ 1: สร้างผู้ใช้ด้วยสคริปต์ (แนะนำ)

เมื่อตั้งค่า Supabase ใน `.env.local` แล้ว:

```bash
npx tsx scripts/create-admin-user.ts
```

สคริปต์จะสร้างผู้ใช้ใน Supabase แล้วแสดง **อีเมล** และ **รหัสผ่าน**  
จากนั้นตั้งค่าใน `.env.local`:

```
ADMIN_EMAIL=อีเมลที่สร้างได้
```

แล้วเปิด `/admin/login` เพื่อล็อกอิน

**ถ้าอีเมลมีอยู่แล้ว:** สคริปต์จะแจ้งให้ใช้อีเมลนั้น และรีเซ็ตรหัสผ่านได้ที่ Supabase Dashboard → Authentication → Users

---

## วิธีที่ 2: สร้างผู้ใช้ใน Supabase Dashboard

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard) → เลือกโปรเจกต์
2. เมนู **Authentication** → **Users** → **Add user** → **Create new user**
3. ใส่ **Email** และ **Password** (เช่น ด้านล่าง) แล้วกดสร้าง
4. ใส่ค่าใน `.env.local`:
   ```
   ADMIN_EMAIL=อีเมลที่ใส่
   ```

### รหัสตัวอย่าง (สำหรับสร้างใน Dashboard)

| อีเมล | รหัสผ่าน (ตัวอย่าง) |
|--------|----------------------|
| `admin@poolvilla.local` | `PoolVilla@Admin2026` |

**หมายเหตุ:** รหัสผ่านตัวอย่างนี้ใช้ได้เฉพาะเมื่อคุณเป็นคนสร้างใน Dashboard เอง หรือรันสคริปต์แล้วตั้งรหัสนี้ (ผ่าน env `ADMIN_CREATE_PASSWORD=PoolVilla@Admin2026`)

---

## สรุป

- **อีเมล:** ใช้ได้ทุกอีเมลที่สร้างใน Supabase Auth (เช่น `admin@poolvilla.local` หรืออีเมลจริงของคุณ)
- **รหัสผ่าน:** ตั้งตอนสร้าง user ใน Supabase (Dashboard หรือสคริปต์)
- **สิทธิ์แอดมิน:** ต้องมีอีเมลนั้นอยู่ใน `ADMIN_EMAIL` หรือ `ADMIN_EMAILS` ใน `.env.local` / Vercel env
