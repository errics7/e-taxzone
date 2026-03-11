import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import makeStyles from '@mui/styles/makeStyles';
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import { useState } from "react";
import { find, groupBy, map } from "lodash";
import { toast } from "react-hot-toast";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  btnsave: {
    // marginLeft: "25px",
    marginTop: "15px",
    marginBottom: "5px",
    textTransform: "capitalize",
    backgroundColor: "#2D90DA",
  },
  btndel: {
    marginBottom: "25px",
    textTransform: "capitalize",
  },
}));

export default function NewCust(props) {
  const classes = useStyles();
  const { dataConfig, setdataConfig, title } = props;

  const [cusName, setCusName] = useState("");
  const data = groupBy(dataConfig.datajurnal, "gen");
  const objJurnal = map(data, (obj, key) => {
    return { head: key, values: obj };
  });

  const customerBaru = () => {
    if (cusName === "") {
      toast.error("Masukkan Nama customer Sebelum Menambahkan");
      return;
    }
    const variatif = uuidv4();

    const newlist = [
      {
        uid: uuidv4(),
        gen: variatif,
        type: "intro",
        tgl: "1-Des-2021",
        keterangan: "Saldo Awal",
        namapelanggan: cusName,
        nofaktur: "",

        piutangdagang: 0,
        hpp: 0,
        penjualan: 0,
        ppnkeluaran: 0,
        persediaan: 0,
        kas: 0,

        key: "piutangdagang",
        posisi: "debit",
        jumlah: 1000000, //only type intro
      },
      {
        uid: uuidv4(),
        gen: variatif,
        type:
          title === "Jurnal Kas Masuk"
            ? "jurnal kas masuk"
            : "jurnal penjualan",
        tgl: "",
        keterangan: "",
        namapelanggan: cusName,
        nofaktur: "",

        piutangdagang: 0,
        hpp: 0,
        penjualan: 0,
        ppnkeluaran: 0,
        persediaan: 0,
        kas: 0,

        key: "piutangdagang",
        posisi: title === "Jurnal Kas Masuk" ? "kredit" : "debit",
        jumlah: 0, //only type intro
      },
    ];

    setdataConfig({
      ...dataConfig,
      datajurnal: [...dataConfig.datajurnal, ...newlist],
    });

    setCusName("");
    props.closeCallback();
    toast.success("Berhasil Menambahkan Customer baru", {
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
    });
  };

  const customerLama = (gen, nama) => {
    const newlist = [
      {
        uid: uuidv4(),
        gen: gen,
        type:
          title === "Jurnal Kas Masuk"
            ? "jurnal kas masuk"
            : "jurnal penjualan",
        tgl: "",
        keterangan: "",
        namapelanggan: nama,
        nofaktur: "",

        piutangdagang: 0,
        hpp: 0,
        penjualan: 0,
        ppnkeluaran: 0,
        persediaan: 0,
        kas: 0,

        key: "piutangdagang",
        posisi: title === "Jurnal Kas Masuk" ? "kredit" : "debit",
        jumlah: 0, //only type intro
      },
    ];

    setdataConfig({
      ...dataConfig,
      datajurnal: [...dataConfig.datajurnal, ...newlist],
    });

    setCusName("");
    props.closeCallback();
    toast.success(`Berhasil Menambahkan Data ${nama} baru`, {
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
    });
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      disableEnforceFocus
      closeAfterTransition={true}
      className={classes.modal}
      open={props.openn}
      onClose={() => {
        props.closeCallback();
      }}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.openn}>
        <div className="relative bg-white outline-none rounded-lg w-3/4 min-h-30v  flex flex-col items-center">
          <div className="relative inset-y-0 top-0 flex flex-row w-full items-center border-b justify-center">
            <h2 className="flex-none text-center font-medium text-2xl py-5">
              Data Baru {title}
            </h2>
            <div className="absolute inset-y-2 right-2">
              <IconButton onClick={() => props.closeCallback()} size="large">
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className="p-5 flex flex-col w-full mx-auto">
            <div className="grow h-24 flex flex-col">
              <TextField
                fullWidth
                label="Nama Customer Baru"
                placeholder="Nama Customer Baru"
                value={cusName}
                name="name"
                onChange={(e) => setCusName(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.btnsave}
                startIcon={<AddIcon fontSize="inherit" />}
                onClick={() => customerBaru()}
              >
                Customer Baru
              </Button>
            </div>
            <p className=" text-center w-36 mx-auto my-5">
              Atau Pilih dari data customer yang sudah Ada
            </p>
            <div className="grow min-h-20v max-h-20v overflow-y-scroll h-32 bg-slate-50 border rounded-sm p-2 px-5 flex flex-col mb-5">
              {objJurnal.map((el, i) => {
                const da = find(dataConfig.datajurnal, { gen: el.head });
                return (
                  <div
                    key={i}
                    onClick={() => {
                      customerLama(el.head, da.namapelanggan);
                    }}
                    className="my-1 p-2 h-10 border rounded bg-white cursor-pointer hover:bg-slate-200  hover:shadow transform hover:scale-102 duration-500"
                  >
                    {da.namapelanggan}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
