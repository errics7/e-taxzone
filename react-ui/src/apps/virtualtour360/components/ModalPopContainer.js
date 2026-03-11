import { Fade, Modal, Backdrop } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clean } from "../../../redux/configSlice";
import makeStyles from "@mui/styles/makeStyles";
import MenuItemInfoAreaMhs from "./MenuItemInfoAreaMhs";
import MenuItemLinkGSMhs from "./MenuItemLinkGSMhs";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
}));

function ModalPopContainer(props) {
  const { dataInfo, setDataInfo } = props;
  const dispatch = useDispatch();
  const cfg = useSelector((state) => state.config);
  const status = cfg.status !== "" ? true : false;
  const classes = useStyles();

  const setDefaultSrc = () => {
    const img = document.getElementById(cfg.data.uid);
    if (cfg.data.current.type === "itemInfoArea") {
      img.setAttribute("src", require("../assets/icon/infobasic.gif"));
    }
    if (cfg.data.current.type === "itemLinkArea") {
      img.setAttribute("src", require("../assets/icon/movee.gif"));
    }
    if (cfg.data.current.type === "itemLinkGS") {
      img.setAttribute("src", require("../assets/icon/itemgs.gif"));
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      disableEnforceFocus
      closeAfterTransition={true}
      className={classes.modal}
      open={status}
      onClose={() => {
        setDefaultSrc();
        dispatch(clean());
      }}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={status}>
        <div className="z-40 w-full lg:w-1/2 2xl:w-1/3 min-h-30v bg-white rounded outline-none flex flex-col items-center">
          {cfg.status === "itemInfoArea" && (
            <MenuItemInfoAreaMhs
              dataInfo={dataInfo}
              setDataInfo={(x) => setDataInfo(x)}
            />
          )}
          {cfg.status === "itemLinkGS" && (
            <MenuItemLinkGSMhs
              dataInfo={dataInfo}
              setDataInfo={(x) => setDataInfo(x)}
            />
          )}
        </div>
      </Fade>
    </Modal>
  );
}

export default ModalPopContainer;
