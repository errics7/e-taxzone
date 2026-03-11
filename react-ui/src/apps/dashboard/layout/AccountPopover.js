import { useRef, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/userSlice";
// material
import { alpha } from "@mui/material/styles";
import {
  Button,
  Box,
  Divider,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
// components
import Iconify from "../component/Iconify";
import MenuPopover from "../component/MenuPopover";
import API from "../../../utils/host.config"

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Home",
    icon: "eva:home-fill",
    linkTo: "/",
  },
  {
    label: "Dashboard",
    icon: "ic:baseline-dashboard",
    linkTo: "/",
  },
  {
    label: "Kelola Akun",
    icon: "eva:person-fill",
    linkTo: "/setting",
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const history = useHistory();
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user.value);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          border: "2px",
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[700], 0.5),
            },
          }),
        }}
      >
        <Avatar src={`${API.HOST}${user.img_url}`} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap className="capitalize">
            {user ? user.nama : "Terjadi kesalahan"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user
              ? user?.email
                ? user?.email
                : "@email Belum diatur"
              : "Terjadi kesalahan"}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) =>
          option.label === "Home" ? (
            <MenuItem
              key={option.label}
              to={`/`}
              component={RouterLink}
              onClick={handleClose}
              sx={{ typography: "body2", py: 1, px: 2.5 }}
            >
              <Iconify
                icon={option.icon}
                sx={{
                  mr: 2,
                  width: 24,
                  height: 24,
                }}
              />

              {option.label}
            </MenuItem>
          ) : (
            <MenuItem
              key={option.label}
              to={`/${user.authorize === "mahasiswa" ? "home" : user.authorize
                }${option.linkTo}`}
              component={RouterLink}
              onClick={handleClose}
              sx={{ typography: "body2", py: 1, px: 2.5 }}
            >
              <Iconify
                icon={option.icon}
                sx={{
                  mr: 2,
                  width: 24,
                  height: 24,
                }}
              />

              {option.label}
            </MenuItem>
          )
        )}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={() => {
              history.replace(`/`);
              dispatch(logout());
            }}
          >
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
