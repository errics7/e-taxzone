import { ShimmerTable, ShimmerSectionHeader } from "react-shimmer-effects";

export default function ShimmerWorksheetMhs14() {
  return (
    <>
      <div className="pb-32 pt-10 mb-10 border-b bg-white">
        <ShimmerSectionHeader center />
        <div className="-mt-10">
          <ShimmerTable row={6} col={5} />
        </div>
      </div>
    </>
  );
}
