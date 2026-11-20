import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { collections, getProductsByCollection } from "@/lib/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const collection = await prisma.collection.findUnique({
      where: { slug },
    });

    if (!collection) {
      const fallback = collections.find((c) => c.slug === slug);
      if (!fallback) {
        return NextResponse.json(
          { success: false, error: "Collection not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: {
          ...fallback,
          products: getProductsByCollection(slug as any),
        },
      });
    }

    const products = await prisma.product.findMany({
      where: { collectionSlug: slug },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...collection,
        products: products.length > 0 ? products : getProductsByCollection(slug as any),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch collection" },
      { status: 500 }
    );
  }
}
