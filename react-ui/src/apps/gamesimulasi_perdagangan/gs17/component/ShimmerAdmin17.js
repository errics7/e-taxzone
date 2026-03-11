import { ShimmerTable, ShimmerSectionHeader } from "react-shimmer-effects";

export default function ShimmerAdmin17() {
  return (
    <div className="bg-white">
      <div className="pl-1 pt-5 pb-10 mb-5 border-b-2 border-slate-100">
        <ShimmerSectionHeader center />
        <div className="-mt-10">
          <ShimmerTable row={6} col={5} />
        </div>
      </div>
      <div className="pl-1 pb-10 mb-5 max-w-4xl">
        <ShimmerSectionHeader center />
        <div className="-mt-10">
          <ShimmerTable row={4} col={4} />
        </div>
      </div>
    </div>
  );
}
