import Image from "next/image";
import Student from "../../../../public/Home/Students.png";
import Teachers from "../../../../public/Home/Teachers.png";
import Developers from "../../../../public/Home/Developers.png";
import Personal from "../../../../public/Home/Personal.png";

export default function WhoIsItFor() {
  return (
    <div className="mt-60 w-full  flex flex-col items-center justify-items-center">
      <div className="text-center pt-5 pb-12 sm:pb-18 w-full">
        <h1 className="text-3xl sm:text-5xl  lg:text-6xl px-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto  sm:leading-15 lg:leading-20">
          Who Is It For
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 px-5 w-full ">
        <div className=" flex items-center justify-center  relative group transition-all duration-300 ease-in-out ">
          <div className="flex flex-col justify-center items-center  p-5 h-full w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-white/30  transition-all duration-300 ease-in-out ">
            <h1 className=" text-center text-xl md:text-xl mb-3 font-medium ">
              Students
            </h1>

            <div className="h-50">
              <Image
                src={Student}
                alt="Active Learning Image"
                className="w-32 sm:w-35  pb-8 bg-radial from-purple-500/20 from-2% "
              />
            </div>
            <p className="text-sm w-full sm:text-center sm:mt-2 sm:mx-auto ">
              Reinforce class notes, lectures, and textbooks with smarter,
              active learning.
            </p>
          </div>
        </div>

        <div className=" flex items-center justify-center  relative group transition-all duration-300 ease-in-out ">
          <div className="flex flex-col justify-center items-center  p-5 h-full w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-white/30  transition-all duration-300 ease-in-out ">
            <h1 className=" text-center text-xl md:text-xl mb-3 font-medium ">
              Teachers
            </h1>

            <div className="h-50">
              <Image
                src={Teachers}
                alt="Active Learning Image"
                className="w-32 sm:w-35 z-2 pb-8 bg-radial from-green-500/20 from-2% "
              />
            </div>

            <p className="text-sm w-full sm:text-center sm:mt-2 sm:mx-auto">
              Turn any handout or material into interactive practice for
              students.
            </p>
          </div>
        </div>

        <div className=" flex items-center justify-center  relative group transition-all duration-300 ease-in-out ">
          <div className="flex flex-col justify-center items-center  p-5 h-full w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-white/30  transition-all duration-300 ease-in-out ">
            <h1 className=" text-center text-xl md:text-xl mb-3 font-medium ">
              Developers
            </h1>

            <div className="h-50">
              {" "}
              <Image
                src={Developers}
                alt="Active Learning Image"
                className="w-32 sm:w-35  pb-8 bg-radial from-cyan-500/20 from-2% "
              />
            </div>

            <p className="text-sm w-full sm:text-center sm:mt-2 sm:mx-auto">
              Master documentation, syntax, and technical concepts through
              repetition.
            </p>
          </div>
        </div>

        <div className=" flex items-center justify-center  relative group transition-all duration-300 ease-in-out ">
          <div className="flex flex-col justify-center items-center  p-5 h-full w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-white/30  transition-all duration-300 ease-in-out ">
            <h1 className=" text-center text-xl md:text-xl mb-3 font-medium ">
              Everyone
            </h1>

            <div className="h-50">
              {" "}
              <Image
                src={Personal}
                alt="Active Learning Image"
                className="w-32 sm:w-35  pb-8 bg-radial from-yellow-400/10 from-2% "
              />
            </div>

            <p className="text-sm w-full sm:text-center sm:mt-2 sm:mx-auto">
              Whether you're upskilling, reviewing, or just curious, make
              learning stick.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
