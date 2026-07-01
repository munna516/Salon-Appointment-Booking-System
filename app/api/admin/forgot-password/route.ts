import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      // Return success anyway to prevent email enumeration attacks
      return NextResponse.json({ success: true, message: "If your email is registered, you will receive an OTP." });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // OTP expires in 10 minutes
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.admin.update({
      where: { email },
      data: {
        resetOtp: otp,
        resetOtpExpiry: expiry,
      },
    });

    // Send OTP via email using Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Salon Admin" <noreply@salon.com>',
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6b21a8;">Reset Your Password</h2>
          <p>You requested a password reset for your Salon Admin account.</p>
          <p>Your 6-digit verification code is:</p>
          <h1 style="background: #f3e8ff; padding: 10px 20px; display: inline-block; border-radius: 8px; letter-spacing: 5px; color: #6b21a8;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);

    return NextResponse.json({ success: true, message: "OTP generated successfully." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
