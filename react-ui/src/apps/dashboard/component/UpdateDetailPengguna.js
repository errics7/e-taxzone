import React, { useState, forwardRef } from "react";
import axios from "axios";
import { refresh } from "../../../redux/counterSlice";
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
import NumberFormat from "react-number-format";

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
      format="#### #### #### ####"
      mask=" "
      isNumericString
    />
  );
});

export default function UpdateDetailPengguna(props) {
  const dispatch = useDispatch();
  const { detailUser, stateUser, close } = props;
  const [onProses, setonProses] = useState(false);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const formik = useFormik({
    initialValues: {
      nim: detailUser?.nim,
      nama: detailUser?.nama,
      email: detailUser?.email ? detailUser.email : "",
      ttl: detailUser?.ttl ? detailUser.ttl : "",
      alamat: detailUser?.alamat ? detailUser.alamat : "",
      no_tlfn: detailUser?.no_tlfn ? detailUser.no_tlfn : "",
    },
    validationSchema: yup.object({
      nim: yup
        .string()
        .matches(/^[0-9]+$/, "NIM tidak valid")
        .min(8, "NIM minimal 8 characters")
        .max(20, "Maximum 20 characters")
        .required("NIM Wajib di isi"),
      nama: yup
        .string()
        .min(5, "Nama minimal 5 characters")
        .max(100, "Maximum 100 characters")
        .required("Nama Wajib di isi"),
      email: yup
        .string()
        .email("Invalid email format")
        .required("E-mail wajib diisi"),
      ttl: yup
        .string()
        .min(5, "TTL minimal 15 characters")
        .max(25, "TTL Maximum 25 characters")
        .required("Tempat tanggal Lahir Wajib di isi"),
      alamat: yup
        .string()
        .min(10, "Alamat minimal 10 characters")
        .max(250, "Alamat Maximum 250 characters")
        .required("Alamat Wajib di isi"),
      no_tlfn: yup
        .string()
        .matches(phoneRegExp, "Phone number tidak valid")
        .required("Phone number Wajib di isi"),
    }),
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const handleSave = (values) => {
    if (onProses) return;

    setonProses(true);
    const update = axios.post(
      `${API.HOST}/api/v2/myaccount/data/update`,
      {
        id: stateUser._id,
        nim: values.nim,
        nama: values.nama,
        email: values.email,
        ttl: values.ttl,
        alamat: values.alamat,
        no_tlfn: values.no_tlfn,
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
          dispatch(refresh());

          if (data.data.success === true) close();

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
            Perbarui Data
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
            <div className="my-3">
              <TextField
                fullWidth
                autoComplete="on"
                label="NIM"
                placeholder="NIM"
                name="nim"
                variant={"standard"}
                onChange={() => {}}
                value={formik.values.nim}
                InputLabelProps={{ shrink: true }}
                inputProps={{ readOnly: true }}
              />
            </div>
            <div className="my-3">
              <TextField
                fullWidth
                autoComplete="on"
                label="Nama"
                placeholder="Nama"
                name="nama"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nama}
                error={formik.touched.nama && Boolean(formik.errors.nama)}
                helperText={formik.touched.nama && formik.errors.nama}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-3 mb-6">
              <TextField
                fullWidth
                autoComplete="on"
                label="Email"
                placeholder="Masukkan Email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-3 mb-6">
              <TextField
                fullWidth
                autoComplete="on"
                label="Tempat, Tanggal lahir"
                placeholder="Masukkan Tempat, Tanggal lahir"
                name="ttl"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ttl}
                error={formik.touched.ttl && Boolean(formik.errors.ttl)}
                helperText={formik.touched.ttl && formik.errors.ttl}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-3 mb-6">
              <TextField
                fullWidth
                autoComplete="on"
                label="Alamat"
                placeholder="Masukkan Alamat"
                name="alamat"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.alamat}
                error={formik.touched.alamat && Boolean(formik.errors.alamat)}
                helperText={formik.touched.alamat && formik.errors.alamat}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-3 mb-6">
              <TextField
                fullWidth
                autoComplete="on"
                label="No Telephone"
                placeholder="No Telephone"
                name="no_tlfn"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.no_tlfn}
                error={formik.touched.no_tlfn && Boolean(formik.errors.no_tlfn)}
                helperText={formik.touched.no_tlfn && formik.errors.no_tlfn}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputComponent: NumberFormatCustom,
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
