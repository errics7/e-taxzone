//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";

import ReactHtmlParser from "react-html-parser";
import toast from "react-hot-toast";
import {
  // ShimmerBadge,
  // ShimmerTable,
  ShimmerTitle,
  ShimmerText,
} from "react-shimmer-effects";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { find } from "lodash";
import { v4 as uuidv4 } from "uuid";
import ShimmerSoalMhs7 from "../components/ShimmerSoalMhs7";
import ShimmerWsMhs7 from "../components/ShimmerWsMhs7";
import LoadingWait from "../../../dashboard/component/LoadingWait";

import TableMhs7 from "../components/TableMhs7";
// import DATA from './Data';
import TableWsMhs from "../components/TableWsMhs";
import { CircularProgress } from "@mui/material";
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

export default function Gs2Mhs(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [update, setUpdate] = useState(0);
  const [config, setConfig] = useState(null);
  const [jawab1, setJawab1] = useState(null);

  const [done1, setDone1] = useState(false); //true to skip step 1
  const [checking1, setChecking1] = useState(false);
  const [load, setLoad] = useState(false);
  // const [alldone, setAlldone] = useState(false);
  useEffect(() => {
    setLoad(true);
    const fetchData = () => {
      // setConfig(DATA)

      axios(`${API.HOST}/api/v2/gamesimulasi7/${id}/config`, {
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
          // Prepare
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

  const prepareData = (config) => {
    let tempJwb = [];
    config &&
      config.dataakun.forEach((elm, i) => {
        const dvalue = [];
        //mencari & menulis
        elm.idakun.forEach((dat) => {
          const dfind = find(config.datajurnal, { uid: dat });
          dvalue.push({
            uid: uuidv4(),
            key_tgl: dfind.tgl,
            key_ref: dfind.type,
            key_jumlah: dfind[elm.name],
            jwb_tgl: "",
            jwb_ref: "",
            jwb_jumlah: 0,
            err_tgl: false,
            err_err: false,
            err_jumlah: false,
          });
        });

        tempJwb.push({
          uid: elm.uid,
          name: elm.name,
          detailname: elm.detailname,
          noakun: elm.noakun,
          tgl: elm.tgl,
          posisi: elm.posisi,
          jumlah: elm.jumlah,
          datajawaban: dvalue,
        });
      });

    // console.log(tempJwb);
    setJawab1(tempJwb);
    setConfig(config);
  };

  const check = () => {
    setChecking1(true);
    let result = [];

    jawab1.forEach((element, index) => {
      element.datajawaban.forEach((el, i) => {
        // #1 TGL
        if (el.key_tgl.toLowerCase() === el.jwb_tgl.toLowerCase()) {
          result.push(true);
        } else {
          jawab1[index].datajawaban[i].err_tgl = true;
          result.push(false);
        }

        // #2 ref
        if (el.key_ref.toLowerCase() === el.jwb_ref.toLowerCase()) {
          result.push(true);
        } else {
          jawab1[index].datajawaban[i].err_ref = true;
          result.push(false);
        }

        // #3 jumlah
        if (Number(el.key_jumlah) === Number(el.jwb_jumlah)) {
          result.push(true);
        } else {
          jawab1[index].datajawaban[i].err_jumlah = true;
          result.push(false);
        }
        // // #3 posisi
        // if(element.posisi === "debet") {
        //   // jika debet
        //   if (Number(el.key_jumlah) === Number(el.jwb_jumlah)) {
        //     result.push(true);
        //   } else {
        //     jawab1[index].datajawaban[i].err_jumlah = true;
        //     result.push(false);
        //   }
        // } else {
        //   // jika kredit
        //   if (Number(el.key_jumlah) === Number(el.jwb_jumlah)) {
        //     result.push(true);
        //   } else {
        //     jawab1[index].datajawaban[i].err_jumlah = true;
        //     result.push(false);
        //   }
        // }
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
        <title>Game Simulasi 7 Perdagangan</title>
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
        {config ? (
          ReactHtmlParser(config.narasisoal)
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>
      <div className="relative">
        {load && <LoadingWait />}
        <div>
          <Grid container spacing={2} direction="row" alignItems="stretch">
            {/* {dataTable ? ( */}
            <Grid item xs={12} md={12} lg={12}>
              <div className="bg-white">
                <div className="mt-5 mb-3 opacity-50 italic font-semibold my-1">
                  Data (soal):
                </div>
                {config ? (
                  <>
                    <div className="mb-2">
                      {config && config.intropenjualan}
                    </div>
                    <div className="mt-5 mb-3 p-1 border border-dashed">
                      <TableMhs7
                        dataConfig={config}
                        setdataConfig={(dat) => setConfig(dat)}
                        jenisJurnal="jurnal pembelian"
                      />
                    </div>
                    <div className="mb-2 mt-8">{config && config.introkas}</div>
                    <div className="mt-5 mb-3 p-1 border border-dashed">
                      <TableMhs7
                        dataConfig={config}
                        setdataConfig={(dat) => setConfig(dat)}
                        jenisJurnal="jurnal kas keluar"
                      />
                    </div>
                  </>
                ) : (
                  <ShimmerSoalMhs7 />
                )}

                <div className="mt-5 mb-3 p-1 border border-dashed">
                  <div className=" opacity-50 italic font-semibold my-1">
                    Worksheet (Lembar Kerja):
                  </div>
                  {jawab1 ? (
                    <TableWsMhs
                      jawab1={jawab1}
                      setJawab={(x) => setJawab1(x)}
                      checking1={checking1}
                    />
                  ) : (
                    <ShimmerWsMhs7 />
                  )}
                </div>
              </div>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              {/* CHECK */}
              <div
                className={`flex flex-row-reverse py-1 w-full  bg-gradient-to-l from-slate-100`}
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
                    onClick={() => check()}
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
                  onClick={() => {
                    setChecking1(false);
                    setDone1(false);
                    setUpdate(update + 1);
                  }}
                >
                  Reset
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <br />
    </div>
  );
}
