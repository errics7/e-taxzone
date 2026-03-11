//#region
import { Helmet } from "react-helmet";
import { useParams, useHistory } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DataRowNeracaSaldo from "../components/DataRowNeracaSaldo";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import toast from "react-hot-toast";
import ReactHtmlParser from "react-html-parser";
import { useEffect, useState } from "react";
import {
  ShimmerSectionHeader,
  ShimmerTable,
  ShimmerText,
} from "react-shimmer-effects";
import axios from "axios";
import API from "../../../../utils/host.config";
import LoadingWait from "../../../dashboard/component/LoadingWait";
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

export default function Gs1PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  const [load, setLoad] = useState(false);

  const { id } = useParams();
  const [dataDef, setDatadef] = useState([]);
  const [data, setData] = useState([]);
  const [config, setConfig] = useState(null);
  //
  const [alldone, setAlldone] = useState(false);
  const [autoChecker, setAutoChecker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/manufakturgs1/data/${id}/soal`, {
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
          setDatadef(res.data.selected);
          setConfig(res.data.config);
          //
        })
        .catch((error) => {
          setLoad(false);
          console.log(error);
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

  //#region
  const resetButton = () => {
    setAutoChecker(false);
    setAlldone(false);
    setData([]);
    setTimeout(() => {
      setData(dataDef);
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
    if (data) {
      data.forEach((item) => {
        if (item.benar) {
          b += 1;
        } else {
          s += 1;
        }
      });
    }
    return [b, s];
  };
  const totalDebet = () => {
    var i = 0;
    if (data) {
      data.forEach((item) => {
        if (item.info === "debit") {
          i += item.nominal;
        }
      });
    }
    return toRp(i);
  };
  const totalKredit = () => {
    var i = 0;
    if (data) {
      data.forEach((item) => {
        if (item.info === "kredit") {
          i += item.nominal;
        }
      });
    }
    return toRp(i);
  };
  const checking = () => {
    setAutoChecker(true);
    const result = [];
    data.forEach((el, index) => {
      if (el.info === el.jenis) {
        data[index].benar = true;
        result.push(true);
      } else {
        data[index].benar = false;
        result.push(false);
      }
    });
    setData(data);
    //Finally
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
  //#endregion

  return (
    <div className="w-full min-h-20v relative">
      <Helmet>
        <title>Game Simulasi 1</title>
      </Helmet>
      {load && <LoadingWait />}
      <Grid container spacing={1}>
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
        <Grid item xs={12} md={12} lg={12}>
          <div className="w-full mb-3 mt-5 p-2 border bg-slate-50">
            {config ? (
              ReactHtmlParser(config.narasisoal)
            ) : (
              <div className="p-3 bg-white">
                <ShimmerText />
              </div>
            )}
          </div>
          <div className="p-5 border border-dashed bg-white">
            <div>
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
            </div>

            <div className="overflow-x-auto border mt-5">
              <table className="border-collapse min-w-full table-fixed">
                <thead className="font-semibold">
                  <tr className="text-slate-600 font-semibold">
                    <th className="min-w-10v max-w-10v border py-3">Kode</th>
                    <th className="min-w-20v max-w-20v border py-3">
                      Nama Akun
                    </th>
                    <th className="min-w-15v max-w-15v border py-3">Jumlah</th>
                    <th className="min-w-15v max-w-15v border py-3">
                      Debet (Rp)
                    </th>
                    <th className="min-w-15v max-w-15v border py-3">
                      Kredit (Rp)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => (
                    <DataRowNeracaSaldo
                      key={i}
                      indexd={i}
                      itemss={item}
                      checking={autoChecker}
                      setData={(da) => {
                        setData(
                          data.map((el, index) =>
                            i === index
                              ? {
                                  ...el,
                                  info: da,
                                }
                              : el
                          )
                        );
                      }}
                    />
                  ))}
                </tbody>
                {!config && (
                  <tbody>
                    <tr>
                      <td colSpan="5">
                        <div>
                          <ShimmerTable row={2} col={5} />;
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}
                <tbody className="font-semibold">
                  <tr className="text-slate-600 font-semibold">
                    <th colSpan="3" className="min-w-10v border py-3">
                      Jumlah
                    </th>
                    <th className="min-w-10v border py-3">{totalDebet()}</th>
                    <th className="min-w-10v border py-3">{totalKredit()}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Grid>
      </Grid>
      <div className="flex w-full p-5">
        {autoChecker && (
          <div className="border p-3 w-60">
            <span className="block text-center border-b mb-2 uppercase">
              Summary
            </span>
            <span>
              Benar : {totalSummary()[0]}
              <br />
              Salah : {totalSummary()[1]}
            </span>
          </div>
        )}
      </div>
      {config && (
        <div className="flex flex-row-reverse">
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
              onClick={() => {
                checking();
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
      )}
    </div>
  );
}
