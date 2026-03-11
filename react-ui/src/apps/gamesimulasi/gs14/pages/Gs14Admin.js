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
import BuktiMemorialAdmin14 from "../components/BuktiMemorialAdmin14";
import BukuPembantuBiayaAdmin14 from "../components/BukuPembantuBiayaAdmin14";
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

export default function Gs14Admin(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  //#region Const
  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  const [sizeCon, setSizeCon] = useState(12);
  const [ori, setOri] = useState(null);
  const [dataConfig, setDataConfig] = useState({
    nobm: "05 /BM/12/2021",
    narasibuktimemo:
      "Alokasi Biaya Seksi Listrik tahun  2021  sebesar  Rp 5.000 dialokasikan ke:",
  });
  const [alokasi, setAlokasi] = useState([
    {
      uuid: "708d0256-ad19-4c92-bc94-c3ea6497c660",
      keterangan: "Seksi Pulp",
      nominal: 1800,
      nopusatbiaya: "520",
      nopembantubiaya: "11",
    },
    {
      uuid: "f7f95a9c-09d4-4c49-a040-6707902e71c5",
      keterangan: "Seksi Kertas",
      nominal: 2400,
      nopusatbiaya: "521",
      nopembantubiaya: "14",
    },
    {
      uuid: "0f41f990-59a1-40d4-a91c-0c05351aa41a",
      keterangan: "Seksi Penyempurnaan",
      nominal: 800,
      nopusatbiaya: "522",
      nopembantubiaya: "61",
    },
  ]);
  const [dataInfo, setDataInfo] = useState([
    {
      uuid: "20c14833-e216-460c-837d-54771cd35d52",
      no_debit: "520",
      val_debit: 1800,
      no_kredit: "511",
      val_kredit: 5000,
    },
    {
      uuid: "a4bf0eb3-7faa-4dea-b89a-1016f42b2754",
      no_debit: "521",
      val_debit: 2400,
      no_kredit: "",
      val_kredit: 0,
    },
    {
      uuid: "60208cfb-df21-42b0-9526-d8d85f37e340",
      no_debit: "522",
      val_debit: 800,
      no_kredit: "",
      val_kredit: 0,
    },
  ]);
  const [listPembantu, setListPembantu] = useState([
    {
      uuid: "77b179ac-7921-40a3-9730-1aa8ba98ad12",
      cuid: "708d0256-ad19-4c92-bc94-c3ea6497c660",
      bln: "Des",
      tgl: "1",
      ket: "Saldo awal",
      ref: "",
      debit: 0,
      kredit: 0,
      status: "no",
    },
    {
      uuid: "1e002e9c-d3d8-4e5c-a089-69c592f90ba1",
      cuid: "708d0256-ad19-4c92-bc94-c3ea6497c660",
      bln: "Des",
      tgl: "2",
      ket: "Produksi - sie pulp",
      ref: "",
      debit: 1800,
      kredit: 0,
      status: "no",
    },
    {
      uuid: "d42f3999-9dd8-4633-8817-1b9119daebbc",
      cuid: "708d0256-ad19-4c92-bc94-c3ea6497c660",
      bln: "Des",
      tgl: "15",
      ket: "Produksi",
      ref: "",
      debit: 2400,
      kredit: 0,
      status: "no",
    },
    {
      uuid: "69006ad6-ae5c-41f0-b615-d09319510a5e",
      cuid: "708d0256-ad19-4c92-bc94-c3ea6497c660",
      bln: "Des",
      tgl: "31",
      ket: "Penyesuaian",
      ref: "",
      debit: 0,
      kredit: 1800,
      status: "key",
    },
    {
      uuid: "776cc01a-d2dc-4a06-aff5-b40f8ea8eb0b",
      cuid: "f7f95a9c-09d4-4c49-a040-6707902e71c5",
      bln: "Des",
      tgl: "1",
      ket: "Saldo awal",
      ref: "",
      debit: 0,
      kredit: 0,
      status: "no",
    },
    {
      uuid: "4de163f5-dbd3-401d-ad02-046f5cca531f",
      cuid: "f7f95a9c-09d4-4c49-a040-6707902e71c5",
      bln: "Des",
      tgl: "2",
      ket: "Produksi sie pulp",
      ref: "",
      debit: 2400,
      kredit: 0,
      status: "no",
    },
    {
      uuid: "85a7a218-91ab-42be-a199-c9ceb462acc0",
      cuid: "f7f95a9c-09d4-4c49-a040-6707902e71c5",
      bln: "Des",
      tgl: "31",
      ket: "Penyesuaian",
      ref: "",
      debit: 0,
      kredit: 2400,
      status: "key",
    },
    {
      uuid: "89f7d0de-a3a8-4091-b43f-a0fe3dd6bba2",
      cuid: "0f41f990-59a1-40d4-a91c-0c05351aa41a",
      bln: "Des",
      tgl: "1",
      ket: "Saldo awal",
      ref: "",
      debit: 0,
      kredit: 0,
      status: "no",
    },
    {
      uuid: "c7eeddc2-3fac-45e7-b558-ed5aac5f7084",
      cuid: "0f41f990-59a1-40d4-a91c-0c05351aa41a",
      bln: "Des",
      tgl: "2",
      ket: "Produksi sie pulp",
      ref: "",
      debit: 800,
      kredit: 0,
      status: "no",
    },
    {
      uuid: "73a7d8c7-8b72-49e8-bfca-948fe85c0976",
      cuid: "0f41f990-59a1-40d4-a91c-0c05351aa41a",
      bln: "Des",
      tgl: "31",
      ket: "Penyesuaian",
      ref: "",
      debit: 0,
      kredit: 800,
      status: "key",
    },
  ]);
  //#endregion Const

  //#region Func
  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs14/data/${id}/soal`, {
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

          // setDataConfig(res.data.config);
          if (res.data.alokasi.length > 0) setAlokasi(res.data.alokasi);
          if (res.data.dataInfo.length > 0) setDataInfo(res.data.dataInfo);
          if (res.data.listPembantu.length > 0)
            setListPembantu(res.data.listPembantu);

          // deff soal
          if (!res.data.config.narasisoal) {
            const x = {
              ...res.data.config,
              narasisoal:
                '<p style="text-align:center;">Simulasi 14</p>\n<p>Langkah Pengerjaan :</p>\n',
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

  const saveToDbGs14 = () => {
    // return;
    if (load) return;
    setLoad(true);

    const push = axios.post(
      `${API.HOST}/api/v2/manufakturgs14/data/update`,
      {
        idc: id,
        dataConf: dataConfig,
        alokasi: alokasi,
        dataInfo: dataInfo,
        listPembantu: listPembantu,
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
        !isEqual(ori.alokasi, alokasi) ||
        !isEqual(ori.dataInfo, dataInfo) ||
        !isEqual(ori.listPembantu, listPembantu)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  //#endregion Func

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>GS 14 | Admin</title>
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
            Konfigurasi Game Simulasi 14
          </div>
        </div>
      </div>
      {/* CONTAINER  */}
      <div className="relative">
        {load && <LoadingWait />}

        {/* bdy */}
        <Grid container spacing={1} direction="row" alignItems="stretch">
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
          <Grid
            item
            xs={12}
            md={sizeCon === 12 ? 8 : 6}
            lg={sizeCon === 12 ? 8 : 6}
          >
            <BuktiMemorialAdmin14
              dataConfig={dataConfig}
              setDataConfig={(x) => setDataConfig(x)}
              alokasi={alokasi}
              setAlokasi={(x) => setAlokasi(x)}
              dataInfo={dataInfo}
              setDataInfo={(x) => setDataInfo(x)}
              listPembantu={listPembantu}
              setListPembantu={(x) => setListPembantu(x)}
            />
          </Grid>
          <Grid item xs={12} md={sizeCon} lg={sizeCon}>
            <BukuPembantuBiayaAdmin14
              alokasi={alokasi}
              setAlokasi={(x) => setAlokasi(x)}
              listPembantu={listPembantu}
              setListPembantu={(x) => setListPembantu(x)}
              //Resize Container
              sizeCon={sizeCon}
              setSizeCon={(x) => setSizeCon(x)}
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
        onClick={() => saveToDbGs14()}
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
