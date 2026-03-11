import { Grid } from "@mui/material";
import { ShimmerBadge, ShimmerTable } from "react-shimmer-effects";

export default function ShimmerWorksheetMhsgs1() {
  return (
    <Grid item xs={12} md={12} lg={12}>
      <div className="p-3 flex flex-col space-y-3">
        {/*  */}
        <div className="border-2">
          <div className="flex flex-col">
            <div className="flex justify-between p-3 -mb-5">
              <div className="flex items-end">
                <ShimmerBadge width={250} />
              </div>
              <div className="flex flex-col items-start">
                <ShimmerBadge width={250} />
                <ShimmerBadge width={200} />
              </div>
            </div>
            <ShimmerTable row={2} col={6} />
          </div>
        </div>
        {/*  */}
        <div className="border-2">
          <div className="flex flex-col">
            <div className="flex justify-between p-3 -mb-5">
              <div className="flex items-end">
                <ShimmerBadge width={250} />
              </div>
              <div className="flex flex-col items-start">
                <ShimmerBadge width={250} />
                <ShimmerBadge width={200} />
              </div>
            </div>
            <ShimmerTable row={2} col={6} />
          </div>
        </div>
        {/*  */}
        <div className="border-2">
          <div className="flex flex-col">
            <div className="flex justify-between p-3 -mb-5">
              <div className="flex items-end">
                <ShimmerBadge width={250} />
              </div>
              <div className="flex flex-col items-start">
                <ShimmerBadge width={250} />
                <ShimmerBadge width={200} />
              </div>
            </div>
            <ShimmerTable row={2} col={6} />
          </div>
        </div>
      </div>
    </Grid>
  );
}
