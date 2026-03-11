import {
  ShimmerBadge,
  ShimmerTable,
  ShimmerSectionHeader, 
} from "react-shimmer-effects";

export default function ShimmerWorksheetMhs4() {
  return (
    <>
      <ShimmerSectionHeader center />
      <div className="-mt-10">
        <ShimmerTable row={2} col={5} />
      </div>
      <div className="flex flex-row-reverse">
        <div className="flex space-x-2 my-3">
          <ShimmerBadge width={100} /> 
          <ShimmerBadge width={100} />
        </div>
      </div>
    </>
  );
}
