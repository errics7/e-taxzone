import React from "react";
import withStyles from '@mui/styles/withStyles';
import Menu from "@mui/material/Menu";

import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      style={{
        textAlign: "right",
        paddingRight: 10,
      }}
      thousandSeparator
      isNumericString
      prefix="Rp "
    />
  );
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    marginTop: "-5px",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
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

export default function InlinePopInput(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const error = props.seterror ? props.seterror : false; 
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="inline">
      <div
        onClick={handleClick}
        className={`inline relative border cursor-pointer ${
          error && " bg-red-300 animate-pulse"
        }`}
      >
        {error ? (
          <Tooltip title="Pastikan anda mengisi dengan benar" placement="right-end">
            <span className="px-2 mr-5">{toRp(props.value)}</span>
          </Tooltip>
        ) : (
          <span className="px-2 mr-5">{toRp(props.value)}</span>
        )}
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 absolute inset-y-0 right-0 opacity-50"
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
              inputComponent: NumberFormatCustom,
            }}
            onChange={(event) => props.onChange(event)}
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute inset-y-0 right-0 opacity-50"
          />
        </div>
      </StyledMenu>
    </div>
  );
}
