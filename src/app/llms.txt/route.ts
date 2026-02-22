import { getVillasForList, getArticlesForList, getProjectPromos } from "@/lib/data";

export const dynamic = "force-dynamic";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://topformestate.com");

export async function GET() {
  let villas: Awaited<ReturnType<typeof getVillasForList>> = [];
  let articles: Awaited<ReturnType<typeof getArticlesForList>> = [];
  let projects: Awaited<ReturnType<typeof getProjectPromos>> = [];

  try {
    const [v, a, p] = await Promise.all([
      getVillasForList(),
      getArticlesForList(),
      getProjectPromos(),
    ]);
    villas = v;
    articles = a;
    projects = p;
  } catch {
    // DB error — static content only
  }

  const lines: string[] = [
    `# TOPFORM REAL ESTATE CO., LTD. — ท๊อปฟอร์ม อสังหาริมทรัพย์`,
    ``,
    `> บริษัท ท๊อปฟอร์ม อสังหาริมทรัพย์ จำกัด — แพลตฟอร์มลงทุนพูลวิลล่าตากอากาศในประเทศไทย ให้บริการข้อมูลบ้าน ประมาณการผลตอบแทน โครงการพูลวิลล่าพร้อมปล่อยเช่า และบทความความรู้ด้านอสังหาริมทรัพย์`,
    ``,
    `## เกี่ยวกับเรา`,
    ``,
    `TOPFORM Real Estate เป็นบริษัทอสังหาริมทรัพย์ที่เชี่ยวชาญด้านพูลวิลล่าสำหรับนักลงทุน ตั้งอยู่ที่ศรีราชา ชลบุรี ประเทศไทย`,
    `เราคัดสรรพูลวิลล่าที่มีศักยภาพในการปล่อยเช่า พร้อมข้อมูลตัวเลขการลงทุนที่โปร่งใส`,
    ``,
    `- เลขทะเบียน: 0205567002163`,
    `- ที่อยู่: 84/22 หมู่ที่ 7 ตำบลสุรศักดิ์ อำเภอศรีราชา จ.ชลบุรี 20110`,
    `- เว็บไซต์: ${baseUrl}`,
    ``,
    `## หน้าหลัก`,
    ``,
    `- [หน้าแรก](${baseUrl}): ภาพรวมวิลล่าแนะนำ โครงการ บทความ และจุดเด่นการลงทุน`,
    `- [รายการบ้านทั้งหมด](${baseUrl}/villas): ค้นหาและกรองพูลวิลล่าตามทำเล ราคา ห้องนอน ROI`,
    `- [โครงการพูลวิลล่า](${baseUrl}/projects): โครงการพูลวิลล่าหรูที่คัดสรรสำหรับนักลงทุน`,
    `- [บทความ](${baseUrl}/articles): ความรู้ด้านอสังหาริมทรัพย์ เทรนด์ตลาด และเคล็ดลับการลงทุน`,
    `- [ลงทุนกับเรา](${baseUrl}/investment): ข้อมูลผลตอบแทน ตัวเลขรวมโครงการ กระบวนการลงทุน`,
    `- [ติดต่อ](${baseUrl}/contact): ช่องทางติดต่อทีมงาน โทรศัพท์ Facebook Line`,
    ``,
  ];

  if (villas.length > 0) {
    lines.push(`## รายการพูลวิลล่า`, ``);
    for (const v of villas) {
      const details = [
        v.location,
        `฿${v.price}`,
        v.roi ? `ROI ~${v.roi}%` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      lines.push(
        `- [${v.name}](${baseUrl}/villas/${v.id}): ${details}`,
      );
    }
    lines.push(``);
  }

  if (projects.length > 0) {
    lines.push(`## โครงการพูลวิลล่า`, ``);
    for (const p of projects) {
      const desc = [p.tagline, p.location].filter(Boolean).join(" — ");
      lines.push(`- [${p.name}](${baseUrl}/projects/${p.id}): ${desc}`);
    }
    lines.push(``);
  }

  if (articles.length > 0) {
    lines.push(`## บทความ`, ``);
    for (const a of articles) {
      const slug = a.slug || a.id;
      const desc = a.excerpt ? a.excerpt.slice(0, 120) : a.title;
      lines.push(`- [${a.title}](${baseUrl}/articles/${slug}): ${desc}`);
    }
    lines.push(``);
  }

  lines.push(
    `## Optional`,
    ``,
    `- [robots.txt](${baseUrl}/robots.txt): Crawler access rules`,
    `- [sitemap.xml](${baseUrl}/sitemap.xml): Full URL listing with image sitemaps`,
    ``,
  );

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
