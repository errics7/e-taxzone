//#region
import TextField from "@mui/material/TextField";
import NumberFormat from "react-number-format";
import { forwardRef, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import { ShimmerTable } from "react-shimmer-effects";

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
      style={{
        textAlign: "center",
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
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#277BA5",
      boxShadow: "none",
    },
  },
  inputnsalah: {
    backgroundColor: "#FCA5A5",
  },
  inputnbenar: {
    backgroundColor: "#FFFFFF",
  },
}));
//#endregion

export default function BukuPembantuBiaya(props) {
  const data = props.data; //jawaban
  const dataControl = props.dataControl;
  const classes = useStyles();
  const [validate, setValidate] = useState(false);
  const [alldone, setAlldone] = useState(false);

  const check = () => {
    setValidate(true);
    // console.log(data);
    // console.log(dataControl);
    //Preparation set USAGE to=> FALSE
    dataControl.forEach((element) => {
      element["usage"] = false;
    });
    //
    // START Filter CHECKING
    data.forEach((element) => {
      // console.log("Basic", element);
      var valid = false;
      //STEP #1 kodepusat Cari
      const mainIndx = dataControl.findIndex(
        (el) =>
          el.nopusatbiaya === element.kodepusat.value && el.posisi === "debit"
      );
      // console.log(mainIndx);
      //check ketemu & belum terpakai
      if (mainIndx !== -1 && !dataControl[mainIndx].usage) {
        //set terpakai
        dataControl[mainIndx].usage = true;
        element.kodepusat.status = true; //status ketemu / benar
        valid = true;
      } else {
        // console.log("Not Found");
        element.kodepusat.status = false; //status Tidak ada
        element.kodepembantu.status = false;
        element.keterangan.status = false;
        element.debit.status = false;
        element.saldodebit.status = false;
      }
      //STEP #2
      if (
        valid &&
        dataControl[mainIndx].nopembantubiaya === element.kodepembantu.value
      ) {
        element.kodepembantu.status = true;
      } else {
        element.kodepembantu.status = false;
      }
      //STEP #3 Nop
      if (Number(element.nop.value) === 2) {
        element.nop.status = true;
      } else {
        element.nop.status = false;
      }
      //STEP #4 Keterangan
      if (
        valid &&
        dataControl[mainIndx].keperluan.toLowerCase() ===
          element.keterangan.value.toLowerCase()
      ) {
        element.keterangan.status = true;
      } else {
        element.keterangan.status = false;
      }
      //STEP #5 Nilai Debit
      if (
        valid &&
        Number(dataControl[mainIndx].nilai) === Number(element.debit.value)
      ) {
        element.debit.status = true;
      } else {
        element.debit.status = false;
      }
      //STEP #6 Saldo Debit
      if (Number(element.debit.value) === Number(element.saldodebit.value)) {
        element.saldodebit.status = true;
      } else {
        element.saldodebit.status = false;
      }
      //
    });
    //Finish up
    const hasil = data.every(
      (x) =>
        x.kodepusat.status &&
        x.kodepembantu.status &&
        x.nop.status &&
        x.keterangan.status &&
        x.debit.status &&
        x.saldodebit.status
    );
    if (hasil) {
      setAlldone(true);
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

  return (
    <div className="relative border-t bg-white">
      <div className="absolute opacity-50 italic font-semibold p-1 pr-2">
        Worksheet :
      </div>
      <div className="text-xl uppercase text-center mt-8 mb-3">
        BUKU PEMBANTU BIAYA
      </div>
      {data &&
        data.map((item, index) => (
          <div key={index}>
            <div className="text-base flex flex-row justify-between mt-10">
              <div className="flex items-start w-6/12">
                <div className="flex justify-between">
                  <span>Kode Pusat Biaya</span>
                  <span className="ml-2">:</span>
                </div>
                <div className="uppercase px-2">
                  <TextField
                    placeholder="isi disini"
                    value={item.kodepusat.value}
                    className={`text-center py-1 ${
                      validate &&
                      !item.kodepusat.status &&
                      "animate-pulse bg-red-300 rounded"
                    }`}
                    onChange={(event) => {
                      //edited row & REGEX number
                      props.setdata(
                        data.map((el, i) =>
                          index === i
                            ? {
                                ...el,
                                kodepusat: {
                                  ...el.kodepusat,
                                  value: event.target.value.replace(/\D/, ""),
                                },
                              }
                            : el
                        )
                      );
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row-reverse items-start w-6/12">
                <div className="uppercase px-2">
                  <TextField
                    placeholder="isi disini"
                    value={item.kodepembantu.value}
                    className={`text-center py-1 ${
                      validate &&
                      !item.kodepembantu.status &&
                      "animate-pulse bg-red-300 rounded"
                    }`}
                    onChange={(event) => {
                      //edited row & REGEX number
                      props.setdata(
                        data.map((el, i) =>
                          index === i
                            ? {
                                ...el,
                                kodepembantu: {
                                  ...el.kodepembantu,
                                  value: event.target.value.replace(/\D/, ""),
                                },
                              }
                            : el
                        )
                      );
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  <span>Kode Pembantu Biaya</span>
                  <span className="ml-2">:</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="border-collapse w-full mt-5">
                <thead>
                  <tr>
                    <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Tanggal
                    </th>
                    <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Keterangan
                    </th>
                    <th className="w-1/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Ref
                    </th>
                    <th className="w-1/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Debit
                    </th>
                    <th className="w-1/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Kredit
                    </th>
                    <th className="w-4/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      <table className="w-full">
                        <tbody>
                          <tr className="border-b">
                            <td colSpan="2">Saldo</td>
                          </tr>
                          <tr className="border-t">
                            <td className="w-1/2 border-r">Debit</td>
                            <td className="w-1/2">Kredit</td>
                          </tr>
                        </tbody>
                      </table>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white lg:hover:bg-slate-100 ">
                    <td className="text-center p-3 text-slate-800 border border-b">
                      <table className="w-full h-full text-center">
                        <tbody>
                          <tr className="">
                            <td className="w-1/3 border-r">Nop</td>
                            <td className="w-1/3">1</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="p-1 px-3 text-slate-800 text-left border border-b">
                      Saldo awal
                    </td>
                    <td className="p-0 text-left border border-b"></td>
                    <td className="p-0 text-slate-800 text-left border border-b"></td>
                    <td className="p-3 text-slate-800 text-left border border-b"></td>
                    <td className="p-3 text-slate-800 text-left border border-b">
                      <table className="w-full h-full text-center">
                        <tbody>
                          <tr className="">
                            <td className="w-1/3 border-r">-</td>
                            <td className="w-1/3"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {/* isian */}
                  <tr className="bg-white lg:hover:bg-slate-100">
                    <td className="p-3 text-center text-slate-800 border border-b table-cell relative">
                      <table className="w-full h-full text-center">
                        <tbody>
                          <tr className="">
                            <td className="min-w-5v max-w-5v border-r"></td>
                            <td className="min-w-5v max-w-5v">
                              <div className="relative">
                                <input
                                  placeholder="isi disini"
                                  value={item.nop.value}
                                  onChange={(event) => {
                                    //edited row & REGEX number
                                    props.setdata(
                                      data.map((el, i) =>
                                        index === i
                                          ? {
                                              ...el,
                                              nop: {
                                                ...el.nop,
                                                value:
                                                  event.target.value.replace(
                                                    /\D/,
                                                    ""
                                                  ),
                                              },
                                            }
                                          : el
                                      )
                                    );
                                  }}
                                  className={`text-center bg-white py-1 w-full ${
                                    validate &&
                                    !item.nop.status &&
                                    "animate-pulse bg-red-300 rounded"
                                  }`}
                                />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="min-w-15v max-w-15v p-1 text-slate-800 text-left border border-b table-cell relative">
                      <input
                        placeholder="isi disini"
                        value={item.keterangan.value}
                        onChange={(event) => {
                          //edited row & REGEX number
                          props.setdata(
                            data.map((el, i) =>
                              index === i
                                ? {
                                    ...el,
                                    keterangan: {
                                      ...el.keterangan,
                                      value: event.target.value,
                                    },
                                  }
                                : el
                            )
                          );
                        }}
                        className={`bg-white text-left py-1 px-2 w-full ${
                          validate &&
                          !item.keterangan.status &&
                          "animate-pulse bg-red-300 rounded"
                        }`}
                      />
                    </td>
                    <td className="min-w-5v max-w-5v p-0 text-left border border-b table-cell"></td>
                    <td className="min-w-10v max-w-10v p-0 px-1 text-slate-800 text-left border border-b table-cell relative">
                      <TextField
                        placeholder="isi disini"
                        value={item.debit.value}
                        className={`inline-flex w-full text-left ${
                          validate &&
                          !item.debit.status &&
                          "animate-pulse bg-red-300 rounded"
                        }`}
                        // py-1 px-2
                        onChange={(event) => {
                          //edited row & REGEX number
                          props.setdata(
                            data.map((el, i) =>
                              index === i
                                ? {
                                    ...el,
                                    debit: {
                                      ...el.debit,
                                      value: event.target.value.replace(
                                        /\D/,
                                        ""
                                      ),
                                    },
                                  }
                                : el
                            )
                          );
                        }}
                        name="debit"
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          disableUnderline: true,
                          className:
                            validate && !item.debit.status
                              ? classes.inputnsalah
                              : classes.inputnbenar,
                        }}
                      />
                    </td>
                    <td className="min-w-10v max-w-10v p-3 text-slate-800 text-left border border-b table-cell relative"></td>
                    <td className="p-3 text-slate-800 text-left border border-b table-cell relative">
                      <table className="w-full h-full text-center">
                        <tbody>
                          <tr className="">
                            <td className="min-w-10v max-w-10v border-r">
                              <TextField
                                placeholder="isi disini"
                                value={item.saldodebit.value}
                                className={`text-left ${
                                  validate &&
                                  !item.saldodebit.status &&
                                  "animate-pulse bg-red-300 rounded"
                                }`}
                                onChange={(event) => {
                                  //edited row & REGEX number
                                  props.setdata(
                                    data.map((el, i) =>
                                      index === i
                                        ? {
                                            ...el,
                                            saldodebit: {
                                              ...el.saldodebit,
                                              value: event.target.value.replace(
                                                /\D/,
                                                ""
                                              ),
                                            },
                                          }
                                        : el
                                    )
                                  );
                                }}
                                name="saldodebit"
                                InputProps={{
                                  inputComponent: NumberFormatCustom,
                                  disableUnderline: true,
                                  className:
                                    validate && !item.debit.status
                                      ? classes.inputnsalah
                                      : classes.inputnbenar,
                                }}
                              />
                            </td>
                            <td className="min-w-10v max-w-10v"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      {!data && (
        <div className="mt-5">
          <ShimmerTable row={2} col={7} />
          <br />
          <ShimmerTable row={2} col={7} />
        </div>
      )}
      {/* className="inline-block w-full bg-gradient-to-r from-slate-200 font-semibold text-left p-3"> */}
      <div className="flex flex-row-reverse mt-8">
        <div className="flex flex-row-reverse py-3 bg-gradient-to-l from-slate-100 w-full 2xl:w-1/2">
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
              props.refresh();
              setValidate(false);
              setAlldone(false);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
