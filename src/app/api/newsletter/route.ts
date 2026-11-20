import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You are already an esteemed member of the inner circle.",
      });
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json({
      success: true,
      message: "Welcome to the Inner Circle. Private invitations will be sent to your inbox.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}
