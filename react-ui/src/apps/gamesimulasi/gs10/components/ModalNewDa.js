import React, { forwardRef, useState } from "react";

import makeStyles from "@mui/styles/makeStyles";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import NumberFormat from "react-number-format";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import { useEffect } from "react";

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      type="text"
      maxLength="4"
      minLength="3"
      isNumericString
    />
  );
});

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
  btndel: {
    marginBottom: "25px",
    textTransform: "capitalize",
  },
}));

export default function ModalNewDa(props) {
  const classes = useStyles();
  const [noAkun, setNoAkun] = useState("");
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("");
  const [load, setLoad] = useState(false);
  const [avCode, setAvCode] = useState(false);
  const [message, setMessage] = useState(null);
  const [isFind, setIsFind] = useState(false);

  useEffect(() => {
    const cek = () => {
      setIsFind(true);
      axios
        .post(
          `${API.HOST}/api/v2/manufakturgs10/dataakun/check`,
          {
            ids: noAkun,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("xtoken"),
            },
          }
        )
        .then((res) => {
          setAvCode(res.data.success);
          setMessage(res.data.message);
          setIsFind(false);
        });
    };

    if (noAkun.length > 2) cek();
  }, [noAkun]);

  const saveToDb = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs10/dataakun/add`,
      {
        noakun: noAkun,
        akun: nama,
        jenis: jenis,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    // Notif
    toast.promise(
      push,
      {
        loading: "menyimpan Data...",
        success: (data) => {
          setLoad(false);
          props.update();
          props.close();
          // message
          return data.data.message;
        },
        error: (error) => {
          setLoad(false);

          return <b>{error.response.data.message}</b>;
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
          duration: 3500,
        },
      }
    );
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={() => {
          if (load) return;
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
                Data Akun Baru
              </h2>
              <div className="absolute inset-y-0 right-0 pt-2">
                <IconButton
                  onClick={() => {
                    if (load) return;
                    props.close();
                  }}
                  size="large"
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <div className="p-5 flex flex-col w-full">
              <div className="relative flex items-center">
                <TextField
                  label="No Akun"
                  style={{
                    marginTop: 0,
                    maxWidth: "50%",
                    marginBottom: "15px",
                  }}
                  placeholder="Masukkan No Akun"
                  fullWidth
                  margin="normal"
                  value={noAkun}
                  name="noAkun"
                  onChange={(event) => {
                    setNoAkun(event.target.value);
                  }}
                  error={noAkun !== "" && !avCode}
                  helperText={noAkun !== "" && !avCode && message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
                {isFind && (
                  <CircularProgress
                    size={22}
                    className={`-mt-2 -ml-7 ${
                      noAkun !== "" && !avCode && " -mt-6"
                    }`}
                  />
                )}
              </div>

              <TextField
                label="Nama Akun"
                style={{ marginTop: 0, marginBottom: "15px" }}
                placeholder="Beri Nama Akun"
                fullWidth
                margin="normal"
                value={nama}
                onChange={(event) => {
                  setNama(event.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl className={classes.formControl}>
                <InputLabel>Jenis Akun</InputLabel>
                <Select
                  value={jenis}
                  onChange={(event) => {
                    setJenis(event.target.value);
                  }}
                >
                  <MenuItem value={"debit"}>Debit</MenuItem>
                  <MenuItem value={"kredit"}>Kredit</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="flex justify-center w-full px-6 mt-5">
              <Button
                variant="contained"
                color="primary"
                className={classes.btnsave}
                onClick={() => {
                  if (!avCode) return; //code jika tidak tersedia
                  saveToDb();
                }}
              >
                Tambahkan Data Akun
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
