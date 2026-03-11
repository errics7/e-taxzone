//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";
import ReactHtmlParser from "react-html-parser";
import { sum } from "lodash";
import toast from "react-hot-toast";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";

import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import InfoTingkatPenyelesaianMhs from "../../gs17/components/InfoTingkatPenyelesaianMhs";
import InfoBiayaMhs18 from "../components/InfoBiayaMhs18";
import LaporanBiayaMhs18 from "../components/LaporanBiayaMhs18";
import { CircularProgress } from "@mui/material";
import swal from "sweetalert";

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

export default function Gs18PreviewMahasiswa(props) {
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
    // {
    // narasisoal: "",
    // namept: "PT. MITRA ANTAR POLINDO",
    // title: "LAPORAN BIAYA PRODUKSI - SEKSI KERTAS",
    // subtitle: "UNTUK TAHUN YANG BERAKHIR PADA 31 DESEMBER 2021",
    // subtable1: "Biaya dibebankan ke Departemen",
    // subtable2: "Total Biaya dibebankan ke Dept",
    // subtable3: "Biaya Dipertanggungjawabkan",
    // keteranganpen: "Barang dalam proses akhir",
    // bbb: 100,
    // btkl: 70,
    // bop: 70,
    // }
  );
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
          setDataConfig(res.data.config);
          setDataPersediaan(res.data.dataPersediaan);
          setDataRedaksi(res.data.dataRedaksi);
          //opra
          var bunit2 = [];
          const jw1 = [];
          const jw2 = [];
          const djw1 = res.data.dataPersediaan.filter((el) => el.type === "1");
          const djw2 = res.data.dataPersediaan.filter((el) => el.type === "2");
          const djw3 = res.data.dataPersediaan.filter((el) => el.type === "3");
          const djw4 = res.data.dataPersediaan.filter((el) => el.type === "4");
          const sunit = djw1.length === djw2.length ? true : false;
          djw2.forEach((element, index) => {
            //for hitung biaya/unit
            if (sunit) {
              const d1 = djw1[index].valtotbiaya;
              const d2 = element.valtotbiaya;
              //
              if (Number(element.valekuiv) === 0) {
                bunit2.push(0);
              } else {
                bunit2.push(
                  (Number(d1) + Number(d2)) / Number(element.valekuiv)
                );
              }
            }
            // totalbiayaunit += Number(bunit);
          });
          //#region Jawaban1
          djw3.forEach((element) => {
            jw1.push({
              unit: element.valbiayaunit,
              val_unit: 0,
              err_unit: false,
              penyelesaian: element.valekuiv,
              val_penyelesaian: 0,
              err_penyelesaian: false,
              uekuiv:
                Number(element.valbiayaunit) * (Number(element.valekuiv) / 100),
              val_uekuiv: 0,
              err_uekuiv: false,
              biayaunit: sum(bunit2),
              val_biayaunit: 0,
              err_biayaunit: false,
            });
          });
          //#endregion Jawaban1
          //#region Jawab2
          // console.log("djw4", djw4);
          djw4.forEach((element, index) => {
            const x =
              parseFloat(
                Number(element.valbiayaunit) * (Number(element.valekuiv) / 100)
              ).toFixed(2) * parseFloat(bunit2[index]).toFixed(2);

            jw2.push({
              unit: element.valbiayaunit,
              penyelesaian: element.valekuiv,
              uekuiv:
                Number(element.valbiayaunit) * (Number(element.valekuiv) / 100),
              biayaunit: parseFloat(
                parseFloat(bunit2[index] ? bunit2[index] : 0).toFixed(2)
              ),
              tot: parseFloat(parseFloat(x).toFixed(2)),
              val_unit: 0,
              val_penyelesaian: 0,
              val_uekuiv: 0,
              val_biayaunit: 0,
              val_tot: 0,
              err_unit: false,
              err_penyelesaian: false,
              err_uekuiv: false,
              err_biayaunit: false,
              err_tot: false,
            });
          });
          //#endregion Jawab2
          // console.log("jw2", jw2);
          setJawab1(jw1);
          setJawab2(jw2);
        })
        .catch((error) => {
          setLoad(false);
          // if (error.response && !error.response.data.auth)
          //   dispatch({ type: "LOGOUT" });
        });
    };

    fetchData();
  }, [id, history, update]);
  const check = () => {
    setChecking(true);
    // console.log(jawab1);
    // console.log(jawab2);
    const result = [];
    //#region FIlter Jawaban 1
    jawab1.forEach((item, index) => {
      // console.log(item.val_unit);
      //unit
      if (item.val_unit === item.unit) {
        result.push(true);
      } else {
        result.push(false);
        jawab1[index].err_unit = true;
      }
      //penyelesaian
      if (item.val_penyelesaian === item.penyelesaian) {
        result.push(true);
      } else {
        result.push(false);
        jawab1[index].err_penyelesaian = true;
      }
      //uekuiv
      if (item.val_uekuiv === item.uekuiv) {
        result.push(true);
      } else {
        result.push(false);
        jawab1[index].err_uekuiv = true;
      }
      //biayaunit
      if (
        item.val_biayaunit === parseFloat(parseFloat(item.biayaunit).toFixed(2))
      ) {
        result.push(true);
      } else {
        // console.log(
        //   "err",
        //   item.val_biayaunit +
        //     ":" +
        //     parseFloat(parseFloat(item.biayaunit).toFixed(2))
        // );
        result.push(false);
        jawab1[index].err_biayaunit = true;
      }
    });
    //#endregion FIlter Jawaban 1
    // 2
    //#region FIlter Jawaban 2
    jawab2.forEach((item, index) => {
      // console.log(item.val_unit);
      //unit
      if (item.val_unit === item.unit) {
        result.push(true);
      } else {
        result.push(false);
        jawab2[index].err_unit = true;
      }
      //penyelesaian
      if (item.val_penyelesaian === item.penyelesaian) {
        result.push(true);
      } else {
        result.push(false);
        jawab2[index].err_penyelesaian = true;
      }
      //uekuiv
      if (item.val_uekuiv === item.uekuiv) {
        result.push(true);
      } else {
        result.push(false);
        jawab2[index].err_uekuiv = true;
      }
      //biayaunit
      if (item.val_biayaunit === item.biayaunit) {
        result.push(true);
      } else {
        result.push(false);
        jawab2[index].err_biayaunit = true;
      }
      //tot
      if (item.val_tot === item.tot) {
        result.push(true);
      } else {
        result.push(false);
        jawab2[index].err_tot = true;
      }
    });
    //#endregion FIlter Jawaban 2

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
  //#endregion func

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 18</title>
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
            <div className="border p-1 bg-white">
              <div className="absolute opacity-50 italic font-semibold p-1 pr-2">
                Data (soal):
              </div>
              <br />
              <InfoBiayaMhs18
                dataRedaksi={dataRedaksi}
                setDataRedaksi={(x) => setDataRedaksi(x)}
              />
              {/* Memakai gs17 comp */}
              <InfoTingkatPenyelesaianMhs
                dataConfig={dataConfig}
                setDataConfig={(x) => setDataConfig(x)}
              />
            </div>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <div className="bg-white">
              <LaporanBiayaMhs18
                dataConfig={dataConfig}
                dataPersediaan={dataPersediaan}
                jawab1={jawab1}
                setJawab1={(x) => setJawab1(x)}
                jawab2={jawab2}
                setJawab2={(x) => setJawab2(x)}
                checking={checking}
              />
              {/* SECTION CHECk BTN */}
              <div
                className={`flex flex-row-reverse py-1 w-full  bg-gradient-to-l from-slate-100`}
              >
                {alldone ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.btnupdate}
                    onClick={() => {
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
        </Grid>
      </div>
      <br />
    </div>
  );
}
