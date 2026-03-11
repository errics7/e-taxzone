import {
  ShimmerBadge,
  ShimmerTable,
  ShimmerSectionHeader,
} from "react-shimmer-effects";

export default function ShimmerSoalMhs8() {
  return (
    <div className="bg-white pt-8">
      <div className="p-3">
        <div className="flex flex-col">
          <ShimmerSectionHeader center />
          <div className="-mt-10">
            <ShimmerTable row={3} col={5} />
            <div>
              <ShimmerBadge width={500} />
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className="flex flex-col">
          <ShimmerSectionHeader center />
          <div className="-mt-10">
            <ShimmerTable row={3} col={5} />
            <div>
              <ShimmerBadge width={500} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
