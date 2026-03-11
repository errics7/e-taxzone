//#region
import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnsave: {
    marginBottom: "25px",
    textTransform: "capitalize",
    backgroundColor: "#2D90DA",
    "&:hover": {
      backgroundColor: "#216CA3",
      boxShadow: "none",
    },
  },
  btndel: {
    marginBottom: "25px",
    textTransform: "capitalize",
  },
}));
//#endregion

export default function ModalEditNarasi1Gs3(props) {
  const classes = useStyles();
  const { field, data, setConfig } = props;

  const onChanged = (e) => {
    const { value } = e.target;
    setConfig({
      ...data,
      [field]: value,
    });
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={() => {
          props.close();
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className="bg-white z-50 rounded w-1/3 flex flex-col items-center">
            <div className="relative flex w-full items-center">
              <h2 className="w-full text-center text-2xl pt-5 pb-2 border-b">
                Update Data Narasi
              </h2>
              <div className="absolute inset-y-0 right-0 pt-2">
                <IconButton
                  onClick={() => {
                    props.close();
                  }}
                  size="large"
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <div className="p-5 flex flex-col w-full">
              <TextField
                style={{ marginTop: 0, marginBottom: "15px" }}
                fullWidth
                multiline
                maxRows={4}
                label="Narasi"
                placeholder="Beri kata narasi"
                name={field}
                value={data[field]}
                onChange={(e) => onChanged(e)}
              />
            </div>
            <div className="flex justify-center w-full px-6 mt-5">
              <Button
                variant="contained"
                color="primary"
                className={classes.btnsave}
                onClick={() => {
                  props.close();
                }}
              >
                Selesai
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
