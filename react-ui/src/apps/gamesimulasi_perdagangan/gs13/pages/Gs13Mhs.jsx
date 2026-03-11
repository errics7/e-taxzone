//#region
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import makeStyles from "@mui/styles/makeStyles";
import { useEffect, useState } from "react";
//import { AuthContext } from "../../../../AppRoute";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import ReactHtmlParser from "react-html-parser";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { Grid, CircularProgress } from "@mui/material";
import ShimmerMhsSoal13 from "../components/ShimmerMhsSoal13";
import ShimmerWorksheetMhs13 from "../components/ShimmerWorksheetMhs13";
import TableSoalMhs13 from "../components/TableSoalMhs13";
import { filter, sumBy } from "lodash";
import TableWorksheetMhs13 from "../components/TableWorksheetMhs13";
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

export default function Gs13Mhs() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [update] = useState(0);
  const [load, setLoad] = useState(false);
  const [config, setConfig] = useState(null);
  const [jwbTotal, setJwbTotal] = useState(null);
  const [jwbdata, setJwbdata] = useState(null);

  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setLoad(true);
    const fetchData = () => {
      axios(`${API.HOST}/api/v2/gamesimulasi13/${id}/config`, {
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
            console.log(error);
            toast.error(error.response.data.message);
          }
        });
    };

    fetchData();
  }, [id, history, update]);

  const prepareData = (inn) => {
    //#1 JWB TGL
    setJwbTotal({
      key_totdebet: sumBy(
        filter(inn.datanilai, {
          idc: inn.selectedwork,
          type: "debet",
        }),
        (x) => Number(x.value)
      ),
      key_totkredit: sumBy(
        filter(inn.datanilai, {
          idc: inn.selectedwork,
          type: "kredit",
        }),
        (x) => Number(x.value)
      ),
      jwb_totdebet: 0,
      jwb_totkredit: 0,
      err_totdebet: false,
      err_totkredit: false,
    });
    //#2 Data
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
    // console.log(tmpjwb);

    setJwbdata(tmpjwb);
    setConfig(inn);
  };

  const checkjwb = () => {
    setChecking(true);
    const result = [];
    //Total Chek
    if (Number(jwbTotal.key_totdebet) === Number(jwbTotal.jwb_totdebet)) {
      result.push(true);
    } else {
      jwbTotal.err_totdebet = true;
      result.push(false);
    }
    if (Number(jwbTotal.key_totkredit) === Number(jwbTotal.jwb_totkredit)) {
      result.push(true);
    } else {
      jwbTotal.err_totkredit = true;
      result.push(false);
    }
    setJwbTotal(jwbTotal);

    //
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
        <title>Game Simulasi 13 Perdagangan</title>
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
      <Grid container spacing={2} className="pl-4 bg-white" direction="row">
        <Grid item xs={12} md={12} lg={12} className="border pb-3">
          <div className="mt-0 mb-3 opacity-50 italic font-semibold my-1">
            Data (Soal):
          </div>
          {config ? (
            <>
              <TableSoalMhs13 dataConfig={config} />
            </>
          ) : (
            <ShimmerMhsSoal13 />
          )}
        </Grid>
        <Grid item xs={12} md={12} lg={12} className="border pt-2">
          <div className="mt-0 mb-2 opacity-50 italic font-semibold my-1">
            Worksheet (Lembar Kerja):
          </div>
          {config && jwbdata ? (
            <>
              <TableWorksheetMhs13
                checking={checking}
                dataConfig={config}
                jwbdata={jwbdata}
                jwbTotal={jwbTotal}
                setJwbdata={(dat) => setJwbdata(dat)}
                setJwbTotal={(dat) => setJwbTotal(dat)}
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
            <ShimmerWorksheetMhs13 />
          )}
        </Grid>
      </Grid>
    </div>
  );
}
