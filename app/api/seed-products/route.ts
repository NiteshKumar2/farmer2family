import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

const products = [
  {
    name: "Fresh Organic Tomatoes",
    slug: "fresh-organic-tomatoes",
    description:
      "Fresh farm tomatoes carefully selected for your family.",
    price: 60,
    image: "🍅",
    category: "Vegetables",
    unit: "1 kg",
    stock: 100,
    farmer: "Farmer2Family Farm",
    featured: true,
    active: true,
  },

  {
    name: "Fresh Potatoes",
    slug: "fresh-potatoes",
    description:
      "Fresh quality potatoes sourced directly from farmers.",
    price: 45,
    image: "🥔",
    category: "Vegetables",
    unit: "1 kg",
    stock: 100,
    farmer: "Farmer2Family Farm",
    featured: true,
    active: true,
  },

  {
    name: "Organic Basmati Rice",
    slug: "organic-basmati-rice",
    description:
      "Premium quality rice for everyday family meals.",
    price: 180,
    image: "🌾",
    category: "Rice & Grains",
    unit: "1 kg",
    stock: 50,
    farmer: "Farmer2Family Farm",
    featured: true,
    active: true,
  },

  {
    name: "Organic Toor Dal",
    slug: "organic-toor-dal",
    description:
      "Quality toor dal sourced from trusted farmers.",
    price: 160,
    image: "🫘",
    category: "Pulses",
    unit: "1 kg",
    stock: 80,
    farmer: "Farmer2Family Farm",
    featured: true,
    active: true,
  },

  {
    name: "Cold Pressed Groundnut Oil",
    slug: "cold-pressed-groundnut-oil",
    description:
      "Traditional cold pressed groundnut oil.",
    price: 420,
    image: "🫙",
    category: "Oils",
    unit: "1 L",
    stock: 40,
    farmer: "Farmer2Family Farm",
    featured: true,
    active: true,
  },

  {
    name: "Fresh A2 Milk",
    slug: "fresh-a2-milk",
    description:
      "Fresh milk delivered for your family's daily needs.",
    price: 75,
    image: "🥛",
    category: "Dairy",
    unit: "1 L",
    stock: 50,
    farmer: "Farmer2Family Dairy",
    featured: true,
    active: true,
  },
];

export async function GET() {
  try {
    await connectDB();

    const existing = await Product.countDocuments();

    if (existing > 0) {
      return NextResponse.json({
        message: "Products already exist",
        count: existing,
      });
    }

    const created = await Product.insertMany(products);

    return NextResponse.json({
      message: "Products created successfully",
      count: created.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to seed products",
      },
      {
        status: 500,
      }
    );
  }
}