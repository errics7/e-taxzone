//#region
import {
  ShimmerBadge,
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerSectionHeader,
} from "react-shimmer-effects";
import { Helmet } from "react-helmet";
import { CircularProgress, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import makeStyles from "@mui/styles/makeStyles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SettingsIcon from "@mui/icons-material/Settings";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TextField from "@mui/material/TextField";
import NumberFormat from "react-number-format";
import BankDataAkun from "../components/Gs3ListDataAkun";
import { forwardRef, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import ModalEditNarasi1Gs3 from "../components/ModalEditNarasi1Gs3";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import { Save } from "@mui/icons-material";
import swal from "sweetalert";
import { isEqual } from "lodash";

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

const useStyles = makeStyles((theme) => ({
  btnback: {
    backgroundColor: "#7C7C7C",
    textTransform: "none",
    marginLeft: "0px",
    marginRight: "10px",
    marginBottom: "10px",
    paddingLeft: "10px",
    paddingRight: "20px",
    "&:hover": {
      backgroundColor: "#5D5D5D",
      boxShadow: "none",
    },
  },
  btnsave: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "15px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
  btnIconEdit: {
    marginTop: "-5px",
  },
  btnadd: {
    marginTop: "5px",
    textTransform: "capitalize",
    backgroundColor: "#2D90DA",
    "&:hover": {
      backgroundColor: "#216CA3",
      boxShadow: "none",
    },
  },
  btnreset: {
    marginTop: "15px",
    marginLeft: "10px",
  },
  btnresetsoal: {
    textTransform: "capitalize",
  },
}));

//#endregion

export default function Gs3Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [update, setUpdate] = useState(0);
  const [load, setLoad] = useState(false);
  const [sConfig, setSConfig] = useState([12, 6, 6]);
  const [showBank, setShowBank] = useState(true);
  const [upNarasi, setUpNarasi] = useState("");
  const [config, setConfig] = useState(null);
  //data var
  const [dataori, setDataori] = useState(null);
  const [dataSelected, setDataSelected] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [dataSoal, setDataSoal] = useState([]);

  //#region
  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs3/data/${id}/soal`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          setLoad(false);
          //
          if (!res.data.success) {
            swal({
              title: "Peringatan",
              text: res.data.message,
              icon: "error",
              closeOnClickOutside: false,
              buttons: {
                catch: {
                  text: "kembali",
                  value: "oke",
                  className: "mx-auto",
                },
              },
            }).then((value) => {
              switch (value) {
                case "oke":
                  history.goBack();
                  break;
                default:
                  return;
              }
            });
            return;
          }
          //
          checkDefaultData(res.data);
          //
          setDataori(res.data);
        })
        .catch((error) => {
          setLoad(false);
          if (error.response && !error.response.data.auth) {
            //  dispatch({ type: "LOGOUT" });
          }
        });
    };

    fetchData();
  }, [update, history, id]);

  const checkDefaultData = (inp) => {
    var dat = inp;

    //def soal
    if (inp.config.narasisoal === null) {
      const x = {
        ...inp.config,
        narasisoal:
          '<p><strong>Game Simulasi 3 - Bukti Memorial - Readjustment</strong><br><br>Pada Game Simulasi 3 ini mahasiswa diminta untuk membuat <strong>Bukti Memorial</strong> atas penyesuaian kembali Produk Dalam Proses (PDP).<br>Langkah-langkah pengerjaan Game Simulation 3 adalah sebagai berikut:<br>1. Hitung dan isi <strong>Total Persediaan PDP</strong> pada lembar kerja yang telah disediakan dengan melihat data persediaan PDP per 30 November.<br>2. Isi <strong>jumlah masing-masing rincian persediaan PDP</strong> yang terdiri dari Biaya Bahan Baku, Biaya Bahan Penolong, Biaya Tenaga Kerja, dan Biaya Overhead <br>    Pabrik dengan <span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">melihat data persediaan PDP per 30 November.</span> <br>3. Cek kebenaran jawaban dengan cara klik tombol <strong>Check</strong>.<br>4. Selanjutnya seret (<em>drag</em>) isian <strong>Kode Akun</strong> dari Data Informasi dan lepas (<em>drop</em>) pada lembar kerja yang telah disediakan.<br>5. <span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">Selanjutnya seret (<em>drag</em>) isian <strong>Jumlah Persediaan PDP</strong> dari Bukti Memorial dan lepas (<em>drop</em>) pada lembar kerja yang telah disediakan.</span> <br>6. <span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">Cek kebenaran jawaban dengan cara klik tombol <strong>Check</strong>.</span>&nbsp;</p>\n',
      };
      dat.config = x;
    }

    if (inp.listsoal.length === 0) {
      dat.listsoal = [
        {
          id: 1251,
          id_config: 76,
          name: "Biaya dari seksi pulp",
          nilai: 27000,
          sorting: 0,
        },
        {
          id: 1252,
          id_config: 76,
          name: "Biaya bahan baku seksi kertas",
          nilai: 5000,
          sorting: 1,
        },
        {
          id: 1253,
          id_config: 76,
          name: "Biaya Bahan penolong",
          nilai: 1300,
          sorting: 2,
        },
        {
          id: 1254,
          id_config: 76,
          name: "Biaya tenaga kerja langsung",
          nilai: 2200,
          sorting: 3,
        },
        {
          id: 1255,
          id_config: 76,
          name: "Biaya overhead pabrik",
          nilai: 1000,
          sorting: 4,
        },
      ];
    }

    if (inp.selected.length === 0) {
      const data1 = [
        {
          sorting: 0,
          nilai: 0,
          code: "540",
          jenis: "debit",
          name: "BDP – Biaya Bahan Baku Seksi Kertas",
          idbank: 4,
          info: "",
          used: true,
        },
        {
          sorting: 1,
          nilai: 0,
          code: "541",
          jenis: "debit",
          name: "BDP – Biaya Bahan Penolong Seksi Kertas",
          idbank: 7,
          info: "",
          used: true,
        },
        {
          sorting: 2,
          nilai: 0,
          code: "032",
          jenis: "kredit",
          name: "Persediaan Produk Dalam Proses – Seksi Kertas",
          idbank: 2,
          info: "",
          used: true,
        },
        {
          sorting: 3,
          nilai: 0,
          code: "542",
          jenis: "debit",
          name: "BDP – Biaya Tenaga Kerja Seksi Kertas",
          idbank: 8,
          info: "",
          used: true,
        },
        {
          sorting: 4,
          nilai: 0,
          code: "543",
          jenis: "debit",
          name: "BDP - Biaya Overhead Pabrik Seksi Kertas",
          idbank: 9,
          info: "",
          used: true,
        },
      ];

      // diff filter
      let difference = inp.alldata.filter(
        (x) => !data1.find((el) => el.code === x.code)
      );
      var newData = [...data1, ...difference];

      dat.alldata = newData;
      dat.selected = data1;
    }

    setDataSelected(dat.selected);
    setDataSoal(dat.listsoal);
    setDataAll(dat.alldata);
    setConfig(dat.config);
  };

  const checkPerubahan = () => {
    if (
      !isEqual(dataori.config, config) ||
      !isEqual(dataori.selected, dataSelected) ||
      !isEqual(dataori.listsoal, dataSoal)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const saveToDbGs3 = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs3/data/update`,
      {
        idc: id,
        data: dataSelected,
        datasoal: dataSoal,
        dataconf: config,
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
          setUpdate(update + 1);
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

  const total = () => {
    var a = 0;
    dataSoal.forEach((item, i) => {
      a += Number(item.nilai);
    });
    return toRp(a);
  };

  const handleRemoveItemSoal = (idx) => {
    // assigning the list to temp variable
    const temp = [...dataSoal];
    // removing the element using splice
    temp.splice(idx, 1);
    // updating the list
    setDataSoal(temp);
  };
  //#endregion

  return (
    <div className="w-full min-h-20v relative">
      {load && <LoadingWait />}
      <Helmet>
        <title>GS 3 | Admin</title>
      </Helmet>
      <div className="flex flex-col items-start relative">
        <Button
          variant="contained"
          color="primary"
          className={classes.btnback}
          onClick={() => {
            history.goBack();
          }}
        >
          <ArrowBackIcon fontSize="small" className="mr-1" />
          Back
        </Button>
        <div className="relative w-full mb-5">
          <div className="text-2xl text-center w-full absolute">
            Konfigurasi Game Simulasi 3
          </div>
        </div>
      </div>
      <br />
      {/* Modal */}
      <>
        {upNarasi !== "" && (
          <ModalEditNarasi1Gs3
            open={upNarasi !== ""}
            field={upNarasi}
            data={config}
            setConfig={(d) => setConfig(d)}
            close={() => setUpNarasi("")}
          />
        )}
      </>
      <span className="mt-2 block">Soal Editor:</span>
      <div className="border">
        {config ? (
          <EditorNarasiSoal
            gsindex={3}
            dataConfig={config}
            setdataConfig={(dat) => setConfig(dat)}
          />
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>
      <br />

      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid
          item
          xs={sConfig[0]}
          md={sConfig[1]}
          lg={sConfig[2]}
          className="relative bg-white"
        >
          <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
            Pengaturan Data Soal:
          </div>
          <div className="p-5 border">
            <br />
            <div className="flex items-center ">
              <div className="font-semibold">
                {config ? config.narasi_1 : <ShimmerBadge width={220} />}
              </div>
              <IconButton
                aria-label="update"
                className={classes.btnIconEdit}
                size="small"
                onClick={() => setUpNarasi("narasi_1")}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </div>
            <div className="flex flex-row justify-evenly border mt-2">
              <div className="inline-flex w-full py-3 px-3 border text-left">
                {config ? config.narasi_2 : <ShimmerBadge width={240} />}
                <IconButton
                  aria-label="update"
                  className={classes.btnIconEdit}
                  size="small"
                  onClick={() => setUpNarasi("narasi_2")}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
                :
              </div>
            </div>
            {dataSoal &&
              dataSoal.map((item, i) => (
                <div key={i} className="flex flex-row justify-evenly ">
                  <div className="py-2 px-3 w-full border text-left flex flex-row items-center">
                    <TextField
                      // label={`Nama`}
                      style={{ marginTop: "8px" }}
                      placeholder="Nama Biaya"
                      fullWidth
                      value={item.name}
                      onChange={(event) => {
                        // update edited row
                        setDataSoal(
                          dataSoal.map((el, index) =>
                            index === i
                              ? {
                                  ...el,
                                  name: event.target.value,
                                }
                              : el
                          )
                        );
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  <div className="py-2 px-3 w-full border relative">
                    <TextField
                      label={`Jumlah`}
                      style={{ marginTop: 0, paddingRight: "25px" }}
                      placeholder="Masukkan Jumlah"
                      fullWidth
                      margin="normal"
                      value={item.nilai}
                      name="nilai"
                      onChange={(event) => {
                        //edited row
                        setDataSoal(
                          dataSoal.map((el, index) =>
                            index === i
                              ? {
                                  ...el,
                                  nilai: event.target.value,
                                }
                              : el
                          )
                        );
                      }}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                    <div className="absolute inset-y-0 right-2 flex flex-row items-center">
                      <Tooltip title="Hapus Item soal" placement="bottom">
                        <IconButton
                          onClick={() => handleRemoveItemSoal(i)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            {!config && <ShimmerTable row={1} col={2} />}
            <div className="flex flex-row justify-evenly ">
              <div className="col-span-2 py-2 px-3 w-full border text-left flex justify-between flex-row items-center">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className={classes.btnadd}
                  startIcon={<LibraryAddIcon />}
                  onClick={() => {
                    setDataSoal([...dataSoal, { name: "", nilai: 0 }]);
                  }}
                >
                  Tambah soal
                </Button>
                <Button
                  className={classes.btnresetsoal}
                  onClick={() => {
                    setDataSoal([]);
                  }}
                >
                  Hapus semua
                </Button>
              </div>
            </div>
            <div className="flex flex-row justify-evenly">
              <div className="py-2 px-3 w-full border text-left font-semibold flex flex-row items-center ">
                Jumlah
              </div>
              <div className="py-2 px-3 w-full border text-left font-semibold flex flex-row items-center ">
                {total()}
              </div>
            </div>

            <div className="border-t border-black  mt-10 relative">
              <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
                Preview Tampilan Bukti Memorial:
              </div>
              <div className="border border-dashed p-1 pt-10">
                <div className="flex">
                  <div className="font-semibold mr-5">
                    {config && config.narasi_3}
                    <IconButton
                      aria-label="update"
                      className={classes.btnIconEdit}
                      size="small"
                      onClick={() => setUpNarasi("narasi_3")}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                  </div>
                  <div>( ) Harian ( ) Penyesuaian</div>
                </div>
                {config ? (
                  <>
                    <br />
                    <div className="mt-5 mx-auto text-center text-2xl font-semibold">
                      BUKTI MEMORIAL
                    </div>
                    <div className="mx-auto text-sm w-full text-center mb-8">
                      {config && config.narasi_4}
                      <IconButton
                        aria-label="update"
                        className={classes.btnIconEdit}
                        size="small"
                        onClick={() => setUpNarasi("narasi_4")}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </div>
                  </>
                ) : (
                  <div className="mt-3 -mb-10">
                    <ShimmerSectionHeader center />
                  </div>
                )}
                {config ? (
                  <p className="mb-3">
                    {config.narasi_5}
                    <IconButton
                      aria-label="update"
                      className={classes.btnIconEdit}
                      size="small"
                      onClick={() => setUpNarasi("narasi_5")}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>{" "}
                    <span className="bg-white px-2 py-1 border shadow-sm">
                      {total()}
                    </span>
                    , {config.narasi_6}
                    <IconButton
                      aria-label="update"
                      className={classes.btnIconEdit}
                      size="small"
                      onClick={() => setUpNarasi("narasi_6")}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    :
                  </p>
                ) : (
                  <ShimmerText line={3} gap={10} />
                )}
                {dataSelected &&
                  dataSelected.map((item, i) =>
                    item.jenis === "debit" ? (
                      <div key={i} className="flex flex-row justify-evenly ">
                        <div className="py-2 px-3 w-full border text-left flex flex-row items-center">
                          {item.name}
                        </div>
                        <div className="py-2 px-3 w-full border text-left flex flex-row items-center">
                          <TextField
                            label={`Jumlah - ${item.jenis}`}
                            style={{ marginTop: 0, marginBottom: "15px" }}
                            placeholder="di isi Mahasiswa"
                            fullWidth
                            margin="normal"
                            name="nilai"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                              readOnly: true,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div key={i}>
                        <Tooltip
                          title="Data ini tidak ditampilkan di mahasiswa"
                          placement="top"
                        >
                          <div className="flex flex-row justify-evenly opacity-20">
                            <div className="py-2 px-3 w-full border text-left flex flex-row items-center">
                              {item.name}
                            </div>
                            <div className="py-2 px-3 w-full border text-left flex flex-row items-center">
                              <TextField
                                label={`Jumlah - ${item.jenis}`}
                                style={{ marginTop: 0, marginBottom: "15px" }}
                                placeholder="di isi Mahasiswa"
                                fullWidth
                                margin="normal"
                                name="nilai"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                InputProps={{
                                  inputComponent: NumberFormatCustom,
                                  readOnly: true,
                                }}
                              />
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
          <br />
          <Button
            variant="contained"
            className={classes.btnsavedata}
            style={{ marginTop: "14px", marginRight: "10px" }}
            endIcon={
              config && load ? (
                <CircularProgress
                  size={20}
                  thickness={4}
                  style={{ color: "white" }}
                />
              ) : (
                <Save />
              )
            }
            onClick={() => {
              if (dataSoal.length !== dataSelected.length) {
                toast.error(
                  "Pastikan jumlah data soal sesuai dengan data Akun terpilih."
                );
                return;
              }
              const selectedonly = dataSelected.filter(
                (x) => x.jenis === "kredit"
              );
              if (selectedonly.length !== 1) {
                toast.error("Pastikan ada 1 Data Akun bertipe kredit.");
                return;
              }
              saveToDbGs3();
            }}
            disabled={load}
          >
            Save Data
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.btnsave}
            endIcon={<OpenInNewIcon />}
            onClick={() => {
              if (dataSoal.length !== dataSelected.length) {
                toast.error(
                  "Pastikan jumlah data soal sesuai dengan data Akun terpilih."
                );
                return;
              }
              const selectedonly = dataSelected.filter(
                (x) => x.jenis === "kredit"
              );
              if (selectedonly.length !== 1) {
                toast.error("Pastikan data 1 Akun tipe kredit.");
                return;
              }

              if (checkPerubahan()) {
                toast(
                  (t) => (
                    <div className="flex flex-col">
                      <span>
                        Terdapat perubahan data, klik save terlebih untuk
                        menyimpan perubahan.
                      </span>
                      <div>
                        <button
                          className="mt-3 cursor-pointer inline-flex bg-red-500 hover:bg-red-600 text-white rounded h-6 px-3 justify-center items-center"
                          onClick={() => {
                            toast.dismiss(t.id);
                            history.push(`${id}/preview`);
                          }}
                        >
                          Tetap lihat (batalkan perubahan)
                        </button>
                      </div>
                    </div>
                  ),
                  {
                    icon: "⚠️",
                    duration: 2000,
                  }
                );
                return;
              }
              history.push(`${id}/preview`);
            }}
          >
            Lihat tampilan di Mahasiswa
          </Button>
          <br />
        </Grid>

        {/* bank data */}
        {showBank ? (
          <Grid item xs={12} md={6} lg={6}>
            <div className="border shadow-md min-h-1/2 w-full bg-white">
              <div className="flex p-3 border-b">
                <Tooltip
                  title="Sembunyikan Data Akun"
                  placement="right-end"
                  arrow
                >
                  <IconButton
                    aria-label="hide"
                    onClick={() => {
                      setShowBank(false);
                      sConfig[2] === 6
                        ? setSConfig([12, 12, 12])
                        : setSConfig([12, 6, 6]);
                    }}
                    size="small"
                  >
                    <ArrowForwardIcon className="" />
                  </IconButton>
                </Tooltip>
                <h2 className="grow text-center text-lg pr-3">Data Akun</h2>
              </div>
              {config ? (
                <BankDataAkun
                  data={dataSelected}
                  dataall={dataAll}
                  updateBank={() => setUpdate(update + 1)}
                  setData={(da, all) => {
                    setDataSelected(da);
                    setDataAll(all);
                  }}
                />
              ) : (
                <ShimmerTable row={4} col={5} />
              )}
            </div>
          </Grid>
        ) : (
          <div className="absolute right-0 flex items-center">
            <div
              className="p-3 flex flex-col bg-white shadow h-16 mt-16 mr-5 rounded cursor-pointer"
              onClick={() => {
                setShowBank(true);
                sConfig[2] === 6
                  ? setSConfig([12, 12, 12])
                  : setSConfig([12, 6, 6]);
              }}
            >
              <SettingsIcon className="mx-auto" />
              <h2>ubah data</h2>
            </div>
          </div>
        )}
      </Grid>
    </div>
  );
}
