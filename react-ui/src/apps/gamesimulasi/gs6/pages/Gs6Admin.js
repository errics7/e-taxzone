// #region
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerBadge,
} from "react-shimmer-effects";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TabelControlAdmin from "../components/TabelControlAdmin";
import TabelBahanAdmin from "../components/TabelBahanAdmin";
import TabelInfoBahanAdmin from "../components/TabelInfoBahanAdmin";
import TabelInfoKreditDebitAdmin from "../components/TabelInfoKreditDebitAdmin";
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
  btnadd: {
    marginTop: "5px",
    textTransform: "capitalize",
    backgroundColor: "#2D90DA",
    "&:hover": {
      backgroundColor: "#216CA3",
      boxShadow: "none",
    },
  },
  btnresetsoal: {
    textTransform: "capitalize",
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
// #endregion

export default function Gs6Admin(props) {
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [update, setUpdate] = useState(0);
  const [load, setLoad] = useState(false);

  const [dataOri, setDataOri] = useState(null);
  const [dataC, setdataC] = useState([]);
  const [dataBhn, setdataBhn] = useState([]);
  const [dataConf, setdataConf] = useState(null);

  // #region FUNC
  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs6/data/${id}/soal`, {
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
          //
          setDataOri(res.data);
          defaultDataCnf(res.data);
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

  const defaultDataCnf = (inp) => {
    var inn = inp;
    if (!inp.config.narasisoal) {
      const x = {
        ...inp.config,
        narasisoal: "<p>GS-06 Buku pembantu biaya ........</p>\n",
      };
      inn.config = x;
    }
    //
    if (inn.dacontrol.length === 0) {
      inn.dacontrol = [
        {
          kode: "530.11",
          nopusatbiaya: "530",
          nopembantubiaya: "11",
          nilai: 3000,
          posisi: "debit",
          keperluan: "Produksi sie pulp",
          sorting: 0,
        },
        {
          kode: "531.14",
          nopusatbiaya: "531",
          nopembantubiaya: "14",
          nilai: 3500,
          posisi: "debit",
          keperluan: "Produksi sie pulp",
          sorting: 1,
        },
        {
          kode: "034",
          nopusatbiaya: "034",
          nopembantubiaya: "",
          nilai: 6500,
          posisi: "kredit",
          keperluan: "Produksi sie pulp",
          sorting: 2,
        },
      ];
    }
    if (inn.dabuktibahan.length === 0) {
      inn.dabuktibahan = [
        {
          namabhn: "Calcium Hypoclorit",
          satuan: "kg",
          diminta: 35,
          keluar: 30,
          hargasatuan: 100,
          hargajumlah: 3000,
          keperluan: "Produksi sie pulp",
          sorting: 0,
        },
        {
          namabhn: "Caustic Soda",
          satuan: "kg",
          diminta: 5,
          keluar: 5,
          hargasatuan: 700,
          hargajumlah: 3500,
          keperluan: "Produksi sie pulp",
          sorting: 1,
        },
      ];
    }
    //
    setdataConf(inn.config);
    setdataC(inn.dacontrol);
    setdataBhn(inn.dabuktibahan);
  };

  const saveToDbGs6 = () => {
    // console.log(data);
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs6/data/update`,
      {
        idc: id,
        dataC: dataC,
        dataBhn: dataBhn,
        dataConf: dataConf,
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
  const checkUpdate = () => {
    if (
      dataOri &&
      dataOri.dacontrol === dataC &&
      dataOri.dabuktibahan === dataBhn &&
      dataOri.config === dataConf
    ) {
      return true;
    } else {
      return false;
    }
  };
  // #endregion

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>GS 6 | Admin</title>
      </Helmet>
      {load && <LoadingWait />}
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
            Konfigurasi Game Simulasi 6
          </div>
        </div>
      </div>

      <span className="mt-5 block">Soal Editor:</span>
      <div className="border bg-white">
        {dataConf ? (
          <EditorNarasiSoal
            dataConfig={dataConf}
            setdataConfig={(dat) => setdataConf(dat)}
          />
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>
      <br />
      <Grid item xs={12} md={12} lg={12}>
        <div className="p-5 border border-dashed bg-white">
          {!dataConf ? (
            <div>
              <ShimmerBadge width={200} />
              <ShimmerTable row={2} col={8} />
            </div>
          ) : (
            <TabelControlAdmin data={dataC} setdata={(dat) => setdataC(dat)} />
          )}

          <br />
          <br />
          {!dataConf ? (
            <div>
              <ShimmerTable row={2} col={8} />
            </div>
          ) : (
            <>
              <TabelBahanAdmin
                data={dataBhn}
                setdata={(dat) => setdataBhn(dat)}
                dataConfig={dataConf}
                setdataConfig={(dat) => setdataConf(dat)}
              />
              <div className="flex flex-col 2xl:flex-row justify-between mt-5">
                <TabelInfoBahanAdmin
                  data={dataConf}
                  setdata={(dat) => setdataConf(dat)}
                />
                <TabelInfoKreditDebitAdmin
                  className="w-5/12 mt-3 2xl:mt-0"
                  data={dataC}
                />
              </div>
            </>
          )}
        </div>

        <Button
          variant="contained"
          className={classes.btnsavedata}
          style={{ marginTop: "14px", marginRight: "10px" }}
          endIcon={
            dataOri && load ? (
              <CircularProgress
                size={20}
                thickness={4}
                style={{ color: "white" }}
              />
            ) : (
              <Save />
            )
          }
          onClick={() => saveToDbGs6()}
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
            if (!checkUpdate()) {
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
      </Grid>
    </div>
  );
}
