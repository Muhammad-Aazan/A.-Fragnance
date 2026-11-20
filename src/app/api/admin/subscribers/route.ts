import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkAdminAuth } from "../auth";

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, subscribers, total: subscribers.length });
  } catch (error: any) {
    console.error("Admin subscribers DB error:", error?.message);
    return NextResponse.json({
      success: true,
      subscribers: [],
      total: 0,
      notice: error?.message?.includes("Server selection timeout")
        ? "MongoDB Atlas IP access restricted. Add IP 0.0.0.0/0 in MongoDB Atlas Network Access."
        : error?.message,
    });
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  if (!id && !email) {
    return NextResponse.json({ success: false, error: "id or email is required" }, { status: 400 });
  }

  try {
    if (id) {
      await prisma.newsletterSubscriber.delete({ where: { id } });
    } else {
      // Delete by email — find first, then delete by id (Atlas Free Tier safe)
      const subscriber = await prisma.newsletterSubscriber.findFirst({
        where: { email: email! },
        select: { id: true },
      });
      if (!subscriber) {
        return NextResponse.json({ success: false, error: "Subscriber not found" }, { status: 404 });
      }
      await prisma.newsletterSubscriber.delete({ where: { id: subscriber.id } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
