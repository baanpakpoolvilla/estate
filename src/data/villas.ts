export type VillaListItem = {
  id: string;
  name: string;
  location: string;
  price: string;
  roi: string;
  beds: number;
  baths: number;
  sqm: number;
  profitMonthly: string;
  mainVideoId: string;
  tag?: "พร้อมผู้เช่า" | "Pre-sale" | "จองล่วงหน้า";
};

export const villasList: VillaListItem[] = [
  {
    id: "1",
    name: "วิลล่า บีช 101",
    location: "หาดบางแสน",
    price: "12.9",
    roi: "8.5",
    beds: 4,
    baths: 4,
    sqm: 280,
    profitMonthly: "฿80,000",
    mainVideoId: "dQw4w9WgXcQ",
    tag: "พร้อมผู้เช่า",
  },
  {
    id: "2",
    name: "วิลล่า ฮิลล์ 202",
    location: "เขาใหญ่",
    price: "15.5",
    roi: "9.2",
    beds: 5,
    baths: 5,
    sqm: 320,
    profitMonthly: "฿95,000",
    mainVideoId: "dQw4w9WgXcQ",
    tag: "Pre-sale",
  },
  {
    id: "3",
    name: "วิลล่า เลค 303",
    location: "พัทยา",
    price: "14.2",
    roi: "8.8",
    beds: 4,
    baths: 4,
    sqm: 300,
    profitMonthly: "฿72,000",
    mainVideoId: "dQw4w9WgXcQ",
    tag: "พร้อมผู้เช่า",
  },
  {
    id: "4",
    name: "วิลล่า ซันเซ็ต 404",
    location: "หัวหิน",
    price: "18.0",
    roi: "9.5",
    beds: 6,
    baths: 6,
    sqm: 380,
    profitMonthly: "฿125,000",
    mainVideoId: "dQw4w9WgXcQ",
    tag: "จองล่วงหน้า",
  },
];
