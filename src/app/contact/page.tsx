"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="w-full min-w-0 max-w-3xl">
      <div className="mb-6 md:mb-8">
        <h1 className="font-bold text-xl md:text-2xl text-navy">ติดต่อทีมงาน Pool Villa Estate</h1>
        <p className="text-gray-600 mt-1 md:text-base">
          สำหรับนักลงทุนที่ต้องการข้อมูลเชิงลึก หรือนัดหมายดูบ้านแต่ละหลัง
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* ช่องทางติดต่อด่วน + ข้อมูลโครงการ */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3">
            <a
              href="tel:0812345678"
              className="flex items-center justify-center gap-2 py-3 md:py-3.5 rounded-xl bg-blue text-white font-medium text-sm md:text-base"
            >
              โทรคุยกับทีมงาน
            </a>
            <a
              href="https://line.me/ti/p/xxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 md:py-3.5 rounded-xl bg-[#06C755] text-white font-medium text-sm md:text-base"
            >
              ติดต่อผ่าน Line
            </a>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 space-y-3">
            <h2 className="font-semibold text-navy text-sm md:text-base">
              เหมาะสำหรับการติดต่อในกรณี
            </h2>
            <ul className="text-gray-700 text-sm md:text-base space-y-1 list-disc list-inside">
              <li>ต้องการรายละเอียดการลงทุนของบ้านแต่ละหลัง</li>
              <li>ต้องการดูประมาณการ ROI / รายรับ–รายจ่ายจริง</li>
              <li>ต้องการนัดดูบ้าน หรือนัดคุยแบบตัวต่อตัว</li>
              <li>มีพูลวิลล่าที่ต้องการให้เราช่วยบริหารหรือช่วยขาย</li>
            </ul>
            <p className="text-gray-500 text-xs md:text-sm">
              ทีมงานจะติดต่อกลับภายใน 1 วันทำการหลังได้รับข้อมูลของคุณ
            </p>
          </div>

          <div className="bg-offwhite rounded-2xl p-4 md:p-5">
            <h2 className="font-semibold text-navy mb-2 md:text-base">ที่อยู่โครงการ (ตัวอย่าง)</h2>
            <p className="text-gray-600 text-sm md:text-base">
              (ใส่ที่อยู่จริงของโครงการ หรือสำนักงาน และลิงก์ Google Map)
            </p>
          </div>
        </section>

        {/* ฟอร์มส่งข้อความ */}
        <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-navy mb-3 md:text-lg">ส่งข้อมูลให้ทีมงานติดต่อกลับ</h2>
          {sent ? (
            <p className="text-gray-600 text-sm md:text-base py-4 text-center">
              ส่งข้อมูลเรียบร้อย ทีมงานจะติดต่อกลับภายใน 1 วันทำการ
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs md:text-sm text-gray-700">
                  ชื่อ–นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="เช่น คุณสมชาย นักลงทุน"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs md:text-sm text-gray-700">
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="กรอกเบอร์ที่สะดวกรับสาย"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs md:text-sm text-gray-700">อีเมล</label>
                <input
                  type="email"
                  placeholder="หากสะดวกให้ติดต่อกลับทางอีเมล"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs md:text-sm text-gray-700">
                  ความสนใจหลักของคุณ <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy"
                  required
                >
                  <option value="">เลือกความสนใจ</option>
                  <option value="buy">สนใจซื้อ/ร่วมลงทุนพูลวิลล่า</option>
                  <option value="info">ต้องการข้อมูลตัวเลขการลงทุนเพิ่มเติม</option>
                  <option value="visit">ต้องการนัดดูบ้าน/ดูโครงการ</option>
                  <option value="manage">มีบ้านต้องการให้ช่วยบริหารหรือช่วยขาย</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs md:text-sm text-gray-700">รายละเอียดเพิ่มเติม</label>
                <textarea
                  placeholder="ระบุงบประมาณ ทำเลที่สนใจ หรือบ้านหลังที่ต้องการทราบรายละเอียดเพิ่มเติม"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-navy text-white font-semibold"
              >
                ส่งข้อมูลให้ทีมงานติดต่อกลับ
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
