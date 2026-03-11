import React, { useState } from "react";
import axios from "axios";
import { logout } from "../../../redux/userSlice";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useFormik } from "formik";
import * as yup from "yup";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/HighlightOff";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import swal from "sweetalert";

export default function UpdatePasswordPengguna(props) {
  const dispatch = useDispatch();
  const [onProses, setonProses] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { data, close } = props;

  const formik = useFormik({
    initialValues: {
      oldpass: "",
      newpass: "",
      repass: "",
    },
    validationSchema: yup.object({
      oldpass: yup
        .string()
        .min(5, "Password minimal 5 characters")
        .max(32, "Password Maximum 32 characters")
        .required("Password Sebelumnya Wajib di isi"),
      newpass: yup
        .string()
        .min(5, "Password minimal 5 characters")
        .max(32, "Password Maximum 32 characters")
        .required("Password Baru Wajib di isi"),
      repass: yup
        .string()
        .min(5, "Password minimal 5 characters")
        .max(32, "Password Maximum 32 characters")
        .required("Ulangi Password Baru"),
    }),
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const handleSave = (values) => {
    if (values.newpass !== values.repass) {
      toast.error("Ulangi Password tidak sama.", {
        style: {
          minWidth: "250px",
          border: "1px solid #FF4C4D",
          padding: "16px",
          color: "#000",
          marginBottom: "25px",
        },
        error: {
          duration: 5000,
        },
      });
      return;
    }

    if (onProses) return;
    setonProses(true);
    const update = axios.post(
      `${API.HOST}/api/v2/myaccount/changepassword/update`,
      {
        id: data._id,
        oldpass: values.oldpass,
        newpass: values.newpass,
        repass: values.repass,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    //
    toast.promise(
      update,
      {
        loading: "Memperbarui data...",
        success: (data) => {
          setonProses(false);
          //
          if (data.data.success === true) {
            close();
            setTimeout(() => {
              swal({
                title: "Sukses",
                text: "Password berhasil deperbarui, mohon login kembali dengan password baru.",
                icon: "info",
                closeOnClickOutside: false,
                buttons: {
                  catch: {
                    text: "Oke",
                    value: "oke",
                    className: "mx-auto",
                  },
                },
              }).then((value) => {
                switch (value) {
                  case "oke":
                    dispatch(logout());
                    window.location.reload();
                    break;
                  default:
                    return;
                }
              });
            }, 3000);
          }

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
          console.log(error);

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
            Ganti Password
          </div>
          <div className="">
            <IconButton
              aria-label="delete"
              className="focus:outline-none border bg-white"
              onClick={() => close()}
              size="large"
            >
              <CloseIcon className="text-red-500" />
            </IconButton>
          </div>
        </div>
        <hr />
        <DialogContent className="mb-3">
          <form onSubmit={formik.handleSubmit}>
            <div className="my-5">
              <TextField
                fullWidth
                type="password"
                label="Password Lama"
                placeholder="Masukkan Password Lama"
                name="oldpass"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.oldpass}
                error={formik.touched.oldpass && Boolean(formik.errors.oldpass)}
                helperText={formik.touched.oldpass && formik.errors.oldpass}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="my-5">
              <TextField
                fullWidth
                type={showPwd ? "text" : "password"}
                label="Password Baru"
                placeholder="Masukkan Password Baru"
                name="newpass"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newpass}
                error={formik.touched.newpass && Boolean(formik.errors.newpass)}
                helperText={formik.touched.newpass && formik.errors.newpass}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPwd(!showPwd)}
                        size="large"
                      >
                        {showPwd ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="my-5">
              <TextField
                fullWidth
                type={showPwd ? "text" : "password"}
                label="Ulangi Password Baru"
                placeholder="Ulangi Password Baru"
                name="repass"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.repass}
                error={formik.touched.repass && Boolean(formik.errors.repass)}
                helperText={formik.touched.repass && formik.errors.repass}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPwd(!showPwd)}
                        size="large"
                      >
                        {showPwd ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
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
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/*  */}
    </>
  );
}
