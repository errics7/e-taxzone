/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Button, CircularProgress, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { v4 as uuidv4 } from "uuid";

import API from "../../../../utils/host.config";
import EditorNarasiSoal from "../../componentglobal/EditorNarasiSoal";
import {
  ShimmerBadge,
  ShimmerSectionHeader,
  ShimmerTable,
  ShimmerText,
  ShimmerTitle,
} from "react-shimmer-effects";
import NotaAkunList from "../components/NotaAkunList";
import toast from "react-hot-toast";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import { Save } from "@mui/icons-material";
import WorksheetAdmin from "../components/WorksheetAdmin";
import swal from "sweetalert";
import { isEqual } from "lodash";

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

const Gs11Admin = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [ori, setOri] = useState(null);
  const [dataConfig, setDataConfig] = useState(null);
  const [dataAkun, setDataAkun] = useState(null);
  const [dataPosting, setDataPosting] = useState(null);

  const generateId = [uuidv4(), uuidv4(), uuidv4(), uuidv4()];

  useEffect(() => {
    const fetchData = (id_config) => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/gamesimulasi11/${id_config}/config`, {
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
          //default
          defaultDataConfig({
            narasisoal: res.data.narasisoal,
            cvname: res.data.cvname,
            subtabel: res.data.subtabel,
            subinvoice: res.data.subinvoice,
            tgl: res.data.tgl,
            id: res.data.id,
            tglsoal: res.data.tglsoal,
          });
          defaultDataAkun(res.data.dataakun);
          defaultDataPosting(res.data.dataposting);
          setOri(res.data);
        })
        .catch((error) => {
          defaultDataConfig({ narasisoal: "" });
          defaultDataAkun([]);
          defaultDataPosting([]);
          setLoad(false);

          if (error.response.status === 401) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 400) {
            toast.error(
              "Terjadi Keslahan server, Silahkan refresh halaman kembali. note: " +
                error.response.data.message
            );
          } else {
            console.log(error);
            toast.error(error.response.data.message);
          }
        });
    };

    fetchData(id);
  }, [id, history]);

  const saveToDb = () => {
    if (load) return;
    setLoad(true);
    // console.log(config);

    const push = axios.post(
      `${API.HOST}/api/v2/gamesimulasi11/${id}/update`,
      {
        config: { ...dataConfig, dataakun: dataAkun, dataposting: dataPosting },
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    toast.promise(
      push,
      {
        loading: "Saving Data...",
        success: (data) => {
          setLoad(false);
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

  const defaultDataConfig = (inp) => {
    let conf = inp;

    if (conf.narasisoal === null || conf.narasisoal === "") {
      conf = {
        ...conf,
        narasisoal: `<p style="text-align:start;"><span style="color: rgba(0,0,0,0.87);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto, Helvetica, Arial, sans-serif;"><strong>Game Simulai 11 - MEMBUAT NERACA SALDO PERCOBAAN PADA KERTAS KERJA</strong></span></p>`,
        cvname: "CV. ROFADI",
        subtabel: "Kertas Kerja",
        subinvoice: "Buku Besar",
        tgl: "01-Des-21",
        id: Number(id),
        tglsoal: "Per 31 Desember 2021",
      };
    }

    setDataConfig(conf);
  };

  const defaultDataAkun = (inp) => {
    let tempInput = inp;
    if (tempInput && tempInput.length === 0) {
      tempInput = [
        {
          id_akun: generateId[0],
          noakun: 110,
          nama: "Kas",
          total_kredit: 0,
          total_debet: 12000000,
          saldo_awal: 17000000,
          type_saldo: "debet",
          id_config: Number(id),
        },
        {
          id_akun: generateId[1],
          nama: "Persediaan",
          noakun: 115,
          id_config: Number(id),
          total_kredit: 0,
          total_debet: 10950000,
          saldo_awal: 5000000,
          type_saldo: "debet",
        },
        {
          id_akun: generateId[2],
          nama: "Hutang Dagang",
          noakun: 210,
          id_config: Number(id),
          total_kredit: 17850000,
          total_debet: 0,
          saldo_awal: 7550000,
          type_saldo: "kredit",
        },
        {
          id_akun: generateId[3],
          nama: "Pendapatan Dagang",
          noakun: 510,
          id_config: Number(id),
          total_kredit: 5100000,
          total_debet: 0,
          saldo_awal: 0,
          type_saldo: "kredit",
        },
      ];
    }
    setDataAkun(tempInput);
  };

  const defaultDataPosting = (inp) => {
    let tempInput = inp;
    if (tempInput && tempInput.length === 0) {
      tempInput = [
        {
          id: uuidv4(),
          id_config: Number(id),
          id_akun: generateId[0],
          tgl: "9/12/2021",
          keterangan: "POSTING",
          type: "posting",
          ref: "JURNAL KAS KELUAR",
          debet: 0,
          kredit: 5000000,
          posisi: "kredit",
          saldototal: 12000000,
        },
        {
          id: uuidv4(),
          id_config: Number(id),
          id_akun: generateId[1],
          tgl: "12/3/2021",
          keterangan: "POSTING",
          type: "posting",
          ref: "JURNAL PEMBELIAN",
          debet: 2400000,
          kredit: 0,
          posisi: "debet",
          saldototal: 7400000,
        },
        {
          id: uuidv4(),
          id_config: Number(id),
          id_akun: generateId[1],
          tgl: "9/12/2021",
          keterangan: "POSTING",
          type: "posting",
          ref: "JURNAL KAS KELUAR",
          debet: 3550000,
          kredit: 0,
          posisi: "debet",
          saldototal: 10950000,
        },
        {
          id: uuidv4(),
          id_config: Number(id),
          id_akun: generateId[2],
          tgl: "12/3/2021",
          keterangan: "POSTING",
          type: "posting",
          ref: "JURNAL PEMBELIAN",
          debet: 0,
          kredit: 10300000,
          posisi: "kredit",
          saldototal: 17850000,
        },
        {
          id: uuidv4(),
          id_config: Number(id),
          id_akun: generateId[3],
          tgl: "3/12/2021",
          keterangan: "POSTING",
          type: "posting",
          ref: "JURNAL KAS MASUK",
          debet: 0,
          kredit: 1030000,
          posisi: "kredit",
          saldototal: 1030000,
        },
        {
          id: uuidv4(),
          id_config: Number(id),
          id_akun: generateId[3],
          tgl: "3/12/2021",
          keterangan: "POSTING",
          type: "posting",
          ref: "JURNAL PENJUALAN",
          debet: 0,
          kredit: 4070000,
          posisi: "kredit",
          saldototal: 5100000,
        },
      ];
    }
    setDataPosting(tempInput);
  };

  const addAkun = (type) => {
    const uid = uuidv4();
    const tempAkun = [...dataAkun];
    tempAkun.push({
      id_akun: uid,
      noakun: 789,
      nama: "",
      total_kredit: 0,
      total_debet: 0,
      saldo_awal: 0,
      type_saldo: type,
      id_config: Number(id),
    });

    setDataAkun(tempAkun);
  };

  const cek = () => {
    const x = {
      dataakun: ori.dataakun,
      dataposting: ori.dataposting,
    };
    const y = {
      dataakun: dataAkun,
      dataposting: dataPosting,
    };

    if (!isEqual(y, x)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>GS 11 Perdagangan | Admin</title>
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
            Konfigurasi Game Simulasi Perdagangan 11
          </div>
        </div>
      </div>
      <div className="relative">
        {load && <LoadingWait />}
        <Grid container spacing={2} direction="row" alignItems="stretch">
          <Grid item xs={12} md={12} lg={12}>
            <span className="mt-5 block">Soal Editor:</span>
            <div>
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
          <Grid item xs={12} md={12} lg={12}>
            <div className="p-5 border border-dashed bg-white">
              {dataConfig ? (
                <div className="relative">
                  <div className="absolute opacity-50 bg-blue-200 italic font-semibold -mt-5 -ml-5 p-1 pr-2">
                    Kunci jawaban :
                  </div>
                  <WorksheetAdmin
                    dataakun={dataAkun}
                    dataConfig={dataConfig}
                    setDataConfig={setDataConfig}
                  />
                </div>
              ) : (
                <div className="p-3">
                  <ShimmerSectionHeader center />
                  <ShimmerTable row={2} col={8} />
                </div>
              )}
            </div>
            <div className="bg-white">
              {dataConfig ? (
                <div className="mb-8">
                  <NotaAkunList
                    id={id}
                    dataConfig={dataConfig}
                    setDataConfig={setDataConfig}
                    dataAkun={dataAkun}
                    setDataAkun={setDataAkun}
                    dataPosting={dataPosting}
                    setDataPosting={setDataPosting}
                  />
                  <div className="flex flex-row space-x-1 mt-4">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      className={classes.btnaddadata}
                      onClick={() => addAkun("debet")}
                    >
                      Tambah Akun Debet
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      className={classes.btnaddadata}
                      onClick={() => addAkun("kredit")}
                    >
                      Tambah Akun Kredit
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 my-3">
                    <ShimmerBadge width={200} />
                    <ShimmerTable row={2} col={8} />
                  </div>
                  <div className="p-3 my-3">
                    <ShimmerBadge width={200} />
                    <ShimmerTable row={2} col={8} />
                  </div>
                  <div className="p-3 my-3">
                    <ShimmerBadge width={200} />
                    <ShimmerTable row={2} col={8} />
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
      <div className="flex flex-row space-x-1">
        <Button
          variant="contained"
          className={classes.btnaddadata}
          style={{ marginTop: "14px", marginRight: "10px" }}
          endIcon={
            dataConfig && load ? (
              <CircularProgress
                size={20}
                thickness={4}
                style={{ color: "white" }}
              />
            ) : (
              <Save />
            )
          }
          onClick={() => saveToDb()}
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
            if (cek()) {
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
};

export default Gs11Admin;
