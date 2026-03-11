import React, { useState } from "react";
import { Menu, Close } from "@mui/icons-material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Button, Divider, IconButton, Slide, Tooltip } from "@mui/material";
import polinema from "../assets/icon/Polinema.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { useDispatch, useSelector } from "react-redux";
import { setRotationArea, clean } from "../../../redux/configSlice";
import swal from "sweetalert";

function MenuLeftAdmin(props) {
  const dispatch = useDispatch();
  const cfg = useSelector((state) => state.config);
  const { dataMenu, dataArea, selectedid, setSelectedid } = props;
  const [menu, setMenu] = useState(true);

  const startRotationCtrl = () => {
    if (cfg.status === "rotationArea") {
      dispatch(clean());
    } else {
      const curr = {
        pitch: Number(dataArea.pitch),
        yaw: Number(dataArea.yaw),
        hfov: Number(dataArea.hfov),
      };
      dispatch(
        setRotationArea({
          _id: dataArea.id,
          current: curr,
          prev: curr,
        })
      );
    }
  };

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
            {/* <img src={polinema} alt="" /> */}
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
                  {slct && (
                    <>
                      {dataArea && dataArea.updated_by === 0 && (
                        <div className="flex items-center absolute inset-y-0 -right-1 group">
                          <PriorityHighIcon
                            fontSize="small"
                            className="-mt-2 text-red-500 animate-bounce"
                          />
                        </div>
                      )}
                      <div className="flex items-center absolute inset-y-0 right-1 group">
                        <Tooltip
                          arrow
                          title="Click untuk mengatur posisi awal area"
                        >
                          <IconButton
                            aria-label="setting"
                            onClick={() => startRotationCtrl()}
                            size="small"
                          >
                            <DisplaySettingsIcon
                              fontSize="small"
                              className="group-hover:text-blue-500"
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </>
                  )}
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

export default MenuLeftAdmin;
