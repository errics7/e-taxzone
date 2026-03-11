//#region
import { Helmet } from "react-helmet";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import makeStyles from "@mui/styles/makeStyles";
import Tooltip from "@mui/material/Tooltip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SettingsIcon from "@mui/icons-material/Settings";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  ShimmerSectionHeader,
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
} from "react-shimmer-effects";
import BankDataAkun from "../components/Gs2BankDataAkun";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import RowBukuBesar from "../components/RowBukuBesarGs2";
import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import { CircularProgress } from "@mui/material";
import { Save } from "@mui/icons-material";
import swal from "sweetalert";

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
}));
//#endregion

export default function Gs2Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [update, setUpdate] = useState(0);
  const [load, setLoad] = useState(false);
  const [sConfig, setSConfig] = useState([12, 6, 6]);
  const [showBank, setShowBank] = useState(true);
  const [dataori, setDataori] = useState([]);
  const [data, setData] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [config, setConfig] = useState(null);
  const [defData, setDefData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs2/data/${id}/soal`, {
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
          // Default =>
          checkDefaultData(res.data);
          //
          setDefData(res.data);
        })
        .catch((error) => {
          setLoad(false);

          if (error.response.status === 401) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 400) {
            console.log(error.response.data.message);
            toast.error(
              "Terjadi Keslahan, Silahkan ulangi beberapa saat lagi."
            );
          } else {
            console.log(error);
            toast.error(error.response.data.message);
          }
        });
    };

    fetchData();
  }, [update, history, id]);

  //#region FUNC
  const checkDefaultData = (inp) => {
    var dat = inp;
    if (inp.config.narasisoal === null) {
      const x = {
        ...inp.config,
        narasisoal:
          '<p style="text-align:start;"><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;"><strong>Game Simulasi 2 - Saldo Awal Buku Besar</strong></span><br><br><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">Pada Game Simulasi 2 ini mahasiswa diminta untuk mengisi Saldo Awal akun pada Buku Besar dengan langkah-langkah sebagai berikut:</span></p>\n<p><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">1. Seret (<em>drag</em>) isian <strong>Kode</strong> yang terdapat pada Data Akun dan lepas (<em>drop</em>) di lembar kerja yang telah disediakan.</span><br><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">2. Seret (<em>drag</em>) isian <strong>Nama Akun</strong> yang terdapat pada Data Akun dan lepas (<em>drop</em>) di lembar kerja yang telah disediakan.</span> <br>3. <span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">Seret (<em>drag</em>) isian <strong>Jumlah</strong> yang terdapat pada Data Akun dan lepas (<em>drop</em>) di lembar kerja yang telah disediakan.</span> <br>4. <span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">Cek kebenaran jawaban dengan cara klik tombol <strong>Check</strong>.</span>&nbsp;</p>\n',
      };
      dat.config = x;
    }
    //
    setDataori(dat.selected);
    setData(dat.selected);
    setDataAll(dat.alldata);
    setConfig(dat.config);
  };
  const checkPerubahan = () => {
    // console.log("asli:" + dataori.length + " | ed :" + data.length);
    if (dataori.length === data.length && config === defData.config) {
      let difference = dataori.filter(
        (x) => !data.find((el) => el.code === x.code)
      );
      // console.log("mungkin sama");
      return difference.length === 0 ? false : true;
    } else {
      // console.log("difference " + data.length);
      // setValid(true);
      return true;
    }
  };
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };
  const saveToDbGs2 = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs2/data/update`,
      {
        idc: id,
        data: data,
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
          console.log(error);

          return error.response.data.message;
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
  //#endregion
  // console.log(config);

  return (
    <div className="w-full min-h-20v relative">
      {load && <LoadingWait />}
      <Helmet>
        <title>GS 2 | Admin</title>
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
            Konfigurasi Game Simulasi 2
          </div>
        </div>
      </div>

      {/* NOTIF UDATE */}
      <>
        <span className="mt-2 block">Soal Editor:</span>
        <div className="border">
          {config ? (
            <EditorNarasiSoal
              gsindex={2}
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
      </>
      <br />
      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid item xs={sConfig[0]} md={sConfig[1]} lg={sConfig[2]}>
          <div className="border border-dashed relative bg-white mb-8">
            <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
              Tampilan Data(Soal):
            </div>
            <div className="p-5">
              {config ? (
                <div className="flex flex-col">
                  <div className="mt-5 mx-auto text-center text-2xl font-semibold relative">
                    <InputGrowUpTextH1
                      value={config ? config.narasi_1 : ""}
                      onChange={(text) =>
                        setConfig({ ...config, narasi_1: text })
                      }
                    />
                    <EditIcon
                      fontSize="small"
                      className="text-blue-700 absolute -inset-y-1 right-1 opacity-40 p-0.5"
                    />
                  </div>
                  <div className="mx-auto text-xl w-full text-center">
                    NERACA SALDO
                  </div>
                  <div className="mx-auto text-xl text-center relative">
                    <InputGrowUpTextH1
                      value={config ? config.narasi_2 : ""}
                      onChange={(text) =>
                        setConfig({ ...config, narasi_2: text })
                      }
                    />
                    <EditIcon
                      fontSize="small"
                      className="text-blue-700 absolute -inset-y-1 -right-2 opacity-40 p-0.5"
                    />
                  </div>
                </div>
              ) : (
                <div className="-mb-10 mt-3">
                  <ShimmerSectionHeader center />
                </div>
              )}

              <div className="overflow-x-auto border mt-5">
                <table className="border-collapse min-w-full table-fixed">
                  <thead className="font-semibold">
                    <tr className="text-slate-600 font-semibold">
                      <th className="min-w-10v max-w-10v border py-3">Kode</th>
                      <th className="min-w-20v max-w-20v border py-3">
                        Nama Akun
                      </th>
                      <th className="min-w-15v max-w-15v border py-3">
                        Debet (Rp)
                      </th>
                      <th className="min-w-15v max-w-15v border py-3">
                        Kredit (Rp)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map((item, i) => (
                        <tr key={i}>
                          <td className="min-w-10v max-w-10v border py-1">
                            <div className="py-1 mx-auto text-center">
                              {item.code}
                            </div>
                          </td>
                          <td className="min-w-20v max-w-20v border py-1">
                            <span className="m-1 py-1">{item.name}</span>
                          </td>
                          <td className="min-w-15v max-w-15v border py-1 text-center">
                            {item.jenis === "debit" && toRp(item.nominal)}
                          </td>
                          <td className="min-w-15v max-w-15v border py-1 text-center">
                            {item.jenis === "kredit" && toRp(item.nominal)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  {!config && (
                    <tbody>
                      <tr>
                        <td colSpan="4">
                          <div>
                            <ShimmerTable row={1} col={4} />;
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            className="border relative bg-white mt-8"
          >
            <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1">
              Tampilan Worksheet:
            </div>
            <br />
            {data.map((item, j) => (
              <Grid
                container
                key={j}
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                className="my-3 w-full overflow-x-auto"
              >
                <div className="p-5 border border-solid ">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-start-1 col-end-5 font-bold">
                      PT MITRA ANTAR POLINEMA
                    </div>
                    <div className="col-end-8 col-span-2 font-bold  ">
                      BUKU BESAR
                    </div>
                    <div className="col-start-1 col-end-6">
                      Nama Akun :{" "}
                      <span className="bg-amber-100 px-1 py-1">
                        {" "}
                        {item.name}
                      </span>
                    </div>
                    <div className="col-end-8 col-span-2">
                      No. Akun :{" "}
                      <span className="bg-amber-100 px-1 py-1">
                        {" "}
                        {item.code}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto border mt-5">
                    <table className="border-collapse min-w-full table-fixed">
                      <thead>
                        <tr className="font-semibold">
                          <th className="min-w-10v max-w-10v border py-3">
                            Tanggal
                          </th>
                          <th className="min-w-10v max-w-10v border py-3">
                            Uraian
                          </th>
                          <th className="min-w-10v max-w-10v border py-3">
                            Ref.
                          </th>
                          <th className="min-w-15v max-w-15v border py-3">
                            Debet (Rp)
                          </th>
                          <th className="min-w-15v max-w-15v border py-3">
                            Kredit (Rp)
                          </th>
                          <th className="min-w-15v max-w-15v border py-3">
                            Saldo (Rp)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <RowBukuBesar
                          key={j}
                          code={item.code}
                          name={item.name}
                          nominal={item.nominal}
                          jenis={item.jenis}
                        />
                      </tbody>
                      <tbody>
                        <tr>
                          <td className="min-w-10v max-w-10v border py-3">
                            &nbsp;
                          </td>
                          <td className="min-w-10v max-w-10v border py-3">
                            &nbsp;
                          </td>
                          <td className="min-w-15v max-w-15v border py-3">
                            &nbsp;
                          </td>
                          <td className="min-w-15v max-w-15v border py-3">
                            &nbsp;
                          </td>
                          <td className="min-w-15v max-w-15v border py-3">
                            &nbsp;
                          </td>
                          <td className="min-w-15v max-w-15v border py-3">
                            &nbsp;
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>

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
            onClick={() => saveToDbGs2()}
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
              if (defData && checkPerubahan()) {
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
                <h2 className="grow text-center text-lg pr-3">
                  Bank Data Akun
                </h2>
              </div>
              {config ? (
                <BankDataAkun
                  data={data}
                  dataall={dataAll}
                  updateBank={() => setUpdate(update + 1)}
                  setData={(da, all) => {
                    setData(da);
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
              className="p-3 flex flex-col bg-white shadow h-16 mt-16 mr-5 rounded cursor-pointer hover:shadow-md transition-all hover: scale-102 hover:bg-slate-100"
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
