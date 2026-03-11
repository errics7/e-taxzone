import { Slide } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import MenuItemInfoAreaControlAdmin from "./MenuItemInfoAreaControlAdmin";
import MenuLinkAreaControlAdmin from "./MenuLinkAreaControlAdmin";
import MenuRotationAreaControlAdmin from "./MenuRotationAreaControlAdmin";
import MenuLinkGSAdmin from "./MenuLinkGSAdmin";

function BottomSheetContainer(props) {
  const { selectedid, menu, dataInfo, setDataInfo } = props;
  const cfg = useSelector((state) => state.config);
  const status = cfg.status !== "" ? true : false;

  return (
    <Slide direction="up" in={status} mountOnEnter unmountOnExit>
      <div className="absolute inset-x-0 bottom-0 flex flex-row justify-center">
        <div className="w-full lg:w-1/2 min-h-30v bg-white rounded">
          {cfg.status === "rotationArea" && <MenuRotationAreaControlAdmin />}
          {cfg.status === "itemInfoArea" && (
            <MenuItemInfoAreaControlAdmin
              dataInfo={dataInfo}
              setDataInfo={(x) => setDataInfo(x)}
            />
          )}
          {cfg.status === "itemLinkArea" && (
            <MenuLinkAreaControlAdmin
              selectedid={selectedid}
              menu={menu}
              dataInfo={dataInfo}
              setDataInfo={(x) => setDataInfo(x)}
            />
          )}
          {cfg.status === "itemLinkGS" && (
            <MenuLinkGSAdmin
              dataInfo={dataInfo}
              setDataInfo={(x) => setDataInfo(x)}
            />
          )}
        </div>
      </div>
    </Slide>
  );
}

export default BottomSheetContainer;
