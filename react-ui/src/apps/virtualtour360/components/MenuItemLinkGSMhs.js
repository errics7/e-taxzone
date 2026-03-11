import React from "react";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { clean } from "../../../redux/configSlice";
import { find } from "lodash";
import Lottie from "lottie-react";
import workonline from "../assets/lottie/workonline.json";
import { useHistory } from "react-router-dom";

function MenuItemLinkGSMhs(props) {
  const { dataInfo } = props;
  const dispatch = useDispatch();
  const cfg = useSelector((state) => state.config);
  const data = find(dataInfo, { uid: cfg.data.uid });
  const history = useHistory();

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
    <div className="w-full relative min-h-30v rounded overflow-hidden z-50 border bg-slate-50 text-slate-600">
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
      <div className="mx-6 pl-1 flex justify-center pt-16 pb-16 items-center min-h-30v">
        <div className="w-2/6">
          <Lottie animationData={workonline} loop={true} />
        </div>
        <div className="px-3">
          <p className="font-bold text-slate-600">{data ? data.name : ""}</p>
          <p className="text-sm pt-1">{data ? data.deskripsi : ""}</p>
          <div className="mt-5">
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => {
                history.push("/" + data?.to_link);
                dispatch(clean());
              }}
            >
              Menuju Game Simulasi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuItemLinkGSMhs;
