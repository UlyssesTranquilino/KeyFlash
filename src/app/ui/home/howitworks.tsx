export default function HowItWorks() {
  return (
    <div className="mt-60 w-full sm:mt-70 flex flex-col items-center justify-items-center">
      <div className="text-center pt-5 pb-12 sm:pb-18 w-full">
        <h1 className="text-3xl sm:text-5xl  lg:text-6xl px-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto  sm:leading-15 lg:leading-20">
          How It Works
        </h1>
      </div>

      <div className="grid grid-cols-1  sm:grid-cols-3 gap-5 px-5 w-full ">
        <div className=" flex items-center justify-center h-55  relative group transition-all duration-300 ease-in-out feature-background-light">
          <div className="flex flex-col justify-center cursor-pointer p-5 h-full w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30  transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
            <h1 className="text-center text-lg md:text-xl lg:text-2xl  lg:mb-5 mb-3 font-medium ">
              Upload or Paste
            </h1>
            <p className="text-xs md:text-sm w-full lg:w-60 sm:text-center sm:mt-2 sm:mx-auto">
              Quickly drop in your notes, a file, or any text. KeyFlash
              intelligently processes your content in seconds.
            </p>
          </div>
        </div>

        <div className=" flex items-center justify-center h-55  relative group transition-all duration-300 ease-in-out feature-background-light2">
          <div className="flex flex-col justify-center cursor-pointer p-5 h-full w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30  transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
            <h1 className="text-center text-lg md:text-xl lg:text-2xl  lg:mb-5 mb-3 font-medium ">
              Choose Your Mode
            </h1>
            <p className="text-xs md:text-sm w-full lg:w-60 sm:text-center sm:mt-2 sm:mx-auto">
              Upload or paste your content. Select 'Typing Practice' for
              practice, The choice is yours.
            </p>
          </div>
        </div>

        <div className=" flex items-center justify-center h-55  relative group transition-all duration-300 ease-in-out feature-background-light3">
          <div className="flex flex-col justify-center cursor-pointer p-5 h-full w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-blue-400/30  transition-all duration-300 ease-in-out group-hover:backdrop-blur-lg group-hover:bg-opacity-40 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-blue-300/70">
            <h1 className="text-center text-lg md:text-xl lg:text-2xl  lg:mb-5 mb-3 font-medium ">
              Start Mastering
            </h1>
            <p className="text-xs md:text-sm w-full lg:w-60 sm:text-center sm:mt-2 sm:mx-auto">
              Begin typing. Reinforce memory pathways, and build a stronger
              understanding of your material, fast.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
