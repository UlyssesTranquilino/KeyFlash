import { NextResponse } from "next/server";
import { upgradeUserToPro } from "../../../../../utils/auth/userUtils";

export async function POST(req: Request) {
  try {
    const { orderId, userId } = await req.json(); // make sure you pass userId
    if (!orderId || !userId) {
      return NextResponse.json(
        { error: "Missing orderId or userId" },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET_KEY;
    const isSandbox = process.env.PAYPAL_SANDBOX === "true";

    if (!clientId || !secret) {
      return NextResponse.json(
        { error: "PayPal credentials are not configured" },
        { status: 500 }
      );
    }

    const baseUrl = isSandbox
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com";

    const base64Credentials = Buffer.from(`${clientId}:${secret}`).toString(
      "base64"
    );

    // 1. Get access token
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
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
      `${baseUrl}/v2/checkout/orders/${orderId}/capture`,
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

    // 3. Verify payment
    if (captureData.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment not completed", details: captureData },
        { status: 400 }
      );
    }

    const paidAmount =
      captureData.purchase_units[0].payments.captures[0].amount.value;
    if (paidAmount !== "0.01") {
      return NextResponse.json(
        { error: "Payment amount mismatch", details: captureData },
        { status: 400 }
      );
    }

    // 4. Upgrade user
    await upgradeUserToPro();

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
