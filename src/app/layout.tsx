import type { Metadata, Viewport } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Favicon from "@/components/Favicon";
import { getContactSettings } from "@/lib/data";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
  preload: true,
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://topform-realestate.com");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ท๊อปฟอร์ม อสังหาริมทรัพย์ | ลงทุนพูลวิลล่า",
    template: "%s | ท๊อปฟอร์ม อสังหาริมทรัพย์",
  },
  description:
    "บริษัท ท๊อปฟอร์ม อสังหาริมทรัพย์ จำกัด - ลงทุนพูลวิลล่าตากอากาศ ข้อมูลบ้าน การประมาณการลงทุน โครงการพูลวิลล่าพร้อมปล่อยเช่า",
  keywords: [
    "ลงทุนพูลวิลล่า",
    "พูลวิลล่าตากอากาศ",
    "ท๊อปฟอร์ม อสังหาริมทรัพย์",
    "TOPFORM Real Estate",
    "วิลล่าพร้อมปล่อยเช่า",
    "อสังหาริมทรัพย์ชลบุรี",
    "ศรีราชา",
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "ท๊อปฟอร์ม อสังหาริมทรัพย์",
    title: "ท๊อปฟอร์ม อสังหาริมทรัพย์ | ลงทุนพูลวิลล่า",
    description:
      "บริษัท ท๊อปฟอร์ม อสังหาริมทรัพย์ จำกัด - ลงทุนพูลวิลล่าตากอากาศ ข้อมูลบ้าน การประมาณการลงทุน",
  },
  twitter: {
    card: "summary_large_image",
    title: "ท๊อปฟอร์ม อสังหาริมทรัพย์ | ลงทุนพูลวิลล่า",
    description: "ลงทุนพูลวิลล่าตากอากาศ ข้อมูลบ้าน การประมาณการลงทุน",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: siteUrl },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let contact = null;
  try {
    contact = await getContactSettings();
  } catch {
    // ถ้า DB/Prisma error ยังแสดง layout + CSS ได้
  }
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: contact?.companyName ?? "บริษัท ท๊อปฟอร์ม อสังหาริมทรัพย์ จำกัด",
    alternateName: contact?.companyNameEn ?? "TOPFORM REAL ESTATE CO., LTD.",
    url: siteUrl,
    ...(contact?.address && { address: { "@type": "PostalAddress", streetAddress: contact.address } }),
    ...(contact?.phone && { telephone: contact.phone }),
    ...(contact?.email && { email: contact.email }),
    ...(contact?.facebookUrl && { sameAs: [contact.facebookUrl] }),
  };

  return (
    <html lang="th" className={sarabun.variable}>
      <head>
        <link rel="dns-prefetch" href="https://dvwskeqmxwysebrusfdt.supabase.co" />
        <link rel="preconnect" href="https://dvwskeqmxwysebrusfdt.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
      </head>
      <body
        className="min-h-screen flex flex-col bg-offwhite text-navy"
        style={{
          backgroundColor: "#F5F7FA",
          color: "#0B1F3B",
        }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {(contact?.faviconUrl || contact?.logoUrl) && (
          <Favicon href={contact.faviconUrl || contact.logoUrl} />
        )}
        <Header contact={contact} />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-5 pb-6 sm:pb-8 md:pb-10">
          {children}
        </main>
        <Footer contact={contact} />
      </body>
    </html>
  );
}
