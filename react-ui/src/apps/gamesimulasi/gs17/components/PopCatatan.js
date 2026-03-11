import React from "react";
import withStyles from '@mui/styles/withStyles';
import MoreVertIcon from "@mui/icons-material/MoreVert"; 
import Menu from "@mui/material/Menu";
 
import LinkIcon from "@mui/icons-material/Link"; 

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #FFC900",
    marginRight: "80px",
    fontSize: "12px",
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

export default function PopCatatan(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div
        aria-controls="customized-menu"
        aria-haspopup="true"
        style={{
          marginRight: "0px",
        }}
        onClick={handleClick}
      >
        Catatan
      </div>

      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className="flex flex-col text-slate-600 max-w-sm px-3">
          <div>
            Untuk menampilkan data Buku besar pada Laporan pastikan data sudah
            terlink dengan cara:
          </div>
          <p>
            1) klik <MoreVertIcon fontSize="inherit" /> pada samping kiri
            tanggal Buku Besar
          </p>
          <p>2) pilih posisi data tersebut Persedian Awal / Periode berjalan</p>
          <p>
            3) icon <LinkIcon fontSize="small" className="text-blue-600" /> pada
            samping tanggal menandakan data tersebut sudah terlink/tampil di
            laporan.
          </p>
        </div>
      </StyledMenu>
    </div>
  );
}
