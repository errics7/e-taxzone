//#region
import { ShimmerBadge, ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import TabelBahanAdmin from "../components/TabelBahanAdmin";
import TabelInfoBahanAdmin from "../components/TabelInfoBahanAdmin";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UiMutasiKeluarAdmin from "../components/UiMutasiKeluarAdmin";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import { every, isEqual } from "lodash";
import { CircularProgress } from "@mui/material";
import { Save } from "@mui/icons-material";
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
}));
//#endregion

export default function Gs4Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const [update, setUpdate] = useState(0);
  const [load, setLoad] = useState(false);
  //dat
  const [dOri, setDOri] = useState(null);
  const [dSoal, setDSoal] = useState([]);
  const [dConf, setDConf] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs4/data/${id}/soal`, {
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
          //def soal
          checkDefault(res.data);
          //
          setDOri(res.data);
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
  }, [update, history, id]);

  //#region
  const checkDefault = (inp) => {
    var dat = inp;
    if (inp.config.narasisoal === null) {
      const x = {
        ...inp.config,
        narasisoal:
          '<p><strong>Game Simulasi 4 - Mutasi Keluar Kartu Persediaan<br></strong><br>Pada Game Simulasi 4 ini mahasiswa diminta untuk melakukan pencatatan mutasi keluar barang pada Kartu Persediaan.<br>Langkah-langkah pengerjaan Game Simulasi 4 adalah sebagai berikut:<br>1. Perhatikan <strong>Nama Barang</strong> yang akan dicatat pada Kartu Persediaan.<br>2. Seret (<em>drag</em>) isian <strong>Tanggal</strong> pada dokumen Bukti Permintaan dan Pemakaian Bahan, kemudian lepas (<em>drop</em>) pada kolom <strong>Tanggal</strong> di lembar kerja yang telah disediakan.<br>3. <span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">Seret (<em>drag</em>) isian <strong>Keperluan</strong> pada dokumen Bukti Permintaan dan Pemakaian Bahan, kemudian lepas (<em>drop</em>) pada kolom <strong>Keterangan</strong> di lembar kerja yang telah disediakan.</span> <br>4. <span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">Seret (<em>drag</em>) isian <strong>No. BPPB</strong> pada dokumen Bukti Permintaan dan Pemakaian Bahan, kemudian lepas (<em>drop</em>) pada kolom <strong>No. Bukti</strong> di lembar kerja yang telah disediakan.</span>  <br>5. <span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">Seret (<em>drag</em>) isian <strong>Kuantitas</strong> pada dokumen Bukti Permintaan dan Pemakaian Bahan, kemudian lepas (<em>drop</em>) pada kolom <strong>Kuantitas Masuk/ Keluar</strong> di lembar kerja yang telah disediakan.</span>  <br>6. <span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">Seret (<em>drag</em>) isian <strong>Harga Pokok</strong> pada dokumen Bukti Permintaan dan Pemakaian Bahan, kemudian lepas (<em>drop</em>) pada kolom <strong>Harga Masuk/ Keluar</strong> di lembar kerja yang telah disediakan.</span>  <br>7. Cek kebenaran jawaban dengan cara klik tombol <strong>Check</strong>.</p>\n',
      };
      dat.config = x;
    }
    if (inp.dataSoal.length === 0) {
      dat.dataSoal = [
        {
          namabhn: "Calcium Hypoclorit",
          satuan: "kg",
          dimintaqty: "25",
          keluarqty: "20",
          hrgsatuan: "1000",
          hrgjumlah: 20000,
          keperluan: "Produksi - sie Pulp",
          status: true,
        },
        {
          namabhn: "Caustic Soda",
          satuan: "kg",
          dimintaqty: "10",
          keluarqty: "10",
          hrgsatuan: "500",
          hrgjumlah: 5000,
          keperluan: "Produksi - sie Pulp",
          status: false,
        },
      ];
    }
    //
    setDConf(dat.config);
    setDSoal(dat.dataSoal);
  };

  const checkPerubahan = () => {
    const x = {
      // config: dConf,
      dataSoal: dSoal,
    };
    const y = {
      // config: dOri.config,
      dataSoal: dOri.dataSoal,
    };

    return isEqual(x, y) ? false : true;
  };

  const saveToDbGs4 = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs4/data/update`,
      {
        idc: id,
        data: dSoal,
        dataconf: dConf,
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

  const selectedTb = () => {
    if (dSoal.length !== 0) {
      return dSoal.find((el) => el.status === true);
    } else return null;
  };
  //#endregion

  return (
    <div className="w-full min-h-20v relative">
      {load && <LoadingWait />}
      <Helmet>
        <title>GS 4 | Admin</title>
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
            Konfigurasi Game Simulasi 4
          </div>
        </div>
      </div>
      <br />

      <span className="mt-2 block">Soal Editor:</span>
      <div className="border">
        {dConf ? (
          <EditorNarasiSoal
            dataConfig={dConf}
            setdataConfig={(dat) => setDConf(dat)}
          />
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>
      <br />

      <div className="border border-dashed p-3 min-h-1/2 w-full relative bg-white">
        <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
          Pengaturan Soal :
        </div>
        <div className="text-xl uppercase text-center pt-10">
          Bukti Permintaan & Pemakaian Bahan
        </div>
        <div className="text-lg flex flex-col items-center uppercase text-center">
          <div className="flex mt-3">
            <div>NO BPPB : </div>
            <div className="px-2 relative">
              {dConf ? (
                <input
                  value={dConf ? dConf.nobppb : ""}
                  className="text-left px-3"
                  onChange={(event) => {
                    //edited row
                    setDConf({
                      ...dConf,
                      nobppb: event.target.value,
                    });
                  }}
                />
              ) : (
                <ShimmerBadge width={220} />
              )}
              <EditIcon
                fontSize="inherit"
                className="text-blue-700 absolute inset-y-1 right-3"
              />
            </div>
          </div>
        </div>
        <br />
        <br />
        <TabelBahanAdmin
          dConf={dConf}
          data={dSoal}
          setdata={(dat) => setDSoal(dat)}
        />
        <br />
        <UiMutasiKeluarAdmin
          dataC={dConf}
          selected={selectedTb()}
          setdata={(dat) => setDConf(dat)}
        />
        <br />
        <TabelInfoBahanAdmin data={dConf} setdata={(dat) => setDConf(dat)} />
        <br />
        <Button
          variant="contained"
          className={classes.btnsavedata}
          style={{ marginTop: "14px", marginRight: "10px" }}
          endIcon={
            dOri && load ? (
              <CircularProgress
                size={20}
                thickness={4}
                style={{ color: "white" }}
              />
            ) : (
              <Save />
            )
          }
          onClick={() => saveToDbGs4()}
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
            if (dSoal.length === 0) {
              toast("Tambahkan data bahan untuk soal terlebihdahulu", {
                icon: "⚠️",
              });
              return;
            }
            if (every(dSoal, ["status", false])) {
              toast("Pastikan Memilih data bahan untuk soal", {
                icon: "⚠️",
              });
              return;
            }

            if (dOri && checkPerubahan()) {
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
