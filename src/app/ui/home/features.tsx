import Image from "next/image";
import { Folder, ClipboardList, Keyboard } from "lucide-react";
import TypingMode from "../../../../public/Home/Typing Mode.png";
import Performance from "../../../../public/Home/Performance.png";
import Gamified from "../../../../public/Home/Gamified.png";
import Shine from "../../../../public/Shine.png";

export default function Features() {
  return (
    <div className="mt-60 w-full sm:mt-40 flex flex-col items-center justify-items-center">
      <div
        className="text-center pt-5 pb-12"
      >
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold gradient-text">
          Key Features
        </h1>
      </div>

      <div className="grid grid-cols-1 w-full h-45 gap-5 border-white px-5">
        {/* Top Row */}
        <div className="grid sm:grid-cols-3 gap-3 md:gap-5">
          {/* Typing Mode */}
          <div className="h-50 md:h-60 relative group transition-all duration-300 ease-in-out feature-background animate-fade-up">
            <div className="md:p-5 flex flex-col justify-end p-5 h-full w-full rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30 group-hover:scale-[1.02] group-hover:shadow-lg transition-transform">
              <Image
                src={TypingMode}
                alt="Typing Mode"
                className="w-30 md:w-35 absolute z-2 right-5 top-5 md:right-8 md:top-8 rotate-15 animate-float"
              />
              <h1 className="text-lg my-3 font-medium gradient-text w-35">Typing Mode</h1>
              <p className="text-xs md:text-sm w-full lg:w-60">
                Retype your own material for deep, active recall.
              </p>
            </div>
          </div>

          {/* Performance Tracking */}
          <div className="sm:col-span-2 relative group transition-all duration-300 ease-in-out feature-background2 animate-fade-up [animation-delay:200ms]">
            <div className="md:p-8 h-50 md:h-60 p-5 w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30 group-hover:scale-[1.02] group-hover:shadow-lg transition-transform">
              <Image
                src={Shine}
                alt="Shine"
                className="w-30 md:w-35 absolute right-25 top-20 md:right-48 md:top-18 rotate-125 animate-pulse-slow"
              />
              <Image
                src={Performance}
                alt="Performance"
                className="w-25 md:w-40 absolute right-3 bottom-3 -rotate-10 animate-float"
              />
              <h1 className="text-lg md:text-2xl md:w-72 my-3 font-medium gradient-text w-55">
                Performance Tracking
              </h1>
              <p className="text-xs md:text-sm w-60">
                Monitor your WPM, accuracy, and progress over time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-5">
          {/* Gamified Learning */}
          <div className="sm:col-span-2 md:col-span-3 relative group transition-all duration-300 ease-in-out feature-background3 animate-fade-up [animation-delay:400ms]">
            <div className="md:p-8 flex flex-col justify-end h-50 md:h-60 p-5 w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30 group-hover:scale-[1.02] group-hover:shadow-lg transition-transform">
              <Image
                src={Shine}
                alt="Shine"
                className="w-30 md:w-35 absolute right-25 top-0 md:right-35 md:top-10 -rotate-45 animate-pulse-slow"
              />
              <Image
                src={Gamified}
                alt="Gamified"
                className="w-15 md:w-20 absolute right-4 top-4 md:right-8 md:top-8 rotate-15 animate-float"
              />
              <h1 className="text-lg md:text-2xl md:w-72 my-3 font-medium gradient-text w-45">
                Gamified Learning
              </h1>
              <p className="text-xs md:text-sm w-60">
                Wrong answers repeat more often for reinforced mastery.
              </p>
            </div>
          </div>

          {/* Generate Reviewer */}
          <div className="md:col-span-2 flex items-center justify-center relative group transition-all duration-300 ease-in-out feature-background4 animate-fade-up [animation-delay:600ms]">
            <div className="h-50 md:p-8 md:h-60 p-5 w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30 group-hover:scale-[1.02] group-hover:shadow-lg transition-transform">
              <h1 className="mt-8 sm:mt-8 text-2xl md:text-3xl lg:text-4xl text-center my-3 font-medium gradient-text">
                Generate Reviewer
              </h1>
              <p className="text-xs text-center md:text-sm lg:mt-3 md:w-full text-gray-200 mt-3 mx-auto">
                Instantly turn notes into clean, readable summaries for quick review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
