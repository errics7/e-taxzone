import { Button, Slider, Typography, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRotationData, clean } from "../../../redux/configSlice";
import { refresh } from "../../../redux/counterSlice";
import ResetIco from "@mui/icons-material/RotateLeft";
import SaveIcon from "@mui/icons-material/Save";
import makeStyles from "@mui/styles/makeStyles";
import toast from "react-hot-toast";
import axios from "axios";
import API from "../../../utils/host.config";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  sliderUpdate: {
    color: "#E6C12B",
  },
  sliderDef: {
    color: "#4050B5",
  },
}));

function MenuRotationAreaControlAdmin(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const cfg = useSelector((state) => state.config);
  const [load, setLoad] = useState(false);

  const handleSliderRot = (e) => {
    dispatch(
      setRotationData({ ...cfg.data.current, [e.target.name]: e.target.value })
    );
  };
  const resetRotation = (n) => {
    dispatch(setRotationData({ ...cfg.data.current, [n]: cfg.data.prev[n] }));
  };
  const saveconf = () => {
    setLoad(true);
    const callupload = axios.post(
      `${API.HOST}/api/v2/virtualtour/area/editrotation`,
      {
        idarea: cfg.data._id,
        pitch: cfg.data.current.pitch,
        yaw: cfg.data.current.yaw,
        hfov: cfg.data.current.hfov,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    toast.promise(
      callupload,
      {
        loading: "Proses pembaruan data rotasi ...",
        success: (data) => {
          setLoad(false);
          if (data.data.success) {
            dispatch(refresh());
            dispatch(clean());
          }
          return data.data.success ? (
            <div className="relative">
              <span className="absolute inset-y-0 -left-5 flex items-center">
                ✅
              </span>
              <p className="pl-3">{data.data.message}</p>
            </div>
          ) : (
            <div className="relative">
              <span className="absolute inset-y-0 -left-5 flex items-center">
                ❌
              </span>
              <p className="pl-3">{data.data.message}</p>
            </div>
          );
          // message
        },
        error: (error) => {
          setLoad(false);
          console.log(error);

          return (
            <div className="relative">
              <span className="absolute inset-y-0 -left-5 flex items-center">
                ❌
              </span>
              <p className="pl-3">
                <b>{error.response.data.message}</b>
              </p>
            </div>
          );
        },
      },
      {
        style: {
          minWidth: "250px",
          border: "1px solid #1E40AF",
          padding: "16px",
          color: "#1E40AF",
          marginBottom: "25px",
        },
        success: {
          duration: 3000,
          icon: "",
        },
        error: {
          duration: 4500,
          icon: "",
        },
      }
    );
  };

  return (
    <div className="w-full min-h-40v rounded overflow-hidden z-50 bg-slate-50 text-slate-600">
      <h1 className="text-left m-3 ml-6 font-bold">
        Pengatuan Awal Camera Area Virtual Tour
      </h1>
      <div className="mx-3 md:flex mb-8">
        <div className="md:w-1/2 mb-6 md:mb-0 px-4">
          <div className="flex border-t justify-between px-6">
            <Typography gutterBottom>
              Y Cam : ({cfg.data.current.pitch})
            </Typography>
            <IconButton
              aria-label="reset"
              onClick={() => resetRotation("pitch")}
              className="focus:outline-none"
              size="small"
            >
              <ResetIco fontSize="inherit" />
            </IconButton>
          </div>
          <Slider
            defaultValue={0}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            name="pitch"
            onChange={(e) => handleSliderRot(e)}
            className={
              cfg.data.current.pitch === cfg.data.prev.pitch
                ? classes.sliderDef
                : classes.sliderUpdate
            }
            value={cfg.data.current.pitch}
            marks
            step={1}
            min={-90}
            max={90}
          />
        </div>
        <div className="md:w-1/2 mb-6 md:mb-0 px-4">
          <div className="flex border-t justify-between px-6">
            <Typography gutterBottom>
              X Cam : ({cfg.data.current.yaw})
            </Typography>
            <IconButton
              aria-label="reset"
              onClick={() => resetRotation("yaw")}
              className="focus:outline-none"
              size="small"
            >
              <ResetIco fontSize="inherit" />
            </IconButton>
          </div>
          <Slider
            defaultValue={0}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            name="yaw"
            onChange={(e) => handleSliderRot(e)}
            className={
              cfg.data.current.yaw === cfg.data.prev.yaw
                ? classes.sliderDef
                : classes.sliderUpdate
            }
            value={cfg.data.current.yaw}
            marks
            step={1}
            min={-180}
            max={180}
          />
        </div>
        <div className="md:w-1/2 mb-6 md:mb-0 px-4">
          <div className="flex border-t text-center justify-between px-6">
            <Typography gutterBottom>
              Z Cam : ({cfg.data.current.hfov})
            </Typography>
            <IconButton
              aria-label="reset"
              onClick={() => resetRotation("hfov")}
              className="focus:outline-none"
              size="small"
            >
              <ResetIco fontSize="inherit" />
            </IconButton>
          </div>
          <Slider
            defaultValue={100}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            name="hfov"
            onChange={(e) => handleSliderRot(e)}
            className={
              cfg.data.current.hfov === cfg.data.prev.hfov
                ? classes.sliderDef
                : classes.sliderUpdate
            }
            value={cfg.data.current.hfov}
            marks
            step={1}
            min={-50}
            max={200}
          />
        </div>
      </div>
      {/*footer*/}
      <div className="relative flex flex-col-reverse md:flex-row items-center justify-between p-6 border-t border-solid border-blueslate-200 rounded-b">
        <div className="p-3 flex flex-col max-w-xs border border-slate-600 rounded text-sm font-semibold bg-amber-200">
          <p>Penting!</p>
          <p>
            Mohon untuk tidak menggeser arah camera diluar menu "Pengatuan
            Rotasi Area Virtual Tour"
          </p>
        </div>

        <div className="flex space-x-2 mb-5">
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            className={classes.button}
            onClick={() => dispatch(clean())}
            disabled={load}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            className={classes.button}
            disabled={load}
            startIcon={<SaveIcon />}
            onClick={() => {
              saveconf();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MenuRotationAreaControlAdmin;
