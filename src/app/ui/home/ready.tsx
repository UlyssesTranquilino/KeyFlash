"use client";
import Image from "next/image";
import ReadyImg from "../../../../public/Home/Ready.png";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function Ready() {
  const user = useAuth();

  return (
    <div className="mt-60 sm:mt-70 w-full flex flex-col items-center justify-center pb-40 px-6">
      {/* Image & Heading Section */}
      <div className="flex flex-col items-center text-center max-w-3xl">
        <div className="flex items-center justify-center bg-radial from-blue-600/40 from-10% to-black rounded-full p-6">
          <Image
            src={ReadyImg}
            alt="Spaceship"
            className="w-28 sm:w-36 lg:w-44 rotate-12 drop-shadow-lg"
          />
        </div>

        <h1 className="mt-10 text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug bg-gradient-to-r from-blue-400 via-white to-blue-500 bg-clip-text text-transparent">
          Ready to Type What You Learn?
        </h1>

        <p className="mt-6 text-gray-300 text-sm md:text-base leading-relaxed max-w-xl">
          Start your first session in seconds — no signup needed. 
          Experience the difference <span className="font-semibold text-blue-400">active typing</span> makes in your learning journey.
        </p>
      </div>

      {/* CTA Button */}
      <div className="mt-10">
        <Link
          href={user ? "/dashboard" : "/signin"}
          className="relative group cursor-pointer"
        >
          <div className="relative flex items-center justify-center px-6 py-3 rounded-lg bg-zinc-950 text-white font-semibold text-sm md:text-base shadow-lg shadow-black/50 ring-1 ring-white/10 overflow-hidden transition-transform duration-300 group-hover:scale-[1.05]">
            {/* Glow background */}
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-cyan-400/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            <span className="relative z-10">
              {user ? "Go to Dashboard" : "Get Started"}
            </span>
          </div>
          {/* Underline Glow */}
          <span className="absolute -bottom-0.5 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-cyan-400/90 to-blue-400/0 opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
        </Link>
      </div>
    </div>
  );
}
