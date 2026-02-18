import Link from "next/link";

type ConsultCTAProps = {
  variant?: "sticky" | "inline";
  className?: string;
};

export default function ConsultCTA({ variant = "sticky", className = "" }: ConsultCTAProps) {
  const base = "flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-blue border border-blue";
  const isSticky = variant === "sticky";

  return (
    <div
      className={
        isSticky
          ? `fixed bottom-20 left-0 right-0 z-30 px-4 md:px-6 md:bottom-20 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-xl lg:max-w-2xl ${className}`
          : className
      }
    >
      <Link
        href="/contact"
        className={`block w-full text-center ${base} ${isSticky ? "shadow-lg" : ""}`}
      >
        ปรึกษาทีมงาน / สอบถามข้อมูลเพิ่มเติม
      </Link>
    </div>
  );
}
