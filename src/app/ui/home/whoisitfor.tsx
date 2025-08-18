import Image from "next/image";
import Student from "../../../../public/Home/Students.png";
import Teachers from "../../../../public/Home/Teachers.png";
import Developers from "../../../../public/Home/Developers.png";
import Personal from "../../../../public/Home/Personal.png";

export default function WhoIsItFor() {
  const items = [
    {
      title: "Students",
      image: Student,
      description:
        "Reinforce class notes, lectures, and textbooks with smarter, active learning.",
    },
    {
      title: "Teachers",
      image: Teachers,
      description:
        "Turn any handout or material into interactive practice for students.",
    },
    {
      title: "Developers",
      image: Developers,
      description:
        "Master documentation, syntax, and technical concepts through repetition.",
    },
    {
      title: "Everyone",
      image: Personal,
      description:
        "Whether you're upskilling, reviewing, or just curious, make learning stick.",
    },
  ];

  return (
    <div className="mt-60 w-full flex flex-col items-center justify-items-center">
      {/* Title */}
      <div className="text-center pt-5 pb-12 sm:pb-18 w-full">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-500 via-cyan-400 to-white bg-clip-text text-transparent px-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto sm:leading-15 lg:leading-20">
          Who Is It For
        </h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-5 w-full">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center relative group transition-all duration-300 ease-in-out"
          >
            <div className="flex flex-col justify-center items-center p-6 h-full w-full rounded-xl bg-gradient-to-br from-blue-950/20 via-blue-800/30 to-cyan-700/30 backdrop-blur-sm border border-cyan-400/30 shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
              <h1 className="text-center text-xl md:text-xl mb-4 font-semibold text-white">
                {item.title}
              </h1>

              <div className="h-50 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={`${item.title} Image`}
                  className="w-28 sm:w-32 drop-shadow-lg"
                />
              </div>

              <p className="text-sm text-blue-100 mt-4 text-center max-w-xs">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
