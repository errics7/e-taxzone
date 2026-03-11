//#region
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Button from "@mui/material/Button";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import API from "../../../../utils/host.config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactHtmlParser from "react-html-parser";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import toast from "react-hot-toast";
import makeStyles from "@mui/styles/makeStyles";
import { Grid } from "@mui/material";
import TableWorksheetMhs from "../component/TableWorksheetMhs";
import ShimmerWorksheetMhs3 from "../component/ShimmerWorksheetMhs3";
import ShimmerSoalMhs3 from "../component/ShimmerSoalMhs3";
import { find, findIndex } from "lodash";
import { customAlphabet } from "nanoid";

import TableWorksheetRekapMhs from "../component/TableWorksheetRekapMhs";
import { DragDropContext } from "react-beautiful-dnd";
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

export default function Gs3Mhs() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  // const { dispatch } = useContext(AuthContext);
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  const [jawab1, setJawab1] = useState(null);
  const [jawab2, setJawab2] = useState(null);
  const [config, setConfig] = useState(null);

  const [done1, setDone1] = useState(false);
  const [done2, setDone2] = useState(false);
  const [checking1, setChecking1] = useState(false);
  const [checking2, setChecking2] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      axios(`${API.HOST}/api/v2/gamesimulasi3/${id}/config`, {
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

          const api = res.data;
          prepareData1(api);
          prepareData2(api.dataakun);
          setConfig(api);
        })
        .catch((error) => {
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
  }, [id, history]);

  const prepareData1 = (api) => {
    //
    const tmp1 = api.datainvoice.map((item, index) => ({
      ...item,
      key_faktur: false,
      jwb_tgl: "",
      jwb_nama: "",
      jwb_faktur: "",
      jwb_persediaan: 0,
      jwb_ppn: 0,
      jwb_hutangdag: 0,
      err_tgl: false,
      err_nama: false,
      err_faktur: false,
      err_persediaan: false,
      err_ppn: false,
      err_hutangdag: false,
    }));

    setJawab1(tmp1);
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
  const check1 = () => {
    setChecking1(true);
    const result = [];

    jawab1.forEach((element, index) => {
      const idx = findIndex(
        jawab1,
        (x) =>
          x.noinvoice.trim().toLowerCase() ===
          element.jwb_faktur.trim().toLowerCase()
      );
      if (idx > -1 && !jawab1[idx].key_faktur) {
        jawab1[idx].key_faktur = true;
        //start Verif Btc1
        // #1 Tanggal
        if (
          jawab1[idx].tanggal.toLowerCase() === element.jwb_tgl.toLowerCase()
        ) {
          result.push(true);
        } else {
          jawab1[index].err_tgl = true;
          result.push(false);
        }
        // #2 nama
        if (
          jawab1[idx].vendorname.trim().toLowerCase() ===
          element.jwb_nama.trim().toLowerCase()
        ) {
          result.push(true);
        } else {
          jawab1[index].err_nama = true;
          result.push(false);
        }
        // #3 faktur
        if (
          jawab1[idx].noinvoice.trim().toLowerCase() ===
          element.jwb_faktur.trim().toLowerCase()
        ) {
          result.push(true);
        } else {
          jawab1[index].err_faktur = true;
          result.push(false);
        }
        // #4 persediaan
        if (Number(jawab1[idx].subtotal) === Number(element.jwb_persediaan)) {
          result.push(true);
        } else {
          jawab1[index].err_persediaan = true;
          result.push(false);
        }
        // #5 PPN
        if (Number(jawab1[idx].ppn) === Number(element.jwb_ppn)) {
          result.push(true);
        } else {
          jawab1[index].err_ppn = true;
          result.push(false);
        }
        // #6 Hutang Dagang
        if (Number(jawab1[idx].jumlah) === Number(element.jwb_hutangdag)) {
          result.push(true);
        } else {
          jawab1[index].err_hutangdag = true;
          result.push(false);
        }
        //
        //end
      } else {
        result.push(false);
        // jawab1[index].err_tgl = true;
        // jawab1[index].err_nama = true;
        jawab1[index].err_faktur = true;
        // jawab1[index].err_persediaan = true;
        // jawab1[index].err_ppn = true;
        // jawab1[index].err_hutangdag = true;
      }
    });
    // console.log(idx);
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
  const check2 = () => {
    const chk = [];
    //Filter CHECK ALREADY DRAG
    jawab2.forEach((element) => {
      if (!element.soal_jumlah) chk.push(true);
      else chk.push(false);
      if (!element.soal_noakun) chk.push(true);
      else chk.push(false);
    });

    if (!chk.every((x) => x === true)) {
      toast.error(
        `Silahkan Drag & drop data ke Rekapitulasi terlebih dahulu sebelum Check`,
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
      //
      if (element.jwb_jumlah_debit && !element.jwb_noakun_debit) {
        jawab2[index].err_noakun_debit = true;
        jawab2[index].err_jumlah_debit = true;
        result.push(false);
      }
      if (element.jwb_jumlah_kredit && !element.jwb_noakun_kredit) {
        jawab2[index].err_noakun_kredit = true;
        jawab2[index].err_jumlah_kredit = true;
        result.push(false);
      }
      if (element.jwb_noakun_debit || element.jwb_noakun_kredit) {
        // Debit Dulu
        if (!element.jwb_noakun_debit && !element.jwb_jumlah_debit) {
          // nomatter
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
          // nomatter
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

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 3 Perdagangan</title>
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={2} direction="row" alignItems="stretch">
            <Grid item xs={12} md={12} lg={12}>
              <div className="bg-white py-2">
                <div className="mt-2 mb-3 opacity-50 italic font-semibold my-1">
                  Worksheet (Lembar Kerja):
                </div>
                {jawab1 ? (
                  <>
                    <TableWorksheetMhs
                      config={config}
                      checking1={checking1}
                      jawab={jawab1}
                      setJawab={(x) => setJawab1(x)}
                      done1={done1}
                      jawab2={jawab2}
                      setJawab2={(x) => setJawab2(x)}
                    />
                    <div
                      className={`flex flex-row-reverse my-5 py-1 w-full  bg-gradient-to-l from-slate-100`}
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
                        onClick={() => {
                          prepareData1(config);
                          prepareData2(config.dataakun);
                          setChecking1(false);
                          setDone1(false);
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
                  <ShimmerWorksheetMhs3 />
                )}

                {done1 && (
                  <TableWorksheetRekapMhs
                    config={config}
                    checking={checking2}
                    jawab={jawab1}
                    setJawab={(x) => setJawab1(x)}
                    jawab2={jawab2}
                    setJawab2={(x) => setJawab2(x)}
                  />
                )}
                {done1 && (
                  <div
                    className={`flex flex-row-reverse my-2 py-1 w-full  bg-gradient-to-l from-slate-100`}
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
                      onClick={() => {
                        setChecking2(false);
                        setDone2(false);
                        prepareData2(config.dataakun);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <div className="bg-white pt-3">
                <div className="mt-0 mb-3 opacity-50 italic font-semibold my-1">
                  Data (Soal):
                </div>
                {config ? (
                  config.datainvoice.map((invo, idx) => {
                    const dataBarang = config.databarang.filter(
                      (x) => x.id_invoice === invo.uid
                    );

                    return (
                      <div
                        key={idx}
                        className="w-full border-2 border-dashed mb-4"
                      >
                        <div className="flex justify-between px-4 pt-4">
                          {/* <h1 className='text-2xl font-medium'>PT Papier</h1> */}
                          <p className="font-semibold text-xl">
                            {invo.vendorname}
                          </p>
                          <h1 className="text-2xl font-medium">INVOICE</h1>
                        </div>
                        <div className="flex justify-between px-4">
                          <p>{invo.vendoralamat}</p>
                          {/* <p>Jl. Jakarta No.10 Gresik, Jawa timur</p> */}
                          <div>
                            <label>No : </label>
                            <span
                              index={idx}
                              className={`text-base font-medium`}
                            >
                              {invo.noinvoice}
                            </span>
                            {/* <p>No : J-660</p> */}
                          </div>
                        </div>

                        <div className="border-t-2 px-4 py-2 my-2">
                          <h2 className="font-medium text-lg">Customer</h2>
                          <div className="grid grid-cols-6">
                            <div className="col-start-1 col-end-6 text-base">
                              <div className="flex flex-col mt-3 space-y-2">
                                <div className="flex">
                                  <label className="mr-2">Nama : </label>
                                  <span>{invo.buyername}</span>
                                </div>
                                <div className="flex">
                                  <label className="mr-2">Alamat : </label>
                                  <span>{invo.buyeralamat}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-end-10">
                              <div className="flex flex-col mt-3 space-y-2">
                                <div className="flex">
                                  <label className="mr-2">Tanggal : </label>
                                  <span>{invo.tanggal}</span>
                                </div>
                                <div className="flex">
                                  <label className="mr-2">No Order : </label>
                                  <span>{invo.noorder}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center px-2 border-t-2">
                          <table className="w-full border  text-center mx-2 my-6">
                            <thead className="border-b">
                              <tr>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                                >
                                  Nama Barang
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                                >
                                  Satuan
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                                >
                                  Jumlah
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                                >
                                  Harga (Rp)
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-slate-900 px-6 py-4"
                                >
                                  Total (Rp)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {dataBarang.map((item, index) => {
                                // hitungSubtotal(item.total)
                                return (
                                  <tr key={index} className="border-b">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                                      <p>{item.namabarang}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                                      <p>{item.satuan}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                                      <p>{item.jumlah}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                                      <p>{item.harga}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                                      {toRp(item.total)}
                                      {/* <TextField
                                        placeholder='Total'
                                        value={item.total}
                                        name='total'
                                        onChange={(event) => handleInputChange(event, item.idBarang)}
                                        fullWidth
                                        InputProps={{
                                            disableUnderline: true,
                                            inputComponent: NumberFormatCustom,
                                        }}
                                        inputProps={{
                                            prefix: 'Rp ',
                                            style: {
                                                textAlign: "center",
                                                fontSize: 15,
                                            },
                                        }}
                                    />
                                    <EditIcon
                                        fontSize="inherit"
                                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-10"
                                    /> */}
                                    </td>
                                  </tr>
                                );
                              })}

                              <tr className="border-b">
                                <td
                                  colSpan={4}
                                  className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                                >
                                  Subtotal
                                </td>
                                <td
                                  colSpan={4}
                                  className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap"
                                >
                                  {toRp(invo.subtotal)}
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td
                                  colSpan={4}
                                  className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                                >
                                  PPN
                                </td>
                                <td
                                  colSpan={4}
                                  className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap"
                                >
                                  {toRp(invo.ppn)}
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td
                                  colSpan={4}
                                  className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                                >
                                  Total
                                </td>
                                <td
                                  colSpan={4}
                                  className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap"
                                >
                                  {toRp(invo.jumlah)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <ShimmerSoalMhs3 />
                )}
              </div>
            </Grid>
          </Grid>
        </DragDropContext>
      </div>
    </div>
  );
}
