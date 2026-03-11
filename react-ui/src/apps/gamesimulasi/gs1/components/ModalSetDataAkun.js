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
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import swal from "sweetalert";

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

export default function ModalSetDataAkun(props) {
  const classes = useStyles();
  const [load, setLoad] = useState(false);
  const { data } = props;

  //formik used
  const formik = useFormik({
    initialValues: {
      noakun: data ? data.code : "",
      nama: data ? data.name : "",
      jumlah: data ? data.nominal : 0,
      jenis: data ? data.jenis : "",
    },
    validationSchema: yup.object({
      noakun: yup
        .string()
        .matches(/^[0-9]+$/, "Nomor Akun wajib Angka")
        .min(1, "Nama minimal 1 characters")
        .max(5, "Maximum 5 characters")
        .required("No Akun Wajib di isi"),
      nama: yup
        .string()
        .min(2, "Nama minimal 2 characters")
        .max(50, "Maximum 50 characters")
        .required("Nama Wajib di isi"),
      jumlah: yup
        .string()
        .max(15, "Jumlah Maximum 15 characters")
        .required("Jumlah Wajib di isi"),
      jenis: yup.string().required("Jumlah Wajib di isi"),
    }),
  });

  const deleted = () => {
    if (load) return;
    setLoad(true);

    const pushToDelete = axios.post(
      `${API.HOST}/api/v2/manufakturgs1/databank/hapus`,
      {
        id: data.id,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    // Notif
    toast.promise(
      pushToDelete,
      {
        loading: "Menghapus Data...",
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
  const updateData = () => {
    if (load) return;
    if (!formik.isValid || formik.values.nama === "") {
      toast.error("Data Akun tidak falid, Pastikan semua terisi.");
      return;
    }

    setLoad(true);
    const pushToUpdate = axios.post(
      `${API.HOST}/api/v2/manufakturgs1/databank/update`,
      {
        id: data.id,
        // noakun: formik.values.noakun,
        akun: formik.values.nama,
        jumlah: formik.values.jumlah,
        jenis: formik.values.jenis,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    // Notif
    toast.promise(
      pushToUpdate,
      {
        loading: "Memperbaruhi Data...",
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

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={() => props.close()}
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
                Edit Data Akun
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
                InputProps={{
                  readOnly: true,
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
                  name="jenis"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.jenis}
                  error={formik.touched.jenis && Boolean(formik.errors.jenis)}
                  helpertext={formik.touched.jenis && formik.errors.jenis}
                >
                  <MenuItem value={"debit"}>Debit</MenuItem>
                  <MenuItem value={"kredit"}>Kredit</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="flex justify-between w-full px-6 mt-5">
              <Button
                variant="contained"
                color="primary"
                disabled={load}
                className={classes.btnsave}
                onClick={() => updateData()}
              >
                Perbarui Data
              </Button>
              <Button
                variant="outlined"
                color="error"
                disabled={load}
                startIcon={<DeleteIcon />}
                className={classes.btndel}
                onClick={() => {
                  swal({
                    title: "Peringatan",
                    text: "Anda akan menghapus data akun ?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  }).then((willDelete) => {
                    if (willDelete) {
                      deleted();
                    } else {
                      return;
                    }
                  });
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
