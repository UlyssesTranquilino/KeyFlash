import Image from "next/image";
import ActiveLearning from "../../../../public/Home/ActiveLearning.png";
import LikeGame from "../../../../public/Home/LikeGame.png";
export default function WhyItWorks() {
  return (
    <div className="mt-200 w-full sm:mt-140 flex flex-col items-center justify-items-center sm:px-10">
      <div className="text-center pt-5 pb-10 sm:pb-20 w-full">
        <h1 className="text-3xl sm:text-5xl  lg:text-6xl px-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto  sm:leading-15 lg:leading-20">
          Why It Works
        </h1>
      </div>

      <div className="w-full px-4  sm:grid grid-cols-2 gap-5">
        <div className="w-full  flex items-center justify-center l bg-radial from-blue-600/50 from-10% to-black rounded-full">
          <Image
            src={ActiveLearning}
            alt="Active Learning Image"
            className="w-30 sm:w-35 lg:w-45 z-2 right-5 top-5 sm:mb-4 md:right-8 md:top-8 rotate-15 "
          />
        </div>

        <div className="flex flex-col items-end sm:pl-5 sm:pt-3 lg:pt-8 ">
          <h1 className="text-center sm:text-right text-2xl sm:text-3xl  lg:text-4xl sm:pl-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto  leading-10 ">
            Active Learning, Smarter Retention
          </h1>
          <p className="text-center sm:text-right text-sm md:text-base mt-4 px-4 sm:px-0 sm:mt-10 w-full max-w-160 mx-auto  ">
            Typing forces your brain to, not just recognize. It strengthens
            memory, focus, and understanding better than passive reading.
          </p>
        </div>
      </div>

      <div className="w-full px-4 sm:grid grid-cols-2  gap-0 mt-20">
        <div className="sm:order-2 w-full  flex items-center justify-center l bg-radial from-yellow-600/40 from-10% to-black rounded-full">
          <Image
            src={LikeGame}
            alt="Game Image"
            className="w-30 sm:w-45 lg:w-60 z-2 right-5 top-5 sm:mb-4 md:right-8 md:-top-10  rotate-15 "
          />
        </div>

        <div className="flex flex-col items-end sm:pr-5 sm:pt-4 lg:pt-12">
          <h1 className="text-center sm:text-left text-2xl sm:text-3xl  lg:text-4xl sm:pr-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto sm:ml-0 leading-10 ">
            Learning That Feels Like a Game
          </h1>
          <p className="text-center sm:text-left text-sm md:text-base mt-4 px-4 sm:px-0 sm:mt-10 w-full max-w-160 mx-auto  ">
            By turning your own content into interactive sessions, KeyFlash
            makes studying feel, with instant feedback, speed tracking, and
            smart repetition.
          </p>
        </div>
      </div>
    </div>
  );
}
