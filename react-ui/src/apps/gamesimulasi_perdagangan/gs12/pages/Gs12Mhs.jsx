//#region
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import makeStyles from "@mui/styles/makeStyles";
import { useEffect, useState } from "react";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import ReactHtmlParser from "react-html-parser";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { Grid, CircularProgress } from "@mui/material";
import { DragDropContext } from "react-beautiful-dnd";
import TableAsetMhs12 from "../components/TableAsetMhs12";
import TableBungaMhs12 from "../components/TableBungaMhs12";
import TableBupemMhs12 from "../components/TableBupemMhs12";
import TableAkunMhs12 from "../components/TableAkunMhs12";
import TableWorksheetMhs12 from "../components/TableWorksheetMhs12";
import { find, filter } from "lodash";
import ShimmerMhsSoal12 from "../components/ShimmerMhsSoal12";
import ShimmerWorksheetMhs12 from "../components/ShimmerWorksheetMhs12";
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

export default function Gs12Mhs() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [update] = useState(0);
  const [load, setLoad] = useState(false);
  const [config, setConfig] = useState(null);
  const [jwbtgl, setJwbtgl] = useState(null);
  const [jwbdata, setJwbdata] = useState(null);

  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setLoad(true);
    const fetchData = () => {
      axios(`${API.HOST}/api/v2/gamesimulasi12/${id}/config`, {
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
            console.log(error.response.data.message);
            toast.error(error.response.data.message);
          }
        });
    };

    fetchData();
  }, [id, history, update]);

  const prepareData = (inn) => {
    //#1 JWB TGL
    setJwbtgl({
      tgl1: inn.tgl1,
      tgl2: inn.tgl2,
      tgl3: inn.tgl3,
      jwb_tgl1: "",
      jwb_tgl2: "",
      jwb_tgl3: "",
      err_tgl1: false,
      err_tgl2: false,
      err_tgl3: false,
    });
    //#2 Data
    const tmpdat = [];
    inn.dataakun.forEach((element, index) => {
      tmpdat.push({
        ...element,
        soal_noakun: element.noakun,
        soal_keterangan: element.keterangan,
        jwb_noakun: null,
        jwb_keterangan: null,
        jwb_jumlah: 0,
        err_noakun: false,
        err_keterangan: false,
        err_jumlah: false,
      });
    });

    setJwbdata(tmpdat);
    setConfig(inn);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (checking) {
      toast.error("Silahkan Klik reset untuk mengulang.");
      return;
    }
    if (!destination) return; //jika dopable tujuan tidak null
    // get id dest & source
    const arsource = source.droppableId.split("_");
    const ardest = destination.droppableId.split("_");
    const isrc = jwbdata.findIndex((x) => x.uid === arsource[2]);
    const idst = jwbdata.findIndex((x) => x.uid === ardest[2]);
    //cek drop bukan di tempat yang sama
    if (source.droppableId !== destination.droppableId) {
      //Larangan
      if (arsource[0] === "src" && arsource[0] === ardest[0]) return; //batal src <-> src
      if (arsource[0] === "dst" && ardest[0] === "src") return; //batal dst ->src
      //Allowed
      if (arsource[1] === ardest[1]) {
        //is switch ? (dst <-> dst)
        if (arsource[0] === ardest[0]) {
          //switch untuk beda baris
          const list = [...jwbdata];
          //update 1 switch
          const itmdst = {
            ...jwbdata[idst],
            ["jwb_" + ardest[1]]: jwbdata[isrc]["jwb_" + arsource[1]],
          };
          const itmsrc = {
            ...jwbdata[isrc],
            ["jwb_" + arsource[1]]: jwbdata[idst]["jwb_" + ardest[1]],
          };
          //update 1
          list.splice(idst, 1, itmdst);
          //update 2
          list.splice(isrc, 1, itmsrc);
          setJwbdata(list);
        } else {
          //next, crash ?
          if (jwbdata[idst]["jwb_" + ardest[1]] !== null) {
            toast.error("Pastikan drop di area yang kosong");
            return;
          } else {
            const list = [...jwbdata];
            // console.log("good place");
            //di jawaban benar n0t: fix issue for true uuid not saved in twice set
            if (ardest[2] === arsource[2]) {
              const itmdstt = {
                ...jwbdata[idst],
                ["soal_" + ardest[1]]: null,
                ["jwb_" + ardest[1]]: arsource[2],
              };
              list.splice(idst, 1, itmdstt);
              setJwbdata(list);
            } else {
              //update 1
              const itmdst = {
                ...jwbdata[idst],
                ["jwb_" + ardest[1]]: arsource[2],
              };
              list.splice(idst, 1, itmdst);
              //update 2
              const itmsrc = {
                ...jwbdata[isrc],
                ["soal_" + ardest[1]]: null,
              };
              list.splice(isrc, 1, itmsrc);
              setJwbdata(list);
            }
          }
        }
      } else {
        toast.error("Pastikan drop di area yang sesuai");
      }
    }
  };

  const hitungNilai = (item) => {
    switch (item.gen) {
      case "bangunan":
        const bhn1 = find(config.databahan, { uid: item.uidbahan });
        const h =
          (Number(bhn1.perolehan) - Number(bhn1.nilaisisa)) /
          Number(bhn1.durasi) /
          12;
        return h;
      case "peralatan":
        const bhn2 = find(config.databahan, { uid: item.uidbahan });
        const h2 =
          (Number(bhn2.perolehan) - Number(bhn2.nilaisisa)) /
          Number(bhn2.durasi) /
          12;
        return h2;
      case "bunga":
        const bhn3 = find(config.databahan, { uid: item.uidbahan });
        const h3 =
          ((Number(bhn3.jumlah) / Number(bhn3.durasi)) *
            (Number(bhn3.bungath) / 100)) /
          12;
        return h3;
      case "piutang":
        // console.log("piutang", item.posisi);
        const countDebit = [];
        const databupem = filter(config.databahan, {
          type: "bupem",
        });
        databupem.forEach((element, index) => {
          if (index === 0) {
            //start
            countDebit.push(element.jumlah);
          } else {
            //
            const x = Number(element.debet) - Number(element.kredit);
            countDebit.push(Number(countDebit[index - 1] + x));
          }
        });

        const hpiut =
          (Number(config.persentase) / 100) * countDebit[countDebit.length - 1];
        return hpiut;
      default:
        return 0;
    }
  };

  const checkjwb = () => {
    setChecking(true);
    const result = [];
    //#region TGL CHECK
    if (jwbtgl.jwb_tgl1.toLowerCase() === jwbtgl.tgl1.toLowerCase()) {
      result.push(true);
    } else {
      jwbtgl.err_tgl1 = true;
      result.push(false);
    }
    if (jwbtgl.jwb_tgl2.toLowerCase() === jwbtgl.tgl2.toLowerCase()) {
      result.push(true);
    } else {
      jwbtgl.err_tgl2 = true;
      result.push(false);
    }
    if (jwbtgl.jwb_tgl3.toLowerCase() === jwbtgl.tgl3.toLowerCase()) {
      result.push(true);
    } else {
      jwbtgl.err_tgl3 = true;
      result.push(false);
    }
    //#endregion
    setJwbtgl(jwbtgl);
    //DATA Jwab
    jwbdata.forEach((el, index) => {
      const iakun = find(config.dataakun, { uid: el.jwb_noakun });
      if (iakun && iakun.base === el.base && iakun.posisi === el.posisi) {
        //Lanjut Keterangan & Jumlah
        if (el.jwb_noakun === el.jwb_keterangan) {
          result.push(true);
        } else {
          jwbdata[index].err_keterangan = true;
          result.push(false);
        }
        //cek Jumlah
        const jumbenar = hitungNilai(el);
        if (Number(el.jwb_jumlah) === Number(jumbenar)) {
          result.push(true);
        } else {
          jwbdata[index].err_jumlah = true;
          result.push(false);
        }
      } else {
        jwbdata[index].err_noakun = true;
        jwbdata[index].err_keterangan = true;
        jwbdata[index].err_jumlah = true;
        result.push(false);
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
        <title>Game Simulasi 12 Perdagangan</title>
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2} className="pl-4" direction="row">
          <Grid item xs={12} md={12} lg={12} className="border pb-3 bg-white">
            <div className="mt-0 mb-3 opacity-50 italic font-semibold my-1">
              Data (Soal):
            </div>
            {config ? (
              <>
                <TableAsetMhs12 dataConfig={config} />
                <TableBungaMhs12 dataConfig={config} />
                <TableBupemMhs12 dataConfig={config} />
                <TableAkunMhs12
                  jwbdata={jwbdata}
                  setJwbdata={(x) => setJwbdata(x)}
                />
              </>
            ) : (
              <ShimmerMhsSoal12 />
            )}
          </Grid>
          <Grid item xs={12} md={12} lg={12} className="border bg-white pt-2">
            <div className="mt-0 mb-2 opacity-50 italic font-semibold my-1">
              Worksheet (Lembar Kerja):
            </div>
            {config ? (
              <>
                <TableWorksheetMhs12
                  dataConfig={config}
                  jwbtgl={jwbtgl}
                  setJwbtgl={(x) => setJwbtgl(x)}
                  jwbdata={jwbdata}
                  setJwbdata={(x) => setJwbdata(x)}
                  checking={checking}
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
              <ShimmerWorksheetMhs12 />
            )}
          </Grid>
        </Grid>
      </DragDropContext>
    </div>
  );
}
