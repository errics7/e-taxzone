//#region
import React, { useState } from "react";

import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ProgressStepSkenario from "./ProgressStepSkenario";
import { makeStyles } from "@mui/styles";
import SkenarioInputStep1 from "./SkenarioInputStep1";
import SkenarioInputStep2 from "./SkenarioInputStep2";
import SkenarioInputStep3 from "./SkenarioInputStep3";
//#endregion
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function ModalNewSkenario(props) {
  const classes = useStyles();
  const [posisi, setPosisi] = useState(1);
  const [dataScn, setDataScn] = useState(null);
  const [typee, setType] = useState("perdagangan");

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={() => { }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className="z-50 bg-white rounded w-3/4 2xl:w-3/4 flex flex-col items-center">
            <div className="relative flex w-full items-center">
              <h2 className="w-full text-center text-2xl pt-5 pb-2 border-b">
                Buat Mata Pelajaran Baru
              </h2>
              <div className="absolute inset-y-0 right-0 pt-2">
                <IconButton onClick={() => props.close()} size="large">
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <div className="px-5 flex flex-col w-full">
              <ProgressStepSkenario posisi={posisi} />
              {posisi === 1 && (
                <SkenarioInputStep1
                  setDataScn={(x) => setDataScn(x)}
                  onClose={() => props.close()}
                  setPosisi={(x) => setPosisi(x)}
                />
              )}
              {/* {posisi === 2 && (
                <SkenarioInputStep2
                  dataScn={dataScn}
                  onClose={() => props.close()}
                  setPosisi={(x) => setPosisi(x)}
                  typee={typee}
                  setType={(x) => setType(x)}
                />
              )} */}
              {posisi === 2 && (
                <SkenarioInputStep3
                  dataScn={dataScn}
                  typee={typee}
                  onClose={() => props.close()}
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
