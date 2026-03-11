import { ShimmerTable, ShimmerTitle } from "react-shimmer-effects";

export default function ShimmerMhsSoal12() {
  return (
    <div className="pl-1">
      <div>
        <ShimmerTitle />
        <div>
          <ShimmerTable row={2} col={5} />
        </div>
      </div>
      <div>
        <ShimmerTitle />
        <div>
          <ShimmerTable row={2} col={5} />
        </div>
      </div>
      <div>
        <div className="w-64">
          <ShimmerTable row={4} col={2} />
        </div>
      </div>
    </div>
  );
}
