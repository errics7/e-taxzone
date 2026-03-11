import {
  ShimmerTable,
  ShimmerTitle,
  ShimmerSectionHeader,
  ShimmerButton,
} from "react-shimmer-effects";

export default function ShimmerMhs10() {
  return (
    <div className="pl-1 pt-8 bg-white">
      <div>
        <ShimmerTitle />
        <div className="border-2 border-opacity-50 p-2">
          <div className="flex justify-between">
            <ShimmerButton size="lg" />
            <ShimmerButton size="lg" />
          </div>
          <ShimmerTable row={2} col={5} />
        </div>
      </div>
      <div>
        <ShimmerTitle />
        <div className="border-2 border-opacity-50 p-2">
          <div className="flex justify-between">
            <ShimmerButton size="lg" />
            <ShimmerButton size="lg" />
          </div>
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
