export default function AdminVillasPage() {
  return (
    <div className="w-full min-w-0">
      <div className="mb-6 md:mb-8">
        <h1 className="font-bold text-xl md:text-2xl text-navy">จัดการพูลวิลล่า</h1>
        <p className="text-gray-600 mt-1 md:text-base">
          เพิ่ม แก้ไข ซ่อน หรือจัดเรียงพูลวิลล่าที่แสดงบนหน้าเว็บไซต์
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
        <p className="text-gray-600 text-sm md:text-base">
          (โครงสร้างเบื้องต้น) ในหน้านี้คุณสามารถเพิ่มรายการบ้านใหม่ แก้ไขข้อมูลบ้านเดิม
          และจัดการสถานะแสดง/ซ่อนของบ้านแต่ละหลังได้
        </p>
      </div>
    </div>
  );
}

