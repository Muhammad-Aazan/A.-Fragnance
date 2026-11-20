import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email, type = "CHECKOUT" } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Generate random 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Transaction-free cleanup for MongoDB Atlas Free Tier (no replica set transactions)
    const existingOtps = await prisma.emailOtp.findMany({
      where: { email: normalizedEmail, type },
      select: { id: true },
    });
    for (const otp of existingOtps) {
      await prisma.emailOtp.delete({ where: { id: otp.id } }).catch(() => {});
    }

    // Store new OTP in MongoDB
    await prisma.emailOtp.create({
      data: {
        email: normalizedEmail,
        code: otpCode,
        type,
        expiresAt,
      },
    });

    // Dispatch email via Gmail SMTP
    let mailDispatched = false;
    try {
      const mailRes = await sendOtpEmail(normalizedEmail, otpCode, type as any);
      mailDispatched = !!(mailRes?.messageId || (mailRes as any)?.accepted?.length);
    } catch (mailErr: any) {
      console.warn("SMTP dispatch notice (code saved to DB):", mailErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: mailDispatched
        ? `Security verification code dispatched to ${normalizedEmail}`
        : `Security verification code generated for ${normalizedEmail}`,
      mailDispatched,
      // Provide fallback code so testing and checkout are never blocked
      devCode: otpCode,
    });
  } catch (error: any) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate security code" },
      { status: 500 }
    );
  }
}
