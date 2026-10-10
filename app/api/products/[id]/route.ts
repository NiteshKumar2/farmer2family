
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/admin-auth";
import Product from "@/models/Product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const MAX_IMAGE_LENGTH = 3 * 1024 * 1024;

function validateProduct(body: Record<string, unknown>) {
  if (
    typeof body.name !== "string" ||
    !body.name.trim() ||
    typeof body.description !== "string" ||
    !body.description.trim() ||
    typeof body.category !== "string" ||
    !body.category.trim() ||
    typeof body.unit !== "string" ||
    !body.unit.trim() ||
    typeof body.image !== "string" ||
    !body.image.trim()
  ) {
    return "Please provide all required product fields.";
  }

  if (
    body.image.length > MAX_IMAGE_LENGTH ||
    !(
      body.image.startsWith("data:image/jpeg;base64,") ||
      body.image.startsWith("data:image/png;base64,") ||
      body.image.startsWith("data:image/webp;base64,") ||
      body.image.startsWith("https://") ||
      body.image.startsWith("/")
    )
  ) {
    return "Please provide a valid product image.";
  }

  const price = Number(body.price);
  const stock = Number(body.stock ?? 0);
  const salePrice =
    body.salePrice === "" ||
    body.salePrice === null ||
    body.salePrice === undefined
      ? undefined
      : Number(body.salePrice);

  if (!Number.isFinite(price) || price < 0) {
    return "Please provide a valid price.";
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return "Stock must be a non-negative whole number.";
  }

  if (
    salePrice !== undefined &&
    (!Number.isFinite(salePrice) ||
      salePrice < 0 ||
      salePrice > price)
  ) {
    return "Sale price must be between zero and the regular price.";
  }

  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const admin = await isAdmin();
    const filter: Record<string, unknown> = { _id: id };

    if (!admin) filter.active = true;

    const product = await Product.findOne(filter).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch product." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationError = validateProduct(body);

    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    await connectDB();

    const name = (body.name as string).trim();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const duplicate = await Product.findOne({
      slug,
      _id: { $ne: id },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "Another product already uses this name." },
        { status: 409 }
      );
    }

    const update = {
      name,
      slug,
      description: (body.description as string).trim(),
      image: body.image,
      category: (body.category as string).trim(),
      unit: (body.unit as string).trim(),
      farmer:
        typeof body.farmer === "string"
          ? body.farmer.trim()
          : "",
      price: Number(body.price),
      salePrice:
        body.salePrice === "" ||
        body.salePrice === null ||
        body.salePrice === undefined
          ? undefined
          : Number(body.salePrice),
      stock: Number(body.stock ?? 0),
      featured: body.featured === true,
      active: body.active !== false,
    };

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
