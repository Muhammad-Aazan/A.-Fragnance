import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkAdminAuth } from "../auth";
import { products as fallbackProducts } from "@/lib/products";

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalOrders,
      orders,
      totalProducts,
      totalUsers,
      totalSubscribers,
      totalInquiries,
      recentOrders,
      allOrdersForProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({ select: { total: true, createdAt: true } }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.newsletterSubscriber.count(),
      prisma.contactInquiry.count(),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.findMany({
        select: { items: true },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    // Top products by order count
    const productCountMap: Record<string, { productId: string; name: string; count: number }> = {};
    for (const order of allOrdersForProducts) {
      for (const item of order.items) {
        const key = item.productId ?? item.productName;
        if (!key) continue;
        if (!productCountMap[key]) {
          productCountMap[key] = { productId: item.productId ?? key, name: item.productName, count: 0 };
        }
        productCountMap[key].count += item.quantity ?? 1;
      }
    }
    const topProducts = Object.values(productCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Monthly revenue for last 6 months
    const now = new Date();
    const monthlyRevenue: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("default", { month: "short", year: "numeric" });
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const revenue = orders
        .filter((o) => o.createdAt >= start && o.createdAt < end)
        .reduce((sum, o) => sum + o.total, 0);
      monthlyRevenue.push({ month: label, revenue: Math.round(revenue * 100) / 100 });
    }

    return NextResponse.json({
      success: true,
      dbConnected: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        totalUsers,
        totalSubscribers,
        totalInquiries,
      },
      recentOrders,
      topProducts,
      monthlyRevenue,
    });
  } catch (error: any) {
    console.error("Admin stats DB error:", error?.message);
    const isConnError = error?.message?.includes("Server selection timeout") || error?.message?.includes("fatal alert") || error?.message?.includes("ReplicaSetNoPrimary");

    // Provide graceful fallback stats so admin dashboard renders without crashing
    const now = new Date();
    const fallbackMonths = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      fallbackMonths.push({
        month: d.toLocaleString("default", { month: "short", year: "numeric" }),
        revenue: 0,
      });
    }

    return NextResponse.json({
      success: true,
      dbConnected: false,
      notice: isConnError
        ? "MongoDB Atlas IP access restricted. Add IP 0.0.0.0/0 in MongoDB Atlas Network Access to view live database records."
        : error?.message,
      stats: {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: fallbackProducts.length,
        totalUsers: 1,
        totalSubscribers: 0,
        totalInquiries: 0,
      },
      recentOrders: [],
      topProducts: fallbackProducts.slice(0, 5).map((p) => ({
        productId: p.id,
        name: p.name,
        count: 0,
      })),
      monthlyRevenue: fallbackMonths,
    });
  }
}
