import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Please provide your registered email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Return ambiguous success for security
      return NextResponse.json({
        success: true,
        message: "If that address is registered, password reset instructions have been dispatched.",
      });
    }

    // 6-digit numeric OTP code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetExpiry,
      },
    });

    // Also record in EmailOtp
    // Transaction-free cleanup for MongoDB Atlas Free Tier (no replica set transactions)
    const existingOtps = await prisma.emailOtp.findMany({
      where: { email: normalizedEmail, type: "FORGOT_PASSWORD" },
      select: { id: true },
    });
    for (const otp of existingOtps) {
      await prisma.emailOtp.delete({ where: { id: otp.id } }).catch(() => {});
    }
    await prisma.emailOtp.create({
      data: {
        email: normalizedEmail,
        code: resetToken,
        type: "FORGOT_PASSWORD",
        expiresAt: resetExpiry,
      },
    });

    // Send email using SMTP credentials
    const mailResult = await sendOtpEmail(user.email, resetToken, "FORGOT_PASSWORD");

    return NextResponse.json({
      success: true,
      message: "Reset instructions and 6-digit code dispatched to your email address.",
      token: resetToken,
      mailDispatched: mailResult.success,
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
