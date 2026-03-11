import makeStyles from "@mui/styles/makeStyles";
import { Button, TextareaAutosize, TextField, IconButton } from "@mui/material";

import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import swal from "sweetalert";
import "./custom_sweetalert.css";
import NewCust from "./NewCust";

import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
import { findIndex, filter, sumBy, map, remove } from "lodash";
import { forwardRef, useState } from "react";
import { toast } from "react-hot-toast";
import PopMenuRow8 from "./PopMenuRow8";

const numberFormat = (number) => {
  return (
    <NumberFormat
      value={number}
      displayType={"text"}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
      renderText={(value, props) => <div {...props}>{value}</div>}
    />
  );
};

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
            value: Number(values.value),
          },
        });
      }}
      prefix="Rp "
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

const useStyles = makeStyles((theme) => ({
  inpputTanggal: {
    padding: "0px 0px 0px 20px",
  },
}));

export default function TablePenjualanAdmin8(props) {
  const classes = useStyles();
  const { dataConfig, setdataConfig } = props;

  const [title, setTitle] = useState("");
  const [showCus, setShowCus] = useState(false);

  //#region
  const handleInputChange = (e, uid) => {
    const { name, value } = e.target;
    const index = findIndex(dataConfig.datajurnal, { uid: uid });
    const list = [...dataConfig.datajurnal];
    list[index][name] = value;
    setdataConfig({ ...dataConfig, datajurnal: list });
  };
  const handleChangeName = (e, gen) => {
    const { name, value } = e.target;
    const da = [...dataConfig.datajurnal];
    const list = map(da, (x) => (x.gen === gen ? { ...x, [name]: value } : x));
    setdataConfig({ ...dataConfig, datajurnal: list });
  };
  const confirmToKey = (name, uid, val, type) => {
    swal(`Anda akan mengganti kunci ke kolom ${name} ?`, {
      buttons: {
        cancel: "Batal",
        catch: {
          text: "Ya",
          value: "oke",
          className: "ml-5",
        },
      },
    }).then((value) => {
      switch (value) {
        case "defeat":
          swal("Pikachu fainted! You gained 500 XP!");
          break;

        case "oke":
          const index = findIndex(dataConfig.datajurnal, { uid: uid });
          const list = [...dataConfig.datajurnal];
          list[index]["key"] = val;
          list[index]["posisi"] = type;
          setdataConfig({ ...dataConfig, datajurnal: list });
          swal("Kunci Telah diganti", {
            icon: "success",
          });
          break;
        default:
          return;
      }
    });
  };
  const deletedRow = (item) => {
    const sisa = filter(dataConfig.datajurnal, { gen: item.gen });
    console.log(sisa.length);
    if (sisa.length > 2) {
      // console.log("Delete 1");
      const excepted = remove(dataConfig.datajurnal, (x) => x.uid !== item.uid);

      setdataConfig({ ...dataConfig, datajurnal: excepted });
    } else {
      // console.log("Delete all");
      const excepted = filter(dataConfig.datajurnal, (x) => x.gen !== item.gen);

      setdataConfig({ ...dataConfig, datajurnal: excepted });
    }
    toast.success(`Data ${item.namapelanggan} Berhasil dihapus`, {
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

  return (
    <div className="relative mt-5">
      <div className="mt-2 mb-5 relative">
        <TextareaAutosize
          className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
          value={props.dataConfig ? props.dataConfig.intropenjualan : " "}
          onChange={(e) => {
            props.setdataConfig({
              ...props.dataConfig,
              intropenjualan: e.target.value,
            });
          }}
        />
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 opacity-70 absolute inset-y-1 right-0"
        />
      </div>
      <div className="flex flex-col items-center font-bold">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.cvname : ""}
            className={"font-semibold uppercase"}
            onChange={(text) => setdataConfig({ ...dataConfig, cvname: text })}
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
      </div>
      <div className="flex flex-col items-center mb-1">
        <div className="text-lg font-semibold relative uppercase">
          Jurnal penjualan
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            className={"font-semibold tracking-wider"}
            value={dataConfig ? dataConfig.tblworkname : ""}
            onChange={(text) =>
              setdataConfig({ ...dataConfig, tblworkname: text })
            }
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
      </div>
      <>
        <div className="mt-3 overflow-x-auto border-collapse border pb-1">
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th
                  rowSpan="3"
                  className="min-w-20v max-w-20v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Tanggal
                </th>
                <th
                  rowSpan="3"
                  className="min-w-20v max-w-20v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Keterangan
                </th>
                <th
                  rowSpan="3"
                  className="min-w-20v max-w-20v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Nama Pelanggan
                </th>
                <th
                  rowSpan="3"
                  className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  No. Faktur
                </th>
                <th
                  colSpan="2"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Debet
                </th>
                <th
                  colSpan="3"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Kredit
                </th>
              </tr>
              <tr>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Piutang Dagang
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  HPP
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Penjualan
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  PPN Keluaran
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Persediaan
                </th>
              </tr>
              <tr>
                {["112", "510", "410", "213", "115"].map((item, index) => {
                  //   const dat = find(dataConfig.dataakun, { name: item });
                  return (
                    <th
                      key={index}
                      className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                    >
                      {/* {dat && dat.noakun} */}
                      {item}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {dataConfig &&
                filter(dataConfig.datajurnal, { type: "jurnal penjualan" }).map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                    >
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 z-50 flex items-center opacity-100">
                            <PopMenuRow8 removeRow={() => deletedRow(item)} />
                          </div>
                          <TextField
                            fullWidth
                            className={classes.inpputTanggal}
                            placeholder="Tanggal"
                            value={item.tgl}
                            name="tgl"
                            onChange={(e) => handleInputChange(e, item.uid)}
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className="relative">
                          <TextField
                            fullWidth
                            className={classes.inpputKeperluan}
                            placeholder="Keterangan"
                            value={item.keterangan}
                            name="keterangan"
                            onChange={(e) => handleInputChange(e, item.uid)}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className="relative">
                          <TextField
                            className={classes.inpputKeperluan}
                            placeholder="Nama Pelanggan"
                            value={item.namapelanggan}
                            name="namapelanggan"
                            onChange={(e) => handleChangeName(e, item.gen)}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className="relative">
                          <TextField
                            className={classes.inpputKeperluan}
                            placeholder="No. Faktur"
                            value={item.nofaktur}
                            name="nofaktur"
                            onChange={(e) => handleInputChange(e, item.uid)}
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div
                          className={`relative ${
                            item.key === "piutangdagang" &&
                            "bg-emerald-500 bg-opacity-20"
                          } `}
                        >
                          <TextField
                            placeholder="Piutang Dagang"
                            value={item.piutangdagang}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="piutangdagang"
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                          <div className="absolute -inset-y-2 -left-0 ">
                            {item.key !== "piutangdagang" && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  confirmToKey(
                                    "Piutang Dagang",
                                    item.uid,
                                    "piutangdagang",
                                    "debit"
                                  )
                                }
                              >
                                <VpnKeyIcon
                                  fontSize="small"
                                  className="p-0.5"
                                />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className=" text-slate-800 text-center border border-b">
                        <div
                          className={`relative px-1 py-1 ${
                            item.key === "hpp" && "bg-emerald-500 bg-opacity-20"
                          } `}
                        >
                          <TextField
                            placeholder="HPP"
                            value={item.hpp}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="hpp"
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                          <div className="absolute -inset-y-2 -left-0 ">
                            {item.key !== "hpp" && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  confirmToKey("Hpp", item.uid, "hpp", "debit")
                                }
                              >
                                <VpnKeyIcon
                                  fontSize="small"
                                  className="p-0.5"
                                />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div
                          className={`relative ${
                            item.key === "penjualan" &&
                            "bg-emerald-500 bg-opacity-20"
                          } `}
                        >
                          <TextField
                            placeholder="Penjualan"
                            value={item.penjualan}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="penjualan"
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                          <div className="absolute -inset-y-2 -left-0 ">
                            {item.key !== "penjualan" && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  confirmToKey(
                                    "Penjualan",
                                    item.uid,
                                    "penjualan",
                                    "kredit"
                                  )
                                }
                              >
                                <VpnKeyIcon
                                  fontSize="small"
                                  className="p-0.5"
                                />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div
                          className={`relative ${
                            item.key === "ppnkeluaran" &&
                            "bg-emerald-500 bg-opacity-20"
                          } `}
                        >
                          <TextField
                            placeholder="PPN Keluaran"
                            value={item.ppnkeluaran}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="ppnkeluaran"
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                          <div className="absolute -inset-y-2 -left-0 ">
                            {item.key !== "ppnkeluaran" && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  confirmToKey(
                                    "PPN Keluaran",
                                    item.uid,
                                    "ppnkeluaran",
                                    "kredit"
                                  )
                                }
                              >
                                <VpnKeyIcon
                                  fontSize="small"
                                  className="p-0.5"
                                />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div
                          className={`relative ${
                            item.key === "persediaan" &&
                            "bg-emerald-500 bg-opacity-20"
                          } `}
                        >
                          <TextField
                            placeholder="Persediaan"
                            value={item.persediaan}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="persediaan"
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                          <div className="absolute -inset-y-2 -left-0 ">
                            {item.key !== "persediaan" && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  confirmToKey(
                                    "Persediaan",
                                    item.uid,
                                    "persediaan",
                                    "kredit"
                                  )
                                }
                              >
                                <VpnKeyIcon
                                  fontSize="small"
                                  className="p-0.5"
                                />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan="4"
                  className="p-1 font-bold text-slate-600 border border-slate-300"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.btnadd}
                    startIcon={<LibraryAddIcon />}
                    onClick={() => {
                      setTitle("Jurnal Penjualan");
                      setShowCus(true);
                    }}
                  >
                    Tambah
                  </Button>
                </td>
                <td className="p-1 font-bold text-slate-600 border border-slate-300">
                  &nbsp;
                </td>
                <td className="p-1 font-bold text-slate-600 border border-slate-300">
                  &nbsp;
                </td>
                <td className="p-1 font-bold text-slate-600 border border-slate-300">
                  &nbsp;
                </td>
                <td className="p-1 font-bold text-slate-600 border border-slate-300">
                  &nbsp;
                </td>
                <td className="p-1 font-bold text-slate-600 border border-slate-300">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td
                  colSpan="4"
                  className="px-10 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-right"
                >
                  Jumlah
                </td>
                {[
                  "piutangdagang",
                  "hpp",
                  "penjualan",
                  "ppnkeluaran",
                  "persediaan",
                ].map((item, index) => {
                  //   const dat = find(dataConfig.dataakun, { name: item });
                  return (
                    <th
                      key={index}
                      className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center"
                    >
                      {numberFormat(
                        sumBy(
                          filter(dataConfig.datajurnal, {
                            type: "jurnal penjualan",
                          }),
                          item
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
        <NewCust
          title={title}
          dataConfig={dataConfig}
          setdataConfig={(x) => setdataConfig(x)}
          openn={showCus}
          closeCallback={() => setShowCus(false)}
        />
      </>
    </div>
  );
}
