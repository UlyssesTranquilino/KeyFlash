"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen -mt-10 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-xl">
        <div className="p-8 text-center">
          {/* Animated X icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
              <div className="relative flex items-center justify-center w-16 h-16 bg-red-500/30 rounded-full border-2 border-red-500">
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-red-400 mb-3">
            Payment Cancelled
          </h2>

          <p className="text-gray-300 mb-6">
            You've cancelled the payment process. No charges have been made to
            your account.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => router.push("/payment")}
              className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 px-6 rounded-lg transition-all duration-200 text-white"
            >
              Back to Payment
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/support")}
              className="cursor-pointer w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 px-6 rounded-lg transition"
            >
              Need Help? Contact Support
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Want to try a different payment method?
            </p>
            <Button
              variant="link"
              onClick={() => router.push("/pricing")}
              className="text-blue-400 hover:text-blue-300 text-xs mt-2"
            >
              Explore payment options
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
