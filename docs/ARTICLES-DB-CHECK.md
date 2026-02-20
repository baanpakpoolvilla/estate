# รายงานตรวจสอบบทความ: หน้าเว็บ แอดมิน และฐานข้อมูล

**วันที่ตรวจสอบ:** 20 ก.พ. 2026

---

## 1. โครงสร้างฐานข้อมูล (Prisma)

**Model:** `Article` ใน `prisma/schema.prisma`

| ฟิลด์ | ประเภท | หมายเหตุ |
|--------|--------|----------|
| id | String (cuid) | PK |
| title | String | หัวข้อ |
| slug | String **@unique** | ใช้ใน URL `/articles/[slug]` |
| excerpt | String? | คำอธิบายย่อ |
| body | String @db.Text | เนื้อหา (HTML หรือ Markdown) |
| coverImageUrl | String? | URL รูปปก |
| isPublished | Boolean | เผยแพร่แล้ว = แสดงบนเว็บสาธารณะ |
| publishedAt | DateTime? | วันที่เผยแพร่ |
| sortOrder | Int | ลำดับเรียง |
| createdAt / updatedAt | DateTime | |

**การเชื่อมต่อ:** ใช้ `DATABASE_URL` และ `DIRECT_URL` (PostgreSQL / Supabase) ผ่าน Prisma — ตรวจสอบแล้วเชื่อมต่อได้และอ่าน/เขียนได้

---

## 2. ข้อมูลใน DB (จากการสอบถามจริง)

- **จำนวนบทความทั้งหมด:** 2
- **เผยแพร่แล้ว (isPublished: true):** 2

| id | title | slug | isPublished |
|----|--------|------|-------------|
| cmluj4329000711at2wyz5i5j | ลงทุนพูลวิลล่า เริ่มต้นอย่างไรให้ได้ผลตอบแทนดี | invest-pool-villa-guide | true |
| cmluj4329000811at8lu8d2u5 | พูลวิลล่าหัวหิน vs พัทยา เปรียบเทียบจุดเด่นสำหรับนักลงทุน | huahin-vs-pattaya-pool-villa | true |

---

## 3. หน้าเว็บสาธารณะ (Public)

### 3.1 รายการบทความ `/articles`

- **ที่มาข้อมูล:** `getArticlesForList()` ใน `src/lib/data.ts`
- **คำสั่ง DB:** `prisma.article.findMany({ where: { isPublished: true }, orderBy: [...] })`
- **แสดง:** การ์ดบทความ (รูปปก, หัวข้อ, วันที่เผยแพร่, excerpt, ลิงก์ไป `/articles/[slug]`)
- **ผลตรวจ:** หน้าเว็บแสดงลิงก์ 2 บทความตรงกับ 2 แถวใน DB (invest-pool-villa-guide, huahin-vs-pattaya-pool-villa)

### 3.2 หน้ารายละเอียดบทความ `/articles/[slug]`

- **ที่มาข้อมูล:** `getArticleBySlugOrId(slug)` ใน `src/lib/data.ts`
- **คำสั่ง DB:** `prisma.article.findFirst({ where: { isPublished: true, OR: [{ slug }, { id }] } })`
- **แสดง:** รูปปก, หัวข้อ, วันที่, excerpt, เนื้อหา (ผ่าน `ArticleBody`)
- **ArticleBody:** รองรับทั้ง HTML (sanitize-html) และ Markdown (react-markdown)
- **ผลตรวจ:** เปิด `/articles/invest-pool-villa-guide` ได้หัวข้อตรงกับ DB

### 3.3 กรณี error

- หน้า `/articles` และ `/articles/[slug]` มี try/catch; ถ้า DB error หน้ารายการจะว่าง หน้ารายละเอียดจะ notFound()
- `generateMetadata` ใน `[slug]` มี try/catch แล้ว คืน title "ไม่พบบทความ" เมื่อ error

---

## 4. แอดมิน (Admin)

### 4.1 รายการบทความ `/admin/articles`

- **ที่มาข้อมูล:** `GET /api/admin/articles` (ต้องล็อกอิน)
- **API:** `prisma.article.findMany()` — **ไม่กรอง isPublished** จึงเห็นทั้งแบบร่างและเผยแพร่แล้ว
- **การแสดง:** ตาราง (หัวข้อ, slug, สถานะ, ปุ่มแก้ไข/ดู/ลบ)
- **ลบ:** `DELETE /api/admin/articles/[id]`

### 4.2 เพิ่มบทความ `/admin/articles/new`

- **ฟอร์ม:** `ArticleForm` (หัวข้อ, slug, excerpt, เนื้อหา Quill, รูปปก, เผยแพร่/ไม่เผยแพร่, วันที่เผยแพร่, sortOrder)
- **ส่งข้อมูล:** `POST /api/admin/articles` — ฟิลด์ตรงกับ Prisma (slug ถ้าว่างจะสร้างจาก title)
- **Slug:** ใน DB เป็น `@unique` ถ้าซ้ำจะได้ error จาก Prisma

### 4.3 แก้ไขบทความ `/admin/articles/[id]/edit`

- **โหลดข้อมูล:** `GET /api/admin/articles/[id]` → ใส่ใน `ArticleForm` เป็น `initial`
- **บันทึก:** `PUT /api/admin/articles/[id]` — อัปเดตเฉพาะฟิลด์ที่ส่งมา
- **การแมปวันที่:** `publishedAt` จาก API เป็น ISO string; ฟอร์มใช้ `toISOString().slice(0, 16)` สำหรับ input datetime-local

---

## 5. API ที่เกี่ยวกับบทความ

| เมธอด | path | Auth | หมายเหตุ |
|--------|------|------|----------|
| GET | /api/admin/articles | ต้องแอดมิน | คืนรายการบทความทั้งหมด (เรียง sortOrder, publishedAt, createdAt) |
| POST | /api/admin/articles | ต้องแอดมิน | สร้างบทความใหม่ |
| GET | /api/admin/articles/[id] | ต้องแอดมิน | คืนบทความตาม id (สำหรับฟอร์มแก้ไข) |
| PUT | /api/admin/articles/[id] | ต้องแอดมิน | อัปเดตบทความ |
| DELETE | /api/admin/articles/[id] | ต้องแอดมิน | ลบบทความ |

---

## 6. สรุปการเชื่อมต่อกับฐานข้อมูลจริง

| รายการ | สถานะ |
|--------|--------|
| Prisma เชื่อมต่อ PostgreSQL (Supabase) | ใช้ได้ |
| ตาราง Article ใน DB | มีข้อมูล 2 บทความ (ทั้งคู่เผยแพร่แล้ว) |
| หน้ารายการ `/articles` | แสดง 2 บทความตรงกับ DB |
| หน้ารายละเอียด `/articles/[slug]` | เปิดได้ หัวข้อตรงกับ DB |
| แอดมิน: รายการ/เพิ่ม/แก้/ลบ | ใช้ Prisma กับตาราง Article จริง |
| Slug ซ้ำ | DB บังคับ unique; ถ้าสร้าง/แก้แล้วซ้ำจะได้ error จาก API |

**ข้อแนะนำ:**  
- ถ้าเพิ่มบทความแบบร่าง (ไม่ติ๊กเผยแพร่) บทความจะไม่โผล่บน `/articles` และ `/articles/[slug]` เพราะทั้งสองใช้ `isPublished: true`  
- การแก้ไข slug ในแอดมิน: ตรวจสอบว่าไม่ซ้ำกับบทความอื่น มิฉะนั้น Prisma จะ error ตอนบันทึก
