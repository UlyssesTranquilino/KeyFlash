import { Skeleton } from "../skeleton";
const SkeletonFlashcard = () => {
  return (
    <div>
      <div className="max-w-[900px] mx-auto px-2 sm:px-5 mb-20">
        <div className="my-3 x-auto flex flex-col mb-10">
          <div className="flex justify-between gap-3 w-full">
            <Skeleton className="h-8 w-1/2 rounded-md" />

            <Skeleton className="h-5 w-1/6 rounded-md" />
          </div>

          <Skeleton className="h-5 w-3/4 rounded-md mt-3" />
        </div>

        {/* Flashcard Carousel Skeleton */}
        <div className="h-[100vh] pt-3">
          <div className="rounded-2xl bg-gray-900/70 h-96 relative overflow-hidden">
            <div className="flex flex-col items-center h-full p-8"></div>
          </div>

          <div className="w-full justify-between -bottom-35 pt-5 grid grid-cols-3 items-center ">
            <div className="w-full  flex items-center  gap-2">
              <Skeleton className="h-5 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            <div className="w-full flex items-center justify-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-10 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            <div className="w-full flex items-center justify-end gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        </div>

        {/* All Terms Skeleton */}
        <div className="mt-20 flex flex-col gap-5">
          <Skeleton className="h-8 w-1/4 mx-auto" />
          <div className="flex items-center justify-around gap-9">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col relative bg-gray-900/30">
              <div className="flex items-center justify-around gap-3 sm:gap-5">
                <div className="bg-gray-900 rounded-sm w-full h-full p-4 min-h-20 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="bg-gray-900 rounded-sm w-full h-full p-4 min-h-20 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonFlashcard;
