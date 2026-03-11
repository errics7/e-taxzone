//#region
import { useHistory, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { v4 as uuidv4 } from "uuid";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { isEqual } from "lodash";
import Save from "@mui/icons-material/Save";
import { CircularProgress } from "@mui/material";

import ShimmerAdmin8 from "../components/ShimmerAdmin8";
import TablePenjualanAdmin8 from "../components/TablePenjualanAdmin8";
import TableJKMAdmin8 from "../components/TableJKMAdmin8";
import TableBuPemAdmin8 from "../components/TableBuPemAdmin8";
import TableDataSaldoAdmin8 from "../components/TableDataSaldoAdmin8";
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
  btnLihatPreviewMhs: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "15px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
  btnaddadata: {
    color: "#FFF",
    backgroundColor: "#2D90DA",
    "&:hover": {
      backgroundColor: "#216CA3",
      boxShadow: "none",
    },
    textTransform: "capitalize",
  },
}));
//#endregion

export default function Gs8Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [defData, setDefData] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/gamesimulasi8/${id}/config`, {
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
          setDefData(res.data);
          defaultDataCheck(res.data);
        })
        .catch((error) => {
          setLoad(false);

          if (error.response.status === 401) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 400) {
            toast.error(
              "Terjadi Keslahan server, Silahkan refresh halaman kembali. note: " +
                error.response.data.message
            );
          } else {
            console.log(error);
            toast.error(error.response.data.message);
          }
        });
    };

    fetchData();
  }, [id, history]);

  const defaultDataCheck = (inp) => {
    var conf = inp;
    var variatif = [uuidv4(), uuidv4()];
    if (conf.narasisoal === null || conf.narasisoal === "") {
      conf = {
        ...conf,
        narasisoal: `<p><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Arial;"><strong>GAME SIMULASI 8 - </strong></span><span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 13px;font-family: Arial;"><strong>MENCATAT PADA BUKU PEMBANTU PIUTANG</strong></span><span style="font-family: Arial;"> </span></p>`,
      };
    }
    if (conf.datajurnal && conf.datajurnal.length === 0) {
      conf = {
        ...conf,
        datajurnal: [
          {
            uid: uuidv4(),
            gen: variatif[0],
            type: "intro",
            tgl: "1-Des-2021",
            keterangan: "Saldo Awal",
            namapelanggan: "Tn. Joni",
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
            gen: variatif[0],
            type: "jurnal penjualan",
            tgl: "7-Des-2021",
            keterangan: "Piutang Dagang",
            namapelanggan: "Tn. Joni",
            nofaktur: "A100",

            piutangdagang: 357500,
            hpp: 240000,
            penjualan: 325000,
            ppnkeluaran: 32500,
            persediaan: 240000,
            kas: 0,

            key: "piutangdagang",
            posisi: "debit",
            jumlah: 0, //only type intro
          },
          {
            uid: uuidv4(),
            gen: variatif[1],
            type: "intro",
            tgl: "1-Des-2021",
            keterangan: "Saldo Awal",
            namapelanggan: "Citra School",
            nofaktur: "",

            piutangdagang: 0,
            hpp: 0,
            penjualan: 0,
            ppnkeluaran: 0,
            persediaan: 0,
            kas: 0,

            key: "piutangdagang",
            posisi: "debit",
            jumlah: 2000000, //only type intro
          },
          {
            uid: uuidv4(),
            gen: variatif[1],
            type: "jurnal penjualan",
            tgl: "20-Des-2021",
            keterangan: "Piutang Dagang",
            namapelanggan: "Citra School",
            nofaktur: "A103",

            piutangdagang: 660000,
            hpp: 350000,
            penjualan: 600000,
            ppnkeluaran: 60000,
            persediaan: 350000,
            kas: 0,

            key: "piutangdagang",
            posisi: "debit",
            jumlah: 0, //only type intro
          },
          {
            uid: uuidv4(),
            gen: variatif[0],
            type: "jurnal kas masuk",
            tgl: "15-Des-2021",
            keterangan: "Pelunasan piutang",
            namapelanggan: "Tn. Joni",
            nofaktur: "M098",

            piutangdagang: 1000000,
            hpp: 0,
            penjualan: 0,
            ppnkeluaran: 0,
            persediaan: 0,
            kas: 1000000,

            key: "piutangdagang",
            posisi: "kredit",
            jumlah: 0, //only type intro
          },
        ],
      };
    }

    setConfig(conf);
  };

  const checkPerubahan = () => (isEqual(defData, config) ? false : true);

  const saveToDb = () => {
    // console.log(config);
    if (load) return;
    setLoad(true);
    const push = axios.post(
      `${API.HOST}/api/v2/gamesimulasi8/${id}/update`,
      {
        config: config,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    toast.promise(
      push,
      {
        loading: "Saving Data...",
        success: (data) => {
          setLoad(false);
          setDefData(config);
          // setUpdate(update + 1);
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
        <title>Perdagangan 8 | Admin</title>
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
            Konfigurasi Game Simulasi Perdagangan 8
          </div>
        </div>
      </div>
      <div className="relative">
        {load && <LoadingWait />}
        <br />
        <span className="mt-5 block">Soal Editor:</span>
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

        {/* Code Here  or  whatever*/}
        <br />
        <Grid item xs={12} md={12} lg={12}>
          <div className="p-5 border border-dashed bg-white">
            {config ? (
              <>
                <div className="relative pb-8 border-b">
                  <div className="absolute opacity-50 bg-blue-200 italic font-semibold -mt-10 -ml-5 p-1 pr-2">
                    Admin Soal :
                  </div>
                  <TablePenjualanAdmin8
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                  <TableJKMAdmin8
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                  <TableDataSaldoAdmin8 dataConfig={config} />
                </div>
                <div className="relative">
                  <div className="absolute opacity-50 bg-blue-200 italic font-semibold -mt-10 -ml-5 p-1 pr-2">
                    Admin Worksheet :
                  </div>
                  <TableBuPemAdmin8
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                </div>
              </>
            ) : (
              <ShimmerAdmin8 />
            )}
          </div>
        </Grid>
      </div>

      <div className="flex flex-row space-x-1">
        <Button
          variant="contained"
          className={classes.btnaddadata}
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
          onClick={() => saveToDb()}
          disabled={load}
        >
          Save Data
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.btnLihatPreviewMhs}
          endIcon={<OpenInNewIcon />}
          disabled={load}
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
      </div>
    </div>
  );
}
