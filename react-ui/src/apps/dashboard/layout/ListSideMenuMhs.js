//#region
import React, { useState } from "react";
import withStyles from "@mui/styles/withStyles";
import Collapse from "@mui/material/Collapse";
import MuiListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ClassIcon from "@mui/icons-material/Class";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";

import { Link } from "react-router-dom";
import ItemSideNav from "../component/ItemSideNav";
import ItemSideNavKelas from "../component/ItemSideNavKelas";
import ModalSceneManager from "../component/ModalSceneManager";
import { useSelector } from "react-redux";

const ListItem = withStyles({
  root: {
    "&$selected": {
      backgroundColor: "#666666",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white",
      },
    },
    "&$selected:hover": {
      backgroundColor: "#8C8C8C",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white",
      },
    },
  },
  selected: {},
})(MuiListItem);
//#endregion

export default function ListSideMenuMhs(props) {
  const state = useSelector((state) => state.scen);
  const { segment: history, dataKelas } = props;
  const [openKelas, setOpenKelas] = useState(true); //nested Kelas
  const [manageScen, setManageScen] = useState(false);
  
  return (
    <>
      <div
        className="flex flex-row border rounded cursor-pointer mx-5 text-white hover:bg-yellow-50 hover:bg-opacity-10"
        onClick={() => setManageScen(true)}
      >
        <div className="flex-grow flex justify-center p-2 text-xs text-center font-semibold truncate">
          {state.selectedcode === "-" ? (
            <div className="relative">
              Kelas Belum Dipillih
              {/* <div className="absolute -top-0.5 -right-1.5  w-2 h-2 animate-ping bg-red-500 rounded-full z-10"></div> */}
              <div className="absolute top-0 -right-1  w-1 h-1 animate-pulse bg-red-500 rounded-full z-10"></div>
            </div>
          ) : (
            state.nama
          )}
        </div>
        <div className="flex-shrink w-10 flex justify-center items-center">
          <ClassIcon className="text-white mr-1 p-0.5 z-50" />
        </div>
      </div>
      <div className="mt-7 text-slate-200">
        <Link to="/home">
          <ItemSideNav
            locHistory={history.length === 2 ? history[1] : "no"}
            routeSelcted="home"
            text="Dasboard"
            icon={<DashboardIcon className="text-white" />}
          />
        </Link>
        <ListItem
          onClick={() => {
            setOpenKelas(!openKelas);
          }}
          button
          selected={history[2] === "f"}
        >
          <ListItemIcon>
            <ClassIcon className="text-white" />
          </ListItemIcon>
          <ListItemText primary="Kelas" />
          <IconButton
            size="small"
            onClick={() => {
              setOpenKelas(!openKelas);
            }}
          >
            {openKelas ? (
              <ExpandLess className="text-white" />
            ) : (
              <ExpandMore className="text-white" />
            )}
          </IconButton>
        </ListItem>
        {/* </Link> */}
        {/* Kelas Collapse */}
        <Collapse in={openKelas} timeout="auto" unmountOnExit>
          <Link to={`/home/f/${state.selectedcode}/gamesimulasi`}>
            <ItemSideNavKelas
              locHistory={history[4]?.split("-")[0].substr(0, 2)}
              routeSelcted={"gs"}
              text="Game Simulasi"
              level={1}
              icon={<ClassIcon className="text-white" />}
            />
          </Link>
          <Link to={`/home/f/${state.selectedcode}/virtualtour`}>
            <ItemSideNavKelas
              locHistory={history[4]}
              routeSelcted="virtualtour"
              text="Virtual Tour"
              level={1}
              icon={<ThreeDRotationIcon className="text-white" />}
            />
          </Link>
        </Collapse>
        <br />
        <ModalSceneManager
          dataKelas={dataKelas}
          openn={manageScen}
          history={history}
          closeCallback={() => setManageScen(false)}
          closeSide={() => props.closeSide()}
        />
      </div>
    </>
  );
}
