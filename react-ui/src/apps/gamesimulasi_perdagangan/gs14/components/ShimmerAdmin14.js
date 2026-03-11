import { ShimmerTable, ShimmerSectionHeader } from "react-shimmer-effects";

export default function ShimmerAdmin14() {
  return (
    <div className="pl-1 pt-8 bg-white">
      <div className="pb-10 mb-5 border-b-2 border-slate-100">
        <ShimmerSectionHeader center />
        <div className="-mt-10">
          <ShimmerTable row={6} col={5} />
        </div>
      </div>
    </div>
  );
}
