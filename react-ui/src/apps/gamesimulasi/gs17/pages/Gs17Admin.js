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

import LoadingWait from "../../../dashboard/component/LoadingWait";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import LaporanBiayaAdmin from "../components/LaporanBiayaAdmin";
import ListBukuBesar from "../components/ListBukuBesar";
import InfoBiayaAdmin from "../components/InfoBiayaAdmin";
import InfoTingkatPenyelesaianAdmin from "../components/InfoTingkatPenyelesaianAdmin";
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

export default function Gs17Admin(props) {
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
    keteranganpen: "Barang dalam proses akhir",
    bbb: 100,
    btkl: 70,
    bop: 70,
  });
  const [dataBB, setDataBB] = useState([
    {
      uuid: "52cfbfd3-f027-4d0f-abd6-9add693294ef",
      namaakun: "BDP - Biaya Bahan Baku Sie Kertas",
      kode: "540",
    },
    {
      uuid: "6861a951-874b-4d64-ba40-2208fd862bf3",
      namaakun: "BDP - Biaya Bahan penolong Sie Kertas",
      kode: "541",
    },
    {
      uuid: "079331ab-05e2-4e22-998a-131ba95eb554",
      namaakun: "BDP - Biaya Tenaga Kerja Sie Kertas",
      kode: "542",
    },
    {
      uuid: "7974acbd-2ab0-47b9-8e2b-5ffdb22b0609",
      namaakun: "BDP - Biaya Overhead Pabrik Sie Kertas",
      kode: "543",
    },
  ]);
  const [dataAkun, setDataAkun] = useState([
    {
      uuid: "b0b55700-a284-4075-b307-3a8e5b624f0d",
      cuid: "52cfbfd3-f027-4d0f-abd6-9add693294ef",
      tgl: "1",
      keterangan: "Saldo awal",
      ref: "NSA",
      debit: 0,
      kredit: 0,
      status: "non",
    },
    {
      uuid: "c3d2d082-ea07-48d7-adef-ac2be96ba7f5",
      cuid: "52cfbfd3-f027-4d0f-abd6-9add693294ef",
      tgl: "31",
      keterangan: "Pemakaian bahan",
      ref: "RJB",
      debit: 49000,
      kredit: 0,
      status: "2",
    },
    {
      uuid: "c45237c0-e7d9-44a6-8ef4-c7f60917b793",
      cuid: "52cfbfd3-f027-4d0f-abd6-9add693294ef",
      tgl: "31",
      keterangan: "RJ Memorial",
      ref: "RJM",
      debit: 27000,
      kredit: 0,
      status: "1",
    },
    {
      uuid: "09f30d44-9158-409d-b468-d50cbfc365c5",
      cuid: "6861a951-874b-4d64-ba40-2208fd862bf3",
      tgl: "1",
      keterangan: "Saldo awal",
      ref: "NSA",
      debit: 0,
      kredit: 0,
      status: "non",
    },
    {
      uuid: "3b04d6e8-b426-4ac7-a02c-e4220734484f",
      cuid: "6861a951-874b-4d64-ba40-2208fd862bf3",
      tgl: "31",
      keterangan: "Pemakaian bahan",
      ref: "RJB",
      debit: 113980,
      kredit: 0,
      status: "2",
    },
    {
      uuid: "132a2775-4690-40af-9140-b1251c404320",
      cuid: "6861a951-874b-4d64-ba40-2208fd862bf3",
      tgl: "31",
      keterangan: "RJ Memorial",
      ref: "RJM",
      debit: 1300,
      kredit: 0,
      status: "1",
    },
    {
      uuid: "22104af0-fdb8-4bdf-8b6e-df55503ce32c",
      cuid: "079331ab-05e2-4e22-998a-131ba95eb554",
      tgl: "1",
      keterangan: "Saldo awal",
      ref: "NSA",
      debit: 0,
      kredit: 0,
      status: "non",
    },
    {
      uuid: "a3080578-85a7-4bd9-af3a-08547afbbbe1",
      cuid: "079331ab-05e2-4e22-998a-131ba95eb554",
      tgl: "31",
      keterangan: "RJ Memorial",
      ref: "RJB",
      debit: 2200,
      kredit: 0,
      status: "1",
    },
    {
      uuid: "592ff3ac-945c-4ca7-9b1e-c8bfb433bac0",
      cuid: "079331ab-05e2-4e22-998a-131ba95eb554",
      tgl: "31",
      keterangan: "Penyesuaian 1",
      ref: "ADJ-1",
      debit: 8280,
      kredit: 0,
      status: "2",
    },
    {
      uuid: "6ecc2338-ca30-4387-833c-8ad3e4e71347",
      cuid: "7974acbd-2ab0-47b9-8e2b-5ffdb22b0609",
      tgl: "1",
      keterangan: "Saldo awal",
      ref: "NSA",
      debit: 0,
      kredit: 0,
      status: "non",
    },
    {
      uuid: "98c5a7c9-e2a3-4ed3-89c3-58ccffea1ef6",
      cuid: "7974acbd-2ab0-47b9-8e2b-5ffdb22b0609",
      tgl: "31",
      keterangan: "RJ Memorial",
      ref: "RJB",
      debit: 3000,
      kredit: 0,
      status: "1",
    },
    {
      uuid: "f9642427-6619-46fc-a5e6-22894f0bf601",
      cuid: "7974acbd-2ab0-47b9-8e2b-5ffdb22b0609",
      tgl: "31",
      keterangan: "Penyesuaian 3",
      ref: "ADJ-3",
      debit: 141100,
      kredit: 0,
      status: "2",
    },
  ]);
  const [dataPersediaan, setDataPersediaan] = useState([
    {
      uuid: "ab8070c9-6b91-4ecb-a2ed-bc748b360cee",
      eluid: "c45237c0-e7d9-44a6-8ef4-c7f60917b793",
      name: "Biaya Dept sebelumnya",
      type: "1",
      valtotbiaya: 0,
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
      valtotbiaya: 0,
      valekuiv: 0,
      valbiayaunit: 0,
    },
    {
      uuid: "43544f41-a756-45b0-bc36-452d9b64a409",
      eluid: "a3080578-85a7-4bd9-af3a-08547afbbbe1",
      name: "Tenaga kerja",
      type: "1",
      valtotbiaya: 0,
      valekuiv: 0,
      valbiayaunit: 0,
    },
    {
      uuid: "896d50f7-c845-4e26-b919-f8647f792913",
      eluid: "98c5a7c9-e2a3-4ed3-89c3-58ccffea1ef6",
      name: "Overhead pabrik",
      type: "1",
      valtotbiaya: 0,
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
      valtotbiaya: 0,
      valekuiv: 1400,
      valbiayaunit: 0,
    },
    {
      uuid: "d4f3d442-a290-4301-b2c7-7bcaa364c5fb",
      eluid: "3b04d6e8-b426-4ac7-a02c-e4220734484f",
      name: "Bahan Penolong",
      type: "2",
      valtotbiaya: 0,
      valekuiv: 1310,
      valbiayaunit: 0,
    },
    {
      uuid: "35189ce1-1d4e-4209-86d0-4409c5374ef3",
      eluid: "592ff3ac-945c-4ca7-9b1e-c8bfb433bac0",
      name: "Tenaga kerja",
      type: "2",
      valtotbiaya: 0,
      valekuiv: 1310,
      valbiayaunit: 0,
    },
    {
      uuid: "140ccb66-245b-4ea3-8987-499e458e8de1",
      eluid: "f9642427-6619-46fc-a5e6-22894f0bf601",
      name: "Overhead pabrik",
      type: "2",
      valtotbiaya: 0,
      valekuiv: 1310,
      valbiayaunit: 0,
    },
  ]);
  const [dataRedaksi, setDataRedaksi] = useState([
    {
      uuid: "bef676f5-c5fb-4c9f-bb02-528514edd79a",
      redaksi: "Persediaan awal barang dalam proses seksi kertas",
      unitprod: 200,
      biaya: 0,
    },
    {
      uuid: "34f7137a-ba46-4891-afa8-527771b4565d",
      redaksi: "Diterima dari seksi Pulp",
      unitprod: 900,
      biaya: 0,
    },
    {
      uuid: "a1453256-313b-47e4-a4a6-48ca9bc19f30",
      redaksi: "Unit yang ditambahkan di seksi kertas",
      unitprod: 400,
      biaya: 0,
    },
    {
      uuid: "936bb617-4110-4822-b6ae-c563b9dcb98a",
      redaksi:
        "Unit selesai seksi kertas yang ditransfer ke seksi Penyempurnaan",
      unitprod: 1100,
      biaya: 0,
    },
    {
      uuid: "127be0cc-b202-481a-94bb-80864ba23a37",
      redaksi: "Persediaan akhir Barang dalam proses seksi Kertas",
      unitprod: 300,
      biaya: 0,
    },
    {
      uuid: "ea15590b-7944-41e8-b2c8-1be6ccc9059b",
      redaksi: "Produk hilang di awal proses",
      unitprod: 100,
      biaya: 0,
    },
    {
      uuid: "79a1db57-a9aa-47ba-a336-ca1f85bdfc76",
      redaksi: "Biaya produksi dari Sie Pulp",
      unitprod: 0,
      biaya: 59800,
    },
  ]);
  const [ori, setOri] = useState(null);
  //#endregion default data

  //#region func
  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs17/data/${id}/soal`, {
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

          if (res.data.dataBB.length > 0) setDataBB(res.data.dataBB);
          if (res.data.dataAkun.length > 0) setDataAkun(res.data.dataAkun);
          if (res.data.dataPersediaan.length > 0)
            setDataPersediaan(res.data.dataPersediaan);
          if (res.data.dataRedaksi.length > 0)
            setDataRedaksi(res.data.dataRedaksi);

          // deff soal
          if (!res.data.config.narasisoal) {
            const x = {
              ...res.data.config,
              narasisoal:
                '<p><strong>Game Simulasi 17 - </strong><span style="font-size: 11pt;font-family: Calibri, sans-serif;"><strong>MENYUSUN LAPORAN BIAYA PRODUKSI (BAGIAN KE-2)</strong></span><strong>  </strong></p>\n<p>Di bawah ini adalah potongan Laporan Biaya Produksi yang menampilkan "Biaya Dibebankan ke Departemen" (Bagian ke-2). Kerjakanlah perhitungan biayanya dengan mengikuti langkah-langkah berikut.&nbsp;&nbsp;</p>\n<p>Langkah pengerjaan : <br><span style="font-size: 11pt;font-family: Calibri, sans-serif;">1) Perhatikan Data Biaya &amp; Produksi, serta beberapa Buku Besar yang telah disediakan pada Data Soal</span> <br><span style="font-size: 11pt;font-family: Calibri, sans-serif;">2) Isilah nilai biaya untuk Persediaan Awal berdasarkan data Buku Besar pada pencatatan transaksi Jurnal Memorial. Setelah selesai kemudian jumlahnya biayanya.</span>&nbsp;</p>\n',
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

  const saveToDbGs17 = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs17/data/update`,
      {
        idc: id,
        dataConf: dataConfig,
        dataBB: dataBB,
        dataAkun: dataAkun,
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
        !isEqual(ori.dataAkun, dataAkun) ||
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
        <title>GS 17 | Admin</title>
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
            Konfigurasi Game Simulasi 17
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
              dataAkun={dataAkun}
              setDataAkun={(x) => setDataAkun(x)}
              dataPersediaan={dataPersediaan}
              setDataPersediaan={(x) => setDataPersediaan(x)}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <ListBukuBesar
              dataBB={dataBB}
              setDataBB={(x) => setDataBB(x)}
              dataAkun={dataAkun}
              setDataAkun={(x) => setDataAkun(x)}
              dataPersediaan={dataPersediaan}
              setDataPersediaan={(x) => setDataPersediaan(x)}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <div className="bg-white">
              <InfoBiayaAdmin
                dataRedaksi={dataRedaksi}
                setDataRedaksi={(x) => setDataRedaksi(x)}
              />
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
        onClick={() => saveToDbGs17()}
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
