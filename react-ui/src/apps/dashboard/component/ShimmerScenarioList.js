import React from "react";
import {
  ShimmerBadge,
  ShimmerThumbnail,
  ShimmerTitle,
} from "react-shimmer-effects";

function ShimmerScenarioList(props) {
  return (
    <div className="flex flex-col mt-5 space-y-4">
      <div className="bg-white shadow-md border rounded min-h-10v min-w-full">
        <div className="w-full">
          <div className="w-full border-2">
            <div className="flex flex-wrap justify-between p-2">
              <div className="col-start-1 col-end-4  text-base">
                <div className="flex w-full">
                  <div className="hidden md:block">
                    <ShimmerThumbnail
                      height={200}
                      width={300}
                      className="m-0"
                      rounded
                    />
                  </div>
                  <div className="flex w-full flex-col ml-3 mt-4 space-y-2">
                    <ShimmerBadge width={200} />
                    <ShimmerBadge width={300} />
                    <ShimmerBadge width={200} />
                    <ShimmerBadge width={300} />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t-2 px-4 py-2 my-2">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-start-1 col-end-6 flex flex-col text-base">
                  <div className="my-1">
                    <ShimmerTitle />
                  </div>
                  <div className="my-1 relative">
                    <ShimmerTitle />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t-2 min-h-15v flex text-center">
              <div className="w-1/2 border-r px-4 py-2 ">
                <ShimmerBadge width={300} />
                <ShimmerTitle line={3} variant="secondary" />
              </div>
              <div className="w-1/2 border-l px-4 py-3">
                <div className="my-1">
                  <ShimmerBadge width={300} />
                  <ShimmerTitle line={3} variant="secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md border rounded min-h-10v min-w-full">
        <div className="w-full">
          <div className="w-full border-2">
            <div className="flex flex-wrap justify-between p-2">
              <div className="col-start-1 col-end-4  text-base">
                <div className="flex w-full">
                  <div className="hidden md:block">
                    <ShimmerThumbnail
                      height={200}
                      width={300}
                      className="m-0"
                      rounded
                    />
                  </div>
                  <div className="flex w-full flex-col ml-3 mt-4 space-y-2">
                    <ShimmerBadge width={200} />
                    <ShimmerBadge width={300} />
                    <ShimmerBadge width={200} />
                    <ShimmerBadge width={300} />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t-2 px-4 py-2 my-2">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-start-1 col-end-6 flex flex-col text-base">
                  <div className="my-1">
                    <ShimmerTitle />
                  </div>
                  <div className="my-1 relative">
                    <ShimmerTitle />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t-2 min-h-15v flex text-center">
              <div className="w-1/2 border-r px-4 py-2 ">
                <ShimmerBadge width={300} />
                <ShimmerTitle line={3} variant="secondary" />
              </div>
              <div className="w-1/2 border-l px-4 py-3">
                <div className="my-1">
                  <ShimmerBadge width={300} />
                  <ShimmerTitle line={3} variant="secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShimmerScenarioList;
