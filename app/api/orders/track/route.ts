import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Please sign in to view your orders." },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({
      "customer.email": email,
    })
      .select(
        "_id createdAt items subtotal deliveryCharge total paymentMethod paymentStatus status estimatedDeliveryDate statusHistory"
      )
      .sort({ createdAt: -1 })
      .lean();

    const safeOrders = orders.map((order) => {
      const fallbackDeliveryDate = new Date(order.createdAt);
      fallbackDeliveryDate.setDate(fallbackDeliveryDate.getDate() + 5);
      fallbackDeliveryDate.setHours(23, 59, 59, 999);

      return {
        id: String(order._id),
        createdAt: order.createdAt,
        items: order.items.map((item: any) => ({
          name: item.name,
          image: item.image || "",
          price: item.price,
          quantity: item.quantity,
          unit: item.unit || "unit",
        })),
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        estimatedDeliveryDate:
          order.estimatedDeliveryDate || fallbackDeliveryDate,
        statusHistory: (order.statusHistory || []).map((entry: any) => ({
          status: entry.status,
          note: entry.note || "",
          changedAt: entry.changedAt,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      orders: safeOrders,
    });
  } catch (error) {
    console.error("[GET /api/orders/track]", error);

    return NextResponse.json(
      { error: "Unable to load your orders. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const orderId =
      typeof body.orderId === "string" ? body.orderId.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!mongoose.isValidObjectId(orderId)) {
      return NextResponse.json(
        { error: "Please enter a valid order ID and email." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid order ID and email." },
        { status: 400 }
      );
    }

    await connectDB();

    // Match both the order ID and the email used during checkout.
    // Never return the full customer record from this endpoint.
    const order = await Order.findOne({
      _id: orderId,
      "customer.email": email,
    })
      .select(
        "_id createdAt items subtotal deliveryCharge total paymentMethod paymentStatus status estimatedDeliveryDate statusHistory"
      )
      .lean();

    if (!order) {
      return NextResponse.json(
        {
          error:
            "We couldn't find an order with those details. Check your order ID and email.",
        },
        { status: 404 }
      );
    }

    const createdAt = new Date(order.createdAt);

    // Fallback for older orders created before delivery estimates
    // were added to the Order schema.
    const fallbackDeliveryDate = new Date(createdAt);
    fallbackDeliveryDate.setDate(fallbackDeliveryDate.getDate() + 5);
    fallbackDeliveryDate.setHours(23, 59, 59, 999);

    const estimatedDeliveryDate =
      order.estimatedDeliveryDate || fallbackDeliveryDate;

    return NextResponse.json({
      success: true,
      order: {
        id: String(order._id),
        createdAt: order.createdAt,
        items: order.items.map((item: any) => ({
          name: item.name,
          image: item.image || "",
          price: item.price,
          quantity: item.quantity,
          unit: item.unit || "unit",
        })),
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        estimatedDeliveryDate,
        statusHistory: (order.statusHistory || []).map(
          (entry: any) => ({
            status: entry.status,
            note: entry.note || "",
            changedAt: entry.changedAt,
          })
        ),
      },
    });
  } catch (error) {
    console.error("[POST /api/orders/track]", error);

    return NextResponse.json(
      { error: "Unable to track your order. Please try again." },
      { status: 500 }
    );
  }
}