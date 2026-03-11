import { Grid } from "@mui/material";
import {
  ShimmerBadge,
  ShimmerTable,
  ShimmerTitle,
} from "react-shimmer-effects";

export default function ShimmerMhsgs2() {
  return (
    <Grid item xs={12} md={12} lg={12}>
      <div className="bg-white px-3">
        <div className="pt-8">
          <ShimmerTitle line={2} variant="secondary" />
          <div className="pt-5 flex justify-center">
            <ShimmerBadge width={300} />
          </div>
          <ShimmerTable row={3} col={5} />
        </div>

        <br />
        <div className="border border-dashed p-3 flex flex-col space-y-3">
          <ShimmerBadge width={150} />
          <div className="border-2">
            <div className="flex flex-col">
              <div className="bg-sky-50 bg-opacity-75">
                <div className="flex justify-center pt-4">
                  <ShimmerBadge width={200} />
                </div>
                <ShimmerBadge width={250} />
              </div>
              <ShimmerTable row={2} col={6} />
            </div>
          </div>
          <div className="border-2">
            <div className="flex flex-col">
              <div className="bg-sky-50 bg-opacity-75">
                <div className="flex justify-center pt-4">
                  <ShimmerBadge width={200} />
                </div>
                <ShimmerBadge width={250} />
              </div>
              <ShimmerTable row={2} col={6} />
            </div>
          </div>
          <div className="border-2">
            <div className="flex flex-col">
              <div className="bg-sky-50 bg-opacity-75">
                <div className="flex justify-center pt-4">
                  <ShimmerBadge width={200} />
                </div>
                <ShimmerBadge width={250} />
              </div>
              <ShimmerTable row={2} col={6} />
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
}
