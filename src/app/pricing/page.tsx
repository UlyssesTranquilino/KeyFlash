"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const PricingPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="py-5 md:py-8 relative overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center gap-2 mb-3 md:mb-5">
        <h1 className="font-semibold text-xl md:text-2xl lg:3xl">
          Choose Your Plan
        </h1>
        <p className="text-sm md:text-base text-gray-300">
          Start for free or unlock everything with a one-time Pro upgrade.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-4xl mx-auto p-6">
        <div className="rounded-2xl border border-gray-700 p-6 gap bg-gray-900/50">
          <h2 className="text-xl font-semibold text-white mb-4">Free </h2>

          <div className="flex flex-col gap-3 h-26">
            <h1 className="font-semibold text-3xl ">0$</h1>
            <p className="text-sm text-gray-50 bg-gray-800/30 rounded-md sm:w-70 md:w-75 p-2 ">
              Best for learning casually at your own pace.
            </p>
          </div>

          <div className="w-full h-[1px] bg-gray-700/70 my-5" />

          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              Create Flashcards <span className="text-gray-300">(Up to 5)</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              Custom Texts <span className="text-gray-300">(Up to 5)</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              Code Snippets <span className="text-gray-300">(Up to 5)</span>
            </li>

            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              All Typing Modes
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              Upload .txt files
            </li>
            <li className="flex items-center gap-3 text-sm">
              <X className="text-red-400 size-4" />
              Ads Free
            </li>
            <li className="flex items-center gap-3 text-sm">
              <X className="text-red-400 size-4" />
              Early Access to New Features
            </li>
          </ul>

          {user ? (
            <Link href="/dashboard">
              <button className="cursor-pointer mt-6 w-full outline  outline-gray-600 hover:bg-gray-900 text-white py-2 rounded-md transition">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/signup">
              <button className="cursor-pointer mt-6 w-full outline  outline-gray-600 hover:bg-gray-900 text-white py-2 rounded-md transition">
                Create an Account
              </button>
            </Link>
          )}

          <p className="mt-3 text-xs text-gray-400 text-center">
            Saving flashcards, custom texts, and code snippets requires an
            account.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-700 p-6 bg-gradient-to-b from-blue-900/60 to-black shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Pro</h2>
          <div className="flex flex-col gap-3 h-26">
            <h1 className="font-semibold text-3xl ">9.99$</h1>
            <div className="flex flex-col md:flex-row gap-1 md:gap-3">
              <p className="text-sm text-blue-300 bg-blue-950/30 rounded-md w-48 p-2 ">
                Early Access Lifetime Deal
              </p>

              <p className="text-sm text-green-500 bg-green-900/30 rounded-md w-20 p-2 ">
                Best Deal
              </p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-700/70 my-6 md:my-5" />

          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              Create Flashcards{" "}
              <span className="text-gray-300">(Unlimited)</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              Custom Texts <span className="text-gray-300">(Unlimited)</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              Code Snippets <span className="text-gray-300">(Unlimited)</span>
            </li>

            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              All Typing Modes
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              Upload .txt files
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              Ads Free
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Check className="text-green-400 size-4" />
              Early Access to New Features
            </li>
          </ul>
          <button
            onClick={() => router.push("/payment")}
            className="cursor-pointer mt-6 w-full outline-1 outline-blue-600 bg-blue-600/60 hover:bg-blue-600/80 text-white py-2 rounded-md transition"
          >
            Upgrade to Pro
          </button>

          <p className="mt-3 text-xs text-gray-400 text-center">
            This is a limited-time offer. Price may increase in the future.
          </p>
        </div>
      </div>

      <div className="fixed bottom-10 left-40 -z-1 size-55 md:size-95 lg:size-200 lg:left-10 rounded-full bg-radial-[at_50%_50%] from-blue-500/20 to-black to-70%"></div>
    </div>
  );
};

export default PricingPage;
