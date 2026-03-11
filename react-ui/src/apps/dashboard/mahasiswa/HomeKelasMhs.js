import React from "react";
import { Helmet } from "react-helmet";

import Grid from "@mui/material/Grid";
import Search from "../component/Search";
import { Link } from "react-router-dom";

export default function HomeKelasMhs(props) {
  const { dataKelas } = props;

  return (
    <div className="">
      <Helmet>
        <title>Daftar kelas</title>
      </Helmet>
      <Search
      // update={() => setUpdated(updated + 1)}
      />
      {/*  */}
      <div className="w-full flex flex-col items-center relative">
        <Grid container spacing={3} className="max-w-6xl mx-auto">
          {dataKelas.length === 0 && (
            <Grid item xs={12} md={12} lg={12}>
              <div className="my-5 p-5 h-32 bg-white text-center text-xl">
                Tidak ada Course tersedia.
              </div>
            </Grid>
          )}
          {/* CONTAINER */}
          <div className="mt-5 grid grid-cols-3 grid-flow-col gap-4 w-full max-w-5xl mx-auto">
            {dataKelas.map((item, i) => { 
              return (
                <Link key={i} to={`/home/kelas/${item.k_code}`}>
                  <div className="p-5 my-2 text-lg bg-white shadow rounded border-t w-full hover:shadow-md transform hover:scale-102 duration-500">
                    {item.namakelas}
                  </div>
                </Link>
              );
            })}
          </div>
          {/* END CONTAINER */}
        </Grid>
      </div>
    </div>
  );
}
