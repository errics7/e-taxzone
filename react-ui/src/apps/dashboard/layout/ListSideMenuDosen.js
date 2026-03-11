//#region
import React, { useState } from "react";
import withStyles from "@mui/styles/withStyles";
import { useSelector } from "react-redux";
import Collapse from "@mui/material/Collapse";
import MuiListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

import { Link } from "react-router-dom";
import ItemSideNav from "../component/ItemSideNav";
import { Assignment, FactCheck, Grade, QuizSharp, Score } from "@mui/icons-material";

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

export default function ListSideMenuDosen(props) {
  const { segment: history } = props;
  const [openScenList, setOpenSkenList] = useState(false); //nested GS
  const scen = useSelector((state) => state.scen);

  return (
    <div className="mt-7 text-slate-200">
      <Link to="/dosen">
        <ItemSideNav
          locHistory={history.length === 2 ? history[1] : "no"}
          routeSelcted="dosen"
          text="Dasboard"
          icon={<DashboardIcon />}
        />
      </Link>
      <Link to="/dosen/skenario">
        <ItemSideNav
          locHistory={history[2]}
          routeSelcted="skenario"
          text="SPT Tahunan"
          icon={<AutoAwesomeMotionIcon />}
        />
      </Link>
      {/* <Link
        to={`/dosen/sc/${scen.selectedcode === "-"
          ? "-/gssimulasi"
          : scen.selectedcode + "/gssimulasi"
          }`}
      >
        <ItemSideNav
          locHistory={history[4]?.split("-")[0].substr(0, 2)}
          routeSelcted="gs"
          text="Materi"
          icon={<AssignmentIcon />}
        />
      </Link> */}
      {/* <Link to="/dosen/questionnaire-mhs">
        <ItemSideNav
          locHistory={history[2]}
          routeSelcted="questionnaire-mhs"
          text="Kuisioner"
          icon={<FactCheck />}
        />
      </Link> */}
      {/* <Link to="/dosen/hasil-mhs">
        <ItemSideNav
          locHistory={history[2]}
          routeSelcted="hasil-mhs"
          text="Nilai Mahasiswa"
          icon={<Grade />}
        />
      </Link> */}

      {/* <ListItem
        button
        onClick={() => {
          setOpenSkenList(!openScenList);
        }}
        selected={history[2] === "sc"}
      >
        <ListItemIcon>
          <BackupTableIcon  />
        </ListItemIcon>
        <ListItemText primary="Skenario" />
        {openScenList ? <ExpandLess /> : <ExpandMore />}
      </ListItem> */}
      {/* GS Collapse */}
      {/* <Collapse in={openScenList} timeout="auto" unmountOnExit>
        <Link
          to={`/dosen/sc/${scen.selectedcode === "-"
            ? "-/gssimulasi"
            : scen.selectedcode + "/gssimulasi"
            }`}
        >
          <ItemSideNav
            locHistory={history[4]?.split("-")[0].substr(0, 2)}
            routeSelcted={"gs"}
            text="Game OOP"
            level={1}
            icon={<AssignmentIcon  />}
          />
        </Link>
      </Collapse> */}
      <Link to="/dosen/user">
        <ItemSideNav
          locHistory={history[2]}
          routeSelcted="user"
          text="Mahasiswa"
          icon={<SupervisorAccountIcon />}
        />
      </Link>
      <br />
    </div>
  );
}

export function SecondaryListItems(props) {
  const user = useSelector((state) => state.user.value);
  const history = props.segment;

  const [open, setOpen] = React.useState(false); //Sidebar Settings

  return (
    <div>
      {user.authorize === "dosen" && (
        <>
          <ListItem
            button
            onClick={() => setOpen(!open)}
            selected={props.segment[1] === "setting"}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Link to="/setting">
              <ItemSideNav
                locHistory={history[2]}
                routeSelcted="setting"
                text="Account"
                level={1}
                icon={<AccountCircleIcon />}
              />
            </Link>
          </Collapse>
        </>
      )}
    </div>
  );
}
