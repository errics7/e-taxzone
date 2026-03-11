import React from "react";
import withStyles from "@mui/styles/withStyles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import toast from "react-hot-toast";

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

export default function PopMenuRowAreaVTAdmin(props) {
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
          {props.indx > 0 && (
            <div
              className={`group flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-slate-100`}
              onClick={() => {
                handleClose();
                props.moveUp();
              }}
            >
              <ArrowUpwardIcon
                fontSize="small"
                className="text-slate-400 group-hover:text-slate-700"
              />
              <span className="pl-2 text-xs">Geser Keatas</span>
            </div>
          )}
          {props.indx !== props.length - 1 && (
            <div
              className={`group flex items-center justify-between px-2 py-2 opacity-100 cursor-pointer hover:bg-slate-100`}
              onClick={() => {
                handleClose();
                props.moveDown();
              }}
            >
              <ArrowDownwardIcon
                fontSize="small"
                className="text-slate-400 group-hover:text-slate-700"
              />
              <span className="pl-2 text-xs">Geser Kebawah</span>
            </div>
          )}
          {/* <div
            className={`group flex items-center justify-between px-2 py-2 opacity-100 cursor-pointer hover:bg-slate-100`}
            onClick={() => {
              handleClose();
              props.moveDown();
            }}
          >
            {props.visibility ? (
              <VisibilityOffIcon
                fontSize="small"
                className="text-slate-400 group-hover:text-slate-700"
              />
            ) : (
              <VisibilityIcon
                fontSize="small"
                className="text-slate-400 group-hover:text-slate-700"
              />
            )}
            <span className="pl-2 text-xs">
              {props.visibility ? "Sembunyikan" : "Tampilkan"} pada menu
              mahasiswa
            </span>
          </div> */}
        </div>
      </StyledMenu>
    </div>
  );
}
