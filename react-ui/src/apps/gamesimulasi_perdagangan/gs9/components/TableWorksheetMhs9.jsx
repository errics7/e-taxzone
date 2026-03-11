import makeStyles from "@mui/styles/makeStyles";
import { TextField } from "@mui/material";
import NumberFormat from "react-number-format"; 
import { findIndex } from "lodash";
import EditIcon from "@mui/icons-material/Edit";
import { find } from "lodash";
import { forwardRef } from "react";

const numberFormat = (number) => {
  return (
    <NumberFormat
      value={number}
      displayType={"text"}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
      renderText={(value, props) => <div {...props}>{value}</div>}
    />
  );
};
 
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
            value: Number(values.value),
          },
        });
      }}
      prefix="Rp "
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

const useStyles = makeStyles((theme) => ({}));

export default function TableWorksheetMhs9(props) {
  const classes = useStyles();
  const { dataConfig, checking1, jawab1, setJawab } = props;

  const handleInputChange = (e, sec, uid) => {
    const { name, value } = e.target;
    const index = findIndex(jawab1[sec].values, { uid: uid });
    const listjwb = [...jawab1];
    listjwb[sec].values[index][name] = value;
    setJawab(listjwb);
  };

  // const data = groupBy(dataConfig.datajurnal, "gen");
  // const objJurnal = map(data, (obj, key) => {
  //   return { head: key, values: obj };
  // });

  return (
    <>
      {jawab1 &&
        jawab1.map((item, i) => {
          const obItem = find(dataConfig.datajurnal, { gen: item.head });
          // const countDebit = [];

          return (
            <div key={i} className="relative mt-10">
              <div className="mt-5 mb-3 relative">
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-start-1 col-end-4 flex text-base">
                    <div className="flex items-center ml-3 mt-3 space-y-2 text-xl">
                      <div className="text-xl font-medium uppercase">
                        {dataConfig.cvname}
                      </div>
                    </div>
                  </div>
                  <div className="col-end-10">
                    <div className="flex flex-col mt-3 space-y-2 pr-3">
                      <h1 className="text-xl font-medium uppercase">
                        Buku Pembantu Hutang
                      </h1>
                      <div className="flex">
                        <label>Nama Pemasok : </label>
                        <p className="pl-2">{obItem.namapemasok}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <>
                <div className="mt-0 overflow-x-auto border-collapse">
                  <table className="border-collapse min-w-full table-fixed">
                    <thead>
                      <tr>
                        <th
                          rowSpan="2"
                          className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                          Tanggal
                        </th>
                        <th
                          rowSpan="2"
                          className="min-w-20v max-w-20v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                          Keterangan
                        </th>
                        <th
                          rowSpan="2"
                          className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                          Ref
                        </th>
                        <th
                          rowSpan="2"
                          className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                          Debet
                        </th>
                        <th
                          rowSpan="2"
                          className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                          Kredit
                        </th>
                        <th
                          colSpan="2"
                          className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                        >
                          Saldo
                        </th>
                      </tr>
                      <tr>
                        <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                          Debet
                        </th>
                        <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                          Kredit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.values.map((element, index) => {
                        // if (index === 0) {
                        //   //start
                        //   countDebit.push(element.jumlah);
                        // } else {
                        //   //
                        //   const x =
                        //     element.posisi === "debit"
                        //       ? element[element.key]
                        //       : element[element.key] * -1;
                        //   countDebit.push(Number(countDebit[index - 1] + x));
                        // }

                        return (
                          <tr
                            key={index}
                            className="bg-white border-t border-slate-300"
                          >
                            <td className="px-0.5 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                              {element.type === "intro" ? (
                                <div className="relative"> {element.tgl}</div>
                              ) : (
                                <div
                                  className={`relative ${
                                    checking1 &&
                                    element.err_tgl &&
                                    "bg-red-300 animate-pulse"
                                  }`}
                                >
                                  <TextField
                                    fullWidth
                                    className={classes.inpputTanggal}
                                    placeholder="Jawab Tanggal"
                                    value={element.jwb_tgl}
                                    name="jwb_tgl"
                                    onChange={(e) =>
                                      handleInputChange(e, i, element.uid)
                                    }
                                    InputProps={{
                                      readOnly: checking1,
                                    }}
                                    inputProps={{
                                      style: {
                                        fontSize: 14,
                                        textAlign: "center",
                                      },
                                    }}
                                  />
                                  {!checking1 && (
                                    <EditIcon
                                      fontSize="inherit"
                                      className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                    />
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-1 py-2  text-slate-800 text-center border border-b">
                              {element.type === "intro" ? (
                                <>{element.keterangan}</>
                              ) : (
                                <div
                                  className={`relative ${
                                    checking1 &&
                                    element.err_keterangan &&
                                    "bg-red-300 animate-pulse"
                                  }`}
                                >
                                  <TextField
                                    fullWidth
                                    className={classes.inpputTanggal}
                                    placeholder="Jawab Keterangan"
                                    value={element.jwb_keterangan}
                                    name="jwb_keterangan"
                                    onChange={(e) =>
                                      handleInputChange(e, i, element.uid)
                                    }
                                    InputProps={{
                                      readOnly: checking1,
                                    }}
                                    inputProps={{
                                      style: {
                                        fontSize: 14,
                                        textAlign: "center",
                                      },
                                    }}
                                  />
                                  {!checking1 && (
                                    <EditIcon
                                      fontSize="inherit"
                                      className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                    />
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                              {element.type === "intro" ? (
                                <>&nbsp;</>
                              ) : (
                                <div
                                  className={`relative ${
                                    checking1 &&
                                    element.err_ref &&
                                    "bg-red-300 animate-pulse"
                                  }`}
                                >
                                  <TextField
                                    fullWidth
                                    className={classes.inpputTanggal}
                                    placeholder="Jawab Ref"
                                    value={element.jwb_ref}
                                    name="jwb_ref"
                                    onChange={(e) =>
                                      handleInputChange(e, i, element.uid)
                                    }
                                    InputProps={{
                                      readOnly: checking1,
                                    }}
                                    inputProps={{
                                      style: {
                                        fontSize: 14,
                                        textAlign: "center",
                                      },
                                    }}
                                  />
                                  {!checking1 && (
                                    <EditIcon
                                      fontSize="inherit"
                                      className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                    />
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                              <div className="relative">
                                {element.type !== "intro" &&
                                element.posisi === "debit" ? (
                                  <div
                                    className={`relative ${
                                      checking1 &&
                                      element.err_jum1 &&
                                      "bg-red-300 animate-pulse"
                                    }`}
                                  >
                                    <TextField
                                      fullWidth
                                      className={classes.inpputTanggal}
                                      placeholder="Jawab Debet"
                                      value={element.jwb_jum1}
                                      name="jwb_jum1"
                                      onChange={(e) =>
                                        handleInputChange(e, i, element.uid)
                                      }
                                      InputProps={{
                                        readOnly: checking1,
                                        inputComponent: NumberFormatCustom,
                                      }}
                                      inputProps={{
                                        style: {
                                          fontSize: 14,
                                          textAlign: "center",
                                        },
                                      }}
                                    />
                                    {!checking1 && (
                                      <EditIcon
                                        fontSize="inherit"
                                        className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                      />
                                    )}
                                  </div>
                                ) : (
                                  <>&nbsp;</>
                                )}
                              </div>
                            </td>
                            <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                              {element.type !== "intro" &&
                              element.posisi === "kredit" ? (
                                <div
                                  className={`relative ${
                                    checking1 &&
                                    element.err_jum1 &&
                                    "bg-red-300 animate-pulse"
                                  }`}
                                >
                                  <TextField
                                    fullWidth
                                    className={classes.inpputTanggal}
                                    placeholder="Jawab Kredit"
                                    value={element.jwb_jum1}
                                    name="jwb_jum1"
                                    onChange={(e) =>
                                      handleInputChange(e, i, element.uid)
                                    }
                                    InputProps={{
                                      readOnly: checking1,
                                      inputComponent: NumberFormatCustom,
                                    }}
                                    inputProps={{
                                      style: {
                                        fontSize: 14,
                                        textAlign: "center",
                                      },
                                    }}
                                  />
                                  {!checking1 && (
                                    <EditIcon
                                      fontSize="inherit"
                                      className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                    />
                                  )}
                                </div>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                              <div className="relative">&nbsp;</div>
                            </td>
                            <td className="px-1 py-2 min-w-15v max-w-15v  text-slate-800 text-center border border-b">
                              {element.type === "intro" ? (
                                <div className="relative">
                                  {numberFormat(element.jumlah)}
                                </div>
                              ) : (
                                <div
                                  className={`relative ${
                                    checking1 &&
                                    element.err_jum2 &&
                                    "bg-red-300 animate-pulse"
                                  }`}
                                >
                                  <TextField
                                    fullWidth
                                    className={classes.inpputTanggal}
                                    placeholder="Jawab Jumlah Kredit"
                                    value={element.jwb_jum2}
                                    name="jwb_jum2"
                                    onChange={(e) =>
                                      handleInputChange(e, i, element.uid)
                                    }
                                    InputProps={{
                                      readOnly: checking1,
                                      inputComponent: NumberFormatCustom,
                                    }}
                                    inputProps={{
                                      style: {
                                        fontSize: 14,
                                        textAlign: "center",
                                      },
                                    }}
                                  />
                                  {!checking1 && (
                                    <EditIcon
                                      fontSize="inherit"
                                      className="text-blue-700 opacity-30 absolute -inset-y-1.5 -right-0.5"
                                    />
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="py-2 font-bold text-slate-600 border border-slate-300">
                          &nbsp;
                        </td>
                        <td className="py-2 font-bold text-slate-600 border border-slate-300">
                          &nbsp;
                        </td>
                        <td className="py-2 font-bold text-slate-600 border border-slate-300">
                          &nbsp;
                        </td>
                        <td className="py-2 font-bold text-slate-600 border border-slate-300">
                          &nbsp;
                        </td>
                        <td className="py-2 font-bold text-slate-600 border border-slate-300">
                          &nbsp;
                        </td>
                        <td className="py-2 font-bold text-slate-600 border border-slate-300">
                          &nbsp;
                        </td>
                        <td className="py-2 font-bold text-slate-600 border border-slate-300">
                          &nbsp;
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            </div>
          );
        })}
    </>
  );
}
