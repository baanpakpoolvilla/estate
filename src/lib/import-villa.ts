/**
 * ดึงข้อมูลบ้านจาก URL (เช่น pattayapartypoolvilla.com/v/2564)
 * แล้วคำนวณรายได้จากวันที่ถูกจองย้อนหลัง (อ้างอิงจาก read income/booked_prices.py)
 */

import * as cheerio from "cheerio";

const ALLOWED_ORIGINS = [
  "https://www.pattayapartypoolvilla.com",
  "http://www.pattayapartypoolvilla.com",
  "https://pattayapartypoolvilla.com",
  "http://pattayapartypoolvilla.com",
];

export type ImportedVilla = {
  name: string;
  location: string;
  beds: number;
  baths: number;
  description: string | null;
  mainVideoId: string | null;
  gallery: { label: string; area: string; imageUrls: string[] }[];
  accountingSummary: { period: string; revenue: string; profit: string }[];
  estimatedAnnualRevenue: number | null;
  sourceUrl: string;
};

type Booking = { book_checkin: string; book_checkout: string };
type Holiday = { start: string; end: string; price: number };

function isAllowedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const origin = `${u.protocol}//${u.host}`;
    return ALLOWED_ORIGINS.some((o) => origin === o);
  } catch {
    return false;
  }
}

export function validateImportUrl(url: string): { ok: boolean; error?: string } {
  const t = url.trim();
  if (!t) return { ok: false, error: "กรุณาระบุ URL" };
  if (!t.startsWith("http")) return { ok: false, error: "URL ต้องขึ้นต้นด้วย http หรือ https" };
  if (!isAllowedUrl(t))
    return { ok: false, error: "รองรับเฉพาะลิงก์จาก pattayapartypoolvilla.com" };
  return { ok: true };
}

function parseBookings(html: string): Booking[] {
  const out: Booking[] = [];
  const re =
    /book_checkin.*?(\d{4}-\d{2}-\d{2}).*?book_checkout.*?(\d{4}-\d{2}-\d{2})/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    out.push({ book_checkin: m[1], book_checkout: m[2] });
  }
  const seen = new Set<string>();
  return out.filter((b) => {
    const key = `${b.book_checkin}-${b.book_checkout}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseHolidays(html: string): Holiday[] {
  const out: Holiday[] = [];
  const re =
    /holiday_start.*?(\d{4}-\d{2}-\d{2}).*?holiday_end.*?(\d{4}-\d{2}-\d{2}).*?holiday_price.*?(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    out.push({
      start: m[1],
      end: m[2],
      price: parseInt(m[3], 10),
    });
  }
  return out;
}

function parseBasePrice(html: string): number[] | null {
  const re =
    /"base_price":\s*\{[^}]*"price_sun":(\d+)[^}]*"price_mon":(\d+)[^}]*"price_tue":(\d+)[^}]*"price_wed":(\d+)[^}]*"price_thu":(\d+)[^}]*"price_fri":(\d+)[^}]*"price_sat":(\d+)/;
  const m = html.match(re);
  if (!m) return null;
  return [1, 2, 3, 4, 5, 6, 7].map((i) => parseInt(m[i], 10));
}

function dateRange(startStr: string, endStr: string): Date[] {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const out: Date[] = [];
  const d = new Date(start);
  while (d < end) {
    out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function getPriceForDate(
  d: Date,
  basePrice: number[] | null,
  holidays: Holiday[],
): number | null {
  const ds = d.toISOString().slice(0, 10);
  for (const h of holidays) {
    if (h.start <= ds && ds <= h.end) return h.price;
  }
  if (basePrice) {
    const wd = d.getDay();
    return basePrice[wd];
  }
  return null;
}

const MONTH_NAMES: Record<number, string> = {
  1: "มกราคม",
  2: "กุมภาพันธ์",
  3: "มีนาคม",
  4: "เมษายน",
  5: "พฤษภาคม",
  6: "มิถุนายน",
  7: "กรกฎาคม",
  8: "สิงหาคม",
  9: "กันยายน",
  10: "ตุลาคม",
  11: "พฤศจิกายน",
  12: "ธันวาคม",
};

function computeIncomeByMonth(
  html: string,
): { period: string; revenue: string; profit: string }[] {
  const bookings = parseBookings(html);
  const holidays = parseHolidays(html);
  let basePrice = parseBasePrice(html);
  if (!basePrice) basePrice = [10900, 10900, 10900, 10900, 10900, 10900, 18900];

  const bookedDates = new Set<string>();
  for (const b of bookings) {
    const cin = b.book_checkin;
    const cout = b.book_checkout;
    if (cin && cout) {
      for (const d of dateRange(cin, cout)) {
        bookedDates.add(d.toISOString().slice(0, 10));
      }
    }
  }

  const byMonth: Record<string, { date: Date; price: number }[]> = {};
  const sortedDates = Array.from(bookedDates).sort();
  for (const ds of sortedDates) {
    const d = new Date(ds);
    const price = getPriceForDate(d, basePrice, holidays);
    if (price != null) {
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!byMonth[key]) byMonth[key] = [];
      byMonth[key].push({ date: d, price });
    }
  }

  const result: { period: string; revenue: string; profit: string }[] = [];
  for (const key of Object.keys(byMonth).sort()) {
    const [y, m] = key.split("-").map(Number);
    const rows = byMonth[key];
    const total = rows.reduce((s, r) => s + r.price, 0);
    const name = MONTH_NAMES[m] || String(m);
    result.push({
      period: `${name} ${y + 543}`,
      revenue: String(total),
      profit: String(total),
    });
  }
  return result;
}

/** ลบ HTML tags, entities, JSON/code ออก เหลือแค่ข้อความที่อ่านได้ */
function cleanSectionText(text: string): string {
  let t = text;
  // Strip HTML tags
  t = t.replace(/<[^>]+>/g, " ");
  // Decode common HTML entities
  t = t.replace(/&nbsp;/gi, " ");
  t = t.replace(/&amp;/gi, "&");
  t = t.replace(/&lt;/gi, "<");
  t = t.replace(/&gt;/gi, ">");
  t = t.replace(/&quot;/gi, '"');
  t = t.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  // Collapse whitespace
  t = t.replace(/\s+/g, " ").trim();
  // Strip trailing JSON/code artifacts
  t = t.replace(/\s*[\]"}\[,].*$/, "");
  t = t.replace(/^.*?["$\\]+\s*/, "");
  if (/["{}\[\]]/.test(t) && t.length > 100) {
    t = t.replace(/\s*\}.*$/, "").replace(/\s*\[.*$/, "");
  }
  return t.slice(0, 8000);
}

function getSectionText($: cheerio.CheerioAPI, id: string): string {
  const el = $(`#${id}`);
  if (!el.length) return "";
  el.find("script, style, button").remove();
  return cleanSectionText(el.text());
}

function getLocationOnly($: cheerio.CheerioAPI): string {
  const locEl = $("#location");
  if (!locEl.length) return "พัทยา";
  locEl.find("script, style, button").remove();
  const text = locEl.text().replace(/\s+/g, " ").trim();
  const lines = text.split(/\s*\n\s*/).filter(Boolean);
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "โลเคชั่น") continue;
    if (/["\]\}\],\[\$\\]/.test(trimmed)) break;
    if (trimmed.length > 200) break;
    result.push(trimmed);
  }
  return result.length ? result.join(" ") : "พัทยา";
}

const IMAGE_URL_RE =
  /https?:\/\/[^\s"'<>)\]]+\.(?:jpe?g|png|webp|gif)(?:\?[^\s"'<>)\]]*)?/gi;

/** ดึง array ของ URL รูปจาก string (script หรือ JSON) */
function extractImageUrlsFromText(block: string, baseUrl: string): string[] {
  const urls: string[] = [];
  let m: RegExpExecArray | null;
  IMAGE_URL_RE.lastIndex = 0;
  while ((m = IMAGE_URL_RE.exec(block)) !== null) {
    const u = m[0];
    if (/logo|icon|avatar|favicon|pixel|1x1|spacer/i.test(u)) continue;
    const full = u.startsWith("http") ? u : new URL(u, baseUrl).href;
    if (!urls.includes(full)) urls.push(full);
  }
  return urls;
}

const REVIEW_ZONES = new Set(["review"]);

/**
 * หารูปจาก script ของหน้าต้นทาง (Next.js RSC payload)
 * แต่ละรูปมี image_url และ image_zone (inside/outside/bedroom/bathroom/kitchen/review/cover)
 * แยก "review" ไว้กลุ่มรูปรีวิว ที่เหลือเป็นรูปที่พัก
 */
function extractGalleryFromScriptAndData(
  html: string,
  baseUrl: string,
): { accommodation: string[]; review: string[] } {
  const accommodation: string[] = [];
  const review: string[] = [];

  const scriptBlocks = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  const fullScript = scriptBlocks.join("\n");

  // Strategy 1: Parse image objects with image_url + image_zone from RSC/JSON payload
  // Handles escaped JSON like: \"image_url\":\"https://...\",... \"image_zone\":\"review\"
  const imageObjRe =
    /\\?"image_url\\?":\s*\\?"(https?:\/\/[^"\\]+\.(?:jpe?g|png|webp|gif)[^"\\]*)\\?"[^}]*?\\?"image_zone\\?":\s*\\?"([^"\\]+)\\?"/g;
  let m: RegExpExecArray | null;
  while ((m = imageObjRe.exec(fullScript)) !== null) {
    const url = m[1];
    const zone = m[2].toLowerCase();
    if (REVIEW_ZONES.has(zone)) {
      if (!review.includes(url)) review.push(url);
    } else {
      if (!accommodation.includes(url)) accommodation.push(url);
    }
  }

  // Also try reverse field order: image_zone before image_url
  if (accommodation.length === 0 && review.length === 0) {
    const reverseRe =
      /\\?"image_zone\\?":\s*\\?"([^"\\]+)\\?"[^}]*?\\?"image_url\\?":\s*\\?"(https?:\/\/[^"\\]+\.(?:jpe?g|png|webp|gif)[^"\\]*)\\?"/g;
    while ((m = reverseRe.exec(fullScript)) !== null) {
      const zone = m[1].toLowerCase();
      const url = m[2];
      if (REVIEW_ZONES.has(zone)) {
        if (!review.includes(url)) review.push(url);
      } else {
        if (!accommodation.includes(url)) accommodation.push(url);
      }
    }
  }

  // Strategy 2: If strategy 1 found nothing, fall back to generic image URL extraction
  if (accommodation.length === 0 && review.length === 0) {
    const allUrls = extractImageUrlsFromText(fullScript, baseUrl);
    if (allUrls.length >= 2) {
      const idxReview = fullScript.indexOf("ดูรูปรีวิว");
      if (idxReview >= 0) {
        const before = fullScript.slice(0, idxReview);
        const after = fullScript.slice(idxReview);
        const beforeUrls = extractImageUrlsFromText(before, baseUrl);
        const afterUrls = extractImageUrlsFromText(after, baseUrl);
        if (beforeUrls.length > 0) accommodation.push(...beforeUrls);
        if (afterUrls.length > 0) review.push(...afterUrls);
      } else {
        accommodation.push(...allUrls);
      }
    }
  }

  return {
    accommodation: Array.from(new Set(accommodation)),
    review: Array.from(new Set(review)),
  };
}

function extractVillaFromHtml(html: string, url: string): Partial<ImportedVilla> {
  const $ = cheerio.load(html);

  const accommodationText = getSectionText($, "accommodation");
  let name = "บ้านจากลิงก์";
  const codeMatch = accommodationText.match(/รหัสที่พัก\s*:\s*([^\s\n]+)/);
  let beds = 0;
  let baths = 0;
  const bedsMatch = accommodationText.match(/(\d+)\s*ห้องนอน/);
  const bathsMatch = accommodationText.match(/(\d+)\s*ห้องน้ำ/);
  if (bedsMatch) beds = parseInt(bedsMatch[1], 10);
  if (bathsMatch) baths = parseInt(bathsMatch[1], 10);
  if (codeMatch) {
    name = `${codeMatch[1].trim()} | ${beds || 0} ห้องนอน ${baths || 0} ห้องน้ำ`;
  } else {
    const titleText = $("title").text().trim().split("|")[0]?.trim();
    if (titleText) name = titleText.slice(0, 80);
  }

  const location = getLocationOnly($);

  // รายละเอียดบ้านตามที่ต้องการ: ห้องนอน ห้องน้ำ โลเคชั่น สระว่ายน้ำ ฟังก์ชั่นที่พัก ที่จอดรถ จำนวนที่นอน อุปกรณ์ในครัว วีดีโอที่พัก
  const descSectionIds = [
    "pool",
    "facilities",
    "park",
    "numberBeds",
    "Kitchenware",
  ] as const;
  const descSectionTitles: Record<string, string> = {
    pool: "สระว่ายน้ำ",
    facilities: "ฟังก์ชั่นที่พัก",
    park: "ที่จอดรถ",
    numberBeds: "จำนวนที่นอน",
    Kitchenware: "อุปกรณ์ในครัว",
  };
  const descParts: string[] = [];
  descParts.push(`【ห้องนอน / ห้องน้ำ】\n${beds} ห้องนอน ${baths} ห้องน้ำ`);
  descParts.push(`【โลเคชั่น】\n${location}`);
  for (const id of descSectionIds) {
    const text = getSectionText($, id);
    if (!text) continue;
    descParts.push(`【${descSectionTitles[id]}】\n${text.slice(0, 1500)}`);
  }
  const description =
    descParts.length > 0 ? descParts.join("\n\n") : null;

  let mainVideoId: string | null = null;
  $("#accommodationVideos iframe[src*='youtube.com/embed/']").each((_, el) => {
    const src = $(el).attr("src");
    const m = src?.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (m && !mainVideoId) mainVideoId = m[1];
  });

  // ดึงรูปจาก "ดูรูปที่พัก" และ "ดูรูปรีวิว" (อยู่ใน script หรือ data-* ไม่ดึงจาก img ทั่วหน้า)
  const { accommodation: urlsAccommodation, review: urlsReview } =
    extractGalleryFromScriptAndData(html, url);
  const gallery: { label: string; area: string; imageUrls: string[] }[] = [];
  if (urlsAccommodation.length > 0) {
    gallery.push({ label: "รูปที่พัก", area: "", imageUrls: urlsAccommodation });
  }
  if (urlsReview.length > 0) {
    gallery.push({ label: "รูปรีวิว", area: "", imageUrls: urlsReview });
  }

  const accountingSummary = computeIncomeByMonth(html);
  let estimatedAnnualRevenue: number | null = null;
  if (accountingSummary.length > 0) {
    const total = accountingSummary.reduce(
      (s, r) => s + parseInt(r.revenue, 10) || 0,
      0,
    );
    const years = new Set(accountingSummary.map((r) => r.period.split(" ")[1]));
    estimatedAnnualRevenue =
      years.size > 0 ? Math.round(total / years.size) : total;
  }

  return {
    name,
    location: location.slice(0, 300),
    beds: beds || 1,
    baths: baths || 1,
    description,
    mainVideoId,
    gallery,
    accountingSummary,
    estimatedAnnualRevenue,
    sourceUrl: url,
  };
}

export async function fetchAndParseVilla(url: string): Promise<ImportedVilla> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "th-TH,th;q=0.9,en;q=0.8",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

  if (!res.ok) {
    throw new Error(`โหลดหน้าไม่สำเร็จ (${res.status})`);
  }

  const html = await res.text();
  const partial = extractVillaFromHtml(html, url);

  return {
    name: partial.name ?? "บ้านจากลิงก์",
    location: partial.location ?? "พัทยา",
    beds: partial.beds ?? 1,
    baths: partial.baths ?? 1,
    description: partial.description ?? null,
    mainVideoId: partial.mainVideoId ?? null,
    gallery: partial.gallery ?? [],
    accountingSummary: partial.accountingSummary ?? [],
    estimatedAnnualRevenue: partial.estimatedAnnualRevenue ?? null,
    sourceUrl: partial.sourceUrl ?? url,
  };
}
