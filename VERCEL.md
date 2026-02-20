# การ Deploy ขึ้น Vercel

## 1. เชื่อมต่อกับ Vercel

1. ไปที่ **[vercel.com](https://vercel.com)** แล้ว Sign in ด้วย **GitHub** (ใช้บัญชีเดียวกับ repo `baanpakpoolvilla/estate`)
2. กด **Add New…** → **Project**
3. ใน **Import Git Repository** เลือก repo **baanpakpoolvilla/estate**
4. ตั้งค่าโปรเจกต์:
   - **Framework Preset**: Next.js (Vercel จะ detect ให้อัตโนมัติ)
   - **Root Directory**: ไม่ต้องเปลี่ยน (เว้นว่าง)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)
5. (ถ้ามี) **Environment Variables**: ยังไม่จำเป็นสำหรับรันเว็บตอนนี้ เมื่อทำ database ค่อยเพิ่มตัวแปรเช่น `DATABASE_URL` ได้
6. กด **Deploy**

หลัง Deploy เสร็จ จะได้ URL แบบ `https://poolvilla-estate-xxx.vercel.app` (หรือโดเมนที่ตั้งไว้)

---

## 2. การอัปเดตเว็บ (หลัง push ขึ้น GitHub)

- ทุกครั้งที่ **push ไปที่ branch `main`** → Vercel จะ **build และ deploy อัตโนมัติ**
- ถ้าสร้าง branch อื่น (เช่น `develop`) แล้วเปิด Pull Request → Vercel จะสร้าง **Preview URL** ให้ทดสอบก่อน merge

---

## 3. Environment Variables (ให้ production เหมือน localhost)

**ถ้าไม่ตั้งค่า** หน้าเว็บบน Vercel จะไม่มีข้อมูลจาก DB (รายการบ้าน, บทความ, โลโก้/ช่องทางติดต่อ) เพราะทุกหน้าที่ดึงข้อมูลใช้ **force-dynamic** = โหลดจาก DB ทุกครั้ง

1. ใน Vercel: ไปที่ **Project → Settings → Environment Variables**
2. เพิ่มตัวแปรให้ตรงกับที่รันบนเครื่อง (ดูจาก `.env.example`):
   - **`DATABASE_URL`** – connection string ของ PostgreSQL (เช่น Supabase Pooler URL)
   - **`DIRECT_URL`** – direct connection (เช่น Supabase Session URL) สำหรับ Prisma
   - **`NEXT_PUBLIC_SITE_URL`** (ถ้ามี) – URL หลักของเว็บ เช่น `https://yourdomain.com` ใช้กับ sitemap, Open Graph
   - อัปโหลดรูปแอดมิน: **`NEXT_PUBLIC_SUPABASE_URL`**, **`SUPABASE_SERVICE_ROLE_KEY`**
   - **ล็อกอินแอดมิน (Supabase Auth)**: **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** (หรือ `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), **`ADMIN_EMAIL`** หรือ **`ADMIN_EMAILS`** (อีเมลที่อนุญาตเข้าแอดมิน คั่นด้วย comma)
3. กด **Save** แล้วไปที่ **Deployments** → เลือก deployment ล่าสุด → **Redeploy** เพื่อให้ env มีผล

**หมายเหตุ:** ถ้าใช้ล็อกอินด้วย GitHub ต้องเพิ่ม Redirect URL ใน Supabase Dashboard → Authentication → URL Configuration เช่น `https://yourdomain.com/auth/callback`

โปรเจกต์ตั้งค่า `export const dynamic = "force-dynamic"` ให้หน้าหลัก, villas, articles, contact, sitemap แล้ว ดังนั้นหลังตั้ง env และ redeploy ผลบน production จะดึงข้อมูลจาก DB แบบเดียวกับ localhost
