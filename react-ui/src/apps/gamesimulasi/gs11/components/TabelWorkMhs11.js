import { find, sumBy } from "lodash";
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import { forwardRef } from "react";

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
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

export default function TabelWorkMhs11(props) {
  const { checking, ori, jawab, setJawab, jawabTot, setJawabTot } = props;
  const { headers, departements, sections, kode, kpembantu } = ori;
  const kpembantu1 = kpembantu.filter((x) => x.type === 1);
  const data = jawab;

  // PREPARAtion DATA
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const changeValueCell = (uid, e) => {
    const { name, value } = e.target;

    setJawab(
      jawab.map((u, i) =>
        u.uuid === uid
          ? {
              ...u,
              [name]: Number(value),
            }
          : u
      )
    );
  };
  const changeValueCelltot = (uid, e) => {
    const { name, value } = e.target;

    setJawabTot(
      jawabTot.map((u, i) =>
        u.uuid === uid
          ? {
              ...u,
              [name]: Number(value),
            }
          : u
      )
    );
  };

  const tot = find(jawabTot, { uuid: "totalall" });

  return (
    <div className="p-1 border overflow-x-auto bg-white">
      <table className="min-w-full table-fixed mb-4">
        <thead>
          <tr className="break-words bg-slate-50">
            <th className="min-w-10v max-w-10v px-2 border">
              Kode Rek Pembantu
            </th>
            <th className="min-w-15v max-w-15v px-2 border">Jumlah</th>
            <th className="p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {headers.map((item1, index) => (
                      <th
                        key={index}
                        colSpan={item1.colspan}
                        rowSpan={item1.rowspan}
                        className="p-0 border relative group"
                      >
                        <div className="py-3 min-w-20v">{item1.alias}</div>
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {departements.map((item2, index) => (
                      <th
                        key={index}
                        colSpan={item2.colspan}
                        rowSpan={item2.rowspan}
                        className="p-0 border relative group"
                      >
                        <div className="py-1 min-w-20v">{item2.alias}</div>
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {sections.map((item3, index) => (
                      <th
                        key={index}
                        colSpan={item3.colspan}
                        rowSpan={item3.rowspan}
                        className="p-0 border relative group"
                      >
                        <div className="py-1 min-w-20v">{item3.alias}</div>
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {kode.map((item3, index) => (
                      <th
                        key={index}
                        colSpan={item3.colspan}
                        rowSpan={item3.rowspan}
                        className="p-0 border min-w-20v max-w-20v relative group"
                      >
                        <div className="py-1">{item3.alias}</div>
                      </th>
                    ))}
                  </tr>
                </tbody>
              </table>
            </th>
          </tr>
        </thead>
        <tbody>
          {kpembantu1.map((trl, index) => {
            const totroww = sumBy(
              data.filter((x) => x.idr === trl.uuid),
              (r) => r.value
            );
            return (
              <tr key={index} className="hover:bg-slate-50">
                <td className="p-0 max-w-10v border group">
                  <div className="py-1 relative text-center">{trl.alias}</div>
                </td>
                <td className="px-2 py-2 min-w-10v max-w-10v border text-center">
                  {totroww === 0 ? (
                    ""
                  ) : totroww > 0 ? (
                    toRp(
                      sumBy(
                        data.filter((x) => x.idr === trl.uuid),
                        (r) => r.value
                      )
                    )
                  ) : (
                    <div>
                      (
                      {toRp(
                        sumBy(
                          data.filter((x) => x.idr === trl.uuid),
                          (r) => r.value
                        )
                      )}
                      )
                    </div>
                  )}
                </td>
                <td className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        {kode.map((item, index) => {
                          const f = find(data, {
                            idc: item.uuid,
                            idr: trl.uuid,
                          });
                          return (
                            <td
                              key={index}
                              className="p-0 border relative group min-w-20v max-w-20v"
                            >
                              {f ? (
                                <div
                                  className={`py-1 text-center mx-auto ${
                                    checking &&
                                    f.type === 1 &&
                                    f.err_value &&
                                    "bg-red-300 animate-pulse"
                                  }`}
                                >
                                  {f.type === 1 ? (
                                    <>
                                      <Tooltip
                                        title={
                                          checking &&
                                          f.type === 1 &&
                                          f.err_value
                                            ? "Jawaban yang anda masukkan salah"
                                            : ""
                                        }
                                        arrow
                                      >
                                        <TextField
                                          placeholder="Jawab disini"
                                          value={
                                            f.jwb_value === 0 ? "" : f.jwb_value
                                          }
                                          name="jwb_value"
                                          onChange={(event) =>
                                            changeValueCell(f.uuid, event)
                                          }
                                          fullWidth
                                          InputProps={{
                                            readOnly: checking,
                                            inputComponent: NumberFormatCustom,
                                          }}
                                          inputProps={{
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
                                          className="text-blue-700 absolute inset-y-0 right-3 opacity-40 group-hover:opacity-70"
                                        />
                                      )}
                                    </>
                                  ) : (
                                    <>{toRp(f.value)}</>
                                  )}
                                </div>
                              ) : (
                                <div className="table-cell py-2">&nbsp;</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
          {/* JUMLAH #1 */}
          <tr className="bg-slate-50">
            <td className="py-2 text-center border relative">Jumlah</td>
            <td className="text-center border table-cell relative">
              {tot && (
                <div
                  className={`py-1 text-center mx-auto ${
                    checking && tot.err_value && "bg-red-300 animate-pulse"
                  }`}
                >
                  <Tooltip
                    title={
                      checking && tot.err_value
                        ? "Jawaban yang anda masukkan salah"
                        : ""
                    }
                    arrow
                  >
                    <TextField
                      placeholder="Jawab disini"
                      value={tot.jwb_value === 0 ? "" : tot.jwb_value}
                      name="jwb_value"
                      onChange={(event) => changeValueCelltot(tot.uuid, event)}
                      fullWidth
                      InputProps={{
                        readOnly: checking,
                        inputComponent: NumberFormatCustom,
                      }}
                      inputProps={{
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
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-40 group-hover:opacity-70"
                    />
                  )}
                </div>
              )}
            </td>
            <td className="p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {kode.map((item, index) => {
                      const val = find(jawabTot, { idc: item.uuid });

                      return (
                        <td
                          key={index}
                          className="p-0 border relative group min-w-20v max-w-20v text-center"
                        >
                          {val.type === 1 ? (
                            <div
                              className={`py-1 text-center mx-auto ${
                                checking &&
                                val.err_value &&
                                "bg-red-300 animate-pulse"
                              }`}
                            >
                              <Tooltip
                                title={
                                  checking && val.err_value
                                    ? "Jawaban yang anda masukkan salah"
                                    : ""
                                }
                                arrow
                              >
                                <TextField
                                  placeholder="Jawab disini"
                                  value={
                                    val.jwb_value === 0 ? "" : val.jwb_value
                                  }
                                  name="jwb_value"
                                  onChange={(event) =>
                                    changeValueCelltot(val.uuid, event)
                                  }
                                  fullWidth
                                  InputProps={{
                                    readOnly: checking,
                                    inputComponent: NumberFormatCustom,
                                  }}
                                  inputProps={{
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
                                  className="text-blue-700 absolute inset-y-0 right-1 opacity-40 group-hover:opacity-70"
                                />
                              )}
                            </div>
                          ) : (
                            <>
                              {val.key_value < 0 ? (
                                <>({toRp(Math.abs(val.key_value))})</>
                              ) : (
                                toRp(val.key_value)
                              )}
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
