import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or passphrase" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or passphrase" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to log in" },
      { status: 500 }
    );
  }
}
