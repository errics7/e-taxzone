import React, { useState } from "react";
import { Menu, Close } from "@mui/icons-material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Button, Divider, Slide } from "@mui/material";
import polinema from "../assets/icon/Polinema.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { useSelector } from "react-redux";
import swal from "sweetalert";

function MenuLeftBasic(props) {
  const cfg = useSelector((state) => state.config);
  const { dataMenu, selectedid, setSelectedid } = props;
  const [menu, setMenu] = useState(true);

  return (
    <div className="absolute top-0 left-0 z-50 opacity-100 overflow-hidden flex flex-row">
      <Slide direction="right" in={menu} mountOnEnter unmountOnExit>
        <div className="w-52 ml-5 mt-8 rounded overflow-hidden bg-white backdrop-blur-sm bg-opacity-50 text-slate-600">
          <div className="z-50 py-10 px-3 bg-blue-300 backdrop-blur-sm bg-opacity-50">
            <LazyLoadImage
              alt="profile-virtualtour"
              effect="blur"
              src={polinema}
              className="z-50"
            />
          </div>
          {dataMenu && dataMenu.length !== 0 ? (
            dataMenu.map((item, i) => {
              const slct =
                Number(selectedid) === Number(item.id) ? true : false;

              return (
                <div key={i} className="relative w-full">
                  <Button
                    size="medium"
                    fullWidth
                    style={{
                      borderRadius: 0,
                      paddingLeft: 5,
                      paddingRight: 5,
                    }}
                    onClick={() => {
                      if (cfg.status === "") {
                        setSelectedid(item.id);
                      } else {
                        swal(
                          "Peringatan!",
                          "Selesaikan operasi sebelumnya sebelum berpindah area",
                          "error"
                        );
                      }
                    }}
                  >
                    <p className={`mx-5 truncate ${!slct && "text-slate-600"}`}>
                      {item.name}
                    </p>
                    {slct && (
                      <div className="flex items-center absolute inset-y-0 left-1">
                        <ArrowForwardIcon fontSize="small" />
                      </div>
                    )}
                  </Button>
                  <Divider />
                </div>
              );
            })
          ) : (
            <div className="p-2">
              <ShimmerThumbnail height={24} className="m-0" rounded />
              <ShimmerThumbnail height={24} className="m-0" rounded />
              <ShimmerThumbnail height={24} className="m-0" rounded />
            </div>
          )}
        </div>
      </Slide>
      <div className="relative m-5 mt-8">
        <button
          onClick={() => setMenu(!menu)}
          className="block border shadow-2xl rounded bg-white p-2 focus:outline-none "
        >
          {!menu ? <Menu /> : <Close />}
        </button>
      </div>
    </div>
  );
}

export default MenuLeftBasic;
