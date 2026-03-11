// #region
import { forwardRef, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { Helmet } from "react-helmet";
import {
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerSectionHeader,
} from "react-shimmer-effects";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import makeStyles from "@mui/styles/makeStyles";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TextField from "@mui/material/TextField";
import NumberFormat from "react-number-format";
import toast from "react-hot-toast";
import axios from "axios";
import API from "../../../../utils/host.config";
import ModalEditTotalJumlahGs3Preview from "../components/ModalEditTotalJumlahGs3Preview";
import ItemsDataGs3 from "../components/ItemsDataGs3";
import ItemsDataTotalGs3 from "../components/ItemsDataTotalGs3";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import swal from "sweetalert";

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

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

// #endregion

export default function PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  // update counter
  const [load, setLoad] = useState(false);

  const { id } = useParams();
  const [sConfig, setSConfig] = useState([12, 7, 7]);
  const [showSide, setShowSide] = useState(true);
  const [autoCheckerStep1, setAutoCheckerStep1] = useState(false);
  const [autoCheckerStep2, setAutoCheckerStep2] = useState(false);
  const [btnDisCheck2, setbtnDisCheck2] = useState(false); //true for disable check on item salah
  // data api
  const [data, setData] = useState(null);
  const [dataSoal, setDataSoal] = useState(null);
  const [dataConfig, setDataConfig] = useState(null);
  const [dataDef, setDatadef] = useState([]);
  const [tblDebit, setTblDebit] = useState([]);
  const [tblKredit, setTblKredit] = useState([]);
  //
  const [datatot, setDatatot] = useState(0);
  const [errTotal, setErrTotal] = useState(false);
  const [modEditTotal, setModEditTotal] = useState(false);
  const [dragTotal, setDragTotal] = useState(false);
  //counter STEP
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);

  //#region
  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs3/data/${id}/soal`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => { 
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
          // insert Dummy val user
          setLoad(false);

          const data_tmp = res.data;
          data_tmp["selected"] = res.data.selected.map((item, index) => {
            const da = item;
            da["usrval"] = 0;
            da["error"] = false;
            da["dest"] = null;
            da["src"] = res.data.selected[index];
            da["srcjumlah"] = res.data.selected[index];
            return da;
          });

          setData(data_tmp.selected);
          setDataSoal(res.data.listsoal);
          setDataConfig(data_tmp.config);
          setDatadef(res.data);
          setTblDebit([
            ...Array(res.data.selected.length).fill({ id: null, value: null }),
          ]);
          setTblKredit([
            ...Array(res.data.selected.length).fill({ id: null, value: null }),
          ]);

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
    // console.log('datLog', dataConfig);
    fetchData();
  }, [id, history]);

  const resetButton = () => {
    // console.log(data);
    //reseting
    setDatatot(0);
    setErrTotal(false);
    setStep1(false);
    setStep2(false);
    setAutoCheckerStep1(false);
    setAutoCheckerStep2(false);
    setbtnDisCheck2(false);
    setData(null);
    // setDataD(null);
    const data_tmp = dataDef;
    //
    setTblDebit([
      ...Array(dataDef.selected.length).fill({ id: null, value: null }),
    ]);
    setTblKredit([
      ...Array(dataDef.selected.length).fill({ id: null, value: null }),
    ]);

    setTimeout(() => {
      data_tmp["selected"] = data_tmp.selected.map((item) => {
        const da = item;
        da["usrval"] = 0;
        return da;
      });
      setData(data_tmp.selected);
    }, 100);
  };

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const check = () => {
    // console.log("verif");
    setAutoCheckerStep1(true);
    // check VERIF Nilai
    var total = 0;
    // console.log(dataSoal);
    // console.log(data);
    let dkred = [...data].filter((x) => x.jenis === "kredit");
    let ddeb = [...data].filter((x) => x.jenis === "debit");
    // reorder debit frist
    const dat = [...ddeb, ...dkred];

    const data_ver = dat.map((item, index) => {
      const da = item;
      //insert verif nilai
      //check kredit
      if (item.jenis === "kredit") {
        da["error"] = false;
        return da;
      }

      if (index === 0) {
        da["nilai"] = Number(dataSoal[0].nilai) + Number(dataSoal[1].nilai);
      } else {
        da["nilai"] = Number(dataSoal[index + 1].nilai);
      }

      total += da.nilai;
      if (da.nilai === da.usrval) {
        da["error"] = false;
      } else {
        da["error"] = true;
      }
      return da;
    });

    // setVerif
    setData(
      data_ver.map((el) =>
        el.jenis === "kredit"
          ? {
              ...el,
              nilai: Number(total),
            }
          : el
      )
    );
    // console.log(data_ver);

    setErrTotal(total === datatot ? false : true);
    // check jika tidak ada error
    var allTrue = data_ver.every((el) => el.error === false);
    if (allTrue && Number(total) === Number(datatot)) {
      setErrTotal(false);
      setDragTotal(true);
      setStep1(true);
      // console.log("Benar Semua");
      // console.log(data);
      toast.success(`Yay Benar Lanjut ke step berikutnya.`, {
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
      setStep1(false);
      // console.log("ada yang salah " + total + "===" + datatot);
    }
  };

  const check2 = () => {
    // console.log("tabel 4 check");
    // console.log(data);
    // console.log(dataSoal);
    // console.log(tblDebit);
    // console.log(tblKredit);

    const dataDebVer = tblDebit.map((item, index) => {
      const tmp = item;
      // console.log(tmp);
      // console.log(index + "Debit");
      if (item.id !== null) {
        // id tidak kosong
        // verif debit loca
        if (item.id.jenis === "debit") {
          tmp.id["stat"] = true;
          //verif nilai
          if (item.value !== null) {
            if (item.id.nilai === item.value.nilai) {
              tmp.value["stat"] = true;
              tmp["stat"] = true;
            } else {
              tmp.value["stat"] = false;
              tmp["stat"] = false;
            }
          } else {
            // value null
            tmp["stat"] = false;
          }
        } else {
          tmp.id["stat"] = false;
          tmp["stat"] = false;
        }
      } else {
        if (item.id === null && item.value !== null) {
          tmp.value["stat"] = false;
          tmp["stat"] = false;
        } else {
          tmp["stat"] = true;
        }
      }
      return tmp;
    });

    const dataKreditVer = tblKredit.map((item, index) => {
      const tmp = item;
      // console.log(tmp);
      // console.log(index);
      if (item.id !== null) {
        // id tidak kosong
        // verif debit loca
        if (item.id.jenis === "kredit") {
          // console.log(item.id.jenis);
          tmp.id["stat"] = true;
          //verif nilai
          if (item.value !== null) {
            if (Number(item.id.nilai) === Number(item.value.nilai)) {
              tmp.value["stat"] = true;
              tmp["stat"] = true;
            } else {
              tmp.value["stat"] = false;
              tmp["stat"] = false;
            }
          } else {
            // tidak ada value
            tmp["stat"] = false;
          }
        } else {
          tmp.id["stat"] = false;
          tmp["stat"] = false;
        }
      } else {
        if (item.id === null && item.value !== null) {
          tmp.value["stat"] = false;
          tmp["stat"] = false;
        } else {
          tmp["stat"] = true;
        }
      }
      return tmp;
    });

    //
    // console.log(dataDebVer);
    // console.log(dataKreditVer);
    setAutoCheckerStep2(true);

    var allTrueDeb = dataDebVer.every((el) => el.stat === true);
    var allTrueKre = dataKreditVer.every((el) => el.stat === true);
    // disable button check for twice
    setbtnDisCheck2(true);

    if (allTrueDeb && allTrueKre) {
      //set for end btn save
      setStep2(true);

      toast.success(`Benar semua `, {
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
      });
    } else {
      toast.error(`Ada yang Salah`, {
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
    if (autoCheckerStep2) {
      toast.error("Game telah berakhir klik reset untuk mengulang.");
      return; // selesai tidak bisa dirubah
    }

    const { destination, source } = result;
    // console.log(result);
    if (!destination) return; //jika dopable tujuan tidak null
    //data
    const data_temp = [...data]; // data temp for edited
    const arrsource = source.droppableId.split("_"); //"src_kode_543"
    const arrdest = destination.droppableId.split("_");
    //
    //filter drop =>
    if (arrsource[0] === "dst" && arrdest[0] === "src") return; //- dst->src
    if (arrsource[0] === "src" && arrdest[0] === "src") return; //- dst->src

    //
    // id dest & src
    const idsrc = data.findIndex((x) => x.code === arrsource[2]);
    const idd = data.findIndex((x) => x.code === arrdest[2]);
    //debit
    if (arrdest[1].split("-")[1] === "debit") {
      // dst -dst ->jumlah / FLIP
      if (
        arrsource[0] === "dst" &&
        arrdest[0] === "dst" &&
        arrdest[1].split("-")[0] === "jumlah"
      ) {
        //flip - JUMLAH
        //destination - Persiapan Data -
        // console.log("isflip -jumlah");
        if (arrdest[1].split("-")[1] !== arrsource[1].split("-")[1]) {
          // console.log("flip KREDIT->DEBIT");
          const tmp_arrK = [...tblKredit];
          const tmp_arrD = [...tblDebit];
          const tmp_flp_src = tblKredit[idsrc].value;
          const tmp_flp_dest = tblDebit[idd].value;
          // apply flip
          const dstupD1 = tmp_arrD.map((el, index) =>
            index === idd ? { ...el, value: tmp_flp_src } : el
          );
          const dstupD2 = tmp_arrK.map((el, index) =>
            index === idsrc ? { ...el, value: tmp_flp_dest } : el
          );
          setTblDebit(dstupD1);
          setTblKredit(dstupD2);
        } else {
          const tmp_arr = [...tblDebit];
          const tmp_flp_dest = tblDebit[idd].value;
          const tmp_flp_src = tblDebit[idsrc].value;

          // console.log(tmp_flp_src);
          // console.log(tmp_flp_dest);

          const dstup = tmp_arr.map((el, index) =>
            index === idd ? { ...el, value: tmp_flp_src } : el
          );
          const dstup2 = dstup.map((el, index) =>
            index === idsrc ? { ...el, value: tmp_flp_dest } : el
          );
          setTblDebit(dstup2);
        }
      } else if (
        arrsource[0] === "dst" &&
        arrdest[0] === "dst" &&
        arrdest[1].split("-")[0] === "kode"
      ) {
        //flip
        //destination
        // console.log("isflip -KODE");
        if (arrdest[1].split("-")[1] !== arrsource[1].split("-")[1]) {
          // console.log("flip KREDIT->DEBIT");
          const tmp_arrK = [...tblKredit];
          const tmp_arrD = [...tblDebit];
          const tmp_flp_src = tblKredit[idsrc].id;
          const tmp_flp_dest = tblDebit[idd].id;
          // apply flip
          const dstupD1 = tmp_arrD.map((el, index) =>
            index === idd ? { ...el, id: tmp_flp_src } : el
          );
          const dstupD2 = tmp_arrK.map((el, index) =>
            index === idsrc ? { ...el, id: tmp_flp_dest } : el
          );
          setTblDebit(dstupD1);
          setTblKredit(dstupD2);
        } else {
          // FLIP SAME KREDIT<->KREDIT
          const tmp_arr = [...tblDebit];
          const tmp_flp_dest = tblDebit[idd].id;
          const tmp_flp_src = tblDebit[idsrc].id;

          // console.log(tmp_flp_src);
          // console.log(tmp_flp_dest);

          const dstup = tmp_arr.map((el, index) =>
            index === idd ? { ...el, id: tmp_flp_src } : el
          );
          // console.log(dstup);
          const dstup2 = dstup.map((el, index) =>
            index === idsrc ? { ...el, id: tmp_flp_dest } : el
          );
          // console.log(dstup2);
          setTblDebit(dstup2);
        }
      }
      // src -> des ->jumlah
      if (
        arrsource[0] === "src" &&
        arrdest[0] === "dst" &&
        arrsource[1] === "jumlah"
      ) {
        // jika dest ada isi
        if (tblDebit[idd].value !== null) {
          toast.error("Drop pada tempat yang kosong.");
          return;
        }

        //jika ini data total
        if (arrsource[2] === "total") {
          const dstup = tblDebit.map((el, index) =>
            index === idd ? { ...el, value: { nilai: datatot } } : el
          );
          setTblDebit(dstup);
          setDragTotal(false);
          return;
        }

        if (tblDebit[idd].value !== null) return;
        // console.log("ahahaha");
        //update dst
        const dstup = tblDebit.map((el, index) =>
          index === idd ? { ...el, value: data_temp[idsrc] } : el
        );
        setTblDebit(dstup);
        // console.log(dstup);
        //update src
        const allup = data.map((el, index) =>
          index === data.findIndex((x) => x.code === arrsource[2])
            ? {
                ...el,
                srcjumlah: null,
              }
            : el
        );
        setData(allup);
      } else if (
        arrsource[0] === "src" &&
        arrdest[0] === "dst" &&
        arrsource[1] === "kode"
      ) {
        // jika dest ada isi
        if (tblDebit[idd].id !== null) {
          toast.error("Drop pada tempat yang kosong.");
          return;
        }

        //src code
        //src id
        //update dst
        const dstup = tblDebit.map((el, index) =>
          index === idd ? { ...el, id: data_temp[idsrc] } : el
        );
        setTblDebit(dstup);
        // console.log(dstup);
        //update src
        const allup = data.map((el, index) =>
          index === data.findIndex((x) => x.code === arrsource[2])
            ? {
                ...el,
                src: null,
              }
            : el
        );
        setData(allup);
      }
    }
    // kredit
    else if (arrdest[1].split("-")[1] === "kredit") {
      // dst -dst ->jumlah
      if (
        arrsource[0] === "dst" &&
        arrdest[0] === "dst" &&
        arrdest[1].split("-")[0] === "jumlah"
      ) {
        //flip
        //destination
        if (arrsource[1].split("-")[1] !== arrdest[1].split("-")[1]) {
          // console.log("flip DEBIT->KREDIT");
          const tmp_arrD = [...tblDebit];
          const tmp_arrK = [...tblKredit];
          const tmp_flp_src = tblDebit[idsrc].value;
          const tmp_flp_dest = tblKredit[idd].value;
          // apply flip
          const dstupD1 = tmp_arrK.map((el, index) =>
            index === idd ? { ...el, value: tmp_flp_src } : el
          );
          const dstupD2 = tmp_arrD.map((el, index) =>
            index === idsrc ? { ...el, value: tmp_flp_dest } : el
          );
          setTblKredit(dstupD1);
          setTblDebit(dstupD2);
        } else {
          // console.log("isflip -jumlah");
          const tmp_arr = [...tblKredit];
          const tmp_flp_dest = tblKredit[idd].value;
          const tmp_flp_src = tblKredit[idsrc].value;

          // console.log(tmp_flp_src);
          // console.log(tmp_flp_dest);

          const dstup = tmp_arr.map((el, index) =>
            index === idd ? { ...el, value: tmp_flp_src } : el
          );
          const dstup2 = dstup.map((el, index) =>
            index === idsrc ? { ...el, value: tmp_flp_dest } : el
          );
          setTblKredit(dstup2);
        }
      } else if (
        arrsource[0] === "dst" &&
        arrdest[0] === "dst" &&
        arrdest[1].split("-")[0] === "kode"
      ) {
        //flip
        //destination
        if (arrsource[1].split("-")[1] !== arrdest[1].split("-")[1]) {
          // console.log("flip DEBIT->KREDIT");
          const tmp_arrD = [...tblDebit];
          const tmp_arrK = [...tblKredit];
          const tmp_flp_src = tblDebit[idsrc].id;
          const tmp_flp_dest = tblKredit[idd].id;
          // apply flip
          const dstupD1 = tmp_arrK.map((el, index) =>
            index === idd ? { ...el, id: tmp_flp_src } : el
          );
          const dstupD2 = tmp_arrD.map((el, index) =>
            index === idsrc ? { ...el, id: tmp_flp_dest } : el
          );
          setTblKredit(dstupD1);
          setTblDebit(dstupD2);
        } else {
          // console.log("isflip -KODE");
          const tmp_arr = [...tblKredit];
          const tmp_flp_dest = tblKredit[idd].id;
          const tmp_flp_src = tblKredit[idsrc].id;

          // console.log(tmp_flp_src);
          // console.log(tmp_flp_dest);

          const dstup = tmp_arr.map((el, index) =>
            index === idd ? { ...el, id: tmp_flp_src } : el
          );
          // console.log(dstup);
          const dstup2 = dstup.map((el, index) =>
            index === idsrc ? { ...el, id: tmp_flp_dest } : el
          );
          // console.log(dstup2);
          setTblKredit(dstup2);
        }
      }

      //src value
      // src -dst ->jumlah
      if (
        arrsource[0] === "src" &&
        arrdest[0] === "dst" &&
        arrsource[1] === "jumlah"
      ) {
        // jika dest ada isi
        if (tblKredit[idd].value !== null) {
          toast.error("Drop pada tempat yang kosong.");
          return;
        }

        //jika ini data total
        if (arrsource[2] === "total") {
          const dstup = tblKredit.map((el, index) =>
            index === idd ? { ...el, value: { nilai: datatot } } : el
          );
          setTblKredit(dstup);
          setDragTotal(false);
          return;
        }

        const dstup = tblKredit.map((el, index) =>
          index === idd ? { ...el, value: data_temp[idsrc] } : el
        );
        setTblKredit(dstup);
        // console.log(dstup);
        //update src
        const allup = data.map((el, index) =>
          index === data.findIndex((x) => x.code === arrsource[2])
            ? {
                ...el,
                srcjumlah: null,
              }
            : el
        );
        setData(allup);
      }
      // src -dst ->kode
      else if (
        arrsource[0] === "src" &&
        arrdest[0] === "dst" &&
        arrsource[1] === "kode"
      ) {
        // jika dest ada isi
        if (tblKredit[idd].id !== null) {
          toast.error("Drop pada tempat yang kosong.");
          return;
        }
        //update dest id
        const dstup = tblKredit.map((el, index) =>
          index === idd ? { ...el, id: data_temp[idsrc] } : el
        );
        setTblKredit(dstup);
        // console.log(dstup);
        //update src
        const allup = data.map((el, index) =>
          index === data.findIndex((x) => x.code === arrsource[2])
            ? {
                ...el,
                src: null,
              }
            : el
        );
        setData(allup);
      }
    }
  };
  //#endregion

  return (
    <div className="static">
      <Helmet>
        <title>Game Simulasi 3</title>
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
            {dataConfig ? (
              ReactHtmlParser(dataConfig.narasisoal)
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
            {!dataConfig && (
              <Grid item xs={sConfig[0]} md={sConfig[1]} lg={sConfig[2]}>
                <div className="p-5 border border-dashed bg-white pb-10">
                  <div className="mt-3 -mb-10">
                    <ShimmerSectionHeader center />
                    <ShimmerText line={2} gap={10} />
                    <ShimmerTable row={3} col={2} />
                  </div>
                </div>
              </Grid>
            )}
            {dataConfig && (
              <Grid
                item
                xs={sConfig[0]}
                md={sConfig[1]}
                lg={sConfig[2]}
                className="relative bg-white"
              >
                <div className="absolute opacity-50 italic font-semibold p-1 bg-white">
                  Worksheet :
                </div>
                <div className="p-5 border border-dashed ">
                  <div className="flex mt-5">
                    <div className="font-semibold mr-5">
                      {dataConfig && dataConfig.narasi_3}
                    </div>
                    <div>( ) Harian ( ) Penyesuaian</div>
                  </div>
                  <br />
                  <div className="mt-5 mx-auto text-center text-2xl font-semibold">
                    BUKTI MEMORIAL
                  </div>
                  <div className="mx-auto text-sm w-full text-center">
                    {dataConfig && dataConfig.narasi_4}
                  </div>
                  <div className="mb-3 mt-8">
                    {dataConfig && dataConfig.narasi_5}{" "}
                    {step1 && dragTotal ? (
                      <Droppable droppableId={"src_jumlah_total"}>
                        {(provided, snapshot) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex max-w-15v"
                          >
                            <ItemsDataTotalGs3
                              data={toRp(datatot)}
                              index={0}
                              checker={false}
                            />

                            {provided.placeholder}
                          </span>
                        )}
                      </Droppable>
                    ) : (
                      <span
                        onClick={() => {
                          if (step1) return; // not editable on checked sukses
                          setModEditTotal(true);
                        }}
                        className={`bg-white px-2 py-1 border shadow-sm cursor-pointer ${
                          autoCheckerStep1 &&
                          errTotal &&
                          "border-red-300 animate-pulse text-red-600 "
                        } ${step1 && "opacity-20 cursor-text"}`}
                      >
                        {toRp(datatot)}
                      </span>
                    )}{" "}
                    , {dataConfig && dataConfig.narasi_6} :
                  </div>
                  {data &&
                    data.map(
                      (item, i) =>
                        item.jenis === "debit" && (
                          <div
                            key={i}
                            className="flex flex-row justify-evenly "
                          >
                            <div className="px-2 py-2 w-full border text-left flex flex-row items-center ">
                              {item.name}
                            </div>
                            <div className="px-2 py-2 w-full border text-left flex flex-row items-center ">
                              {step1 ? (
                                <Droppable
                                  droppableId={"src_jumlah_" + item.code}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className="flex w-full items-stretch p-1 grow min-h-5v"
                                    >
                                      {item.srcjumlah ? (
                                        <ItemsDataGs3
                                          // data={toRp(item.srcjumlah.nilai)}
                                          data={toRp(item.usrval)}
                                          index={i}
                                          checker={false}
                                        />
                                      ) : (
                                        <div className="px-2 py-2 w-full border text-center opacity-20">
                                          {toRp(item.usrval)}
                                        </div>
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              ) : (
                                <TextField
                                  label={`Jumlah`}
                                  style={{ marginTop: 0, marginBottom: "15px" }}
                                  placeholder="Masukkan Jumlah"
                                  fullWidth
                                  margin="normal"
                                  value={item.usrval}
                                  name="nilai"
                                  error={autoCheckerStep1 && item.error}
                                  helperText={
                                    autoCheckerStep1 &&
                                    item.error &&
                                    "Jumlah tidak sesuai"
                                  }
                                  onChange={(event) => {
                                    //edited row
                                    let itm = {
                                      ...data[i],
                                      usrval: Number(event.target.value),
                                    };
                                    // update edited row
                                    const allupdate = data.map((u) =>
                                      u.code !== itm.code ? u : itm
                                    );
                                    setData(allupdate);
                                  }}
                                  InputProps={{
                                    inputComponent: NumberFormatCustom,
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        )
                    )}
                  <div className="flex flex-row-reverse pb-5 border-b">
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.btnsave}
                      disabled={autoCheckerStep1}
                      onClick={() => {
                        //Harus di isi dulu baru check
                        let allTerisi = data.filter((x) => x.usrval !== 0);
                        if (
                          allTerisi.length < data.length - 1 ||
                          datatot === 0
                        ) {
                          //
                          toast.error(
                            "Sebelum klik check, isi jawaban terlebih dahulu."
                          );
                          return;
                        }

                        setAutoCheckerStep1(true);
                        // console.log(data);
                        check();
                      }}
                    >
                      Check
                    </Button>
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
                  {/* Tabel 4 */}
                  {step1 && (
                    <>
                      <div className="grid grid-flow-row gap-0 bg-white">
                        <div className="grid grid-flow-col grid-cols-4 gap-0 w-full">
                          <div className="px-2 py-2 border text-center font-semibold">
                            Kode
                          </div>
                          <div className="px-2 py-2 border text-center font-semibold">
                            Debet (Rp)
                          </div>
                          <div className="px-2 py-2 border text-center font-semibold">
                            Kode
                          </div>
                          <div className="px-2 py-2 border text-center font-semibold">
                            Kredit (Rp)
                          </div>
                        </div>
                        {data &&
                          data.map((item, i) => (
                            <div
                              key={i}
                              className="grid grid-flow-col grid-cols-4 gap-0"
                            >
                              <Droppable
                                droppableId={"dst_kode-debit_" + item.code}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`relative inline-block w-full items-stretch p-1 border border-slate-200 ${
                                      snapshot.isDraggingOver && "bg-slate-100"
                                    }`}
                                  >
                                    {tblDebit[i] && tblDebit[i].id ? (
                                      <ItemsDataGs3
                                        data={tblDebit[i].id.code}
                                        index={i}
                                        ddid={"kd"}
                                        checker={autoCheckerStep2}
                                        stat={tblDebit[i].id.stat}
                                      />
                                    ) : (
                                      i === 0 && (
                                        <div className="inset-0 opacity-40 text-center">
                                          Drop disini
                                        </div>
                                      )
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                              <Droppable
                                droppableId={"dst_jumlah-debit_" + item.code}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`relative inline-block w-full items-stretch p-1 border border-slate-200 ${
                                      snapshot.isDraggingOver && "bg-slate-100"
                                    }`}
                                  >
                                    {tblDebit[i] && tblDebit[i].value ? (
                                      <ItemsDataGs3
                                        data={toRp(tblDebit[i].value.nilai)}
                                        index={i}
                                        ddid={"jd"}
                                        checker={autoCheckerStep2}
                                        stat={tblDebit[i].value.stat}
                                      />
                                    ) : (
                                      i === 0 && (
                                        <div className="inset-0 opacity-40 text-center">
                                          Drop disini
                                        </div>
                                      )
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                              <Droppable
                                droppableId={"dst_kode-kredit_" + item.code}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`relative inline-block w-full items-stretch p-1 border border-slate-200 ${
                                      snapshot.isDraggingOver && "bg-slate-100"
                                    }`}
                                  >
                                    {tblKredit[i] && tblKredit[i].id ? (
                                      <ItemsDataGs3
                                        data={tblKredit[i].id.code}
                                        index={i}
                                        ddid={"kk"}
                                        checker={autoCheckerStep2}
                                        stat={tblKredit[i].id.stat}
                                      />
                                    ) : (
                                      i === 0 && (
                                        <div className="inset-0 opacity-40 text-center">
                                          Drop disini
                                        </div>
                                      )
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                              <Droppable
                                droppableId={"dst_jumlah-kredit_" + item.code}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`relative w-full inline-block items-stretch p-1 border border-slate-200 grow min-h-5v ${
                                      snapshot.isDraggingOver && "bg-slate-100"
                                    }`}
                                  >
                                    {tblKredit[i] && tblKredit[i].value ? (
                                      <ItemsDataGs3
                                        data={toRp(tblKredit[i].value.nilai)}
                                        index={i}
                                        ddid={"jk"}
                                        checker={autoCheckerStep2}
                                        stat={tblKredit[i].value.stat}
                                      />
                                    ) : (
                                      i === 0 && (
                                        <div className="inset-0 opacity-40 text-center">
                                          Drop disini
                                        </div>
                                      )
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          ))}
                      </div>
                      <div className="flex flex-row-reverse pb-5 border-b">
                        {step2 ? (
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
                            disabled={btnDisCheck2}
                            onClick={() => {
                              // Pengecekan sebelum
                              let allTerisiDebit = tblDebit.filter(
                                (x) => x.id !== null
                              );
                              let allTerisiKredit = tblKredit.filter(
                                (x) => x.id !== null
                              );

                              let allTerisiDebitval = tblDebit.filter(
                                (x) => x.value !== null
                              );
                              let allTerisiKreditval = tblKredit.filter(
                                (x) => x.value !== null
                              );

                              if (
                                allTerisiDebit.length +
                                  allTerisiKredit.length ===
                                  data.length &&
                                allTerisiDebitval.length +
                                  allTerisiKreditval.length ===
                                  data.length
                              ) {
                                check2();
                              } else {
                                toast.error(
                                  "Sebelum klik check, isi jawaban terlebih dahulu."
                                );
                              }
                              // console.log(
                              //   allTerisiKredit.length +
                              //     " - " +
                              //     allTerisiDebit.length
                              // );
                              // console.log(
                              //   allTerisiDebitval.length +
                              //     " :" +
                              //     allTerisiKreditval.length
                              // );
                              // console.log(data.length);
                            }}
                          >
                            Check
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <br />
              </Grid>
            )}

            {/* data Kanan */}
            {showSide ? (
              <Grid item xs={12} md={5} lg={5} className=" ">
                <div className="sticky top-20 border shadow-md bg-white">
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
                        Data Informasi
                      </h2>
                    </div>
                    <div className="flex flex-col px-3">
                      <div
                        className={` grid-flow-col grid-cols-3 ${
                          !dataConfig ? " hidden" : " grid"
                        }`}
                      >
                        <div className="px-2 py-2 w-full border text-left flex flex-row items-center">
                          Kode
                        </div>
                        <div className="px-2 py-2 w-full border text-left flex flex-row items-center col-span-2">
                          Nama Akun
                        </div>
                      </div>
                      {data &&
                        data.map((item, i) => (
                          <div
                            key={i}
                            className="grid grid-flow-col grid-cols-3"
                          >
                            {/* ISI Table 1 */}
                            {step1 ? (
                              <Droppable droppableId={"src_kode_" + item.code}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex w-full items-stretch p-1 border
                              border-slate-200 grow min-h-5v"
                                  >
                                    {item.src ? (
                                      <ItemsDataGs3
                                        data={item.code}
                                        index={i}
                                        checker={false}
                                      />
                                    ) : (
                                      <div className="px-2 py-2 w-full border text-center opacity-20">
                                        {item.code}
                                      </div>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            ) : (
                              <div className="px-2 py-2 w-full border mx-auto flex flex-row items-center">
                                {item.code}
                              </div>
                            )}
                            <div className="px-2 py-2 w-full border text-left flex flex-row items-center col-span-2">
                              {item.name}
                            </div>
                          </div>
                        ))}
                      {!dataConfig && (
                        <>
                          <ShimmerTable row={2} col={2} />
                          <br />
                          <ShimmerTitle
                            line={2}
                            variant="secondary"
                            className="px-2"
                          />
                          <ShimmerTable row={3} col={2} />
                        </>
                      )}
                    </div>
                    <br />
                    <div className="px-3">
                      {/* List Data Akun */}
                      <p className="px-2 py-3 mt-3 font-semibold">
                        {dataConfig && dataConfig.narasi_1}
                      </p>
                      <p className="px-2 py-1 text-sm">
                        {dataConfig && dataConfig.narasi_2} :
                      </p>
                      {dataSoal &&
                        dataSoal.map((item, i) => (
                          <div
                            key={i}
                            className="flex flex-row justify-evenly "
                          >
                            <div className="px-2 py-2 w-full border text-left flex flex-row items-center ">
                              {item.name}
                            </div>
                            <div className="px-2 py-2 w-full border text-left flex flex-row items-center ">
                              {" "}
                              {toRp(item.nilai)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="flex flex-col w-full p-5"></div>
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
            <h2>Tampilkan data</h2>
          </div>
        )}
      </div>
      {/* Modal Location */}
      {modEditTotal && (
        <ModalEditTotalJumlahGs3Preview
          open={modEditTotal}
          data={datatot}
          editData={(da) => setDatatot(da)}
          close={() => setModEditTotal(false)}
        />
      )}
    </div>
  );
}
