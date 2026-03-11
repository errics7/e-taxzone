import makeStyles from '@mui/styles/makeStyles';
import Button from "@mui/material/Button";

const useStyles = makeStyles((theme) => ({
  btnsave: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "15px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
  btnreset: {
    marginTop: "15px",
    marginLeft: "10px",
  },
}));

export default function NotifUpdate(props) {
  const classes = useStyles();

  return (
    <div className="bg-red-100 p-3 my-2 rounded transition-all duration-500">
      Terdapat perubahan data, Klik untuk meyimpan data.
      <br />
      <Button
        variant="contained"
        color="primary"
        className={classes.btnsave}
        onClick={() => {
          props.saveDb();
        }}
      >
        Simpan perubahan
      </Button>
      <Button
        className={classes.btnreset}
        onClick={() => {
          props.update();
        }}
      >
        reset
      </Button>
    </div>
  );
}
