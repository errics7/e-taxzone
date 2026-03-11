import React from "react";
import withStyles from "@mui/styles/withStyles";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";

import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    marginRight: "20px",
    fontSize: "10px",
  },
})((props) => (
  <Menu
    elevation={0}
    getcontentanchorel={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
));

export default function MenuPopOverScenario(props) {
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
        {/* <MoreVertIcon fontSize="inherit" /> */}
        <SettingsIcon />
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
              props.addRow();
            }}
          >
            <EditIcon fontSize="small" />
            <span className="pl-2 text-xs">Ubah</span>
          </div>

          <div
            className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-slate-100"
            onClick={() => {
              handleClose();
              props.removeRow();
            }}
          >
            <DeleteIcon fontSize="small" />
            <span className="pl-2 text-xs">Hapus</span>
          </div>
        </div>
      </StyledMenu>
    </div>
  );
}
