export default function Intro() {
  return (
    <div className="mt-120 sm:mt-60 flex flex-col items-center justify-items-center">
      <div className="text-center pt-5 pb-10 w-full">
        <h1 className="text-3xl sm:text-5xl  lg:text-6xl px-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto  sm:leading-15 lg:leading-20">
          Study Smarter
        </h1>
        <h1 className="text-3xl sm:text-5xl  lg:text-6xl px-4 max-w-90 sm:max-w-120 lg:max-w-150 mx-auto  sm:leading-15 lg:leading-20">
          Not Slower
        </h1>
        <p className="text-sm md:text-base mt-10 w-full max-w-160 mx-auto px-10">
          KeyFlash blends typing, active recall, and smart repetition to
          revolutionize your learning. Upload your notes to instantly turn them
          into interactive typing sessions that boost retention and focus.
        </p>{" "}
      </div>

      <div className="w-full px-4">
        <div className="w-full h-60 bg-blue-900/50" />
      </div>
    </div>
  );
}
