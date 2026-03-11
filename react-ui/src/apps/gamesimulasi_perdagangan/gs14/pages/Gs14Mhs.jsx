//#region
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import makeStyles from "@mui/styles/makeStyles";
import { useEffect, useState } from "react";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import ReactHtmlParser from "react-html-parser";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { Grid, CircularProgress } from "@mui/material";
import ShimmerWorksheetMhs14 from "../components/ShimmerWorksheetMhs14";
import { filter, sumBy } from "lodash";
import TableWorksheetMhs14 from "../components/TableWorksheetMhs14";
import { includes } from "lodash";
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

export default function Gs14Mhs() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [update] = useState(0);
  const [load, setLoad] = useState(false);
  const [config, setConfig] = useState(null);
  const [jwbTotal1, setJwbTotal1] = useState(null);
  const [jwbTotal2, setJwbTotal2] = useState(null);
  const [jwbLaba, setJwbLaba] = useState(null);
  const [jwbdata, setJwbdata] = useState(null);

  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setLoad(true);
    const fetchData = () => {
      axios(`${API.HOST}/api/v2/gamesimulasi14/${id}/config`, {
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
  }, [id, history, update]);

  const prepareData = (inn) => {
    //#1 Data Nilai
    const tmpjwb = [...inn.datanilai].map((el) => {
      if (el.key) {
        return {
          ...el,
          key_value: el.value,
          jwb_value: 0,
          err_value: false,
        };
      } else {
        return el;
      }
    });
    //TMPDA
    const jumlahLokal = [...inn.dataheader].map((dat) => {
      return [
        sumBy(
          filter(inn.datanilai, {
            idc: dat.uid,
            type: "debet",
          }),
          (x) => Number(x.value)
        ),
        sumBy(
          filter(inn.datanilai, {
            idc: dat.uid,
            type: "kredit",
          }),
          (x) => Number(x.value)
        ),
      ];
    });
    //#2 Data Total
    const tmptot1 = [];
    const tmptot2 = [];
    const tmplaba = [];

    [...inn.dataheader].forEach((el, i) => {
      if (includes(inn.selectedwork, el.uid)) {
        // Untuk Total1
        tmptot1.push([
          {
            ...el,
            key_value: jumlahLokal[i][0],
            jwb_value: 0,
            err_value: false,
            key: true,
          },
          {
            ...el,
            key_value: jumlahLokal[i][1],
            jwb_value: 0,
            err_value: false,
            key: true,
          },
        ]);
        // Untuk LABA
        const d = jumlahLokal[i][0];
        const k = jumlahLokal[i][1];
        const x = Math.abs(d - k);
        const hsl1 = x !== 0 ? x : false;
        const hsl2 = hsl1
          ? d < k
            ? jumlahLokal[i][1] - jumlahLokal[i][0]
            : jumlahLokal[i][0] - jumlahLokal[i][1]
          : false;
        const hsl3 = hsl1 ? (d < k ? "d" : "k") : false;
        tmplaba.push([
          {
            ...el,
            key_value: hsl2,
            jwb_value: 0,
            err_value: false,
            key: hsl1 ? (hsl3 === "d" ? true : false) : false,
          },
          {
            ...el,
            key_value: hsl2,
            jwb_value: 0,
            err_value: false,
            key: hsl1 ? (hsl3 === "k" ? true : false) : false,
          },
        ]);
        // Untuk Total2
        tmptot2.push([
          {
            ...el,
            key_value: d < k ? k : d,
            jwb_value: 0,
            err_value: false,
            key: hsl1 ? true : false,
          },
          {
            ...el,
            key_value: d < k ? k : d,
            jwb_value: 0,
            err_value: false,
            key: hsl1 ? true : false,
          },
        ]);
      } else {
        // Untuk Total1
        tmptot1.push([
          {
            ...el,
            value: jumlahLokal[i][0],
            key: false,
          },
          {
            ...el,
            value: jumlahLokal[i][1],
            key: false,
          },
        ]);
        // Untuk LABA
        tmplaba.push([
          {
            ...el,
            key: false,
          },
          {
            ...el,
            key: false,
          },
        ]);
        tmptot2.push([
          {
            ...el,
            key: false,
          },
          {
            ...el,
            key: false,
          },
        ]);
      }
    });

    setJwbTotal1(tmptot1);
    setJwbTotal2(tmptot2);
    setJwbLaba(tmplaba);

    setJwbdata(tmpjwb);
    setConfig(inn);
  };

  const checkjwb = () => {
    setChecking(true);
    const result = [];

    //verif NILAI
    jwbdata.forEach((el, i) => {
      if (el.key) {
        if (Number(el.key_value) === Number(el.jwb_value)) {
          result.push(true);
        } else {
          jwbdata[i].err_value = true;
          result.push(false);
        }
      }
    });
    setJwbdata(jwbdata);
    //verif Total1 SECtion
    var tmpj1 = [...jwbTotal1];
    jwbTotal1.forEach((el, i) => {
      if (el[0].key) {
        if (Number(el[0].key_value) === Number(el[0].jwb_value)) {
          result.push(true);
        } else {
          tmpj1[i][0].err_value = true;
          result.push(false);
        }
      }
      //
      if (el[1].key) {
        if (Number(el[1].key_value) === Number(el[1].jwb_value)) {
          result.push(true);
        } else {
          tmpj1[i][1].err_value = true;
          result.push(false);
        }
      }
    });
    setJwbTotal1(tmpj1);
    //verif Laba SECtion
    jwbLaba.forEach((el, i) => {
      if (el[0].key) {
        if (Number(el[0].key_value) === Number(el[0].jwb_value)) {
          result.push(true);
        } else {
          jwbLaba[i][0].err_value = true;
          result.push(false);
        }
      }
      //
      if (el[1].key) {
        if (Number(el[1].key_value) === Number(el[1].jwb_value)) {
          result.push(true);
        } else {
          jwbLaba[i][1].err_value = true;
          result.push(false);
        }
      }
    });
    setJwbLaba(jwbLaba);
    //verif Total2 SECtion
    jwbTotal2.forEach((el, i) => {
      if (el[0].key) {
        if (Number(el[0].key_value) === Number(el[0].jwb_value)) {
          result.push(true);
        } else {
          jwbTotal2[i][0].err_value = true;
          result.push(false);
        }
      }
      //
      if (el[1].key) {
        if (Number(el[1].key_value) === Number(el[1].jwb_value)) {
          result.push(true);
        } else {
          jwbTotal2[i][1].err_value = true;
          result.push(false);
        }
      }
    });
    // console.log("j2", jwbTotal2);
    setJwbTotal2(jwbTotal2);

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
        <title>Game Simulasi 14 Perdagangan</title>
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
      <Grid container spacing={2} className="p-0" direction="row">
        <Grid item xs={12} md={12} lg={12}>
          <div className="bg-white border">
            <div className="mt-0 mb-2 opacity-50 italic font-semibold my-1">
              Worksheet (Lembar Kerja):
            </div>
            {config && jwbdata ? (
              <>
                <TableWorksheetMhs14
                  checking={checking}
                  dataConfig={config}
                  jwbdata={jwbdata}
                  jwbTotal1={jwbTotal1}
                  jwbTotal2={jwbTotal2}
                  jwbLaba={jwbLaba}
                  setJwbdata={(dat) => setJwbdata(dat)}
                  setJwbTotal1={(dat) => setJwbTotal1(dat)}
                  setJwbTotal2={(dat) => setJwbTotal2(dat)}
                  setJwbLaba={(dat) => setJwbLaba(dat)}
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
              </>
            ) : (
              <ShimmerWorksheetMhs14 />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
