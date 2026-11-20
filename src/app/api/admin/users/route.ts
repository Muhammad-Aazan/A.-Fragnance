import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkAdminAuth } from "../auth";

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "20"));
  const search = searchParams.get("search");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          address: true,
          city: true,
          country: true,
          postalCode: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Admin users DB error:", error?.message);
    return NextResponse.json({
      success: true,
      users: [],
      pagination: { page, limit, total: 0, pages: 1 },
      notice: error?.message?.includes("Server selection timeout")
        ? "MongoDB Atlas IP access restricted. Add IP 0.0.0.0/0 in MongoDB Atlas Network Access."
        : error?.message,
    });
  }
}

export async function PUT(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, role, ...rest } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    }

    const data: any = {};
    if (role !== undefined) data.role = role;

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user" },
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
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
