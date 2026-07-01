import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin || !admin.resetOtp || !admin.resetOtpExpiry) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (admin.resetOtp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > admin.resetOtpExpiry) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
