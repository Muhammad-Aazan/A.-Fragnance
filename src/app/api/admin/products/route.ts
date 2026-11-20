import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkAdminAuth } from "../auth";
import { products as fallbackProducts } from "@/lib/products";

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "20"));
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Admin products DB error:", error?.message);
    const filtered = (fallbackProducts as any[]).filter((p) => {
      if (category && p.category !== category) return false;
      if (
        search &&
        !p.name?.toLowerCase().includes(search.toLowerCase()) &&
        !p.slug?.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
    return NextResponse.json({
      success: true,
      products: filtered,
      pagination: {
        page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit) || 1,
      },
      notice: error?.message?.includes("Server selection timeout")
        ? "MongoDB Atlas IP access restricted. Add IP 0.0.0.0/0 in MongoDB Atlas Network Access to view live database records."
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
    const {
      slug, name, tagline, price, priceAlt, priceAltLabel, volume, type,
      category, concentration, gender, rating, reviewsCount, image, model3d,
      description, story, opening, heart, trail, badge, inStock, collectionSlug,
    } = body;

    if (!slug || !name || price === undefined) {
      return NextResponse.json({ success: false, error: "slug, name, and price are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        slug, name, tagline, price, priceAlt, priceAltLabel, volume, type,
        category, concentration, gender, rating, reviewsCount, image, model3d,
        description, story, opening, heart, trail, badge,
        inStock: inStock ?? true,
        collectionSlug,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
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

    const product = await prisma.product.update({
      where: { id },
      data: fields,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
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
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
