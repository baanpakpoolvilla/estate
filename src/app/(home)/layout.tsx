import type { ReactNode } from "react";

/** Route group สำหรับหน้าแรก — ไม่เปลี่ยน URL (ยังเป็น /) */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
