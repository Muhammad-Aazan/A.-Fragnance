import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkAdminAuth } from "../auth";
import { collections as fallbackCollections } from "@/lib/products";

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const collections = await prisma.collection.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, collections });
  } catch (error: any) {
    console.error("Admin collections DB error:", error?.message);
    return NextResponse.json({
      success: true,
      collections: fallbackCollections,
      notice: error?.message?.includes("Server selection timeout")
        ? "MongoDB Atlas IP access restricted. Add IP 0.0.0.0/0 in MongoDB Atlas Network Access."
        : error?.message,
    });
  }
}

export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, name, tagline, description, image } = body;

    if (!slug || !name) {
      return NextResponse.json({ success: false, error: "slug and name are required" }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: { slug, name, tagline, description, image },
    });

    return NextResponse.json({ success: true, collection }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create collection" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...fields } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: fields,
    });

    return NextResponse.json({ success: true, collection });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update collection" },
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
    await prisma.collection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete collection" },
      { status: 500 }
    );
  }
}
