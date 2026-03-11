import React from "react";
import toast from "react-hot-toast";
import makeStyles from "@mui/styles/makeStyles";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Search from "./Search";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setScen } from "../../../redux/scenarioSlice";
import learn from "../assets/lottie/learn.json";
import emptyfile from "../assets/lottie/emptyfile.json";
import Lottie from "lottie-react";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  btnsave: {
    marginBottom: "25px",
    textTransform: "capitalize",
    backgroundColor: "#2D90DA",
  },
  btndel: {
    marginBottom: "25px",
    textTransform: "capitalize",
  },
}));

export default function ModalSceneManager(props) {
  const classes = useStyles();
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const { dataKelas, history } = props;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      disableEnforceFocus
      closeAfterTransition={true}
      className={classes.modal}
      open={props.openn}
      onClose={() => {
        props.closeCallback();
      }}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.openn}>
        <div className="z-40 bg-white outline-none rounded-lg w-3/4 min-h-50v  flex flex-col items-center">
          <div className="relative flex flex-row w-full items-center border-b justify-between">
            <h2 className="flex-none text-center font-semibold text-xl px-4">
              Kelas Manager
            </h2>
            <Search />
            <div className="absolute bottom-1 left-5 text-sm">
              Pilih Kelas :
            </div>
          </div>
          <div className="-mt-3 p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 w-full">
            {dataKelas &&
              dataKelas.data.map((item, i) => {
                return (
                  <Link
                    key={i}
                    to={`/home/f/${item.code}/${
                      history[4] === "virtualtour"
                        ? "virtualtour"
                        : "gssimulasi"
                    }`}
                    onClick={() => {
                      dispatch(setScen(item));
                      toast.success(item.nama + " Dipilih", {
                        style: {
                          minWidth: "250px",
                          border: "1px solid #1E40AF",
                          padding: "16px",
                          color: "#1E40AF",
                          marginBottom: "25px",
                        },
                        success: {
                          duration: 1500,
                        },
                      });
                      props.closeCallback();
                      props.closeSide();
                    }}
                  >
                    <div className="relative min-h-20v max-h-25v group bg-white border rounded shadow flex flex-col border-t cursor-pointer hover:scale-102 transition-all hover:shadow-lg">
                      {state.scen.selectedcode === item.code && (
                        <span className="absolute top-2 right-0 inline-block rounded-full text-white bg-blue-500 px-3 py-1 text-xs font-bold mr-3">
                          Dipilih
                        </span>
                      )}
                      <Lottie
                        animationData={learn}
                        loop={true}
                        className="w-full h-full absolute inset-0"
                      />
                      <span className="absolute inset-x-0 bottom-2 px-3 py-2 bg-slate-100 text-lg">
                        {item.nama}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
          {dataKelas && dataKelas.data.length === 0 && (
            <div className="flex min-h-25v w-full items-center justify-center text-2xl">
              <Lottie
                style={{
                  maxHeight: 300,
                  maxWidth: 300,
                }}
                animationData={emptyfile}
                loop={true}
              />
              {dataKelas.message}
            </div>
          )}
        </div>
      </Fade>
    </Modal>
  );
}
