import React, { useState, useRef } from "react";
import axios from "axios";
import { refresh } from "../../../../../redux/counterSlice";
import API from "../../../../../utils/host.config";
import toast from "react-hot-toast";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useFormik } from "formik";
import * as yup from "yup";
import { isEqual } from "lodash";

import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/HighlightOff";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material";
import swal from "sweetalert";
import { useDispatch } from "react-redux";

export default function UpdateMahasiswaAdmin(props) {
  const dispatch = useDispatch();
  const pwdInput = useRef(null);
  const nimInput = useRef(null);
  const [onProses, setonProses] = useState(false);

  const [resetpwd, setresetpwd] = useState(false);
  const [resetnim, setresetnim] = useState(false);
  const formikOld = useFormik({
    initialValues: {
      nim: props.data.nim,
      name: props.data.nama,
      kelas: props.data.kelas,
      password: props.data.nim,
    },
  });
  const formik = useFormik({
    initialValues: {
      nim: props.data.nim,
      name: props.data.nama,
      kelas: props.data.kelas,
      password: props.data.nim,
    },
    validationSchema: yup.object({
      nim: yup
        .string()
        .matches(/^[0-9]+$/, "NIM tidak valid")
        .min(8, "NIM minimal 8 characters")
        .max(20, "Maximum 20 characters")
        .required("NIM Wajib di isi"),
      name: yup
        .string()
        .min(5, "Nama minimal 5 characters")
        .max(100, "Maximum 100 characters")
        .required("Nama Wajib di isi"),
      kelas: yup
        .string()
        .min(1, "Kelas minimal 1 characters")
        .max(20, "Maximum 100 characters")
        .required("Kelas Wajib di isi"),
      password: yup
        .string()
        .min(5, "Password minimal 5 characters")
        .max(100, "Maximum 100 characters")
        .required("Password Wajib di isi"),
    }),
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const toasterr = (update, str) => {
    toast.promise(
      update,
      {
        loading: str,
        success: (data) => {
          setonProses(false);
          //
          dispatch(refresh());

          if (data.data.success === true) props.closeui();

          return data.data.success ? (
            <>
              <span className="pr-2">✅ </span> {data.data.message}
            </>
          ) : (
            <>
              <span className="pr-2">❌ </span> {data.data.message}
            </>
          );
        },
        error: (error) => {
          setonProses(false);
          // console.log(error.response);
          // if (!error.response.data.auth) dispatch({ type: "LOGOUT" });
          return <b>{error.response.data.message}</b>;
        },
      },
      {
        style: {
          minWidth: "250px",
          border: "1px solid #1E40AF",
          padding: "16px",
          color: "#1E40AF",
          marginBottom: "35px",
        },
        success: {
          duration: 4000,
          icon: "",
        },
      }
    );
  };

  const handleSave = (values) => {
    if (onProses) return;

    if (isEqual(values, formikOld.values)) {
      const ico = ["😊", "🙏", "👏", "😊", "🙏", "👏"];
      toast("Tidak terdapat perubahan data", {
        icon: ico[Math.floor(Math.random() * 6)],
      });
      return;
    }

    setonProses(true);
    const update = axios.post(
      `${API.HOST}/api/v2/users/updatemahasiswa`,
      {
        nim: resetnim ? values.nim : formikOld.values.nim,
        name: values.name,
        class: values.kelas,
        password: resetpwd ? values.password : formikOld.values.password,
        id: props.data.id,
        resetpwd: resetpwd,
        resetnim: resetnim,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    //
    toasterr(update, "Update data...");
  };

  const hapusAkun = () => {
    swal(
      `"${props.data.nama}" akan dihapus ?`,
      "Ini akan menghapus secara Permanen, admin tidak dapat mengembalikan user yang sudah dihapus.",
      {
        buttons: {
          cancel: "Batal",
          catch: {
            text: "Hapus",
            value: "oke",
            className: "ml-5 bg-red-400 hover:bg-red-500",
          },
        },
        icon: "warning",
        dangerMode: true,
      }
    ).then((value) => {
      switch (value) {
        case "oke":
          const update = axios.post(
            `${API.HOST}/api/v2/users/deleteakunforever`,
            {
              id: props.data.id,
              nim: props.data.nim,
              email: props.data.email,
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("xtoken"),
              },
            }
          );
          //
          toasterr(update, "Menghapus akun...");
          break;
        default:
          return;
      }
    });
  };

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={true}
        aria-labelledby="max-width-dialog-title"
      >
        <div className="flex justify-between mx-5 my-1">
          <div className="place-self-center text-2xl font-semibold">
            Data Pengguna
          </div>
          <div className="">
            <IconButton
              aria-label="delete"
              className="focus:outline-none border bg-white"
              onClick={() => props.closeui()}
              size="large"
            >
              <CloseIcon className="text-red-500" />
            </IconButton>
          </div>
        </div>
        <hr />
        <DialogContent className="mb-3">
          <form onSubmit={formik.handleSubmit}>
            <div className="my-3">
              <TextField
                fullWidth
                autoComplete="on"
                label="NIM"
                placeholder="NIM"
                name="nim"
                ref={nimInput}
                variant={resetnim ? "standard" : "filled"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nim}
                error={formik.touched.nim && Boolean(formik.errors.nim)}
                helperText={formik.touched.nim && formik.errors.nim}
                InputLabelProps={{ shrink: true }}
                inputProps={{ readOnly: resetnim ? false : true }}
              />
              <button
                type="button"
                onClick={(event) => {
                  if (resetnim) {
                    formik.setFieldValue("nim", formikOld.values.nim);
                  }
                  setresetnim(!resetnim);
                  nimInput.current.focus();
                }}
                className={`px-2 my-1 text-white text-xxs  rounded  hover:shadow-lg focus:outline-none ${
                  resetnim
                    ? " bg-red-400 hover:bg-red-600"
                    : " bg-blue-400 hover:bg-blue-600"
                }`}
              >
                {resetnim ? "Batalkan perubahan" : "Ganti NIM"}
              </button>
            </div>
            <div className="my-3">
              <TextField
                fullWidth
                autoComplete="on"
                label="Nama"
                placeholder="Nama"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-3 mb-6">
              <TextField
                fullWidth
                autoComplete="on"
                label="Kelas"
                placeholder="Kelas"
                name="kelas"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.kelas}
                error={formik.touched.kelas && Boolean(formik.errors.kelas)}
                helperText={formik.touched.kelas && formik.errors.kelas}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-3 mb-6">
              <TextField
                fullWidth
                autoComplete="on"
                label="Password"
                placeholder="Password"
                name="password"
                ref={pwdInput}
                type="password"
                variant={resetpwd ? "standard" : "filled"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputLabelProps={{ shrink: true }}
                inputProps={{ readOnly: resetpwd ? false : true }}
              />
              <button
                type="button"
                onClick={(event) => {
                  setresetpwd(!resetpwd);
                  pwdInput.current.focus();
                }}
                className={`px-2 my-1 text-white text-xxs rounded  hover:shadow-lg ${
                  !resetpwd
                    ? "bg-blue-400 hover:bg-blue-600"
                    : "bg-red-400 hover:bg-red-600"
                } focus:outline-none`}
              >
                {!resetpwd ? "reset password" : "Batal reset"}
              </button>
            </div>
            <hr />

            <div className="flex justify-between mt-3">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={onProses}
                startIcon={
                  onProses ? (
                    <CircularProgress
                      size={20}
                      thickness={4}
                      style={{ color: "white" }}
                    />
                  ) : (
                    <SaveIcon className="-mt-1" />
                  )
                }
              >
                Update pengguna
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="error"
                disabled={onProses}
                onClick={() => {
                  hapusAkun();
                }}
                startIcon={
                  onProses ? (
                    <CircularProgress
                      size={20}
                      thickness={4}
                      style={{ color: "white" }}
                    />
                  ) : (
                    <DoDisturbIcon className="-mt-1" />
                  )
                }
              >
                Hapus akun
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/*  */}
    </>
  );
}
