// app/api/paypal/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const base64Credentials = Buffer.from(`${clientId}:${secret}`).toString(
    "base64"
  );

  try {
    // 1. Get access token
    const tokenResponse = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${base64Credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      return NextResponse.json(
        { error: `Token fetch failed: ${tokenResponse.status} - ${errorBody}` },
        { status: tokenResponse.status }
      );
    }

    const { access_token } = await tokenResponse.json();

    // 2. Create order
    const orderResponse = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: "9.99",
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: "9.99",
                  },
                },
              },
              items: [
                {
                  name: "KeyFlash",
                  description: "Upgrade to pro",
                  quantity: "1",
                  unit_amount: {
                    currency_code: "USD",
                    value: "9.99",
                  },
                },
              ],
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
                payment_method_selected: "PAYPAL",
                brand_name: "KeyFlash",
                shipping_preference: "NO_SHIPPING",
                locale: "en-US",
                user_action: "PAY_NOW",
                return_url: `${siteUrl}/complete-payment`,
                cancel_url: `${siteUrl}/cancel-payment`,
              },
            },
          },
        }),
      }
    );

    if (!orderResponse.ok) {
      const errorBody = await orderResponse.text();
      return NextResponse.json(
        {
          error: `Order creation failed: ${orderResponse.status} - ${errorBody}`,
        },
        { status: orderResponse.status }
      );
    }

    const orderData = await orderResponse.json();

    return NextResponse.json({
      orderId: orderData.id,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
