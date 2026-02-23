#!/usr/bin/env python3
"""
ดึงข้อมูลจาก pattayapartypoolvilla.com/105/2564
แล้วคำนวณ ราคาที่พักของวันที่ถูกจองไปแล้ว แยกแต่ละเดือน

ราคาขึ้นเมื่อกดคลิกที่วันในปฏิทิน = ใช้ base_price (ตามวันในสัปดาห์) หรือ holiday_price (ช่วงวันหยุด/ราคาพิเศษ)
"""

import re
import json
from datetime import datetime, timedelta
from urllib.request import urlopen
from collections import defaultdict

URL = "https://www.pattayapartypoolvilla.com/105/2564"


def fetch_page():
    with urlopen(URL, timeout=15) as r:
        return r.read().decode("utf-8", errors="replace")


def parse_bookings(html):
    """ดึง book_checkin / book_checkout จาก HTML"""
    out = []
    for m in re.finditer(
        r"book_checkin.*?(\d{4}-\d{2}-\d{2}).*?book_checkout.*?(\d{4}-\d{2}-\d{2})",
        html,
    ):
        out.append({"book_checkin": m.group(1), "book_checkout": m.group(2)})
    # Deduplicate by (checkin, checkout)
    seen = set()
    unique = []
    for b in out:
        key = (b["book_checkin"], b["book_checkout"])
        if key not in seen:
            seen.add(key)
            unique.append(b)
    return unique


def parse_holidays(html):
    """ดึง holidays array จาก HTML"""
    out = []
    for m in re.finditer(
        r"holiday_start.*?(\d{4}-\d{2}-\d{2}).*?"
        r"holiday_end.*?(\d{4}-\d{2}-\d{2}).*?"
        r"holiday_price.*?(\d+)",
        html,
    ):
        out.append(
            {
                "start": m.group(1),
                "end": m.group(2),
                "price": int(m.group(3)),
            }
        )
    return out


def parse_base_price(html):
    """ดึง base_price (ราคาต่อวันตามวันในสัปดาห์) จาก HTML"""
    m = re.search(
        r'"base_price":\s*\{'
        r'"price_sun":(\d+).*?"price_mon":(\d+).*?"price_tue":(\d+).*?"price_wed":(\d+)'
        r'.*?"price_thu":(\d+).*?"price_fri":(\d+).*?"price_sat":(\d+)',
        html,
    )
    if not m:
        return None
    return [int(m.group(i)) for i in range(1, 8)]


def date_range(start_str, end_str):
    """สร้าง list ของวันที่ ตั้งแต่ check-in ถึงก่อน check-out (คืนที่พัก = วันที่เช็คอินเท่านั้น ไม่รวมวันเช็คเอาท์)"""
    start = datetime.strptime(start_str, "%Y-%m-%d").date()
    end = datetime.strptime(end_str, "%Y-%m-%d").date()
    out = []
    d = start
    while d < end:
        out.append(d)
        d += timedelta(days=1)
    return out


def get_price_for_date(d, base_price, holidays):
    """คำนวณราคาคืนนั้นจาก base_price (วันในสัปดาห์) หรือ holiday"""
    ds = d.strftime("%Y-%m-%d")
    for h in holidays:
        if h["start"] <= ds <= h["end"]:
            return h["price"]
    if base_price:
        wd = d.weekday()
        return base_price[(wd + 1) % 7]
    return None


def main():
    print("กำลังโหลดหน้าเว็บ...")
    html = fetch_page()

    bookings = parse_bookings(html)

    holidays = parse_holidays(html)
    base_price = parse_base_price(html)

    if not base_price:
        base_price = [10900, 10900, 10900, 10900, 10900, 10900, 18900]

    # รวมทุกวันที่ถูกจอง (แต่ละคืน)
    booked_dates = set()
    for b in bookings:
        cin = b.get("book_checkin") or b.get("book_checkin")
        cout = b.get("book_checkout") or b.get("book_checkout")
        if cin and cout:
            for d in date_range(cin, cout):
                booked_dates.add(d)

    # คำนวณราคาแต่ละวัน แล้วจัดตามเดือน
    by_month = defaultdict(list)
    for d in sorted(booked_dates):
        price = get_price_for_date(d, base_price, holidays)
        if price is not None:
            by_month[(d.year, d.month)].append((d, price))

    # แสดงผล
    month_names = {
        1: "มกราคม", 2: "กุมภาพันธ์", 3: "มีนาคม", 4: "เมษายน", 5: "พฤษภาคม",
        6: "มิถุนายน", 7: "กรกฎาคม", 8: "สิงหาคม", 9: "กันยายน", 10: "ตุลาคม",
        11: "พฤศจิกายน", 12: "ธันวาคม",
    }
    print("\n" + "=" * 60)
    print("DV-2564 | ราคาที่พักของวันที่ถูกจองไปแล้ว แยกแต่ละเดือน")
    print("=" * 60)

    for (year, month) in sorted(by_month.keys()):
        rows = by_month[(year, month)]
        total = sum(p for _, p in rows)
        name = month_names.get(month, str(month))
        print(f"\n📅 {name} {year + 543} (ค.ศ. {year})")
        print("-" * 50)
        for d, price in rows:
            print(f"   {d.strftime('%d/%m/%Y')}  →  {price:,} บาท/คืน")
        print(f"   รวม {len(rows)} คืน  =  {total:,} บาท")

    if not by_month:
        print("\nไม่พบช่วงวันที่ถูกจองในข้อมูลที่ดึงได้ (ลองเปิดลิงก์ในเบราว์เซอร์แล้วรันใหม่)")

    print()


if __name__ == "__main__":
    main()
