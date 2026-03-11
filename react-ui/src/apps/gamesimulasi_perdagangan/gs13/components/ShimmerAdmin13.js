import {
  ShimmerTable,
  ShimmerTitle,
  ShimmerSectionHeader,
} from "react-shimmer-effects";

export default function ShimmerAdmin13() {
  return (
    <div className="pl-1 pt-8 bg-white">
      <div className="pb-10 mb-5 border-b-2 border-slate-100">
        <ShimmerSectionHeader center />
        <div className="-mt-10">
          <ShimmerTable row={6} col={5} />
        </div>
      </div>
      <div className="py-10">
        <ShimmerTitle />
      </div>
      <div className="pb-32 mb-10"> 
        <ShimmerSectionHeader center />
        <div className="-mt-10">
          <ShimmerTable row={4} col={5} />
        </div>
      </div>
    </div>
  );
}
