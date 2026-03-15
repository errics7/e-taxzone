import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Drawer } from "@mui/material";
import { useLocation } from "react-router-dom";

// hooks
import useResponsive from "../../../utils/useResponsive";
// components
import Logo from "../component/Logo";
import Scrollbar from "../component/Scrollbar";
//
import ListSideMenuMhs from "./ListSideMenuMhs";
import ListSideMenuAdmin from "./ListSideMenuAdmin";
import ListSideMenuDosen from "./ListSideMenuDosen";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 256;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar, dataKelas }) {
  const isDesktop = useResponsive("up", "lg");
  let location = useLocation();
  const user = useSelector((state) => state.user.value);
  const segment = location.pathname.split("/");

  const menuSwitch = () => {
    switch (user.authorize) {
      case "mahasiswa":
        return <ListSideMenuMhs segment={segment} dataKelas={dataKelas} closeSide={onCloseSidebar} />;
      case "dosen":
        return <ListSideMenuDosen segment={segment} />;
      case "admin":
        return <ListSideMenuAdmin segment={segment} />;
      default:
        return <ListSideMenuMhs segment={segment} />;
    }
  };

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.neutral",
              borderRightStyle: "dashed",
            },
          }}
        >
          <Scrollbar
            sx={{
              height: 1,
              "& .simplebar-content": {
                height: 1,
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <div className="flex justify-center relative">
              <Logo />
              {/* Polinema */}
            </div>
            {menuSwitch()}
          </Scrollbar>
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.neutral",
              borderRightStyle: "dashed",
            },
          }}
        >
          <Scrollbar
            sx={{
              height: 1,
              "& .simplebar-content": {
                height: 1,
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <div className="flex justify-center text-white text-2xl">
              <Logo />
              {/* Polinema */}
            </div>
            {menuSwitch()}
          </Scrollbar>
        </Drawer>
      )}
    </RootStyle>
  );
}
