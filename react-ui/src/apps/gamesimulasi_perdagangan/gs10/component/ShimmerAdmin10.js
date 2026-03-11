import {
  ShimmerTable,
  ShimmerTitle,
  ShimmerSectionHeader,
} from "react-shimmer-effects";

export default function ShimmerAdmin10() {
  return (
    <div className="pl-1 pt-8 bg-white">
      <div>
        <ShimmerTitle />
        <div>
          <ShimmerTable row={2} col={5} />
        </div>
      </div>
      <div>
        <ShimmerTitle />
        <div>
          <ShimmerTable row={2} col={5} />
        </div>
      </div>
      <div>
        <ShimmerTitle />
        <div>
          <ShimmerTable row={2} col={5} />
        </div>
      </div>
      <div className="pb-32 mt-16 mb-10">
        <ShimmerSectionHeader center />
        <div className="-mt-10">
          <ShimmerTable row={2} col={5} />
        </div>
      </div>
    </div>
  );
}
