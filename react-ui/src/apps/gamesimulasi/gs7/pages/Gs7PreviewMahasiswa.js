//#region
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast from "react-hot-toast";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";

import axios from "axios";
import API from "../../../../utils/host.config";
import ReactHtmlParser from "react-html-parser";
import KartuPersediaanMhs from "../components/KartuPersediaanMhs";
import MhsFakturPajak from "../components/MhsFakturPajak";
import LoadingWait from "../../../dashboard/component/LoadingWait";
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

export default function Gs7PreviewMahasiswa(props) {
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const { id } = useParams();
  const classes = useStyles();
  const base = {
    tanggal: { value: "", status: false },
    keterangan: { value: "", status: false },
    nobukti: { value: "", status: false },
    masukkwt: { value: "", status: false },
    masukharga: { value: "", status: false },
    masukjumlah: { value: "", status: false },
    saldokwt: { value: "", status: false },
    saldoharga: { value: "", status: false },
    saldojumlah: { value: "", status: false },
  };

  // const [update, setUpdate] = useState(0);
  const [dataConf, setdataConf] = useState(null);
  const [jawaban, setJawaban] = useState(base);
  const [validate, setValidate] = useState(false);
  const [alldone, setAlldone] = useState(false);

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
          setdataConf(res.data.config);
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
  }, [id, history]);

  const check = () => {
    setValidate(true);
    const hasil = [];
    // #1 tanggal
    if (
      dataConf.kp_tgl3.toString().toLowerCase() ===
      jawaban.tanggal.value.toString().toLowerCase()
    ) {
      // console.log("tgl OK");
      jawaban.tanggal.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.tanggal.status = false;
    }
    // #2 keterangan
    if (
      dataConf.kp_keterangan3.toString().toLowerCase() ===
      jawaban.keterangan.value.toString().toLowerCase()
    ) {
      // console.log("keterangan OK");
      jawaban.keterangan.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.keterangan.status = false;
    }
    // #3 nobukti
    if (
      dataConf.kp_nobukti3.toString().toLowerCase() ===
      jawaban.nobukti.value.toString().toLowerCase()
    ) {
      // console.log("nobukti OK");
      jawaban.nobukti.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.nobukti.status = false;
    }
    // #4 masukkwt
    if (
      Number(dataConf.kp_mk3) ===
      Number(jawaban.masukkwt.value.replaceAll(",", ""))
    ) {
      // console.log("masukkwt OK");
      jawaban.masukkwt.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.masukkwt.status = false;
    }
    // #5 masukharga
    if (
      Number(dataConf.kp_mh3) ===
      Number(jawaban.masukharga.value.replaceAll(",", ""))
    ) {
      // console.log("masukharga OK");
      jawaban.masukharga.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.masukharga.status = false;
    }
    // #6 masuk jumlah
    if (
      Number(dataConf.kp_mj3) ===
      Number(jawaban.masukjumlah.value.replaceAll(",", ""))
    ) {
      // console.log("masuk jumlah OK");
      jawaban.masukjumlah.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.masukjumlah.status = false;
    }
    // #7 saldo kwt
    if (
      Number(dataConf.kp_saldok3) ===
      Number(jawaban.saldokwt.value.replaceAll(",", ""))
    ) {
      // console.log("saldo kwt OK");
      jawaban.saldokwt.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.saldokwt.status = false;
    }
    // #8 saldo kwt
    if (
      Number(dataConf.kp_saldoh3) ===
      Number(jawaban.saldoharga.value.replaceAll(",", ""))
    ) {
      // console.log("saldo harga OK");
      jawaban.saldoharga.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.saldoharga.status = false;
    }
    // #9 saldo jumlah
    if (
      Number(dataConf.kp_saldoj3) ===
      Number(jawaban.saldojumlah.value.replaceAll(",", ""))
    ) {
      // console.log("saldo jumlah OK");
      jawaban.saldojumlah.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.saldojumlah.status = false;
    }
    // Finnaly
    if (hasil.every((x) => x === true)) {
      setAlldone(true);
      toast.success(`Benar semua `, {
        style: {
          minWidth: "250px",
          border: "1px solid #1E40AF",
          padding: "16px",
          color: "#1E40AF",
          marginBottom: "25px",
        },
        success: {
          duration: 5500,
        },
      });
    } else {
      toast.error(`Ada yang Salah`, {
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
        <title>Game Simulasi 7</title>
      </Helmet>
      {load && <LoadingWait />}
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
      <div className="border border-dashed p-3 min-h-1/4 w-full">
        <div className="w-full mb-5 p-2 border bg-slate-50">
          {dataConf ? (
            ReactHtmlParser(dataConf.narasisoal)
          ) : (
            <div className="p-3 bg-white">
              <ShimmerTitle line={2} variant="secondary" />
              <ShimmerText />
            </div>
          )}
        </div>

        <KartuPersediaanMhs
          dataC={dataConf}
          jawab={jawaban}
          validate={validate}
          setjawab={(da) => setJawaban(da)}
        />

        {/* BTN CHECK */}
        <div className="flex flex-row-reverse mt-5">
          <div className="flex flex-row-reverse py-1 bg-gradient-to-l from-slate-100 w-full 2xl:w-1/2">
            {validate && alldone ? (
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
                disabled={validate}
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
                setValidate(false);
                setAlldone(false);
                setJawaban(base);
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* FAKTUR PAJAK */}
        <MhsFakturPajak dataConfig={dataConf} />
      </div>
    </div>
  );
}
