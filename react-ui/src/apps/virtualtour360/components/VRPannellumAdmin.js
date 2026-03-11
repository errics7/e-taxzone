import { Pannellum } from "pannellum-react";

//#region
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setItemInfoArea,
  setItemLinkArea,
  setItemLinkGS,
} from "../../../redux/configSlice";
import API from "../../../utils/host.config";
//#endregion

function VRPannellumAdmin(props) {
  const { dataArea, camRef, dataInfo } = props;
  const dispatch = useDispatch();
  const cfg = useSelector((state) => state.config);
  const gambar = dataArea ? API.HOST + dataArea.vtimg_url : "";

  //#region rotation
  const fovConf = () => {
    const dat =
      cfg.status === "rotationArea"
        ? {
            pitch: cfg.data.current.pitch,
            yaw: cfg.data.current.yaw,
            hfov: cfg.data.current.hfov,
          }
        : dataArea
        ? {
            pitch: dataArea.pitch,
            yaw: dataArea.yaw,
            hfov: dataArea.hfov,
          }
        : {
            pitch: 0,
            yaw: 0,
            hfov: 50,
          };
    return dat;
  };

  const clickInfo = (item) => {
    // console.log("ini", item);
    // console.log("cfg", cfg);
    //clean Previous
    document
      .querySelectorAll(".itemInfoArea")
      .forEach((el) =>
        el.setAttribute("src", require("../assets/icon/infobasic.gif"))
      );
    document
      .querySelectorAll(".itemLinkArea")
      .forEach((el) =>
        el.setAttribute("src", require("../assets/icon/movee.gif"))
      );
    document
      .querySelectorAll(".itemLinkGS")
      .forEach((el) =>
        el.setAttribute("src", require("../assets/icon/itemgs.gif"))
      );

    const img = document.getElementById(item.uid);
    if (item.type === "itemInfoArea") {
      img.setAttribute("src", require("../assets/icon/infobasic_select.gif"));
      dispatch(
        setItemInfoArea({
          prev: item,
          uid: item.uid,
          current: item,
        })
      );
    }
    if (item.type === "itemLinkArea") {
      img.setAttribute("src", require("../assets/icon/movee_select.gif"));
      dispatch(
        setItemLinkArea({
          prev: item,
          uid: item.uid,
          current: item,
        })
      );
    }
    if (item.type === "itemLinkGS") {
      img.setAttribute("src", require("../assets/icon/itemgs_select.gif"));
      dispatch(
        setItemLinkGS({
          prev: item,
          uid: item.uid,
          current: item,
        })
      );
    }
  };

  const hotspotIcon = (hotSpotDiv, args) => {
    // console.log("creating", args);
    const image = document.createElement("img");
    image.setAttribute("id", args.uid);
    image.classList.add("image");
    image.setAttribute("width", "70");
    image.setAttribute("height", "70");
    if (args.type === "itemInfoArea") {
      image.classList.add("itemInfoArea");
      image.setAttribute("src", require("../assets/icon/infobasic.gif"));
    }
    if (args.type === "itemLinkArea") {
      image.classList.add("itemLinkArea");
      image.setAttribute("src", require("../assets/icon/movee.gif"));
    }
    if (args.type === "itemLinkGS") {
      image.classList.add("itemLinkGS");
      image.classList.add("animate-lompat");
      image.setAttribute("width", "90");
      image.setAttribute("height", "90");
      image.setAttribute("src", require("../assets/icon/itemgs.gif"));
    }

    hotSpotDiv.appendChild(image);
  };
  //#endregion

  return (
    <div className="bg-red-200 w-screen h-full">
      {/* <div
        onClick={() => {
          // camRef.current.getViewer().toggleFullscreen();
          console.log("i", dataInfo);
        }}
        className="absolute bottom-16 right-4 py-1.5 px-2 cursor-pointer bg-white rounded backdrop-blur opacity-40 hover:opacity-80 z-50"
      >
        &#x2922;
      </div> */}
      <Pannellum
        ref={camRef}
        width="100%"
        height="100%"
        image={gambar}
        pitch={fovConf().pitch}
        yaw={fovConf().yaw}
        hfov={fovConf().hfov}
        mouseZoom={false}
        autoLoad
        hotspotDebug={true}
        showZoomCtrl={false}
        showControls={false}
        compass
        onLoad={() => {
          // console.log("panorama loaded");
        }}
      >
        {dataInfo.map((item, i) => {
          //   const st = cfg.status === "itemInfoArea" && cfg.data.uid === item.uid;
          //   console.log(st);
          return (
            <Pannellum.Hotspot
              key={i}
              type="custom"
              pitch={item.pitch}
              yaw={item.yaw}
              tooltipArg={item}
              tooltip={hotspotIcon}
              handleClickArg={item}
              handleClick={(evt, args) => {
                clickInfo(args);
              }}
            />
          );
        })}
      </Pannellum>
    </div>
  );
}

export default VRPannellumAdmin;
