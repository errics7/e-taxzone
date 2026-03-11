//#region
import { useHistory, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { v4 as uuidv4 } from "uuid";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import TableAdmin5 from "../components/TableAdmin5";
import { isEqual } from "lodash";
import Save from "@mui/icons-material/Save";
import TableAkun from "../components/TableAkun";
import TableHpp5 from "../components/TableHpp5";
import InvoiceListTable5 from "../components/InvoiceListTable5";
import { CircularProgress } from "@mui/material";
import ShimmerAdmin5 from "../components/ShimmerAdmin5";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  btnback: {
    backgroundColor: "#7C7C7C",
    textTransform: "none",
    marginLeft: "0px",
    marginRight: "10px",
    marginBottom: "10px",
    paddingLeft: "10px",
    paddingRight: "20px",
    "&:hover": {
      backgroundColor: "#5D5D5D",
      boxShadow: "none",
    },
  },
  btnLihatPreviewMhs: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "15px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
  btnaddadata: {
    color: "#FFF",
    backgroundColor: "#2D90DA",
    "&:hover": {
      backgroundColor: "#216CA3",
      boxShadow: "none",
    },
    textTransform: "capitalize",
  },
}));
//#endregion

export default function Gs5Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [defData, setDefData] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
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
          setLoad(false);

          setDefData(res.data);
          defaultDataCheck(res.data);
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
  }, [id, history]);

  const defaultDataCheck = (inp) => {
    var conf = inp;
    const uid = [uuidv4(), uuidv4()];

    if (conf.narasisoal === null || conf.narasisoal === "") {
      conf = {
        ...conf,
        narasisoal: `<p style="text-align:start;"><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;"><strong>GAME SIMULASI 5 - MENCATAT TRANSAKSI KE JURNAL KAS MASUK</strong></span></p>`,
      };
    }
    if (conf.dataakun && conf.dataakun.length === 0) {
      conf = {
        ...conf,
        dataakun: [
          {
            id_config: 1,
            noakun: "110",
            name: "kas",
            posisi: "debit",
            jumlah: 2841500,
          },
          {
            id_config: 1,
            noakun: "510",
            name: "hpp",
            posisi: "debit",
            jumlah: 636000,
          },
          {
            id_config: 1,
            noakun: "410",
            name: "penjualan",
            posisi: "kredit",
            jumlah: 765000,
          },
          {
            id_config: 1,
            noakun: "213",
            name: "ppnkeluar",
            posisi: "kredit",
            jumlah: 76500,
          },
          {
            id_config: 1,
            noakun: "112",
            name: "piutangdagang",
            posisi: "kredit",
            jumlah: 2000000,
          },
          {
            id_config: 1,
            noakun: "115",
            name: "persediaan",
            posisi: "kredit",
            jumlah: 636000,
          },
        ],
      };
    }
    if (conf.databarang && conf.databarang.length === 0) {
      conf = {
        ...conf,
        databarang: [
          {
            uid: uuidv4(), //to ezy edit in FE
            uid_invoice: uid[0],
            namabarang: "Paperfine A4 75gr",
            jumlah: 10,
            harga: 38000,
            total: 380000,
            hpp: 30000,
          },
          {
            uid: uuidv4(), //to ezy edit in FE
            uid_invoice: uid[0],
            namabarang: "Light F4 70gr",
            jumlah: 7,
            harga: 55000,
            total: 385000,
            hpp: 48000,
          },
        ],
      };
    }
    if (conf.datanota && conf.datanota.length === 0) {
      conf = {
        ...conf,
        datanota: [
          {
            uid: uid[0],
            type: "kontan",
            keterangan: "Penjualan tunai",
            no: "M111",
            tgl: "1-Dec-2021",
            tgl2: "",
            subtotal: 765000,
            ppn: 76500,
            jumlah: 841500,
            hpp: 636000,
            persediaan: 636000,
            penerima: "",
            keperluan: "",
            nilaih: "",
            nilaia: 0,
          },
          {
            uid: uid[1],
            type: "kas",
            keterangan: "Pelunasan piutang",
            no: "M098",
            tgl: "7-Dec-2021",
            tgl2: "Malang, 7 Desember 2021",
            subtotal: 0,
            ppn: 0,
            jumlah: 0,
            hpp: 0,
            persediaan: 0,
            penerima: "CV. Abimana",
            keperluan: "pelunasan piutang bulan November 2021",
            nilaih: "Dua juta rupiah",
            nilaia: 2000000,
          },
        ],
      };
    }

    setConfig(conf);
  };

  const checkPerubahan = () => (isEqual(defData, config) ? false : true);

  const saveToDb = () => {
    if (load) return;
    setLoad(true);
    const push = axios.post(
      `${API.HOST}/api/v2/gamesimulasi5/${id}/update`,
      {
        config: config,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    toast.promise(
      push,
      {
        loading: "Saving Data...",
        success: (data) => {
          setLoad(false);
          setDefData(config);
          // setUpdate(update + 1);
          // message
          return data.data.message;
        },
        error: (error) => {
          setLoad(false);
          console.log(error);

          return error.response.data.message;
        },
      },
      {
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
      }
    );
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Perdagangan 5 | Admin</title>
      </Helmet>
      <div className="flex flex-col items-start relative">
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
        <div className="relative w-full mb-5">
          <div className="text-2xl text-center w-full absolute">
            Konfigurasi Game Simulasi Perdagangan 5
          </div>
        </div>
      </div>
      <div className="relative">
        {load && <LoadingWait />}
        <br />
        <span className="mt-5 block">Soal Editor:</span>
        {config ? (
          <EditorNarasiSoal
            dataConfig={config}
            setdataConfig={(dat) => setConfig(dat)}
          />
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}

        {/* Code Here  or  whatever*/}
        <br />
        <Grid item xs={12} md={12} lg={12}>
          <div className="p-5 pt-10 border border-dashed bg-white">
            {config ? (
              <div className="relative">
                <div className="absolute opacity-50 bg-blue-200 italic font-semibold -mt-10 -ml-5 p-1 pr-2">
                  Kunci jawaban :
                </div>
                <TableHpp5
                  dataConfig={config}
                  setdataConfig={(dat) => setConfig(dat)}
                />
                <hr />
                <TableAdmin5
                  dataConfig={config}
                  setdataConfig={(dat) => setConfig(dat)}
                />
                <TableAkun
                  dataConfig={config}
                  setdataConfig={(dat) => setConfig(dat)}
                />
                <InvoiceListTable5
                  dataConfig={config}
                  setdataConfig={(dat) => setConfig(dat)}
                />
              </div>
            ) : (
              <ShimmerAdmin5 />
            )}
          </div>
        </Grid>
      </div>

      <div className="flex flex-row space-x-1">
        <Button
          variant="contained"
          className={classes.btnaddadata}
          style={{ marginTop: "14px", marginRight: "10px" }}
          endIcon={
            config && load ? (
              <CircularProgress
                size={20}
                thickness={4}
                style={{ color: "white" }}
              />
            ) : (
              <Save />
            )
          }
          onClick={() => saveToDb()}
          disabled={load}
        >
          Save Data
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.btnLihatPreviewMhs}
          endIcon={<OpenInNewIcon />}
          disabled={load}
          onClick={() => {
            if (checkPerubahan()) {
              toast(
                (t) => (
                  <div className="flex flex-col">
                    <span>
                      Terdapat perubahan data, klik save terlebih untuk
                      menyimpan perubahan.
                    </span>
                    <div>
                      <button
                        className="mt-3 cursor-pointer inline-flex bg-red-500 hover:bg-red-600 text-white rounded h-6 px-3 justify-center items-center"
                        onClick={() => {
                          toast.dismiss(t.id);
                          history.push(`${id}/preview`);
                        }}
                      >
                        Tetap lihat (batalkan perubahan)
                      </button>
                    </div>
                  </div>
                ),
                {
                  icon: "⚠️",
                  duration: 2000,
                }
              );
              return;
            }
            history.push(`${id}/preview`);
          }}
        >
          Lihat tampilan di Mahasiswa
        </Button>
      </div>
    </div>
  );
}
