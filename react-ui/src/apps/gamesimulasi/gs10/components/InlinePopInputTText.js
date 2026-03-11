import React from "react";
import withStyles from "@mui/styles/withStyles";
import Menu from "@mui/material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    marginTop: "-5px",
  },
})((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    {...props}
  />
));

export default function InlinePopInputTText(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const error = props.seterror ? props.seterror : false;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="inline">
      <div
        onClick={handleClick}
        className={`inline relative cursor-pointer ${
          error && " bg-red-300 animate-pulse"
        }`}
      >
        {error ? (
          <Tooltip title={props.msg} placement="right-end">
            <span className="inline mr-5">{props.value}</span>
          </Tooltip>
        ) : (
          <span className="inline mr-5">{props.value}</span>
        )}
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 absolute bottom-1 right-0 opacity-50"
        />
      </div>
      {/*  */}
      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className="px-2 relative">
          <TextField
            value={props.value}
            name="nilai"
            InputProps={{
              disableUnderline: false,
            }}
            onChange={(event) => props.onChange(event.target.value)}
          />
          {/* <InputGrowUpText
            value={props.value}
            onChange={(text) => props.onChange(text)}
          /> */}
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute inset-y-0 right-0 opacity-50"
          />
        </div>
      </StyledMenu>
    </div>
  );
}
