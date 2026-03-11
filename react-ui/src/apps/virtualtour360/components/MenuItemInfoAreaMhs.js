import React from "react";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddLinkIcon from "@mui/icons-material/AddLink";
import ReactAudioPlayer from "react-audio-player";
import API from "../../../utils/host.config";
import { useDispatch, useSelector } from "react-redux";
import { clean } from "../../../redux/configSlice";
import { find } from "lodash";

function MenuItemInfoAreaMhs(props) {
  const { dataInfo } = props;
  const dispatch = useDispatch();
  const cfg = useSelector((state) => state.config);
  const data = find(dataInfo, { uid: cfg.data.uid });

  const setDefaultSrc = () => {
    const img = document.getElementById(cfg.data.uid);
    if (cfg.data.current.type === "itemInfoArea") {
      img.setAttribute("src", require("../assets/icon/infobasic.gif"));
    }
    if (cfg.data.current.type === "itemLinkArea") {
      img.setAttribute("src", require("../assets/icon/movee.gif"));
    }
    if (cfg.data.current.type === "itemLinkGS") {
      img.setAttribute("src", require("../assets/icon/itemgs.gif"));
    }
  };

  return (
    <div className="w-full relative min-h-40v rounded overflow-hidden z-50 border bg-slate-50 text-slate-600">
      <div className="absolute top-0 w-full bg-white flex border-b-2 justify-between md:flex-row items-center px-4 py-1.5 border-t border-solid border-blueslate-200 rounded-b">
        <h1 className="text-left font-bold">Detail Informasi</h1>
        <IconButton
          onClick={() => {
            setDefaultSrc();
            dispatch(clean());
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="mx-3 pl-1 flex flex-col pt-16 pb-16 max-h-40v overflow-y-scroll">
        <p className="font-bold text-slate-600">{data ? data.name : ""}</p>
        <p className="text-sm pt-1">{data ? data.deskripsi : ""}</p>

        <div className="mt-5 flex items-center justify-between">
          {data && data.url_audio !== null && data.url_audio !== "" && (
            <ReactAudioPlayer
              src={API.HOST + "/" + data.url_audio}
              controls
              className="shadow-md bg-slate-100 rounded border"
            />
          )}

          {data && data.to_link !== null && data.to_link !== "" && (
            <div className="pr-5">
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddLinkIcon />}
                onClick={() => {
                  window.open(data.to_link, "_blank");
                }}
              >
                External Link
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuItemInfoAreaMhs;
