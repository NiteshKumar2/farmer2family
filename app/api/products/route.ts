
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/admin-auth";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

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

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Admins can view inactive products too.
    const admin = await isAdmin();
    const filter: Record<string, unknown> = admin
      ? {}
      : { active: true };

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch products." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
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

    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this name already exists." },
        { status: 409 }
      );
    }

    const product = await Product.create({
      name,
      description: (body.description as string).trim(),
      slug,
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
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
