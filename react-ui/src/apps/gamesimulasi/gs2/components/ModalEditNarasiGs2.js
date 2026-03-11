//#region
import React, { useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as yup from "yup";

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

export default function ModalEditNarasiGs2(props) {
  const classes = useStyles();
  const data = props.data;

  const [fieldnarasi] = useState(props.field);
  const [load, setLoad] = useState(false);
  //formik used
  const formik = useFormik({
    initialValues: {
      narasi1: props.selected,
    },
    validationSchema: yup.object({
      narasi1: yup
        .string()
        .min(2, "Nama minimal 2 characters")
        .max(50, "Maximum 50 characters")
        .required("Nama Wajib di isi"),
    }),
  });

  const saveToDb = () => {
    if (load) return;
    if (!formik.isValid || formik.values.narasi1 === "") {
      toast.error("Pastikan semua terisi benar.");
      return;
    }

    setLoad(true);
    const push = axios.post(`${API.HOST}/api/v1/gs2/dataconfig/updatenarasi`, {
      field: fieldnarasi,
      narasi1: formik.values.narasi1,
      id: data.id,
    });
    // Notif
    toast.promise(
      push,
      {
        loading: "Saving Data...",
        success: (data) => {
          setLoad(false);
          props.update();
          props.close();
          // message
          return data.data.message;
        },
        error: (error) => {
          setLoad(false);
          //   if (!error.response.data.auth) dispatch({ type: "LOGOUT" });
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

  return <>
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
        <div className="bg-white rounded w-1/3 flex flex-col items-center">
          <div className="relative flex w-full items-center">
            <h2 className="w-full text-center text-2xl pt-5 pb-2 border-b">
              Update Data Narasi
            </h2>
            <div className="absolute inset-y-0 right-0 pt-2">
              <IconButton
                onClick={() => {
                  if (load) return;
                  props.close();
                }}
                size="large">
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
              name="narasi1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.narasi1}
              error={formik.touched.narasi1 && Boolean(formik.errors.narasi1)}
              helperText={formik.touched.narasi1 && formik.errors.narasi1}
            />
          </div>
          <div className="flex justify-center w-full px-6 mt-5">
            <Button
              variant="contained"
              color="primary"
              className={classes.btnsave}
              disabled={load}
              onClick={() => {
                saveToDb();
              }}
            >
              Perbarui Narasi
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  </>;
}
