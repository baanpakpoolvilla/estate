import type { Metadata } from "next";
import { getContactSettings } from "@/lib/data";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description:
    "ติดต่อทีมงาน ท๊อปฟอร์ม อสังหาริมทรัพย์ ขอข้อมูลการลงทุนพูลวิลล่า นัดดูบ้าน หรือปรึกษาการลงทุน",
  openGraph: {
    title: "ติดต่อเรา | ท๊อปฟอร์ม อสังหาริมทรัพย์",
    description: "ติดต่อทีมงาน ขอข้อมูลการลงทุนพูลวิลล่า นัดดูบ้าน",
  },
  alternates: { canonical: "/contact" },
};

// ให้ Vercel/production ดึงข้อมูลจาก DB ทุกครั้ง เหมือน localhost
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  let contact: Awaited<ReturnType<typeof getContactSettings>> = null;
  try {
    contact = await getContactSettings();
  } catch {
    // DB error — ContactContent รับ contact null ได้
  }
  return <ContactContent contact={contact} />;
}
