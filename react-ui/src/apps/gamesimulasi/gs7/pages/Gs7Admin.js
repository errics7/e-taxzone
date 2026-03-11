//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import { Helmet } from "react-helmet";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  ShimmerSectionHeader,
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
} from "react-shimmer-effects";

import AdminFakturPajak from "../components/AdminFakturPajak";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import { isEqual } from "lodash";
import KartuPersediaanAdmin from "../components/KartuPersediaanAdmin";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import { Save } from "@mui/icons-material";
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
}));
//#endregion

export default function Gs7Admin(props) {
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [update, setUpdate] = useState(0);
  const [load, setLoad] = useState(false);

  const [dataOri, setDataOri] = useState(null);
  const [dataConf, setdataConf] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs7/data/${id}/soal`, {
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

          setDataOri(res.data);

          if (!res.data.config.narasisoal) {
            const x = {
              ...res.data.config,
              narasisoal:
                "<p>GS-07 Mutasi Masuk Kartu Persediaan ........</p>\n",
            };
            setdataConf(x);
          } else {
            setdataConf(res.data.config);
          }
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
  }, [update, id, history]);

  //#region
  const reset = () => {
    setUpdate(update + 1);
    setdataConf(dataOri);
  };

  const saveToDbGs7 = () => {
    // console.log(data);
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs7/data/update`,
      {
        idc: dataConf.id,
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

  const checkUpdate = () => {
    if (dataOri && dataConf) {
      //
      if (isEqual(dataOri.config, dataConf)) {
        // console.log("sm");
        return false;
      } else {
        // console.log("nosame");
        return true;
      }
    } else {
      return false;
    }
  };
  //#endregion

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 7</title>
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
            Konfigurasi Game Simulasi 7
          </div>
        </div>
      </div>

      <Grid item xs={12} md={12} lg={12}>
        <span className="mt-5 block">Soal Editor:</span>
        <div className="border">
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
        {!dataConf ? (
          <div className="bg-white pt-5">
            <div className="-mb-10 mt-3">
              <ShimmerSectionHeader center />
            </div>
            <div>
              <ShimmerTable row={2} col={6} />;
            </div>
          </div>
        ) : (
          <div className="p-5 border border-dashed bg-white">
            <br />
            <AdminFakturPajak
              dataConfig={dataConf}
              setdata={(dat) => setdataConf(dat)}
            />
            <br />
            <br />
            <KartuPersediaanAdmin
              dataC={dataConf}
              setdata={(dat) => setdataConf(dat)}
            />

            <br />

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
              onClick={() => saveToDbGs7()}
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
                if (checkUpdate()) {
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
                reset();
              }}
            >
              Lihat tampilan di Mahasiswa
            </Button>
          </div>
        )}
      </Grid>
    </div>
  );
}
