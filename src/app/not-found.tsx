import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-w-0 flex flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-bold text-navy/20 mb-4">404</p>
      <h1 className="text-xl md:text-2xl font-bold text-navy mb-2">ไม่พบหน้าที่คุณต้องการ</h1>
      <p className="text-gray-500 text-sm md:text-base mb-8">
        หน้านี้อาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่ในระบบ
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-blue text-white font-semibold text-sm hover:bg-blue-light transition"
        >
          กลับหน้าแรก
        </Link>
        <Link
          href="/villas"
          className="px-6 py-3 rounded-xl border border-gray-200 text-navy font-semibold text-sm hover:bg-gray-50 transition"
        >
          ดูรายการบ้าน
        </Link>
      </div>
    </div>
  );
}
