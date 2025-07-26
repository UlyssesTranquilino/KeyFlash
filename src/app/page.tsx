import Image from "next/image";
import Navbar from "./ui/navbar/navbar";
import { Folder, ClipboardList, Keyboard, CodeXml, FileUp } from "lucide-react";
import Intro from "./ui/home/intro";
import Features from "./ui/home/features";
import WhyItWorks from "./ui/home/whyitworks";
import HowItWorks from "./ui/home/howitworks";
import WhoIsItFor from "./ui/home/whoisitfor";
import Ready from "./ui/home/ready";
import Link from "next/link";

export default function Home() {
  return (
    <div className="fle flex-col items-center justify-items-center">
      <main className="flex flex-col items-center justify-center max-w-[1150px]">
        <div className="text-center pt-8 pb-10 w-full">
          <h1 className="text-3xl sm:text-5xl  lg:text-6xl px-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto  sm:leading-15 lg:leading-20">
            Master What You Learn By Typing It.
          </h1>
          {/* <h1 className="text-3xl sm:text-5xl lg:text-6xl pt-3 md:pt-5">
            By Typing It.
          </h1> */}

          <p className="text-sm md:text-base mt-10 w-full max-w-160 mx-auto px-10">
            Upload notes, paste lessons, or just practice. KeyFlash helps you
            absorb information faster, improve recall, and make studying
            engaging.
          </p>
        </div>

        <div className="mb-30 lg:mb-8 grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full h-45 gap-5 border-white px-5">
          <Link
            href="/typing/custom"
            className="relative group transition-all duration-300 ease-in-out"
          >
            <div className="cursor-pointer p-5 h-full w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30 transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
              <Keyboard
                size={55}
                strokeWidth={1.3}
                className="text-[#007CFF] -ml-1 scale-90 md:scale-100"
              />
              <h1 className="text-md md:text-lg my-3 font-medium">
                Practice Typing
              </h1>
              <p className="text-xs md:text-sm w-60">
                Build speed and accuracy with random words, quotes, or code
                snippets.
              </p>
            </div>
            <div className="absolute -top-5 -right-3 -z-1 size-65 rounded-full bg-radial-[at_50%_50%] from-blue-500/70 to-black to-70%"></div>
          </Link>

          <Link
            href="/typing/code"
            className="relative group transition-all duration-300 ease-in-out"
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
                className=" text-[#007CFF] scale-250 md:scale-260 "
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
                  fill="#08132D"
                />
              </svg>
              <h1 className="pt-2 text-md md:text-lg my-3 font-medium">
                Flashcard Typing Mode
              </h1>
              <p className="text-xs md:text-sm w-60">
                Practice by typing answers to your own flashcards — great for
                memorizing terms, code, or concepts.
              </p>
            </div>
            <div className="absolute -top-3 sm:-top-10 -right-4 -z-1 size-60 rounded-full bg-radial-[at_50%_50%] from-blue-500/70 to-black to-80%"></div>
          </Link>

          <Link
            href="/typing/custom"
            className="relative group transition-all duration-300 ease-in-out sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:w-full lg:mx-0"
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
            <div className="absolute -top-10 -left-10 -z-1 size-70 rounded-full bg-radial-[at_50%_50%] from-blue-500/70 to-black to-80%"></div>
          </Link>
        </div>

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
