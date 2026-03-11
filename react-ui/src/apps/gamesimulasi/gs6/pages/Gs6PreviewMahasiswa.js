//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";
import { ShimmerTitle, ShimmerText, ShimmerTable } from "react-shimmer-effects";

import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TabelBahanMhs from "../components/TabelBahanMhs";
import TabelInfoBahanMhs from "../components/TabelInfoBahanMhs";
import TabelInfoKreditDebitMhs from "../components/TabelInfoKreditDebitMhs";
import BukuPembantuBiaya from "../components/BukuPembantuBiaya";
import ReactHtmlParser from "react-html-parser";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import swal from "sweetalert";
import toast from "react-hot-toast";

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
//#endregion

export default function Gs6PreviewMahasiswa(props) {
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const { id } = useParams();
  const classes = useStyles();

  const [updated, setUpdated] = useState(0);
  const [dataBhn, setdataBhn] = useState([]);
  const [dataConf, setdataConf] = useState(null);
  const [dataControl, setDataControl] = useState([]);
  const [jawaban, setJawaban] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs6/data/${id}/soal`, {
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
          // console.log(res.data);
          setdataBhn(res.data.dabuktibahan);
          setdataConf(res.data.config);
          setDataControl(res.data.dacontrol);
          // Filter Tampilkan Debit Only
          const dataD = res.data.dacontrol.filter((x) => "debit" === x.posisi);
          setJawaban([
            ...Array(dataD.length).fill({
              kodepusat: { value: "", status: false },
              kodepembantu: { value: "", status: false },
              nop: { value: "", status: false },
              keterangan: { value: "", status: false },
              debit: { value: "", status: false },
              saldodebit: { value: "", status: false },
            }),
          ]);
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
  }, [updated, history, id]);

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 6</title>
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
      <div className="border border-dashed p-3 min-h-1/2 w-full">
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
        {/* Data Tabel 1 Pengerjaan*/}
        <BukuPembantuBiaya
          data={jawaban}
          dataControl={dataControl}
          setdata={(dat) => setJawaban(dat)}
          refresh={() => setUpdated(updated + 1)}
        />
        {/* Data Tabel 2 */}
        <div className="mt-5 bg-white">
          <TabelBahanMhs data={dataBhn} dataConfig={dataConf} />
          {!dataConf && <ShimmerTable row={2} col={7} />}
          <div className="flex flex-col 2xl:flex-row justify-between mt-5">
            <TabelInfoBahanMhs data={dataConf} />
            <TabelInfoKreditDebitMhs
              className="w-5/12 mt-3 2xl:mt-0"
              data={dataControl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
