import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pool Villa Estate | ลงทุนพูลวิลล่า",
  description: "ลงทุนพูลวิลล่าตากอากาศ ข้อมูลบ้าน การประมาณการลงทุน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="min-h-screen safe-bottom">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
