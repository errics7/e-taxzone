//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";
import ReactHtmlParser from "react-html-parser";
import toast from "react-hot-toast";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { v4 as uuidv4 } from "uuid";
import { customAlphabet } from "nanoid";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import TabelSoalMhs from "../components/TabelSoalMhs";
import TabelWorksheetMhs from "../components/TabelWorksheetMhs";
import { DragDropContext } from "react-beautiful-dnd";
import { find } from "lodash";
import ShimmerMhsgs1 from "../components/ShimmerMhsgs1";
import ShimmerWorksheetMhsgs1 from "../components/ShimmerWorksheetMhsgs1";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  btnback: {
    backgroundColor: "#7C7C7C",
    textTransform: "none",
    marginLeft: "0px",
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

export default function Gs1Mhs(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  const [dataConfig, setDataConfig] = useState(null);
  const [jawab, setJawab] = useState(null);
  // #region data dumm

  // #endregion data dumm
  const [checking, setChecking] = useState(false);
  const [alldone, setAlldone] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/gamesimulasi1/${id}/config`, {
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
          const nanoid = customAlphabet(alphabet, 6);
          // Prepare
          const tmp = [];
          res.data.databuku.forEach((el, i) => {
            tmp.push({
              ...el,
              uuid: nanoid(),
              soal_name: el.name,
              soal_tgl: el.tgl,
              soal_jumlah: el.jumlah,
              jwb_name: null,
              jwb_tgl: null,
              jwb_jumlah_kredit: null,
              jwb_jumlah_debit: null,
              err_name: false,
              err_tgl: false,
              err_jumlah: false,
            });
          });

          setJawab(tmp);
          setDataConfig(res.data);
        })
        .catch((error) => {
          setLoad(false);

          if (error.response.status === 401) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 400) {
            console.log(error.response.data.message);
            toast.error(
              "Terjadi Keslahan server, Silahkan refresh halaman kembali."
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
    const result = [];

    jawab.forEach((item, i) => {
      //#1 check utama JENIS
      const keyid = find(jawab, { uuid: item.jwb_name });
      if (keyid && item["jenis"] === keyid.jenis) {
        /// its for allowed not sequence
        //#2 check
        if (item.jwb_name === keyid.uuid) {
          result.push(true);
        } else {
          result.push(false);
          jawab[i].err_name = true;
        }
        // if (item.jwb_tgl === keyid.uuid) {
        //   result.push(true);
        // } else {
        //   result.push(false);
        //   jawab[i].err_tgl = true;
        // }
        //#3 check  deb/kred
        if (item.posisi === "debit") {
          //
          if (item.jwb_jumlah_debit === keyid.uuid) {
            result.push(true);
          } else {
            result.push(false);
            jawab[i].err_jumlah = true;
          }
        }
        if (item.posisi === "kredit") {
          //
          if (item.jwb_jumlah_kredit === keyid.uuid) {
            result.push(true);
          } else {
            result.push(false);
            jawab[i].err_jumlah = true;
          }
        }
      } else {
        result.push(false);
        jawab[i].err_name = true;
        // jawab[i].err_tgl = true;
        jawab[i].err_jumlah = true;
      }
    });

    setJawab(jawab);
    setChecking(true);

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

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return; //jika dopable tujuan tidak null
    // get id dest & source
    const idsource = source.droppableId.split("_");
    const iddest = destination.droppableId.split("_");
    const isrc = jawab.findIndex((x) => x.uuid === idsource[2]);
    const idst = jawab.findIndex((x) => x.uuid === iddest[2]);

    //cek drop bukan di tempat yang sama
    if (source.droppableId !== destination.droppableId) {
      //Larangan
      if (idsource[0] === "src" && idsource[0] === iddest[0]) return; //batal src <-> src
      if (idsource[0] === "dst" && iddest[0] === "src") return; //batal dst ->src
      //Allowed
      if (idsource[1] === iddest[1]) {
        //is switch ?
        if (idsource[0] === iddest[0]) {
          //Khusus Jumlah
          if (iddest[1] === "jumlah") {
            if (iddest[2] === idsource[2]) {
              //switch untuk Jumlah baris sama (debit<->kredit)
              const itmdstt = {
                ...jawab[idst],
                ["jwb_" + iddest[1] + "_" + iddest[3]]:
                  jawab[idst]["jwb_" + iddest[1] + "_" + idsource[3]],
                ["jwb_" + iddest[1] + "_" + idsource[3]]:
                  jawab[idst]["jwb_" + iddest[1] + "_" + iddest[3]],
              };
              const dstup = jawab.map((u) =>
                u.uuid !== iddest[2] ? u : itmdstt
              );
              setJawab(dstup);
            } else {
              //switch untuk Jumlah BEDA baris (debit<->kredit)
              //kondisi harus blank 2(deb/kre) or crash
              if (
                (!jawab[idst].jwb_jumlah_kredit &&
                  !jawab[idst].jwb_jumlah_debit) ||
                jawab[idst]["jwb_jumlah_" + iddest[3]]
              ) {
                //update 1 switch
                const itmdst = {
                  ...jawab[idst],
                  ["jwb_jumlah_" + iddest[3]]:
                    jawab[isrc]["jwb_jumlah_" + idsource[3]],
                };
                const itmsrc = {
                  ...jawab[isrc],
                  ["jwb_jumlah_" + idsource[3]]:
                    jawab[idst]["jwb_jumlah_" + iddest[3]],
                };
                const dstup = await jawab.map((u) =>
                  u.uuid !== iddest[2] ? u : itmdst
                );
                //update 2
                const finalup = await dstup.map((u) =>
                  u.uuid !== idsource[2] ? u : itmsrc
                );
                setJawab(finalup);
              } else {
                toast.error("Switch Area terpilih sudah terisi");
                return;
              }
            }
          } else {
            //update 1 ,switch
            const itmdst = {
              ...jawab[idst],
              ["jwb_" + iddest[1]]: jawab[isrc]["jwb_" + idsource[1]],
            };
            const itmsrc = {
              ...jawab[isrc],
              ["jwb_" + idsource[1]]: jawab[idst]["jwb_" + iddest[1]],
            };
            const dstup = await jawab.map((u) =>
              u.uuid !== iddest[2] ? u : itmdst
            );
            //update 2
            const finalup = await dstup.map((u) =>
              u.uuid !== idsource[2] ? u : itmsrc
            );
            setJawab(finalup);
          }
        } else {
          //is migrasi
          //next, crash ?
          if (
            jawab[idst][
              iddest[1] === "jumlah"
                ? "jwb_" + iddest[1] + "_" + iddest[3]
                : "jwb_" + iddest[1]
            ] !== null
          ) {
            // console.log("is crash");
            toast.error("Pastikan drop di area yang kosong");
            return;
          } else {
            // console.log("good place");
            //check "good place" is not existed jumlah
            if (
              iddest[1] === "jumlah" &&
              (jawab[idst].jwb_jumlah_kredit || jawab[idst].jwb_jumlah_debit)
            ) {
              toast.error("Area sudah terisi");
              return;
            }

            if (iddest[2] === jawab[isrc].uuid) {
              //di jawaban benar n0t: fix issue for true uuid not saved in twice set
              const itmdstt = {
                ...jawab[idst],
                ["soal_" + iddest[1]]: null,
                [iddest[1] === "jumlah"
                  ? "jwb_" + iddest[1] + "_" + iddest[3]
                  : "jwb_" + iddest[1]]: idsource[2],
              };
              const dstup = await jawab.map((u) =>
                u.uuid !== iddest[2] ? u : itmdstt
              );
              setJawab(dstup);
            } else {
              //update 1
              const itmdst = {
                ...jawab[idst],
                [iddest[1] === "jumlah"
                  ? "jwb_" + iddest[1] + "_" + iddest[3]
                  : "jwb_" + iddest[1]]: idsource[2],
              };
              const dstup = await jawab.map((u) =>
                u.uuid !== iddest[2] ? u : itmdst
              );
              //update 2
              const itmsrc = {
                ...jawab[isrc],
                ["soal_" + iddest[1]]: null,
              };
              const finalup = await dstup.map((u) =>
                u.uuid !== idsource[2] ? u : itmsrc
              );
              setJawab(finalup);
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
        <title>Game Simulasi 1 Perdagangan</title>
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
      <div className="relative">
        {load && <LoadingWait />}
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={2} direction="row" alignItems="stretch">
            <Grid item xs={12} md={12} lg={12}>
              <div className="bg-white">
                <div className="mt-5 mb-3 opacity-50 italic font-semibold my-1">
                  Data (soal):
                </div>
                {/* Code Here  or  whatever*/}
                {dataConfig ? (
                  <TabelSoalMhs
                    narasi={dataConfig ? dataConfig.narasi_adt1 : ""}
                    data={dataConfig ? dataConfig.databuku : []}
                    jawab={jawab}
                  />
                ) : (
                  <ShimmerMhsgs1 />
                )}
              </div>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <div className="border border-dashed bg-white">
                <div className="mt-1 ml-1 opacity-50 italic font-semibold ">
                  Worksheet (Lembar Kerja):
                </div>
                {dataConfig ? (
                  <>
                    <TabelWorksheetMhs
                      jawab={jawab}
                      checking={checking}
                      cv={dataConfig ? dataConfig.narasi_adt2 : []}
                      data={dataConfig ? dataConfig.databuku : []}
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
                  </>
                ) : (
                  <ShimmerWorksheetMhsgs1 />
                )}
              </div>
            </Grid>
          </Grid>
        </DragDropContext>
      </div>
      <br />
    </div>
  );
}
