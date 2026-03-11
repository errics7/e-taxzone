import {
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerSectionHeader,
} from "react-shimmer-effects";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import TabelBahanMhs from "../components/TabelBahanMhs";
import TabelInfoBahanMhs from "../components/TabelInfoBahanMhs";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactHtmlParser from "react-html-parser";
import UiMutasiKeluarMhs from "../components/UiMutasiKeluarMhs";
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
    marginTop: "15px",
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
    marginTop: "15px",
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
    marginTop: "15px",
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#277BA5",
      boxShadow: "none",
    },
  },
}));
// #endregion

export default function Gs5PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const { id } = useParams();
  //dat
  const [dOri, setDOri] = useState(null);
  const [dSoal, setDSoal] = useState([]);
  const [validate, setValidate] = useState(false);
  const [alldone, setAllDone] = useState(false);

  const [jawab, setJawab] = useState({
    satuan: 0,
    err_satuan: false,
    err_jumlah: false,
    jumlah: 0,
  });
  // #region
  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs5/data/${id}/soal`, {
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
          setDOri(res.data);
          setDSoal(res.data.dataSoal);
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
  }, [id, history]);

  const resetButton = () => {
    setValidate(false);
    setAllDone(false);

    setJawab({
      satuan: 0,
      err_satuan: false,
      err_jumlah: false,
      jumlah: 0,
    });
  };

  const check = () => {
    setValidate(true);
    const dataTrue = dSoal && dSoal.filter((x) => x.status === true);
    const result = [];
    // Valid Check
    if (Number(jawab.satuan) === Number(dataTrue[0].hrgsatuan)) {
      result.push(true);
    } else {
      jawab.err_satuan = true;
      result.push(false);
    }
    if (Number(jawab.jumlah) === Number(dataTrue[0].hrgjumlah.toString())) {
      result.push(true);
    } else {
      jawab.err_jumlah = true;
      result.push(false);
    }

    //finally
    setJawab(jawab);
    if (result.every((x) => x === true)) {
      setAllDone(true);
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
  // #endregion

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 5</title>
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
      <div className="w-full mb-3 mt-5 p-2 border bg-slate-50">
        {dOri ? (
          ReactHtmlParser(dOri.config.narasisoal)
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>
      {/* Kartu Persediaan */}
      <UiMutasiKeluarMhs selected={dOri} />
      <br />
      <div className="relative bg-white">
        <div className="absolute opacity-50 italic font-semibold p-1 pr-2">
          Worksheet :
        </div>
        {dOri ? (
          <div className="border border-dashed p-3 min-h-1/2 w-full pt-8">
            <div className="text-xl uppercase text-center mt-1">
              Bukti Permintaan & Pemakaian Bahan
            </div>
            <div className="text-lg flex flex-col items-center uppercase text-center">
              <div className="flex items-center mt-2">
                <div>NO BPPB :</div>
                <div className="px-2 relative">
                  {dOri && dOri.config.nobppb}
                </div>
              </div>
            </div>
            <br />
            <TabelBahanMhs
              data={dSoal}
              validate={validate}
              jawab={jawab}
              setJawab={(dat) => setJawab(dat)}
            />
            <br />
            <TabelInfoBahanMhs selected={dOri} />
            <br />
          </div>
        ) : (
          <div className="mt-5">
            <ShimmerSectionHeader center />
            <ShimmerTable row={2} col={7} />
          </div>
        )}
      </div>

      <div className="flex flex-row-reverse pb-5 border-b">
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
                  duration: 6000,
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
            resetButton();
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
