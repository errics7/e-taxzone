import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
//#region
import {
  ShimmerSectionHeader,
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerBadge,
} from "react-shimmer-effects";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TabelInfoBahanAdmin from "../components/TabelInfoBahanAdmin";
import UiMutasiKeluarAdmin from "../components/UiMutasiKeluarAdmin";
import UiTampilanMhs from "../components/UiTampilanMhs";
import TabelBahanAdmin from "../components/TabelBahanAdmin";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import swal from "sweetalert";
import { CircularProgress } from "@mui/material";
import { Save } from "@mui/icons-material";
import { isEqual } from "lodash";

const useStyles = makeStyles((theme) => ({
  btnLihatPreviewMhs: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "15px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
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
}));
//#endregion

export default function Gs4Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const [update, setUpdate] = useState(0);
  const [load, setLoad] = useState(false);
  //dat
  const [dOri, setDOri] = useState(null);
  const [dSoal, setDSoal] = useState([]);
  const [dConf, setDConf] = useState(null);

  // #region
  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs5/data/${id}/soal`, {
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
          setDOri(res.data);
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

  const checkDefaultData = (inp) => {
    var inn = inp;
    //
    if (!inp.config.narasisoal) {
      const x = {
        ...inp.config,
        narasisoal:
          "<p>GS-05 Bukti Permintaan dan Pemakaian Bahan ........</p>\n",
      };
      inn.config = x;
    }
    if (inp.dataSoal.length === 0) {
      const x = [
        {
          namabhn: "Calcium Hypoclorit",
          satuan: "kg",
          dimintaqty: 35,
          keluarqty: "30",
          hrgsatuan: "1000",
          hrgjumlah: 30000,
          keperluan: "Produksi",
          status: true,
        },
        {
          namabhn: "Caustic Soda",
          satuan: "kg",
          dimintaqty: 10,
          keluarqty: "10",
          hrgsatuan: "500",
          hrgjumlah: 5000,
          keperluan: "Produksi",
          status: false,
        },
      ];
      inn.dataSoal = x;
    }
    setDConf(inn.config);
    setDSoal(inn.dataSoal);
  };

  const saveToDbGs5 = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs5/data/update`,
      {
        idc: id,
        data: dSoal,
        dataconf: dConf,
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
        loading: "Saving Data...",
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

  const checkPerubahan = () => {
    const x = {
      ...dOri,
      config: dConf,
      dataSoal: dSoal,
    };

    return isEqual(dOri, x) ? false : true;
  };

  const selectedTb = () => {
    if (dSoal.length !== 0) {
      return dSoal.find((el) => el.status === true);
    } else return "hai";
  };
  // #endregion

  return (
    <div className="w-full min-h-20v relative">
      {load && <LoadingWait />}
      <Helmet>
        <title>GS 5 | Admin</title>
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
            Konfigurasi Game Simulasi 5
          </div>
        </div>
      </div>
      <br />

      <span className="mt-2 block">Soal Editor:</span>
      <div className="border">
        {dConf ? (
          <EditorNarasiSoal
            dataConfig={dConf}
            setdataConfig={(dat) => setDConf(dat)}
          />
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>
      <br />
      <div className="border border-dashed p-3 min-h-1/2 w-full bg-white">
        {/* Control */}
        {!dConf ? (
          <div>
            <ShimmerBadge width={200} />
            <ShimmerTable row={2} col={8} />
          </div>
        ) : (
          <TabelBahanAdmin data={dSoal} setdata={(dat) => setDSoal(dat)} />
        )}
        <br />
        <br />
        {/* Kartu Persediaan */}
        {!dConf ? (
          <div>
            <ShimmerSectionHeader />
            <ShimmerTable row={2} col={8} />
          </div>
        ) : (
          <>
            <p className="border-b w-full mb-8">Tampilan Soal :</p>
            <UiMutasiKeluarAdmin
              dataC={dConf}
              selected={selectedTb()}
              setdata={(dat) => setDConf(dat)}
            />
            <br />
            {dConf ? (
              <UiTampilanMhs
                data={dSoal}
                dataC={dConf}
                setdata={(dat) => setDSoal(dat)}
              />
            ) : (
              <div className="-mb-10 py-8 bg-white">
                <ShimmerSectionHeader center />
                <ShimmerTable row={2} col={8} />
              </div>
            )}
            <br />
            <TabelInfoBahanAdmin
              data={dConf}
              setdata={(dat) => setDConf(dat)}
            />
          </>
        )}
      </div>

      <br />
      <Button
        variant="contained"
        className={classes.btnsavedata}
        style={{ marginTop: "14px", marginRight: "10px" }}
        endIcon={
          dOri && load ? (
            <CircularProgress
              size={20}
              thickness={4}
              style={{ color: "white" }}
            />
          ) : (
            <Save />
          )
        }
        onClick={() => saveToDbGs5()}
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
          if (checkPerubahan()) {
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
      <br />
    </div>
  );
}
