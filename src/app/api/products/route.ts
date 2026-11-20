import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { products as fallbackProducts } from "@/lib/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const collection = searchParams.get("collection");
    const search = searchParams.get("q") || searchParams.get("search");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");

    const where: any = {};

    if (category && category !== "All") {
      where.category = category;
    }

    if (collection) {
      where.collectionSlug = collection;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tagline: { contains: search } },
        { opening: { contains: search } },
        { heart: { contains: search } },
        { trail: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { price: "desc" };
    } else if (sort === "rating") {
      orderBy = { rating: "desc" };
    }

    let products = await prisma.product.findMany({
      where,
      orderBy,
    });

    // If database is empty, fallback to static products
    if (products.length === 0 && !category && !search && !collection) {
      products = fallbackProducts as any;
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      tagline,
      price,
      volume,
      type,
      category,
      concentration,
      image,
      description,
      story,
      opening,
      heart,
      trail,
      collectionSlug,
    } = body;

    if (!name || !slug || !price || !image) {
      return NextResponse.json(
        { success: false, error: "Missing required product fields" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        tagline: tagline || "",
        price: parseFloat(price),
        volume: volume || "50 ml",
        type: type || "Extrait de parfum",
        category: category || "Perfumes",
        concentration: concentration || "25%",
        gender: "Unisex",
        image,
        description: description || "",
        story: story || "",
        opening: Array.isArray(opening) ? opening.join(", ") : opening || "",
        heart: Array.isArray(heart) ? heart.join(", ") : heart || "",
        trail: Array.isArray(trail) ? trail.join(", ") : trail || "",
        collectionSlug: collectionSlug || null,
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
