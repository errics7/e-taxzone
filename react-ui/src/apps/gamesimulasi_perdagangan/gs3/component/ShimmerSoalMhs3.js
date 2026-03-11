import { ShimmerBadge, ShimmerTable } from "react-shimmer-effects";

export default function ShimmerSoalMhs3() {
  return (
    <>
      <div className="p-3">
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
          <ShimmerTable row={3} col={5} />
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
