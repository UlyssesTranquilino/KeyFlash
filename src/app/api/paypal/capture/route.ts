// app/api/paypal/capture/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Server-only environment variables
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET_KEY;

    if (!clientId || !secret) {
      return NextResponse.json(
        { error: "PayPal credentials are not configured" },
        { status: 500 }
      );
    }

    const base64Credentials = Buffer.from(`${clientId}:${secret}`).toString(
      "base64"
    );

    // 1. Get access token
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      return NextResponse.json(
        { error: `Failed to get access token: ${errBody}` },
        { status: tokenRes.status }
      );
    }

    const { access_token } = await tokenRes.json();

    // 2. Capture payment
    const captureRes = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const captureData = await captureRes.json();

    if (!captureRes.ok) {
      return NextResponse.json(
        {
          error: captureData?.message || "Failed to capture payment",
          details: captureData,
        },
        { status: captureRes.status }
      );
    }

    return NextResponse.json({
      message: "Payment captured successfully",
      captureData,
    });
  } catch (err) {
    console.error("PayPal capture error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
