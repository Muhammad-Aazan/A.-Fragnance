import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkAdminAuth } from "../auth";

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "20"));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (productId) where.productId = productId;

  try {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Admin reviews DB error:", error?.message);
    return NextResponse.json({
      success: true,
      reviews: [],
      pagination: { page, limit, total: 0, pages: 1 },
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
  if (!id) {
    return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
  }

  try {
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete review" },
      { status: 500 }
    );
  }
}
