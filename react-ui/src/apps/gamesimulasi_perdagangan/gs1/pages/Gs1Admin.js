//#region
import { useHistory, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Grid";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import { useEffect, useState } from "react";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import {
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerBadge,
} from "react-shimmer-effects";
import { v4 as uuidv4 } from "uuid";

import TabelControlAdmin from "../components/TabelControlAdmin";
import { filter } from "lodash";
import { TextareaAutosize } from "@mui/material";
import TabelSoalPrev from "../components/TabelSoalPrev";
import TabelWorksheetPrev from "../components/TabelWorksheetPrev";
import { isEqual } from "lodash";
import Save from "@mui/icons-material/Save";
import { CircularProgress } from "@mui/material";
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

export default function Gs1Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  const [defData, setDefData] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/gamesimulasi1/${id}/config`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
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
          setLoad(false);
          setDefData(res.data);
          defaultDataCheck(res.data);
        })
        .catch((error) => {
          setLoad(false);

          if (error.response.status === 401) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 400) {
            console.log(error.response.data.message);
            toast.error(
              "Terjadi Keslahan server, Silahkan refresh halaman kembali. note: "
            );
          } else {
            console.log(error);
            toast.error(error.response.data.message);
          }
        });
    };

    fetchData();
  }, [update, history, id]);

  const saveToDb = () => {
    if (load) return;
    // return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/gamesimulasi1/${id}/update`,
      {
        config: config,
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

  const defaultDataCheck = (inp) => {
    var conf = inp;

    if (conf.narasisoal === null || conf.narasisoal === "") {
      conf = {
        ...conf,
        narasisoal: `<p style="text-align:start;"><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;"><strong>GS1 - MENCATAT SALDO AWAL PADA BUKU PEMBANTU HUTANG & PIUTANG</strong></span></p>`,
      };
    }

    if (conf.databuku && conf.databuku.length === 0) {
      conf = {
        ...conf,
        databuku: [
          {
            id: uuidv4(), //to ezy edit in FE
            name: "PT SIDU",
            tgl: "03 Nov 21",
            tgl_worksheet: "1-Des-2021",
            jumlah: 6000000,
            posisi: "kredit",
            jenis: "hutang",
          },
          {
            id: uuidv4(), //to ezy edit in FE
            name: "CV. Paperfine",
            tgl: "20 Nov 21",
            tgl_worksheet: "1-Des-2021",
            jumlah: 8500000,
            posisi: "kredit",
            jenis: "hutang",
          },
          {
            id: uuidv4(), //to ezy edit in FE
            name: "Ny. Zahra",
            tgl: "1 Des 2021",
            tgl_worksheet: "1-Des-2021",
            jumlah: 1000000,
            posisi: "debit",
            jenis: "piutang",
          },
          {
            id: uuidv4(), //to ezy edit in FE
            name: "CV. Abimana",
            tgl: "27 Nov 21",
            tgl_worksheet: "1-Des-2021",
            jumlah: 2000000,
            posisi: "debit",
            jenis: "piutang",
          },
        ],
      };
    }

    setConfig(conf);
  };

  const checkPerubahan = () => {
    if (isEqual(defData, config)) {
      return false;
    } else {
      return true;
    }
  };

  const updateHutang = (x) => {
    const ldata = filter(config.databuku, { jenis: "piutang" });
    setConfig({
      ...config,
      databuku: [...x, ...ldata],
    });
  };

  const updatePiutang = (x) => {
    const ldata = filter(config.databuku, { jenis: "hutang" });
    setConfig({
      ...config,
      databuku: [...ldata, ...x],
    });
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Perdagangan 1 | Admin</title>
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
            Konfigurasi Game Simulasi Perdagangan 1
          </div>
        </div>
      </div>
      <div className="relative">
        {load && <LoadingWait />}
        <br />
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
        <Grid item>
          <div className="border border-dashed bg-white relative pt-5">
            <div className="absolute -mt-3 opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
              Kunci jawaban :
            </div>
            {config ? (
              <div className="p-3">
                <div className="mt-5">Data Hutang Dagang Awal Periode</div>
                <TabelControlAdmin
                  named="hutang"
                  data={
                    config && config.databuku
                      ? filter(config.databuku, { jenis: "hutang" })
                      : []
                  }
                  setData={(c) => updateHutang(c)}
                />
                <div className="mt-5">Data Piutang Dagang Awal Periode</div>
                <TabelControlAdmin
                  named="piutang"
                  data={
                    config && config.databuku
                      ? filter(config.databuku, { jenis: "piutang" })
                      : []
                  }
                  setData={(c) => updatePiutang(c)}
                />
              </div>
            ) : (
              <div className="p-3 mt-10">
                <ShimmerBadge width={200} />
                <ShimmerTable row={2} col={4} />
                <br />
                <br />
                <ShimmerBadge width={200} />
                <ShimmerTable row={2} col={4} />
              </div>
            )}
          </div>
        </Grid>
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
        <Grid container direction="row" className="mt-10">
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            className="relative border border-dashed"
          >
            <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1">
              Tampilan Soal:
            </div>
            <div className="mt-8 px-2">
              <div className="mt-2 relative">
                <TextareaAutosize
                  className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
                  value={config ? config.narasi_adt1 : " "}
                  onChange={(e) => {
                    setConfig({ ...config, narasi_adt1: e.target.value });
                  }}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 opacity-70 absolute inset-y-1 right-0"
                />
              </div>
              <TabelSoalPrev data={config ? config.databuku : []} />
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            className="relative border border-dashed"
          >
            <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1">
              Tampilan Worksheet:
            </div>
            <TabelWorksheetPrev
              dataConf={config}
              setDataConf={(c) => setConfig(c)}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
