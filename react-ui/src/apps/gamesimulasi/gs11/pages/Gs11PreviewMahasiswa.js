//#region
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import API from "../../../../utils/host.config";
import ReactHtmlParser from "react-html-parser";
import { v4 as uuidv4 } from "uuid";
import {
  ShimmerTitle,
  ShimmerText,
  ShimmerTable,
  ShimmerSectionHeader,
} from "react-shimmer-effects";
import toast from "react-hot-toast";
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoadingWait from "../../../dashboard/component/LoadingWait";
import TabelWorkMhs11 from "../components/TabelWorkMhs11";
import BukuPembantuBiayaMhs from "../components/BukuPembantuBiayaMhs";
import { find, sumBy } from "lodash";

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

export default function Gs11PreviewMahasiswa(props) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const [load, setLoad] = useState(false);
  const [ori, setOri] = useState(null);
  const [jawab, setJawab] = useState(null);
  const [jawabTot, setJawabTot] = useState(null);

  //autocheck
  const [checking, setChecking] = useState(false);
  const [alldone, setAlldone] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/manufakturgs11/data/${id}/soal`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          setLoad(false); 
          setOri(res.data);
          //Prepare Jawab
          prepareData(res.data);
        })
        .catch((error) => {
          // if (error.response && !error.response.data.auth)
          //   dispatch({ type: "LOGOUT" });
        });
    };

    fetchData();
  }, [id]);

  //#region
  const prepareData = (inp) => {
    const dat = inp.data.map((element) => {
      if (element.type === 1) {
        return { ...element, jwb_value: 0, err_value: false };
      } else {
        return element;
      }
    });

    const dat2 = inp.kode.map((item, index) => {
      const val = sumBy(
        inp.data.filter((x) => x.idc === item.uuid),
        (r) => r.value
      );
      const stat = find(inp.data, {
        type: 1,
        idc: item.uuid,
      });

      if (stat) {
        return {
          uuid: uuidv4(),
          idc: item.uuid,
          type: 1,
          err_value: false,
          jwb_value: 0,
          key_value: val,
        };
      } else {
        return { uuid: uuidv4(), idc: item.uuid, type: 0, key_value: val };
      }
    });

    const total1 = sumBy(inp.data, (r) => r.value);
    dat2.push({
      uuid: "totalall",
      type: 1,
      err_value: false,
      jwb_value: 0,
      key_value: total1,
    });

    setJawab(dat);
    setJawabTot(dat2);
  };

  const check = () => {
    setChecking(true);
    const result = [];
    // Jawab1
    jawab.forEach((el, i) => {
      if (el.type === 1) {
        // compare
        if (Number(el.value) === Number(el.jwb_value)) {
          result.push(true);
        } else {
          result.push(false);
          jawab[i].err_value = true;
        }
      }
    });
    // Jawab2
    jawabTot.forEach((el, i) => {
      if (el.type === 1) {
        // compare
        if (Number(el.key_value) === Number(el.jwb_value)) {
          result.push(true);
        } else {
          result.push(false);
          jawabTot[i].err_value = true;
        }
      }
    });
    //
    setJawab(jawab);
    setJawabTot(jawabTot);
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
          duration: 6000,
        },
      });
    }
  };
  //#endregion

  return (
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
      <br />
      <div className="relative">
        {load && <LoadingWait />}
        <Grid container spacing={2} direction="row" alignItems="stretch">
          <Grid item xs={12} md={12} lg={12}>
            <div className="opacity-50 italic font-semibold">Worksheet:</div>
            <div className="border bg-white">
              {ori && jawab && jawabTot ? (
                <TabelWorkMhs11
                  ori={ori}
                  jawab={jawab}
                  jawabTot={jawabTot}
                  checking={checking}
                  setJawab={(x) => setJawab(x)}
                  setJawabTot={(x) => setJawabTot(x)}
                />
              ) : (
                <div className="pt-5">
                  <ShimmerSectionHeader center />
                  <div className="-mt-10">
                    <ShimmerTable row={5} col={10} />
                  </div>
                </div>
              )}

              {/* CHECK */}
              <div
                className={`flex flex-row-reverse py-1 w-full  bg-gradient-to-l from-slate-100`}
              >
                {checking && alldone ? (
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
                    prepareData(ori);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <div className="opacity-50 italic font-semibold mb-1">
              Data (soal):
            </div>
            <div className="border p-1 max-w-7xl">
              {ori ? (
                <BukuPembantuBiayaMhs ori={ori} />
              ) : (
                <>
                  <ShimmerSectionHeader center />
                  <ShimmerTable row={1} col={3} />;
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
      <br />
    </div>
  );
}
