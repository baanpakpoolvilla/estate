export default function AdminProjectsPage() {
  return (
    <div className="w-full min-w-0">
      <div className="mb-6 md:mb-8">
        <h1 className="font-bold text-xl md:text-2xl text-navy">จัดการโฆษณา / โครงการแนะนำ</h1>
        <p className="text-gray-600 mt-1 md:text-base">
          ตั้งค่าโครงการพูลวิลล่าหรู โครงการใหม่ และแบนเนอร์ที่แสดงบนหน้าแรก
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
        <p className="text-gray-600 text-sm md:text-base">
          (โครงสร้างเบื้องต้น) ในหน้านี้คุณสามารถเพิ่ม แก้ไข หรือลบโครงการที่ใช้โปรโมตบนหน้าเว็บไซต์
          และกำหนดลำดับการแสดงผลของแต่ละโครงการได้
        </p>
      </div>
    </div>
  );
}

