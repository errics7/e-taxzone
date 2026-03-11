import { TextField, Tooltip } from "@mui/material";
import NumberFormat from "react-number-format";
import { filter, find, findIndex, sumBy } from "lodash";
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

export default function TableWorksheetMhs13(props) {
  const { dataConfig, checking, jwbdata, jwbTotal, setJwbdata, setJwbTotal } =
    props;

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
  const changeDataTot = (e) => {
    const { name, value } = e.target;
    setJwbTotal({ ...jwbTotal, [name]: value });
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
      <div className="pt-3 overflow-x-auto border-collapse pb-1">
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
                <tr key={i}>
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
                className="p-0.5 text-center text-slate-800 border border-b"
              >
                JUMLAH
              </td>
              {dataConfig.dataheader.map((dat, ii) => (
                <Fragment key={ii}>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    {dat.uid === dataConfig.selectedwork ? (
                      <div
                        className={`relative ${
                          checking &&
                          jwbTotal.err_totdebet &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            jwbTotal.err_totdebet
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Jawab disini"
                            name="jwb_totdebet"
                            value={
                              jwbTotal.jwb_totdebet === 0
                                ? ""
                                : jwbTotal.jwb_totdebet
                            }
                            onChange={(e) => changeDataTot(e)}
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
                        {numberFormat(
                          sumBy(
                            filter(dataConfig.datanilai, {
                              idc: dat.uid,
                              type: "debet",
                            }),
                            (x) => Number(x.value)
                          )
                        )}
                      </div>
                    )}
                  </td>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    {dat.uid === dataConfig.selectedwork ? (
                      <div
                        className={`relative ${
                          checking &&
                          jwbTotal.err_totkredit &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            jwbTotal.err_totkredit
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Jawab disini"
                            name="jwb_totkredit"
                            value={
                              jwbTotal.jwb_totkredit === 0
                                ? ""
                                : jwbTotal.jwb_totkredit
                            }
                            onChange={(e) => changeDataTot(e)}
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
                        {numberFormat(
                          sumBy(
                            filter(dataConfig.datanilai, {
                              idc: dat.uid,
                              type: "kredit",
                            }),
                            (x) => Number(x.value)
                          )
                        )}
                      </div>
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
