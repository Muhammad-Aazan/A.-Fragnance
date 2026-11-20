import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkAdminAuth } from "../auth";

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: any = {};
  if (status === "UNREAD" || status === "READ") where.status = status;

  try {
    const inquiries = await prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    console.error("Admin inquiries DB error:", error?.message);
    return NextResponse.json({
      success: true,
      inquiries: [],
      notice: error?.message?.includes("Server selection timeout")
        ? "MongoDB Atlas IP access restricted. Add IP 0.0.0.0/0 in MongoDB Atlas Network Access."
        : error?.message,
    });
  }
}

export async function PATCH(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: "id and status are required" }, { status: 400 });
    }

    const inquiry = await prisma.contactInquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
  }

  try {
    await prisma.contactInquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
