
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

type RequestedItem = {
  productId: string;
  quantity: number;
};

export async function POST(request: NextRequest) {
  const session = await mongoose.startSession();

  try {
    const body = await request.json();
    const { customer, items } = body as {
      customer?: Record<string, string>;
      items?: RequestedItem[];
    };

    if (
      !customer ||
      !customer.name?.trim() ||
      !customer.email?.trim() ||
      !customer.phone?.trim() ||
      !customer.address?.trim() ||
      !customer.city?.trim() ||
      !customer.state?.trim() ||
      !/^\d{6}$/.test(customer.pincode || "")
    ) {
      return NextResponse.json(
        { error: "Please provide all required customer details." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    if (
      items.some(
        (item) =>
          !mongoose.Types.ObjectId.isValid(item.productId) ||
          !Number.isSafeInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 100
      )
    ) {
      return NextResponse.json(
        { error: "Invalid product or quantity." },
        { status: 400 }
      );
    }

    const quantities = new Map<string, number>();

    for (const item of items) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) || 0) + item.quantity
      );
    }

    for (const quantity of quantities.values()) {
      if (quantity > 100) {
        return NextResponse.json(
          { error: "Maximum quantity per product is 100." },
          { status: 400 }
        );
      }
    }

    await connectDB();

    let createdOrder: any;

    await session.withTransaction(async () => {
      const orderItems = [];
      let subtotal = 0;

      for (const [productId, quantity] of quantities) {
        const product = await Product.findOneAndUpdate(
          {
            _id: productId,
            active: true,
            stock: { $gte: quantity },
          },
          { $inc: { stock: -quantity } },
          { new: true, session }
        );

        if (!product) {
          throw new Error(
            `Product ${productId} is unavailable or has insufficient stock.`
          );
        }

        const price =
          typeof product.salePrice === "number" &&
          product.salePrice > 0 &&
          product.salePrice < product.price
            ? product.salePrice
            : product.price;

        subtotal += price * quantity;

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.image || "",
          price,
          unit: product.unit || "unit",
          quantity,
        });
      }

      // Temporary: free delivery. Replace this with your
      // existing server-side delivery fee calculation.
      const deliveryCharge = 0;
      const total = subtotal + deliveryCharge;

      const orders = await Order.create(
        [
          {
            customer: {
              name: customer.name.trim(),
              email: customer.email.trim().toLowerCase(),
              phone: customer.phone.trim(),
              address: customer.address.trim(),
              city: customer.city.trim(),
              state: customer.state.trim(),
              pincode: customer.pincode.trim(),
            },
            items: orderItems,
            subtotal,
            deliveryCharge,
            total,
            paymentMethod: "COD",
            paymentStatus: "Pending",
            status: "Placed",
          },
        ],
        { session }
      );

      createdOrder = orders[0];
    });

    return NextResponse.json(
      {
        message: "Your COD order has been placed successfully.",
        orderId: String(createdOrder._id),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Failed to place order.";

    if (
      message.includes("unavailable or has insufficient stock")
    ) {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Unable to place your order. Please try again." },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}