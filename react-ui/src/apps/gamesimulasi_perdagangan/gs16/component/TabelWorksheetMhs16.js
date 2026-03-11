import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import { filter, findIndex, map } from "lodash";
import { TextField, Tooltip } from "@mui/material";
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
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

export default function TabelWorksheetMhs16(props) {
  const { dataConfig, jwbdata, setJwbdata, checking } = props;
  const dataAdd = filter(jwbdata, { type: "add" });
  const dataMin = filter(jwbdata, { type: "min" });

  const changeData = (e, uid) => {
    const { name, value } = e.target;
    const idx = findIndex(jwbdata, {
      uid: uid,
    });
    const list = [...jwbdata];
    list.splice(idx, 1, {
      ...list[idx],
      [name]: value,
    });

    setJwbdata(list);
  };

  return (
    <div className="border overflow-x-auto max-w-4xl bg-white">
      <div className="my-4 flex flex-col items-center relative">
        <div className="text-xl font-semibold uppercase">
          {dataConfig.cvname}
        </div>
        <h1 className="text-xl text-center">LAPORAN PERUBAHAN EKUITAS</h1>
        <div className="text-xl relative mb-2">{dataConfig.tblworkname}</div>
        <span className="absolute -bottom-3 right-3">(dalam ribuan)</span>
      </div>
      <div className="w-full border-t-2 px-2 pt-3 pb-2">
        <table className="w-full">
          <tbody>
            {map(filter(jwbdata, { type: "ekuitasawal" }), (el, i) => (
              <tr key={i}>
                <td
                  colSpan={3}
                  className="text-base font-semibold text-slate-900"
                >
                  {el.alias}
                </td>
                <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                  <div
                    className={`relative py-1 ${
                      checking && el.err_value && " bg-red-300 animate-pulse"
                    }`}
                  >
                    <Tooltip
                      title={
                        el.err_value ? " Jawaban yang anda masukkan salah" : ""
                      }
                    >
                      <TextField
                        placeholder="Jawab disini"
                        name="jwb_value"
                        value={el.jwb_value === 0 ? "" : el.jwb_value}
                        onChange={(e) => changeData(e, el.uid)}
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
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}>
                <div className="text-base font-semibold text-slate-900 pt-1">
                  Penambahan :
                </div>
              </td>
            </tr>
            {map(dataAdd, (el, index) => {
              return (
                <tr key={index}>
                  <td className="min-w-30v max-w-30v p-0 pl-4 whitespace-nowrap text-slate-900 relative">
                    <div className="p-1 border-b ">{el.alias}</div>
                  </td>
                  <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                    {el.key_value === 0 ? (
                      <div className="p-1 border-b ">
                        Rp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-
                      </div>
                    ) : (
                      <div
                        className={`relative py-1 ${
                          checking &&
                          el.err_value &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            el.err_value
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Jawab disini"
                            name="jwb_value"
                            value={el.jwb_value === 0 ? "" : el.jwb_value}
                            onChange={(e) => changeData(e, el.uid)}
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
                    )}
                  </td>
                  <td className="min-w-10v max-w-10v whitespace-nowrap  text-slate-900 relative"></td>
                  <td className="min-w-10v max-w-10v whitespace-nowrap  text-slate-900 relative"></td>
                </tr>
              );
            })}
            {map(filter(jwbdata, { type: "totadd" }), (el, i) => (
              <tr key={i}>
                <td className="min-w-30v max-w-30v p-0 pl-4 whitespace-nowrap text-slate-900">
                  <div className="p-1">Total Penambahan</div>
                </td>
                <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                  <div className="p-1">&nbsp;</div>
                </td>
                <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                  <div
                    className={`relative py-1 ${
                      checking && el.err_value && " bg-red-300 animate-pulse"
                    }`}
                  >
                    <Tooltip
                      title={
                        el.err_value ? " Jawaban yang anda masukkan salah" : ""
                      }
                    >
                      <TextField
                        placeholder="Jawab disini"
                        name="jwb_value"
                        value={el.jwb_value === 0 ? "" : el.jwb_value}
                        onChange={(e) => changeData(e, el.uid)}
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
                </td>
                <td className="min-w-10v max-w-10v whitespace-nowrap  text-slate-900 relative"></td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}>
                <div className="text-base font-semibold text-slate-900 pt-1">
                  Pengurangan :
                </div>
              </td>
            </tr>
            {map(dataMin, (el, index) => {
              return (
                <tr key={index}>
                  <td className="min-w-30v max-w-30v p-0 pl-4 whitespace-nowrap text-slate-900 relative">
                    <div className="p-1 border-b ">{el.alias}</div>
                  </td>
                  <td className="min-w-10v max-w-10v py-0.5 whitespace-nowrap text-slate-900 relative">
                    <div className="p-1 border-b ">&nbsp;</div>
                  </td>
                  <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                    {el.key_value === 0 ? (
                      <div className="p-1 border-b ">
                        Rp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-
                      </div>
                    ) : (
                      <div
                        className={`relative py-1 ${
                          checking &&
                          el.err_value &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            el.err_value
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Jawab disini"
                            name="jwb_value"
                            value={el.jwb_value === 0 ? "" : el.jwb_value}
                            onChange={(e) => changeData(e, el.uid)}
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
                    )}
                  </td>
                  <td className="min-w-10v max-w-10v whitespace-nowrap  text-slate-900 relative"></td>
                </tr>
              );
            })}
            {map(filter(jwbdata, { type: "totmin" }), (el, i) => (
              <tr key={i}>
                <td className="min-w-30v max-w-30v p-0 pl-4 whitespace-nowrap text-slate-900">
                  &nbsp;
                </td>
                <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                  &nbsp;
                </td>
                <td className="min-w-10v max-w-10v whitespace-nowrap  text-slate-900 relative"></td>
                <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                  <div
                    className={`relative py-1 ${
                      checking && el.err_value && " bg-red-300 animate-pulse"
                    }`}
                  >
                    <Tooltip
                      title={
                        el.err_value ? " Jawaban yang anda masukkan salah" : ""
                      }
                    >
                      <TextField
                        placeholder="Jawab disini"
                        name="jwb_value"
                        value={el.jwb_value === 0 ? "" : el.jwb_value}
                        onChange={(e) => changeData(e, el.uid)}
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
                </td>
              </tr>
            ))}
            {map(filter(jwbdata, { type: "ekuitasakhir" }), (el, i) => (
              <tr key={i}>
                <td
                  colSpan={3}
                  className="text-base font-semibold text-slate-900"
                >
                  <div className="pt-2">{el.alias}</div>
                </td>
                <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                  <div
                    className={`relative py-1 ${
                      checking && el.err_value && " bg-red-300 animate-pulse"
                    }`}
                  >
                    <Tooltip
                      title={
                        el.err_value ? " Jawaban yang anda masukkan salah" : ""
                      }
                    >
                      <TextField
                        placeholder="Jawab disini"
                        name="jwb_value"
                        value={el.jwb_value === 0 ? "" : el.jwb_value}
                        onChange={(e) => changeData(e, el.uid)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
