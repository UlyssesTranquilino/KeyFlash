"use client";
import Image from "next/image";
import ReadyImg from "../../../../public/Home/Ready.png";

export default function Ready() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="mt-60 w-full sm:mt-70 flex flex-col items-center justify-items-center">
      <div className="w-full px-4 gap-5">
        <div className="w-full  flex items-center justify-center l bg-radial from-blue-600/50 from-10% to-black rounded-full">
          <Image
            src={ReadyImg}
            alt="Spaceship"
            className="w-30 sm:w-35 lg:w-45 z-2 right-5 top-5 sm:mb-4 md:right-8 md:top-8 rotate-15 "
          />
        </div>

        <div className="flex flex-col items-end sm:pl-5 sm:pt-3 lg:pt-8 ">
          <h1 className="text-center sm:text-right text-2xl sm:text-3xl  lg:text-4xl sm:pl-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto  leading-10 ">
            Ready to Type What You Learn?
          </h1>
          <p className="text-center max-w-140 text-sm md:text-base mt-4 px-4 sm:px-0 sm:mt-10 w-full mx-auto  ">
            Start your first session in seconds, no signup needed. Experience
            the difference active typing makes in your learning journey
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-5 md:gap-7">
        <button
          onClick={scrollToTop}
          className="w-30 sm:w-40 md:w=50 bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-md p-px text-xs font-semibold leading-6 text-white "
        >
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <span className="absolute inset-0 rounded-md bg-[image:radial-gradient(95%_100%_at_50%_0%,rgba(56,189,248,0.9)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="text-center  relative flex space-x-2 items-center z-10 rounded-md bg-zinc-950 py-2 px-4 ring-1 ring-white/10">
            <span className="w-full">Get Started</span>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>

        <button
          onClick={scrollToTop}
          className="w-30 sm:w-40 md:w=50 bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-md p-px text-xs font-semibold leading-6 text-white "
        >
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <span className="absolute inset-0 rounded-md bg-[image:radial-gradient(95%_100%_at_50%_0%,rgba(56,189,248,0.9)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="text-center  relative flex space-x-2 items-center z-10 rounded-md bg-zinc-950 py-2 px-4 ring-1 ring-white/10">
            <span className="w-full">Sign in</span>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>
      </div>
    </div>
  );
}
