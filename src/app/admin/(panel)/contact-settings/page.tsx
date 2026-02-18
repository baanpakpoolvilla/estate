export default function AdminContactSettingsPage() {
  return (
    <div className="w-full min-w-0">
      <div className="mb-6 md:mb-8">
        <h1 className="font-bold text-xl md:text-2xl text-navy">ตั้งค่าช่องทางติดต่อ</h1>
        <p className="text-gray-600 mt-1 md:text-base">
          แก้ไขเบอร์โทร อีเมล Line และที่อยู่ที่ใช้แสดงบนเว็บไซต์
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
        <p className="text-gray-600 text-sm md:text-base">
          (โครงสร้างเบื้องต้น) ในหน้านี้คุณสามารถกำหนดหรือแก้ไขช่องทางติดต่อหลักที่จะแสดงบน Header, Footer
          และหน้าติดต่อเราได้ เช่น เบอร์โทร อีเมล Line และที่อยู่โครงการ
        </p>
      </div>
    </div>
  );
}

