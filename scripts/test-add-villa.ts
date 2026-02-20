/**
 * ทดสอบการเพิ่มพูลวิลล่า 1 รายการผ่าน Prisma (ไม่ผ่าน API/แอดมิน)
 * รัน: npx tsx scripts/test-add-villa.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const villa = await prisma.villa.create({
    data: {
      name: "วิลล่าทดสอบ พูลวิลลา",
      location: "หาดเทสต์",
      price: "9.9",
      roi: "7.5",
      beds: 3,
      baths: 3,
      sqm: 200,
      land: 80,
      description: "พูลวิลล่าหน้าทะเลสำหรับทดสอบการเพิ่มรายการ",
      mainVideoId: "dQw4w9WgXcQ",
      tag: "ทดสอบ",
      sortOrder: 999,
      isPublished: true,
      areaVideos: [
        { label: "สระว่ายน้ำ", youtubeId: "dQw4w9WgXcQ" },
      ],
      gallery: [
        { label: "มุมหน้าบ้าน", area: "ด้านนอก" },
      ],
      rentalHistory: [
        { period: "ปี 2567", occupancy: "65%", avgRate: "฿6,500/คืน" },
      ],
      businessHistory: "ใช้สำหรับทดสอบระบบเท่านั้น",
      salePlan: "ขายทดสอบ",
      investmentMonthly: { revenue: "฿80,000", expenses: "฿25,000", profit: "฿55,000" },
      accountingSummary: [
        { period: "ไตรมาส 1/2567", revenue: "฿240,000", profit: "฿165,000" },
      ],
    },
  });
  console.log("สร้างวิลล่าทดสอบสำเร็จ:", villa.id, villa.name);
  console.log("ดูรายการได้ที่: /villas และ /admin/villas (หลังล็อกอินแอดมิน)");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
