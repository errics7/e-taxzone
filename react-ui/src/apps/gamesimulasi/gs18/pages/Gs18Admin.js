//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { isEqual } from "lodash";
import makeStyles from "@mui/styles/makeStyles";
import { CircularProgress, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Save from "@mui/icons-material/Save";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LaporanBiayaAdmin from "../components/LaporanBiayaAdmin";
import InfoTingkatPenyelesaianAdmin from "../../gs17/components/InfoTingkatPenyelesaianAdmin";
import InfoBiayaAdmin18 from "../components/InfoBiayaAdmin18";
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

export default function Gs18Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  //#region default data
  const [dataConfig, setDataConfig] = useState({
    narasisoal: "",
    namept: "PT. MITRA ANTAR POLINDO",
    title: "LAPORAN BIAYA PRODUKSI - SEKSI KERTAS",
    subtitle: "UNTUK TAHUN YANG BERAKHIR PADA 31 DESEMBER 2021",
    subtable1: "Biaya dibebankan ke Departemen",
    subtable2: "Total Biaya dibebankan ke Dept",
    subtable3: "Biaya Dipertanggungjawabkan",
    keteranganpen: "Barang dalam proses akhir",
    bbb: 100,
    btkl: 70,
    bop: 70,
  });
  const [dataPersediaan, setDataPersediaan] = useState([
    {
      uuid: "ab8070c9-6b91-4ecb-a2ed-bc748b360cee",
      eluid: "c45237c0-e7d9-44a6-8ef4-c7f60917b793",
      name: "Biaya Dept sebelumnya",
      type: "1",
      valtotbiaya: "27000",
      valekuiv: 0,
      valbiayaunit: 0,
    },
    {
      uuid: "3e8e0285-7687-4a40-97aa-7d27363759ca",
      eluid: "xxxx",
      name: "Bahan Baku",
      type: "1",
      valtotbiaya: 0,
      valekuiv: 0,
      valbiayaunit: 0,
    },
    {
      uuid: "dbba71bc-5b2a-4379-9635-8b10392e670e",
      eluid: "132a2775-4690-40af-9140-b1251c404320",
      name: "Bahan Penolong",
      type: "1",
      valtotbiaya: "1300",
      valekuiv: 0,
      valbiayaunit: 0,
    },
    {
      uuid: "43544f41-a756-45b0-bc36-452d9b64a409",
      eluid: "a3080578-85a7-4bd9-af3a-08547afbbbe1",
      name: "Tenaga kerja",
      type: "1",
      valtotbiaya: "2200",
      valekuiv: 0,
      valbiayaunit: 0,
    },
    {
      uuid: "896d50f7-c845-4e26-b919-f8647f792913",
      eluid: "98c5a7c9-e2a3-4ed3-89c3-58ccffea1ef6",
      name: "Overhead pabrik",
      type: "1",
      valtotbiaya: "3000",
      valekuiv: 0,
      valbiayaunit: 0,
    },
    {
      uuid: "5ca9c22a-e4e4-457e-b15a-0c3ba5ac6a59",
      eluid: "xxxx",
      name: "Biaya Dept sebelumnya",
      type: "2",
      valtotbiaya: 59800,
      valekuiv: 1400,
      valbiayaunit: 0,
    },
    {
      uuid: "2f82a775-ebb8-4ce2-befc-0e42faaf7575",
      eluid: "c3d2d082-ea07-48d7-adef-ac2be96ba7f5",
      name: "Bahan Baku",
      type: "2",
      valtotbiaya: "49000",
      valekuiv: 1400,
      valbiayaunit: 0,
    },
    {
      uuid: "d4f3d442-a290-4301-b2c7-7bcaa364c5fb",
      eluid: "3b04d6e8-b426-4ac7-a02c-e4220734484f",
      name: "Bahan Penolong",
      type: "2",
      valtotbiaya: "113980",
      valekuiv: 1310,
      valbiayaunit: 0,
    },
    {
      uuid: "35189ce1-1d4e-4209-86d0-4409c5374ef3",
      eluid: "592ff3ac-945c-4ca7-9b1e-c8bfb433bac0",
      name: "Tenaga kerja",
      type: "2",
      valtotbiaya: "8280",
      valekuiv: 1310,
      valbiayaunit: 0,
    },
    {
      uuid: "140ccb66-245b-4ea3-8987-499e458e8de1",
      eluid: "f9642427-6619-46fc-a5e6-22894f0bf601",
      name: "Overhead pabrik",
      type: "2",
      valtotbiaya: "141100",
      valekuiv: 1310,
      valbiayaunit: 0,
    },
    {
      uuid: "80f12588-53f4-424a-bb1e-66c26c3759bc",
      eluid: "xxxx",
      name: "Ditransfer ke Gudang/Dept..",
      type: "3",
      valtotbiaya: 0,
      valekuiv: 100,
      valbiayaunit: 1100,
    },
    {
      uuid: "0ef8148b-e578-4fcc-b32d-774c30f6b5c2",
      eluid: "xxxx",
      name: "Biaya Dept sebelumnya",
      valekuiv: "100",
      valbiayaunit: "300",
      valtotbiaya: 0,
      type: "4",
    },
    {
      uuid: "5825dc98-bfaa-44be-bbfb-a9ada9772a33",
      eluid: "xxxx",
      name: "Bahan Baku",
      valekuiv: "100",
      valbiayaunit: "300",
      valtotbiaya: 0,
      type: "4",
    },
    {
      uuid: "2a1bfef0-a74a-4e0b-9531-77b6a4b77178",
      eluid: "xxxx",
      name: "Bahan Penolong",
      valekuiv: "70",
      valbiayaunit: "300",
      valtotbiaya: 0,
      type: "4",
    },
    {
      uuid: "ffcca6b1-e7be-4534-9a20-3467c88b608a",
      eluid: "xxxx",
      name: "Tenaga kerja",
      valekuiv: "70",
      valbiayaunit: "300",
      valtotbiaya: 0,
      type: "4",
    },
    {
      uuid: "64da511c-c136-416c-9e8c-fb1f9f43dec3",
      eluid: "xxxx",
      name: "Overhead pabrik",
      valekuiv: "70",
      valbiayaunit: "300",
      valtotbiaya: 0,
      type: "4",
    },
  ]);
  const [dataRedaksi, setDataRedaksi] = useState([
    {
      uuid: "3371fe04-335d-41c8-8692-29941d2193e8",
      redaksi: "Persediaan awal barang dalam proses seksi kertas",
      biaya: "200",
    },
    {
      uuid: "f4098252-4400-4f9d-8a25-06a96d053d70",
      redaksi: "Diterima dari seksi Pulp",
      biaya: "900",
    },
    {
      uuid: "d3343f93-06d0-4c1e-bb3d-75a2bbb63714",
      redaksi: "Unit yang ditambahkan di seksi kertas",
      biaya: "400",
    },
    {
      uuid: "3722d691-f653-4784-9113-6b137502de15",
      redaksi:
        "Unit selesai seksi kertas yang ditransfer ke seksi Penyempurnaan",
      biaya: "1100",
    },
    {
      uuid: "87121a30-7e41-45aa-8433-8287be15b985",
      redaksi: "Persediaan akhir Barang dalam proses seksi Kertas",
      biaya: "300",
    },
    {
      uuid: "2496bb7b-86ca-41a3-81e5-bf829fcb9e2f",
      redaksi: "Produk hilang di awal proses",
      biaya: "100",
    },
  ]);
  const [ori, setOri] = useState(null);
  //#endregion default data

  //#region func
  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs18/data/${id}/soal`, {
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
          if (res.data.dataPersediaan.length > 0)
            setDataPersediaan(res.data.dataPersediaan);
          if (res.data.dataRedaksi.length > 0)
            setDataRedaksi(res.data.dataRedaksi);

          // deff soal
          if (!res.data.config.narasisoal) {
            const x = {
              ...res.data.config,
              narasisoal:
                '<p style="text-align:left;"><strong>GS 18 </strong><br><strong>MENYUSUN LAPORAN BIAYA PRODUKSI (BAGIAN KE-3)</strong><br></p>\n<p>Di bawah ini adalah potongan Laporan Biaya Produksi yang menampilkan "Biaya Dibebankan ke Departemen" (Bagian ke-2) dan "Biaya Dipertanggungjawabkan" (Bagian ke-3).<br>Kerjakanlah perhitungan "Biaya Dipertanggungjawabkan" dengan mengikuti langkah-langkah berikut.</p>\n<p></p>\n<p><strong>Langkah Pengerjaan:</strong><br>1) Perhatikan "Data Produksi" yang telah disediakan pada Data Soal<br>2) Dengan mengacu pada Data Produksi, isilah kolom unit untuk Produk Selesai (Produk yang Ditransfer ke Gudang) dan Produk dalam Proses, dan isi pulalah Tingkat Penyelesaiannya<br>3) Isikan jumlah dari Unit Ekuivalen. Unit Ekuivalen untuk Produk Selesai adalah sejumlah unit yang dikirim ke gudang, sedangkan untuk Produk dalam Proses adalah sejumlah unit dikalikan dengan Tingkat Penyelesaian.<br>4) Tuliskan kembali biaya per unit untuk Produk Selesai dan Produk dalam Proses<br>5) Hitunglah total biaya, kemudian jumlahkan biaya Produk Selesai dan Produk dalamn Proses untuk mendapatkan Total Biaya Dipertanggungjawabkan<br>6) <span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">"Biaya Dibebankan ke Departemen" </span> <span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;">dan "Biaya Dipertanggungjawabkan" </span> jumlahnya harus sama<br>7) Untuk nilai Rupiah gunakanlah akurasi dua angka di belakang koma tanpa pembulatan, contoh untuk nilai dari Rp 1.000,00 dibagi 6 = Rp 166,66<br>8) Pastikan seluruh bilah jawaban sudah diisi dengan benar, lalu klik tombol "Check"</p>\n',
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
  }, [id, history, update]);

  const saveToDbGs18 = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs18/data/update`,
      {
        idc: id,
        dataConf: dataConfig,
        dataPersediaan: dataPersediaan,
        dataRedaksi: dataRedaksi,
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
  const cek = () => {
    if (ori && dataConfig) {
      if (
        !isEqual(ori.config, dataConfig) ||
        !isEqual(ori.dataPersediaan, dataPersediaan) ||
        !isEqual(ori.dataRedaksi, dataRedaksi)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  //#endregion func

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>GS 18 | Admin</title>
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
            Konfigurasi Game Simulasi 18
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
            <LaporanBiayaAdmin
              dataConfig={dataConfig}
              setDataConfig={(x) => setDataConfig(x)}
              dataPersediaan={dataPersediaan}
              setDataPersediaan={(x) => setDataPersediaan(x)}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <div className="px-1 border pb-3 relative bg-white">
              <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
                Tampilan Data(soal):
              </div>
              <br />
              <InfoBiayaAdmin18
                dataRedaksi={dataRedaksi}
                setDataRedaksi={(x) => setDataRedaksi(x)}
              />
              {/* Memakai gs17 comp */}
              <InfoTingkatPenyelesaianAdmin
                ori={ori}
                dataConfig={dataConfig}
                setDataConfig={(x) => setDataConfig(x)}
              />
            </div>
          </Grid>
        </Grid>
      </div>

      <Button
        variant="contained"
        className={classes.btnaddadata}
        style={{ marginTop: "14px", marginRight: "10px" }}
        endIcon={
          ori && load ? (
            <CircularProgress
              size={20}
              thickness={4}
              style={{ color: "white" }}
            />
          ) : (
            <Save />
          )
        }
        onClick={() => saveToDbGs18()}
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
