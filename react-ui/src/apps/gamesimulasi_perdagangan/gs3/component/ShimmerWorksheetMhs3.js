import {
  ShimmerButton,
  ShimmerSectionHeader,
  ShimmerTable,
} from "react-shimmer-effects";

export default function ShimmerWorksheetMhs3() {
  return (
    <>
      <div className="p-3">
        <ShimmerSectionHeader center />
        <ShimmerTable row={2} col={5} />
      </div>
      <div className="flex items-center flex-row-reverse my-3 px-3 w-full">
        <div className="flex space-x-3 my-1 bg-gradient-to-l from-slate-50">
          <ShimmerButton size="md" />
          <ShimmerButton size="md" />
        </div>
      </div>
    </>
  );
}
