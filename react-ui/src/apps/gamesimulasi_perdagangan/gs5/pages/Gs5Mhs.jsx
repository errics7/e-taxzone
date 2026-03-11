//#region
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import makeStyles from "@mui/styles/makeStyles";
import { useEffect, useState } from "react";
//import { AuthContext } from "../../../../AppRoute";
import { customAlphabet } from "nanoid";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import ReactHtmlParser from "react-html-parser";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { DragDropContext } from "react-beautiful-dnd";
import { Grid, CircularProgress } from "@mui/material";
import { find } from "lodash";
import TableWorksheetMhs5 from "../components/TableWorksheetMhs5";
import TableWorksheetRekapMhs5 from "../components/TableWorksheetRekapMhs5";
import TableHppMhs5 from "../components/TableHppMhs5";
import ShimmerSoalMhs5 from "../components/ShimmerSoalMhs5";
import ShimmerWorksheetMhs5 from "../components/ShimmerWorksheetMhs5";
import InvoiceListTable5Mhs from "../components/InvoiceListTable5Mhs";
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

export default function Gs5Mhs() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  // const { dispatch } = useContext(AuthContext);
  const [update, setUpdate] = useState(0);
  const [load, setLoad] = useState(false);
  const [config, setConfig] = useState(null);
  const [jawab1, setJawab1] = useState(null);
  const [jawab2, setJawab2] = useState(null);
  //
  const [done1, setDone1] = useState(false); //true to skip step 1
  const [done2, setDone2] = useState(false);
  const [checking1, setChecking1] = useState(false);
  const [checking2, setChecking2] = useState(false);

  useEffect(() => {
    setLoad(true);
    const fetchData = () => {
      axios(`${API.HOST}/api/v2/gamesimulasi5/${id}/config`, {
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
          prepareData2(res.data.dataakun);
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
    // console.log(inn);
    const jwb1 = inn.datanota.map((item, index) => ({
      ...item,

      soal_kas: item.type === "kontan" ? item.jumlah : item.nilaia,
      soal_hpp: item.type === "kontan" ? item.hpp : 0,
      soal_penjualan: item.type === "kontan" ? item.subtotal : 0,
      soal_ppn: item.type === "kontan" ? item.ppn : 0,
      soal_piutangdagang: item.type === "kontan" ? 0 : item.nilaia,
      soal_persediaan: item.type === "kontan" ? item.persediaan : 0,

      jwb_kas: "",
      jwb_hpp: "",
      jwb_penjualan: "",
      jwb_ppn: "",
      jwb_piutangdagang: "",
      jwb_persediaan: "",

      err_kas: false,
      err_hpp: false,
      err_penjualan: false,
      err_ppn: false,
      err_piutangdagang: false,
      err_persediaan: false,
    }));
    setJawab1(jwb1);
    setConfig(inn);
  };

  const prepareData2 = (dataakun) => {
    const nanoid = customAlphabet(alphabet, 6);
    const tmp2 = dataakun.map((item, index) => ({
      ...item,
      uuid: nanoid(),
      soal_noakun: item.noakun,
      soal_jumlah: item.jumlah,
      jwb_noakun_debit: null,
      jwb_noakun_kredit: null,
      jwb_jumlah_debit: null,
      jwb_jumlah_kredit: null,
      err_noakun_debit: false,
      err_noakun_kredit: false,
      err_jumlah_debit: false,
      err_jumlah_kredit: false,
    }));
    setJawab2(tmp2);
  };

  // CHeck 1 Step
  const check1 = () => {
    setChecking1(true);
    const result = [];

    jawab1.forEach((element, index) => {
      //Start
      if (element.type === "kontan") {
        // #1 KAS
        if (Number(element.soal_kas) === Number(element.jwb_kas)) {
          result.push(true);
        } else {
          jawab1[index].err_kas = true;
          result.push(false);
        }
        // #2 HPP
        if (Number(element.soal_hpp) === Number(element.jwb_hpp)) {
          result.push(true);
        } else {
          jawab1[index].err_hpp = true;
          result.push(false);
        }
        // #3 Penjualan
        if (Number(element.soal_penjualan) === Number(element.jwb_penjualan)) {
          result.push(true);
        } else {
          jawab1[index].err_penjualan = true;
          result.push(false);
        }
        // #4 PPN Keluaran
        if (Number(element.soal_ppn) === Number(element.jwb_ppn)) {
          result.push(true);
        } else {
          jawab1[index].err_ppn = true;
          result.push(false);
        }
        // #5 piutang dagang
        // SKIP
        // #6 Persediaan
        if (
          Number(element.soal_persediaan) === Number(element.jwb_persediaan)
        ) {
          result.push(true);
        } else {
          jawab1[index].err_persediaan = true;
          result.push(false);
        }
      } else {
        // #1 KAS
        if (Number(element.soal_kas) === Number(element.jwb_kas)) {
          result.push(true);
        } else {
          jawab1[index].err_kas = true;
          result.push(false);
        }
        // #2 Piutang Dagang
        if (
          Number(element.soal_piutangdagang) ===
          Number(element.jwb_piutangdagang)
        ) {
          result.push(true);
        } else {
          jawab1[index].err_piutangdagang = true;
          result.push(false);
        }
      }
      //end
    });
    // console.log("r", result);
    // console.log("j", jawab1);
    setJawab1(jawab1);
    if (result.every((x) => x === true)) {
      setDone1(true);
      toast.success(`Yay Benar, Lanjut ke step berikutnya.`, {
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
  // CHeck 2 Step
  const check2 = () => {
    const chk = [];
    //Filter CHECK ALREADY DRAG
    jawab2.forEach((element) => {
      if (element.soal_jumlah) chk.push(false);
      else chk.push(true);
      if (element.soal_noakun) chk.push(false);
      else chk.push(true);
    });
    // console.log(chk.every((x) => x === true));
    if (!chk.every((x) => x === true)) {
      toast.error(
        `Selesaikan Drag & drop data ke Rekapitulasi terlebih dahulu sebelum Check`,
        {
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
        }
      );
      return;
    }
    //Filter oke LANJUT

    setChecking2(true);
    const result = [];
    jawab2.forEach((element, index) => {
      //except Jumlah ada & noakun kosong
      if (element.jwb_jumlah_debit && !element.jwb_noakun_debit) {
        jawab2[index].err_noakun_debit = true;
        jawab2[index].err_jumlah_debit = true;
        result.push(false);
      }
      //except Jumlah ada & noakun kosong
      if (element.jwb_jumlah_kredit && !element.jwb_noakun_kredit) {
        jawab2[index].err_noakun_kredit = true;
        jawab2[index].err_jumlah_kredit = true;
        result.push(false);
      }
      //check
      if (element.jwb_noakun_debit || element.jwb_noakun_kredit) {
        // Debit Dulu
        if (!element.jwb_noakun_debit && !element.jwb_jumlah_debit) {
          // nomatter jika tidak di isi samasekali
        } else {
          const dataTruDeb = find(jawab2, { uuid: element.jwb_noakun_debit });
          // console.log("pd " + index, dataTruDeb);
          if (dataTruDeb && dataTruDeb.posisi.toLowerCase() === "debit") {
            //posisi benar
            if (dataTruDeb.uuid === element.jwb_jumlah_debit) {
              result.push(true);
            } else {
              result.push(false);
              jawab2[index].err_jumlah_debit = true;
            }
          } else {
            result.push(false);
            jawab2[index].err_noakun_debit = true;
          }
        }
        // NEXT
        // Kredit
        if (!element.jwb_noakun_kredit && !element.jwb_jumlah_kredit) {
          // nomatter jika tidak di isi samasekali
        } else {
          const dataTruKred = find(jawab2, { uuid: element.jwb_noakun_kredit });
          // console.log("pk " + index, dataTruKred);
          if (dataTruKred && dataTruKred.posisi.toLowerCase() === "kredit") {
            //posisi benar
            if (dataTruKred.uuid === element.jwb_jumlah_kredit) {
              result.push(true);
            } else {
              result.push(false);
              jawab2[index].err_jumlah_kredit = true;
            }
          } else {
            result.push(false);
            jawab2[index].err_noakun_kredit = true;
          }
        }
      }
    });
    setJawab2(jawab2);
    // console.log(jawab2);

    if (result.every((x) => x === true)) {
      setDone2(true);
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
          duration: 5000,
        },
      });
    }
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (checking2) {
      toast.error("Silahkan Klik reset untuk mengulang.");
      return;
    }
    if (!destination) return; //jika dopable tujuan tidak null
    // get id dest & source
    const arsource = source.droppableId.split("_");
    const ardest = destination.droppableId.split("_");
    const isrc = jawab2.findIndex((x) => x.uuid === arsource[3]);
    const idst = jawab2.findIndex((x) => x.uuid === ardest[3]);

    //cek drop bukan di tempat yang sama
    if (source.droppableId !== destination.droppableId) {
      //Larangan
      if (arsource[0] === "src" && arsource[0] === ardest[0]) return; //batal src <-> src
      if (arsource[0] === "dst" && ardest[0] === "src") return; //batal dst ->src
      //Allowed
      if (arsource[1] === ardest[1]) {
        //is switch ? (dst <-> dst)
        if (arsource[0] === ardest[0]) {
          // switch baris sama
          if (ardest[3] === arsource[3]) {
            // console.log("switch sama baris");
            //switch untuk Jumlah baris sama (debit<->kredit)
            const itmdstt = {
              ...jawab2[idst],
              ["jwb_" + ardest[1] + "_" + ardest[2]]:
                jawab2[idst]["jwb_" + ardest[1] + "_" + arsource[2]],
              ["jwb_" + ardest[1] + "_" + arsource[2]]:
                jawab2[idst]["jwb_" + ardest[1] + "_" + ardest[2]],
            };
            const dstup = jawab2.map((u) =>
              u.uuid !== ardest[3] ? u : itmdstt
            );
            setJawab2(dstup);
          } else {
            //switch untuk beda baris
            //update 1 switch
            const itmdst = {
              ...jawab2[idst],
              ["jwb_" + ardest[1] + "_" + ardest[2]]:
                jawab2[isrc]["jwb_" + arsource[1] + "_" + arsource[2]],
            };
            const itmsrc = {
              ...jawab2[isrc],
              ["jwb_" + arsource[1] + "_" + arsource[2]]:
                jawab2[idst]["jwb_" + ardest[1] + "_" + ardest[2]],
            };
            const dstup = jawab2.map((u) =>
              u.uuid !== ardest[3] ? u : itmdst
            );
            //update 2 switch
            const finalup = dstup.map((u) =>
              u.uuid !== arsource[3] ? u : itmsrc
            );
            setJawab2(finalup);
          }
        } else {
          //next, crash ?
          if (jawab2[idst]["jwb_" + ardest[1] + "_" + ardest[2]] !== null) {
            // console.log("is crash");
            toast.error("Pastikan drop di area yang kosong");
            return;
          } else {
            // console.log("good place");
            //di jawaban benar n0t: fix issue for true uuid not saved in twice set
            if (ardest[3] === arsource[3]) {
              const itmdstt = {
                ...jawab2[idst],
                ["soal_" + ardest[1]]: null,
                ["jwb_" + ardest[1] + "_" + ardest[2]]: arsource[3],
              };
              const dstup = jawab2.map((u) =>
                u.uuid !== ardest[3] ? u : itmdstt
              );
              setJawab2(dstup);
            } else {
              //update 1
              const itmdst = {
                ...jawab2[idst],
                ["jwb_" + ardest[1] + "_" + ardest[2]]: arsource[3],
              };
              const dstup = jawab2.map((u) =>
                u.uuid !== ardest[3] ? u : itmdst
              );
              //update 2
              const itmsrc = {
                ...jawab2[isrc],
                ["soal_" + ardest[1]]: null,
              };
              const finalup = dstup.map((u) =>
                u.uuid !== arsource[3] ? u : itmsrc
              );
              setJawab2(finalup);
            }
          }
        }
      } else {
        toast.error("Pastikan drop di area yang sesuai");
      }
    }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 5 Perdagangan</title>
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
        <Grid container spacing={2} direction="row" alignItems="stretch">
          <Grid item xs={12} md={12} lg={12}>
            <div className="bg-white">
              <div className="mt-5 mb-3 opacity-50 italic font-semibold my-1">
                Worksheet (Lembar Kerja):
              </div>
              {config ? (
                <>
                  <TableWorksheetMhs5
                    config={config}
                    jawab1={jawab1}
                    setJawab1={(x) => setJawab1(x)}
                    jawab2={jawab2}
                    done1={done1}
                    checking1={checking1}
                  />
                  <div
                    className={`flex flex-row-reverse py-1 mt-5 w-full  bg-gradient-to-l from-slate-100`}
                  >
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
                        //
                        setChecking2(false);
                        setDone2(false);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </>
              ) : (
                <ShimmerWorksheetMhs5 />
              )}
            </div>
          </Grid>
          {done1 && (
            <Grid item xs={12} md={12} lg={12}>
              <div className="bg-white">
                <TableWorksheetRekapMhs5
                  config={config}
                  checking={checking2}
                  jawab={jawab1}
                  setJawab={(x) => setJawab1(x)}
                  jawab2={jawab2}
                  setJawab2={(x) => setJawab2(x)}
                />
                <div
                  className={`flex flex-row-reverse py-1 mt-3 w-full  bg-gradient-to-l from-slate-100`}
                >
                  {done2 ? (
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
                      setChecking2(false);
                      setDone2(false);
                      prepareData2(config.dataakun);
                      // setUpdate(update + 1);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Grid>
          )}
          <Grid item xs={12} md={12} lg={12} className="border">
            <div className="bg-white">
              <div className="mt-2 mb-3 opacity-50 italic font-semibold my-1">
                Data (Soal):
              </div>
              {config ? (
                <>
                  <TableHppMhs5 dataConfig={config} />
                  <InvoiceListTable5Mhs dataConfig={config} />
                </>
              ) : (
                <ShimmerSoalMhs5 />
              )}
            </div>
          </Grid>
        </Grid>
      </DragDropContext>
    </div>
  );
}
