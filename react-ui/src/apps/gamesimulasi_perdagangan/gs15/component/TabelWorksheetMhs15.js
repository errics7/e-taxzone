import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import { filter, find, findIndex, map } from "lodash";
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
      style={{
        textAlign: "center",
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

export default function TabelWorksheetMhs15(props) {
  const { dataConfig, jwbdata, setJwbdata, checking } = props;

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

  const obtotalbeban = find(jwbdata, { type: "totalbeban" });
  const oblababersih = find(jwbdata, { type: "lababersih" });

  return (
    <div className="border overflow-x-auto bg-white">
      <div className="my-4 flex flex-col items-center relative">
        <div className="text-xl uppercase">{dataConfig.cvname}</div>
        <h1 className="text-xl text-center">LAPORAN LABA/RUGI</h1>
        <div className="text-xl uppercase mb-3">{dataConfig.tblworkname}</div>
        <span className="absolute -bottom-2 right-3">(dalam ribuan)</span>
      </div>
      <div className="w-full border-t-2 px-2 pb-2">
        <table className="w-full border">
          <tbody>
            <tr>
              <td colSpan={4}>
                <div className="px-3 pt-3 pb-0.5 text-base text-slate-900">
                  Pendapatan :
                </div>
              </td>
            </tr>
            {map(filter(jwbdata, { type: "kredit" }), (el, index) => {
              return (
                <tr key={index} className="border">
                  <td className="min-w-7v max-w-7v p-0.5 whitespace-nowrap text-center text-slate-900 border-r relative">
                    <div
                      className={`relative py-1 ${
                        checking && el.err_noakun && " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          el.err_noakun
                            ? " Jawaban yang anda masukkan salah"
                            : ""
                        }
                      >
                        <TextField
                          placeholder="Jawab No Akun"
                          name="jwb_noakun"
                          value={el.jwb_noakun}
                          onChange={(e) => changeData(e, el.uid)}
                          fullWidth
                          InputProps={{
                            readOnly: checking,
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
                  </td>
                  <td className="min-w-20v max-w-20v p-0.5 whitespace-nowrap text-slate-900 border-r relative">
                    <div
                      className={`relative py-1 ${
                        checking && el.err_alias && " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          el.err_alias
                            ? " Jawaban yang anda masukkan salah"
                            : ""
                        }
                      >
                        <TextField
                          placeholder="Jawab Nama Akun"
                          name="jwb_alias"
                          value={el.jwb_alias}
                          onChange={(e) => changeData(e, el.uid)}
                          fullWidth
                          InputProps={{
                            readOnly: checking,
                          }}
                          inputProps={{
                            style: {
                              textAlign: "left",
                              paddingLeft: 5,
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
                  </td>
                  <td className="min-w-10v max-w-10v py-2 whitespace-nowrap  text-slate-900 border-r relative">
                    {/* {el.noakun} */}
                  </td>
                  <td className="min-w-10v max-w-10v p-0.5 whitespace-nowrap text-center text-slate-900 border-r relative">
                    <div
                      className={`relative py-1 ${
                        checking && el.err_value && " bg-red-300 animate-pulse"
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
                          placeholder="Jawab Nilai"
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
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={4}>
                <div className="px-3 py-0.5 text-base text-slate-900">
                  <div className="pt-2">Beban-beban :</div>
                </div>
              </td>
            </tr>
            {map(filter(jwbdata, { type: "debet" }), (el, index) => {
              return (
                <tr key={index} className="border">
                  <td className="min-w-7v max-w-7v p-0.5 whitespace-nowrap text-center text-slate-900 border-r relative">
                    <div
                      className={`relative py-1 ${
                        checking && el.err_noakun && " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          el.err_noakun
                            ? " Jawaban yang anda masukkan salah"
                            : ""
                        }
                      >
                        <TextField
                          placeholder="Jawab No Akun"
                          name="jwb_noakun"
                          value={el.jwb_noakun}
                          onChange={(e) => changeData(e, el.uid)}
                          fullWidth
                          InputProps={{
                            readOnly: checking,
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
                  </td>
                  <td className="min-w-20v max-w-20v p-0.5 whitespace-nowrap text-slate-900 border-r relative">
                    <div
                      className={`relative py-1 ${
                        checking && el.err_alias && " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          el.err_alias
                            ? " Jawaban yang anda masukkan salah"
                            : ""
                        }
                      >
                        <TextField
                          placeholder="Jawab Nama Akun"
                          name="jwb_alias"
                          value={el.jwb_alias}
                          onChange={(e) => changeData(e, el.uid)}
                          fullWidth
                          InputProps={{
                            readOnly: checking,
                          }}
                          inputProps={{
                            style: {
                              textAlign: "left",
                              paddingLeft: 5,
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
                  </td>
                  <td className="min-w-10v max-w-10v p-0.5 whitespace-nowrap text-center text-slate-900 border-r relative">
                    <div
                      className={`relative py-1 ${
                        checking && el.err_value && " bg-red-300 animate-pulse"
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
                          placeholder="Jawab Nilai"
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
                  </td>
                  <td className="min-w-10v max-w-10v whitespace-nowrap  text-slate-900 border-r relative">
                    {/* {el.noakun} */}
                  </td>
                </tr>
              );
            })}
            <tr className="border">
              <td className="min-w-7v max-w-7v py-0.5 whitespace-nowrap text-center text-slate-900 border-r relative"></td>
              <td className="min-w-20v max-w-20v py-0.5 pl-2 whitespace-nowrap font-semibold text-slate-900 border-r relative">
                Total Beban
              </td>
              <td className="min-w-10v max-w-10v py-0.5 text-slate-900 "></td>
              <td className="min-w-10v max-w-10v p-0.5 whitespace-nowrap text-center relative">
                <div
                  className={`relative py-1 ${
                    checking &&
                    obtotalbeban.err_value &&
                    " bg-red-300 animate-pulse"
                  }`}
                >
                  <Tooltip
                    title={
                      obtotalbeban.err_value
                        ? " Jawaban yang anda masukkan salah"
                        : ""
                    }
                  >
                    <TextField
                      placeholder="Jawab Total Beban"
                      name="jwb_value"
                      value={
                        obtotalbeban.jwb_value === 0
                          ? ""
                          : obtotalbeban.jwb_value
                      }
                      onChange={(e) => changeData(e, obtotalbeban.uid)}
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
              </td>
            </tr>
            <tr className="border">
              <td className="min-w-7v max-w-7v py-0.5 whitespace-nowrap text-center text-slate-900 border-r relative"></td>
              <td className="min-w-20v max-w-20v py-0.5 pl-2 whitespace-nowrap font-semibold text-slate-900 border-r relative">
                Laba Bersih (Sebelum Pajak)
              </td>
              <td className="min-w-10v max-w-10v py-0.5 whitespace-nowrap text-slate-900"></td>
              <td className="min-w-10v max-w-10v p-0.5 text-slate-900  text-center">
                <div
                  className={`relative py-1 ${
                    checking &&
                    oblababersih.err_value &&
                    " bg-red-300 animate-pulse"
                  }`}
                >
                  <Tooltip
                    title={
                      oblababersih.err_value
                        ? " Jawaban yang anda masukkan salah"
                        : ""
                    }
                  >
                    <TextField
                      placeholder="Jawab Laba Bersih"
                      name="jwb_value"
                      value={
                        oblababersih.jwb_value === 0
                          ? ""
                          : oblababersih.jwb_value
                      }
                      onChange={(e) => changeData(e, oblababersih.uid)}
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
