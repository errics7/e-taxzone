import React, { useState } from "react";
import axios from "axios";
import API from "../../../../../utils/host.config";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "../../../../../redux/counterSlice";

export default function NewUsers(props) {
  const { isopen, closeui } = props;
  const dispatch = useDispatch();
  const suser = useSelector((state) => state.user);
  const [typee, setTypee] = useState("mahasiswa");
  const [onProses, setOnProses] = useState(false);
  const formik = useFormik({
    initialValues: {
      nim: "",
      name: "",
      email: "",
      kelas: "AK-",
      password: "",
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
      email: yup.string().email().max(50, "Maximum 40 characters"),
      kelas: yup
        .string()
        .min(1, "Kelas minimal 1 characters")
        .max(20, "Maximum 20 characters"),
      password: yup
        .string()
        .min(5, "Password minimal 5 characters")
        .max(100, "Maximum 100 characters")
        .required("Password Wajib di isi"),
    }),
    onSubmit: (values) => {
      register(values);
    },
  });

  const register = (values) => {
    if (onProses) return;
    setOnProses(true);

    //Call
    const callreg = axios
      .post(
        `${API.HOST}/api/v2/users/daftarbaru`,
        {
          nim: values.nim,
          name: values.name,
          kelas: values.kelas,
          email: values.email,
          password: values.password,
          role: typee,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
          },
        }
      )
      .finally(() => {
        setOnProses(false);
      });

    toast.promise(
      callreg,
      {
        loading: "Membuat akun...",
        success: (data) => {
          setOnProses(false);
          if (data.data.success) {
            dispatch(refresh());
            formik.resetForm();
            closeui();
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
          // message
        },
        error: (error) => {
          setOnProses(false);
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
          duration: 4500,
          icon: "",
        },
      }
    );
  };

  const handleChangeTypee = (event, newTypee) => {
    if (!newTypee) return;
    if (newTypee === "mahasiswa") {
      formik.setFieldValue("kelas", "AK-");
    } else {
      formik.setFieldValue("kelas", "-");
    }
    setTypee(newTypee);
  };

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={isopen}
        aria-labelledby="max-width-dialog-title"
      >
        <div className="flex justify-between mx-5 my-3">
          <div className="place-self-center text-2xl font-semibold capitalize">
            Buat Akun {typee}
          </div>
          <div className="">
            <IconButton
              aria-label="delete"
              className="focus:outline-none border bg-white"
              onClick={() => {
                if (onProses) return;
                closeui();
              }}
              size="large"
            >
              <CloseIcon className="text-red-500" />
            </IconButton>
          </div>
        </div>
        <hr />
        <DialogContent className="mb-3">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col -mt-3 -ml-1 mb-6">
              <ToggleButtonGroup
                color="primary"
                value={typee}
                exclusive
                onChange={handleChangeTypee}
              >
                <ToggleButton value="mahasiswa">Mahasiswa</ToggleButton>
                <ToggleButton value="dosen">Dosen</ToggleButton>
                {suser.isAuth && Number(suser.value._id) === 1 && (
                  <ToggleButton value="admin">Admin</ToggleButton>
                )}
              </ToggleButtonGroup>
            </div>
            <div className="flex flex-row mt-3 mb-6 space-x-2">
              <TextField
                fullWidth
                autoComplete="on"
                label={typee === "mahasiswa" ? "NIM" : "NIP"}
                placeholder="Masukkan NIM atau NIP"
                name="nim"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nim}
                error={formik.touched.nim && Boolean(formik.errors.nim)}
                helperText={formik.touched.nim && formik.errors.nim}
                InputLabelProps={{ shrink: true }}
              />
              {typee !== "mahasiswa" && (
                <TextField
                  fullWidth
                  autoComplete="on"
                  label="Email"
                  placeholder="Email (optional)"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </div>
            <div className="flex flex-col mt-3 mb-6">
              <TextField
                fullWidth
                autoComplete="on"
                label="Nama"
                placeholder={
                  typee === "mahasiswa"
                    ? "Nama Mahasiswa"
                    : typee === "admin"
                    ? "Nama Admin"
                    : "Nama Dosen"
                }
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            {typee === "mahasiswa" && (
              <div className="flex flex-col mt-3 mb-6">
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
            )}
            <div className="flex flex-col mt-3 mb-6">
              <TextField
                fullWidth
                autoComplete="on"
                label="Password"
                placeholder="Password"
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="flex flex-col items-center mt-10">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={onProses}
                startIcon={<PersonAddAltIcon />}
                endIcon={
                  onProses ? (
                    <CircularProgress
                      size={20}
                      thickness={4}
                      style={{ color: "white" }}
                    />
                  ) : null
                }
              >
                Buat Akun
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
