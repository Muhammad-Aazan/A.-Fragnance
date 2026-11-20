import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { collections as fallbackCollections } from "@/lib/products";

export async function GET() {
  try {
    let collections = await prisma.collection.findMany();

    if (collections.length === 0) {
      collections = fallbackCollections as any;
    }

    return NextResponse.json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
