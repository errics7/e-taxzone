import { ShimmerBadge, ShimmerTable } from "react-shimmer-effects";

export default function ShimmerWorksheetMhs8() {
  return (
    <div className="bg-white">
      <div className="flex justify-between">
        <ShimmerBadge width={200} />
        <div>
          <ShimmerBadge width={200} />
          <ShimmerBadge width={200} />
        </div>
      </div>
      <div className="-mt-5">
        <ShimmerTable row={2} col={5} />
      </div>
      <div className="flex flex-row-reverse">
        <div className="flex space-x-2 my-3">
          <ShimmerBadge width={300} />
        </div>
      </div>
    </div>
  );
}
