
import { NextResponse } from "next/server";
import { DELIVERY_RULES, getDeliveryCharge } from "@/lib/delivery";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("pincode" in body) ||
      typeof body.pincode !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid PIN code.",
        },
        { status: 400 }
      );
    }

    const pincode = body.pincode.trim();

    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid 6-digit PIN code.",
        },
        { status: 400 }
      );
    }

    // Detect duplicate PIN codes across delivery groups.
    const matchingRules = DELIVERY_RULES.filter((rule) =>
      rule.pincodes.includes(pincode)
    );

    if (matchingRules.length > 1) {
      console.error(`Duplicate delivery rules for PIN code: ${pincode}`);

      return NextResponse.json(
        {
          success: false,
          message: "Delivery pricing is temporarily unavailable.",
        },
        { status: 500 }
      );
    }

    const deliveryCharge = getDeliveryCharge(pincode);

    if (deliveryCharge === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Sorry, delivery is not available for this PIN code.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pincode,
      deliveryCharge,
      message:
        deliveryCharge === 0
          ? "Great! Free delivery is available for your PIN code."
          : `Delivery is available. Charge: ₹${deliveryCharge}.`,
    });
  } catch (error) {
    console.error("Delivery check failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to check delivery right now. Please try again.",
      },
      { status: 500 }
    );
  }
}