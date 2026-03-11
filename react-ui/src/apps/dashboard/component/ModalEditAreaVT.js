//#region
import React, { useState } from "react";
import axios from "axios";
import API from "../../../utils/host.config";
import { Button, CircularProgress, Modal, TextField } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { refresh } from "../../../redux/counterSlice";
import { find } from "lodash";

//#endregion
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnsave: {},
  btnbatal: {
    marginRight: 15,
  },
}));

export default function ModalEditAreaVT(props) {
  const classes = useStyles();
  const { data, idArea } = props;
  const dispatch = useDispatch();

  const [isLoad, setIsLoad] = useState(false);

  const formik = useFormik({
    initialValues: {
      nama: find(data.list, { id: idArea }).name,
    },
    validationSchema: yup.object({
      nama: yup
        .string()
        .min(2, "Nama minimal 2 characters")
        .max(100, "Maximum 50 characters")
        .required("Nama Wajib di isi"),
    }),
    onSubmit: (values) => {
      createProcess(values);
    },
  });

  const createProcess = (values) => {
    setIsLoad(true);
    const callupload = axios.post(
      `${API.HOST}/api/v2/virtualtour/area/edit`,
      {
        idvt: data.virtualtour_id,
        idarea: idArea,
        list: JSON.stringify(data.list),
        newname: values.nama,
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
        loading: "Proses pembaruan data ...",
        success: (data) => {
          setIsLoad(false);
          if (data.data.success) {
            formik.resetForm();
            dispatch(refresh());
            props.close();
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
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={() => {}}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className="z-50 bg-white rounded w-3/4 2xl:w-2/4 flex flex-col items-center">
            <div className="relative flex w-full items-center">
              <h2 className="w-full text-center text-2xl pt-5 pb-2 border-b">
                Ganti Data Area
              </h2>
              <div className="absolute inset-y-0 right-0 pt-2">
                <IconButton onClick={() => props.close()} size="large">
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="w-full p-5 min-h-30v relative"
            >
              <div className="grid grid-cols-1 ">
                <div className="">
                  <TextField
                    label="Nama Area Virtual Tour"
                    placeholder="Nama Area Virtual Tour"
                    margin="normal"
                    name="nama"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nama}
                    error={formik.touched.nama && Boolean(formik.errors.nama)}
                    helperText={formik.touched.nama && formik.errors.nama}
                  />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-5 px-5 flex flex-row-reverse">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.btnsave}
                  disabled={isLoad}
                  startIcon={<SaveAsIcon />}
                  endIcon={
                    isLoad ? (
                      <CircularProgress
                        size={20}
                        thickness={4}
                        style={{ color: "white" }}
                      />
                    ) : null
                  }
                >
                  Perbaruhi Data
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  className={classes.btnbatal}
                  disabled={isLoad}
                  onClick={() => props.close()}
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
