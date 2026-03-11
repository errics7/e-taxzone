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
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

const useStyles = makeStyles((theme) => ({
  btnadd: {
    margin: "5px 0px 5px 20px",
  },
  inpputTanggal: {
    padding: "0px 0px 0px 20px",
  },
}));

export default function TablePembelianAdmin9(props) {
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
          value={props.dataConfig ? props.dataConfig.intropembelian : " "}
          onChange={(e) => {
            props.setdataConfig({
              ...props.dataConfig,
              intropembelian: e.target.value,
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
          Jurnal Pembelian
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
                  className="min-w-25v max-w-25v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Keterangan (Nama Pemasok)
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
                  colSpan="1"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Kredit
                </th>
              </tr>
              <tr>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Persediaan
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  PPN Masukan
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Hutang Dagang
                </th>
              </tr>
              <tr>
                {["115", "116", "210"].map((item, index) => {
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
                filter(dataConfig.datajurnal, { type: "jurnal pembelian" }).map(
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
                            placeholder="Nama Pemasok"
                            value={item.namapemasok}
                            name="namapemasok"
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
                            value={item.no}
                            name="no"
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
                            item.key === "persediaan" &&
                            "bg-emerald-500 bg-opacity-20"
                          } `}
                        >
                          <TextField
                            placeholder="Piutang Dagang"
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
                          <div className="absolute -inset-y-3 -left-0 ">
                            {item.key !== "persediaan" && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  confirmToKey(
                                    "Persediaan",
                                    item.uid,
                                    "persediaan",
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
                            item.key === "ppnmasukan" &&
                            "bg-emerald-500 bg-opacity-20"
                          } `}
                        >
                          <TextField
                            placeholder="PPn Masukan"
                            value={item.ppnmasukan}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="ppnmasukan"
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
                            {item.key !== "ppnmasukan" && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  confirmToKey(
                                    "PPN Masukan",
                                    item.uid,
                                    "ppnmasukan",
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
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div
                          className={`relative ${
                            item.key === "hutangdagang" &&
                            "bg-emerald-500 bg-opacity-20"
                          } `}
                        >
                          <TextField
                            placeholder="Hutang Dagang"
                            value={item.hutangdagang}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="hutangdagang"
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
                          <div className="absolute -inset-y-3 -left-0 ">
                            {item.key !== "hutangdagang" && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  confirmToKey(
                                    "Hutang Dagang",
                                    item.uid,
                                    "hutangdagang",
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
                  colSpan="3"
                  className="p-1 font-bold text-slate-600 border border-slate-300"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.btnadd}
                    startIcon={<LibraryAddIcon />}
                    onClick={() => {
                      setTitle("jurnal pembelian");
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
              </tr>
              <tr>
                <td
                  colSpan="3"
                  className="px-10 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-right"
                >
                  Jumlah
                </td>
                {["persediaan", "ppnmasukan", "hutangdagang"].map(
                  (item, index) => {
                    //   const dat = find(dataConfig.dataakun, { name: item });
                    return (
                      <th
                        key={index}
                        className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center"
                      >
                        {numberFormat(
                          sumBy(
                            filter(dataConfig.datajurnal, {
                              type: "jurnal pembelian",
                            }),
                            item
                          )
                        )}
                      </th>
                    );
                  }
                )}
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
