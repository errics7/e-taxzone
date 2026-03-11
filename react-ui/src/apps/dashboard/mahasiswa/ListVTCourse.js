import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import API from "../../../utils/host.config";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import { Link, useParams } from "react-router-dom";

function ListVTCourse(props) {
  const { data } = props;
  const { code } = useParams();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 p-3">
      {data.map((item, i) => {
        return (
          <Link
            key={i}
            to={`/virtualtour/${code}/${item.id}/area`}
            className="relative group bg-white border rounded shadow flex flex-col border-t cursor-pointer hover:scale-102 transition-all hover:shadow-lg"
          >
            <LazyLoadImage
              alt="virtualtour-polinema"
              effect="blur"
              src={API.HOST + item.vtimg_url}
              className="w-full h-full"
            />
            <ThreeDRotationIcon className="absolute right-2 top-2 group-hover:text-slate-200" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-700 z-50"></div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 z-50 px-5 text-white truncate text-3xl lg:text-2xl">
              {item.name}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default ListVTCourse;
