import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || searchParams.get("slug");

    const where: any = {};
    if (productId) {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
      if (isObjectId) {
        where.productId = productId;
      } else {
        const product = await prisma.product.findFirst({
          where: { slug: productId },
          select: { id: true },
        });
        if (product) {
          where.productId = product.id;
        } else {
          return NextResponse.json({ success: true, count: 0, data: [] });
        }
      }
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { productId, author, rating, comment } = await request.json();

    if (!productId || !author || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: "Product, author, rating, and comment are required" },
        { status: 400 }
      );
    }

    let targetProductId = productId;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
    if (!isObjectId) {
      const product = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: productId },
            { name: { contains: productId, mode: "insensitive" } },
          ],
        },
        select: { id: true },
      });
      if (product) {
        targetProductId = product.id;
      } else {
        return NextResponse.json(
          { success: false, error: "Corresponding product was not found in catalog" },
          { status: 404 }
        );
      }
    }

    const review = await prisma.review.create({
      data: {
        productId: targetProductId,
        author: author.trim(),
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment: comment.trim(),
        verified: true,
      },
    });

    // Update product review count and recalculate average rating
    try {
      const allReviews = await prisma.review.findMany({
        where: { productId: targetProductId },
        select: { rating: true },
      });

      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await prisma.product.update({
        where: { id: targetProductId },
        data: {
          reviewsCount: allReviews.length,
          rating: parseFloat(avgRating.toFixed(1)),
        },
      });
    } catch (updateErr) {
      console.warn("Rating recalculation notice:", updateErr);
    }

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
