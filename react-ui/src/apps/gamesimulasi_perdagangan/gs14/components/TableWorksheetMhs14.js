import { TextField, Tooltip } from "@mui/material";
import NumberFormat from "react-number-format";
import { find, findIndex } from "lodash";
import { forwardRef, Fragment } from "react"; 
import EditIcon from "@mui/icons-material/Edit";

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
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

export default function TableWorksheetMhs14(props) {
  const {
    dataConfig,
    checking,
    jwbdata,
    jwbTotal1,
    jwbTotal2,
    jwbLaba,
    setJwbdata,
    setJwbTotal1,
    setJwbTotal2,
    setJwbLaba,
  } = props;

  // #region
  const changeData = (e, uid) => {
    const { name, value } = e.target;
    const idx = findIndex(jwbdata, {
      uid: uid,
    });
    const list = [...jwbdata];
    list.splice(idx, 1, {
      ...jwbdata[idx],
      [name]: value,
    });

    setJwbdata(list);
  };
  const changeDataTot1 = (e, i, bag) => {
    const { name, value } = e.target;
    const list = [...jwbTotal1];
    const baglst = [...jwbTotal1[i]];
    baglst.splice(bag, 1, {
      ...baglst[bag],
      [name]: value,
    });
    list.splice(i, 1, baglst);
    setJwbTotal1(list);
  };
  const changeDataLaba = (e, i, bag) => {
    const { name, value } = e.target;
    const list = [...jwbLaba];
    const baglst = [...jwbLaba[i]];
    baglst.splice(bag, 1, {
      ...baglst[bag],
      [name]: value,
    });
    list.splice(i, 1, baglst);
    setJwbLaba(list);
  };
  const changeDataTot2 = (e, i, bag) => {
    const { name, value } = e.target;
    const list = [...jwbTotal2];
    const baglst = [...jwbTotal2[i]];
    baglst.splice(bag, 1, {
      ...baglst[bag],
      [name]: value,
    });
    list.splice(i, 1, baglst);
    setJwbTotal2(list);
  };
  // #endregion
  return (
    <>
      <div className="relative">
        <div className="pt-3 flex flex-col items-center font-bold">
          <div className="text-xl relative font-semibold uppercase">
            {dataConfig ? dataConfig.cvname : ""}
          </div>
        </div>
        <div className="flex flex-col items-center mb-1">
          <div className="text-lg font-semibold relative uppercase">
            Kertas kerja
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl relative font-semibold tracking-wider">
            {dataConfig ? dataConfig.tblworkname : ""}
          </div>
        </div>
        <span className="absolute -bottom-1 right-0">(dalam ribuan)</span>
      </div>
      <div className="pt-3 overflow-x-auto border-collapse pb-3">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th
                rowSpan="2"
                className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                No. Akun
              </th>
              <th
                rowSpan="2"
                className="min-w-25v max-w-25v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Nama Akun
              </th>
              {dataConfig.dataheader.map((el, i) => (
                <th
                  key={i}
                  colSpan="2"
                  className="py-1.5 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  {el.alias}
                </th>
              ))}
            </tr>
            <tr>
              {dataConfig.dataheader.map((el, i) => (
                <Fragment key={i}>
                  <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    D
                  </th>
                  <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    K
                  </th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="min-w-10v max-w-10v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              <td className="min-w-25v max-w-25v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              {dataConfig.dataheader.map((dat, ii) => (
                <Fragment key={ii}>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                </Fragment>
              ))}
            </tr>
          </tbody>
          {/* DATA UTAMA */}
          <tbody>
            {dataConfig.dataakun.map((el, i) => {
              return (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="group min-w-10v max-w-10v text-center text-slate-800 border border-b">
                    <div className="relative">{el.noakun}</div>
                  </td>
                  <td className="group min-w-30v max-w-30v text-slate-800 border border-b">
                    <div className="relative pl-3">{el.alias}</div>
                  </td>
                  {dataConfig.dataheader.map((dat, ii) => {
                    const fd = find(jwbdata, {
                      idc: dat.uid,
                      idr: el.uid,
                      type: "debet",
                    });
                    const fk = find(jwbdata, {
                      idc: dat.uid,
                      idr: el.uid,
                      type: "kredit",
                    });

                    return (
                      <Fragment key={ii}>
                        <td className="min-w-15v max-w-15v px-1 py-0 text-center text-slate-800 border border-b relative group">
                          {fd &&
                            fd.type === "debet" &&
                            (fd.key ? (
                              <div
                                className={`relative ${
                                  checking &&
                                  fd.err_value &&
                                  " bg-red-300 animate-pulse"
                                }`}
                              >
                                <Tooltip
                                  title={
                                    fd.err_value
                                      ? " Jawaban yang anda masukkan salah"
                                      : ""
                                  }
                                >
                                  <TextField
                                    placeholder="Jawab disini"
                                    name="jwb_value"
                                    value={
                                      fd.jwb_value === 0 ? "" : fd.jwb_value
                                    }
                                    onChange={(e) => changeData(e, fd.uid)}
                                    fullWidth
                                    InputProps={{
                                      readOnly: checking,
                                      inputComponent: NumberFormatCustom,
                                    }}
                                    inputProps={{
                                      prefix: "Rp ",
                                      style: {
                                        textAlign: "center",
                                        fontSize: 15,
                                        fontWeight: 400,
                                      },
                                    }}
                                  />
                                </Tooltip>
                                {!checking && (
                                  <EditIcon
                                    fontSize="inherit"
                                    className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                                  />
                                )}
                              </div>
                            ) : (
                              <>{numberFormat(fd.value)}</>
                            ))}
                        </td>
                        <td className="h-9  min-w-15v max-w-15v px-1 py-0 text-center text-slate-800 border border-b relative group">
                          {fk &&
                            fk.type === "kredit" &&
                            (fk.key ? (
                              <div
                                className={`relative ${
                                  checking &&
                                  fk.err_value &&
                                  " bg-red-300 animate-pulse"
                                }`}
                              >
                                <Tooltip
                                  title={
                                    fk.err_value
                                      ? " Jawaban yang anda masukkan salah"
                                      : ""
                                  }
                                >
                                  <TextField
                                    placeholder="Jawab disini"
                                    name="jwb_value"
                                    value={
                                      fk.jwb_value === 0 ? "" : fk.jwb_value
                                    }
                                    onChange={(e) => changeData(e, fk.uid)}
                                    fullWidth
                                    InputProps={{
                                      readOnly: checking,
                                      inputComponent: NumberFormatCustom,
                                    }}
                                    inputProps={{
                                      prefix: "Rp ",
                                      style: {
                                        textAlign: "center",
                                        fontSize: 15,
                                        fontWeight: 400,
                                        marginBottom: -3,
                                      },
                                    }}
                                  />
                                </Tooltip>
                                {!checking && (
                                  <EditIcon
                                    fontSize="inherit"
                                    className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                                  />
                                )}
                              </div>
                            ) : (
                              <>{numberFormat(fk.value)}</>
                            ))}
                        </td>
                      </Fragment>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {/* End DATA UTAMA */}
          <tfoot>
            <tr>
              <td className="min-w-10v max-w-10v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              <td className="min-w-25v max-w-25v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              {dataConfig.dataheader.map((dat, ii) => (
                <Fragment key={ii}>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                </Fragment>
              ))}
            </tr>
            <tr className="hover:bg-slate-100 bg-slate-50 font-semibold">
              <td
                colSpan="2"
                className="p-0.5 uppercase text-center text-slate-800 border border-b"
              >
                Total
              </td>
              {jwbTotal1.map((dat, ii) => (
                <Fragment key={ii}>
                  <td className="min-w-15v max-w-15v p-1 text-center text-slate-800 border border-b">
                    {dat[0].key ? (
                      <div
                        className={`relative ${
                          checking &&
                          dat[0].err_value &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            dat[0].err_value
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Jawab disini"
                            name="jwb_value"
                            value={
                              dat[0].jwb_value === 0 ? "" : dat[0].jwb_value
                            }
                            onChange={(e) => changeDataTot1(e, ii, 0)}
                            fullWidth
                            InputProps={{
                              readOnly: checking,
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              prefix: "Rp ",
                              style: {
                                textAlign: "center",
                                fontSize: 15,
                                fontWeight: 400,
                                marginBottom: -3,
                              },
                            }}
                          />
                        </Tooltip>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                          />
                        )}
                      </div>
                    ) : (
                      <div className={`p-1.5`}>
                        {numberFormat(dat[0].value)}
                      </div>
                    )}
                  </td>
                  <td className="min-w-15v max-w-15v p-1 text-center text-slate-800 border border-b">
                    {dat[1].key ? (
                      <div
                        className={`relative ${
                          checking &&
                          dat[1].err_value &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            dat[1].err_value
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Jawab disini"
                            name="jwb_value"
                            value={
                              dat[1].jwb_value === 0 ? "" : dat[1].jwb_value
                            }
                            onChange={(e) => changeDataTot1(e, ii, 1)}
                            fullWidth
                            InputProps={{
                              readOnly: checking,
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              prefix: "Rp ",
                              style: {
                                textAlign: "center",
                                fontSize: 15,
                                fontWeight: 400,
                                marginBottom: -3,
                              },
                            }}
                          />
                        </Tooltip>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                          />
                        )}
                      </div>
                    ) : (
                      <div className={`p-1.5`}>
                        {numberFormat(dat[1].value)}
                      </div>
                    )}
                  </td>
                </Fragment>
              ))}
            </tr>
            <tr className="hover:bg-slate-100 bg-slate-50 font-semibold">
              <td
                colSpan="2"
                className="p-0.5 uppercase text-center text-slate-800 border border-b"
              >
                LABA
              </td>
              {jwbLaba.map((dat, ii) => (
                <Fragment key={ii}>
                  <td className="min-w-15v max-w-15v p-1 text-center text-slate-800 border border-b">
                    {dat[0].key ? (
                      <div
                        className={`relative ${
                          checking &&
                          dat[0].err_value &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            dat[0].err_value
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Jawab disini"
                            name="jwb_value"
                            value={
                              dat[0].jwb_value === 0 ? "" : dat[0].jwb_value
                            }
                            onChange={(e) => changeDataLaba(e, ii, 0)}
                            fullWidth
                            InputProps={{
                              readOnly: checking,
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              prefix: "Rp ",
                              style: {
                                textAlign: "center",
                                fontSize: 15,
                                fontWeight: 400,
                                marginBottom: -3,
                              },
                            }}
                          />
                        </Tooltip>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                          />
                        )}
                      </div>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                  <td className="min-w-15v max-w-15v p-1 text-center text-slate-800 border border-b">
                    {dat[1].key ? (
                      <div
                        className={`relative ${
                          checking &&
                          dat[1].err_value &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            dat[1].err_value
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Jawab disini"
                            name="jwb_value"
                            value={
                              dat[1].jwb_value === 0 ? "" : dat[1].jwb_value
                            }
                            onChange={(e) => changeDataLaba(e, ii, 1)}
                            fullWidth
                            InputProps={{
                              readOnly: checking,
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              prefix: "Rp ",
                              style: {
                                textAlign: "center",
                                fontSize: 15,
                                fontWeight: 400,
                                marginBottom: -3,
                              },
                            }}
                          />
                        </Tooltip>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                          />
                        )}
                      </div>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                </Fragment>
              ))}
            </tr>
            {/* Total 2 */}
            <tr className="hover:bg-slate-100 bg-slate-50 font-semibold">
              <td
                colSpan="2"
                className="p-0.5 uppercase text-center text-slate-800 border border-b"
              >
                Total
              </td>
              {jwbTotal2.map((dat, ii) => (
                <Fragment key={ii}>
                  <td className="min-w-15v max-w-15v p-1 text-center text-slate-800 border border-b">
                    {dat[0].key ? (
                      <div
                        className={`relative ${
                          checking &&
                          dat[0].err_value &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            dat[0].err_value
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Jawab disini"
                            name="jwb_value"
                            value={
                              dat[0].jwb_value === 0 ? "" : dat[0].jwb_value
                            }
                            onChange={(e) => changeDataTot2(e, ii, 0)}
                            fullWidth
                            InputProps={{
                              readOnly: checking,
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              prefix: "Rp ",
                              style: {
                                textAlign: "center",
                                fontSize: 15,
                                fontWeight: 400,
                                marginBottom: -3,
                              },
                            }}
                          />
                        </Tooltip>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                          />
                        )}
                      </div>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                  <td className="min-w-15v max-w-15v p-1 text-center text-slate-800 border border-b">
                    {dat[1].key ? (
                      <div
                        className={`relative ${
                          checking &&
                          dat[1].err_value &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            dat[1].err_value
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Jawab disini"
                            name="jwb_value"
                            value={
                              dat[1].jwb_value === 0 ? "" : dat[1].jwb_value
                            }
                            onChange={(e) => changeDataTot2(e, ii, 1)}
                            fullWidth
                            InputProps={{
                              readOnly: checking,
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              prefix: "Rp ",
                              style: {
                                textAlign: "center",
                                fontSize: 15,
                                fontWeight: 400,
                                marginBottom: -3,
                              },
                            }}
                          />
                        </Tooltip>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                          />
                        )}
                      </div>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                </Fragment>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
