import { ShimmerTable, ShimmerSectionHeader } from "react-shimmer-effects";

export default function ShimmerWorksheetMhs13() {
  return (
    <>
      <div className="pb-32 mt-10 mb-10 border-b">
        <ShimmerSectionHeader center />
        <div className="-mt-10">
          <ShimmerTable row={5} col={5} />
        </div>
      </div>
    </>
  );
}
