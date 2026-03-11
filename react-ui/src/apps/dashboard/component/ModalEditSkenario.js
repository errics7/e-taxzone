//#region
import React, { useState } from "react";

import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import SkenarioEditInputStep1 from "./SkenarioEditInputStep1";
import SkenarioEditInputStep2 from "./SkenarioEditInputStep2";
import ProgressStepSkenarioEdit from "./ProgressStepSkenarioEdit";

//#endregion
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function ModalEditSkenario(props) {
  const classes = useStyles();
  const [posisi, setPosisi] = useState(1);
  const [wsScn, setWsScn] = useState(null);
  const onClose = () => {
    props.close();
    setPosisi(1);
  };
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className="z-50 bg-white rounded w-3/4 2xl:w-3/4 flex flex-col items-center">
            <div className="relative flex w-full items-center">
              <h2 className="w-full text-center text-2xl pt-5 py-4 border-b">
                Perbarui Skenario - {props.dataScn.nama}
              </h2>
              <div className="absolute inset-y-0 right-0 pt-2">
                <IconButton onClick={onClose} size="large">
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <div className="px-5 flex flex-col w-full">
              {/* <ProgressStepSkenarioEdit
                posisi={posisi}
                dataScn={props.dataScn}
                setPosisi={(x) => setPosisi(x)}
                setDataWsScn={(x) => setWsScn(x)}
              /> */}
              {posisi === 1 && (
                <SkenarioEditInputStep1
                  dataScn={props.dataScn}
                  setDataScn={(x) => props.setDataScn(x)}
                  dataWsScn={wsScn}
                  setDataWsScn={(x) => setWsScn(x)}
                  onClose={() => props.close()}
                  setPosisi={(x) => setPosisi(x)}
                />
              )}
              {posisi === 2 && (
                <SkenarioEditInputStep2
                  dataScn={props.dataScn}
                  setDataScn={(x) => props.setDataScn(x)}
                  dataWsScn={wsScn}
                  setDataWsScn={(x) => setWsScn(x)}
                  onClose={() => {
                    setPosisi(1);
                    props.close();
                  }}
                  setPosisi={(x) => setPosisi(x)}
                />
              )}
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
