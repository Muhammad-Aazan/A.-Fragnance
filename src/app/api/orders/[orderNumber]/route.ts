import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve order" },
      { status: 500 }
    );
  }
}
