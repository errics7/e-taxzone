import React from "react";
import withStyles from '@mui/styles/withStyles';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";

import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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

export default function PopMenuDelBB(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="Hapus Buku besar">
        <IconButton
          aria-controls="customized-menu"
          aria-haspopup="true" 
          onClick={handleClick}
          size="small"
          className="ml-3"
        >
          <DeleteIcon
            fontSize="inherit"
            className="opacity-25 cursor-pointer hover:opacity-100 hover:text-red-400"
          />
        </IconButton>
      </Tooltip>

      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className="flex flex-col text-slate-600">
          <div className="px-1 text-sm">Anda akan Menghapus buku besar ?</div>
          <div className="flex items-center justify-center">
            <IconButton 
              onClick={() => {
                handleClose();
                props.removeBB();
              }}
              size="small"
              className="mx-5 transform hover:scale-125"
            >
              <CheckIcon
                fontSize="inherit" 
                className="hover:text-red-400"
              />
            </IconButton>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <IconButton 
              onClick={() => {
                handleClose(); 
              }}
              size="small"
              className="mx-5 transform hover:scale-125"
            >
              <CloseIcon
                fontSize="inherit" 
                className="hover:text-slate-600"
              />
            </IconButton> 
          </div>
        </div>
      </StyledMenu>
    </div>
  );
}
