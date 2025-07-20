import { Skeleton } from "../skeleton";
const SkeletonCode = () => {
  return (
    <div>
      <div className="my-3 x-auto flex flex-col mb-15">
        <div className="flex justify-between gap-3 w-full">
          <div className="rounded-md p-2  w-20 hover:bg-gray-800 text-gray-400">
            <Skeleton className="h-8 w-14 rounded-md" />
          </div>

          <div className="flex items-center gap-5">
            <Skeleton className="h-8 w-10 rounded-md" />
            <Skeleton className="h-8 w-3 rounded-md" />
          </div>
        </div>

        {/* Code Information */}
        <div className="pl-2 flex items-center">
          <div className="my-3  w-full">
            <Skeleton className="h-6 w-2/3 rounded-md" />
            <div className="flex items-center flex-wrap gap-2 my-3">
              <Skeleton className="h-6 w-15 rounded-full" />
              <Skeleton className="h-6 w-22 rounded-full" />
              <Skeleton className="h-6 w-22 rounded-full" />
              <Skeleton className="h-6 w-22 rounded-full" />
            </div>
          </div>
        </div>

        <Skeleton className="h-60 md:h-90 w-full rounded-md mt-14 max-w-[750px] mx-auto" />

        <Skeleton className="h-8 w-20 rounded-md mt-14 mx-auto" />
      </div>
    </div>
  );
};

export default SkeletonCode;
