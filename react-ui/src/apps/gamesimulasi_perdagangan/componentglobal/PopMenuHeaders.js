import React from "react";
import withStyles from '@mui/styles/withStyles';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu"; 
import TextField from "@mui/material/TextField"; 

import DeleteIcon from "@mui/icons-material/Delete"; 
import ViewColumnIcon from "@mui/icons-material/ViewColumn"; 

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    marginRight: "40px",
    fontSize: "10px",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    {...props}
  />
));

export default function PopMenuHeaders(props) {
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
          marginTop: "-13px",
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
              props.addHeaders();
            }}
          >
            <ViewColumnIcon fontSize="small" />
            <span className="pl-2 text-xs">Tambah Kolom Baru</span>
          </div>

          <div
            className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-slate-100"
            onClick={() => {
              handleClose();
              props.removeHeaders();
            }}
          >
            <DeleteIcon fontSize="small" />
            <span className="pl-2 text-xs">Hapus Kolom ini</span>
          </div>

          <div className="flex items-center justify-between px-2 py-0 text-xs cursor-pointer hover:bg-slate-100">
            <span className="text-xs">Gabungkan Kolom</span>
            <div className="w-10 ">
              <TextField
                value={props.data.colspan}
                onChange={(event) => {
                  props.updateColRow(event.target.value, props.data.rowspan);
                }}
                inputProps={{ min: 0, style: { textAlign: "center" } }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-2 py-0 text-xs cursor-pointer hover:bg-slate-100">
            <span className="text-xs">Gabungkan Baris</span>
            <div className="w-10 ">
              <TextField
                value={props.data.rowspan}
                onChange={(event) => {
                  props.updateColRow(props.data.colspan, event.target.value);
                }}
                inputProps={{ min: 0, style: { textAlign: "center" } }}
              />
            </div>
          </div>
        </div>
      </StyledMenu>
    </div>
  );
}
