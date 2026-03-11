//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { isEqual } from "lodash";

import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";

import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { CircularProgress, Grid } from "@mui/material";
import {
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerBadge,
} from "react-shimmer-effects";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import DataAkun from "../components/DataAkun";
import DataSelected from "../components/DataSelected";
import InformasiPenyusutan from "../components/InformasiPenyusutan";
import InformasiKeterangan from "../components/InformasiKeterangan";
import AdminBuktiMemorial from "../components/AdminBuktiMemorial";
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

export default function Gs10Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  const [ori, setOri] = useState(null);
  const [dataConfig, setDataConfig] = useState(null);
  const [dataAkun, setDataAkun] = useState([]);
  const [dataSelected, setDataSelected] = useState([]);
  const [dataAlokasi, setDataAlokasi] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs10/data/${id}/soal`, {
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

          setDefaultValue(res.data);
          setOri(res.data);
          //
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

  const setDefaultValue = (inp) => {
    // deff soalnarasi
    if (!inp.config.narasisoal) {
      const x = {
        ...inp.config,
        narasisoal:
          '<p><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: inherit;font-family: inherit;">Pada games sesi ini, mahasiswa meminta untuk mengisi bukti memorial dengan cara melakukan <strong>isian pengetikan</strong> dari data akun yang tersedia dengan tahapan berikut:</span></p>\n<p><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: inherit;font-family: inherit;">1) Isi biaya penyusutan gedung </span></p>\n<p><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: inherit;font-family: inherit;">2) Isi biaya alokasi pada sie pulp</span></p>\n<p><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: inherit;font-family: inherit;">3) Isi biaya alokasi pada sie kertas </span></p>\n',
      };
      setDataConfig(x);
    } else {
      setDataConfig(inp.config);
    }
    if (inp.selected.length < 1) {
      setDataSelected([
        {
          sorting: 0,
          code: "121",
          name: "Akumulasi Penyusutan Gedung",
          jenis: "kredit",
          idbank: 5,
          used: true,
          code_dnd: "121",
          tableData: {
            id: 0,
          },
        },
        {
          sorting: 1,
          code: "520",
          name: "BOP Sesungguhnya seksi pulp",
          jenis: "debit",
          idbank: 15,
          used: true,
          code_dnd: "520",
          tableData: {
            id: 1,
          },
        },
        {
          sorting: 2,
          code: "521",
          name: "BOP Sesungguhnya Sie Kertas",
          jenis: "debit",
          idbank: 16,
          used: true,
          code_dnd: "521",
          tableData: {
            id: 2,
          },
        },
      ]);
    } else setDataSelected(inp.selected);
    if (inp.dataalokasi.length < 1) {
      setDataAlokasi([
        {
          id: 562,
          id_config: 132,
          kodeacuan: "520",
          nama: "Pulp",
          nilai: 20,
          sorting: 0,
        },
        {
          id: 563,
          id_config: 132,
          kodeacuan: "521",
          nama: "Sie Kertas",
          nilai: 80,
          sorting: null,
        },
      ]);
    } else setDataAlokasi(inp.dataalokasi);

    setDataAkun(inp.dataakun);
  };

  const saveToDbGs10 = () => {
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs10/data/update`,
      {
        idc: id,
        dataConf: dataConfig,
        dataSelected: dataSelected,
        dataAlokasi: dataAlokasi,
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
        loading: "Simpan Data...",
        success: (data) => {
          setLoad(false);
          console.log(data);
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
        !isEqual(ori.selected, dataSelected) ||
        !isEqual(ori.dataalokasi, dataAlokasi)
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
        <title>GS 10 | Admin</title>
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
            Konfigurasi Game Simulasi 10
          </div>
        </div>
      </div>
      {/* CONTAINER  */}
      <div className="relative">
        {load && <LoadingWait />}
        <br />

        <Grid container spacing={2} direction="row" alignItems="stretch">
          <Grid item xs={12} md={12} lg={12}>
            <span className="mt-5 block">Soal Editor:</span>
            <div className="border min-h-5v">
              {dataConfig ? (
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
          <Grid item xs={12} md={6} lg={6}>
            {!dataConfig ? (
              <div className="bg-white p-5">
                <br />
                <ShimmerBadge width={200} />
                <ShimmerTable row={2} col={3} />;
                <br />
                <ShimmerTable row={2} col={3} />;
              </div>
            ) : (
              <div className="p-3 border border-dashed bg-white">
                <DataSelected data={dataSelected} />
                <InformasiPenyusutan
                  data={dataConfig}
                  setdata={(d) => setDataConfig(d)}
                  dataselected={dataSelected}
                  alokasi={dataAlokasi}
                  setalokasi={(d) => setDataAlokasi(d)}
                />
                <br />
                <br />
                <InformasiKeterangan data={dataConfig} alokasi={dataAlokasi} />
                <AdminBuktiMemorial
                  config={dataConfig}
                  setConfig={(x) => setDataConfig(x)}
                  alokasi={dataAlokasi}
                />
              </div>
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            {ori ? (
              <DataAkun
                dataakun={dataAkun}
                setdata={(sel, all) => {
                  setDataAkun(all);
                  setDataSelected(sel);
                }}
                update={() => setUpdate(update + 1)}
              />
            ) : (
              <div className="bg-white">
                <div className="flex justify-center">
                  <ShimmerBadge width={200} />
                </div>
                <ShimmerTable row={4} col={5} />;
              </div>
            )}
          </Grid>
        </Grid>

        <br />
        <br />
      </div>
      <Button
        variant="contained"
        className={classes.btnsavedata}
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
        onClick={() => saveToDbGs10()}
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
