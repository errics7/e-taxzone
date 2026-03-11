//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import API from "../../../../utils/host.config";

import ReactHtmlParser from "react-html-parser";
import toast from "react-hot-toast";
import { ShimmerTitle, ShimmerText } from "react-shimmer-effects";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import TableMhs from "../components/TableMhs";
import TableWsMhs from "../components/TableWsMhs";
import ShimmerMhsgs2 from "../components/ShimmerMhsgs2";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  btnback: {
    backgroundColor: "#7C7C7C",
    textTransform: "none",
    marginLeft: "0",
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

export default function Gs2Mhs(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [update, setUpdate] = useState(0);
  const [dataTable, setDataTable] = useState(null);
  const [kuantitas, setKuantitas] = useState([]);
  const [hpUnit, setHpUnit] = useState([]);
  const [jumlah, setJumlah] = useState([]);
  const [isAnswer, setIsAnswer] = useState(false);

  // #endregion data dumm
  const [checking, setChecking] = useState(false);
  const [alldone, setAlldone] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      axios(`${API.HOST}/api/v2/gamesimulasi2/${id}/config`, {
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
          //
          setDataTable(res.data);
          // Prepare
        })
        .catch((error) => {
          if (error.response.status === 401) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 400) {
            console.log(error.response.data.message);
            toast.error(
              "Terjadi Keslahan server, Silahkan refresh halaman kembali."
            );
          } else {
            console.log(error);
            toast.error(error.response.data.message);
          }
        });
    };

    fetchData();
  }, [id, history, update]);

  const check = () => {
    // after click button set is answer to true
    setIsAnswer(true);

    // step 1 convert to array
    const dHargaBeli = dataTable.databarang.map((item) => item.hargabeli);
    const dStok = dataTable.databarang.map((item) => item.stok);
    const dSaldo = dataTable.databarang.map(
      (item) => item.stok * item.hargabeli
    );

    const dKuantitas = kuantitas.map((item) => parseInt(item));
    const dUnit = hpUnit.map((item) => parseInt(item));
    const dJumlah = jumlah.map((item) => parseInt(item));

    // step 2 function for cek same condition
    const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    // create variabel isequal
    const checkAnswer1 = isEqual(dHargaBeli, dUnit);
    const checkAnswer2 = isEqual(dStok, dKuantitas);
    const checkAnswer3 = isEqual(dSaldo, dJumlah);

    // step 3 finish
    if (checkAnswer1 && checkAnswer2 && checkAnswer3) {
      setAlldone(true);
      setChecking(true);
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
      setChecking(false);
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

    // console.log(dKuantitas)
    // for (let i = 0; i < dBarang.length; i++) {
    //     const cekKuantitas = (dBarang[i].stok === dKuantitas[i])
    //     const cekHpUnit = (dBarang[i].hargabeli === dUnit[i])
    //     const cekJumlah = (dSaldo[i] === dJumlah[i])
    //     // console.log('cek kuantitas ', cekKuantitas)
    //     // console.log('cekHpUnit ', cekHpUnit)
    //     // console.log('cek jumlah ', cekJumlah)
    //     if(cekKuantitas === true && cekHpUnit === true && cekJumlah === true) {
    //         setChecking(true)
    //         setAlldone(true)
    //     } else {
    //         setChecking(false)
    //     }

    // }

    // if (checking === true) {
    //   toast.success(`Yay Benar semua `, {
    //     style: {
    //       minWidth: "250px",
    //       border: "1px solid #1E40AF",
    //       padding: "16px",
    //       color: "#1E40AF",
    //       marginBottom: "25px",
    //     },
    //     success: {
    //       duration: 6000,
    //     },
    //   });
    // } else {
    //   toast.error(`Ada yang salah silahkan Ulangi kembali`, {
    //     style: {
    //       minWidth: "250px",
    //       border: "1px solid #1E40AF",
    //       padding: "16px",
    //       color: "#1E40AF",
    //       marginBottom: "25px",
    //     },
    //     success: {
    //       duration: 10000,
    //     },
    //   });
    // }
  };

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 2 Perdagangan</title>
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
        {dataTable ? (
          ReactHtmlParser(dataTable.narasisoal)
        ) : (
          <div className="p-3 bg-white">
            <ShimmerTitle line={2} variant="secondary" />
            <ShimmerText />
          </div>
        )}
      </div>
      <div className="relative">
        {/* {load && <LoadingWait />} */}
        <div>
          <Grid container spacing={2} direction="row" alignItems="stretch">
            {dataTable ? (
              <Grid item xs={12} md={12} lg={12}>
                <div className="bg-white py-3">
                  <div className="mt-1 mb-3 opacity-50 italic font-semibold my-1">
                    Data (soal):
                  </div>
                  <div className="mb-8">{dataTable.narasiadt1}</div>
                  <TableMhs
                    title={dataTable.headadt1}
                    data={dataTable.databarang}
                    setdata={(item) => setDataTable(item)}
                    dataheader1={dataTable.headadt2}
                    dataheader2={dataTable.headadt3}
                  />

                  <div className="mt-5 mb-3 p-1 border border-dashed">
                    <div className=" opacity-50 italic font-semibold my-1">
                      Worksheet (Lembar Kerja):
                    </div>
                    <TableWsMhs
                      data={dataTable}
                      // jawaban={jawaban}
                      cekjawaban={checking}
                      setcekjawaban={(item) => setChecking(item)}
                      // setjawaban={(item) => setJawaban(item)}
                      kuantitas={kuantitas}
                      setkuantitas={(item) => setKuantitas(item)}
                      hpunit={hpUnit}
                      sethpunit={(item) => setHpUnit(item)}
                      jumlah={jumlah}
                      setjumlah={(item) => setJumlah(item)}
                      isAnswer={isAnswer}
                    />
                  </div>
                  {/* CHECK */}
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
                        disabled={isAnswer}
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
                        setUpdate(update + 1);
                        setIsAnswer(false);
                        setChecking(false);
                        setAlldone(false);
                        setKuantitas([]);
                        setHpUnit([]);
                        setJumlah([]);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </Grid>
            ) : (
              <ShimmerMhsgs2 />
            )}
          </Grid>
        </div>
      </div>
      <br />
    </div>
  );
}
