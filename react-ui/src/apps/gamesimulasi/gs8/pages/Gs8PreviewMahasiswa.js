//#region
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactHtmlParser from "react-html-parser";
import toast from "react-hot-toast";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import { Helmet } from "react-helmet";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import axios from "axios";
import API from "../../../../utils/host.config";
import JurnalPembelianMhs from "../components/JurnalPembelianMhs";
import FakturPajakMhs from "../components/FakturPajakMhs";
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

export default function Gs8PreviewMahasiswa(props) {
  const history = useHistory();
  const { id } = useParams();
  const [load, setLoad] = useState(false);
  const classes = useStyles();
  const base = {
    tanggal: { value: "", status: false },
    namarek: { value: "", status: false },
    nobukti: { value: "", status: false },
    persediaan: { value: "", status: false }, //ppn
    persekot: { value: "", status: false },
    hutang: { value: "", status: false },
  };

  const [update, setUpdate] = useState(0);
  const [dataConf, setdataConf] = useState(null);
  const [jawaban, setJawaban] = useState(base);
  const [validate, setValidate] = useState(false);
  const [alldone, setAlldone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs8/data/${id}/soal`, {
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
          setdataConf(res.data.config);
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

  const check = () => {
    setValidate(true);
    const hasil = [];

    // #1 tanggal
    if (
      dataConf.ktanggal.toString().toLowerCase() ===
      jawaban.tanggal.value.toString().toLowerCase()
    ) {
      //console.log("tgl OK");
      jawaban.tanggal.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.tanggal.status = false;
    }
    // #2 Nama Rek
    if (
      dataConf.knamarek.toString().toLowerCase() ===
      jawaban.namarek.value.toString().toLowerCase()
    ) {
      //console.log("namarek OK");
      hasil.push(true);
      jawaban.namarek.status = true;
    } else {
      hasil.push(false);
      jawaban.namarek.status = false;
    }
    // #3 No Bukti
    if (
      dataConf.knobukti.toString().toLowerCase() ===
      jawaban.nobukti.value.toString().toLowerCase()
    ) {
      //console.log("knobukti OK");
      jawaban.nobukti.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.nobukti.status = false;
    }
    // #4 Persediaan
    if (Number(dataConf.kpbb2) === Number(jawaban.persediaan.value)) {
      //console.log("persediaan OK");
      jawaban.persediaan.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.persediaan.status = false;
    }
    // #5 persekot / PPN
    if (Number(dataConf.kpppn2) === Number(jawaban.persekot.value)) {
      //console.log("PPN OK");
      jawaban.persekot.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.persekot.status = false;
    }
    // #6 TOTAL
    if (Number(dataConf.kkhd2) === Number(jawaban.hutang.value)) {
      //console.log("hutang OK");
      jawaban.hutang.status = true;
      hasil.push(true);
    } else {
      hasil.push(false);
      jawaban.hutang.status = false;
    }
    //Finish up
    //console.log("Hasil : ", jawaban);
    // console.log("Hasil : ",hasil.every((x) => x === true));

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
          duration: 3500,
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
        <title>Game Simulasi 8</title>
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
        {/* Worksheet */}
        <JurnalPembelianMhs
          data={dataConf}
          validate={validate}
          datajawab={jawaban}
          setjawab={(da) => {
            setJawaban(da);
          }}
        />
        {/* CHECK SECTION */}
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
                setUpdate(update + 1);
                setJawaban(base);
                setValidate(false);
                setAlldone(false);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      <br />
      {/* Data Soal */}
      <FakturPajakMhs dataConfig={dataConf} />
    </div>
  );
}
