import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkAdminAuth } from "../auth";

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "20"));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { customerEmail: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { orderNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Admin orders DB error:", error?.message);
    return NextResponse.json({
      success: true,
      orders: [],
      pagination: { page, limit, total: 0, pages: 1 },
      notice: error?.message?.includes("Server selection timeout")
        ? "MongoDB Atlas IP access restricted. Add IP 0.0.0.0/0 in MongoDB Atlas Network Access to view live database records."
        : error?.message,
    });
  }
}

export async function PATCH(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "orderId and status are required" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
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
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
