/**
 * แปลงราคาเต็มจำนวน (เช่น "20500000") เป็นรูปแบบมี comma (เช่น "20,500,000")
 */
export function formatPrice(value: string): string {
  const cleaned = String(value).replace(/,/g, "").trim();
  const num = parseFloat(cleaned);
  if (isNaN(num)) return value;
  return Math.round(num).toLocaleString("en-US");
}

/**
 * แปลงตัวเลข/สตริงตัวเลข (มีหรือไม่มี comma) เป็นรูปแบบมี comma อ่านง่าย
 * เช่น "150000" → "150,000", "1,500,000" → "1,500,000", "95000.5" → "95,001"
 */
export function formatNumber(value: string | number): string {
  const cleaned = String(value).replace(/,/g, "").trim();
  const num = parseFloat(cleaned);
  if (isNaN(num)) return String(value);
  return Math.round(num).toLocaleString("en-US");
}
