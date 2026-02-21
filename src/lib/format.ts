/**
 * แปลงราคาจากหน่วยล้านบาท (เช่น "12.9") เป็นจำนวนเต็มมี comma (เช่น "12,900,000")
 */
export function formatPrice(millionStr: string): string {
  const num = parseFloat(millionStr);
  if (isNaN(num)) return millionStr;
  const full = Math.round(num * 1_000_000);
  return full.toLocaleString("en-US");
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
