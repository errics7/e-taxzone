//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";
import ReactHtmlParser from "react-html-parser";
import { find } from "lodash";
import toast from "react-hot-toast";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import LaporanBiayaMhs from "../components/LaporanBiayaMhs";
import InfoBiayaMhs from "../components/InfoBiayaMhs";
import InfoTingkatPenyelesaianMhs from "../components/InfoTingkatPenyelesaianMhs";
import ListBukuBesarMhs from "../components/ListBukuBesarMhs";
import swal from "sweetalert";
import { CircularProgress } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  btnback: {
    backgroundColor: "#7C7C7C",
    textTransform: "none",
    marginLeft: "10px",
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

export default function Gs17PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  const [jawab1, setJawab1] = useState([]);
  const [jawab2, setJawab2] = useState([]);
  const [checking, setChecking] = useState(false);
  const [alldone, setAlldone] = useState(false);

  //#region default data
  const [dataConfig, setDataConfig] = useState(
    null
    // { narasisoal: "",
    // namept: "PT. MITRA ANTAR POLINDO",
    // title: "LAPORAN BIAYA PRODUKSI - SEKSI KERTAS",
    // subtitle: "UNTUK TAHUN YANG BERAKHIR PADA 31 DESEMBER 2021",
    // subtable1: "Biaya dibebankan ke Departemen",
    // subtable2: "Total Biaya dibebankan ke Dept",
    // keteranganpen: "Barang dalam proses akhir",
    // bbb: 100,
    // btkl: 70,
    // bop: 70,}
  );
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
  //#endregion default data

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

          setDataConfig(res.data.config);
          setDataBB(res.data.dataBB);
          setDataAkun(res.data.dataAkun);
          setDataPersediaan(res.data.dataPersediaan);
          setDataRedaksi(res.data.dataRedaksi);
          //#region Jawab1
          const j1 = [];
          const data1 = res.data.dataPersediaan.filter((el) => el.type === "1");
          data1.forEach((element) => {
            const dat = find(res.data.dataAkun, { uuid: element.eluid });

            j1.push({
              jawab: dat ? dat.debit : element.valtotbiaya,
              value: 0,
              error: false,
            });
          });
          setJawab1(j1);
          //#endregion Jawab1
          const j2 = [];
          const data2 = res.data.dataPersediaan.filter((el) => el.type === "2");
          data2.forEach((element, index) => {
            const dat = find(res.data.dataAkun, { uuid: element.eluid });
            const d2 = dat ? dat.debit : element.valtotbiaya;
            const byunit =
              (Number(j1[index].jawab) + Number(d2)) / Number(element.valekuiv);
            j2.push({
              jtotbiaya: dat ? dat.debit : element.valtotbiaya,
              valtotbiaya: 0,
              error_valtotbiaya: false,
              jekuiv: element.valekuiv,
              valekuiv: 0,
              error_valekuiv: false,
              jbyunit: byunit,
              valbyunit: 0,
              error_valbyunit: false,
            });
          });
          setJawab2(j2);
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

  const check = () => {
    setChecking(true);
    // console.log("j", jawab1);
    // console.log("j2", jawab2);
    const result = [];
    //Jawab1
    jawab1.forEach((item, index) => {
      if (item.jawab === item.value) {
        result.push(true);
      } else {
        result.push(false);
        jawab1[index].error = true;
      }
    });
    //Jawab2
    jawab2.forEach((item, index) => {
      // valtotbiaya
      if (item.jtotbiaya === item.valtotbiaya) {
        result.push(true);
      } else {
        result.push(false);
        jawab2[index].error_valtotbiaya = true;
      }
      //valekuiv
      if (item.jekuiv === item.valekuiv) {
        result.push(true);
      } else {
        result.push(false);
        jawab2[index].error_valekuiv = true;
      }
      // valbyunit
      if (item.jbyunit === item.valbyunit) {
        result.push(true);
      } else {
        result.push(false);
        jawab2[index].error_valbyunit = true;
      }
    });

    setJawab1(jawab1);
    setJawab2(jawab2);
    if (result.every((x) => x === true)) {
      setAlldone(true);
      toast.success(`Yay Benar semua `, {
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
        success: {
          duration: 10000,
        },
      });
    }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 17</title>
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
        {dataConfig ? (
          ReactHtmlParser(dataConfig.narasisoal)
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>
      <div className="relative">
        {load && <LoadingWait />}
        <Grid container spacing={2} direction="row" alignItems="stretch">
          <Grid item xs={12} md={12} lg={12}>
            <div className="bg-white">
              <LaporanBiayaMhs
                jawab1={jawab1}
                setJawab1={(x) => setJawab1(x)}
                jawab2={jawab2}
                setJawab2={(x) => setJawab2(x)}
                dataConfig={dataConfig}
                dataAkun={dataAkun}
                dataPersediaan={dataPersediaan}
                checking={checking}
              />
              {/* SECTION CHECK */}
              <div
                className={`flex flex-row-reverse py-1 w-full  bg-gradient-to-l from-slate-100`}
              >
                {alldone ? (
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
                      check();
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
                    setAlldone(false);
                    setUpdate(update + 1);
                  }}
                  endIcon={
                    load ? (
                      <CircularProgress
                        size={20}
                        thickness={4}
                        style={{ color: "white" }}
                      />
                    ) : null
                  }
                >
                  Reset
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={12} lg={12} className="border relative">
            <div className="bg-white">
              <div className="absolute opacity-50 italic font-semibold p-1 pr-2">
                Data (soal):
              </div>
              <br />
              <InfoBiayaMhs
                dataRedaksi={dataRedaksi}
                setDataRedaksi={(x) => setDataRedaksi(x)}
              />
              <InfoTingkatPenyelesaianMhs
                dataConfig={dataConfig}
                setDataConfig={(x) => setDataConfig(x)}
              />
              <br />
              <ListBukuBesarMhs
                dataBB={dataBB}
                dataAkun={dataAkun}
                dataPersediaan={dataPersediaan}
              />
            </div>
          </Grid>
        </Grid>
      </div>
      <br />
    </div>
  );
}
