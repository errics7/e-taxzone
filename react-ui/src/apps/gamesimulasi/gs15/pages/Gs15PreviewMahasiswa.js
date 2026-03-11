//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";
import ReactHtmlParser from "react-html-parser";
import { find, findIndex } from "lodash";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import {
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerSectionHeader,
} from "react-shimmer-effects";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import BuktiMemorialGs15 from "../components/BuktiMemorialGs15";
import TabelManagerMhs from "../components/TabelManagerMhs";
import KodeAlokasiMhs from "../components/KodeAlokasiMhs";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  btnback: {
    backgroundColor: "#7C7C7C",
    textTransform: "none",
    marginLeft: "10px",
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

export default function Gs15PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  const [dataConfig, setDataConfig] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [sections, setSections] = useState([]);
  const [kode, setKode] = useState([]);
  const [kpembantu, setKpembantu] = useState([]);
  const [data, setData] = useState([]);
  const [dataAlokasi, setDataAlokasi] = useState([]);

  const [jawab2, setJawab2] = useState(null);
  const [checking2, setChecking2] = useState(false);
  const [alldone, setAlldone] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs15/data/${id}/soal`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          setLoad(false);
          //
          if (!res.data.status) {
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
          setDataConfig(res.data.config);
          setHeaders(res.data.headers);
          setDepartements(res.data.departements);
          setSections(res.data.sections);
          setKode(res.data.kode);
          const kp = res.data.kpembantu.map((el, i) => ({
            ...el,
            status: el.status === 1 ? true : false,
          }));
          setKpembantu(kp);
          setData(res.data.data);
          setDataAlokasi(res.data.dataalokasi);
          //
          //prep jawab
          const jw2 = [];
          res.data.dataalokasi.forEach((u, i) => {
            jw2.push({
              uuid: uuidv4(),
              debit: {
                noakun: {
                  value: "",
                  error: false,
                },
                nominal: {
                  value: 0,
                  error: false,
                },
              },
              kredit: {
                noakun: {
                  value: "",
                  error: false,
                },
                nominal: {
                  value: 0,
                  error: false,
                },
              },
            });
          });
          setJawab2(jw2);
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
  }, [id, history, update]);

  const check2 = () => {
    setChecking2(true);
    // console.log("alo", dataAlokasi);
    //Buat kunci
    var kunci = [];
    dataAlokasi.forEach((el, i) => {
      const f = find(kode, {
        uuid: el.idc,
      });
      kunci.push({
        idc: el.idc,
        noakun: f.alias,
        jenis: el.jenis,
        nilai: el.value,
        status: false,
        used: false,
      });
    });
    const result = [];
    //Start check
    jawab2.forEach((el, i) => {
      //debit check
      if (el.debit.noakun.value !== "") {
        const f = findIndex(kunci, { noakun: el.debit.noakun.value });
        if (
          f >= 0 &&
          kunci[f].noakun === el.debit.noakun.value &&
          kunci[f].jenis === "debit" &&
          kunci[f].used === false
        ) {
          // Kode Benar
          // console.log(i + "-1", "OK");
          // Cek Nilai berisi
          if (el.debit.nominal.value !== 0) {
            // Cek Nilai same
            if (el.debit.nominal.value === kunci[f].nilai) {
              // console.log(i + "-2", "OK");
              result.push(true);
            } else {
              result.push(false);
              el.debit.nominal.error = true;
              // console.log(i + "-2", "NOK " + el.debit.noakun.value);
            }
          } else {
            el.debit.nominal.error = true;
            result.push(false);
            // console.log(i + "-2", "NOK " + el.debit.noakun.value);
          }
        } else {
          el.debit.noakun.error = true;
          el.debit.nominal.error = true;
          result.push(false);
          // console.log(i + "-1", "NOK " + el.debit.noakun.value + " " + f);
        }
        //set used
        if (f !== -1) {
          kunci[f].used = true;
        }
      }

      //Kredit Check
      if (el.kredit.noakun.value !== "") {
        const f = findIndex(kunci, { noakun: el.kredit.noakun.value });
        if (
          f >= 0 &&
          kunci[f].noakun === el.kredit.noakun.value &&
          kunci[f].jenis === "kredit" &&
          kunci[f].used === false
        ) {
          // Kode Benar
          // console.log(i + "-1", "OK");
          // Cek Nilai berisi
          if (el.kredit.nominal.value !== 0) {
            // Cek Nilai same
            if (el.kredit.nominal.value === kunci[f].nilai) {
              // console.log(i + "-2", "OK");
              result.push(true);
            } else {
              result.push(false);
              el.kredit.nominal.error = true;
              // console.log(i + "-2", "NOK " + el.kredit.noakun.value);
            }
          } else {
            el.kredit.nominal.error = true;
            result.push(false);
            // console.log(i + "-2", "NOK " + el.kredit.noakun.value);
          }
        } else {
          el.kredit.noakun.error = true;
          el.kredit.nominal.error = true;
          result.push(false);
          // console.log(i + "-1", "NOK " + el.kredit.noakun.value + " " + f);
        }
        //set used
        if (f !== -1) {
          kunci[f].used = true;
        }
      }

      //kode kosong
      if (el.kredit.noakun.value === "" && el.kredit.nominal.value !== 0) {
        el.kredit.noakun.error = true;
        el.kredit.nominal.error = true;
        result.push(false);
        // console.log(i + "-1", "NOK " + el.kredit.noakun.value);
      }
      if (el.debit.noakun.value === "" && el.debit.nominal.value !== 0) {
        el.debit.noakun.error = true;
        el.debit.nominal.error = true;
        result.push(false);
        // console.log(i + "-1", "NOK " + el.debit.noakun.value);
      }
    });
    //fin
    setJawab2(jawab2);

    if (
      result.every((x) => x === true) &&
      result.filter((x) => x === true).length === kunci.length
    ) {
      setAlldone(true);
      toast.success(`Yay Benar semua `, {
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
      toast.error(
        `Ada yang salah pada jawaban Worksheet silahkan Ulangi kembali`,
        {
          style: {
            minWidth: "250px",
            border: "1px solid #1E40AF",
            padding: "16px",
            color: "#1E40AF",
            marginBottom: "25px",
          },
          success: {
            duration: 10000,
          },
        }
      );
    }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 15</title>
      </Helmet>
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
        {dataConfig ? (
          ReactHtmlParser(dataConfig.narasisoal)
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>
      <br />
      <div className="relative">
        {load && <LoadingWait />}
        <Grid container spacing={2} direction="row" alignItems="stretch">
          <Grid item xs={12} md={12} lg={12}>
            <div className="bg-white">
              <div className="opacity-50 italic font-semibold my-1">
                Data (soal):
              </div>
              {dataConfig ? (
                <TabelManagerMhs
                  headers={headers}
                  departements={departements}
                  sections={sections}
                  kode={kode}
                  kpembantu={kpembantu}
                  data={data}
                  dataAlokasi={dataAlokasi}
                />
              ) : (
                <>
                  <ShimmerTable row={5} col={8} />
                </>
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={8} lg={7}>
            <div className="bg-white">
              {dataConfig ? (
                <BuktiMemorialGs15
                  config={dataConfig}
                  dasaralokasi={dataAlokasi}
                />
              ) : (
                <>
                  <ShimmerSectionHeader center />
                  <ShimmerTable row={2} col={5} />
                </>
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <div className="p-1 bg-white">
              <div className="opacity-50 italic font-semibold my-1">
                Worksheet:
              </div>
              {dataConfig ? (
                <KodeAlokasiMhs
                  jawab={jawab2}
                  setJawab2={(x) => setJawab2(x)}
                  check={checking2}
                />
              ) : (
                <>
                  <ShimmerTable row={2} col={4} />
                </>
              )}
              {/* CHECK 2*/}
              <div
                className={`flex flex-row-reverse py-1 w-full  bg-gradient-to-l from-slate-100`}
              >
                {alldone ? (
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
                    disabled={checking2}
                    onClick={() => {
                      check2();
                    }}
                  >
                    Check
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.btnreset}
                  onClick={() => {
                    setChecking2(false);
                    setAlldone(false);
                    setUpdate(update + 1);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
      <br />
    </div>
  );
}
