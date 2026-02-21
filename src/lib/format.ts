/**
 * แปลงราคาจากหน่วยล้านบาท (เช่น "12.9") เป็นจำนวนเต็มมี comma (เช่น "12,900,000")
 */
export function formatPrice(millionStr: string): string {
  const num = parseFloat(millionStr);
  if (isNaN(num)) return millionStr;
  const full = Math.round(num * 1_000_000);
  return full.toLocaleString("en-US");
}
