import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getProductBySlug } from "@/lib/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    let product = await prisma.product.findUnique({
      where: { slug },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      const fallback = getProductBySlug(slug);
      if (!fallback) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: fallback });
    }

    // Also fetch related products
    const related = await prisma.product.findMany({
      where: {
        category: product.category,
        slug: { not: slug },
      },
      take: 3,
    });

    return NextResponse.json({
      success: true,
      data: product,
      related,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}
