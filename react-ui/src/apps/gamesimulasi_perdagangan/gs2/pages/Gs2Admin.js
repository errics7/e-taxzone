//#region
import { useHistory, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import TableAdmin from "../components/TableAdmin";
import { isEqual } from "lodash";
import Save from "@mui/icons-material/Save";
import { CircularProgress } from "@mui/material";
import ShimmerAdmin2 from "../components/ShimmerAdmin2";
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

export default function Gs2Admin(props) {
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
      axios(`${API.HOST}/api/v2/gamesimulasi2/${id}/config`, {
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

  const defaultDataCheck = (inp) => {
    var conf = inp;

    if (conf.narasisoal === null || conf.narasisoal === "") {
      conf = {
        ...conf,
        narasisoal: `<p style="text-align:start;"><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;"><strong>GS2 - MENCATAT SALDO AWAL PERSEDIAAN</strong></span></p>`,
      };
    }
    if (conf.databarang && conf.databarang.length === 0) {
      conf = {
        ...conf,
        databarang: [
          {
            id: uuidv4(), //to ezy edit in FE
            kode: "PPR01",
            namabarang: "Paperfine A4 75gr",
            hargajual: 38000,
            hargabeli: 30000,
            stok: 40,
            saldo: 1200000,
            tgl: "01/12/21",
          },
          {
            id: uuidv4(), //to ezy edit in FE
            kode: "PPR02",
            namabarang: "Light F4 70gr",
            hargajual: 65000,
            hargabeli: 48000,
            stok: 50,
            saldo: 2400000,
            tgl: "01/12/21",
          },
          {
            id: uuidv4(), //to ezy edit in FE
            kode: "PPR03",
            namabarang: "Concorde A4 220gr",
            hargajual: 12000,
            hargabeli: 7000,
            stok: 150,
            saldo: 1050000,
            tgl: "01/12/21",
          },
          {
            id: uuidv4(), //to ezy edit in FE
            kode: "PPR04",
            namabarang: "Karton manila warna",
            hargajual: 3500,
            hargabeli: 2000,
            stok: 250,
            saldo: 500000,
            tgl: "01/12/21",
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

  const saveToDb = () => {
    if (load) return;

    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/gamesimulasi2/${id}/update`,
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

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Perdagangan 2 | Admin</title>
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
            Konfigurasi Game Simulasi Perdagangan 2
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
            {!config ? (
              <ShimmerAdmin2 />
            ) : (
              <TableAdmin
                dataConfig={config}
                setdataConfig={(dat) => setConfig(dat)}
              />
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
