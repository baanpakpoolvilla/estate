# ใส่ข้อมูลตัวอย่าง (Seed) ใน Production

ถ้าเว็บ production ไม่มีพูลวิลล่า สไลด์ โครงการหรู หรือบทความ แสดงว่าฐานข้อมูล production ยังว่าง — ให้รัน **seed** เพื่อใส่ข้อมูลตัวอย่างลง DB ชุดที่ production ใช้

## ข้อมูลตัวอย่างที่ seed จะใส่

- **วิลล่า** 4 หลัง (สำหรับ Hero สไลด์ + รายการบ้าน + วิลล่าแนะนำ)
- **โครงการโฆษณา** 3 โครงการ (แสดงในบล็อก "โครงการพูลวิลล่าหรู และโครงการใหม่")
- **บทความ** 3 บทความ (แสดงในบล็อก "บทความแนะนำ" + หน้ารายการบทความ)
- **ตั้งค่าติดต่อ** 1 ชุด (ชื่อบริษัท ที่อยู่ เบอร์โทร อีเมล Facebook)

## วิธีรัน Seed ใส่ Production

1. **ใช้ DB ชุดเดียวกับ production**  
   เปิดไฟล์ `.env` หรือ `.env.local` แล้วตั้งค่าให้ชี้ไปที่ DB ที่ Vercel/production ใช้:
   - `DATABASE_URL` = connection string ของ production (เช่น Supabase Pooler URL)
   - `DIRECT_URL` = direct URL ของ production (เช่น Supabase Session URL)

2. **รัน seed จากเครื่องคุณ**
   ```bash
   npm run db:seed
   ```
   หรือ
   ```bash
   npx prisma db seed
   ```

3. **ตรวจผล**  
   เปิดเว็บ production ใหม่ ควรเห็นสไลด์วิลล่า โครงการ 3 การ์ด และบทความ 3 บทความ

**หมายเหตุ:** คำสั่ง seed จะ **ลบข้อมูลเดิม** ในตาราง villas, projectPromos, contactSettings, articles แล้วใส่ข้อมูลตัวอย่างใหม่ ดังนั้นถ้ามีข้อมูลจริงอยู่แล้ว ควร backup หรือรัน seed เฉพาะเมื่อต้องการ reset เป็นตัวอย่างเท่านั้น
