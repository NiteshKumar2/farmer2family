import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Visitor from "@/models/Visitor";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      mobile,
      email,
      address,
      purpose,
      visitDate,
    } = body;

    if (!name || !mobile || !visitDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, mobile and visit date are required.",
        },
        { status: 400 }
      );
    }

    // Mobile must contain exactly 10 digits
    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number must be exactly 10 digits.",
        },
        { status: 400 }
      );
    }

    const visitor = await Visitor.create({
      name,
      mobile,
      email,
      address,
      purpose,
      visitDate,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Visitor registered successfully.",
        visitor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const visitors = await Visitor.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      visitors,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Could not load visitors.",
      },
      { status: 500 }
    );
  }
}
