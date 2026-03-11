import React from "react";
import withStyles from '@mui/styles/withStyles';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import Menu from "@mui/material/Menu";

import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import toast from "react-hot-toast";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    marginRight: "40px",
    fontSize: "10px",
  },
})((props) => (
  <Menu
    elevation={0} 
    anchorOrigin={{
      vertical: "center",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "center",
      horizontal: "left",
    }}
    {...props}
  />
));

export default function PopMenuRowWorksheet17(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        style={{
          marginRight: "0px",
        }}
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon fontSize="inherit" />
      </IconButton>

      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className="flex flex-col text-slate-600">
          {!props.keykey ? (
            <div
              className="group flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-slate-100"
              onClick={() => {
                handleClose();
                props.changeKey();
                toast.success("Status Data berhasil diubah");
              }}
            >
              <VpnKeyIcon
                fontSize="small"
                className="group-hover:text-emerald-500"
              />
              <span className="pl-2 text-xs">
                Jadikan {props.keynamed} Sbg Soal
              </span>
            </div>
          ) : (
            <div
              className="group flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-slate-100 "
              onClick={() => {
                handleClose();
                props.changeKey();
                toast.success("Status Data berhasil diubah");
              }}
            >
              <div className="relative">
                <VpnKeyIcon
                  fontSize="small"
                  className="group-hover:text-red-500 p-0.5"
                />
                <NotInterestedIcon
                  fontSize="medium"
                  className="group-hover:text-red-500 absolute inset-0 -left-0.5 -top-0.5"
                />
              </div>
              <span className="pl-2 text-xs">
                Hilangkan '{props.keynamed}' Sbg Soal
              </span>
            </div>
          )}

          {props.addRow && (
            <div
              className="group flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-slate-100"
              onClick={() => {
                handleClose();
                props.addRow();
              }}
            >
              <AddCircleOutlineIcon
                fontSize="small"
                className="group-hover:text-emerald-400"
              />
              <span className="pl-2 text-xs">Tambah Data Baru</span>
            </div>
          )}

          {props.removeRow && props.length > 1 && (
            <div
              className={`group flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-slate-100`}
              onClick={() => {
                handleClose();
                props.removeRow();
                toast("Data berhasil dihapus", {
                  icon: (
                    <DeleteIcon fontSize="small" className="text-red-400" />
                  ),
                });
              }}
            >
              <DeleteIcon
                fontSize="small"
                className="group-hover:text-red-500"
              />
              <span className="pl-2 text-xs">Hapus baris data</span>
            </div>
          )}
        </div>
      </StyledMenu>
    </div>
  );
}
