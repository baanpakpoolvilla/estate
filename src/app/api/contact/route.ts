import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, interest, message } = body;

    if (!name?.trim() || !phone?.trim() || !interest?.trim()) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลที่จำเป็น" },
        { status: 400 },
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        interest: interest.trim(),
        message: message?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (e) {
    console.error("Contact inquiry error:", e);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      { status: 500 },
    );
  }
}
