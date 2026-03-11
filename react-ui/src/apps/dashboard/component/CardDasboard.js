import React from "react";
import { Link } from "react-router-dom";

export default function CardDasboard(props) {
  return (
    <>
      <Link to={props.to}>
        <div className="relative container w-full mx-auto  bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-lg transform hover:scale-102 duration-500">
          <img className="w-full h-56" src={props.url} alt="" />
          <div className="absolute inset-x-0 bottom-0 bg-white text-center py-4">
            <h1 className="mb-1 text-2xl font-sans font-semibold text-slate-700 hover:text-slate-900 cursor-pointer">
              {props.title}
            </h1>
          </div>
        </div>
      </Link>
    </>
  );
}
