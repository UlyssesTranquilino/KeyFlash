import Image from "next/image";
import Navbar from "./ui/navbar/navbar";
import { Folder, ClipboardList, Keyboard } from "lucide-react";
import Intro from "./ui/home/intro";
import Features from "./ui/home/features";
import WhyItWorks from "./ui/home/whyitworks";
import HowItWorks from "./ui/home/howitworks";
import WhoIsItFor from "./ui/home/whoisitfor";

export default function Home() {
  return (
    <div className="fle flex-col items-center justify-items-center">
      <Navbar />
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

        <div className=" grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full h-45 gap-5 border-white px-5">
          <div className="relative group transition-all duration-300 ease-in-out">
            <div className="cursor-pointer p-5 h-full w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30  transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
              <Folder
                size={55}
                strokeWidth={1.3}
                className="text-[#007CFF] -ml-1 scale-90 md:scale-100"
              />
              <h1 className="text-md md:text-lg my-3 font-medium">
                Upload File
              </h1>
              <p className="text-xs md:text-sm w-60">
                Turn any PDF, DOCX, or PPT into a typing challenge
              </p>
            </div>

            <div className=" absolute -top-10 -left-10 -z-1 size-70 rounded-full bg-radial-[at_50%_50%] from-blue-500/70 to-black to-80%"></div>
          </div>

          <div className="relative group transition-all duration-300 ease-in-out">
            <div className="cursor-pointer p-5 h-full w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30  transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
              <ClipboardList
                size={55}
                strokeWidth={1.3}
                className="text-[#007CFF] -ml-2 scale-90 md:scale-100"
              />
              <h1 className="text-md md:text-lg my-3 font-medium">
                Paste Text
              </h1>
              <p className="text-xs md:text-sm w-60">
                Drop in any notes or content to start learning instantly.
              </p>
            </div>
            <div className="absolute -top-3 sm:-top-10 -right-4 -z-1 size-60 rounded-full bg-radial-[at_50%_50%] from-blue-500/70  to-black to-80%"></div>
          </div>

          <div className="relative group transition-all duration-300 ease-in-out sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:w-full lg:mx-0">
            <div className="cursor-pointer p-5 h-full w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30  transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
              <Keyboard
                size={55}
                strokeWidth={1.3}
                className="text-[#007CFF] -ml-1 scale-90 md:scale-100"
              />
              <h1 className="text-md md:text-lg my-3 font-medium">
                Practice Typing
              </h1>
              <p className="text-xs md:text-sm w-60">
                Just want to warm up? Start with a random lesson.
              </p>
            </div>
            <div className="absolute -top-5 -right-3 -z-1 size-65 rounded-full bg-radial-[at_50%_50%] from-blue-500/70  to-black to-70%"></div>
          </div>
        </div>

        <Intro />

        <Features />

        <WhyItWorks />

        <HowItWorks />

        <WhoIsItFor />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
