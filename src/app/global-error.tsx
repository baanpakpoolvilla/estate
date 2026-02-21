"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="th">
      <body style={{ backgroundColor: "#F5F7FA", color: "#0B1F3B", fontFamily: "sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>เกิดข้อผิดพลาดร้ายแรง</h1>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>ขออภัย ระบบเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง</p>
          <button
            onClick={reset}
            style={{ padding: "0.75rem 1.5rem", borderRadius: "0.75rem", backgroundColor: "#1E88E5", color: "white", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: "pointer" }}
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </body>
    </html>
  );
}
