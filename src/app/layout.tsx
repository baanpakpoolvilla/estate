import type { Metadata, Viewport } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContactSettings } from "@/lib/data";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contact = await getContactSettings();
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="min-h-screen flex flex-col bg-offwhite text-navy">
        <Header contact={contact} />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {children}
        </main>
        <Footer contact={contact} />
      </body>
    </html>
  );
}
