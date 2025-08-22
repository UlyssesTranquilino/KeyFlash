"use client";
import { motion } from "framer-motion";

export default function Intro() {
  return (
    <section className="relative flex flex-col items-center justify-center w-full mt-120 sm:mt-60">
      {/* Hero Text */}
      <motion.div
        className="text-center px-6 max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold sm:text-6xl lg:text-7xl  tracking-tight bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Study Smarter
        </h1>
        <motion.h1
          className="text-4xl sm:text-6xl lg:text-7xl tracking-tight mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Not Slower
        </motion.h1>
        <motion.p
          className="text-gray-400 text-base sm:text-lg mt-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <span className="font-medium text-white">KeyFlash</span> blends typing,
          active recall, and smart repetition to revolutionize your learning.
          Upload your notes to instantly turn them into interactive typing
          sessions that boost retention and focus.
        </motion.p>
      </motion.div>

      {/* Video Showcase */}
      <motion.div
        className="relative w-full max-w-5xl mt-16 px-6 "
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        {/* The Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded2xl filter blur-3xl opacity-50 z-[-1]" />
     
        <div className="outline-12 outline-gray-50/10 rounded-2-xl overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[450px] object-cover"
          >
            <source src="/Videos/Typing.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </motion.div>
    </section>
  );
}
