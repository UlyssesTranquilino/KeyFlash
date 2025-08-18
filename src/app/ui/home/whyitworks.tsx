"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import ActiveLearning from "../../../../public/Home/ActiveLearning.png";
import LikeGame from "../../../../public/Home/LikeGame.png";

export default function WhyItWorks() {
  return (
    <div className="mt-200 w-full sm:mt-140 flex flex-col items-center justify-items-center sm:px-10">
      {/* Title */}
    <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  viewport={{ once: true }}
  className="text-center pt-5 pb-10 sm:pb-20 w-full"
>
  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold gradient-text px-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto sm:leading-15 lg:leading-20">
    Why It Works
  </h1>
</motion.div>

      {/* Section 1 */}
      <div className="w-full px-4 sm:grid grid-cols-2 gap-5 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full flex items-center justify-center bg-radial from-blue-600/50 from-10% to-black rounded-full"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <Image
              src={ActiveLearning}
              alt="Active Learning Image"
              className="w-30 sm:w-35 lg:w-45 rotate-15 drop-shadow-lg"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-end sm:pl-5 sm:pt-3 lg:pt-8"
        >
          <h1 className="text-center sm:text-right text-2xl sm:text-3xl lg:text-4xl sm:pl-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto leading-10">
            Active Learning, Smarter Retention
          </h1>
          <p className="text-center sm:text-right text-sm md:text-base mt-4 px-4 sm:px-0 sm:mt-10 w-full max-w-160 mx-auto text-gray-200/90">
            Typing forces your brain to, not just recognize. It strengthens
            memory, focus, and understanding better than passive reading.
          </p>
        </motion.div>
      </div>

      {/* Section 2 */}
      <div className="w-full px-4 sm:grid grid-cols-2 gap-0 mt-20 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="sm:order-2 w-full flex items-center justify-center bg-radial from-yellow-600/40 from-10% to-black rounded-full"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <Image
              src={LikeGame}
              alt="Game Image"
              className="w-30 sm:w-45 lg:w-60 rotate-15 drop-shadow-lg"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-end sm:pr-5 sm:pt-4 lg:pt-12"
        >
          <h1 className="text-center sm:text-left text-2xl sm:text-3xl lg:text-4xl sm:pr-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto leading-10">
            Learning That Feels Like a Game
          </h1>
          <p className="text-center sm:text-left text-sm md:text-base mt-4 px-4 sm:px-0 sm:mt-10 w-full max-w-160 mx-auto text-gray-200/90">
            By turning your own content into interactive sessions, KeyFlash
            makes studying feel engaging — with instant feedback, speed tracking,
            and smart repetition.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
