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
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { isEqual } from "lodash";
import Save from "@mui/icons-material/Save";
import { CircularProgress } from "@mui/material";

import ShimmerAdmin12 from "../components/ShimmerAdmin12";
import TableAsetAdmin12 from "../components/TableAsetAdmin12";
import TableBungaAdmin12 from "../components/TableBungaAdmin12";
import TableBupemAdmin12 from "../components/TableBupemAdmin12";
import TableAkun12 from "../components/TableAkun12";
import TableWorksheetAdmin12 from "../components/TableWorksheetAdmin12";
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

export default function Gs12Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [defData, setDefData] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/gamesimulasi12/${id}/config`, {
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
    var variatif = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];
    if (conf.narasisoal === null || conf.narasisoal === "") {
      conf = {
        ...conf,
        narasisoal: `<p><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Arial;"><strong>GAME SIMULASI 12 - </strong></span><span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 13px;font-family: Arial;"><strong>MEMBUAT JURNAL PENYESUAIAN</strong></span><span style="font-family: Arial;"> </span></p>`,
      };
    }
    if (conf.databahan && conf.databahan.length === 0) {
      conf = {
        ...conf,
        databahan: [
          {
            uid: variatif[0],
            type: "aset",
            tgl: "15-Januari-2010",
            keterangan: "Tanah",
            perolehan: 200000000,
            nilaisisa: 0,
            durasi: 0,
            satuanwaktu: "tahun",

            jumlah: 0,
            bungath: 0,

            ref: "",
            debet: 0,
            kredit: 0,
          },
          {
            uid: variatif[1],
            type: "aset",
            tgl: "15-Januari-2010",
            keterangan: "Bangunan",
            perolehan: 350000000,
            nilaisisa: 14000000,
            durasi: 20,
            satuanwaktu: "tahun",

            jumlah: 0,
            bungath: 0,

            ref: "",
            debet: 0,
            kredit: 0,
          },
          {
            uid: variatif[2],
            type: "aset",
            tgl: "20-Januari-2010",
            keterangan: "Peralatan",
            perolehan: 84000000,
            nilaisisa: 0,
            durasi: 7,
            satuanwaktu: "tahun",

            jumlah: 0,
            bungath: 0,

            ref: "",
            debet: 0,
            kredit: 0,
          },
          {
            uid: variatif[3],
            type: "bunga",
            tgl: "1-Maret-2013",
            keterangan: "Bank BNI",
            perolehan: 0,
            nilaisisa: 0,
            durasi: 10,
            satuanwaktu: "tahun",

            jumlah: 300000000,
            bungath: 12,

            ref: "",
            debet: 0,
            kredit: 0,
          },
          {
            uid: uuidv4(),
            type: "bupem",
            tgl: "01-Des-2021",
            keterangan: "Saldo Awal",
            perolehan: 0,
            nilaisisa: 0,
            durasi: 0,
            satuanwaktu: "tahun",

            jumlah: 1000000,
            bungath: 0,

            ref: "",
            debet: 0,
            kredit: 0,
          },
          {
            uid: uuidv4(),
            type: "bupem",
            tgl: "07-Des-2021",
            keterangan: "Piutang Dagang",
            perolehan: 0,
            nilaisisa: 0,
            durasi: 0,
            satuanwaktu: "tahun",

            jumlah: 0,
            bungath: 0,

            ref: "Jurnal Penjualan",
            debet: 357500,
            kredit: 0,
          },
          {
            uid: uuidv4(),
            type: "bupem",
            tgl: "15-Des-2021",
            keterangan: "Pelunasan Piutang",
            perolehan: 0,
            nilaisisa: 0,
            durasi: 0,
            satuanwaktu: "tahun",

            jumlah: 0,
            bungath: 0,

            ref: "Jurnal Kas Masuk",
            debet: 0,
            kredit: 1000000,
          },
        ],
      };
    }
    if (conf.dataakun && conf.dataakun.length === 0) {
      conf = {
        ...conf,
        dataakun: [
          {
            uid: uuidv4(),
            gen: "bangunan",
            base: "aset",
            noakun: 541,
            keterangan: "Beban depresiasi-bangunan",
            posisi: "debet",
            uidbahan: variatif[1],
          },
          {
            uid: uuidv4(),
            gen: "piutang",
            base: "piutang",
            noakun: 570,
            keterangan: "Beban piutang tak tertagih",
            posisi: "debet",
            uidbahan: "-",
          },
          {
            uid: uuidv4(),
            gen: "piutang",
            base: "piutang",
            noakun: 113,
            keterangan: "Penyisihan piutang tak tertagih",
            posisi: "kredit",
            uidbahan: "-",
          },
          {
            uid: uuidv4(),
            gen: "bangunan",
            base: "aset",
            noakun: 141,
            keterangan: "Akumulasi depresiasi-bangunan",
            posisi: "kredit",
            uidbahan: variatif[1],
          },
          {
            uid: uuidv4(),
            gen: "peralatan",
            base: "aset",
            noakun: 643,
            keterangan: "Beban depresiasi-peralatan kantor",
            posisi: "debet",
            uidbahan: variatif[2],
          },
          {
            uid: uuidv4(),
            gen: "bunga",
            base: "bunga",
            noakun: 710,
            keterangan: "Beban bunga",
            posisi: "debet",
            uidbahan: variatif[3],
          },
          {
            uid: uuidv4(),
            gen: "peralatan",
            base: "aset",
            noakun: 143,
            keterangan: "Akumulasi depresiasi-peralatan kantor",
            posisi: "kredit",
            uidbahan: variatif[2],
          },
          {
            uid: uuidv4(),
            gen: "bunga",
            base: "bunga",
            noakun: 212,
            keterangan: "Hutang Bunga",
            posisi: "kredit",
            uidbahan: variatif[3],
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
      `${API.HOST}/api/v2/gamesimulasi12/${id}/update`,
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
        <title>Perdagangan 12 | Admin</title>
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
        <div className="relative w-full">
          <div className="text-2xl text-center w-full absolute">
            Konfigurasi Game Simulasi Perdagangan 12
          </div>
        </div>
      </div>
      <div className="relative">
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
                  <TableAsetAdmin12
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                  <TableBungaAdmin12
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                  <TableBupemAdmin12
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                  <TableAkun12
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute opacity-50 bg-blue-200 italic font-semibold -mt-0 -ml-5 p-1 pr-2">
                    Admin Worksheet :
                  </div>
                  <TableWorksheetAdmin12
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                </div>
              </>
            ) : (
              <ShimmerAdmin12 />
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
