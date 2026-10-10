import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

type RequestedItem = {
  productId: string;
  quantity: number;
};

type CustomerInput = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
};

export async function POST(request: NextRequest) {
  let session: mongoose.ClientSession | undefined;

  try {
    // Connect to MongoDB before creating the transaction session.
    await connectDB();

    const body = await request.json();

    const customer = body.customer as CustomerInput | undefined;
    const items = body.items as RequestedItem[] | undefined;
    const paymentMethod = body.paymentMethod;

    // Only Cash on Delivery is supported currently.
    if (paymentMethod !== "cod") {
      return NextResponse.json(
        { error: "Only Cash on Delivery is currently available." },
        { status: 400 }
      );
    }

    // Validate customer and delivery details.
    if (
      !customer ||
      !customer.name?.trim() ||
      !customer.email?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()) ||
      !/^[6-9]\d{9}$/.test(customer.phone?.trim() || "") ||
      !customer.address?.trim() ||
      !customer.city?.trim() ||
      !customer.state?.trim() ||
      !/^\d{6}$/.test(customer.pincode?.trim() || "")
    ) {
      return NextResponse.json(
        { error: "Please provide valid customer and delivery details." },
        { status: 400 }
      );
    }

    // Validate cart items.
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    if (
      items.some(
        (item) =>
          !item ||
          typeof item.productId !== "string" ||
          !mongoose.isValidObjectId(item.productId) ||
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

    // Combine repeated product IDs.
    const quantities = new Map<string, number>();

    for (const item of items) {
      const productId = new mongoose.Types.ObjectId(
        item.productId
      ).toString();

      const quantity =
        (quantities.get(productId) || 0) + item.quantity;

      if (quantity > 100) {
        return NextResponse.json(
          { error: "Maximum quantity per product is 100." },
          { status: 400 }
        );
      }

      quantities.set(productId, quantity);
    }

    session = await mongoose.startSession();

    let createdOrderId = "";

    await session.withTransaction(async () => {
      const orderItems: Array<{
        product: mongoose.Types.ObjectId;
        name: string;
        image: string;
        price: number;
        unit: string;
        quantity: number;
      }> = [];

      let subtotal = 0;

      // Check stock and reserve the requested quantity.
      for (const [productId, quantity] of quantities) {
        const product = await Product.findOneAndUpdate(
          {
            _id: productId,
            active: true,
            stock: { $gte: quantity },
          },
          {
            $inc: { stock: -quantity },
          },
          {
            new: true,
            session,
          }
        );

        if (!product) {
          throw new Error(
            `Product ${productId} is unavailable or has insufficient stock.`
          );
        }

        const regularPrice = Number(product.price);
        const salePrice = Number(product.salePrice);

        if (
          !Number.isFinite(regularPrice) ||
          regularPrice < 0
        ) {
          throw new Error(
            `Invalid price for product ${productId}.`
          );
        }

        const price =
          Number.isFinite(salePrice) &&
          salePrice > 0 &&
          salePrice < regularPrice
            ? salePrice
            : regularPrice;

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

      // Temporary free-delivery rule.
      const deliveryCharge = 0;
      const total = subtotal + deliveryCharge;

      if (!Number.isFinite(total)) {
        throw new Error("The order total is invalid.");
      }

      // Estimated delivery is at least 5 calendar days
      // after the order is placed.
      const orderPlacedAt = new Date();
      const estimatedDeliveryDate = new Date(orderPlacedAt);

      estimatedDeliveryDate.setDate(
        estimatedDeliveryDate.getDate() + 5
      );
      estimatedDeliveryDate.setHours(23, 59, 59, 999);

      // Create the order within the same transaction.
      const orders = await Order.create(
        [
          {
            customer: {
              name: customer.name!.trim(),
              email: customer.email!.trim().toLowerCase(),
              phone: customer.phone!.trim(),
              address: customer.address!.trim(),
              city: customer.city!.trim(),
              state: customer.state!.trim(),
              pincode: customer.pincode!.trim(),
            },

            items: orderItems,
            subtotal,
            deliveryCharge,
            total,

            paymentMethod: "COD",
            paymentStatus: "Pending",
            status: "Placed",

            estimatedDeliveryDate,

            statusHistory: [
              {
                status: "Placed",
                note: "Your order has been placed successfully.",
                changedAt: orderPlacedAt,
              },
            ],
          },
        ],
        { session }
      );

      createdOrderId = String(orders[0]._id);
    });

    if (!createdOrderId) {
      throw new Error(
        "Order creation completed without an order ID."
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your COD order has been placed successfully.",
        orderId: createdOrderId,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "[POST /api/orders] Order creation failed:",
      error
    );

    const errorMessage =
      error instanceof Error ? error.message : "";

    if (
      errorMessage.includes(
        "unavailable or has insufficient stock"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "A product is unavailable or has insufficient stock.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Unable to place your order. Please try again.",
      },
      { status: 500 }
    );
  } finally {
    if (session) {
      try {
        await session.endSession();
      } catch (error) {
        console.error(
          "[POST /api/orders] Session cleanup failed:",
          error
        );
      }
    }
  }
}
