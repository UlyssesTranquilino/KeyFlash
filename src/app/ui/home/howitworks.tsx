import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      title: "Upload or Paste",
      description:
        "Quickly drop in your notes, a file, or any text. KeyFlash processes your content in seconds.",
    },
    {
      title: "Choose Your Mode",
      description:
        "Pick how you want to learn — 'Typing Practice' for active recall or another mode that fits you.",
    },
    {
      title: "Start Mastering",
      description:
        "Begin typing. Reinforce memory pathways and build stronger understanding fast.",
    },
  ];

  return (
    <div className="mt-60 w-full sm:mt-70 flex flex-col items-center justify-items-center">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center pt-5 pb-12 sm:pb-18 w-full"
      >
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-700 bg-clip-text text-transparent px-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto sm:leading-15 lg:leading-20">
          How It Works
        </h1>
      </motion.div>

      <div className="relative w-full px-5 sm:px-10">
        {/* vertical line for flow effect (desktop) */}
        {/* <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-800 rounded-full" /> */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center relative"
            >
              {/* step number */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-700 text-white font-bold text-lg shadow-md mb-4">
                {index + 1}
              </div>

              {/* card */}
              <div className="p-6 bg-gradient-to-br from-blue-900/60 via-blue-800/40 to-cyan-700/30 backdrop-blur-sm border border-cyan-400/30 rounded-xl shadow-lg w-full max-w-xs transition-all duration-300 hover:scale-105">
                <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 text-white">
                  {step.title}
                </h2>
                <p className="text-xs md:text-sm text-blue-100">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
