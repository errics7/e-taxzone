import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { refresh } from "../../../redux/counterSlice";

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
  },
  btncancel: {
    marginBottom: "25px",
    textTransform: "capitalize",
    marginRight: "10px",
  },
  btndel: {
    marginBottom: "25px",
    textTransform: "capitalize",
  },
}));

function SkenarioInputStep3(props) {
  const classes = useStyles();
  const { dataScn, typee } = props;
  const dispatch = useDispatch();
  const [isLoad, setIsLoad] = useState(false);
  const [pilih, setPilih] = useState(true);

  const createProcess = () => {
    if (!pilih) {
      props.setPosisi(1);
      props.onClose();
      dispatch(refresh());
      return;
    }

    if (isLoad) return;
    //Call
    setIsLoad(true);
    const callCreate = axios.post(
      `${API.HOST}/api/v2/skenario/updategsthemevirtualtour`,
      {
        scenid: dataScn.scene.id,
        kepada: dataScn.scene.virtualtour_id,
        dari: typee === "manufaktur" ? 1 : 2,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );

    toast.promise(
      callCreate,
      {
        loading: "Mengatur Virtual Tour ...",
        success: (data) => {
          setIsLoad(false);
          if (data.data.success) {
            props.setPosisi(1);
            props.onClose();
            dispatch(refresh());
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
          setIsLoad(false);
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
          duration: 1000,
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
    <div>
      <div className="mb-5 font-semibold">Pilih Tema Virtual Tour :</div>
      <div className="mt-10 flex flex-col lg:flex-row  justify-center items-center">
        <div className="w-full h-48 flex justify-center relative">
          <Tooltip
            title="Virtual Tour akan terisi secara otomatis sesuai tema yang disediakan."
            placement="right"
            arrow
          >
            <div className="relative">
              &nbsp;
              <div className="w-72 h-40 bg-blue-500 shadow transform transition-all skew-x-0 skew-y-0 absolute -top-8 -left-28 rounded-lg"></div>
              <div className="w-72 h-40 bg-blue-400 shadow transform transition-all skew-x-0 skew-y-0 absolute -top-4 -left-32 rounded-lg"></div>
              <div className="w-72 h-40 bg-blue-200 flex justify-center items-center border-2 border-slate-500 shadow transform transition-all skew-x-0 skew-y-0 absolute top-0 -left-36 rounded-lg">
                <div className="w-72 text-2xl px-5">
                  Tema OOPedia Standart
                </div>
              </div>
            </div>
          </Tooltip>
          <div className="absolute inset-x-0 -bottom-5 flex justify-center">
            <FormControlLabel
              control={<Checkbox />}
              label="Tema OOPedia Standart"
              checked={pilih}
              onChange={() => setPilih(!pilih)}
            />
          </div>
        </div>
        <div className="border-l w-full h-48 flex justify-center relative">
          <Tooltip
            title="Virtual Tour akan dikosongi, anda harus mengatur secara mandiri."
            placement="left"
            arrow
          >
            <div className="w-72 h-40 bg-blue-200 flex justify-center items-center border-2 border-slate-500 shadow transform rounded-lg">
              <div className=" text-left text-2xl">
                Buat Tema <br />
                OOPedia Baru
              </div>
            </div>
          </Tooltip>
          <div className="absolute inset-x-0 -bottom-5 flex justify-center">
            <FormControlLabel
              control={<Checkbox />}
              label="Tema OOPedia Baru"
              checked={!pilih}
              onChange={() => setPilih(!pilih)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full px-6 mt-10 mb-5">
        <Button
          variant="contained"
          color="primary"
          className={classes.btnsave}
          disabled={isLoad}
          endIcon={
            isLoad ? (
              <CircularProgress
                size={20}
                thickness={4}
                style={{ color: "white" }}
              />
            ) : null
          }
          onClick={() => {
            createProcess();
          }}
        >
          Pilih konfigurasi OOPedia
        </Button>
      </div>
    </div>
  );
}

export default SkenarioInputStep3;
