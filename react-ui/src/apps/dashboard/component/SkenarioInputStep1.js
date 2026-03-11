import React, { useState } from "react";
import { TextField, Button, Tooltip, CircularProgress } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import SaveAsIcon from "@mui/icons-material/SaveAs";

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

function SkenarioInputStep1(props) {
  const classes = useStyles();
  const [isLoad, setIsLoad] = useState(false);

  const makeid = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  //formik used
  const formik = useFormik({
    initialValues: {
      nama: "",
      code: makeid(6),
      deskripsi: "",
    },
    validationSchema: yup.object({
      nama: yup
        .string()
        .min(2, "Nama minimal 2 characters")
        .max(100, "Maximum 50 characters")
        .required("Nama Wajib di isi"),
      code: yup
        .string()
        .min(5, "Code minimal 5 characters")
        .max(15, "Maximum 15 characters")
        .required("Code Wajib di isi"),
      deskripsi: yup
        .string()
        .min(5, "Deskripsi minimal 5 characters")
        .max(150, "Maximum 150 characters")
        .required("Deskripsi Wajib di isi"),
    }),
    onSubmit: (values) => {
      createProcess(values);
    },
  });

  const createProcess = (values) => {
    if (isLoad) return;
    //Call
    setIsLoad(true);
    const callCreate = axios.post(
      `${API.HOST}/api/v2/skenario/baru`,
      {
        nama: values.nama,
        code: values.code,
        deskripsi: values.deskripsi,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );

    // console.log(values);
    toast.promise(
      callCreate,
      {
        loading: "Membuat ...",
        success: (data) => {
          setIsLoad(false);
          if (data.data.success) {
            props.setDataScn(data.data.data);
            props.setPosisi(2);
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
    <form onSubmit={formik.handleSubmit}>
      <div className="flex mt-5">
        <TextField
          label="Nama Kelas"
          style={{
            width: "50%",
            marginRight: "4%",
            marginTop: 0,
            marginBottom: "15px",
          }}
          placeholder="Nama kelas"
          margin="normal"
          name="nama"
          variant="outlined"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.nama}
          error={formik.touched.nama && Boolean(formik.errors.nama)}
          helperText={formik.touched.nama && formik.errors.nama}
        />
        <div className="w-1/2 flex items-center">
          <TextField
            label="Kode Akses"
            style={{ width: "100%", marginTop: 0, marginBottom: "15px" }}
            placeholder="Kode Akses"
            margin="normal"
            InputLabelProps={{
              shrink: true,
              // readOnly: true,
            }}
            name="code"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.code}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
          />
          <Tooltip title="klik untuk merubah code">
            <IconButton
              onClick={() => formik.setFieldValue("code", makeid(6))}
              size="large"
              style={{ marginBottom: "15px" }}
            >
              <AutorenewIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <TextField
        label="Deskripsi kelas"
        style={{ width: "100%", marginTop: 5 }}
        placeholder="Isi Deskripsi Scenario kelas"
        margin="normal"
        multiline
        rows={4}
        name="deskripsi"
        variant="outlined"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.deskripsi}
        error={formik.touched.deskripsi && Boolean(formik.errors.deskripsi)}
        helperText={formik.touched.deskripsi && formik.errors.deskripsi}
      />
      <div className="flex justify-end w-full px-5 mt-5 space-x-4">
        <Button
          variant="outlined"
          color="error"
          onClick={() => props.onClose()}
          className={classes.btncancel}
          disabled={isLoad}
        >
          Batal
        </Button>

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
          Buat Mata Pelajaran Baru
        </Button>
      </div>
    </form>
  );
}

export default SkenarioInputStep1;
