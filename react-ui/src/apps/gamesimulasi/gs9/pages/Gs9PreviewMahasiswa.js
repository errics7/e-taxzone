//#region
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerBadge,
} from "react-shimmer-effects";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast from "react-hot-toast";

import makeStyles from "@mui/styles/makeStyles";
import { DragDropContext } from "react-beautiful-dnd";
import ReactHtmlParser from "react-html-parser";

import axios from "axios";
import API from "../../../../utils/host.config";

import LoadingWait from "../../../dashboard/component/LoadingWait";
import TblBukuBesar from "../components/TblBukuBesar";
import TblDropableBB from "../components/TblDropableBB";
import swal from "sweetalert";

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

export default function Gs9PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  // update counter
  const [update, setUpdate] = useState(0);
  const [load, setLoad] = useState(false);

  const { id } = useParams();
  const [sConfig, setSConfig] = useState([12, 7, 7]);
  const [dataDef, setDatadef] = useState([]);
  const [dataD, setDataD] = useState(null);
  const [autoChecker, setAutoChecker] = useState(false);
  const [showSide, setShowSide] = useState(true);
  const [config, setConfig] = useState(null);
  const [alldone, setAllDone] = useState(false);
  const [jawab, setJawab] = useState([
    ...Array(3).fill({
      status: false,
      code: { value: "", error: false },
      name: { value: "", error: false },
      jumdebit: { value: "", error: false },
      jumkredit: { value: "", error: false },
    }),
  ]);

  // #region FUNC
  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs9/data/${id}/soaluser`, {
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
          setDataD(res.data.drag);
          setDatadef(res.data);
          setConfig(res.data.config);
          setJawab([
            ...Array(res.data.drag.length).fill({
              status: false,
              code: { value: "", error: false },
              name: { value: "", error: false },
              jumdebit: { value: "", error: false },
              jumkredit: { value: "", error: false },
            }),
          ]);
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
  const resetButton = () => {
    setUpdate(update + 1);
    setAutoChecker(false);
    setAllDone(false);
  };
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };
  const totalDebit = () => {
    var x = 0;
    jawab.forEach((item, i) => {
      if (item.jumdebit.value !== "") {
        x += Number(item.jumdebit.value);
      } else {
        x += 0;
      }
    });
    return toRp(x);
  };
  const totalKredit = () => {
    var x = 0;
    jawab.forEach((item, i) => {
      if (item.jumkredit.value !== "") {
        x += Number(item.jumkredit.value);
      } else {
        x += 0;
      }
    });
    return toRp(x);
  };
  // sumary
  const totalSummary = () => {
    var b = 0;
    var s = 0;
    if (dataD) {
      dataD.forEach((item) => {
        if (item.error) {
          s += 1;
        } else {
          b += 1;
        }
      });
    }
    return [b, s];
  };
  const check = () => {
    const key = [...dataD].sort((a, b) => Number(a.code) - Number(b.code)); //[...] biar gaberubah nil asli
    //buat kounci
    // console.table(key);

    //#1 Pengurutan kode harus urut
    key.forEach((el, index) => {
      const dDropid = dataD.findIndex((x) => x.code === el.code); //tebl id
      //kode harus sama
      if (el.code === jawab[index].code.value) {
        // console.log(index + " #1 OK");
      } else {
        jawab[index].code.error = true;
        dataD[dDropid].error = true;
        // console.log(index + " #1 NOK");
      }

      //#2 NAMA akun
      if (el.name === jawab[index].name.value) {
        // console.log(index + " #2 OK");
      } else {
        jawab[index].name.error = true;
        dataD[dDropid].error = true;
        // console.log(index + " #2 NOK");
      }
      //#3 Debit akun
      if (el.jenis === "debit" && jawab[index].jumdebit.value !== "") {
        // console.log(index + " #3 OK");
        if (Number(el.source.jumdebit) === jawab[index].jumdebit.value) {
          // console.log(index + " #3 OK");
        } else {
          jawab[index].jumdebit.error = true;
          dataD[dDropid].error = true;
          // console.log(index + " #3 NOK");
        }
      } else {
        if (jawab[index].jumdebit.value !== "") {
          jawab[index].jumdebit.error = true;
          dataD[dDropid].error = true;
          // console.log(index + " #3 NOK");
        }
      }

      //#4 Kredit akun
      if (el.jenis === "kredit" && jawab[index].jumkredit.value !== "") {
        // console.log(index + " #4 OK");
        if (Number(el.source.jumkredit) === jawab[index].jumkredit.value) {
          // console.log(index + " #4 OK");
        } else {
          jawab[index].jumkredit.error = true;
          dataD[dDropid].error = true;
          // console.log(index + " #4 NOK");
        }
      } else {
        if (jawab[index].jumkredit.value !== "") {
          jawab[index].jumkredit.error = true;
          dataD[dDropid].error = true;
          // console.log(index + " #4 NOK");
        }
      }
    });

    // FINNALY
    const hasil = [];
    jawab.forEach((element, index) => {
      element.code.error ? hasil.push(false) : hasil.push(true);
      element.name.error ? hasil.push(false) : hasil.push(true);
      element.jumdebit.error ? hasil.push(false) : hasil.push(true);
      element.jumkredit.error ? hasil.push(false) : hasil.push(true);
    });
    // conclusion
    if (hasil.every((x) => x === true)) {
      setAllDone(true);
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
          duration: 6000,
        },
      });
    }
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    //ENDEDD CHECK
    if (autoChecker) return;

    if (!destination) return; //jika dopable tujuan tidak null

    const arrsource = source.droppableId.split("_");
    const arrdest = destination.droppableId.split("_");
    //filter 2 drop rule =>
    if (arrsource[0] === "dst" && arrdest[0] === "src") return; //- dst->src
    if (arrsource[0] === "src" && arrdest[0] === "src") return; //- src->src

    //1) Data D(code) -> jwb (code)
    if (
      arrsource[0] === "src" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "code" &&
      arrdest[1] === "code"
    ) {
      // jika dest ada isi
      if (jawab[Number(arrdest[2])].code.value !== "") return;

      // update DST
      const dstup = jawab.map((el, index) =>
        index === Number(arrdest[2])
          ? {
              ...el,
              code: {
                ...el.code,
                value: dataD[source.index].code,
              },
            }
          : el
      );
      //UPDATED
      setJawab(dstup);
      setDataD(
        dataD.map((el, index) =>
          index === source.index
            ? {
                ...el,
                dragable: { ...el.dragable, code: "" },
              }
            : el
        )
      );
    }
    // FLIP Ver
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "code" &&
      arrdest[1] === "code"
    ) {
      const safedst = jawab[Number(arrdest[2])].code.value;
      // update DST
      const dstup = jawab.map((el, index) =>
        index === Number(arrdest[2])
          ? {
              ...el,
              code: {
                ...el.code,
                value: jawab[source.index].code.value,
              },
            }
          : el
      );
      //UPDATED
      const dstup2 = dstup.map((el, index) =>
        index === source.index
          ? {
              ...el,
              code: {
                ...el.code,
                value: safedst,
              },
            }
          : el
      );
      setJawab(dstup2);
    }
    //2) Data D(Nama) -> jwb (nama)
    if (
      arrsource[0] === "src" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "name" &&
      arrdest[1] === "name"
    ) {
      // jika dest ada isi
      if (jawab[Number(arrdest[2])].name.value !== "") return;

      // update DST
      const dstup = jawab.map((el, index) =>
        index === Number(arrdest[2])
          ? {
              ...el,
              name: {
                ...el.name,
                value: dataD[source.index].name,
              },
            }
          : el
      );
      //UPDATED
      setJawab(dstup);
      setDataD(
        dataD.map((el, index) =>
          index === source.index
            ? {
                ...el,
                dragable: { ...el.dragable, name: "" },
              }
            : el
        )
      );
    }
    // FLIP Ver
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "name" &&
      arrdest[1] === "name"
    ) {
      const safedst = jawab[Number(arrdest[2])].name.value;
      // update DST
      const dstup = jawab.map((el, index) =>
        index === Number(arrdest[2])
          ? {
              ...el,
              name: {
                ...el.name,
                value: jawab[source.index].name.value,
              },
            }
          : el
      );
      //UPDATED
      const dstup2 = dstup.map((el, index) =>
        index === source.index
          ? {
              ...el,
              name: {
                ...el.name,
                value: safedst,
              },
            }
          : el
      );
      setJawab(dstup2);
    }
    //3) Data D(DEBIT) -> jwb (Jumlah)
    if (
      arrsource[0] === "src" &&
      arrdest[0] === "dst" &&
      arrdest[1].split("-").length >= 2 &&
      arrsource[1].split("-").length >= 2
    ) {
      // jika dest ada isi || DEST ada isi samping
      if (
        jawab[Number(arrdest[2])][arrdest[1].split("-")[1]].value !== "" ||
        (jawab[Number(arrdest[2])][arrdest[1].split("-")[1]].value === "" &&
          jawab[Number(arrdest[2])][arrdest[1].split("-")[2]].value !== "")
      ) {
        toast.error("Tidak dapat disi di kedua sisi Debit dan kredit ");
        return;
      }

      // update DST
      const dstup = jawab.map((el, index) =>
        index === Number(arrdest[2])
          ? {
              ...el,
              [arrdest[1].split("-")[1]]: {
                ...el[arrdest[1].split("-")[1]],
                value: dataD[source.index].dragable[arrsource[1].split("-")[1]],
              },
            }
          : el
      );
      //UPDATED
      setJawab(dstup);
      setDataD(
        dataD.map((el, index) =>
          index === source.index
            ? {
                ...el,
                dragable: { ...el.dragable, [arrsource[1].split("-")[1]]: "" },
              }
            : el
        )
      );
    }
    // FLIP Ver
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "dst" &&
      arrdest[1].split("-").length >= 2 &&
      arrsource[1].split("-").length >= 2
    ) {
      //  | DEST ada isi samping =batal
      if (
        Number(arrdest[2]) !== source.index &&
        jawab[Number(arrdest[2])][arrdest[1].split("-")[1]].value === "" &&
        jawab[Number(arrdest[2])][arrdest[1].split("-")[2]].value !== ""
      ) {
        toast.error("Tidak dapat disi di kedua sisi Debit dan kredit ");
        return;
      }
      const safedst = jawab[Number(arrdest[2])][arrdest[1].split("-")[1]].value;
      // update DST
      const dstup = jawab.map((el, index) =>
        index === Number(arrdest[2])
          ? {
              ...el,
              [arrdest[1].split("-")[1]]: {
                ...el[arrdest[1].split("-")[1]],
                value: jawab[source.index][arrsource[1].split("-")[1]].value,
              },
            }
          : el
      );
      //UPDATED
      const dstup2 = dstup.map((el, index) =>
        index === source.index
          ? {
              ...el,
              [arrsource[1].split("-")[1]]: {
                ...el[arrsource[1].split("-")[1]],
                value: safedst,
              },
            }
          : el
      );
      setJawab(dstup2);
    }

    const s = arrsource[1].split("-")[0];
    const d = arrdest[1].split("-")[0];
    //prompt Error
    if (
      (s === "code" && d === "name") ||
      (s === "name" && d === "code") ||
      (s === "name" && d === "jum") ||
      (s === "code" && d === "jum") ||
      (s === "jum" && d === "code") ||
      (s === "jum" && d === "name")
    ) {
      toast.error("Drop pada jenis yang sesuai");
    }

    return;
  };
  // #endregion

  return (
    <div className="static">
      <Helmet>
        <title>Game Simulasi 9</title>
      </Helmet>
      <div className="w-full min-h-20v relative">
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
        {load && <LoadingWait />}
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
              <div className="w-full bg-white">
                *Data (Soal)
                {/* TABEL DRAG Source */}
                {dataD ? (
                  dataD.map((item, j) => {
                    return (
                      <TblBukuBesar
                        key={j}
                        item={item}
                        i={j}
                        autoChecker={autoChecker}
                      />
                    );
                  })
                ) : (
                  <div className="bg-white p-3">
                    <div className="my-5">
                      <div className="flex justify-center">
                        <ShimmerBadge width={200} />
                      </div>
                      <ShimmerTable row={2} col={5} />
                    </div>
                    <div className="my-5">
                      <div className="flex justify-center">
                        <ShimmerBadge width={200} />
                      </div>
                      <ShimmerTable row={2} col={5} />
                    </div>
                    <div className="my-5">
                      <div className="flex justify-center">
                        <ShimmerBadge width={200} />
                      </div>
                      <ShimmerTable row={2} col={5} />
                    </div>
                  </div>
                )}
              </div>
            </Grid>

            {/* data Drag Worksheet */}
            {showSide ? (
              <Grid item xs={12} md={5} lg={5} className=" ">
                <div className="sticky top-20 border shadow-md bg-white">
                  <div className="min-h-1/4 w-full ">
                    <div className="flex p-3 border-b">
                      <Tooltip
                        title="Sembunyikan WorkSheet"
                        placement="right-end"
                        arrow
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
                        Worksheet
                      </h2>
                    </div>
                    {/* List Data Worksheet */}

                    <div className="p-5 border border-dashed">
                      <div className="p-3 mx-auto text-center text-2xl font-semibold">
                        {config && config.narasi_1}
                      </div>
                      <div className="mx-auto text-xl w-full text-center">
                        NERACA SALDO
                      </div>
                      <div className="mx-auto text-xl w-full text-center">
                        {config && config.narasi_2}
                      </div>
                      <table className="border-collapse w-full table-fixed">
                        <thead>
                          <tr>
                            <th className="w-3/12 p-2 border table-cell">
                              Kode
                            </th>
                            <th className="w-3/12 p-2 border table-cell">
                              Nama Akun
                            </th>
                            <th className="w-3/12 p-2 border table-cell">
                              Debet (Rp)
                            </th>
                            <th className="w-3/12 p-2 border table-cell">
                              Kredit (Rp)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {jawab &&
                            jawab.map((item, i) => (
                              <TblDropableBB
                                key={i}
                                i={i}
                                item={item}
                                autoChecker={autoChecker}
                                dataDef={dataDef}
                              />
                            ))}
                        </tbody>
                        <tbody>
                          <tr>
                            <td
                              colSpan="2"
                              className="p-2 border text-center table-cell"
                            >
                              Jumlah
                            </td>
                            <td className="p-2 border table-cell">
                              {totalDebit()}{" "}
                            </td>
                            <td className="p-2 border table-cell">
                              {totalKredit()}{" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="flex flex-col w-full p-5">
                    <div className="text-xs">
                      *drag data soal ke dalam Worksheet
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
                    {/* autoChecker */}
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
                        disabled={autoChecker}
                        onClick={() => {
                          setAutoChecker(true);
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
                        resetButton();
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </Grid>
            ) : null}
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
            <h2>Tampilkan Worksheet</h2>
          </div>
        )}
      </div>
    </div>
  );
}
