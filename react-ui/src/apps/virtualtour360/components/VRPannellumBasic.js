import { find } from "lodash";
import { Pannellum } from "pannellum-react";
import ReactDOM from "react-dom";
//#region
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItemInfoArea, setItemLinkGS } from "../../../redux/configSlice";
import API from "../../../utils/host.config";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import toast from "react-hot-toast";
//#endregion

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

function VRPannellumBasic(props) {
  const { dataArea, camRef, dataInfo, dataMenu } = props;
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
      if (find(dataMenu, { id: item.to_id })) {
        props.setSelectedid(Number(item.to_id));
      } else {
        toast.error(
          "Area tujuan belum tersedia, Silahkan hubungi dosen untuk area ini.",
          {
            style: {
              minWidth: "250px",
              border: "1px solid #FF4C4D",
              padding: "16px",
              color: "#000",
              marginBottom: "25px",
            },
            error: {
              duration: 3500,
            },
          }
        );
      }
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
    const note =
      args.type === "itemLinkArea"
        ? "Menuju " + find(dataMenu, { id: args.to_id })?.name
        : args.name;

    const b = (
      <LightTooltip
        title={note}
        placement="top"
        arrow
        sx={{
          "& .MuiTooltip-arrow": {
            color: "#FFFFFF",
          },
        }}
        // PopperProps={{
        //   modifiers: {
        //     offset: {
        //       enabled: true,
        //       offset: "-20, 0",
        //     },
        //   },
        // }}
      >
        <div>
          {args.type === "itemInfoArea" && (
            <img
              id={args.uid}
              className="itemInfoArea"
              width="70px"
              height="70px"
              src={require("../assets/icon/infobasic.gif")}
              alt="item-virtualtour-polinema"
            />
          )}
          {args.type === "itemLinkArea" && (
            <img
              id={args.uid}
              className="itemLinkArea"
              width="70px"
              height="70px"
              src={require("../assets/icon/movee.gif")}
              alt="item-virtualtour-polinema"
            />
          )}
          {args.type === "itemLinkGS" && (
            <img
              id={args.uid}
              className="itemLinkGS animate-lompat"
              width="90px"
              height="90px"
              src={require("../assets/icon/itemgs.gif")}
              alt="item-virtualtour-polinema"
            />
          )}
        </div>
      </LightTooltip>
    );
    // b.appendChild(image);

    // hotSpotDiv.appendChild(image);
    ReactDOM.render(b, hotSpotDiv);
    //
  };
  //#endregion

  return (
    <div className="w-screen h-full">
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
        showZoomCtrl={false}
        showControls={false}
        compass
        onLoad={(err) => {}}
        onError={(err) => {
          console.log("Error");
          console.log("Error", err);
        }}
        onErrorcleared={(err) => {
          console.log("Error");
          console.log("Error", err);
        }}
      >
        {dataInfo.map((item, i) => {
          return (
            <Pannellum.Hotspot
              key={i}
              type="custom"
              pitch={item.pitch}
              yaw={item.yaw}
              tooltipArg={item}
              tooltip={hotspotIcon}
              cssClass="custom-hotspot"
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

export default VRPannellumBasic;
