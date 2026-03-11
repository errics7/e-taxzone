import { Button, CircularProgress, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ShimmerText, ShimmerTitle } from "react-shimmer-effects";
import ReactHtmlParser from "react-html-parser";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import TableSoalGS11 from "../components/TableSoalGS11";
import ShimmerWorksheetMhs15 from "../../gs15/component/ShimmerWorksheetMhs15";
import WorksheetMhsGs11 from "../components/WorksheetMhsGs11";
import { findIndex, sumBy } from "lodash";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  btnback: {
    backgroundColor: "#7C7C7C",
    textTransform: "none",
    marginLeft: "0",
    marginRight: "10px",
    marginBottom: "10px",
    "&:hover": {
      backgroundColor: "#5D5D5D",
      boxShadow: "none",
    },
  },
  btnsave: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
  btnreset: {
    backgroundColor: "#FF8E90",
    textTransform: "none",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#FF4C4D",
      boxShadow: "none",
    },
  },
  btnupdate: {
    backgroundColor: "#34A5DD",
    textTransform: "none",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#277BA5",
      boxShadow: "none",
    },
  },
}));

const Gs11Mhs = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [config, setConfig] = useState(null);
  const [jwbdata, setJwbdata] = useState(null);
  const [done, setDone] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setLoad(true);
    const fetchData = () => {
      axios(`${API.HOST}/api/v2/gamesimulasi11/${id}/config`, {
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
          prepareData(res.data);
          setConfig(res.data);
          setLoad(false);
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

  const prepareData = (inn) => {
    //#1 Data Nilai
    const tmpjwb = [];
    inn.dataakun.forEach((el) => {
      tmpjwb.push({
        ...el,
        used: false,
        type: "base",
        key_noakun: el.noakun,
        key_nama: el.nama,
        key_debet: el.total_debet,
        key_kredit: el.total_kredit,

        jwb_noakun: "",
        jwb_nama: "",
        jwb_debet: 0,
        jwb_kredit: 0,

        err_noakun: false,
        err_nama: false,
        err_debet: false,
        err_kredit: false,
      });
    });
    tmpjwb.push({
      type: "total_kredit",
      key_total_kredit: sumBy(inn.dataakun, "total_kredit"),
      jwb_total_kredit: 0,
      err_total_kredit: false,
    });
    tmpjwb.push({
      type: "total_debet",
      key_total_debet: sumBy(inn.dataakun, "total_debet"),
      jwb_total_debet: 0,
      err_total_debet: false,
    });
    setJwbdata(tmpjwb);
    setConfig(inn);
  };

  const checkjwb = () => {
    setChecking(true);
    const result = [];

    jwbdata.forEach((jwb, i) => {
      const idx = findIndex(jwbdata, { key_noakun: Number(jwb.jwb_noakun) });

      if (jwb.type === "base") {
        if (idx >= 0 && jwbdata[idx].used === false) {
          jwbdata[idx].used = true;

          if (jwbdata[idx].type_saldo === jwb.type_saldo) {
            // console.log("masuk type");
            if (
              jwbdata[idx].key_nama.trim().toLowerCase() ===
              jwb.jwb_nama.trim().toLowerCase()
            ) {
              result.push(true);
            } else {
              jwbdata[i].err_nama = true;
              result.push(false);
            }

            if (Number(jwbdata[idx].key_debet) === Number(jwb.jwb_debet)) {
              result.push(true);
            } else {
              jwbdata[i].err_debet = true;
              result.push(false);
            }

            if (Number(jwbdata[idx].key_kredit) === Number(jwb.jwb_kredit)) {
              result.push(true);
            } else {
              jwbdata[i].err_kredit = true;
              result.push(false);
            }
          } else {
            jwbdata[i].err_noakun = true;
            jwbdata[i].err_nama = true;
            jwbdata[i].err_debet = true;
            jwbdata[i].err_kredit = true;
            result.push(false);
          }
        } else {
          jwbdata[i].err_noakun = true;
          jwbdata[i].err_nama = true;
          jwbdata[i].err_debet = true;
          jwbdata[i].err_kredit = true;
          result.push(false);
        }
      } else {
        if (jwb.type === "total_kredit") {
          const idx = findIndex(jwbdata, { type: "total_kredit" });

          if (Number(jwb.key_total_kredit) === Number(jwb.jwb_total_kredit)) {
            result.push(true);
          } else {
            jwbdata[idx].err_total_kredit = true;
            result.push(false);
          }
        } else {
          const idx = findIndex(jwbdata, { type: "total_debet" });

          if (Number(jwb.key_total_debet) === Number(jwb.jwb_total_debet)) {
            result.push(true);
          } else {
            jwbdata[idx].err_total_debet = true;
            result.push(false);
          }
        }
      }
    });

    setJwbdata(jwbdata);

    //
    if (result.every((x) => x === true)) {
      setDone(true);
      toast.success(`Yay Benar Semua.`, {
        style: {
          minWidth: "250px",
          border: "1px solid #1E40AF",
          padding: "16px",
          color: "#1E40AF",
          marginBottom: "25px",
        },
        success: {
          duration: 6000,
        },
      });
    } else {
      toast.error(`Ada yang salah silahkan Ulangi kembali`, {
        style: {
          minWidth: "250px",
          border: "1px solid #1E40AF",
          padding: "16px",
          color: "#1E40AF",
          marginBottom: "25px",
        },
        error: {
          duration: 7000,
        },
      });
    }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 11 Perdagangan</title>
      </Helmet>
      <>
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
        <br />
        <div className="w-full mb-3 mt-5 p-2 border bg-slate-50">
          {config ? (
            ReactHtmlParser(config.narasisoal)
          ) : (
            <div className="p-3 bg-white">
              <ShimmerTitle line={2} variant="secondary" />
              <ShimmerText />
            </div>
          )}
        </div>
      </>
      <Grid container spacing={2} className="pl-4" direction="row">
        <Grid item xs={12} md={12} lg={12} className="border pt-2 bg-white">
          {config && jwbdata ? (
            <>
              <div className="mt-0 mb-2 opacity-50 italic font-semibold my-1">
                Data (Soal):
              </div>
              <TableSoalGS11 dataConfig={config} />

              <div>
                <div className="mt-5 mb-2 opacity-50 italic font-semibold my-1">
                  Worksheet (Lembar Kerja):
                </div>
                <WorksheetMhsGs11
                  dataConfig={config}
                  jwbdata={jwbdata}
                  checking={checking}
                  setJwbdata={(x) => setJwbdata(x)}
                />

                <div
                  className={`flex flex-row-reverse py-1 mt-3 w-full  bg-gradient-to-l from-slate-100`}
                >
                  {done ? (
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.btnupdate}
                      onClick={() => {
                        toast.success(`Data Telah Disimpan.`, {
                          style: {
                            minWidth: "250px",
                            border: "1px solid #1E40AF",
                            padding: "16px",
                            color: "#1E40AF",
                            marginBottom: "25px",
                          },
                          success: {
                            duration: 5000,
                          },
                        });
                      }}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.btnsave}
                      disabled={checking}
                      onClick={() => {
                        checkjwb();
                      }}
                    >
                      Check
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.btnreset}
                    endIcon={
                      load ? (
                        <CircularProgress
                          size={20}
                          thickness={4}
                          style={{ color: "white" }}
                        />
                      ) : null
                    }
                    disabled={load}
                    onClick={() => {
                      setChecking(false);
                      setDone(false);
                      prepareData(config);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <ShimmerWorksheetMhs15 />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Gs11Mhs;
