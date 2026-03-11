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
import ShimmerSoalMhs8 from "../components/ShimmerSoalMhs8";
import ShimmerWorksheetMhs8 from "../components/ShimmerWorksheetMhs8";
import TablePenjualanMhs8 from "../components/TablePenjualanMhs8";
import TableJKMMhs8 from "../components/TableJKMMhs8";
import TableWorksheetMhs8 from "../components/TableWorksheetMhs8";
import { groupBy, map } from "lodash";
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

export default function Gs8Mhs() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  // const { dispatch } = useContext(AuthContext);
  const [update, setUpdate] = useState(0);
  const [load, setLoad] = useState(false);
  const [config, setConfig] = useState(null);
  const [jawab1, setJawab1] = useState(null);
  //
  const [done1, setDone1] = useState(false); //true to skip step 1
  const [checking1, setChecking1] = useState(false);

  useEffect(() => {
    setLoad(true);
    const fetchData = () => {
      axios(`${API.HOST}/api/v2/gamesimulasi8/${id}/config`, {
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
    const data = groupBy(inn.datajurnal, "gen");
    const objJurnal = map(data, (obj, key) => {
      return { head: key, values: obj };
    });

    const jwb1 = objJurnal.map((item, index) => {
      const countDebit = [];

      return {
        ...item,
        values: item.values.map((el, i) => {
          if (i === 0) {
            //start
            countDebit.push(el.jumlah);
            return { ...el };
          } else {
            const x = el.posisi === "debit" ? el[el.key] : el[el.key] * -1;
            countDebit.push(Number(countDebit[i - 1] + x));

            return {
              ...el,
              key_tgl: el.tgl,
              key_keterangan: el.keterangan,
              key_ref: el.type,
              key_jum1: Number(el[el.key]),
              key_jum2: countDebit[i],

              jwb_tgl: "",
              jwb_keterangan: "",
              jwb_ref: "",
              jwb_jum1: "",
              jwb_jum2: "",

              err_tgl: false,
              err_keterangan: false,
              err_ref: false,
              err_jum1: false,
              err_jum2: false,
            };
          }
        }),
      };
    });

    setJawab1(jwb1);
    //
    // console.log(jwb1);
    setConfig(inn);
  };

  // CHeck 1 Step
  const check1 = () => {
    setChecking1(true);
    const result = [];

    jawab1.forEach((element, index) => {
      //values
      element.values.forEach((el, i) => {
        if (i === 0) {
          //skip for intro
        } else {
          // #1 TGL
          if (el.key_tgl.toLowerCase() === el.jwb_tgl.toLowerCase()) {
            result.push(true);
          } else {
            jawab1[index].values[i].err_tgl = true;
            result.push(false);
          }
          // #2 keterangan
          if (
            el.key_keterangan.toLowerCase() === el.jwb_keterangan.toLowerCase()
          ) {
            result.push(true);
          } else {
            jawab1[index].values[i].err_keterangan = true;
            result.push(false);
          }
          // #3 Ref
          if (el.key_ref.toLowerCase() === el.jwb_ref.toLowerCase()) {
            result.push(true);
          } else {
            jawab1[index].values[i].err_ref = true;
            result.push(false);
          }
          // #4 Jum1
          if (Number(el.key_jum1) === Number(el.jwb_jum1)) {
            result.push(true);
          } else {
            jawab1[index].values[i].err_jum1 = true;
            result.push(false);
          }
          // #5 Jum2
          if (Number(el.key_jum2) === Number(el.jwb_jum2)) {
            result.push(true);
          } else {
            jawab1[index].values[i].err_jum2 = true;
            result.push(false);
          }
        }
      });
      //end
    });

    setJawab1(jawab1);
    if (result.every((x) => x === true)) {
      setDone1(true);
      toast.success(`Yay Benar Semua`, {
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
          duration: 5000,
        },
      });
    }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 8 Perdagangan</title>
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
      <Grid container spacing={2} direction="row" alignItems="stretch">
        <Grid item xs={12} md={12} lg={12}>
          {config ? (
            <div className="bg-white">
              <div className="mt-2 mb-3 opacity-50 italic font-semibold my-1">
                Data (Soal):
              </div>
              <TablePenjualanMhs8 dataConfig={config} />
              <TableJKMMhs8 dataConfig={config} />
            </div>
          ) : (
            <ShimmerSoalMhs8 />
          )}
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <div className="border border-dashed p-1 bg-white">
            <div className="mt-0 mb-3 opacity-50 italic font-semibold my-1">
              Worksheet (Lembar Kerja):
            </div>
            {config ? (
              <>
                <TableWorksheetMhs8
                  dataConfig={config}
                  checking1={checking1}
                  jawab1={jawab1}
                  setJawab={(x) => setJawab1(x)}
                />
                <div
                  className={`flex flex-row-reverse py-1 mt-5 w-full  bg-gradient-to-l from-slate-100`}
                >
                  {done1 ? (
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
                      disabled={checking1}
                      onClick={() => {
                        check1();
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
                      setChecking1(false);
                      setDone1(false);
                      setUpdate(update + 1);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </>
            ) : (
              <ShimmerWorksheetMhs8 />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
