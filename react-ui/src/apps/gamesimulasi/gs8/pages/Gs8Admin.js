//#region
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import JurnalPembelianAdm from "../components/JurnalPembelianAdm";
import FakturPajakAdm from "../components/FakturPajakAdm";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import { Helmet } from "react-helmet";
import {
  ShimmerSectionHeader,
  ShimmerTitle,
  ShimmerText,
  ShimmerBadge,
  ShimmerTable,
} from "react-shimmer-effects";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Grid from "@mui/material/Grid";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import { isEqual } from "lodash";
import { CircularProgress } from "@mui/material";
import { Save } from "@mui/icons-material";
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
}));
//#endregion

export default function Gs8Admin(props) {
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [update, setUpdate] = useState(0);
  const [load, setLoad] = useState(false);

  const [dataOri, setDataOri] = useState(null);
  const [dataConf, setdataConf] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs8/data/${id}/soal`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          setLoad(false);

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

          setDataOri(res.data);
          // deff soal
          if (!res.data.config.narasisoal) {
            const x = {
              ...res.data.config,
              narasisoal:
                '<p>Pada sesi games ini, mahasiswa diminta untuk jurnal pembelian dengan basis data pada faktur pajak, berikut langkah-langkah pengerjaannya:</p>\n<p>1. Isilah Tanggal dengan format <strong>tanggal (dalam angka) - Dec - tahun (dalam angka)</strong></p>\n<p>2. Isi kolom Nama Rekening .......&nbsp;</p>\n<p>3. Transaksi ini merupakan pembelian kredit, maka setelah menulis nama vendor diikuti dengan keterangan tambahan "- pembelian kredit" ........</p>\n',
            };
            setdataConf(x);
          } else {
            setdataConf(res.data.config);
          }
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
  }, [update, id, history]);

  const saveToDbGs8 = () => {
    // console.log(data);
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs8/data/update`,
      {
        idc: id,
        dataConf: dataConf,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    // Notif
    toast.promise(
      push,
      {
        loading: "Menyimpan Data...",
        success: (data) => {
          setLoad(false);

          setUpdate(update + 1);
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
  const checkUpdate = () => {
    if (dataOri && dataConf) {
      //
      if (isEqual(dataOri.config, dataConf)) {
        // console.log("sm");
        return false;
      } else {
        // console.log("nosame");
        return true;
      }
    } else {
      return false;
    }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>GS 8 | Admin</title>
      </Helmet>
      {load && <LoadingWait />}
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
            Konfigurasi Game Simulasi 8
          </div>
        </div>
      </div>

      <span className="mt-5 block">Soal Editor:</span>
      <div className="border">
        {dataConf ? (
          <EditorNarasiSoal
            dataConfig={dataConf}
            setdataConfig={(dat) => setdataConf(dat)}
          />
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>

      {!dataConf ? (
        <div className="mt-5 bg-white">
          <ShimmerBadge width={200} />
          <ShimmerTable row={1} col={5} />;
          <div className="-mb-10 mt-3">
            <ShimmerSectionHeader center />
          </div>
          <ShimmerTable row={1} col={5} />;
        </div>
      ) : (
        <Grid item xs={12} md={12} lg={12}>
          <div className="p-5 border border-dashed bg-white">
            <JurnalPembelianAdm
              dataConfig={dataConf}
              setdata={(dat) => setdataConf(dat)}
            />
            <br />
            <br />
            <FakturPajakAdm
              dataConfig={dataConf}
              setdata={(dat) => setdataConf(dat)}
            />

            <Button
              variant="contained"
              className={classes.btnsavedata}
              style={{ marginTop: "14px", marginRight: "10px" }}
              endIcon={
                dataOri && load ? (
                  <CircularProgress
                    size={20}
                    thickness={4}
                    style={{ color: "white" }}
                  />
                ) : (
                  <Save />
                )
              }
              onClick={() => saveToDbGs8()}
              disabled={load}
            >
              Save Data
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.btnLihatPreviewMhs}
              endIcon={<OpenInNewIcon />}
              onClick={() => {
                if (checkUpdate()) {
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
        </Grid>
      )}
    </div>
  );
}
