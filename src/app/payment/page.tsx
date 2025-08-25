"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Check } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { upgradeUserToPro } from "../../../utils/auth/userUtils";

const PaymentPage = () => {
  const amount = 9.99;
  const { user } = useAuth();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  };

  const onCreateOrder = async () => {
    try {
      const response = await fetch("/api/paypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("Error creating Paypal order: ", error);
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      if (!data?.orderID) throw new Error("Invalid order ID");

      const response = await fetch(`/api/paypal/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: data.orderID }),
      });

      const result = await response.json();

      // ✅ Optional: check if capture actually succeeded
      if (response.ok && result.captureData?.status === "COMPLETED") {
        const resUpgradeUser = await upgradeUserToPro();

        window.location.href = "/complete-payment";
      } else {
        throw new Error("Payment not completed");
      }
    } catch (error) {
      console.error("Error verifying PayPal order: ", error);
      window.location.href = "/cancel-payment";
    }
  };

  const onError = (error: any) => {
    console.error("Paypal error: ", error);
    window.location.href = "/cancel-payment";
  };

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Upgrade to Pro
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Unlock all features with a one-time payment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-gray-700 p-6 bg-gray-800/50">
            <h2 className="text-xl font-semibold mb-4">Pro Plan</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-gray-400 ml-2">one-time payment</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <Check className="text-green-400 size-4" />
                <span>Unlimited Flashcards</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-green-400 size-4" />
                <span>Unlimited Custom Texts</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-green-400 size-4" />
                <span>Unlimited Code Snippets</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-green-400 size-4" />
                <span>All Typing Modes</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-green-400 size-4" />
                <span>Upload .txt files</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-green-400 size-4" />
                <span>Ads Free Experience</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-green-400 size-4" />
                <span>Early Access to New Features</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-700 p-6 bg-gradient-to-b from-blue-900/30 to-gray-900">
            <h2 className="text-xl font-semibold mb-6">
              Complete Your Purchase
            </h2>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Pro Plan</span>
                <span>$9.99</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-700">
                <span>Total</span>
                <span>$9.99</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-md">
              <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                  // style={styles}
                  createOrder={onCreateOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              </PayPalScriptProvider>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              Secure payment processed by PayPal. You'll be redirected to PayPal
              to complete your purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
