//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import { isEqual } from "lodash";
import makeStyles from "@mui/styles/makeStyles";
import { CircularProgress, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LaporanAdmin from "../components/LaporanAdmin";
import TabelSoalAdmin from "../components/TabelSoalAdmin";
import PercentAdmin from "../components/PercentAdmin";
import swal from "sweetalert";
import { Save } from "@mui/icons-material";

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

export default function Gs16Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  const [ori, setOri] = useState(null);
  // #region data dumm
  const [dataConfig, setDataConfig] = useState({
    narasisoal: "",
    namept: "PT. MITRA ANTAR POLINDO",
    title: "LAPORAN BIAYA PRODUKSI - SEKSI KERTAS",
    subtitle: "UNTUK TAHUN YANG BERAKHIR PADA 31 DESEMBER 2021",
    subtitletbl1: "Skedul Kuantitas",
    titlesoal: "Data Produksi",
    titelpercent: "Tingkat Penyelesaian",
    titlejumlah1: "Jumlah Produk yang diolah",
    titlejumlah2: "Jumlah Produk yang dihasilkan",
  });
  const [dataTabel, setDataTabel] = useState([
    {
      uuid: "210888ad-9eda-47a4-8304-c82f3d9fe856",
      name: "Persediaan awal",
      value: 200,
      type: 1,
    },
    {
      uuid: "e7ad6e2e-2364-4b85-82a1-f3763430c884",
      name: "Diterima dari Dept PULP",
      value: 900,
      type: 1,
    },
    {
      uuid: "a324eae0-bd0d-46dc-8f37-f31474e6cbf6",
      name: "Dimulai/ditambahkan ke proses di Dept.KERTAS",
      value: 400,
      type: 1,
    },
    {
      uuid: "aefc567e-e4b1-40b5-89fb-4aca560edce0",
      name: "Ditransfer ke Gudang/Dept. PENYEMPURNAAN",
      value: 1100,
      type: 2,
    },
    {
      uuid: "b8f83843-aabb-42b6-b27d-5fc2e86a61f5",
      name: "Persediaan BDP akhir",
      value: 300,
      type: 2,
    },
    {
      uuid: "be679b57-36a0-4fc1-afba-8ce9d2aaada9",
      name: "Produk Hilang dalam proses",
      value: 100,
      type: 2,
    },
  ]);
  const [dataSoal, setDataSoal] = useState([
    {
      uuid: "210888ad-9eda-47a4-8304-c82f3d9fe856",
      alias: "Persediaan awal barang dalam proses seksi kertas",
      value: 200,
    },
    {
      uuid: "e7ad6e2e-2364-4b85-82a1-f3763430c884",
      alias: "Diterima dari seksi Pulp",
      value: 900,
    },
    {
      uuid: "a324eae0-bd0d-46dc-8f37-f31474e6cbf6",
      alias: "Unit yang ditambahkan di seksi kertas",
      value: 400,
    },
    {
      uuid: "aefc567e-e4b1-40b5-89fb-4aca560edce0",
      alias: "Unit selesai seksi kertas yang ditransfer ke seksi Penyempurnaan",
      value: 1100,
    },
    {
      uuid: "b8f83843-aabb-42b6-b27d-5fc2e86a61f5",
      alias: "Persediaan akhir Barang dalam proses seksi Kertas",
      value: 300,
    },
    {
      uuid: "be679b57-36a0-4fc1-afba-8ce9d2aaada9",
      alias: "Produk hilang dalam proses",
      value: 100,
    },
  ]);
  const [dataPerecent, setDataPercent] = useState([
    {
      uuid: "210888ad-9eda-47a4-8304-c82f3d9fe854",
      alias: "Barang dalam proses awal",
      bbb: 100,
      btkl: 50,
      bop: 60,
      status: "dummy",
    },
    {
      uuid: "b8f83843-aabb-42b6-b27d-5fc2e86a61f5",
      alias: "Barang dalam proses akhir",
      bbb: 100,
      btkl: 70,
      bop: 70,
      status: "legacy",
    },
  ]);
  // #endregion data dumm

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs16/data/${id}/soal`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          setLoad(false);

          if (!res.data.status) {
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

          if (res.data.datatabel.length > 0) setDataTabel(res.data.datatabel);
          if (res.data.datasoal.length > 0) setDataSoal(res.data.datasoal);
          if (res.data.dprcnt.length > 0) setDataPercent(res.data.dprcnt);

          // deff soal
          if (!res.data.config.narasisoal) {
            const x = {
              ...res.data.config,
              narasisoal:
                '<p style="text-align:left;"><strong>Game Simulasi 16 - Penyusunan Laporan</strong></p>\n<p>Langkah Pengerjaan:<br>1) Drag and drop data produksi ke dalam tabel laporan sesuai posisi<br>2) Klik check untuk pengecekan</p>\n',
            };
            setDataConfig(x);
          } else {
            setDataConfig(res.data.config);
          }

          setOri(res.data);
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
  }, [id, update, history]);

  const saveToDbGs16 = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs16/data/update`,
      {
        idc: id,
        dataConf: dataConfig,
        dataTabel: dataTabel,
        dataSoal: dataSoal,
        dataPerecent: dataPerecent,
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
          // console.log(data);
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

  const cek = () => {
    if (ori && dataConfig) {
      if (
        !isEqual(ori.config, dataConfig) ||
        !isEqual(ori.datatabel, dataTabel) ||
        !isEqual(ori.datasoal, dataSoal) ||
        !isEqual(ori.dprcnt, dataPerecent)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>GS 16 | Admin</title>
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
            Konfigurasi Game Simulasi 16
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
              {ori ? (
                <EditorNarasiSoal
                  dataConfig={dataConfig}
                  setdataConfig={(dat) => setDataConfig(dat)}
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
            <LaporanAdmin
              dataConfig={dataConfig}
              setDataConfig={(x) => setDataConfig(x)}
              dataTabel={dataTabel}
              setDataTabel={(x) => setDataTabel(x)}
              dataSoal={dataSoal}
              setDataSoal={(x) => setDataSoal(x)}
              dataPerecent={dataPerecent}
              setDataPercent={(x) => setDataPercent(x)}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <TabelSoalAdmin
              dataConfig={dataConfig}
              setDataConfig={(x) => setDataConfig(x)}
              dataTabel={dataTabel}
              setDataTabel={(x) => setDataTabel(x)}
              dataSoal={dataSoal}
              setDataSoal={(x) => setDataSoal(x)}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <PercentAdmin
              dataConfig={dataConfig}
              setDataConfig={(x) => setDataConfig(x)}
              dataPerecent={dataPerecent}
              setDataPercent={(x) => setDataPercent(x)}
            />
          </Grid>
        </Grid>
      </div>

      <Button
        variant="contained"
        className={classes.btnaddadata}
        style={{ marginTop: "14px", marginRight: "10px" }}
        endIcon={
          load ? (
            <CircularProgress
              size={20}
              thickness={4}
              style={{ color: "white" }}
            />
          ) : (
            <Save />
          )
        }
        onClick={() => saveToDbGs16()}
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
          if (cek()) {
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
