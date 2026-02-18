import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.villa.deleteMany();
  await prisma.projectPromo.deleteMany();
  await prisma.contactSettings.deleteMany();

  const villas = [
    {
      name: "วิลล่า บีช 101",
      location: "หาดบางแสน",
      price: "12.9",
      roi: "8.5",
      beds: 4,
      baths: 4,
      sqm: 280,
      land: 120,
      description:
        "พูลวิลล่าหน้าทะเล วิวเปิด สะอาด เหมาะสำหรับทั้งครอบครัวและกลุ่มเพื่อน พร้อมทีมบริหารปล่อยเช่าแบบมืออาชีพ",
      mainVideoId: "dQw4w9WgXcQ",
      tag: "พร้อมผู้เช่า",
      sortOrder: 1,
      areaVideos: [
        { label: "โถงนั่งเล่นและครัว", youtubeId: "dQw4w9WgXcQ" },
        { label: "ห้องนอนมาสเตอร์และห้องน้ำ", youtubeId: "dQw4w9WgXcQ" },
        { label: "สระว่ายน้ำและดาดฟ้า", youtubeId: "dQw4w9WgXcQ" },
      ],
      gallery: [
        { label: "มุมมองด้านหน้า", area: "ด้านนอก" },
        { label: "สระว่ายน้ำ", area: "ด้านนอก" },
        { label: "ห้องนั่งเล่น", area: "ภายในบ้าน" },
        { label: "ห้องนอนหลัก", area: "ภายในบ้าน" },
        { label: "ครัวและโต๊ะอาหาร", area: "ภายในบ้าน" },
      ],
      rentalHistory: [
        { period: "ปี 2566", occupancy: "72%", avgRate: "฿8,200/คืน", note: "สูงสุดในช่วงไฮซีซัน" },
        { period: "ปี 2565", occupancy: "68%", avgRate: "฿7,900/คืน" },
      ],
      businessHistory:
        "เริ่มเปิดให้บริการปล่อยเช่าตั้งแต่ปี 2563 บริหารโดยทีมมืออาชีพ มีฐานลูกค้าประจำจากทั้งตลาดไทยและต่างชาติ คะแนนรีวิวเฉลี่ย 4.7/5 จากแพลตฟอร์มชั้นนำ",
      salePlan:
        "ปัจจุบันเปิดขายพร้อมสัญญาบริหารปล่อยเช่าเดิมต่อเนื่อง ผู้ซื้อใหม่สามารถรับรายได้จากการจองล่วงหน้าที่มีอยู่แล้วในระบบทันที",
      investmentMonthly: { revenue: "฿120,000", expenses: "฿40,000", profit: "฿80,000" },
      accountingSummary: [
        { period: "ไตรมาส 1/2567", revenue: "฿360,000", profit: "฿225,000" },
        { period: "ไตรมาส 4/2566", revenue: "฿410,000", profit: "฿260,000" },
        { period: "ไตรมาส 3/2566", revenue: "฿320,000", profit: "฿195,000" },
      ],
    },
    {
      name: "วิลล่า ฮิลล์ 202",
      location: "เขาใหญ่",
      price: "15.5",
      roi: "9.2",
      beds: 5,
      baths: 5,
      sqm: 320,
      land: 150,
      description:
        "วิลล่าบนเนินเขา ล้อมรอบด้วยต้นไม้และวิวภูเขา บรรยากาศเงียบสงบเหมาะกับกลุ่มครอบครัวและองค์กร",
      mainVideoId: "dQw4w9WgXcQ",
      tag: "Pre-sale",
      sortOrder: 2,
      areaVideos: [
        { label: "โถงนั่งเล่นเพดานสูง", youtubeId: "dQw4w9WgXcQ" },
        { label: "ระเบียงวิวเขา", youtubeId: "dQw4w9WgXcQ" },
      ],
      gallery: [
        { label: "วิวจากระเบียง", area: "ด้านนอก" },
        { label: "ห้องนั่งเล่น", area: "ภายในบ้าน" },
        { label: "สระว่ายน้ำ", area: "ด้านนอก" },
      ],
      rentalHistory: [{ period: "ปี 2566", occupancy: "70%", avgRate: "฿9,500/คืน" }],
      businessHistory:
        "เน้นกลุ่มลูกค้าองค์กรและครอบครัวขนาดใหญ่ มีแพ็กเกจจัดประชุม/ปาร์ตี้ พร้อมบริการเสริมจากทีมโครงการ",
      salePlan:
        "เปิดขายแบบ Pre-sale เฟส 2 พร้อมแผนการันตีรายได้ในช่วง 2 ปีแรก เงื่อนไขเจรจาได้",
      investmentMonthly: { revenue: "฿140,000", expenses: "฿45,000", profit: "฿95,000" },
      accountingSummary: [{ period: "ปี 2566 รวม", revenue: "฿1,650,000", profit: "฿1,050,000" }],
    },
    {
      name: "วิลล่า เลค 303",
      location: "พัทยา",
      price: "14.2",
      roi: "8.8",
      beds: 4,
      baths: 4,
      sqm: 300,
      land: 100,
      description:
        "วิลล่าวิวทะเลสาบ ใกล้สิ่งอำนวยความสะดวกในเมืองพัทยา รายได้เช่าค่อนข้างสม่ำเสมอทั้งปี",
      mainVideoId: "dQw4w9WgXcQ",
      tag: "พร้อมผู้เช่า",
      sortOrder: 3,
      areaVideos: [],
      gallery: [
        { label: "วิวทะเลสาบยามเย็น", area: "ด้านนอก" },
        { label: "ห้องนั่งเล่น", area: "ภายในบ้าน" },
      ],
      rentalHistory: [{ period: "ปี 2566", occupancy: "69%", avgRate: "฿7,800/คืน" }],
      businessHistory:
        "บ้านปล่อยเช่ามาแล้วมากกว่า 4 ปี มีฐานลูกค้าประจำ และได้รับรีวิวดีต่อเนื่อง",
      salePlan: "ขายพร้อมผู้เช่าปัจจุบัน และสามารถโอนสัญญาบริหารให้ผู้ซื้อใหม่ได้ทันที",
      investmentMonthly: { revenue: "฿110,000", expenses: "฿38,000", profit: "฿72,000" },
      accountingSummary: [{ period: "ปี 2566 รวม", revenue: "฿1,320,000", profit: "฿860,000" }],
    },
    {
      name: "วิลล่า ซันเซ็ต 404",
      location: "หัวหิน",
      price: "18.0",
      roi: "9.5",
      beds: 6,
      baths: 6,
      sqm: 380,
      land: 200,
      description:
        "วิลล่าระดับพรีเมียมริมทะเลหัวหิน พื้นที่กว้าง รองรับกลุ่มลูกค้าระดับไฮเอนด์และงานอีเวนต์ส่วนตัว",
      mainVideoId: "dQw4w9WgXcQ",
      tag: "จองล่วงหน้า",
      sortOrder: 4,
      areaVideos: [],
      gallery: [
        { label: "สระว่ายน้ำริมทะเล", area: "ด้านนอก" },
        { label: "ห้องรับแขก", area: "ภายในบ้าน" },
      ],
      rentalHistory: [{ period: "ปี 2566", occupancy: "74%", avgRate: "฿12,000/คืน" }],
      businessHistory:
        "ใช้สำหรับจัดงานส่วนตัว งานเลี้ยง และกลุ่มครอบครัวที่มีกำลังซื้อสูง มีทีมดูแลประจำ",
      salePlan:
        "เปิดขายแบบ Exclusive พร้อมดีลการันตีรายได้เมื่อใช้บริการบริหารของโครงการ",
      investmentMonthly: { revenue: "฿180,000", expenses: "฿55,000", profit: "฿125,000" },
      accountingSummary: [{ period: "ปี 2566 รวม", revenue: "฿2,100,000", profit: "฿1,350,000" }],
    },
  ];

  for (const v of villas) {
    await prisma.villa.create({ data: v });
  }

  await prisma.projectPromo.createMany({
    data: [
      {
        name: "Sunset Pool Villa Resort",
        tagline: "พูลวิลล่าหรูวิวทะเล ระดับพรีเมียม",
        location: "หัวหิน",
        badge: "โครงการใหม่",
        targetUrl: "/villas",
        sortOrder: 1,
      },
      {
        name: "Hill Estate Pool Villas",
        tagline: "โครงการพูลวิลล่าบนเขา ธรรมชาติครบวงจร",
        location: "เขาใหญ่",
        badge: "เปิดขายแล้ว",
        targetUrl: "/villas",
        sortOrder: 2,
      },
    ],
  });

  await prisma.contactSettings.create({
    data: {
      phone: "081-234-5678",
      email: "info@poolvilla-estate.com",
      lineUrl: "https://line.me/ti/p/xxxx",
      address: "(ที่อยู่โครงการ หรือสำนักงาน)",
      mapUrl: "",
    },
  });

  console.log("Seed completed: villas, project promos, contact settings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
