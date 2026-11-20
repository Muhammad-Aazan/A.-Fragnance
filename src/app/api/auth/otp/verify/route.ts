import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, code, type = "CHECKOUT", customerName, password } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();

    // Look for active matching OTP in MongoDB
    const otpRecord = await prisma.emailOtp.findFirst({
      where: {
        email: normalizedEmail,
        code: cleanCode,
        type,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired verification code. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // Delete used OTP
    await prisma.emailOtp.delete({
      where: { id: otpRecord.id },
    });

    // For checkout type: ensure user exists or create them seamlessly
    let userRecord = null;
    if (type === "CHECKOUT") {
      userRecord = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (!userRecord) {
        const hashedPassword = await bcrypt.hash(password || "Patron2026!", 10);
        const nameToUse = customerName || normalizedEmail.split("@")[0];
        const newUser = await prisma.user.create({
          data: {
            name: nameToUse,
            email: normalizedEmail,
            password: hashedPassword,
            role: "CUSTOMER",
          },
        });
        userRecord = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        };
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      user: userRecord,
      message: "Email address verified successfully.",
    });
  } catch (error: any) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify security code" },
      { status: 500 }
    );
  }
}
