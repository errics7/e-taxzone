//#region
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { isEqual } from "lodash";
import DataRowNeracaSaldo from "../components/DataRowNeracaSaldo";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import EditIcon from "@mui/icons-material/Edit";
import {
  ShimmerSectionHeader,
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
} from "react-shimmer-effects";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect, useState } from "react";
import BankDataAkun from "../components/BankDataAkun.js";
import ModalEditNarasiGs from "../components/ModalEditNarasiGs1";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LoadingWait from "../../../dashboard/component/LoadingWait";
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
  btnLihatPreviewMhs: {
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

export default function Gs1Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  // update counter
  const [update, setUpdate] = useState(0);
  const [load, setLoad] = useState(false);

  const { id } = useParams();
  const [showBank, setShowBank] = useState(true);
  const [sConfig, setSConfig] = useState([12, 6, 6]);

  const [ori, setOri] = useState(null);
  const [data, setData] = useState([]);
  const [dataTmp, setDataTmp] = useState([]);

  const [dataAll, setDataAll] = useState([]);
  const [config, setConfig] = useState(null);
  const [upNarasi, setUpNarasi] = useState(false);
  const [upNarasi2, setUpNarasi2] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs1/data/${id}/soal`, {
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
          //def soal
          checkDefault(res.data);
          //
          setOri(res.data);
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

  //#region

  const checkDefault = (inp) => {
    var dat = inp;
    if (!inp.config.narasisoal || inp.config.narasisoal === "") {
      const x = {
        ...inp.config,
        narasisoal:
          '<p><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;"><strong>Game Simulasi 1 - Saldo Normal Akun</strong></span><br><br><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">Pada Game Simulasi 1 ini mahasiswa diminta untuk menentukan saldo normal masing-masing akun dengan cara menyeret (<em>drag</em>) isian pada kolom <strong>Jumlah</strong> dan melepaskan (<em>drop</em>) isian tersebut pada kolom Debit atau Kredit. Selanjutnya cek kebenaran jawaban dengan cara klik tombol <strong>Check</strong>.</span>&nbsp;</p>\n',
      };
      dat.config = x;
    }
    //
    //
    setData(dat.selected);
    setDataTmp(dat.selected);
    setDataAll(dat.alldata);
    setConfig(inp.config);
  };

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };
  const totalDebet = () => {
    var i = 0;
    dataTmp.forEach((item) => {
      if (item.info === "debit") {
        i += item.nominal;
      }
    });
    return toRp(i);
  };
  const totalKredit = () => {
    var i = 0;
    dataTmp.forEach((item) => {
      if (item.info === "kredit") {
        i += item.nominal;
      }
    });
    return toRp(i);
  };

  const cek = () => {
    if (ori) {
      if (
        !isEqual(ori.config, config) ||
        !isEqual(ori.selected, data) ||
        !config.narasisoal
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  //#endregion
  const saveToDb1 = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs1/data/update`,
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

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>GS 1 | Admin</title>
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
            Konfigurasi Game Simulasi 1
          </div>
        </div>
      </div>
      <div className="relative">
        {load && <LoadingWait />}
        <br />
      </div>
      {/* modal" */}
      <>
        {upNarasi && (
          // narasi 1
          <ModalEditNarasiGs
            open={upNarasi}
            data={config}
            selected={config.narasi_1}
            field="narasi_1"
            update={() => setUpdate(update + 1)}
            close={() => setUpNarasi(false)}
          />
        )}
        {upNarasi2 && (
          // narasi 2
          <ModalEditNarasiGs
            open={upNarasi2}
            data={config}
            selected={config.narasi_2}
            field="narasi_2"
            update={() => setUpdate(update + 1)}
            close={() => setUpNarasi2(false)}
          />
        )}
      </>
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
      <Grid container spacing={1}>
        <Grid item xs={sConfig[0]} md={sConfig[1]} lg={sConfig[2]}>
          <div className="border border-dashed relative bg-white">
            <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
              Tampilan Worksheet:
            </div>
            <div className="p-5">
              <div>
                {config ? (
                  <div className="flex flex-col ">
                    <div className="mt-5 mx-auto text-center text-2xl font-semibold relative">
                      <InputGrowUpTextH1
                        value={config ? config.narasi_1 : ""}
                        onChange={(text) =>
                          setConfig({ ...config, narasi_1: text })
                        }
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 -right-2 opacity-40"
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
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 -right-2 opacity-40"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="-mb-10 mt-3">
                    <ShimmerSectionHeader center />
                  </div>
                )}
              </div>

              <div className="overflow-x-auto border mt-5">
                <table className="border-collapse min-w-full table-fixed">
                  <thead className="font-semibold">
                    <tr className="text-slate-600 font-semibold">
                      <th className="min-w-10v max-w-10v border py-3">Kode</th>
                      <th className="min-w-20v max-w-20v border py-3">
                        Nama Akun
                      </th>
                      <th className="min-w-15v max-w-15v border py-3">
                        Jumlah
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
                    {dataTmp.map((item, i) => (
                      <DataRowNeracaSaldo
                        key={i}
                        indexd={i}
                        itemss={item}
                        setData={(da) => {
                          setDataTmp(
                            dataTmp.map((el, index) =>
                              i === index
                                ? {
                                    ...el,
                                    info: da,
                                  }
                                : el
                            )
                          );
                        }}
                      />
                    ))}
                  </tbody>
                  {!config && (
                    <tbody>
                      <tr>
                        <td colSpan="5">
                          <div>
                            <ShimmerTable row={2} col={5} />;
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )}
                  <tbody className="font-semibold">
                    <tr className="text-slate-600 font-semibold">
                      <th colSpan="3" className="min-w-10v border py-3">
                        Jumlah
                      </th>
                      <th className="min-w-10v border py-3">{totalDebet()}</th>
                      <th className="min-w-10v border py-3">{totalKredit()}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Grid>
        {/* bank data */}
        {showBank ? (
          <Grid item xs={12} md={6} lg={6}>
            <div className="border shadow-md min-h-1/2 w-full bg-white">
              <div className="flex p-3 border-b">
                <Tooltip title="Sembunyikan Data Akun" placement="top" arrow>
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
                    setDataTmp(da);
                    setDataAll(all);
                  }}
                />
              ) : (
                <ShimmerTable row={4} col={5} />
              )}
            </div>
          </Grid>
        ) : (
          <div className="absolute right-0 flex items-center bg-white">
            <div
              className="p-3 flex flex-col bg-white shadow h-16 mt-16 mr-5 rounded cursor-pointer transition-all hover:bg-slate-50 transform hover:scale-105"
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

      <Button
        variant="contained"
        className={classes.btnsavedata}
        style={{ marginTop: "14px", marginRight: "10px" }}
        endIcon={
          ori && load ? (
            <CircularProgress
              size={20}
              thickness={4}
              style={{ color: "white" }}
            />
          ) : (
            <Save />
          )
        }
        onClick={() => saveToDb1()}
        disabled={load}
      >
        Save Data
      </Button>
      <Button
        variant="contained"
        color="primary"
        className={classes.btnLihatPreviewMhs}
        endIcon={<OpenInNewIcon />}
        onClick={() => {
          if (cek()) {
            toast(
              (t) => (
                <div className="flex flex-col">
                  <span>
                    Terdapat perubahan data, klik save terlebih untuk menyimpan
                    perubahan.
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
    </div>
  );
}
