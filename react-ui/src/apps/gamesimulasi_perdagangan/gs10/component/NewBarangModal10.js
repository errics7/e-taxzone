import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";

import makeStyles from '@mui/styles/makeStyles';
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import { useState } from "react";
import { find, groupBy, map, filter } from "lodash";
import { toast } from "react-hot-toast";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: Number(values.value),
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
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

export default function NewBarangModal10(props) {
  const classes = useStyles();
  const { dataConfig, setdataConfig, title } = props;

  const data = groupBy(dataConfig.databarang, "gen");
  const objBrg = map(data, (obj, key) => {
    return { head: key, values: obj };
  });

  const [dataTrx, setDataTrx] = useState({
    uid: uuidv4(),
    gen: uuidv4(),
    namabarang: "",
    satuan: "",
    jumlah: 0,
    harga: 0,
    total: 0,
    type: "",
  });

  //#region
  const resetDat = () => {
    setDataTrx({
      uid: uuidv4(),
      gen: uuidv4(),
      namabarang: "",
      satuan: "",
      jumlah: 0,
      harga: 0,
      total: 0,
      type: "",
    });
  };
  const handleInputBrg = (e) => {
    const { name, value } = e.target;
    const dum = dataTrx;
    if (name === "jumlah" || name === "harga") {
      dum[name] = value;
      dum["total"] = Number(dum["jumlah"]) * Number(dum["harga"]);
    } else {
      dum[name] = value;
    }
    setDataTrx({ ...dum });
  };

  const customerBaru = () => {
    const data = [...dataConfig.databarang];
    data.splice(dataConfig.databarang.length, 0, {
      ...dataTrx,
      type: title === "Transaksi Pembelian Baru" ? "buy" : "sell",
    });

    setdataConfig({
      ...dataConfig,
      databarang: data,
    });

    //Reset
    resetDat();

    props.closeCallback();
    toast.success("Berhasil Menambahkan Transaksi baru", {
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
    const data = [...dataConfig.databarang];
    data.splice(dataConfig.databarang.length, 0, {
      ...dataTrx,
      namabarang: nama,
      gen: gen,
      type: title === "Transaksi Pembelian Baru" ? "buy" : "sell",
    });

    setdataConfig({
      ...dataConfig,
      databarang: data,
    });

    //Reset
    resetDat();

    props.closeCallback();
    toast.success("Berhasil Menambahkan Transaksi baru", {
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
  //#endregion

  //Pairing
  const dataPair = filter(objBrg, (x) => x.values.length < 2).map((el, i) =>
    find(dataConfig.databarang, { gen: el.head })
  );

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
        <div className="relative bg-white outline-none rounded-lg w-3/4 max-w-3xl min-h-30v  flex flex-col items-center">
          <div className="relative inset-y-0 top-0 flex flex-row w-full items-center border-b justify-center">
            <h2 className="flex-none text-center font-medium text-2xl py-5">
              {title}
            </h2>
            <div className="absolute inset-y-2 right-2">
              <IconButton onClick={() => props.closeCallback()} size="large">
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className="p-5 flex flex-col w-full mx-auto">
            <div className="grow flex flex-col">
              {title === "Transaksi Pembelian Baru" ? (
                <>
                  Data Transaksi Pembelian Kredit Baru :
                  <table className="w-full border text-center my-1">
                    <thead className="border-b">
                      <tr>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                        >
                          Nama Barang
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 min-w-7v max-w-7v py-3 border-r"
                        >
                          Satuan
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                        >
                          Jumlah
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                        >
                          Harga (Rp)
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3"
                        >
                          Total (Rp)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Nama Barang"
                              value={dataTrx.namabarang}
                              name="namabarang"
                              onChange={(e) => handleInputBrg(e)}
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                              }}
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                            />
                          </div>
                        </td>
                        <td className="py-2 min-w-7v max-w-7v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Satuan"
                              value={dataTrx.satuan}
                              name="satuan"
                              onChange={(e) => handleInputBrg(e)}
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                              }}
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                            />
                          </div>
                        </td>
                        <td className="py-2 min-w-15v max-w-15v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Jumlah"
                              value={dataTrx.jumlah}
                              name="jumlah"
                              onChange={(e) => handleInputBrg(e)}
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                            />
                          </div>
                        </td>
                        <td className="py-2 min-w-15v max-w-15v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Harga"
                              value={dataTrx.harga}
                              name="harga"
                              onChange={(e) => handleInputBrg(e)}
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                            />
                          </div>
                        </td>
                        <td className="py-2 min-w-15v max-w-15v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Total"
                              value={dataTrx.total}
                              name="total"
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                readOnly: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  Data Transaksi Penjualan Tunai Baru :
                  <table className="w-full border text-center my-1">
                    <thead className="border-b">
                      <tr>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                        >
                          Jumlah
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                        >
                          Uraian
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                        >
                          Harga per Unit
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3"
                        >
                          Total (Rp)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 min-w-5v max-w-5v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Jumlah"
                              value={dataTrx.jumlah}
                              name="jumlah"
                              onChange={(e) => handleInputBrg(e)}
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                            />
                          </div>
                        </td>
                        <td className="py-2 min-w-20v max-w-20v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Uraian"
                              value={dataTrx.namabarang}
                              name="namabarang"
                              onChange={(e) => handleInputBrg(e)}
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                              }}
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                            />
                          </div>
                        </td>
                        <td className="py-2 min-w-15v max-w-15v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Harga"
                              value={dataTrx.harga}
                              name="harga"
                              onChange={(e) => handleInputBrg(e)}
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                            />
                          </div>
                        </td>
                        <td className="py-2 min-w-15v max-w-15v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Total"
                              value={dataTrx.total}
                              name="total"
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                readOnly: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}

              <Button
                variant="contained"
                color="primary"
                className={classes.btnsave}
                startIcon={<AddIcon fontSize="inherit" />}
                onClick={() => customerBaru()}
              >
                Transaksi Baru
              </Button>
            </div>
            <p className=" text-center w-3/4 mx-auto my-5">
              Atau hubungkan dengan data penjualan tunai yang sudah Ada
            </p>
            <div className="relative grow min-h-20v max-h-20v overflow-y-scroll h-32 bg-slate-50 border rounded-sm p-2 px-5 flex flex-col mb-5">
              {filter(dataPair, {
                type: title === "Transaksi Pembelian Baru" ? "sell" : "buy",
              }).map((el, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      customerLama(el.gen, el.namabarang);
                    }}
                    className="my-1 p-2 h-10 border rounded bg-white cursor-pointer hover:bg-slate-200  hover:shadow transform hover:scale-102 duration-500"
                  >
                    {el.namabarang}
                  </div>
                );
              })}
              {filter(dataPair, {
                type: title === "Transaksi Pembelian Baru" ? "sell" : "buy",
              }).length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  Tidak ada data untuk dihubungkan
                </div>
              )}
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
