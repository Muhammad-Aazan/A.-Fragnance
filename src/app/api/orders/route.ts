import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      shippingAddress,
      city,
      country,
      postalCode,
      items,
      subtotal,
      shippingCost: rawShippingCost,
      total: rawTotal,
      deliveryOption = "STANDARD",
      paymentMethod = "CARD",
    } = body;

    if (!customerEmail || !customerName || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required order information" },
        { status: 400 }
      );
    }

    const deliveryDays = deliveryOption === "URGENT" ? 1 : deliveryOption === "FAST" ? 3 : 5;
    const shippingCost = rawShippingCost !== undefined ? parseFloat(rawShippingCost) : (deliveryOption === "URGENT" ? 1800 : deliveryOption === "FAST" ? 850 : 0);
    const parsedSubtotal = parseFloat(subtotal) || 0;
    const total = rawTotal !== undefined ? parseFloat(rawTotal) : (parsedSubtotal + shippingCost);

    const estimatedDelivery = new Date(
      Date.now() + deliveryDays * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const orderNumber = `AF-${new Date().getFullYear()}-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    // Create order with embedded order items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        shippingAddress: shippingAddress || "",
        city: city || "",
        country: country || "",
        postalCode: postalCode || "",
        subtotal: parsedSubtotal,
        shippingCost,
        total,
        paymentMethod,
        paymentStatus: "PAID",
        status: "CONFIRMED",
        deliveryOption,
        deliveryDays,
        estimatedDelivery,
        items: items.map((i: any) => ({
          productId: i.id || "1",
          productName: i.name || "Extrait de Parfum",
          image: i.image || "",
          price: parseFloat(i.price) || 0,
          volume: i.volume || "50 ml",
          quantity: parseInt(i.quantity) || 1,
        })),
      },
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const where: any = {};
    if (email) where.customerEmail = email;

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
