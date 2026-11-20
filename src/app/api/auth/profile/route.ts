import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
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
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Patron not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, address, city, country, postalCode } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { email: email.toLowerCase().trim() },
      data: {
        name: name !== undefined ? name : undefined,
        phone: phone !== undefined ? phone : undefined,
        address: address !== undefined ? address : undefined,
        city: city !== undefined ? city : undefined,
        country: country !== undefined ? country : undefined,
        postalCode: postalCode !== undefined ? postalCode : undefined,
      },
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
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Profile and delivery address updated successfully.",
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
