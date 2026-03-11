//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import API from "../../../../utils/host.config";
import ReactHtmlParser from "react-html-parser";
import { find } from "lodash";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import {
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerBadge,
} from "react-shimmer-effects";
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import TabelAlokasiMhs from "../components/TabelAlokasiMhs";
import TabelMhsv2 from "../components/TabelMhsv2";

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

export default function Gs12PreviewMahasiswa(props) {
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

  const [jawab, setJawab] = useState(null);
  const [checking, setChecking] = useState(false);
  const [alldone, setAlldone] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs12/data/${id}/soal`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          setLoad(false);
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
          const jw = [];
          res.data.kode.forEach((u, i) => {
            const aloActv = find(res.data.dataalokasi, {
              idc: u.uuid,
            });
            jw.push({
              uuid: uuidv4(),
              idc: u.uuid,
              value: 0,
              status: aloActv ? true : false,
              error: false,
            });
          });
          setJawab(jw);
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
  }, [id, update]);

  const check = () => {
    setChecking(true);
    const result = [];

    // Jawaban benar
    const dnominal = dataAlokasi.filter((x) => x.mode === "nominal");
    const dataInRowActiv = [...kode].map((u, i) => {
      const aloActv = find(dataAlokasi, {
        idc: u.uuid,
      });
      var tot = 0;
      if (aloActv && dnominal[0]) {
        if (aloActv.mode === "nominal") {
          tot = aloActv.value;
        } else {
          tot = Math.abs((aloActv.value / 100) * dnominal[0].value);
        }
      }

      return {
        idc: u.uuid,
        value: tot,
        status: aloActv ? true : false,
      };
    });

    // console.log("cj", jawab);
    // console.log("Al", dataInRowActiv);

    dataInRowActiv.forEach((el, i) => {
      if (el.status) {
        // compare
        if (el.value === jawab[i].value) {
          result.push(true);
          // console.log(i, "OK");
        } else {
          result.push(false);
          jawab[i].error = true;
          // console.log(i, "NOK");
        }
      }
    });

    setJawab(jawab);
    if (result.every((x) => x === true)) {
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
      toast.error(`Ada yang salah silahkan Ulangi kembali`, {
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
    }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 12</title>
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
          <div className="m-3">
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
              <div className="opacity-50 italic font-semibold">Worksheet:</div>
              {dataConfig ? (
                <TabelMhsv2
                  headers={headers}
                  departements={departements}
                  sections={sections}
                  kode={kode}
                  kpembantu={kpembantu}
                  data={data}
                  dataAlokasi={dataAlokasi}
                  jawab={jawab}
                  setJawab={(x) => setJawab(x)}
                  checking={checking}
                />
              ) : (
                <>
                  <br />
                  <ShimmerBadge width={200} />
                  <ShimmerTable row={5} col={10} />
                </>
              )}
              {/* CHECK */}
              <div
                className={`flex flex-row-reverse py-1 w-full  bg-gradient-to-l from-slate-100`}
              >
                {checking && alldone ? (
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
                      check();
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
                    setChecking(false);
                    setAlldone(false);
                    setUpdate(update + 1);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <div className="bg-white">
              <div className="opacity-50 italic font-semibold my-1">
                Data (soal):
              </div>
              <TabelAlokasiMhs dataAlokasi={dataAlokasi} />
            </div>
          </Grid>
        </Grid>
      </div>
      <br />
    </div>
  );
}
