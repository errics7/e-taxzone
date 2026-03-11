//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";
import ReactHtmlParser from "react-html-parser";
import { filter } from "lodash";
import toast from "react-hot-toast";
import Tooltip from "@mui/material/Tooltip";
import {
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerBadge,
} from "react-shimmer-effects";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import BuktiMemorialMhs14 from "../components/BuktiMemorialMhs14";
import BukuPembantuBiayaMhs14 from "../components/BukuPembantuBiayaMhs14";
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

export default function Gs14PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  const [jawab, setJawab] = useState(null);
  const [checking, setChecking] = useState(false);
  const [alldone, setAlldone] = useState(false);
  //#region
  const [sizeCon, setSizeCon] = useState(12);
  const [dataConfig, setDataConfig] = useState(null);
  const [alokasi, setAlokasi] = useState([
    {
      uuid: "708d0256-ad19-4c92-bc94-c3ea6497c660",
      keterangan: "",
      nominal: 0,
      nopusatbiaya: "",
      nopembantubiaya: "",
    },
  ]);
  const [dataInfo, setDataInfo] = useState([
    {
      uuid: "20c14833-e216-460c-837d-54771cd35d52",
      no_debit: "",
      val_debit: 0,
      no_kredit: "",
      val_kredit: 0,
    },
  ]);
  const [listPembantu, setListPembantu] = useState([
    {
      uuid: "77b179ac-7921-40a3-9730-1aa8ba98ad12",
      cuid: "708d0256-ad19-4c92-bc94-c3ea6497c660",
      bln: "Des",
      tgl: "1",
      ket: "Saldo awal",
      ref: "",
      debit: 0,
      kredit: 0,
      status: "no",
    },
    {
      uuid: "1e002e9c-d3d8-4e5c-a089-69c592f90ba1",
      cuid: "708d0256-ad19-4c92-bc94-c3ea6497c660",
      bln: "Des",
      tgl: "2",
      ket: "Produksi sie pulp",
      ref: "",
      debit: 0,
      kredit: 0,
      status: "no",
    },
  ]);
  //#endregion

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs14/data/${id}/soal`, {
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
          setAlokasi(res.data.alokasi);
          setDataInfo(res.data.dataInfo);
          //#region set Jawab
          const jw = [];
          const datak = filter(res.data.listPembantu, { status: "key" });
          datak.forEach((item, index) => {
            const data = {
              uuid: item.uuid,
              cuid: item.cuid,
              ket: item.ket,
              val_ket: "",
              err_ket: false,
              debit: item.debit,
              val_debit: 0,
              err_debit: false,
              kredit: item.kredit,
              val_kredit: 0,
              err_kredit: false,
              status: item.status,
            };
            jw.push(data);
          });

          // console.log(datak);
          // console.log(jw);
          setJawab(jw);
          setListPembantu(res.data.listPembantu);
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

  const check = () => {
    setChecking(true);
    const result = [];

    jawab.forEach((item, index) => {
      if (item.ket.toLowerCase() === item.val_ket.toLowerCase()) {
        result.push(true);
      } else {
        result.push(false);
        jawab[index].err_ket = true;
      }
      //Deb
      if (Number(item.debit) === Number(item.val_debit)) {
        result.push(true);
      } else {
        result.push(false);
        jawab[index].err_debit = true;
      }
      //Kredit
      if (Number(item.kredit) === Number(item.val_kredit)) {
        result.push(true);
      } else {
        result.push(false);
        jawab[index].err_kredit = true;
      }
      // jika null 22nya
      if (Number(item.val_debit) === 0 && Number(item.val_kredit) === 0) {
        result.push(false);
        jawab[index].err_debit = true;
        jawab[index].err_kredit = true;
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
          duration: 10000,
        },
      });
    }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 14</title>
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
        <Grid
          container
          spacing={2}
          direction={sizeCon === 6 ? "row-reverse" : "row"}
          alignItems="stretch"
        >
          <Grid item xs={12} md={6} lg={6}>
            <div className="bg-white">
              <div className="opacity-50 italic font-semibold my-1">
                Data (soal):
              </div>
              {dataConfig ? (
                <BuktiMemorialMhs14
                  dataConfig={dataConfig}
                  alokasi={alokasi}
                  dataInfo={dataInfo}
                />
              ) : (
                <>
                  <div className="flex justify-center">
                    <ShimmerBadge width={200} />
                  </div>
                  <ShimmerTable row={2} col={2} />
                </>
              )}
            </div>
          </Grid>

          <Grid item xs={12} md={sizeCon} lg={sizeCon}>
            <div className="relative bg-white">
              <div className="opacity-50 italic font-semibold my-1">
                Worksheet:
              </div>
              <div className="absolute inset-y-0 right-0 z-50 transform hover:scale-x-125">
                <Tooltip
                  title={
                    sizeCon === 12
                      ? "Perkecil ukuran Buku Pembantu"
                      : "Perbesar ukuran Buku Pembantu"
                  }
                  placement="top"
                >
                  {sizeCon === 12 ? (
                    <IconButton onClick={() => setSizeCon(6)} size="small">
                      <FullscreenExitIcon fontSize="inherit" />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => setSizeCon(12)} size="small">
                      <FullscreenIcon fontSize="inherit" />
                    </IconButton>
                  )}
                </Tooltip>
              </div>
              <BukuPembantuBiayaMhs14
                checking={checking}
                alokasi={alokasi}
                listPembantu={listPembantu}
                jawab={jawab}
                setJawab={(x) => setJawab(x)}
              />
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
        </Grid>
      </div>
      <br />
    </div>
  );
}
