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

import ShimmerAdmin14 from "../components/ShimmerAdmin14";
import TableWorksheetAdmin14 from "../components/TableWorksheetAdmin14";
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

export default function Gs14Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [defData, setDefData] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/gamesimulasi14/${id}/config`, {
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
            console.log(error.response.data.message);
            toast.error(error.response.data.message);
          }
        });
    };
    fetchData();
  }, [id, history]);

  const defaultDataCheck = (inp) => {
    var conf = inp;
    var variatif = [
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
    ];
    var variatifHead = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];
    const kunci = [variatifHead[2], variatifHead[3], variatifHead[4]];

    if (conf.narasisoal === null || conf.narasisoal === "") {
      conf = {
        ...conf,
        narasisoal: `<p><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Arial;"><strong>GAME SIMULASI 14 - </strong></span><span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 13px;font-family: Arial;"><strong>MELENGKAPI DAN MENYELESAIKAN KERTAS KERJA</strong></span><span style="font-family: Arial;"> </span></p>`,
      };
    }
    if (conf.selectedwork.length === 0) {
      conf = {
        ...conf,
        selectedwork: kunci,
        dataakun: [
          { uid: variatif[0], alias: "Kas", noakun: 110 },
          { uid: variatif[1], alias: "Kas di BNI", noakun: 111 },
          {
            uid: variatif[2],
            alias: "Penyisihan Piutang tak tertagih",
            noakun: 113,
          },
          { uid: variatif[3], alias: "Persediaan", noakun: 115 },
          { uid: variatif[4], alias: "PPN Masukan", noakun: 116 },
          {
            uid: variatif[5],
            alias: "Akumulasi depresiasi-bangunan",
            noakun: 141,
          },
          {
            uid: variatif[6],
            alias: "Akumulasi depresiasi-peralatan kantor",
            noakun: 143,
          },
          { uid: variatif[7], alias: "Hutang Dagang", noakun: 210 },
          { uid: variatif[8], alias: "Hutang Bunga", noakun: 212 },
          { uid: variatif[9], alias: "Modal", noakun: 310 },
          { uid: variatif[10], alias: "Pendapatan Dagang", noakun: 510 },
          {
            uid: variatif[11],
            alias: "Beban depresiasi-bangunan",
            noakun: 541,
          },
          {
            uid: variatif[12],
            alias: "Beban Piutang tak tertagih",
            noakun: 570,
          },
          {
            uid: variatif[13],
            alias: "Beban depresiasi-peralatan kantor",
            noakun: 643,
          },
          { uid: variatif[14], alias: "Beban Bunga", noakun: 710 },
        ],
        dataheader: [
          { uid: variatifHead[0], alias: "Neraca Saldo" },
          { uid: variatifHead[1], alias: "Penyesuaian" },
          { uid: variatifHead[2], alias: "Neraca Saldo Setelah Penyesuaian" },
          { uid: variatifHead[3], alias: "Laba/Rugi" },
          { uid: variatifHead[4], alias: "Neraca" },
        ],
        datanilai: [
          {
            uid: uuidv4(),
            idc: variatifHead[0],
            idr: variatif[0],
            value: 19995,
            type: "debet",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[0],
            idr: variatif[1],
            value: 30000,
            type: "debet",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[0],
            idr: variatif[3],
            value: 4550,
            type: "debet",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[0],
            idr: variatif[4],
            value: 455,
            type: "debet",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[0],
            idr: variatif[7],
            value: 4070,
            type: "kredit",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[0],
            idr: variatif[9],
            value: 30000,
            type: "kredit",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[0],
            idr: variatif[10],
            value: 20930,
            type: "kredit",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[1],
            idr: variatif[11],
            value: 1400,
            type: "debet",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[1],
            idr: variatif[12],
            value: 10,
            type: "debet",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[1],
            idr: variatif[13],
            value: 1000,
            type: "debet",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[1],
            idr: variatif[14],
            value: 300,
            type: "debet",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[1],
            idr: variatif[2],
            value: 10,
            type: "kredit",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[1],
            idr: variatif[5],
            value: 1400,
            type: "kredit",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[1],
            idr: variatif[6],
            value: 1000,
            type: "kredit",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[1],
            idr: variatif[8],
            value: 300,
            type: "kredit",
            key: false,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[0],
            value: 19995,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[1],
            value: 30000,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[2],
            value: 10,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[3],
            value: 4550,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[4],
            value: 455,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[5],
            value: 1400,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[6],
            value: 1000,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[7],
            value: 4070,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[8],
            value: 300,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[9],
            value: 30000,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[10],
            value: 20930,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[11],
            value: 1400,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[12],
            value: 10,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[13],
            value: 1000,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[2],
            idr: variatif[14],
            value: 300,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[3],
            idr: variatif[10],
            value: 20930,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[3],
            idr: variatif[11],
            value: 1400,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[3],
            idr: variatif[12],
            value: 10,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[3],
            idr: variatif[13],
            value: 1000,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[3],
            idr: variatif[14],
            value: 300,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[4],
            idr: variatif[0],
            value: 19995,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[4],
            idr: variatif[1],
            value: 30000,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[4],
            idr: variatif[2],
            value: 10,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[4],
            idr: variatif[3],
            value: 4550,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[4],
            idr: variatif[4],
            value: 455,
            type: "debet",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[4],
            idr: variatif[5],
            value: 1400,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[4],
            idr: variatif[6],
            value: 1000,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[4],
            idr: variatif[7],
            value: 4070,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[4],
            idr: variatif[8],
            value: 300,
            type: "kredit",
            key: true,
          },
          {
            uid: uuidv4(),
            idc: variatifHead[4],
            idr: variatif[9],
            value: 30000,
            type: "kredit",
            key: true,
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
      `${API.HOST}/api/v2/gamesimulasi14/:id/update`,
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
        <title>Perdagangan 14 | Admin</title>
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
            Konfigurasi Game Simulasi Perdagangan 14
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
                  <div className="absolute opacity-50 bg-blue-200 italic font-semibold -mt-5 -ml-5 p-1 pr-2">
                    Pengaturan Soal & kunci jawaban :
                  </div>
                  <TableWorksheetAdmin14
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                </div>
              </>
            ) : (
              <ShimmerAdmin14 />
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
