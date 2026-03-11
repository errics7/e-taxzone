import React from "react";
import withStyles from '@mui/styles/withStyles'; 
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText"; 
import DeleteIcon from "@mui/icons-material/Delete"; 

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5", 
    marginLeft: "40px", 
  }, 
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "center",
      horizontal: "left", 
    }} 
    transformOrigin={{
      vertical: "center",
      horizontal: "left",
    }}
    {...props}
  />
));
 

export default function PopMenuDelete(props) {
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
            marginRight: '-13px'
        }}
        onClick={handleClick} 
        size="medium"
      >
        <MoreVertIcon fontSize="inherit" />
      </IconButton>

      <StyledMenu 
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={()=>{
            handleClose();
            props.removeButton(props.index)
        }}>
          <ListItemIcon> 
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Hapus Item" className="-ml-5"/>
        </MenuItem>  
      </StyledMenu>
    </div>
  );
}
