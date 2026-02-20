"use client";

import { useState } from "react";

type TestResult = {
  type: string;
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  id?: string;
};

const initialResults: TestResult[] = [
  { type: "villa", status: "idle" },
  { type: "article", status: "idle" },
  { type: "project", status: "idle" },
];

const sampleVilla = {
  name: "Pool Villa Serenity หัวหิน",
  location: "หัวหิน, ประจวบคีรีขันธ์",
  price: "12.5",
  roi: "8.2",
  beds: 3,
  baths: 4,
  sqm: 280,
  land: 100,
  description:
    "พูลวิลล่าหรูสไตล์โมเดิร์นทรอปิคอล ตั้งอยู่ในทำเลทองหัวหิน ห่างจากชายหาดเพียง 800 เมตร " +
    "ออกแบบอย่างพิถีพิถันด้วยวัสดุพรีเมียม สระว่ายน้ำส่วนตัวขนาด 8x4 เมตร " +
    "พร้อมระบบ Smart Home ครบครัน เหมาะสำหรับการลงทุนปล่อยเช่ารายวัน ให้ผลตอบแทนสูง",
  mainVideoId: "LXb3EKWsInQ",
  imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  tag: "แนะนำ",
  sortOrder: 1,
  isPublished: true,
  areaVideos: [
    { label: "ทัวร์รอบบ้าน", youtubeId: "LXb3EKWsInQ" },
    { label: "สระว่ายน้ำ & สวน", youtubeId: "LXb3EKWsInQ" },
  ],
  gallery: [
    { label: "ด้านหน้าวิลล่า", area: "ภายนอก", imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80" },
    { label: "สระว่ายน้ำส่วนตัว", area: "ภายนอก", imageUrl: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80" },
    { label: "ห้องนั่งเล่น", area: "ภายใน", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
    { label: "ห้องนอนใหญ่", area: "ภายใน", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80" },
    { label: "ห้องครัว", area: "ภายใน", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80" },
  ],
  rentalHistory: [
    { period: "ม.ค. - มี.ค. 2568", occupancy: "78%", avgRate: "฿8,500/คืน", note: "ช่วง High Season" },
    { period: "เม.ย. - มิ.ย. 2568", occupancy: "55%", avgRate: "฿6,000/คืน" },
    { period: "ก.ค. - ก.ย. 2567", occupancy: "62%", avgRate: "฿7,200/คืน" },
  ],
  businessHistory: "เปิดให้บริการตั้งแต่ปี 2566 อัตราเข้าพักเฉลี่ยทั้งปี 65% รายได้เฉลี่ย ฿85,000/เดือน หลังหักค่าใช้จ่าย กำไรสุทธิเฉลี่ย ฿55,000/เดือน",
  salePlan: "ขายพร้อมสัญญาเช่าและฐานลูกค้าเดิม สามารถเริ่มรับรายได้ทันทีหลังโอน พร้อมบริการจัดการโดยทีมงานมืออาชีพ",
  investmentMonthly: { revenue: "฿85,000", expenses: "฿30,000", profit: "฿55,000" },
  accountingSummary: [
    { period: "ไตรมาส 1/2568", revenue: "฿280,000", profit: "฿190,000" },
    { period: "ไตรมาส 4/2567", revenue: "฿230,000", profit: "฿155,000" },
    { period: "ไตรมาส 3/2567", revenue: "฿195,000", profit: "฿130,000" },
  ],
};

const sampleArticle = {
  title: "5 เหตุผลที่พูลวิลล่าหัวหินเป็นการลงทุนที่คุ้มค่าในปี 2568",
  slug: "pool-villa-huahin-investment-" + Date.now(),
  excerpt:
    "ตลาดพูลวิลล่าหัวหินเติบโตอย่างต่อเนื่อง ด้วยความต้องการของนักท่องเที่ยวทั้งไทยและต่างชาติ ทำให้เป็นโอกาสการลงทุนที่น่าสนใจ",
  coverImageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
  body:
    '<h2>ทำไมพูลวิลล่าหัวหินจึงน่าลงทุน?</h2>' +
    '<p>หัวหินเป็นหนึ่งในจุดหมายปลายทางยอดนิยมของนักท่องเที่ยวไทยและต่างชาติ ด้วยระยะทางเพียง 2.5 ชั่วโมงจากกรุงเทพฯ ทำให้เป็นสถานที่พักผ่อนวันหยุดที่เข้าถึงง่าย</p>' +
    '<img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80" alt="ชายหาดหัวหิน" />' +
    '<h2>1. ผลตอบแทนสูง 7-9% ต่อปี</h2>' +
    '<p>พูลวิลล่าหัวหินให้ผลตอบแทนจากการปล่อยเช่ารายวันเฉลี่ย 7-9% ต่อปี สูงกว่าการฝากเงินหรือลงทุนในคอนโดในเมืองอย่างมาก</p>' +
    '<h2>2. ความต้องการที่พักสูงตลอดปี</h2>' +
    '<p>หัวหินมีอัตราเข้าพักเฉลี่ยทั้งปี 60-75% โดยเฉพาะช่วง High Season (พ.ย.-มี.ค.) ที่อัตราเข้าพักสูงถึง 80-90%</p>' +
    '<img src="https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80" alt="สระว่ายน้ำส่วนตัว" />' +
    '<h2>3. ราคาที่ดินเพิ่มขึ้นต่อเนื่อง</h2>' +
    '<p>ราคาที่ดินในหัวหินเพิ่มขึ้นเฉลี่ย 8-12% ต่อปี โดยเฉพาะทำเลใกล้ชายหาดและแหล่งท่องเที่ยว</p>' +
    '<h2>4. สาธารณูปโภคครบครัน</h2>' +
    '<p>หัวหินมีห้างสรรพสินค้า โรงพยาบาล โรงเรียนนานาชาติ และสนามกอล์ฟระดับโลก ทำให้เป็นทั้งแหล่งท่องเที่ยวและที่อยู่อาศัยที่สมบูรณ์</p>' +
    '<h2>5. บริหารจัดการง่าย</h2>' +
    '<p>มีบริษัทบริหารจัดการพูลวิลล่ามืออาชีพ ดูแลตั้งแต่การตลาด การจอง การทำความสะอาด และการบำรุงรักษา ให้นักลงทุนรับผลตอบแทนโดยไม่ต้องบริหารเอง</p>' +
    '<img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" alt="พูลวิลล่าหรู" />',
  isPublished: true,
  publishedAt: new Date().toISOString(),
  sortOrder: 1,
};

const sampleProject = {
  name: "The Azure Pool Villas หัวหิน",
  tagline: "พูลวิลล่าหรูวิวทะเล ดีไซน์ระดับ 5 ดาว พร้อมสระอินฟินิตี้ส่วนตัว",
  location: "หัวหิน ซอย 112, ประจวบคีรีขันธ์",
  badge: "Pre-Sale เปิดจองแล้ว",
  imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  targetUrl: "/villas",
  description:
    "The Azure Pool Villas โครงการพูลวิลล่าระดับพรีเมียม ตั้งอยู่บนทำเลทองหัวหิน ซอย 112 " +
    "ห่างจากชายหาดเพียง 500 เมตร ล้อมรอบด้วยธรรมชาติอันร่มรื่น\n\n" +
    "ทุกหลังออกแบบสไตล์ Modern Tropical Luxury ผสมผสานความหรูหราเข้ากับธรรมชาติอย่างลงตัว " +
    "วัสดุคัดสรรระดับพรีเมียม พร้อมสระว่ายน้ำอินฟินิตี้ส่วนตัวขนาด 10x4 เมตร\n\n" +
    "สิ่งอำนวยความสะดวก:\n" +
    "- Clubhouse พร้อมฟิตเนสและสปา\n" +
    "- ระบบรักษาความปลอดภัย 24 ชม.\n" +
    "- Smart Home System ควบคุมผ่านมือถือ\n" +
    "- บริการ Property Management ครบวงจร\n" +
    "- Concierge Service สำหรับแขกผู้เข้าพัก\n\n" +
    "รับประกันผลตอบแทน 7% ในปีแรก เฉพาะ 5 หลังแรกที่จอง",
  videoId: "LXb3EKWsInQ",
  gallery: [
    { label: "ภาพรวมโครงการ", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
    { label: "สระอินฟินิตี้ส่วนตัว", imageUrl: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80" },
    { label: "ห้องนั่งเล่นวิวสวน", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
    { label: "Master Bedroom", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80" },
    { label: "ห้องครัวแบบเปิด", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80" },
    { label: "วิวยามค่ำคืน", imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80" },
  ],
  highlights: [
    { label: "จำนวนหลัง", value: "18 หลัง" },
    { label: "พื้นที่ใช้สอย", value: "280-350 ตร.ม." },
    { label: "ราคาเริ่มต้น", value: "12.9 ล้านบาท" },
    { label: "ROI คาดการณ์", value: "7-9% ต่อปี" },
    { label: "ขนาดที่ดิน", value: "80-120 ตร.วา" },
    { label: "คาดว่าแล้วเสร็จ", value: "ธ.ค. 2569" },
  ],
  sortOrder: 1,
  isActive: true,
};

const labels: Record<string, string> = {
  villa: "พูลวิลล่า",
  article: "บทความ",
  project: "โครงการโฆษณา",
};

const endpoints: Record<string, string> = {
  villa: "/api/admin/villas",
  article: "/api/admin/articles",
  project: "/api/admin/projects",
};

const villaNames = [
  "Pool Villa Serenity หัวหิน",
  "Baan Talay Pool Villa ชะอำ",
  "The Palm Residence ปราณบุรี",
  "Villa Tropicana หัวหิน",
  "Horizon Bay Poolvilla หัวหิน",
];
const articleTitles = [
  "5 เหตุผลที่พูลวิลล่าหัวหินเป็นการลงทุนที่คุ้มค่าในปี 2568",
  "คู่มือการลงทุนพูลวิลล่าสำหรับมือใหม่ สิ่งที่ต้องรู้ก่อนตัดสินใจ",
  "เปรียบเทียบ ROI พูลวิลล่า vs คอนโด อะไรคุ้มกว่า?",
  "เทรนด์ตลาดอสังหาริมทรัพย์หัวหิน-ชะอำ ปี 2568",
  "วิธีเลือกพูลวิลล่าที่ให้ผลตอบแทนดี ดูอย่างไรให้ไม่พลาด",
];
const projectNames = [
  "The Azure Pool Villas หัวหิน",
  "Coral Cove Residence ชะอำ",
  "Seaview Grand Villas ปราณบุรี",
  "Tropical Haven หัวหิน",
  "The Luxe Collection กุยบุรี",
];

function getSample(type: string) {
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  if (type === "villa") return { ...sampleVilla, name: pick(villaNames) };
  if (type === "article") return { ...sampleArticle, title: pick(articleTitles), slug: "article-" + Date.now() };
  return {
    ...sampleProject,
    name: pick(projectNames),
    gallery: sampleProject.gallery.map((g) => ({ ...g })),
    highlights: sampleProject.highlights.map((h) => ({ ...h })),
  };
}

export default function AdminTestPage() {
  const [results, setResults] = useState<TestResult[]>(initialResults);
  const [allLoading, setAllLoading] = useState(false);

  function updateResult(type: string, update: Partial<TestResult>) {
    setResults((prev) =>
      prev.map((r) => (r.type === type ? { ...r, ...update } : r))
    );
  }

  async function runTest(type: string) {
    updateResult(type, { status: "loading", message: undefined, id: undefined });
    try {
      const res = await fetch(endpoints[type], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getSample(type)),
      });
      const data = await res.json();
      if (!res.ok) {
        updateResult(type, { status: "error", message: data.error ?? `HTTP ${res.status}` });
        return;
      }
      updateResult(type, {
        status: "success",
        message: data.name ?? data.title ?? "สำเร็จ",
        id: data.id,
      });
    } catch (err) {
      updateResult(type, {
        status: "error",
        message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
      });
    }
  }

  async function runAll() {
    setAllLoading(true);
    await Promise.all(["villa", "article", "project"].map(runTest));
    setAllLoading(false);
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 md:mb-8">
        <h1 className="font-bold text-xl md:text-2xl text-navy">ทดสอบระบบ</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          กดปุ่มด้านล่างเพื่อทดสอบการสร้างข้อมูลตัวอย่างผ่าน API แอดมิน
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={runAll}
          disabled={allLoading}
          className="px-6 py-3 rounded-xl bg-navy text-white font-semibold text-sm disabled:opacity-70 hover:opacity-90 transition"
        >
          {allLoading ? "กำลังทดสอบทั้งหมด..." : "ทดสอบทั้งหมด"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {results.map((r) => (
          <div
            key={r.type}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <h2 className="font-semibold text-navy mb-2 md:text-lg">
              สร้าง{labels[r.type]}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              ทดสอบ POST ไปที่ {endpoints[r.type]}
            </p>

            <button
              onClick={() => runTest(r.type)}
              disabled={r.status === "loading"}
              className={`w-full py-2.5 rounded-xl font-medium text-sm transition disabled:opacity-70 ${
                r.status === "success"
                  ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                  : r.status === "error"
                    ? "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
                    : "bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {r.status === "loading"
                ? "กำลังสร้าง..."
                : r.status === "success"
                  ? "สร้างอีกครั้ง"
                  : r.status === "error"
                    ? "ลองใหม่"
                    : "สร้าง" + labels[r.type] + "ทดสอบ"}
            </button>

            {r.status === "success" && (
              <div className="mt-3 p-3 bg-green-50 rounded-xl text-xs">
                <p className="text-green-700 font-medium">สำเร็จ</p>
                <p className="text-green-600 mt-0.5">{r.message}</p>
                {r.id && (
                  <p className="text-green-500 mt-0.5 font-mono break-all">
                    ID: {r.id}
                  </p>
                )}
              </div>
            )}

            {r.status === "error" && (
              <div className="mt-3 p-3 bg-red-50 rounded-xl text-xs">
                <p className="text-red-700 font-medium">ไม่สำเร็จ</p>
                <p className="text-red-600 mt-0.5">{r.message}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
