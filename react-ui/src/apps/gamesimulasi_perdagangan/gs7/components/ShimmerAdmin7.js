import {
    ShimmerBadge,
    ShimmerTable,
    ShimmerTitle,
    ShimmerSectionHeader,
  } from "react-shimmer-effects";
  
  export default function ShimmerAdmin7() {
    return (
      <>
        <div className="pb-32 mt-10 mb-10 border-b">
          <ShimmerSectionHeader center />
          <div className="-mt-10">
            <ShimmerTable row={2} col={5} />
          </div>
        </div>
        <div className="p-3">
          <ShimmerTitle />
          <div className="w-80 -mt-3 pr-60 ">
            <ShimmerTable row={2} col={4} />
          </div>
  
          <div className="flex flex-col mt-5">
            <div className="flex justify-between">
              <div>
                <ShimmerBadge width={200} />
                <ShimmerBadge width={300} />
              </div>
              <div>
                <ShimmerBadge width={200} />
                <ShimmerBadge width={150} />
              </div>
            </div>
            <ShimmerTable row={3} col={5} />
            <div className="flex mt-3 flex-row-reverse">
              <div>
                <ShimmerBadge width={200} />
                <ShimmerBadge width={150} />
                <ShimmerBadge width={200} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  