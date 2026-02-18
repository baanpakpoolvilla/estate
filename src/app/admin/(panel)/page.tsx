import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="w-full min-w-0">
      <div className="mb-6 md:mb-8">
        <h1 className="font-bold text-xl md:text-2xl text-navy">แดชบอร์ดผู้ดูแลระบบ</h1>
        <p className="text-gray-600 mt-1 md:text-base">
          จัดการข้อมูลพูลวิลล่า โครงการโฆษณา และช่องทางติดต่อของ Pool Villa Estate
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        <section className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy mb-2 md:text-lg">จัดการพูลวิลล่า</h2>
          <p className="text-gray-600 text-sm md:text-base mb-3">
            เพิ่ม/แก้ไขข้อมูลบ้าน ภาพ วิดีโอ ประวัติการเช่า และตัวเลขการลงทุน
          </p>
          <Link href="/admin/villas" className="text-blue text-sm font-medium hover:underline">
            ไปที่จัดการพูลวิลล่า
          </Link>
        </section>

        <section className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy mb-2 md:text-lg">จัดการโฆษณา/โครงการ</h2>
          <p className="text-gray-600 text-sm md:text-base mb-3">
            ตั้งค่าโครงการพูลวิลล่าหรู โครงการใหม่ และแบนเนอร์ที่แสดงบนหน้าแรก
          </p>
          <Link href="/admin/projects" className="text-blue text-sm font-medium hover:underline">
            ไปที่จัดการโฆษณา
          </Link>
        </section>

        <section className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy mb-2 md:text-lg">ช่องทางติดต่อ</h2>
          <p className="text-gray-600 text-sm md:text-base mb-3">
            แก้ไขเบอร์โทร อีเมล Line และที่อยู่ที่ใช้แสดงบนเว็บไซต์
          </p>
          <Link href="/admin/contact-settings" className="text-blue text-sm font-medium hover:underline">
            ไปที่ตั้งค่าช่องทางติดต่อ
          </Link>
        </section>
      </div>
    </div>
  );
}

