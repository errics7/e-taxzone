import { ShimmerBadge, ShimmerTable } from "react-shimmer-effects";

export default function ShimmerAdmin2() {
  return (
    <>
      <div className="pt-8">
        <ShimmerBadge width={200} />
        <div className="my-3 flex justify-center">
          <ShimmerBadge width={300} />
        </div>
        <ShimmerTable row={4} col={5} />
      </div>

      <br />
      <div className="p-3">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <ShimmerBadge width={200} />
          </div>
          <ShimmerTable row={3} col={5} />
        </div>
      </div>
    </>
  );
}
