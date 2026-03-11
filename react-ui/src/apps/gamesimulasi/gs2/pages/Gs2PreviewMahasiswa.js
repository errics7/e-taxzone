import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  ShimmerSectionHeader,
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
} from "react-shimmer-effects";
//#region
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import makeStyles from "@mui/styles/makeStyles";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ReactHtmlParser from "react-html-parser";
import axios from "axios";
import API from "../../../../utils/host.config";
import ItemsDataGs2 from "../components/ItemsDataGs2";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { find } from "lodash";

const useStyles = makeStyles((theme) => ({
  btnsave: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "15px",
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
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
  btnreset: {
    backgroundColor: "#FF8E90",
    textTransform: "none",
    marginTop: "15px",
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
    marginTop: "15px",
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#277BA5",
      boxShadow: "none",
    },
  },
}));
//#endregion

export default function Gs2PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  // update counter
  const [load, setLoad] = useState(false);

  const { id } = useParams();
  const [sConfig, setSConfig] = useState([12, 7, 7]);
  const [data, setData] = useState(null);
  const [dataDef, setDatadef] = useState([]);
  const [dataD, setDataD] = useState(null);
  const [showSide, setShowSide] = useState(true);
  const [config, setConfig] = useState(null);
  const [autoChecker, setAutoChecker] = useState(false);
  const [alldone, setAlldone] = useState(false);

  //#region
  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs2/data/${id}/soal`, {
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
          setData(res.data.selected);
          setDataD(res.data.selected);
          setDatadef(res.data);
          setConfig(res.data.config);
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
  }, [id, history]);

  const resetButton = () => {
    setAlldone(false);
    setAutoChecker(false);
    setData(null);
    setDataD(null);
    setTimeout(() => {
      setData(dataDef.selected);
      setDataD(dataDef.selected);
    }, 100);
  };

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  // sumary
  const totalSummary = () => {
    var b = 0;
    var s = 0;
    if (dataD) {
      dataD.forEach((item) => {
        if (item.benar) {
          b += 1;
        } else {
          s += 1;
        }
      });
    }
    return [b, s];
  };
  const check = () => {
    setAutoChecker(true);
    const hasil = [];
    const verif = dataD.map((item, index) => {
      const da = item;
      const dastd = find(dataDef.selected, { code: da.destination.code });
      // console.log(dastd);
      if (
        dastd &&
        da.destination.code === dastd.source.code &&
        da.destination.name === dastd.source.name &&
        da.destination.jumlah === dastd.source.jumlah
      ) {
        da["benar"] = true;
        hasil.push(true);
        //
        if (da.destination.code === dastd.source.code) {
          // console.log("true:" + da.destination.code);
          hasil.push(true);
        } else {
          hasil.push(false);
          // console.log("false:" + da.destination.code);
        }
        if (da.destination.name === dastd.source.name) {
          hasil.push(true);
          // console.log("true:" + da.destination.name);
        } else {
          hasil.push(false);
          // console.log("false:" + da.destination.name);
        }
        if (Number(da.destination.jumlah) === Number(dastd.source.jumlah)) {
          hasil.push(true);
          // console.log("true:" + da.destination.jumlah);
        } else {
          hasil.push(false);
          // console.log("false:" + da.destination.jumlah);
        }
      } else {
        da["benar"] = false;
        hasil.push(false);
      }

      return da;
    }); 
    setDataD(verif);
    //Finally
    if (hasil.every((x) => x === true)) {
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

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return; //jika dopable tujuan tidak null
    // get id dest & source
    const idsource = source.droppableId.split("_");
    const iddest = destination.droppableId.split("_");
    const isrc = dataD.findIndex((x) => x.code === idsource[2]);
    const idst = dataD.findIndex((x) => x.code === iddest[2]);

    //cek drop bukan di tempat yang sama
    if (source.droppableId !== destination.droppableId) {
      // Jika dropable sama" di Src
      if (idsource[0] === "src" && idsource[0] === iddest[0]) return; //batal src <-> src
      if (idsource[0] === "dst" && iddest[0] === "src") return; //batal dst ->src

      //allowed sama" source
      if (idsource[1] === iddest[1]) {
        // first update => dataD

        if (idsource[0] === iddest[0]) {
          // dst->dst is moved / switch
          if (dataD[idst].destination[idsource[1]] !== null) {
            //jika tujuannya ada isi maka switch or flip
            // console.log("it will plip");
            const tmp = dataD[idst].destination[idsource[1]]; //saving dest to flip
            let itmdst = {
              ...dataD[idst],
              destination: {
                ...dataD[idst].destination,
                [iddest[1]]: dataD[isrc].destination[iddest[1]],
              },
            };
            const dstup = dataD.map((u) => (u.code !== iddest[2] ? u : itmdst)); //merge
            let itmsrc = {
              ...dataD[isrc],
              destination: {
                ...dataD[isrc].destination,
                [iddest[1]]: tmp,
              },
            };
            const fulup = dstup.map((u) =>
              u.code !== idsource[2] ? u : itmsrc
            );
            setDataD(fulup);
            // End Flipp
          } else {
            //tujuannya null it will set to null
            //update dest
            let itmdst = {
              ...dataD[idst],
              destination: {
                ...dataD[idst].destination,
                [iddest[1]]: dataD[isrc].destination[iddest[1]],
              },
            };
            const dstup = dataD.map((u) => (u.code !== iddest[2] ? u : itmdst));
            // console.log(dstup);
            let itmsrc = {
              ...dataD[isrc],
              destination: {
                ...dataD[isrc].destination,
                [iddest[1]]: null,
              },
            };
            const fulup = dstup.map((u) =>
              u.code !== idsource[2] ? u : itmsrc
            );
            // console.log(fulup);
            setDataD(fulup);
          }
          // END
        } else {
          // src->dst is migrasi
          // tabrakan ?
          if (dataD[idst].destination[idsource[1]] !== null) {
            toast.error("Drop pada tempat yang kosong.");
            return;
          } else {
            // console.log("No");
            //update dest
            let itmdst = {
              ...dataD[idst],
              destination: {
                ...dataD[idst].destination,
                [iddest[1]]: dataD[isrc].source[iddest[1]],
              },
            };
            const dstup = dataD.map((u) => (u.code !== iddest[2] ? u : itmdst));
            // second update
            let itmsrc = {
              ...dstup[isrc],
              source: { ...dstup[isrc].source, [idsource[1]]: null },
            };
            const upfinal = dstup.map((u) =>
              u.code !== idsource[2] ? u : itmsrc
            );
            setDataD(upfinal);
          }
        }
        //END
      } else {
        toast.error("Drop pada jenis yang sesuai");
      }
    }
  };
  //#endregion

  return (
    <div className="static">
      <Helmet>
        <title>Game Simulasi 2</title>
      </Helmet>
      <div className="w-full min-h-20v relative">
        {load && <LoadingWait />}
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
        {/* Container main */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="w-full mb-3 mt-5 p-2 border bg-slate-50">
            {config ? (
              ReactHtmlParser(config.narasisoal)
            ) : (
              <div className="p-3 bg-white">
                <ShimmerTitle line={2} variant="secondary" />
                <ShimmerText />
              </div>
            )}
          </div>
          <Grid
            container
            spacing={3}
            direction="row"
            alignItems="stretch"
            className=""
          >
            <Grid item xs={sConfig[0]} md={sConfig[1]} lg={sConfig[2]}>
              <div className="border border-dashed relative bg-white">
                <div className="absolute opacity-50 italic font-semibold p-1 pr-2">
                  Data (Soal):
                </div>
                <div className="p-5">
                  {config ? (
                    <>
                      <div className="p-3 mx-auto text-center text-2xl font-semibold">
                        {config && config.narasi_1}
                      </div>
                      <div className="mx-auto text-xl w-full text-center">
                        NERACA SALDO
                      </div>
                      <div className="mx-auto text-xl w-full text-center">
                        {config && config.narasi_2}
                      </div>
                    </>
                  ) : (
                    <div className="-mb-10 mt-3">
                      <ShimmerSectionHeader center />
                    </div>
                  )}
                  <div className="overflow-x-auto border mt-5">
                    <table className="border-collapse min-w-full table-fixed">
                      <thead className="font-semibold">
                        <tr className="text-slate-600 font-semibold">
                          <th className="min-w-10v max-w-10v border py-3">
                            Kode
                          </th>
                          <th className="min-w-20v max-w-20v border py-3">
                            Nama Akun
                          </th>
                          <th className="min-w-15v max-w-15v border py-3">
                            Debet (Rp)
                          </th>
                          <th className="min-w-15v max-w-15v border py-3">
                            Kredit (Rp)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data ? (
                          data.map((item, i) => (
                            <tr key={i}>
                              <td className="min-w-10v max-w-10v border py-1">
                                <div className="py-1 mx-auto text-center">
                                  {item.code}
                                </div>
                              </td>
                              <td className="min-w-20v max-w-20v border py-1">
                                <span className="m-1 py-1">{item.name}</span>
                              </td>
                              <td className="min-w-15v max-w-15v border py-1 text-center">
                                {item.jenis === "kredit" && toRp(item.nominal)}
                              </td>
                              <td className="min-w-15v max-w-15v border py-1 text-center">
                                {item.jenis === "debit" && toRp(item.nominal)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">
                              <ShimmerTable row={2} col={5} />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Grid>

            {/* data Drag Asal */}
            {showSide ? (
              <Grid item xs={12} md={5} lg={5}>
                <div className="sticky top-20 border z-50 shadow-md bg-white">
                  <div className="min-h-1/4 w-full ">
                    <div className="flex p-3 border-b">
                      <Tooltip
                        title="Sembunyikan Data Akun"
                        placement="right-end"
                      >
                        <IconButton
                          aria-label="hide"
                          onClick={() => {
                            setShowSide(false);
                            sConfig[1] === 7
                              ? setSConfig([12, 12, 12])
                              : setSConfig([12, 7, 7]);
                          }}
                          size="small"
                        >
                          <ArrowForwardIcon className="" />
                        </IconButton>
                      </Tooltip>
                      <h2 className="grow text-center text-lg pr-3">
                        Data Akun
                      </h2>
                    </div>
                    {/* List Data Akun */}
                    <div className="grid grid-flow-row grid-cols-3 gap0-0 mt-3 border-collapse">
                      <div className="font-semibold w-full py-3 border border-slate-200 text-center">
                        Kode
                      </div>
                      <div className="font-semibold w-full py-3 border border-slate-200 text-center">
                        Nama akun
                      </div>
                      <div className="font-semibold w-full py-3 border border-slate-200 text-center">
                        Jumlah
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {dataD ? (
                        dataD.map((item, i) => {
                          return (
                            <div
                              key={i}
                              className="grid grid-flow-row grid-cols-3 gap-0"
                            >
                              {/* Kode */}
                              <Droppable droppableId={"src_code_" + item.code}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex w-full items-center p-1"
                                  >
                                    {/* IItems */}
                                    {item.source.code ? (
                                      <ItemsDataGs2
                                        data={item.source.code}
                                        index={i}
                                      />
                                    ) : (
                                      <span className="opacity-40 w-full text-center p-1 border border-dashed">
                                        {item.code}
                                      </span>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                              {/* Name */}
                              <Droppable droppableId={"src_name_" + item.code}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex w-full items-stretch p-1"
                                  >
                                    {/* IItems */}
                                    {item.source.name ? (
                                      <ItemsDataGs2
                                        data={item.source.name}
                                        index={i}
                                      />
                                    ) : (
                                      <span className="opacity-40 w-full text-center p-1 border border-dashed">
                                        {item.name}
                                      </span>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                              {/* Jumlah */}
                              <Droppable
                                droppableId={"src_jumlah_" + item.code}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex w-full items-stretch p-1"
                                  >
                                    {/* IItems */}
                                    {item.source.jumlah ? (
                                      <ItemsDataGs2
                                        data={toRp(item.source.jumlah)}
                                        index={i}
                                      />
                                    ) : (
                                      <span className="opacity-40 w-full text-center p-1 border border-dashed">
                                        {toRp(item.nominal)}
                                      </span>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          );
                        })
                      ) : (
                        <div>
                          <ShimmerTable row={2} col={3} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col w-full p-5">
                    <div className="text-xs">
                      *drag data akun ke dalam buku besar
                    </div>
                    {autoChecker && (
                      <div className="border p-3 w-60 mt-2">
                        <span className="block text-center border-b mb-2 uppercase">
                          Tabel Summary
                        </span>
                        <span>
                          Benar : {totalSummary()[0]}
                          <br />
                          Salah : {totalSummary()[1]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row-reverse mb-5">
                    {autoChecker && alldone ? (
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
                        disabled={autoChecker}
                        onClick={() => check()}
                      >
                        Check
                      </Button>
                    )}

                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.btnreset}
                      onClick={() => {
                        resetButton();
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </Grid>
            ) : null}

            {/*  */}
            <Grid item xs={12} md={12} lg={12}>
              <div className="w-full text-left text-xl border-b-2">
                Lembar Kerja
              </div>
              {/* Data drag tujuan */}
              {config &&
                dataD &&
                dataD.map((item, j) => {
                  const st1 = find(dataDef.selected, {
                    code: item.destination.code,
                  });

                  return (
                    <Grid
                      container
                      key={j}
                      direction="column"
                      justifyContent="center"
                      alignItems="stretch"
                      className={`my-3 rounded-sm relative bg-white`}
                    >
                      <div
                        className={`p-5 border border-solid ${
                          autoChecker &&
                          !item.benar &&
                          "border-2 border-red-300 animate-pulse"
                        }`}
                      >
                        <div className="bbsec-top">
                          <div className="grid grid-cols-6 gap-0">
                            <div className="col-start-1 col-end-4 font-bold">
                              {config && config.narasi_1}
                            </div>
                            <div className="col-end-7 col-span-2 font-bold">
                              BUKU BESAR
                            </div>
                          </div>
                          <div className="grid grid-cols-6 gap-0">
                            <div className="col-start-1 col-end-4 flex items-center my-2">
                              <span className="flex-none">Nama Akun :</span>
                              <div className="relative grow">
                                <Droppable
                                  droppableId={
                                    "dst_name_" +
                                    item.code +
                                    "_" +
                                    item.destination.name
                                  }
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={` p-1 ${
                                        snapshot.isDraggingOver &&
                                        "bg-slate-100"
                                      }`}
                                    >
                                      {/* IItems */}
                                      {item.destination.name ? (
                                        <ItemsDataGs2
                                          data={item.destination.name}
                                          index={j}
                                          checker={autoChecker}
                                          stat={
                                            st1 &&
                                            item.destination.name ===
                                              st1.source.name
                                              ? true
                                              : false
                                          }
                                        />
                                      ) : (
                                        <div className="absolute inset-0 p-1 z-0">
                                          <div className="border border-dashed opacity-50 font-light text-left -mt-2 pl-5">
                                            Drop disini
                                          </div>
                                        </div>
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            </div>
                            <div className="col-end-7 col-span-2 flex items-center justify-center">
                              <div className="flex-none">Kode : </div>
                              <div className="relative grow">
                                <Droppable
                                  droppableId={"dst_code_" + item.code}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={`grow p-1 grid ${
                                        snapshot.isDraggingOver &&
                                        "bg-slate-100"
                                      }`}
                                    >
                                      {/* IItems */}
                                      {item.destination.code ? (
                                        <ItemsDataGs2
                                          data={item.destination.code}
                                          index={j}
                                          checker={autoChecker}
                                          stat={
                                            st1 &&
                                            item.destination.code ===
                                              st1.source.code
                                              ? true
                                              : false
                                          }
                                        />
                                      ) : (
                                        <div className="absolute inset-0 p-1">
                                          <div className="border border-dashed opacity-50 font-light text-center -mt-2">
                                            Drop disini
                                          </div>
                                        </div>
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border mt-5">
                          <table className="border-collapse min-w-full table-fixed">
                            <thead>
                              <tr className="font-semibold">
                                <th className="min-w-10v max-w-10v border py-3">
                                  Tanggal
                                </th>
                                <th className="min-w-10v max-w-10v border py-3">
                                  Uraian
                                </th>
                                <th className="min-w-10v max-w-10v border py-3">
                                  Ref.
                                </th>
                                <th className="min-w-15v max-w-15v border py-3">
                                  Debet (Rp)
                                </th>
                                <th className="min-w-15v max-w-15v border py-3">
                                  Kredit (Rp)
                                </th>
                                <th className="min-w-15v max-w-15v border py-3">
                                  Saldo (Rp)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="min-w-10v max-w-10v border py-3">
                                  <table className="w-full border-collapse">
                                    <tbody>
                                      <tr>
                                        <td className="w-1/2 border-r text-center">
                                          Des
                                        </td>
                                        <td className="w-1/2 border-l text-center">
                                          1
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td className="min-w-10v max-w-10v border py-3 text-center">
                                  Saldo awal
                                </td>
                                <td className="min-w-15v max-w-15v border py-3 text-center">
                                  NA
                                </td>
                                <td className="min-w-15v max-w-15v border py-3">
                                  &nbsp;
                                </td>
                                <td className="min-w-15v max-w-15v border py-3">
                                  &nbsp;
                                </td>
                                <td className="min-w-15v max-w-15v border text-center relative">
                                  <Droppable
                                    droppableId={"dst_jumlah_" + item.code}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={` inline-block w-full items-stretch p-1 ${
                                          snapshot.isDraggingOver &&
                                          "bg-slate-100"
                                        }`}
                                      >
                                        {/* IItems */}
                                        {item.destination.jumlah ? (
                                          <ItemsDataGs2
                                            data={toRp(item.destination.jumlah)}
                                            index={j}
                                            checker={autoChecker}
                                            stat={
                                              st1 &&
                                              item.destination.jumlah ===
                                                st1.source.jumlah
                                                ? true
                                                : false
                                            }
                                          />
                                        ) : (
                                          <div className="absolute inset-0 p-1">
                                            <div className="border border-dashed opacity-50 font-light text-center">
                                              Drop disini
                                            </div>
                                          </div>
                                        )}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                </td>
                              </tr>
                              {/* empty row */}
                              {[...Array(3)].map((e, i) => {
                                return (
                                  <tr key={i}>
                                    <td className="min-w-10v max-w-10v border py-3">
                                      &nbsp;
                                    </td>
                                    <td className="min-w-10v max-w-10v border py-3">
                                      &nbsp;
                                    </td>
                                    <td className="min-w-15v max-w-15v border py-3">
                                      &nbsp;
                                    </td>
                                    <td className="min-w-15v max-w-15v border py-3">
                                      &nbsp;
                                    </td>
                                    <td className="min-w-15v max-w-15v border py-3">
                                      &nbsp;
                                    </td>
                                    <td className="min-w-15v max-w-15v border py-3">
                                      &nbsp;
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        </DragDropContext>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        {!showSide && (
          <div
            className="p-3 border -mr-12 flex flex-row-reverse transform -rotate-90 text-white text-base bg-blue-400 shadow-md rounded cursor-pointer hover:shadow-lg hover:bg-blue-500  hover:scale-102 duration-500"
            onClick={() => {
              setShowSide(true);
              sConfig[1] === 7
                ? setSConfig([12, 12, 12])
                : setSConfig([12, 7, 7]);
            }}
          >
            <VerticalAlignTopIcon className="mx-auto" />
            <h2>Tampilkan data</h2>
          </div>
        )}
      </div>
    </div>
  );
}
