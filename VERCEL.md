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

## 3. เตรียมสำหรับ Database (ทำภายหลัง)

เมื่อจะเชื่อม Database (เช่น Vercel Postgres, Supabase, PlanetScale):

1. ใน Vercel: ไปที่ **Project → Settings → Environment Variables**
2. เพิ่มตัวแปรที่ใช้ในโค้ด เช่น:
   - `DATABASE_URL` – connection string ของ DB
   - อื่นๆ ตามที่ backend ใช้
3. **Redeploy** หนึ่งครั้งหลังเพิ่ม env เพื่อให้ตัวแปรมีผล

ในโปรเจกต์มีไฟล์ `.env.example` ไว้เป็นตัวอย่างชื่อตัวแปรที่อาจใช้เมื่อทำ database
