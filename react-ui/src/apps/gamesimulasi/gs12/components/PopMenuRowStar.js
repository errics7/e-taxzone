import React from "react";
import withStyles from '@mui/styles/withStyles';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu"; 

import DeleteIcon from "@mui/icons-material/Delete"; 
import WrapTextIcon from '@mui/icons-material/WrapText'; 
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

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

export default function PopMenuRowStar(props) {
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
        
          <div
            className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-slate-100"
            onClick={() => {
              handleClose();
              props.setSelect();
            }}
          >
            <VerifiedUserIcon fontSize="small" className="text-emerald-600" />
            <span className="pl-2 text-xs">Pilih sbg Alokasi Dasar</span>
          </div>
          <div
            className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-slate-100"
            onClick={() => {
              handleClose();
              props.addRow();
            }}
          >
            <WrapTextIcon fontSize="small" />
            <span className="pl-2 text-xs">Tambah baris  </span>
          </div>

          <div
            className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-slate-100"
            onClick={() => {
              handleClose();
              props.removeRow();
            }}
          >
            <DeleteIcon fontSize="small" />
            <span className="pl-2 text-xs">Hapus baris</span>
          </div> 
        </div>
      </StyledMenu>
    </div>
  );
}
