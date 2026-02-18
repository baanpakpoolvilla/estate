import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-navy text-white mt-auto">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-6 md:space-y-8">
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {/* แบรนด์และข้อความสั้น */}
          <div className="space-y-2">
            <p className="font-semibold text-lg md:text-xl">Pool Villa Estate</p>
            <p className="text-white/80 text-sm md:text-base">
              ที่ปรึกษาการลงทุนพูลวิลล่าที่เชี่ยวชาญด้านบ้านพร้อมปล่อยเช่า
              เข้าถึงดีลที่คนทั่วไปไม่สามารถเข้าถึงได้
            </p>
          </div>

          {/* ลิงก์นำทาง */}
          <div className="space-y-2 text-sm md:text-base">
            <p className="font-semibold text-white">เมนูหลัก</p>
            <div className="flex flex-col gap-1 mt-1">
              <Link href="/" className="text-white/85 hover:text-white">
                หน้าแรก
              </Link>
              <Link href="/villas" className="text-white/85 hover:text-white">
                รายการบ้าน
              </Link>
              <Link href="/investment" className="text-white/85 hover:text-white">
                ลงทุนกับเรา
              </Link>
              <Link href="/contact" className="text-white/85 hover:text-white">
                ติดต่อทีมงาน
              </Link>
            </div>
          </div>

          {/* ข้อมูลติดต่อสั้นๆ */}
          <div className="space-y-2 text-sm md:text-base">
            <p className="font-semibold text-white">ติดต่อ</p>
            <p className="text-white/85">
              โทร: <a href="tel:0812345678" className="hover:text-white">081-234-5678</a>
            </p>
            <p className="text-white/85">
              อีเมล:{" "}
              <a href="mailto:info@poolvilla-estate.com" className="hover:text-white">
                info@poolvilla-estate.com
              </a>
            </p>
            <p className="text-white/85">
              Line:{" "}
              <a
                href="https://line.me/ti/p/xxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                เพิ่มเพื่อน Line
              </a>
            </p>
            <Link
              href="/contact"
              className="inline-block mt-2 px-4 py-2 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-light"
            >
              ปรึกษาทีมงาน / ขอข้อมูลเพิ่ม
            </Link>
          </div>
        </div>

        <div className="border-t border-white/15 pt-4 md:pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-white/60 text-xs md:text-sm">
            © {new Date().getFullYear()} Pool Villa Estate. All rights reserved.
          </p>
          <p className="text-white/50 text-xs md:text-sm">
            ข้อมูลบนเว็บไซต์นี้มีวัตถุประสงค์เพื่อการนำเสนอเบื้องต้นเท่านั้น รายละเอียดการลงทุนจริงเป็นไปตามสัญญา
          </p>
        </div>
      </div>
    </footer>
  );
}
