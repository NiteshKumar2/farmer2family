import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const ORDER_STATUSES = [
  "Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access is required." },
        { status: 403 }
      );
    }

    await connectDB();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("[GET /api/admin/orders]", error);

    return NextResponse.json(
      { error: "Unable to fetch orders." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access is required." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { orderId, status, estimatedDeliveryDate, adminNote } =
      body as {
        orderId?: string;
        status?: string;
        estimatedDeliveryDate?: string;
        adminNote?: string;
      };

    if (
      typeof orderId !== "string" ||
      !mongoose.isValidObjectId(orderId)
    ) {
      return NextResponse.json(
        { error: "A valid order ID is required." },
        { status: 400 }
      );
    }

    if (
      status !== undefined &&
      !ORDER_STATUSES.includes(status as OrderStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }

    if (
      estimatedDeliveryDate !== undefined &&
      (typeof estimatedDeliveryDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(estimatedDeliveryDate))
    ) {
      return NextResponse.json(
        { error: "Enter a valid delivery date." },
        { status: 400 }
      );
    }

    if (
      adminNote !== undefined &&
      (typeof adminNote !== "string" || adminNote.length > 1000)
    ) {
      return NextResponse.json(
        { error: "Admin notes must be 1000 characters or fewer." },
        { status: 400 }
      );
    }

    if (
      status === undefined &&
      estimatedDeliveryDate === undefined &&
      adminNote === undefined
    ) {
      return NextResponse.json(
        { error: "Provide at least one field to update." },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const now = new Date();

    if (estimatedDeliveryDate !== undefined) {
      // Interpret the date from the date-picker as a calendar date.
      const [year, month, day] = estimatedDeliveryDate
        .split("-")
        .map(Number);

      const newDate = new Date(
        Date.UTC(year, month - 1, day, 23, 59, 59, 999)
      );

      // Reject invalid dates such as 2026-02-31.
      if (
        newDate.getUTCFullYear() !== year ||
        newDate.getUTCMonth() !== month - 1 ||
        newDate.getUTCDate() !== day
      ) {
        return NextResponse.json(
          { error: "Enter a valid calendar date." },
          { status: 400 }
        );
      }

      const orderDate = new Date(order.createdAt);
      const minimumDate = new Date(
        Date.UTC(
          orderDate.getUTCFullYear(),
          orderDate.getUTCMonth(),
          orderDate.getUTCDate() + 5
        )
      );

      if (newDate < minimumDate) {
        return NextResponse.json(
          {
            error:
              "Estimated delivery must be at least 5 calendar days after the order date.",
          },
          { status: 400 }
        );
      }

      order.estimatedDeliveryDate = newDate;
    }

    if (status !== undefined && status !== order.status) {
      order.status = status as OrderStatus;

      order.statusHistory.push({
        status: status as OrderStatus,
        note:
          typeof adminNote === "string" && adminNote.trim()
            ? adminNote.trim()
            : `Order status updated to ${status}.`,
        changedAt: now,
      });

      if (status === "Shipped" && !order.shippedAt) {
        order.shippedAt = now;
      }

      if (status === "Delivered") {
        order.deliveredAt = now;
      }
    }

    if (adminNote !== undefined) {
      order.adminNote = adminNote.trim();
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order updated successfully.",
    });
  } catch (error) {
    console.error("[PATCH /api/admin/orders]", error);

    return NextResponse.json(
      { error: "Unable to update the order." },
      { status: 500 }
    );
  }
}