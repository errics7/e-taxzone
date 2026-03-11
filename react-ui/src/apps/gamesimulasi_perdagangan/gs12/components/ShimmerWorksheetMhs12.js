import { ShimmerTable, ShimmerSectionHeader } from "react-shimmer-effects";

export default function ShimmerWorksheetMhs12() {
  return (
    <>
      <div className="pb-32 mt-10 mb-10 border-b">
        <ShimmerSectionHeader center />
        <div className="-mt-10">
          <ShimmerTable row={2} col={5} />
        </div>
      </div>
    </>
  );
}
