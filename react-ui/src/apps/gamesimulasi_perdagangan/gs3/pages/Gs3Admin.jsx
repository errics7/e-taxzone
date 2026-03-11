//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import makeStyles from "@mui/styles/makeStyles";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Save from "@mui/icons-material/Save";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import Invoice from "../component/Invoice";
import ShimmerAdmin3 from "../component/ShimmerAdmin3";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { v4 as uuidv4 } from "uuid";
import TableAdmin from "../component/TableAdmin";
import TableAkun from "../component/TableAkun";
import axios from "axios";
import API from "../../../../utils/host.config";
import { isEqual } from "lodash";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  btnLihatPreviewMhs: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "15px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
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

export default function Gs3Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  //#region default data
  const [defData, setDefData] = useState(null);
  const [config, setConfig] = useState(null);

  //#endregion default data

  //#region func
  useEffect(() => {
    const fetchData = (id_config) => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/gamesimulasi3/${id_config}/config`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }).then((res) => {
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

        //default
        setDefData(res.data);
        defaultDataCheck(res.data);
      });
    };
    fetchData(id);
  }, [id, history]);

  const updateData = () => {
    setLoad(true);
    const push = axios
      .post(
        `${API.HOST}/api/v2/gamesimulasi3/${id}/update`,
        {
          config: config,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
          },
        }
      )
      .catch((error) => {
        setLoad(false);
        toast(
          (t) => (
            <div className="flex flex-col">
              <span>Simpan data failed ({error.response.data.message})</span>
            </div>
          ),
          {
            icon: "⚠️",
            duration: 2000,
          }
        );
      });

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

  const checkPerubahan = () => {
    return isEqual(defData, config) ? false : true;
  };

  const defaultDataCheck = (inp) => {
    let conf = inp;

    if (conf.narasisoal === null || conf.narasisoal === "") {
      conf = {
        ...conf,
        narasisoal: `<p style="text-align:start;"><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;"><strong>Game Simulasi 3 - Mencatat Transaksi ke Jurnal Pembelian</strong></span></p>`,
      };
    }
    if (conf.dataakun && conf.dataakun.length === 0) {
      conf = {
        ...conf,
        dataakun: [
          {
            noakun: "115",
            name: "persediaan",
            alias: "Persediaan",
            posisi: "debit",
            jumlah: 13100000,
          },
          {
            noakun: "116",
            name: "ppnmasukan",
            alias: "PPN Masukan",
            posisi: "debit",
            jumlah: 1310000,
          },
          {
            noakun: "210",
            name: "hutangdagang",
            alias: "Hutang Dagang",
            posisi: "kredit",
            jumlah: 14410000,
          },
        ],
      };
    }
    const uid = [uuidv4(), uuidv4(), uuidv4()];
    if (conf.datainvoice && conf.datainvoice.length === 0) {
      conf = {
        ...conf,
        datainvoice: [
          {
            uid: uid[0],
            vendorname: "PT PAPIER",
            vendoralamat: "Jl. Jakarta No.10 Gresik, Jawa Timur",
            buyername: "CV Rovadi",
            buyeralamat: "Jl. Soekarno Blok A1, Malang",
            tanggal: "3-Dec-2021",
            noinvoice: "J-660",
            noorder: "765476",
            subtotal: 9400000,
            ppn: 940000,
            jumlah: 10340000,
          },
          {
            uid: uid[1],
            vendorname: "PT CHARTA INDO",
            vendoralamat: "Jl. Niaga Kav C6, Cirebon",
            buyername: "CV Rovadi, Malang",
            buyeralamat: "Jl. Soekarno Blok A1, Malang",
            tanggal: "14-Dec-2021",
            noinvoice: "1234",
            noorder: "4323",
            subtotal: 3700000,
            ppn: 370000,
            jumlah: 4070000,
          },
        ],
      };
    }
    if (conf.databarang && conf.databarang.length === 0) {
      conf = {
        ...conf,
        databarang: [
          {
            id: uuidv4(), //to ezy edit in FE
            id_invoice: uid[0],
            namabarang: "Paperfine F4 75gr",
            satuan: "Rim",
            jumlah: 100,
            harga: 54000,
            total: 5400000,
          },
          {
            id: uuidv4(), //to ezy edit in FE
            id_invoice: uid[0],
            namabarang: "Paperfine A4 80gr",
            satuan: "Rim",
            jumlah: 100,
            harga: 40000,
            total: 4000000,
          },
          {
            id: uuidv4(), //to ezy edit in FE
            id_invoice: uid[1],
            namabarang: "Karton Manila Warna",
            satuan: "lembar",
            jumlah: 500,
            harga: 2200,
            total: 1100000,
          },
          {
            id: uuidv4(), //to ezy edit in FE
            id_invoice: uid[1],
            namabarang: "Charta A4 60gr",
            satuan: "Rim",
            jumlah: 100,
            harga: 26000,
            total: 2600000,
          },
        ],
      };
    }

    setConfig(conf);
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>GS 3 Perdagangan | Admin</title>
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
            Konfigurasi Game Simulasi Perdagangan 3
          </div>
        </div>
      </div>

      {/* CONTAINER  */}
      <div className="relative">
        {load && <LoadingWait />}
        {/* bdy */}
        <Grid container spacing={2} direction="row" alignItems="stretch">
          <Grid item xs={12} md={12} lg={12}>
            <span className="mt-5 block">Soal Editor:</span>
            <div className="border min-h-5v">
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
            </div>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <div className="border border-dashed bg-white">
              {config ? (
                <>
                  <TableAdmin
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                  <TableAkun
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                  <Invoice
                    dataConfig={config}
                    setdataConfig={(dat) => setConfig(dat)}
                  />
                </>
              ) : (
                <ShimmerAdmin3 />
              )}
            </div>
          </Grid>
        </Grid>
      </div>

      <Button
        variant="contained"
        className={classes.btnaddadata}
        style={{ marginTop: "14px", marginRight: "10px" }}
        endIcon={<Save />}
        onClick={() => updateData()}
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
                    Terdapat perubahan data, klik save terlebih untuk menyimpan
                    perubahan.
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
  );
}
