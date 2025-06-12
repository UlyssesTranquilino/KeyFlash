import Image from "next/image";
import { Folder, ClipboardList, Keyboard } from "lucide-react";

export default function Features() {
  return (
    <div className="mt-60 sm:mt-40 flex flex-col items-center justify-items-center">
      <div className="text-center pt-5 pb-10 w-full">
        <h1 className="text-3xl sm:text-5xl  lg:text-6xl px-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto  sm:leading-15 lg:leading-20">
          Key Features
        </h1>
      </div>

      <div className=" grid  grid-cols-1  w-full h-45 gap-5 border-white px-5">
        <div className="sm:grid sm:grid-cols-3 gap-3">
          <div className=" relative group transition-all duration-300 ease-in-out feature-background">
            <div className="cursor-pointer p-5 h-full w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30  transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
              <Folder
                size={55}
                strokeWidth={1.3}
                className="text-[#007CFF] -ml-1 scale-90 md:scale-100"
              />
              <h1 className="text-md md:text-lg my-3 font-medium gradient-text">
                Typing Mode
              </h1>
              <p className="text-xs md:text-sm w-60">
                Retype your own material for deep, active recall.
              </p>
            </div>
          </div>

          <div className="sm:col-span-2 relative group transition-all duration-300 ease-in-out feature-background2">
            <div className="cursor-pointer p-5 h-full w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30  transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
              <ClipboardList
                size={55}
                strokeWidth={1.3}
                className="text-[#007CFF] -ml-2 scale-90 md:scale-100"
              />
              <h1 className="text-md md:text-lg my-3 font-medium gradient-text">
                Performance Tracking
              </h1>
              <p className="text-xs md:text-sm w-60">
                Monitor your WPM, accuracy, and progress over time.{" "}
              </p>
            </div>
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative group transition-all duration-300 ease-in-out feature-background3">
            <div className="cursor-pointer p-5 h-full w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30  transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
              <ClipboardList
                size={55}
                strokeWidth={1.3}
                className="text-[#007CFF] -ml-2 scale-90 md:scale-100"
              />
              <h1 className="text-md md:text-lg my-3 font-medium gradient-text">
                Gamified Learning{" "}
              </h1>
              <p className="text-xs md:text-sm w-60">
                Wrong answers repeat more often for reinforced mastery.
              </p>
            </div>
          </div>

          <div className=" relative group transition-all duration-300 ease-in-out feature-background4">
            <div className="cursor-pointer p-5 h-full w-full bg-black/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30  transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
              <h1 className="text-2xl text-center my-3 font-medium gradient-text">
                Generate Reviewer
              </h1>
              <p className="text-xs text-center md:text-sm w-60 text-gray-200 mt-3">
                Instantly turn notes into clean, readable summaries for quick
                review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
