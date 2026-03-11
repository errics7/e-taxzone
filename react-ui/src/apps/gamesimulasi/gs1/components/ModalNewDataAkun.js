//#region
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
import NumberFormat from "react-number-format";
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
  },
  btndel: {
    marginBottom: "25px",
    textTransform: "capitalize",
  },
}));

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
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

//#endregion

function ModalNewDataAkun(props) {
  const classes = useStyles();
  const [jenis, setJenis] = useState("debit");
  const [load, setLoad] = useState(false);
  //formik used
  const formik = useFormik({
    initialValues: {
      nama: "",
      noakun: "",
      jumlah: 0,
    },
    validationSchema: yup.object({
      nama: yup
        .string()
        .min(2, "Nama minimal 2 characters")
        .max(35, "Maximum 50 characters")
        .required("Nama Wajib di isi"),
      noakun: yup
        .string()
        .matches(/^[0-9]+$/, "No Akun Harus Angka")
        .min(1, "Nama minimal 1 characters")
        .max(5, "Maximum 5 characters")
        .required("No Akun Wajib di isi"),
      jumlah: yup
        .string()
        .max(25, "Jumlah Maximum 25 characters")
        .required("Jumlah Wajib di isi"),
    }),
  });

  const saveToDb = async () => {
    if (load) return;
    //#region VALID CHECK
    if (
      !formik.isValid ||
      formik.values.noakun === "" ||
      formik.values.nama === ""
    ) {
      toast.error("Isi data No Akun terlebih dahulu.");
      return;
    }
    if (jenis === "") {
      toast.error("Pilih Jenis terlebih dahulu.");
      return;
    }
    //#endregion VALID CHECK

    setLoad(true);
    //#region CEK AVAIL
    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs1/databank/baru`,
      {
        noakun: formik.values.noakun,
        akun: formik.values.nama,
        jumlah: formik.values.jumlah,
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
        loading: "Menyimpan Data...",
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
              <TextField
                style={{
                  marginTop: 0,
                  maxWidth: "50%",
                  marginBottom: "15px",
                }}
                fullWidth
                margin="normal"
                label="No Akun"
                placeholder="Masukkan No Akun"
                name="noakun"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.noakun}
                error={formik.touched.noakun && Boolean(formik.errors.noakun)}
                helperText={formik.touched.noakun && formik.errors.noakun}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                style={{ marginTop: 0, marginBottom: "15px" }}
                fullWidth
                margin="normal"
                label="Nama Akun"
                placeholder="Beri Nama Akun"
                name="nama"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nama}
                error={formik.touched.nama && Boolean(formik.errors.nama)}
                helperText={formik.touched.nama && formik.errors.nama}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                style={{ marginTop: 0, marginBottom: "15px" }}
                fullWidth
                margin="normal"
                label="Jumlah"
                placeholder="Masukkan Jumlah"
                name="jumlah"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.jumlah}
                error={formik.touched.jumlah && Boolean(formik.errors.jumlah)}
                helperText={formik.touched.jumlah && formik.errors.jumlah}
                InputProps={{
                  inputComponent: NumberFormatCustom,
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
                  <MenuItem value={"debit"}>Debet</MenuItem>
                  <MenuItem value={"kredit"}>Kredit</MenuItem>
                </Select>
              </FormControl>
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
                Tambahkan Data Akun
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
}

export default ModalNewDataAkun;
