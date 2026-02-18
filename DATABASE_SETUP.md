# ขั้นตอนเริ่มต้น Database (PostgreSQL)

โปรเจกต์ใช้ **Prisma** กับ **PostgreSQL**  
แนะนำใช้ **Supabase** (ฟรี tier) หรือ **Vercel Postgres** / **Neon**

---

## 1) สร้าง Database (เลือกอย่างใดอย่างหนึ่ง)

### ตัวเลือก A: Supabase (แนะนำ)

1. ไปที่ [supabase.com](https://supabase.com) → Sign up / Login
2. กด **New Project** → ตั้งชื่อ (เช่น `poolvilla-estate`) → ตั้งรหัสผ่าน DB → เลือก Region
3. รอสร้างโปรเจกต์เสร็จ
4. ไปที่ **Project Settings** (ไอคอนฟันเฟือง) → **Database**
5. หา **Connection string** → เลือก **URI**
6. Copy ค่า (รูปแบบ `postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres`)
7. แทนที่ `[YOUR-PASSWORD]` ด้วยรหัสผ่าน DB ที่ตั้งไว้ แล้วเก็บค่าไว้ใช้ในขั้นตอนที่ 2

### ตัวเลือก B: Vercel Postgres (Neon)

1. ใน [Vercel Dashboard](https://vercel.com) → เลือกโปรเจกต์ estate
2. ไปที่ **Storage** → **Create Database** → เลือก **Postgres** (Neon)
3. ตั้งชื่อแล้วกด Create
4. ไปที่แท็บ **.env** หรือ **Connection** จะมี `POSTGRES_URL` หรือ `DATABASE_URL` ให้ copy

### ตัวเลือก C: Neon โดยตรง

1. ไปที่ [neon.tech](https://neon.tech) → Sign up
2. สร้างโปรเจกต์ → Copy **Connection string** (URI)

---

## 2) ตั้งค่าในเครื่อง (Local)

1. ในโฟลเดอร์โปรเจกต์ สร้างไฟล์ **`.env.local`** (ถ้ายังไม่มี)

2. ใส่ตัวแปร (ใช้ connection string จากขั้นตอนที่ 1):

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
   ```

   - Supabase: ใช้ URI จาก Supabase (มี `?sslmode=require` ต่อท้ายได้)
   - ถ้าใช้พอร์ต 6543 (connection pooler) ให้ใช้พอร์ตนั้นใน URL

3. ติดตั้ง dependencies (ถ้ายังไม่ได้รัน):

   ```bash
   npm install
   ```

4. สร้างตารางใน DB (ใช้ schema ใน `prisma/schema.prisma`):

   ```bash
   npx prisma db push
   ```

   หรือถ้าอยากใช้ migration แบบมี history:

   ```bash
   npx prisma migrate dev --name init
   ```

5. สร้างข้อมูลอ้างอิง (วิลล่า, โครงการโฆษณา, ช่องทางติดต่อ):

   ```bash
   npm run db:seed
   ```

   หรือ:

   ```bash
   npx prisma db seed
   ```

6. (ถ้าต้องการ) เปิด Prisma Studio ดู/แก้ข้อมูลใน DB:

   ```bash
   npm run db:studio
   ```

---

## 3) ตั้งค่าบน Vercel (Production)

1. ไปที่ Vercel → โปรเจกต์ **estate** → **Settings** → **Environment Variables**
2. เพิ่มตัวแปร:
   - **Name**: `DATABASE_URL`
   - **Value**: ใช้ connection string เดียวกับที่ใช้ local (หรือสร้าง DB แยกสำหรับ production แล้วใส่ URL ของ production)
   - **Environment**: เลือก Production (และ Preview ถ้าต้องการ)
3. **Save** แล้วกด **Redeploy** ที่ Deployments ล่าสุด

หลัง Redeploy เว็บบน Vercel จะอ่านจาก DB ได้ (เมื่อเราเปลี่ยนหน้าเว็บให้ดึงข้อมูลจาก API/DB ในขั้นตอนถัดไป)

---

## 4) สรุปคำสั่งที่ใช้บ่อย

| คำสั่ง | ความหมาย |
|--------|-----------|
| `npm run db:generate` | สร้าง Prisma Client จาก schema |
| `npm run db:push` | สร้าง/อัปเดตตารางใน DB ตาม schema (ไม่มีไฟล์ migration) |
| `npm run db:migrate` | สร้าง migration + อัปเดต DB (มี history) |
| `npm run db:seed` | รัน seed สร้างข้อมูลอ้างอิง (วิลล่า, โครงการ, ช่องทางติดต่อ) |
| `npm run db:studio` | เปิด Prisma Studio ดู/แก้ข้อมูลใน DB |

---

## 5) โครงสร้างตาราง (อ้างอิง)

- **Villa** – ข้อมูลพูลวิลล่า (ชื่อ, ทำเล, ราคา, ROI, วิดีโอ, แกลลอรี่, ประวัติการเช่า, ตัวเลขลงทุน ฯลฯ)
- **ProjectPromo** – โครงการโฆษณา (ชื่อ, tagline, ป้าย, ลิงก์ ฯลฯ)
- **ContactSettings** – ช่องทางติดต่อ (โทร, อีเมล, Line, ที่อยู่) หนึ่งแถว

ข้อมูล seed จะสร้างวิลล่า 4 หลัง โครงการ 2 รายการ และช่องทางติดต่อ 1 ชุด ตรงกับข้อมูลที่ใช้บนเว็บตอนนี้
