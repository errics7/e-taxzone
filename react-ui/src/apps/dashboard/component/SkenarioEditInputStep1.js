import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import { refresh } from "../../../redux/counterSlice";
import { useDispatch } from "react-redux";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function SkenarioEditInputStep1(props) {
  const [isLoad, setIsLoad] = useState(false);
  const dispatch = useDispatch();

  //formik used
  const formik = useFormik({
    initialValues: {
      nama: props.dataScn.nama,
      code: props.dataScn.code,
      deskripsi: props.dataScn.deskripsi,
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
      if (isLoad) return;
      //Call
      setIsLoad(true);
      const callUpdate = axios.post(
        `${API.HOST}/api/v2/skenario/updateinfo`,
        {
          updateid: props.dataScn.scn_id,
          name: values.nama,
          deskripsi: values.deskripsi,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
          },
        }
      );

      toast.promise(
        callUpdate,
        {
          loading: "Pembaruan data ...",
          success: (data) => {
            setIsLoad(false);
            dispatch(refresh());
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
    },
  });

  const nextProses = () => {
    setIsLoad(true);
    axios(
      `${API.HOST}/api/v2/skenario/listgsworksheet/${props.dataScn.worksheet_id}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    )
      .then((res) => {
        setIsLoad(false);
        props.setDataWsScn(res.data);
        props.setPosisi(2);
        dispatch(refresh());
      })
      .catch((err) => {
        setIsLoad(false);
        console.error(err);
      });
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex mt-5">
        <TextField
          label="Nama Scenario"
          style={{
            width: "50%",
            marginRight: "4%",
            marginTop: 0,
            marginBottom: "15px",
          }}
          placeholder="Nama Scenario"
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
            disabled
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
        </div>
      </div>

      <TextField
        label="Deskripsi"
        style={{ width: "100%", marginTop: 5 }}
        placeholder="Isi Deskripsi Scenario"
        margin="normal"
        variant="outlined"
        multiline
        rows={4}
        name="deskripsi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.deskripsi}
        error={formik.touched.deskripsi && Boolean(formik.errors.deskripsi)}
        helperText={formik.touched.deskripsi && formik.errors.deskripsi}
      />
      <div className="flex justify-end items-center w-full px-6 my-5 space-x-8">
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoad}
          startIcon={<SaveAsIcon />}
        >
          Simpan Perubahan
        </Button>

        {/* <Button
          onClick={nextProses}
          type="button"
          variant="outlined"
          color="primary"
          disabled={isLoad}
          endIcon={
            isLoad ? (
              <CircularProgress size={20} thickness={4} />
            ) : (
              <ArrowForwardIcon />
            )
          }
        >
          Selanjutnya
        </Button> */}
      </div>
    </form>
  );
}

export default SkenarioEditInputStep1;
