//#region
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import makeStyles from "@mui/styles/makeStyles";
import { useEffect, useState } from "react";
//import { AuthContext } from "../../../../AppRoute";
import { v4 as uuidv4 } from "uuid";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import ReactHtmlParser from "react-html-parser";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { Grid, CircularProgress } from "@mui/material";
import ShimmerWorksheetMhs17 from "../component/ShimmerWorksheetMhs17";
import TableSoalMhs17 from "../component/TableSoalMhs17";
import TabelWorksheetMhs17 from "../component/TabelWorksheetMhs17";
import { filter, sumBy } from "lodash";
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
//#endregion

export default function Gs17Mhs() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  // const { dispatch } = useContext(AuthContext);
  const [update] = useState(0);
  const [load, setLoad] = useState(false);
  const [config, setConfig] = useState(null);
  const [jwbdata, setJwbdata] = useState(null);

  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setLoad(true);
    const fetchData = () => {
      axios(`${API.HOST}/api/v2/gamesimulasi17/${id}/config`, {
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
          setLoad(false);
        })
        .catch((error) => {
          setLoad(false);
          console.log("ended ", error);
          console.log("ended ", error.response.status);
          if (error.response.status === 401) {
            toast.error("Sesi berahir.");
            // dispatch({ type: "LOGOUT" });
          }
          if (error.response.status === 400) {
            toast.error(
              "Terjadi Keslahan server, Silahkan refresh halaman kembali."
            );
          }
        });
    };

    fetchData();
  }, [id, history, update]);

  const prepareData = (inn) => {
    //#1 Data Nilai
    const tmpjwb = [];

    inn.datawork.forEach((el) => {
      tmpjwb.push({
        ...el,
        jwb_noakun: "",
        jwb_alias: "",
        jwb_value: 0,
        err_noakun: false,
        err_alias: false,
        err_value: false,
        mode: "satuan",
      });
    });
    //#region
    //Data total
    const asetlancar = sumBy(
      filter(inn.datawork, { type: "asetlancar" }),
      (x) => Number(x.value)
    );
    const liabilitas = sumBy(
      filter(inn.datawork, { type: "liabilitas" }),
      (x) => Number(x.value)
    );
    const asettetap = sumBy(filter(inn.datawork, { type: "asettetap" }), (x) =>
      Number(x.value)
    );
    const ekuitas = sumBy(filter(inn.datawork, { type: "ekuitas" }), (x) =>
      Number(x.value)
    );
    const toDeb = sumBy(filter(inn.datawork, { posisi: "debet" }), (x) =>
      Number(x.value)
    );
    const toKred = sumBy(filter(inn.datawork, { posisi: "kredit" }), (x) =>
      Number(x.value)
    );
    tmpjwb.push({
      uid: uuidv4(),
      value: asetlancar,
      jwb_value: 0,
      err_value: false,
      type: "totasetlancar",
    });
    tmpjwb.push({
      uid: uuidv4(),
      value: liabilitas,
      jwb_value: 0,
      err_value: false,
      type: "totliabilitas",
    });
    tmpjwb.push({
      uid: uuidv4(),
      value: asettetap,
      jwb_value: 0,
      err_value: false,
      type: "totasettetap",
    });
    tmpjwb.push({
      uid: uuidv4(),
      value: ekuitas,
      jwb_value: 0,
      err_value: false,
      type: "totekuitas",
    });
    tmpjwb.push({
      uid: uuidv4(),
      value: toDeb,
      jwb_value: 0,
      err_value: false,
      type: "totDebet",
    });
    tmpjwb.push({
      uid: uuidv4(),
      value: toKred,
      jwb_value: 0,
      err_value: false,
      type: "totKredit",
    });
    //#endregion

    setJwbdata(tmpjwb);
    setConfig(inn);
  };

  const checkjwb = () => {
    setChecking(true);
    const result = [];

    //verif NILAI
    jwbdata.forEach((el, i) => {
      //jika satuan akun
      if (el.mode === "satuan") {
        //
        if (el.key_noakun) {
          // NO-AKUN
          if (el.noakun.toLowerCase() === el.jwb_noakun.trim().toLowerCase()) {
            result.push(true);
          } else {
            jwbdata[i].err_noakun = true;
            result.push(false);
          }
        }
        //Alias
        if (el.key_alias) {
          if (el.alias.toLowerCase() === el.jwb_alias.trim().toLowerCase()) {
            result.push(true);
          } else {
            jwbdata[i].err_alias = true;
            result.push(false);
          }
        }
        //Value
        if (el.key_value) {
          if (Number(el.value) === Number(el.jwb_value)) {
            result.push(true);
          } else {
            jwbdata[i].err_value = true;
            result.push(false);
          }
        }
      } else {
        // Untuk Total
        if (Number(el.value) === Number(el.jwb_value)) {
          result.push(true);
        } else {
          jwbdata[i].err_value = true;
          result.push(false);
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
        <title>Game Simulasi 17 Perdagangan</title>
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
            <div className="m-3">
              <ShimmerTitle line={2} variant="secondary" />
              <ShimmerText />
            </div>
          )}
        </div>
      </>
      <Grid container spacing={2} className="p-2" direction="row">
        <Grid item xs={12} md={12} lg={12}>
          {config && jwbdata ? (
            <>
              <div className="mt-0 mb-2 opacity-50 italic font-semibold my-1">
                Data (Soal):
              </div>
              <TableSoalMhs17 dataConfig={config} />

              <div className="">
                <div className="mt-5 mb-2 opacity-50 italic font-semibold my-1">
                  Worksheet (Lembar Kerja):
                </div>
                <TabelWorksheetMhs17
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
            <ShimmerWorksheetMhs17 />
          )}
        </Grid>
      </Grid>
    </div>
  );
}
