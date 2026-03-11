//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";
import ReactHtmlParser from "react-html-parser";
import toast from "react-hot-toast";
import { DragDropContext } from "react-beautiful-dnd";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import TabelSoalMhs from "../components/TabelSoalMhs";
import PercentMhs from "../components/PercentMhs";
import LaporanMhs from "../components/LaporanMhs";
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

export default function Gs16PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [update, setUpdate] = useState(0);
  const [dataConfig, setDataConfig] = useState(null);
  // #region data dumm
  const [dataTabel, setDataTabel] = useState([
    {
      uuid: "210888ad-9eda-47a4-8304-c82f3d9fe856",
      name: "Persediaan awal",
      value: 200,
      type: 1,
      uids: "",
      error: false,
      uids_bbb: "",
      error_bbb: false,
      uids_btkl: "",
      error_btkl: false,
      uids_bop: "",
      error_bop: false,
    },
    {
      uuid: "e7ad6e2e-2364-4b85-82a1-f3763430c884",
      name: "Diterima dari Dept PULP",
      value: 900,
      type: 1,
      uids: "",
      error: false,
      uids_bbb: "",
      error_bbb: false,
      uids_btkl: "",
      error_btkl: false,
      uids_bop: "",
      error_bop: false,
    },
    {
      uuid: "a324eae0-bd0d-46dc-8f37-f31474e6cbf6",
      name: "Dimulai/ditambahkan ke proses di Dept.KERTAS",
      value: 400,
      type: 1,
      uids: "",
      error: false,
      uids_bbb: "",
      error_bbb: false,
      uids_btkl: "",
      error_btkl: false,
      uids_bop: "",
      error_bop: false,
    },
    {
      uuid: "aefc567e-e4b1-40b5-89fb-4aca560edce0",
      name: "Ditransfer ke Gudang/Dept. PENYEMPURNAAN",
      value: 1100,
      type: 2,
      uids: "",
      error: false,
      uids_bbb: "",
      error_bbb: false,
      uids_btkl: "",
      error_btkl: false,
      uids_bop: "",
      error_bop: false,
    },
    {
      uuid: "b8f83843-aabb-42b6-b27d-5fc2e86a61f5",
      name: "Persediaan BDP akhir",
      value: 300,
      type: 2,
      uids: "",
      error: false,
      uids_bbb: "",
      error_bbb: false,
      uids_btkl: "",
      error_btkl: false,
      uids_bop: "",
      error_bop: false,
    },
    {
      uuid: "be679b57-36a0-4fc1-afba-8ce9d2aaada9",
      name: "Produk Hilang dalam proses",
      value: 100,
      type: 2,
      uids: "",
      error: false,
      uids_bbb: "",
      error_bbb: false,
      uids_btkl: "",
      error_btkl: false,
      uids_bop: "",
      error_bop: false,
    },
  ]);
  const [dataSoal, setDataSoal] = useState([
    {
      uuid: "210888ad-9eda-47a4-8304-c82f3d9fe856",
      alias: "Persediaan awal barang dalam proses seksi kertas",
      value: 200,
      used: false,
      error: false,
    },
    {
      uuid: "e7ad6e2e-2364-4b85-82a1-f3763430c884",
      alias: "Diterima dari seksi Pulp",
      value: 900,
      used: false,
      error: false,
    },
    {
      uuid: "a324eae0-bd0d-46dc-8f37-f31474e6cbf6",
      alias: "Unit yang ditambahkan di seksi kertas",
      value: 400,
      used: false,
      error: false,
    },
    {
      uuid: "aefc567e-e4b1-40b5-89fb-4aca560edce0",
      alias: "Unit selesai seksi kertas yang ditransfer ke seksi Penyempurnaan",
      value: 1100,
      used: false,
      error: false,
    },
    {
      uuid: "b8f83843-aabb-42b6-b27d-5fc2e86a61f5",
      alias: "Persediaan akhir Barang dalam proses seksi Kertas",
      value: 300,
      used: false,
      error: false,
    },
    {
      uuid: "be679b57-36a0-4fc1-afba-8ce9d2aaada9",
      alias: "Produk hilang dalam proses",
      value: 100,
      used: false,
      error: false,
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
      usedbbb: false,
      error_bbb: false,
      usedbtkl: false,
      error_btkl: false,
      usedbop: false,
      error_bop: false,
    },
    {
      uuid: "b8f83843-aabb-42b6-b27d-5fc2e86a61f5",
      alias: "Barang dalam proses akhir",
      bbb: 100,
      btkl: 70,
      bop: 70,
      status: "legacy",
      usedbbb: false,
      error_bbb: false,
      usedbtkl: false,
      error_btkl: false,
      usedbop: false,
      error_bop: false,
    },
  ]);
  // #endregion data dumm
  const [checking, setChecking] = useState(false);
  const [alldone, setAlldone] = useState(false);

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
          setDataConfig(res.data.config);
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

          // Prepare
          const soal = res.data.datasoal.map((el, index) => ({
            ...el,
            used: false,
            error: false,
          }));
          const tabel = res.data.datatabel.map((el, index) => ({
            ...el,
            uids: "",
            error: false,
            uids_bbb: "",
            error_bbb: false,
            uids_btkl: "",
            error_btkl: false,
            uids_bop: "",
            error_bop: false,
          }));
          const percent = res.data.dprcnt.map((el, index) => ({
            ...el,
            usedbbb: false,
            error_bbb: false,
            usedbtkl: false,
            error_btkl: false,
            usedbop: false,
            error_bop: false,
          }));
          setDataTabel(tabel);
          setDataSoal(soal);
          setDataPercent(percent);
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

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return; //jika dopable tujuan tidak null
    if (checking) return; // ended

    const arrsource = source.droppableId.split("_");
    const arrdest = destination.droppableId.split("_");

    //filter 2 drop rule =>
    // if (arrsource[0] === "dst" && arrdest[0] === "src") return; //- dst->src
    if (arrsource[0] === "src" && arrdest[0] === "src") {
      toast.error("Tidak dapat ditaruh pada area yang sama.");
      return;
    } //- src->src
    //#region
    //soal-> tabel value
    if (
      arrsource[0] === "src" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "soal" &&
      arrdest[1] === "tabel"
    ) {
      const tempdst = dataTabel.find((el) => el.uuid === arrdest[2]);
      if (tempdst.uids !== "") {
        toast.error("Drop di tempat yang kosong.");
        return;
      }
      // set TABEL
      setDataTabel(
        dataTabel.map((u, i) =>
          arrdest[2] === u.uuid
            ? {
                ...u,
                uids: arrsource[2],
              }
            : u
        )
      );
      // set SOAL
      setDataSoal(
        dataSoal.map((u, i) =>
          arrsource[2] === u.uuid
            ? {
                ...u,
                used: true,
              }
            : u
        )
      );
    }
    //soal-> tabel value FLIP VALUE
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "tabel" &&
      arrdest[1] === "tabel"
    ) {
      // console.log("flip");
      const tempdst = dataTabel.find((el) => el.uuid === arrdest[2]);
      const tempsrc = dataTabel.find((el) => el.uuid === arrsource[2]);

      const arr1 = dataTabel.map((u, i) =>
        arrdest[2] === u.uuid
          ? {
              ...u,
              uids: tempsrc.uids,
            }
          : u
      );
      // set TABEL
      setDataTabel(
        arr1.map((u, i) =>
          arrsource[2] === u.uuid
            ? {
                ...u,
                uids: tempdst.uids,
              }
            : u
        )
      );
    }

    //percent-> tabel percent_bbb
    if (
      arrsource[0] === "src" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "bbb" &&
      arrdest[1] === "bbb"
    ) {
      const tempdst = dataTabel.find((el) => el.uuid === arrdest[2]);
      if (tempdst.uids_bbb !== "") {
        toast.error("Drop di tempat yang kosong.");
        return;
      }
      // set TABEL
      setDataTabel(
        dataTabel.map((u, i) =>
          arrdest[2] === u.uuid
            ? {
                ...u,
                uids_bbb: arrsource[2],
              }
            : u
        )
      );
      // set Percent
      setDataPercent(
        dataPerecent.map((u, i) =>
          arrsource[2] === u.uuid
            ? {
                ...u,
                usedbbb: true,
              }
            : u
        )
      );
    }
    //FLIP BB
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "bbb" &&
      arrdest[1] === "bbb"
    ) {
      const tempsrc = dataTabel.find((el) => el.uuid === arrsource[2]);
      const tempdst = dataTabel.find((el) => el.uuid === arrdest[2]);
      const xd = dataTabel.map((u, i) =>
        arrdest[2] === u.uuid
          ? {
              ...u,
              uids_bbb: tempsrc.uids_bbb,
            }
          : u
      );
      // set TABEL
      setDataTabel(
        xd.map((u, i) =>
          arrsource[2] === u.uuid
            ? {
                ...u,
                uids_bbb: tempdst.uids_bbb,
              }
            : u
        )
      );
    }
    //percent-> tabel percent_btkl
    if (
      arrsource[0] === "src" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "btkl" &&
      arrdest[1] === "btkl"
    ) {
      const tempdst = dataTabel.find((el) => el.uuid === arrdest[2]);
      if (tempdst.uids_btkl !== "") {
        toast.error("Drop di tempat yang kosong.");
        return;
      }
      // set TABEL
      setDataTabel(
        dataTabel.map((u, i) =>
          arrdest[2] === u.uuid
            ? {
                ...u,
                uids_btkl: arrsource[2],
              }
            : u
        )
      );
      // set Percent
      setDataPercent(
        dataPerecent.map((u, i) =>
          arrsource[2] === u.uuid
            ? {
                ...u,
                usedbtkl: true,
              }
            : u
        )
      );
    }
    //FLIP btkl
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "btkl" &&
      arrdest[1] === "btkl"
    ) {
      const tempsrc = dataTabel.find((el) => el.uuid === arrsource[2]);
      const tempdst = dataTabel.find((el) => el.uuid === arrdest[2]);
      const xd = dataTabel.map((u, i) =>
        arrdest[2] === u.uuid
          ? {
              ...u,
              uids_btkl: tempsrc.uids_btkl,
            }
          : u
      );
      // set TABEL
      setDataTabel(
        xd.map((u, i) =>
          arrsource[2] === u.uuid
            ? {
                ...u,
                uids_btkl: tempdst.uids_btkl,
              }
            : u
        )
      );
    }
    //percent-> tabel percent_bop
    if (
      arrsource[0] === "src" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "bop" &&
      arrdest[1] === "bop"
    ) {
      const tempdst = dataTabel.find((el) => el.uuid === arrdest[2]);
      if (tempdst.uids_bop !== "") {
        toast.error("Drop di tempat yang kosong.");
        return;
      }
      // set TABEL
      setDataTabel(
        dataTabel.map((u, i) =>
          arrdest[2] === u.uuid
            ? {
                ...u,
                uids_bop: arrsource[2],
              }
            : u
        )
      );
      // set Percent
      setDataPercent(
        dataPerecent.map((u, i) =>
          arrsource[2] === u.uuid
            ? {
                ...u,
                usedbop: true,
              }
            : u
        )
      );
    }
    //FLIP bop
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "bop" &&
      arrdest[1] === "bop"
    ) {
      const tempsrc = dataTabel.find((el) => el.uuid === arrsource[2]);
      const tempdst = dataTabel.find((el) => el.uuid === arrdest[2]);
      const xd = dataTabel.map((u, i) =>
        arrdest[2] === u.uuid
          ? {
              ...u,
              uids_bop: tempsrc.uids_bop,
            }
          : u
      );
      // set TABEL
      setDataTabel(
        xd.map((u, i) =>
          arrsource[2] === u.uuid
            ? {
                ...u,
                uids_bop: tempdst.uids_bop,
              }
            : u
        )
      );
    }
    //#endregion

    //#region percent-> GOBACK
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "src" &&
      arrsource[1] === "bbb" &&
      arrdest[1] === "bbb"
    ) {
      const tempsrc = dataTabel.find((el) => el.uuid === arrsource[2]);
      console.log(tempsrc);
      // set TABEL
      setDataTabel(
        dataTabel.map((u, i) =>
          arrsource[2] === u.uuid
            ? {
                ...u,
                uids_bbb: "",
              }
            : u
        )
      );
      // set Percent
      setDataPercent(
        dataPerecent.map((u, i) =>
          tempsrc.uids_bbb === u.uuid
            ? {
                ...u,
                usedbbb: false,
              }
            : u
        )
      );
    }
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "src" &&
      arrsource[1] === "btkl" &&
      arrdest[1] === "btkl"
    ) {
      const tempsrc = dataTabel.find((el) => el.uuid === arrsource[2]);
      console.log(tempsrc);
      // set TABEL
      setDataTabel(
        dataTabel.map((u, i) =>
          arrsource[2] === u.uuid
            ? {
                ...u,
                uids_btkl: "",
              }
            : u
        )
      );
      // set Percent
      setDataPercent(
        dataPerecent.map((u, i) =>
          tempsrc.uids_btkl === u.uuid
            ? {
                ...u,
                usedbtkl: false,
              }
            : u
        )
      );
    }
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "src" &&
      arrsource[1] === "bop" &&
      arrdest[1] === "bop"
    ) {
      const tempsrc = dataTabel.find((el) => el.uuid === arrsource[2]);
      console.log(tempsrc);
      // set TABEL
      setDataTabel(
        dataTabel.map((u, i) =>
          arrsource[2] === u.uuid
            ? {
                ...u,
                uids_bop: "",
              }
            : u
        )
      );
      // set Percent
      setDataPercent(
        dataPerecent.map((u, i) =>
          tempsrc.uids_bop === u.uuid
            ? {
                ...u,
                usedbop: false,
              }
            : u
        )
      );
    }
    //#endregion goback
    //eror
    if (
      (arrsource[0] === "src" && arrdest[0] === "dst") ||
      (arrsource[0] === "dst" && arrdest[0] === "dst")
    ) {
      if (
        (arrsource[1] === "soal" && arrdest[1] === "bbb") ||
        (arrsource[1] === "soal" && arrdest[1] === "btkl") ||
        (arrsource[1] === "soal" && arrdest[1] === "bop") ||
        (arrsource[1] === "bbb" && arrdest[1] === "soal") ||
        (arrsource[1] === "btkl" && arrdest[1] === "soal") ||
        (arrsource[1] === "bop" && arrdest[1] === "soal") ||
        (arrsource[1] === "bbb" && arrdest[1] === "tabel") ||
        (arrsource[1] === "btkl" && arrdest[1] === "tabel") ||
        (arrsource[1] === "bop" && arrdest[1] === "tabel") ||
        (arrsource[1] === "tabel" && arrdest[1] === "bbb") ||
        (arrsource[1] === "tabel" && arrdest[1] === "btkl") ||
        (arrsource[1] === "tabel" && arrdest[1] === "bop")
      ) {
        toast.error("Tidak dapat ditaruh pada jenis yang berbeda.");
      }
      if (
        (arrsource[1] === "bbb" && arrdest[1] === "btkl") ||
        (arrsource[1] === "bbb" && arrdest[1] === "bop") ||
        (arrsource[1] === "btkl" && arrdest[1] === "bbb") ||
        (arrsource[1] === "btkl" && arrdest[1] === "bop") ||
        (arrsource[1] === "bop" && arrdest[1] === "bbb") ||
        (arrsource[1] === "bop" && arrdest[1] === "btkl")
      ) {
        toast.error(
          "Tidak dapat ditaruh pada jenis penyelesaian yang berbeda."
        );
      }
    }
    // console.log("sorc", arrsource);
    // console.log("arrdest", arrdest);
  };

  const check = () => {
    setChecking(true);
    // console.log("checking");
    // console.log("dT", dataTabel);
    // console.log("ds", dataSoal);
    // console.log("dp", dataPerecent);

    const result = [];
    dataTabel.forEach((items, index) => {
      //kunci percent check
      const rpercent = dataPerecent.find((el) => el.uuid === items.uuid);

      if (items.uids !== "") {
        if (items.uuid === items.uids) {
          result.push(true);
        } else {
          result.push(false);
          dataTabel[index].error = true;
        }
      } else {
        result.push(false);
        dataTabel[index].error = true;
      }

      //Chekck Part PERCENT
      if (rpercent) {
        if (items.uids_bbb !== "") {
          if (items.uids_bbb === items.uuid) {
            result.push(true);
          } else {
            result.push(false);
            dataTabel[index].error_bbb = true;
          }
        } else {
          result.push(false);
          dataTabel[index].error_bbb = true;
        }
      }
    });

    setDataTabel(dataTabel);
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
        <title>Game Simulasi 16</title>
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={2} direction="row" alignItems="stretch">
            <Grid item xs={12} md={12} lg={12}>
              <div className="mt-5 -mb-3 opacity-50 italic font-semibold my-1">
                Data (soal):
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <div className="bg-white p-5 ">
                <TabelSoalMhs
                  dataConfig={dataConfig}
                  dataTabel={dataTabel}
                  dataSoal={dataSoal}
                />
                <PercentMhs
                  dataConfig={dataConfig}
                  dataPerecent={dataPerecent}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <div className="bg-white">
                <LaporanMhs
                  dataConfig={dataConfig}
                  dataTabel={dataTabel}
                  dataSoal={dataSoal}
                  dataPerecent={dataPerecent}
                  checking={checking}
                />
                {/* CHECK 2*/}
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
          </Grid>
        </DragDropContext>
      </div>
      <br />
    </div>
  );
}
