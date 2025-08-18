"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Keyboard, FileUp } from "lucide-react";
import Intro from "./ui/home/intro";
import Features from "./ui/home/features";
import WhyItWorks from "./ui/home/whyitworks";
import HowItWorks from "./ui/home/howitworks";
import WhoIsItFor from "./ui/home/whoisitfor";
import Ready from "./ui/home/ready";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <main className="flex flex-col items-center justify-center max-w-[1150px] px-4">
        {/* Hero */}
        <motion.div
          className="text-center pt-12 pb-14 w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Master What You Learn <br />
            <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
              By Typing It
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg mt-8 max-w-2xl mx-auto leading-relaxed">
            Upload notes, paste lessons, or just practice. KeyFlash helps you
            absorb information faster, improve recall, and make studying
            engaging.
          </p>
        </motion.div>

<div className="mb-30 lg:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full h-45 gap-5 border-white px-5">
  {/* Practice Typing */}
  <Link
    href="/typing/random"
    className="relative group transition-all duration-300 ease-in-out animate-fade-up"
  >
    <div className="cursor-pointer p-5 h-full w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30 transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
      <Keyboard
        size={55}
        strokeWidth={1.3}
        className="text-[#007CFF] -ml-1 scale-90 md:scale-100"
      />
      <h1 className="text-md md:text-lg my-3 font-medium">Practice Typing</h1>
      <p className="text-xs md:text-sm w-60">
        Build speed and accuracy with random words, quotes, or code snippets.
      </p>
    </div>

    {/* Glow Effect */}
    <div className="absolute -top-5 -right-3 -z-1 size-65 rounded-full bg-radial-[at_50%_50%] from-blue-500/70 to-black to-70% animate-pulse-slow"></div>
  </Link>

  {/* Flashcard Typing Mode */}
  <Link
    href="/typing/code"
    className="relative group transition-all duration-300 ease-in-out animate-fade-up [animation-delay:200ms]"
  >
    <div className="cursor-pointer pt-8 p-5 h-full w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30 transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 4 150 150"
        width="29"
        height="29"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        className="text-[#007CFF] scale-250 md:scale-260"
      >
        <rect
          x="30"
          y="40"
          width="60"
          height="80"
          rx="10"
          transform="rotate(16 120 220)"
          stroke="currentColor"
        />
        <rect
          x="45"
          y="25"
          width="60"
          height="80"
          rx="10"
          stroke="currentColor"
          fill="black"
        />
      </svg>
      <h1 className="pt-2 text-md md:text-lg my-3 font-medium">
        Flashcard Typing Mode
      </h1>
      <p className="text-xs md:text-sm w-60">
        Practice by typing answers to your own flashcards — great for memorizing
        terms, code, or concepts.
      </p>
    </div>
    <div className="absolute -top-3 sm:-top-10 -right-4 -z-1 size-60 rounded-full bg-radial-[at_50%_50%] from-blue-500/70 to-black to-80% animate-pulse-slow [animation-delay:200ms]"></div>
  </Link>

  {/* Paste or Upload Text */}
  <Link
    href="/typing/custom"
    className="relative group transition-all duration-300 ease-in-out sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:w-full lg:mx-0 animate-fade-up [animation-delay:400ms]"
  >
    <div className="cursor-pointer p-5 h-full w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30 transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
      <FileUp
        size={55}
        strokeWidth={1.3}
        className="text-[#007CFF] -ml-1 scale-90 md:scale-100"
      />
      <h1 className="text-md md:text-lg my-3 font-medium">
        Paste or Upload Text
      </h1>
      <p className="text-xs md:text-sm w-60">
        Convert your .TXT files into interactive typing content.
      </p>
    </div>
    <div className="absolute -top-10 -left-10 -z-1 size-70 rounded-full bg-radial-[at_50%_50%] from-blue-500/70 to-black to-80% animate-pulse-slow [animation-delay:400ms]"></div>
  </Link>
</div>

        {/* Sections */}
        <Intro />
        <Features />
        <WhyItWorks />
        <HowItWorks />
        <WhoIsItFor />
        <Ready />
      </main>
    </div>
  );
}
