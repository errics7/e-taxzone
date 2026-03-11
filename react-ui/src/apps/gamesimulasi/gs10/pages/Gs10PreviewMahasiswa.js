//#region
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import API from "../../../../utils/host.config";
import ReactHtmlParser from "react-html-parser";
import { DragDropContext } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import MhsDataAkun from "../components/MhsDataAkun";
import MhsBuktiMemorial from "../components/MhsBuktiMemorial";
import MhsInformasiPenyusutan from "../components/MhsInformasiPenyusutan";
import MhsWorksheetDrop from "../components/MhsWorksheetDrop";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import { find } from "lodash";

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

export default function Gs10PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [ori, setOri] = useState(null);
  const [jawab, setJawab] = useState(null);
  const [selected, setSelected] = useState(null);

  const [validate1, setValidate1] = useState({ check: false, pass: false });
  const [validate2, setValidate2] = useState({ check: false, pass: false });
  const [alldone, setAlldone] = useState(false);

  //#region
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
          prepareData(res.data);
          //
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
  }, [id]);

  const prepareData = (inp) => {
    setSelected(inp.selected);
    setJawab({
      penyusutanharga: { value: 0, error: false },
      tbl1: inp.dataalokasi.map((item) => {
        const da = item;
        da["value"] = 0;
        da["error"] = false;
        da["kodeacuan"] = item.kodeacuan;
        return da;
      }),
      tbl2: [
        ...Array(
          inp.selected.filter((x) => x.jenis === "debit").length + 1
        ).fill({
          debit: {
            kode: { value: null, status: false },
            nilai: { value: null, status: false },
          },
          kredit: {
            kode: { value: null, status: false },
            nilai: { value: null, status: false },
          },
        }),
      ],
    });
  };

  const reset = () => {
    prepareData(ori);
    setSelected(ori.selected);
    setAlldone(false);
    setValidate1({ check: false, pass: false });
    setValidate2({ check: false, pass: false });
  };

  const checktbl1 = () => {
    const hasil = [];
    //1 penyusutan /th
    if (
      (ori.config.hargaperolehan - ori.config.nilaisisa) / ori.config.umur ===
      Number(jawab.penyusutanharga.value)
    ) {
      // console.log("1 penyusutan /th OK");
      jawab.penyusutanharga = {
        ...jawab.penyusutanharga,
        value_dnd: Number(jawab.penyusutanharga.value),
      };
      hasil.push(true);
    } else {
      hasil.push(false);
      jawab.penyusutanharga = { ...jawab.penyusutanharga, error: true };
    }
    //2 CHECK ALOKASI
    jawab.tbl1.forEach((element, index) => {
      if (
        ((ori.config.hargaperolehan - ori.config.nilaisisa) / ori.config.umur) *
          (element.nilai / 100) ===
        Number(element.value)
      ) {
        // console.log(index + 1 + " Alokasi OK");
        jawab.tbl1 = jawab.tbl1.map((el, i) =>
          index === i
            ? {
                ...el,
                value_dnd: Number(el.value),
              }
            : el
        );
        hasil.push(true);
      } else {
        hasil.push(false);
        jawab.tbl1 = jawab.tbl1.map((el, i) =>
          index === i
            ? {
                ...el,
                error: true,
              }
            : el
        );
      }
    });

    // console.log(jawab);
    setJawab(jawab);
    //FINALLY
    setValidate1({ check: true, pass: hasil.every((x) => x === true) });
    if (hasil.every((x) => x === true)) {
      toast.success(`Yay lanjut ke step berikutnya..`, {
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

  const checktbl2 = () => {
    if (
      selected.length !== selected.filter((x) => x.code_dnd === null).length ||
      jawab.penyusutanharga.value_dnd !== null ||
      jawab.tbl1.length !==
        jawab.tbl1.filter((x) => x.value_dnd === null).length
    ) {
      toast.error(`Kerjakan semua terlebih dahulu`, {
        style: {
          minWidth: "250px",
          border: "1px solid #1E40AF",
          padding: "16px",
          color: "#1E40AF",
          marginBottom: "25px",
        },
        success: {
          duration: 3000,
        },
      });
      return;
    }

    //  START CHECK
    jawab.tbl2.forEach((element, index) => {
      //#1 DEBIT KODE POs
      if (element.debit.kode.value) {
        //kode ADA ISI
        const dt = find(selected, {
          code: element.debit.kode.value,
          jenis: "debit",
        });
        if (dt) {
          const nilai = find(ori.dataalokasi, {
            kodeacuan: element.debit.kode.value,
          });
          if (!nilai) {
            toast.error("Soal Tidak benar mohon hubungi admin untuk koreksi");
            return;
          }
          // Penyusuttan.
          const penyusutan =
            (ori.config.hargaperolehan - ori.config.nilaisisa) /
            ori.config.umur;
          const key = penyusutan * (nilai.nilai / 100);
          if (Number(element.debit.nilai.value) === key) {
            // console.log("3# OK");
          } else {
            element.debit.nilai.status = true;
            // console.log("3# NOK");
          }
          //end
        } else {
          element.debit.kode.status = true;
          element.debit.nilai.status = true;
          // console.log("1# NOK");
        }
      }
      //#1 Kredit KODE POs
      if (element.kredit.kode.value) {
        //kode ADA ISI
        const dt = find(selected, {
          code: element.kredit.kode.value,
          jenis: "kredit",
        });
        if (dt) {
          // Penyusuttan.
          const key =
            (ori.config.hargaperolehan - ori.config.nilaisisa) /
            ori.config.umur;
          if (Number(element.kredit.nilai.value) === key) {
            // console.log("3# OK");
          } else {
            element.kredit.nilai.status = true;
            // console.log("3# NOK");
          }
          //end
        } else {
          element.kredit.kode.status = true;
          element.kredit.nilai.status = true;
          // console.log("1# NOK");
        }
      }
      //
      //# No PARENT
      if (!element.debit.kode.value && element.debit.nilai.value) {
        element.debit.nilai.status = true;
        // console.log("3# NOK Noparent");
      }
      if (!element.kredit.kode.value && element.kredit.nilai.value) {
        element.kredit.nilai.status = true;
        // console.log("4# NOK Noparent");
      }
    });
    // FINNALY
    const hasil = [];
    jawab.tbl2.forEach((element, index) => {
      element.debit.kode.status ? hasil.push(false) : hasil.push(true);
      element.debit.nilai.status ? hasil.push(false) : hasil.push(true);
      element.kredit.kode.status ? hasil.push(false) : hasil.push(true);
      element.kredit.nilai.status ? hasil.push(false) : hasil.push(true);
    });

    setValidate2({ check: true, pass: hasil.every((x) => x === true) });

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
          duration: 6000,
        },
      });
    }
  };

  const onDragEnd = (result) => {
    if (alldone) return; // selesai tidak bisa dirubah
    if (validate2.check) return; // selesai tidak bisa dirubah

    //
    const { destination, source, draggableId } = result;
    //Filter 1
    if (!destination) return; //jika dopable tujuan tidak null lanjutt
    //
    const arrsource = source.droppableId.split("_");
    const arrdest = destination.droppableId.split("_");
    //filter 2 drop rule =>
    if (arrsource[0] === "dst" && arrdest[0] === "src") return; //- dst->src
    if (arrsource[0] === "src" && arrdest[0] === "src") return; //- src->src
    //start move
    //1) Data Akun (Kode) -> tbl2 (kode)
    if (
      arrsource[0] === "src" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "kode" &&
      arrdest[1].split("-")[0] === "kode"
    ) {
      // jika dest ada isi
      if (
        jawab.tbl2[Number(arrdest[2])][arrdest[1].split("-")[1]][
          arrdest[1].split("-")[0]
        ].value !== null
      ) {
        toast.error("Letakkan pada area yang kosong");
        return;
      }

      //update dst
      const dstup = jawab.tbl2.map((el, index) =>
        index === Number(arrdest[2])
          ? {
              ...el,
              [arrdest[1].split("-")[1]]: {
                ...el[arrdest[1].split("-")[1]],
                [arrdest[1].split("-")[0]]: {
                  ...el[arrdest[1].split("-")[1]][arrdest[1].split("-")[0]],
                  value: draggableId.split("_")[1],
                },
              },
            }
          : el
      );
      setJawab({
        ...jawab,
        tbl2: dstup,
      });
      // Update Kode SRC (selected)
      setSelected(
        selected.map((el, index) =>
          index === source.index
            ? {
                ...el,
                code_dnd: null,
              }
            : el
        )
      );
      // setOri({
      //   ...ori,
      //   selected: selected.map((el, index) =>
      //     index === source.index
      //       ? {
      //           ...el,
      //           code_dnd: null,
      //         }
      //       : el
      //   ),
      // });
    }
    // FLip
    //2) tbl2 (kode) -> tbl2 (kode) || dst<->dst
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "dst" &&
      arrsource[1].split("-")[0] === "kode" &&
      arrdest[1].split("-")[0] === "kode"
    ) {
      // FLIP 1) temp safe dest
      var safedst =
        jawab.tbl2[Number(arrdest[2])][arrdest[1].split("-")[1]][
          arrdest[1].split("-")[0]
        ].value;
      // FLIP 2) set DST
      const step1 = jawab.tbl2.map((el, index) =>
        index === Number(arrdest[2])
          ? {
              ...el,
              [arrdest[1].split("-")[1]]: {
                //kode/nilai
                ...el[arrdest[1].split("-")[1]],
                [arrdest[1].split("-")[0]]: {
                  //val/status
                  ...el[arrdest[1].split("-")[1]][arrdest[1].split("-")[0]],
                  value: draggableId.split("_")[1],
                },
              },
            }
          : el
      );
      // FLIP 3) set SRC
      const step2 = step1.map((el, index) =>
        index === Number(arrsource[2])
          ? {
              ...el,
              [arrsource[1].split("-")[1]]: {
                //kode/nilai
                ...el[arrsource[1].split("-")[1]],
                [arrsource[1].split("-")[0]]: {
                  //val/status
                  ...el[arrsource[1].split("-")[1]][arrsource[1].split("-")[0]],
                  value: safedst,
                },
              },
            }
          : el
      );
      setJawab({
        ...jawab,
        tbl2: step2,
      });
    }

    //start move 2
    //3) Data Nilai (nilai) -> tbl2 (nilai)
    if (
      arrsource[0] === "src" &&
      arrdest[0] === "dst" &&
      arrsource[1] === "nilai" &&
      arrdest[1].split("-")[0] === "nilai"
    ) {
      // jika dest ada isi
      if (
        jawab.tbl2[Number(arrdest[2])][arrdest[1].split("-")[1]][
          arrdest[1].split("-")[0]
        ].value !== null
      ) {
        toast.error("Letakkan pada area yang kosong");
        return;
      }

      //update dst
      const step1 = jawab.tbl2.map((el, index) =>
        index === Number(arrdest[2])
          ? {
              ...el,
              //deb/kredit
              [arrdest[1].split("-")[1]]: {
                ...el[arrdest[1].split("-")[1]],
                //kode/nilai
                [arrdest[1].split("-")[0]]: {
                  ...el[arrdest[1].split("-")[1]][arrdest[1].split("-")[0]],
                  //val/status
                  value: draggableId.split("_")[1],
                },
              },
            }
          : el
      );

      // JIKA INI TOTAL PENYUSUTAN
      if (arrsource.length === 4) {
        setJawab({
          ...jawab,
          tbl2: step1,
          penyusutanharga: {
            ...jawab.penyusutanharga,
            value_dnd: null,
          },
        });
      } else {
        //  INI NILAI DARI LIST ALOKASI
        const step2 = jawab.tbl1.map((el, index) =>
          index === source.index
            ? {
                ...el,
                //val DND
                value_dnd: null,
              }
            : el
        );
        setJawab({
          ...jawab,
          tbl2: step1,
          tbl1: step2,
        });
      }
    }
    // FLip
    //4) tbl2 (nilai) -> tbl2 (nilai) || dst<->dst
    if (
      arrsource[0] === "dst" &&
      arrdest[0] === "dst" &&
      arrsource[1].split("-")[0] === "nilai" &&
      arrdest[1].split("-")[0] === "nilai"
    ) {
      // FLIP 1) temp safe dest
      var safedst2 =
        jawab.tbl2[Number(arrdest[2])][arrdest[1].split("-")[1]][
          arrdest[1].split("-")[0]
        ].value;
      // FLIP 2) set DST
      const step1 = jawab.tbl2.map((el, index) =>
        index === Number(arrdest[2])
          ? {
              ...el,
              [arrdest[1].split("-")[1]]: {
                //kode/nilai
                ...el[arrdest[1].split("-")[1]],
                [arrdest[1].split("-")[0]]: {
                  //val/status
                  ...el[arrdest[1].split("-")[1]][arrdest[1].split("-")[0]],
                  value: draggableId.split("_")[1],
                },
              },
            }
          : el
      );
      // FLIP 3) set SRC
      const step2 = step1.map((el, index) =>
        index === Number(arrsource[2])
          ? {
              ...el,
              [arrsource[1].split("-")[1]]: {
                //kode/nilai
                ...el[arrsource[1].split("-")[1]],
                [arrsource[1].split("-")[0]]: {
                  //val/status
                  ...el[arrsource[1].split("-")[1]][arrsource[1].split("-")[0]],
                  value: safedst2,
                },
              },
            }
          : el
      );
      setJawab({
        ...jawab,
        tbl2: step2,
      });
    }

    if (arrsource[0] === "src" && arrdest[0] === "dst") {
      if (
        arrsource[1].split("-")[0] === "nilai" &&
        arrdest[1].split("-")[0] === "kode"
      ) {
        toast.error("Drop pada jenis tempat yang sesuai");
      }
      if (
        arrsource[1].split("-")[0] === "kode" &&
        arrdest[1].split("-")[0] === "nilai"
      ) {
        toast.error("Drop pada jenis tempat yang sesuai");
      }
      //
    }
  };
  //#endregion

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 10</title>
      </Helmet>
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
      <br />
      <div className="w-full mb-3 mt-5 p-2 border bg-slate-50">
        {ori ? (
          ReactHtmlParser(ori.config.narasisoal)
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="stretch"
          className=""
        >
          <Grid item xs={12} md={7} lg={7}>
            <div className="bg-white p-1">
              {/* GAME TBL 1 */}
              <MhsBuktiMemorial
                data={ori}
                jawab={jawab}
                setjawab={(d) => setJawab(d)}
                valid={validate1}
                check={() => checktbl1()}
                reset={() => reset()}
              />

              {/* GAME TBL 2 */}
              {validate1.check && validate1.pass && (
                <MhsWorksheetDrop
                  data={jawab}
                  valid={validate2}
                  alldone={alldone}
                  check2={() => checktbl2()}
                />
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={5} lg={5} className=" ">
            <div className="sticky top-20 border shadow-md bg-white">
              <div className="min-h-1/4 w-full p-2">
                <MhsDataAkun
                  data={selected ? selected : []}
                  valid={validate1}
                />
                <MhsInformasiPenyusutan data={ori} />
              </div>
            </div>
          </Grid>
        </Grid>
      </DragDropContext>

      <br />
      <br />
    </div>
  );
}
