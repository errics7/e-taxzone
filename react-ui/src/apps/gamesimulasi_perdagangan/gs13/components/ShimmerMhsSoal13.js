import {
  ShimmerTable,
  ShimmerSectionHeader,
  ShimmerTitle,
} from "react-shimmer-effects";

export default function ShimmerMhsSoal13() {
  return (
    <div className="pl-1">
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
