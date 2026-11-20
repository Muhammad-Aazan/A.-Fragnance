import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        message,
        status: "UNREAD",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been received. The house will attend to your enquiry within 24 hours.",
      inquiryId: inquiry.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
