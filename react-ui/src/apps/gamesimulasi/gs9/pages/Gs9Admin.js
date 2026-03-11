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
import LoadingWait from "../../../dashboard/component/LoadingWait";
import {
  ShimmerSectionHeader,
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
} from "react-shimmer-effects";

import BankDataAkun from "../components/Gs9BankDataAkun";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import RowBukuBesar from "../components/RowBukuBesarGs9";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import { CircularProgress } from "@mui/material";
import { Save } from "@mui/icons-material";
import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
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

export default function Gs9Admin(props) {
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
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs9/data/${id}/soal`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          setLoad(false);
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

          checkDefault(res.data);
          //
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

  const checkDefault = (inp) => {
    // deff soalnarasi
    if (!inp.config.narasisoal) {
      const x = {
        ...inp.config,
        narasisoal:
          "<p>Pada sesi games ini, mahasiswa diminta untuk mengisi neraca saldo sebelum penyesuaian<br>dengan langkah pengerjaan yaitu <strong>drag</strong> item kode, keterangan dan angka pada buku besar ke neraca saldo sebelum penyesuaian sesuai dengan tempatnya.&nbsp;</p>\n",
      };
      setConfig(x);
    } else {
      setConfig(inp.config);
    }

    setDefData(inp);
    setDataori(inp.selected);
    setData(inp.selected);
    setDataAll(inp.alldata);
  };
  //#region
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
  const totalDebit = () => {
    var i = 0;
    data.forEach((item) => {
      if (item.jenis === "debit") {
        i += item.nominal;
      }
    });
    return toRp(i);
  };
  const totalKredit = () => {
    var i = 0;
    data.forEach((item) => {
      if (item.jenis === "kredit") {
        i += item.nominal;
      }
    });
    return toRp(i);
  };

  const saveToDbGs9 = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs9/data/update`,
      {
        idc: id,
        data: data,
        dataConf: config,
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

  return (
    <div className="w-full min-h-20v relative">
      {load && <LoadingWait />}
      <Helmet>
        <title>GS 9 | Admin</title>
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
            Konfigurasi Game Simulasi 9
          </div>
        </div>
      </div>
      <span className="mt-2 block">Soal Editor:</span>
      <div className="border">
        {config ? (
          <EditorNarasiSoal
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
        {!config ? (
          <Grid item xs={sConfig[0]} md={sConfig[1]} lg={sConfig[2]}>
            <div className="bg-white">
              <div className="-mb-10 mt-3">
                <ShimmerSectionHeader center />
              </div>
              <ShimmerTable row={3} col={4} />;
            </div>
          </Grid>
        ) : (
          <Grid item xs={sConfig[0]} md={sConfig[1]} lg={sConfig[2]}>
            <div className="p-5 border border-dashed bg-white">
              <div className="p-3 mx-auto text-center text-2xl font-semibold relative">
                <InputGrowUpTextH1
                  value={config ? config.narasi_1 : ""}
                  onChange={(text) => setConfig({ ...config, narasi_1: text })}
                />
                <EditIcon
                  fontSize="small"
                  className="text-blue-700 opacity-50 -mt-3"
                />
              </div>
              <div className="mx-auto text-xl w-full text-center">
                NERACA SALDO
              </div>
              <div className="mx-auto text-center text-2xl font-semibold relative">
                <InputGrowUpTextH1
                  value={config ? config.narasi_2 : ""}
                  onChange={(text) => setConfig({ ...config, narasi_2: text })}
                />
                <EditIcon
                  fontSize="small"
                  className="text-blue-700 opacity-50 -mt-3"
                />
              </div>
              <div className="flex flex-row justify-evenly border mt-5">
                <div className="font-semibold w-full py-3 border border-slate-400 text-center">
                  Kode
                </div>
                <div className="font-semibold w-full py-3 border border-slate-400 text-center">
                  Nama Akun
                </div>
                <div className="font-semibold w-full py-3 border border-slate-400 text-center">
                  Debet (Rp)
                </div>
                <div className="font-semibold w-full py-3 border border-slate-400 text-center">
                  Kredit (Rp)
                </div>
              </div>
              {data &&
                data.map((item, i) => (
                  <div key={i} className="flex flex-row justify-evenly">
                    <div className="py-2 w-full border text-center flex flex-col ">
                      {item.code}
                    </div>
                    <div className="py-2 w-full border text-center flex flex-col ">
                      {item.name}
                    </div>

                    {item.jenis === "kredit" ? (
                      <>
                        <div className="py-2 w-full border text-center flex flex-col "></div>
                        <div className="py-2 w-full border text-center flex flex-col ">
                          {toRp(item.nominal)}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="py-2 w-full border text-center flex flex-col ">
                          {toRp(item.nominal)}
                        </div>
                        <div className="py-2 w-full border text-center flex flex-col "></div>
                      </>
                    )}
                  </div>
                ))}
              <div className="flex flex-row justify-evenly">
                <div className="py-2 w-full border text-center flex flex-col ">
                  Jumlah
                </div>
                <div className=" w-full border text-center flex flex-row">
                  <div className="py-2 w-full text-center">{totalDebit()} </div>
                  <div className="py-2 w-full border-l-2  text-center">
                    {totalKredit()}{" "}
                  </div>
                </div>
              </div>
            </div>

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
              onClick={() => saveToDbGs9()}
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
            <br />
            {false &&
              data.map((item, j) => (
                <Grid
                  container
                  key={j}
                  direction="column"
                  justifyContent="center"
                  alignItems="stretch"
                  className="my-3"
                >
                  <div className="p-5 border border-solid ">
                    <div className="grid grid-cols-6 gap-4">
                      <div className="col-start-1 col-end-5 font-bold">
                        PT MITRA ANTAR POLINEMA
                      </div>
                      <div className="col-end-9 col-span-2 font-bold  ">
                        BUKU BESAR
                      </div>
                      <div className="col-start-1 col-end-7">
                        Nama Akun : <span> {item.name}</span>
                      </div>
                      <div className="col-end-9 col-span-2">
                        No. Akun : <span> {item.code}</span>
                      </div>
                    </div>

                    <div className="flex flex-row justify-evenly border mt-5">
                      <div className="Headerdata">Tanggal</div>
                      <div className="Headerdata">Uraian</div>
                      <div className="Headerdata">Ref.</div>
                      <div className="Headerdata">Debet (Rp)</div>
                      <div className="Headerdata">Kredit (Rp)</div>
                      <div className="Headerdata">Saldo (Rp)</div>
                    </div>
                    <RowBukuBesar
                      key={j}
                      code={item.code}
                      name={item.name}
                      nominal={item.nominal}
                      jenis={item.jenis}
                    />
                  </div>
                </Grid>
              ))}
          </Grid>
        )}

        {/* bank data */}
        {showBank ? (
          <Grid item xs={12} md={6} lg={6}>
            <div className="border shadow-md min-h-1/2 w-full bg-white">
              <div className="flex p-3 border-b">
                <Tooltip title="Sembunyikan Data Akun" placement="right-end">
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
                  Bank Data Soal
                </h2>
              </div>
              <BankDataAkun
                data={data}
                dataall={dataAll}
                updateBank={() => setUpdate(update + 1)}
                setData={(da, all) => {
                  setData(da);
                  setDataAll(all);
                }}
              />
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
