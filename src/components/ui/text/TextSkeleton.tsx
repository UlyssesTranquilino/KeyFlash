import { Skeleton } from "../skeleton";
const TextSkeleton = () => {
  return (
    <div>
      <div className="max-w-[1100px] w-full mx-auto px-2 sm:px-5 mb-20">
        <div className="my-3 x-auto flex flex-col mb-10 ">
          <div className="flex w-full">
            <Skeleton className="h-8 w-15 rounded-md" />

            <div className="flex w-full justify-end gap-5">
              <Skeleton className="h-8 w-7 rounded-md" />
              <Skeleton className="h-8 w-4 rounded-md" />
            </div>
          </div>

          <Skeleton className="mt-6 h-8 w-20 rounded-md" />

          <Skeleton className="mt-6 h-4 w-15 rounded-md ml-auto" />
        </div>

        {/* Flashcard Carousel Skeleton */}
        <div className=" pt-3 flex flex-col items-center justify-center gap-2">
          <Skeleton className="h-5 w-3/4 rounded-md mt-3" />
          <Skeleton className="h-5 w-3/5 rounded-md mt-3" />
          <Skeleton className="h-5 w-3/4 rounded-md mt-3" />
          <Skeleton className="h-5 w-3/6 rounded-md mt-3" />
        </div>

        <Skeleton className="mt-14 h-8 w-20 rounded-md mx-auto" />
      </div>
    </div>
  );
};

export default TextSkeleton;
