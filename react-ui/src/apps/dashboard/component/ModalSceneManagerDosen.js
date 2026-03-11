import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import API from "../../../utils/host.config";
import makeStyles from "@mui/styles/makeStyles";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setScen } from "../../../redux/scenarioSlice";
import { ShimmerThumbnail } from "react-shimmer-effects";
import Lottie from "lottie-react";
import learn from "../assets/lottie/learn.json";
import CloseIcon from "@mui/icons-material/Close";
import {
  CircularProgress,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

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

//For Dosen Or Admin
export default function ModalSceneManagerDosen(props) {
  const { source } = props;
  const classes = useStyles();
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [dataKelas, setDataKelas] = useState(null);
  const [selector, setSelector] = useState("dimiliki");
  const [load, setLoad] = useState(false);

  //source vt / gs
  const too = source === "virtualtour" ? "virtualtour" : "gssimulasi";

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      const url =
        selector === "dimiliki"
          ? `${API.HOST}/api/v2/skenario/list`
          : `${API.HOST}/api/v2/skenario/listall`;
      axios(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          setDataKelas(res.data);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            toast.error("Sesi Telah berakhir mohon login ulang");
          }
        })
        .finally(() => {
          setLoad(false);
        });
    };

    fetchData();
  }, [selector]);

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
        <div className="relative z-40 bg-white outline-none rounded-lg w-3/4 min-h-50v  flex flex-col items-center">
          <div className="relative flex flex-col w-full border-b shadow z-50">
            <h2 className="text-left font-semibold text-xl mt-5 px-4">
              Skenario Kelas Manager
            </h2>
            <div className="absolute top-2 right-2">
              <IconButton color="error" onClick={() => props.closeCallback()}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className="text-sm flex items-center justify-between px-5 py-2">
              <p>Pilih Kelas :</p>
              {state.user.value.authorize === "admin" && (
                <ToggleButtonGroup
                  size="small"
                  color="primary"
                  value={selector}
                  exclusive
                  onChange={(e, data) => {
                    setSelector(data);
                  }}
                >
                  <ToggleButton value="dimiliki">dimiliki</ToggleButton>
                  <ToggleButton value="semua">Semua</ToggleButton>
                </ToggleButtonGroup>
              )}
            </div>
          </div>
          {dataKelas && dataKelas.data.length === 0 && (
            <div className="flex flex-col min-h-35v mt-10 w-full items-center justify-center text-2xl">
              <p className="text-center">{dataKelas.message}</p>
              <Link to={`/${state.user.value.authorize}/skenario`}>
                <div className="flex p-5 my-2 mt-5 min-w-25v min-h-15v items-center justify-center relative bg-white shadow rounded border-t hover:border  hover:shadow-md transform hover:scale-102 duration-500 cursor-pointer">
                  <div className="mb-8">
                    <AddIcon fontSize="large" />
                  </div>
                  <span className="absolute inset-x-0 bottom-1 px-3 py-2 bg-slate-100 text-center text-sm">
                    Buat Mata Pelajaran baru
                  </span>
                </div>
              </Link>
            </div>
          )}
          <div className="-mt-1 p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-50v overflow-y-scroll w-full">
            {dataKelas ? (
              dataKelas.data.map((item, i) => {
                return (
                  <Link
                    key={i}
                    to={`/${state.user.value.authorize}/sc/${item.code}/${too}`}
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
                    }}
                    className="relative max-h-20v group bg-white border rounded shadow flex flex-col border-t cursor-pointer hover:scale-102 transition-all hover:shadow-lg"
                  >
                    <Lottie
                      animationData={learn}
                      loop={true}
                      className="w-full h-full"
                    />
                    {state.scen.selectedcode === item.code && (
                      <span className="absolute top-2 right-0 inline-block rounded-full text-white bg-blue-500 px-3 py-1 text-xs font-bold mr-3">
                        Dipilih
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-3 z-50 px-3 py-2 bg-slate-100 truncate text-2xl lg:text-2xl">
                      {item.nama}
                    </div>
                  </Link>
                );
              })
            ) : (
              <>
                <ShimmerThumbnail
                  height={140}
                  width={300}
                  className="m-0"
                  rounded
                />
                <ShimmerThumbnail
                  height={140}
                  width={300}
                  className="m-0"
                  rounded
                />
                <ShimmerThumbnail
                  height={140}
                  width={300}
                  className="m-0"
                  rounded
                />
                <ShimmerThumbnail
                  height={140}
                  width={300}
                  className="m-0"
                  rounded
                />
              </>
            )}
            {load && (
              <div className="absolute inset-0 flex items-center justify-center z-50">
                <CircularProgress />
              </div>
            )}
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
