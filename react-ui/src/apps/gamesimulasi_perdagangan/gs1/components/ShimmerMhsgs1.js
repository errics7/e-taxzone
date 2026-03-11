import { Grid } from "@mui/material";
import { ShimmerTable, ShimmerTitle } from "react-shimmer-effects";

export default function ShimmerMhsgs1() {
  return (
    <Grid item xs={12} md={12} lg={12}>
      <div className="bg-white px-3">
        <div className="">
          <ShimmerTitle line={2} variant="secondary" />
          <ShimmerTable row={2} col={3} />
        </div>
        <br />
        <div className="">
          <ShimmerTitle line={2} variant="secondary" />
          <ShimmerTable row={2} col={3} />
        </div>
      </div>
    </Grid>
  );
}
