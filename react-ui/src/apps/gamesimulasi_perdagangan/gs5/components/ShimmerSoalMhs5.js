import {
  ShimmerBadge,
  ShimmerTable,
  ShimmerTitle,
} from "react-shimmer-effects";

export default function ShimmerSoalMhs5() {
  return (
    <>
      <div className="p-3">
        <ShimmerTitle />
        <div className="w-72 -mt-3">
          <ShimmerTable row={2} col={2} />
        </div>
        <br />
        <hr />
        <br />
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div>
              <ShimmerBadge width={200} />
              <ShimmerBadge width={300} />
            </div>
            <div>
              <ShimmerBadge width={200} />
              <ShimmerBadge width={150} />
            </div>
          </div>
          <ShimmerTable row={3} col={5} />
          <div className="flex mt-3 flex-row-reverse">
            <div>
              <ShimmerBadge width={200} />
              <ShimmerBadge width={150} />
              <ShimmerBadge width={200} />
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <hr />
        <br />
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div>
              <ShimmerBadge width={200} />
              <ShimmerBadge width={300} />
            </div>
            <div>
              <ShimmerBadge width={200} />
              <ShimmerBadge width={150} />
            </div>
          </div>
          <div className="grid grid-cols-6">
            <div className="col-start-2 col-end-6">
              <ShimmerTable row={2} col={2} />
            </div>
          </div>
          <div className="flex mt-3 flex-row-reverse">
            <div>
              <ShimmerBadge width={200} />
              <ShimmerBadge width={150} />
              <ShimmerBadge width={200} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
