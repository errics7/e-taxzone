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
import { isEqual } from "lodash";
import Save from "@mui/icons-material/Save";
import TableAkun from "../components/TableAkun";
import { CircularProgress } from "@mui/material";
import ShimmerAdmin4 from "../components/ShimmerAdmin4";
import NotaListTable from "../components/NotaListTable";
import TableWorksheetAdmin6 from "../components/TableWorksheetAdmin6";
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

export default function Gs6Admin() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [defData, setDefData] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/gamesimulasi6/${id}/config`, {
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
        narasisoal: `<p style="text-align:start;"><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;"><strong>Game Simulasi 6 - MENCATAT TRANSAKSI KE JURNAL KAS KELUAR</strong></span></p>`,
      };
    }
    if (conf.dataakun && conf.dataakun.length === 0) {
      conf = {
        ...conf,
        dataakun: [
          {
            // id_config: Number(id),
            noakun: 110,
            jumlah: 11005000,
            posisi: "kredit",
            name: "kas",
          },
          {
            // id_config: Number(id),
            noakun: 115,
            jumlah: 4550000,
            posisi: "debit",
            name: "persediaan",
          },
          {
            // id_config: Number(id),
            noakun: 116,
            jumlah: 455000,
            posisi: "debit",
            name: "ppnmasukan",
          },
          {
            // id_config: Number(id),
            noakun: 620,
            jumlah: 6000000,
            posisi: "debit",
            name: "bebangaji",
          },
        ],
      };
    }
    if (conf.databarang && conf.databarang.length === 0) {
      conf = {
        ...conf,
        databarang: [
          {
            id: uuidv4(),
            // id_config: Number(id),
            uid: uid[0],
            namabarang: "Light F4 70gr",
            jumlah: 75,
            harga: 50000,
            total: 3750000,
            hpp: 50000,
          },
          {
            id: uuidv4(),
            // id_config: Number(id),
            uid: uid[0],
            namabarang: "Concorde A4 220gr",
            jumlah: 100,
            harga: 8000,
            total: 800000,
            hpp: 8000,
          },
        ],
      };
    }
    if (conf.datanota && conf.datanota.length === 0) {
      conf = {
        ...conf,
        datanota: [
          {
            // id_config: Number(id),
            uid: uid[0],
            type: "kontan",
            no: "K91221",
            tgl: "9/12/2021",
            subtotal: 4550000,
            ppn: 455000,
            total: 5005000,
            penerima: "PT. TJIWI BIOO",
            keperluan: "Pembelian tunai",
            nilaih: 0,
            nilaia: 0,
            alamat: "Jl. Jakarta 19 Malang",
            keterangan: "Pembelian tunai",
          },
          {
            // id_config: Number(id),
            uid: uid[1],
            type: "kas",
            no: "K11207",
            tgl: "15/12/2021",
            subtotal: 0,
            ppn: 0,
            total: 6000000,
            penerima: "Karyawan",
            keperluan: "Gaji Desember 2021",
            nilaih: "Enam juta rupiah",
            nilaia: 6000000,
            alamat: "",
            keterangan: "Pembayaran gaji karyawan",
          },
        ],
      };
    }

    setConfig(conf);
  };

  const checkPerubahan = () => {
    return isEqual(defData, config) ? false : true;
  };

  const saveToDb = () => {
    if (load) return;
    setLoad(true);
    // console.log(config);

    const push = axios.post(
      `${API.HOST}/api/v2/gamesimulasi6/${id}/update`,
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
        <title>Perdagangan 6 | Admin</title>
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
            Konfigurasi Game Simulasi Perdagangan 6
          </div>
        </div>
      </div>
      <div className="relative">
        {load && <LoadingWait />}
        <br />
        <span className="mt-5 block">Soal Editor:</span>
        {config ? (
          <>
            <EditorNarasiSoal
              dataConfig={config}
              setdataConfig={(dat) => setConfig(dat)}
            />
          </>
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}

        {/* Code Here  or  whatever*/}
        <br />
        <Grid item xs={12} md={12} lg={12}>
          <div className="p-5 border border-dashed bg-white">
            {config ? (
              <div className="relative">
                <div className="absolute opacity-50 bg-blue-200 italic font-semibold -mt-5 -ml-5 p-1 pr-2">
                  Kunci jawaban :
                </div>
                <TableWorksheetAdmin6
                  dataConfig={config}
                  setdataConfig={(dat) => setConfig(dat)}
                />
                <TableAkun
                  dataConfig={config}
                  setdataConfig={(dat) => setConfig(dat)}
                />
                <NotaListTable
                  dataConfig={config}
                  setdataConfig={(data) => setConfig(data)}
                />
              </div>
            ) : (
              <ShimmerAdmin4 />
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
