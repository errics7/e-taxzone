//#region
import {
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerSectionHeader,
} from "react-shimmer-effects";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import TabelBahanMhs from "../components/TabelBahanMhs";
import TabelInfoBahanMhs from "../components/TabelInfoBahanMhs";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UiMutasiKeluarMhs from "../components/UiMutasiKeluarMhs";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ReactHtmlParser from "react-html-parser";
import ItemsDataNoId from "../components/ItemsDataNoId";
import LoadingWait from "../../../dashboard/component/LoadingWait";
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
    marginTop: "15px",
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

export default function Gs4PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const { id } = useParams();
  //dat
  const [dOri, setDOri] = useState(null);
  const [dSoal, setDSoal] = useState([]);
  const [dragable, setDragable] = useState(null);
  const [validate, setValidate] = useState(false);
  const [alldone, setAlldone] = useState(false);
  //DST
  const [jawab, setJawab] = useState({
    arrTgl: [],
    arrKet: [],
    arrNoid: [],
    arrKelqty: [],
    arrHargasat: [],
  });

  //#region
  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs4/data/${id}/soal`, {
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
          setDOri(res.data);
          setDSoal(res.data.dataSoal);
          setDragable(res.data.draggable);
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

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return; //jika dopable tujuan tidak null
    //data
    const arrsource = source.droppableId.split("_"); //src_tglpbahan_0
    const arrdest = destination.droppableId.split("_"); //dst_keperluan_0
    //filter drop =>
    if (arrsource[0] === "dst" && arrdest[0] === "src") return; //- dst->src
    if (arrsource[0] === "src" && arrdest[0] === "src") return; //- dst->src

    //@1 src_tglbgudang_0 => dst_tglbgudang_0
    if (arrsource[1] === "tglbgudang" && arrdest[1] === "tglbgudang") {
      if (jawab.arrTgl.length > 0) {
        toast.error("Data sudah terisi klik reset untuk mengulang.");
        return; // sudah ada isi
      }
      const dtemp = dragable.drag_tglbgudang;
      //set Dest
      setJawab({
        ...jawab,
        arrTgl: [...jawab.arrTgl, { value: dtemp, stat: false }],
      });
      //set Src
      setDragable({
        ...dragable,
        drag_tglbgudang: null,
      });
    }
    //@2 src_keperluan_0 => dst_keperluan_0
    if (arrsource[1] === "keperluan" && arrdest[1] === "keperluan") {
      if (jawab.arrKet.length > 0) {
        toast.error("Data sudah terisi klik reset untuk mengulang.");
        return; // sudah ada isi
      }
      const dtemp = dSoal[source.index].drag_keterangan;
      //set Dest
      setJawab({
        ...jawab,
        arrKet: [...jawab.arrKet, { value: dtemp, stat: false }],
      });
      //set Src
      setDSoal(
        [...dSoal].map((el, i) =>
          source.index === i
            ? {
                ...el,
                drag_keterangan: null,
              }
            : el
        )
      );
    }
    //@3 src_noid_0 => dst_noid_0
    if (arrsource[1] === "noid" && arrdest[1] === "noid") {
      if (jawab.arrNoid.length > 0) {
        toast.error("Data sudah terisi klik reset untuk mengulang.");
        return; // sudah ada isi
      }
      const dtemp = dragable.drag_nobppb;
      //set Dest
      setJawab({
        ...jawab,
        arrNoid: [...jawab.arrNoid, { value: dtemp, stat: false }],
      });
      //set Src
      setDragable({
        ...dragable,
        drag_nobppb: null,
      });
    }
    //@4 src_kakel_0 => dst_keluarqty_0
    if (arrsource[1] === "kakel" && arrdest[1] === "keluarqty") {
      if (jawab.arrKelqty.length > 0) {
        toast.error("Data sudah terisi klik reset untuk mengulang.");
        return; // sudah ada isi
      }
      const dtemp = dSoal[source.index].drag_keluarqty;
      //set Dest
      setJawab({
        ...jawab,
        arrKelqty: [...jawab.arrKelqty, { value: dtemp, stat: false }],
      });
      //set Src
      setDSoal(
        [...dSoal].map((el, i) =>
          source.index === i
            ? {
                ...el,
                drag_keluarqty: null,
              }
            : el
        )
      );
    }
    //@5 src_hargasat_0 => dst_hargasat_0
    if (arrsource[1] === "hargasat" && arrdest[1] === "hargasat") {
      if (jawab.arrHargasat.length > 0) {
        toast.error("Data sudah terisi klik reset untuk mengulang.");
        return; // sudah ada isi
      }
      const dtemp = dSoal[source.index].drag_hrgsatuan;
      //set Dest
      setJawab({
        ...jawab,
        arrHargasat: [...jawab.arrHargasat, { value: dtemp, stat: false }],
      });
      //set Src
      setDSoal(
        [...dSoal].map((el, i) =>
          source.index === i
            ? {
                ...el,
                drag_hrgsatuan: null,
              }
            : el
        )
      );
    }

    if (
      (arrsource[1] === "tglbgudang" && arrdest[1] !== "tglbgudang") ||
      (arrsource[1] === "keperluan" && arrdest[1] !== "keperluan") ||
      (arrsource[1] === "noid" && arrdest[1] !== "noid") ||
      (arrsource[1] === "kakel" && arrdest[1] !== "keluarqty") ||
      (arrsource[1] === "hargasat" && arrdest[1] !== "hargasat")
    ) {
      toast.error("Drop pada jenis yang sesuai");
    }
  };
  const resetButton = () => {
    setDragable(dOri.draggable);
    setDSoal(dOri.dataSoal);
    setValidate(false);
    setAlldone(false);
    setJawab({
      arrTgl: [],
      arrKet: [],
      arrNoid: [],
      arrKelqty: [],
      arrHargasat: [],
    });
  };
  const check = () => {
    //check jawaban kosong
    if (jawab.arrTgl.length === 0) {
      toast.error("Tanggal pada Mutasi Keluar belum di selesaikan");
      return;
    }
    if (jawab.arrKet.length === 0) {
      toast.error("Keterangan pada Mutasi Keluar belum di selesaikan");
      return;
    }
    if (jawab.arrNoid.length === 0) {
      toast.error("No Bukti pada Mutasi Keluar belum di selesaikan");
      return;
    }
    if (jawab.arrKelqty.length === 0) {
      toast.error(
        "Jumlah barang keluar pada Mutasi Keluar belum di selesaikan"
      );
      return;
    }
    if (jawab.arrHargasat.length === 0) {
      toast.error("Harga satuan pada Mutasi Keluar belum di selesaikan");
      return;
    }
    // Valid Check
    setJawab({
      arrTgl: [
        {
          value: jawab.arrTgl[0].value,
          stat:
            jawab.arrTgl[0].value === dragable.info_tglbgudang ? true : false,
        },
      ],
      arrKet: [
        {
          value: jawab.arrKet[0].value,
          stat: jawab.arrKet[0].value === dragable.keperluan ? true : false,
        },
      ],
      arrNoid: [
        {
          value: jawab.arrNoid[0].value,
          stat: jawab.arrNoid[0].value === dragable.nobppb ? true : false,
        },
      ],
      arrKelqty: [
        {
          value: jawab.arrKelqty[0].value,
          stat:
            Number(jawab.arrKelqty[0].value) === Number(dragable.keluarqty)
              ? true
              : false,
        },
      ],
      arrHargasat: [
        {
          value: jawab.arrHargasat[0].value,
          stat:
            Number(jawab.arrHargasat[0].value) === Number(dragable.hrgsatuan)
              ? true
              : false,
        },
      ],
    });

    const sumary = [
      jawab.arrTgl[0].value === dragable.info_tglbgudang ? true : false,
      jawab.arrKet[0].value === dragable.keperluan ? true : false,
      jawab.arrNoid[0].value === dragable.nobppb ? true : false,
      Number(jawab.arrKelqty[0].value) === Number(dragable.keluarqty)
        ? true
        : false,
      Number(jawab.arrHargasat[0].value) === Number(dragable.hrgsatuan)
        ? true
        : false,
    ];

    // setAlldone()
    setAlldone(sumary.every((x) => x === true));
    setValidate(true);

    if (sumary.every((x) => x === true)) {
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
  //#endregion

  return (
    <div className="w-full min-h-20v relative">
      {load && <LoadingWait />}
      <Helmet>
        <title>Game Simulasi 4</title>
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
      <div className="w-full mb-3 mt-5 p-2 border bg-slate-50">
        {dragable ? (
          ReactHtmlParser(dragable.narasisoal)
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>

      {/* Container main */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="border border-dashed  min-h-1/2 w-full relative bg-white">
          <div className="absolute opacity-50 italic font-semibold p-1 pr-2">
            Data (Soal) :
          </div>
          {dragable ? (
            <div className="p-3">
              <div className="text-xl uppercase text-center pt-8">
                Bukti Permintaan & Pemakaian Bahan
              </div>
              <div className="text-lg flex flex-col items-center uppercase text-center">
                <div className="flex items-center mt-2">
                  <div>NO BPPB : </div>
                  <div className="px-2 relative">
                    <Droppable droppableId={"src_noid_0"}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex ${
                            snapshot.isDraggingOver && "bg-slate-200"
                          }`}
                        >
                          {dragable &&
                            (dragable.drag_nobppb !== null ? (
                              <ItemsDataNoId
                                data={dragable.drag_nobppb}
                                index={0}
                                checker={false}
                              />
                            ) : (
                              <span className="opacity-40">
                                {dragable.nobppb}
                              </span>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
              <br />
              <TabelBahanMhs data={dSoal} setdata={(dat) => setDSoal(dat)} />
              <br />
              <TabelInfoBahanMhs
                dataDrag={dragable}
                setdata={(dat) => setDragable(dat)}
              />
              <br />
            </div>
          ) : (
            <div className="mt-10">
              <div className="-mb-8">
                <ShimmerSectionHeader center />
              </div>
              <ShimmerTable row={3} col={7} />
            </div>
          )}
        </div>

        <UiMutasiKeluarMhs
          dataDrag={dragable}
          jawaban={jawab}
          selected={dragable}
          setdata={(dat) => setDragable(dat)}
          validate={validate}
          //
        />
        <div className="flex flex-row-reverse pb-5 border-b">
          {validate && alldone ? (
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
              disabled={validate}
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
              resetButton();
            }}
          >
            Reset
          </Button>
        </div>
      </DragDropContext>
    </div>
  );
}
