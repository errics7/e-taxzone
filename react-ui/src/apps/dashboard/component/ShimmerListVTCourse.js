import React from "react";
import { ShimmerThumbnail } from "react-shimmer-effects";

function ShimmerListVTCourse(props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 p-3">
      <ShimmerThumbnail height={140} className="m-0" rounded />
      <ShimmerThumbnail height={140} className="m-0" rounded />
      <ShimmerThumbnail height={140} className="m-0" rounded />
      <ShimmerThumbnail height={140} className="m-0" rounded />
      <ShimmerThumbnail height={140} className="m-0" rounded />
      <ShimmerThumbnail height={140} className="m-0" rounded />
      <ShimmerThumbnail height={140} className="m-0" rounded />
    </div>
  );
}

export default ShimmerListVTCourse;
