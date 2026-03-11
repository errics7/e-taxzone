//#region
import React, { useState } from "react";
import withStyles from "@mui/styles/withStyles";
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
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useSelector } from "react-redux";
import FactoryIcon from "@mui/icons-material/Factory";
import BalanceIcon from "@mui/icons-material/Balance";
import BookIcon from "@mui/icons-material/Book";

import { Link } from "react-router-dom";
import ItemSideNav from "../component/ItemSideNav";
import { Feedback } from "@mui/icons-material";

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

export default function ListSideMenuAdmin(props) {
  const { segment: history } = props;
  const [openScenList, setOpenSkenList] = useState(false); //nested GS
  const [openScenBlog, setOpenScenBlog] = useState(false); //nested blog
  const scen = useSelector((state) => state.scen);

  return (
    <div className="mt-7 text-slate-200">
      <Link to="/admin">
        <ItemSideNav
          locHistory={history.length === 2 ? history[1] : "no"}
          routeSelcted="admin"
          text="Dasboard"
          icon={<DashboardIcon />}
        />
      </Link>
       {/* <Link to="/admin/feedback">
        <ItemSideNav
          locHistory={history[2]}
          routeSelcted="admin"
          text="Feedback"
          icon={<Feedback />}
        />
      </Link> */}
      {/* <Link to="/admin/skenario">
        <ItemSideNav
          locHistory={history[2]}
          routeSelcted="skenario"
          text="Kelas"
          icon={<AutoAwesomeMotionIcon />}
        />
      </Link> */}
      {/* <Link to="/admin/skenario">
        <ItemSideNav
          locHistory={history[2]}
          routeSelcted="skenario"
          text="Skenario List"
          icon={<AutoAwesomeMotionIcon  />}
        />
      </Link> */}
      {/* <Link
        to={`/admin/sc/${scen.selectedcode === "-"
          ? "-/gssimulasi"
          : scen.selectedcode + "/gssimulasi"
          }`}
      >
        <ItemSideNav
          locHistory={history[4]?.split("-")[0].substr(0, 2)}
          routeSelcted="skenario"
          text="Materi"
          icon={<AssignmentIcon />}
        />
      </Link> */}
      {/* GS Collapse */}
      {/* <Collapse in={openScenList} timeout="auto" unmountOnExit>
        <Link
          to={`/admin/sc/${scen.selectedcode === "-"
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
      {/* <ListItem
        button
        onClick={() => {
          setOpenScenBlog((prev) => !prev);
        }}
        selected={history[2] === "blog"}
      >
        <ListItemIcon>
          <BackupTableIcon  />
        </ListItemIcon>
        <ListItemText primary="Blog" />
        {openScenBlog ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openScenBlog} timeout="auto" unmountOnExit>
        <Link to={"/admin/blog/manufaktur"}>
          <ItemSideNav
            locHistory={history[3]}
            routeSelcted={"manufaktur"}
            text="Manufaktur"
            level={1}
            icon={<FactoryIcon  />}
          />
        </Link>
        <Link to={"/admin/blog/perdagangan"}>
          <ItemSideNav
            locHistory={history[3]}
            routeSelcted="perdagangan"
            text="Perdagangan"
            level={1}
            icon={<BalanceIcon  />}
          />
        </Link>
      </Collapse> */}
      <Link to="/admin/user">
        <ItemSideNav
          locHistory={history[2]}
          routeSelcted="user"
          text="Pengguna"
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
      {user.authorize === "admin" && (
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
