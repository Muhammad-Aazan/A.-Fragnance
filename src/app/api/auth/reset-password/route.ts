import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email, token, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanToken = token.toString().trim();

    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        resetToken: cleanToken,
        resetExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Passphrase successfully updated. You may now sign in.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}
