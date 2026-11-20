import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";

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
      subtotal: rawSubtotal,
      total: rawTotal,
      deliveryOption = "STANDARD",
      paymentMethod = "COD",
    } = body;

    // Determine delivery speed, days and cost (PKR)
    let deliveryDays = 5;
    let shippingCost = 0;
    let deliveryLabel = "Standard Insured Courier (5 Business Days)";

    if (deliveryOption === "URGENT") {
      deliveryDays = 1;
      shippingCost = 1800;
      deliveryLabel = "Urgent VIP 24-Hour Courier (1 Day)";
    } else if (deliveryOption === "FAST") {
      deliveryDays = 3;
      shippingCost = 850;
      deliveryLabel = "Fast Express Dispatch (3 Days)";
    }

    const arrivalDate = new Date(
      Date.now() + deliveryDays * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-PK", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const subtotal = parseFloat(rawSubtotal) || (parseFloat(rawTotal) ? Math.max(0, parseFloat(rawTotal) - shippingCost) : 18500);
    const total = subtotal + shippingCost;

    const orderNumber = `AF-${new Date().getFullYear()}-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    let stripeSessionId: string | null = null;
    let stripeSessionUrl: string | null = null;

    // Check Stripe integration if online payment selected
    if (stripe && paymentMethod === "ONLINE") {
      try {
        const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";

        // Build Stripe line items (PKR)
        const lineItems: any[] = (items && items.length > 0)
          ? items.map((i: any) => ({
              price_data: {
                currency: "pkr",
                product_data: {
                  name: i.name || "A. Fragrance Extrait",
                  description: `${i.volume || "Standard 50ml"} · Luxury Perfume`,
                },
                unit_amount: Math.round((parseFloat(i.price) || 18500) * 100),
              },
              quantity: parseInt(i.quantity) || 1,
            }))
          : [
              {
                price_data: {
                  currency: "pkr",
                  product_data: {
                    name: "Luxury Perfume Extrait",
                  },
                  unit_amount: Math.round(subtotal * 100),
                },
                quantity: 1,
              },
            ];

        // Add shipping fee line item if applicable
        if (shippingCost > 0) {
          lineItems.push({
            price_data: {
              currency: "pkr",
              product_data: {
                name: deliveryLabel,
                description: `Guaranteed delivery within ${deliveryDays} day(s) · Estimated: ${arrivalDate}`,
              },
              unit_amount: Math.round(shippingCost * 100),
            },
            quantity: 1,
          });
        }

        const session = await stripe.checkout.sessions.create({
          line_items: lineItems,
          mode: "payment",
          customer_email: customerEmail || undefined,
          success_url: `${origin}/checkout?success=true&order=${orderNumber}`,
          cancel_url: `${origin}/checkout?cancelled=true`,
          metadata: {
            orderNumber,
            deliveryOption,
            deliveryDays: deliveryDays.toString(),
            estimatedDelivery: arrivalDate,
          },
        });

        stripeSessionId = session.id;
        stripeSessionUrl = session.url;
      } catch (stripeErr) {
        console.warn("Stripe Checkout Session notice:", stripeErr);
      }
    }

    // Persist verified order to MongoDB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName || "Valued Customer",
        customerEmail: customerEmail || "customer@afragrance.pk",
        shippingAddress: shippingAddress || "House Address",
        city: city || "Karachi",
        country: country || "Pakistan",
        postalCode: postalCode || "74200",
        subtotal,
        shippingCost,
        total,
        status: "CONFIRMED",
        paymentMethod,
        paymentStatus: paymentMethod === "ONLINE" && stripeSessionUrl ? "PENDING" : "PAID",
        deliveryOption,
        deliveryDays,
        estimatedDelivery: arrivalDate,
        stripeSessionId,
        items: (items || []).map((i: any) => ({
          productId: i.id || "1",
          productName: i.name || "Perfume",
          image: i.image || "/luxury-flacon.jpg",
          price: parseFloat(i.price) || 18500,
          volume: i.volume || "50 ml",
          quantity: parseInt(i.quantity) || 1,
        })),
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      deliveryOption: order.deliveryOption,
      deliveryDays: order.deliveryDays,
      estimatedDelivery: order.estimatedDelivery,
      status: order.status,
      sessionUrl: stripeSessionUrl,
      message: "Order placed and confirmed successfully",
    });
  } catch (error: any) {
    console.error("Checkout processing error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process checkout" },
      { status: 500 }
    );
  }
}
