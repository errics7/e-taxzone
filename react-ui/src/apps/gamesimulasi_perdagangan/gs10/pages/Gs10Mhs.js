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
import makeStyles from "@mui/styles/makeStyles";
import { Grid } from "@mui/material";
import toast from "react-hot-toast";
import { find, filter, findIndex } from "lodash";
import { v4 as uuidv4 } from "uuid";
import TableTransaksiMhs10 from "../component/TableTransaksiMhs10";
import KartuWorksheetMhs10 from "../component/KartuWorksheetMhs10";
import ShimmerMhs10 from "../component/ShimmerMhs10";
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

export default function Gs10Mhs() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [config, setConfig] = useState(null);
  const [jwbdata, setJwbdata] = useState(null);

  const [done, setDone] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      axios(`${API.HOST}/api/v2/gamesimulasi10/${id}/config`, {
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
        })
        .catch((error) => {
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
  }, [id, history]);

  const prepareData = (inn) => {
    const daUtama = [];
    const dbSaldo = [
      {
        uid: uuidv4(),
        saldoqty: inn.awalkuantitas,
        saldohpunit: inn.awalhpunit,
        saldojumlah: inn.awalkuantitas * inn.awalhpunit,
      },
    ];

    //#2 start from Pembelian Kredit
    filter(inn.databarang, {
      type: "buy",
      gen: inn.selectedbrg,
    }).forEach((el) => {
      const dummPembelian = [...dbSaldo];
      const jikhrgsama = find(dbSaldo, { saldohpunit: el.harga });

      if (jikhrgsama) {
        const idx = findIndex(dbSaldo, { saldohpunit: el.harga });
        const newed = {
          ...dbSaldo[idx],
          saldoqty: dbSaldo[idx].saldoqty + el.jumlah,
        };
        //setUtama
        dbSaldo.splice(idx, 1, newed);
        //set lokal
        dummPembelian.splice(idx, 1, {
          uid: uuidv4(),
          buy: true,
          soal_buyqty: el.jumlah,
          soal_buyhpunit: el.harga,
          soal_buyjumlah: Number(el.jumlah) * Number(el.harga),

          jwb_buyqty: 0,
          jwb_buyhpunit: 0,
          jwb_buyjumlah: 0,
          err_buyqty: false,
          err_buyhpunit: false,
          err_buyjumlah: false,

          sell: false,

          saldo: true,
          soal_saldoqty: dbSaldo[idx].saldoqty + el.jumlah,
          soal_saldohpunit: dbSaldo[idx].saldohpunit,
          soal_saldojumlah: dbSaldo[idx].saldojumlah,

          jwb_saldoqty: 0,
          jwb_saldohpunit: 0,
          jwb_saldojumlah: 0,
          err_saldoqty: false,
          err_saldohpunit: false,
          err_saldojumlah: false,
        });
      } else {
        const newed = {
          uid: uuidv4(),
          saldoqty: el.jumlah,
          saldohpunit: el.harga,
          saldojumlah: Number(el.jumlah) * Number(el.harga),
        };
        dbSaldo.push(newed);
        //set lokal
        dummPembelian.splice(0, 1, {
          uid: uuidv4(),
          buy: true,
          soal_buyqty: el.jumlah,
          soal_buyhpunit: el.harga,
          soal_buyjumlah: Number(el.jumlah) * Number(el.harga),
          jwb_buyqty: 0,
          jwb_buyhpunit: 0,
          jwb_buyjumlah: 0,
          err_buyqty: false,
          err_buyhpunit: false,
          err_buyjumlah: false,

          sell: false,

          saldo: true,
          soal_saldoqty: dbSaldo[0].saldoqty,
          soal_saldohpunit: dbSaldo[0].saldohpunit,
          soal_saldojumlah: dbSaldo[0].saldojumlah,
          jwb_saldoqty: 0,
          jwb_saldohpunit: 0,
          jwb_saldojumlah: 0,
          err_saldoqty: false,
          err_saldohpunit: false,
          err_saldojumlah: false,
        });
        dummPembelian.push({
          uid: uuidv4(),
          buy: false,
          sell: false,
          saldo: true,
          soal_saldoqty: el.jumlah,
          soal_saldohpunit: el.harga,
          soal_saldojumlah: Number(el.jumlah) * Number(el.harga),
          jwb_saldoqty: 0,
          jwb_saldohpunit: 0,
          jwb_saldojumlah: 0,
          err_saldoqty: false,
          err_saldohpunit: false,
          err_saldojumlah: false,
        });
      }
      //
      const forspan = [...dbSaldo];
      daUtama.push({
        uid: uuidv4(),
        type: "buy",
        uraian: "Pembelian Kredit",
        rowspan: forspan.length,
        value: dummPembelian,
      });
    });
    //
    //#3 Penjualan
    filter(inn.databarang, {
      type: "sell",
      gen: inn.selectedbrg,
    }).forEach((el) => {
      const dummSell = [];
      // console.log(el);

      var daQty = el.jumlah * -1; //to -mines
      var indx = 0;
      do {
        const oldqty = daQty;
        const oldsaldo = dbSaldo[indx].saldoqty;
        //trace
        // console.log(
        //   "(" + dbSaldo[indx].saldoqty + "-" + daQty + ")",
        //   dbSaldo[indx].saldoqty + daQty
        // );
        //Operation
        const sisa = Number(dbSaldo[indx].saldoqty) + daQty;
        if (sisa >= 0) {
          //set Sisa
          dbSaldo[indx].saldoqty = sisa;
          daQty = 0;
          //push
          dummSell.push({
            uid: uuidv4(),
            buy: false,

            sell: oldqty === 0 ? false : true,
            soal_sellqty: Math.abs(oldqty),
            soal_sellhpunit: dbSaldo[indx].saldohpunit,
            soal_selljumlah:
              Number(Math.abs(oldqty)) * Number(dbSaldo[indx].saldohpunit),
            jwb_sellqty: 0,
            jwb_sellhpunit: 0,
            jwb_selljumlah: 0,
            err_sellqty: false,
            err_sellhpunit: false,
            err_selljumlah: false,

            saldo: sisa === 0 ? false : true,
            soal_saldoqty: dbSaldo[indx].saldoqty,
            soal_saldohpunit: dbSaldo[indx].saldohpunit,
            soal_saldojumlah:
              Number(dbSaldo[indx].saldoqty) *
              Number(dbSaldo[indx].saldohpunit),
            jwb_saldoqty: 0,
            jwb_saldohpunit: 0,
            jwb_saldojumlah: 0,
            err_saldoqty: false,
            err_saldohpunit: false,
            err_saldojumlah: false,
          });
        } else {
          dbSaldo[indx].saldoqty = sisa;
          daQty = sisa;
          //push
          dummSell.push({
            uid: uuidv4(),
            buy: false,
            sell: oldqty === 0 ? false : true,
            soal_sellqty: Math.abs(oldsaldo),
            soal_sellhpunit: dbSaldo[indx].saldohpunit,
            soal_selljumlah:
              Number(Math.abs(oldsaldo)) * Number(dbSaldo[indx].saldohpunit),
            jwb_sellqty: 0,
            jwb_sellhpunit: 0,
            jwb_selljumlah: 0,
            err_sellqty: false,
            err_sellhpunit: false,
            err_selljumlah: false,

            saldo: sisa < 0 ? false : true,
            soal_saldoqty: dbSaldo[indx].saldoqty,
            soal_saldohpunit: dbSaldo[indx].saldohpunit,
            soal_saldojumlah:
              Number(dbSaldo[indx].saldoqty) *
              Number(dbSaldo[indx].saldohpunit),
            jwb_saldoqty: 0,
            jwb_saldohpunit: 0,
            jwb_saldojumlah: 0,
            err_saldoqty: false,
            err_saldohpunit: false,
            err_saldojumlah: false,
          });
        }
        indx++;
      } while (indx <= dbSaldo.length - 1);
      //endd
      daUtama.push({
        uid: uuidv4(),
        type: "sell",
        uraian: "Penjualan Tunai",
        rowspan: dbSaldo.length,
        value: dummSell,
      });
    });
    //cek Struktur
    //console.log(daUtama);
    setJwbdata(daUtama);
    setConfig(inn);
  };

  const checkData = () => {
    setChecking(true);
    var tmpjwb = [...jwbdata];
    const result = [];
    tmpjwb.forEach((item, index) => {
      //
      item.value.forEach((el, i) => {
        //cek BUY
        if (el.buy) {
          //#1
          if (Number(el.soal_buyqty) === Number(el.jwb_buyqty)) {
            result.push(true);
          } else {
            tmpjwb[index].value[i].err_buyqty = true;
            result.push(false);
          }
          //#2
          if (Number(el.soal_buyhpunit) === Number(el.jwb_buyhpunit)) {
            result.push(true);
          } else {
            tmpjwb[index].value[i].err_buyhpunit = true;
            result.push(false);
          }
          //#3
          if (Number(el.soal_buyjumlah) === Number(el.jwb_buyjumlah)) {
            result.push(true);
          } else {
            tmpjwb[index].value[i].err_buyjumlah = true;
            result.push(false);
          }
        }
        //cek SELL
        if (el.sell) {
          //#1
          if (Number(el.soal_sellqty) === Number(el.jwb_sellqty)) {
            result.push(true);
          } else {
            tmpjwb[index].value[i].err_sellqty = true;
            result.push(false);
          }
          //#2
          if (Number(el.soal_sellhpunit) === Number(el.jwb_sellhpunit)) {
            result.push(true);
          } else {
            tmpjwb[index].value[i].err_sellhpunit = true;
            result.push(false);
          }
          //#3
          if (Number(el.soal_selljumlah) === Number(el.jwb_selljumlah)) {
            result.push(true);
          } else {
            tmpjwb[index].value[i].err_selljumlah = true;
            result.push(false);
          }
        }
        //cek SALDO
        if (el.saldo) {
          //#1
          if (Number(el.soal_saldoqty) === Number(el.jwb_saldoqty)) {
            result.push(true);
          } else {
            tmpjwb[index].value[i].err_saldoqty = true;
            result.push(false);
          }
          //#2
          if (Number(el.soal_saldohpunit) === Number(el.jwb_saldohpunit)) {
            result.push(true);
          } else {
            tmpjwb[index].value[i].err_saldohpunit = true;
            result.push(false);
          }
          //#3
          if (Number(el.soal_saldojumlah) === Number(el.jwb_saldojumlah)) {
            result.push(true);
          } else {
            tmpjwb[index].value[i].err_saldojumlah = true;
            result.push(false);
          }
        }
      });
    });

    setJwbdata(tmpjwb);

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
        <title>Game Simulasi 10 Perdagangan</title>
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
        {config ? (
          <Grid container spacing={2} direction="row" alignItems="stretch">
            <Grid item xs={12} md={12} lg={12}>
              <div className="mt-5 mb-1 opacity-50 italic font-semibold my-1">
                Data (Soal):
              </div>
              <TableTransaksiMhs10 dataConfig={config} />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <div className="mt-5 mb-3 opacity-50 italic font-semibold my-1">
                Worksheet (Lembar Kerja):
              </div>
              <KartuWorksheetMhs10
                dataConfig={config}
                jwbdata={jwbdata}
                setJwbdata={(x) => setJwbdata(x)}
                checking={checking}
              />
            </Grid>
            {/* Button check and reset */}
            <Grid item xs={12} md={12} lg={12}>
              <div
                className={`flex flex-row-reverse py-1 w-full  bg-gradient-to-l from-slate-100`}
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
                      checkData();
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
                    setDone(false);
                    prepareData(config);
                  }}
                >
                  Reset
                </Button>
              </div>
            </Grid>
          </Grid>
        ) : (
          <ShimmerMhs10 />
        )}
      </div>
    </div>
  );
}
