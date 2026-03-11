import makeStyles from "@mui/styles/makeStyles";
import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import { filter, findIndex, find } from "lodash";
import { TextField, Tooltip } from "@mui/material";
import { forwardRef, Fragment } from "react";

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

const useStyles = makeStyles((theme) => ({
  customTextField: {
    "& input::placeholder": {
      fontSize: "13px",
    },
  },
}));

export default function TabelWorksheetMhs17(props) {
  const { dataConfig, jwbdata, setJwbdata, checking } = props;
  const classes = useStyles();

  const asetlancar = filter(jwbdata, {
    type: "asetlancar",
    posisi: "debet",
  });
  const liabilitas = filter(jwbdata, {
    type: "liabilitas",
    posisi: "kredit",
  });
  const asettetap = filter(jwbdata, {
    type: "asettetap",
    posisi: "debet",
  });
  const ekuitas = filter(jwbdata, {
    type: "ekuitas",
    posisi: "kredit",
  });

  //#region
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
  //#endregion
  //#region
  // Prepare
  const prepareData1 = () => {
    var itotald = false;
    var itotalk = false;
    const dataa = [];

    [
      ...Array(
        asetlancar.length > liabilitas.length
          ? asetlancar.length + 3
          : liabilitas.length + 3
      ),
    ].forEach((el, i) => {
      var d = {};
      var k = {};
      if (i < 1) {
        d = { stat: true, head: true, noakun: "100", alias: "Aset", value: 0 };
        k = {
          stat: true,
          head: true,
          noakun: "200",
          alias: "Liabilitas",
          value: 0,
        };
      } else {
        //untuk debit
        if (i < 2) {
          d = {
            stat: true,
            head: true,
            noakun: "",
            alias: "Aset Lancar",
            value: 0,
          };
        } else {
          if (asetlancar[i - 2]) {
            d = {
              stat: true,
              head: false,
              ...asetlancar[i - 2],
            };
          } else {
            d = {
              stat: false,
              stattot: !itotald ? true : false,
              alias: !itotald ? "Jumlah Aset Lancar" : "",
            };
            itotald = true;
          }
        }
        //Kredit
        if (liabilitas[i - 1]) {
          k = {
            stat: true,
            head: false,
            ...liabilitas[i - 1],
          };
        } else {
          k = {
            stat: false,
            stattot: !itotalk ? true : false,
            alias: !itotalk ? "Jumlah Ekuitas" : "",
          };
          itotalk = true;
        }
      }
      dataa.push([d, k]);
    });

    return dataa;
  };
  const prepareData2 = () => {
    var itotald = false;
    var itotalk = false;
    const dataa2 = [];

    [
      ...Array(
        asettetap.length > liabilitas.length
          ? asettetap.length + 2
          : ekuitas.length + 2
      ),
    ].forEach((el, i) => {
      var d = {};
      var k = {};
      if (i < 1) {
        d = {
          stat: true,
          head: true,
          noakun: "",
          alias: "Aset Tetap",
          value: 0,
        };
        k = {
          stat: true,
          head: true,
          noakun: "300",
          alias: "Ekuitas",
          value: 0,
        };
      } else {
        //untuk debit
        if (asettetap[i - 1]) {
          d = {
            stat: true,
            head: false,
            ...asettetap[i - 1],
          };
        } else {
          d = {
            stat: false,
            stattot: !itotald ? true : false,
            alias: !itotald ? "Jumlah Aset Tetap" : "",
          };
          itotald = true;
        }
        //Kredit
        if (ekuitas[i - 1]) {
          k = {
            stat: true,
            head: false,
            ...ekuitas[i - 1],
          };
        } else {
          k = {
            stat: false,
            stattot: !itotalk ? true : false,
            alias: !itotalk ? "Jumlah Ekuitas" : "",
          };
          itotalk = true;
        }
      }
      dataa2.push([d, k]);
    });

    return dataa2;
  };
  //#endregion

  const dataU1 = prepareData1();
  const dataU2 = prepareData2();
  const totAlancar = find(jwbdata, { type: "totasetlancar" });
  const totATetap = find(jwbdata, { type: "totasettetap" });
  const totLiabilitas = find(jwbdata, { type: "totliabilitas" });
  const totEkuitas = find(jwbdata, { type: "totekuitas" });
  const totDebet = find(jwbdata, { type: "totDebet" });
  const totKredit = find(jwbdata, { type: "totKredit" });

  return (
    <div className="border bg-white">
      <div className="my-4 flex flex-col items-center relative">
        <div className="text-xl font-semibold text-center uppercase">
          {dataConfig.cvname}
        </div>
        <h1 className="text-xl text-center">LAPORAN POSISI KEUANGAN</h1>
        <div className="text-xl relative mb-2">{dataConfig.tblworkname}</div>
        <span className="absolute -bottom-3 right-3">(dalam ribuan)</span>
      </div>
      <div className="w-full overflow-x-auto pb-5">
        <table className="w-full">
          <thead>
            <tr>
              <th className="min-w-10v max-w-10v py-2 text-slate-700 border">
                No. Akun
              </th>
              <th className="min-w-30v max-w-30v py-2 text-slate-700 border">
                Nama Akun
              </th>
              <th className="min-w-15v max-w-15v py-2 text-slate-700 border">
                Debet
              </th>
              <th className="min-w-10v max-w-10v py-2 text-slate-700 border">
                No. Akun
              </th>
              <th className="min-w-30v max-w-30v py-2 text-slate-700 border">
                Nama Akun
              </th>
              <th className="min-w-15v max-w-15v py-2 text-slate-700 border">
                Kredit
              </th>
            </tr>
          </thead>
          <tbody>
            {dataU1.map((el, i) => {
              return (
                <tr key={i} className="group">
                  {/* Debet */}
                  {!el[0].stat ? (
                    <Fragment>
                      <td className="min-w-10v max-w-10v py-0.5 text-slate-700 border"></td>
                      <td className="min-w-30v max-w-30v py-0.5 text-slate-700 border font-semibold pl-1">
                        {el[0].stattot && el[0].alias}
                      </td>
                      <td className="min-w-15v max-w-15v py-0 text-center text-slate-700 border">
                        <div
                          className={`relative py-1 ${
                            checking &&
                            totAlancar.err_value &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <Tooltip
                            title={
                              totAlancar.err_value
                                ? " Jawaban yang anda masukkan salah"
                                : ""
                            }
                          >
                            <TextField
                              classes={{ root: classes.customTextField }}
                              placeholder="Jawab disini"
                              name="jwb_value"
                              value={
                                totAlancar.jwb_value === 0
                                  ? ""
                                  : totAlancar.jwb_value
                              }
                              onChange={(e) => changeData(e, totAlancar.uid)}
                              fullWidth
                              InputProps={{
                                readOnly: checking,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix:
                                  totAlancar.jwb_value < 0 ? " Rp (" : "Rp ",
                                suffix: totAlancar.jwb_value < 0 ? ")" : "",
                                style: {
                                  textAlign: "center",
                                  fontSize: 14,
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
                    </Fragment>
                  ) : (
                    <Fragment>
                      <td
                        className={`min-w-10v max-w-10v p-0 text-slate-700 border`}
                      >
                        {el[0].stat && el[0].head ? (
                          <div className="font-semibold text-center py-1.5">
                            {el[0].noakun}
                          </div>
                        ) : el[0].key_noakun ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[0].err_noakun &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[0].err_noakun
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab No"
                                name="jwb_noakun"
                                value={
                                  el[0].jwb_noakun === 0 ? "" : el[0].jwb_noakun
                                }
                                onChange={(e) => changeData(e, el[0].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                }}
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                    fontSize: 14,
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
                          <div className="text-center py-1.5">
                            {el[0].noakun}
                          </div>
                        )}
                      </td>
                      <td
                        className={`min-w-30v max-w-30v p-0 text-slate-700 border`}
                      >
                        {el[0].stat && el[0].head ? (
                          <div className="font-semibold pl-1">
                            {el[0].alias}
                          </div>
                        ) : el[0].key_alias ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[0].err_alias &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[0].err_alias
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab Nama Akun"
                                name="jwb_alias"
                                value={
                                  el[0].jwb_alias === 0 ? "" : el[0].jwb_alias
                                }
                                onChange={(e) => changeData(e, el[0].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                }}
                                inputProps={{
                                  style: {
                                    fontSize: 14,
                                    paddingLeft: 5,
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
                          <div className="pl-2 py-1.5">{el[0].alias}</div>
                        )}
                      </td>
                      <td className="min-w-15v max-w-15v p-0 text-slate-700 border">
                        {el[0].stat && el[0].head ? (
                          <div></div>
                        ) : el[0].key_value ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[0].err_value &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[0].err_value
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab disini"
                                name="jwb_value"
                                value={
                                  el[0].jwb_value === 0 ? "" : el[0].jwb_value
                                }
                                onChange={(e) => changeData(e, el[0].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                                inputProps={{
                                  prefix: el[0].jwb_value < 0 ? " Rp (" : "Rp ",
                                  suffix: el[0].jwb_value < 0 ? ")" : "",
                                  style: {
                                    textAlign: "center",
                                    fontSize: 14,
                                    paddingLeft: 5,
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
                          <div className="text-center py-1.5">
                            {numberFormat(el[0].value)}
                          </div>
                        )}
                      </td>
                    </Fragment>
                  )}
                  {/* Kredit */}
                  {!el[1].stat ? (
                    <Fragment>
                      <td className="min-w-10v max-w-10v py-2 text-slate-700 border"></td>
                      <td className="min-w-30v max-w-30v py-2 text-slate-700 border font-semibold pl-1">
                        {el[1].stattot && el[1].alias}
                      </td>
                      <td className="min-w-15v max-w-15v py-0 text-center text-slate-700 border font-semibold">
                        {el[1].stattot && (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              totLiabilitas.err_value &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                totLiabilitas.err_value
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab disini"
                                name="jwb_value"
                                value={
                                  totLiabilitas.jwb_value === 0
                                    ? ""
                                    : totLiabilitas.jwb_value
                                }
                                onChange={(e) =>
                                  changeData(e, totLiabilitas.uid)
                                }
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                                inputProps={{
                                  prefix:
                                    totLiabilitas.jwb_value < 0
                                      ? " Rp ("
                                      : "Rp ",
                                  suffix:
                                    totLiabilitas.jwb_value < 0 ? ")" : "",
                                  style: {
                                    textAlign: "center",
                                    fontSize: 14,
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
                    </Fragment>
                  ) : (
                    <Fragment>
                      <td
                        className={`min-w-10v max-w-10v p-0 text-slate-700 border`}
                      >
                        {el[1].stat && el[1].head ? (
                          <div className="font-semibold text-center py-1.5">
                            {el[1].noakun}
                          </div>
                        ) : el[1].key_noakun ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[1].err_noakun &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[1].err_noakun
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab No"
                                name="jwb_noakun"
                                value={
                                  el[1].jwb_noakun === 0 ? "" : el[1].jwb_noakun
                                }
                                onChange={(e) => changeData(e, el[1].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                }}
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                    fontSize: 14,
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
                          <div className="text-center py-1.5">
                            {el[1].noakun}
                          </div>
                        )}
                      </td>
                      <td
                        className={`min-w-30v max-w-30v p-0 text-slate-700 border`}
                      >
                        {el[1].stat && el[1].head ? (
                          <div className="font-semibold pl-1">
                            {el[1].alias}
                          </div>
                        ) : el[1].key_alias ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[1].err_alias &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[1].err_alias
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab Nama Akun"
                                name="jwb_alias"
                                value={
                                  el[1].jwb_alias === 0 ? "" : el[1].jwb_alias
                                }
                                onChange={(e) => changeData(e, el[1].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                }}
                                inputProps={{
                                  style: {
                                    fontSize: 14,
                                    paddingLeft: 5,
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
                          <div className="pl-2 py-1.5">{el[1].alias}</div>
                        )}
                      </td>
                      <td className="min-w-15v max-w-15v p-0 text-slate-700 border">
                        {el[1].stat && el[1].head ? (
                          <div></div>
                        ) : el[1].key_value ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[1].err_value &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[1].err_value
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab disini"
                                name="jwb_value"
                                value={
                                  el[1].jwb_value === 0 ? "" : el[1].jwb_value
                                }
                                onChange={(e) => changeData(e, el[1].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                                inputProps={{
                                  prefix: el[1].jwb_value < 0 ? " Rp (" : "Rp ",
                                  suffix: el[1].jwb_value < 0 ? ")" : "",
                                  style: {
                                    textAlign: "center",
                                    fontSize: 14,
                                    paddingLeft: 5,
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
                          <div className="text-center py-1.5">
                            {numberFormat(el[1].value)}
                          </div>
                        )}
                      </td>
                    </Fragment>
                  )}
                </tr>
              );
            })}
            <tr>
              <td className="border py-1.5">&nbsp;</td>
              <td className="border"></td>
              <td className="border"></td>
              <td className="border"></td>
              <td className="border"></td>
              <td className="border"></td>
            </tr>
            {dataU2.map((el, i) => {
              return (
                <tr key={i} className="group">
                  {/* Debet */}
                  {!el[0].stat ? (
                    <Fragment>
                      <td className="min-w-10v max-w-10v py-0.5 text-slate-700 border"></td>
                      <td className="min-w-30v max-w-30v py-0.5 text-slate-700 border font-semibold pl-1">
                        {el[0].stattot && el[0].alias}
                      </td>
                      <td className="min-w-15v max-w-15v py-0 text-center text-slate-700 border">
                        <div
                          className={`relative py-1 ${
                            checking &&
                            totATetap.err_value &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <Tooltip
                            title={
                              totATetap.err_value
                                ? " Jawaban yang anda masukkan salah"
                                : ""
                            }
                          >
                            <TextField
                              classes={{ root: classes.customTextField }}
                              placeholder="Jawab disini"
                              name="jwb_value"
                              value={
                                totATetap.jwb_value === 0
                                  ? ""
                                  : totATetap.jwb_value
                              }
                              onChange={(e) => changeData(e, totATetap.uid)}
                              fullWidth
                              InputProps={{
                                readOnly: checking,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix:
                                  totATetap.jwb_value < 0 ? " Rp (" : "Rp ",
                                suffix: totATetap.jwb_value < 0 ? ")" : "",
                                style: {
                                  textAlign: "center",
                                  fontSize: 14,
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
                    </Fragment>
                  ) : (
                    <Fragment>
                      <td
                        className={`min-w-10v max-w-10v p-0 text-slate-700 border`}
                      >
                        {el[0].stat && el[0].head ? (
                          <div className="font-semibold text-center py-1.5">
                            {el[0].noakun}
                          </div>
                        ) : el[0].key_noakun ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[0].err_noakun &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[0].err_noakun
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab No"
                                name="jwb_noakun"
                                value={
                                  el[0].jwb_noakun === 0 ? "" : el[0].jwb_noakun
                                }
                                onChange={(e) => changeData(e, el[0].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                }}
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                    fontSize: 14,
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
                          <div className="text-center py-1.5">
                            {el[0].noakun}
                          </div>
                        )}
                      </td>
                      <td
                        className={`min-w-30v max-w-30v p-0 text-slate-700 border`}
                      >
                        {el[0].stat && el[0].head ? (
                          <div className="font-semibold pl-1">
                            {el[0].alias}
                          </div>
                        ) : el[0].key_alias ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[0].err_alias &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[0].err_alias
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab Nama Akun"
                                name="jwb_alias"
                                value={
                                  el[0].jwb_alias === 0 ? "" : el[0].jwb_alias
                                }
                                onChange={(e) => changeData(e, el[0].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                }}
                                inputProps={{
                                  style: {
                                    fontSize: 14,
                                    paddingLeft: 5,
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
                          <div className="pl-2 py-1.5">{el[0].alias}</div>
                        )}
                      </td>
                      <td className="min-w-15v max-w-15v p-0 text-slate-700 border">
                        {el[0].stat && el[0].head ? (
                          <div></div>
                        ) : el[0].key_value ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[0].err_value &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[0].err_value
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab disini"
                                name="jwb_value"
                                value={
                                  el[0].jwb_value === 0 ? "" : el[0].jwb_value
                                }
                                onChange={(e) => changeData(e, el[0].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                                inputProps={{
                                  prefix: el[0].jwb_value < 0 ? " Rp (" : "Rp ",
                                  suffix: el[0].jwb_value < 0 ? ")" : "",
                                  style: {
                                    textAlign: "center",
                                    fontSize: 14,
                                    paddingLeft: 5,
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
                          <div className="text-center py-1.5">
                            {numberFormat(el[0].value)}
                          </div>
                        )}
                      </td>
                    </Fragment>
                  )}
                  {/* Kredit */}
                  {!el[1].stat ? (
                    <Fragment>
                      <td className="min-w-10v max-w-10v py-2 text-slate-700 border"></td>
                      <td className="min-w-30v max-w-30v py-2 text-slate-700 border font-semibold pl-1">
                        {el[1].stattot && el[1].alias}
                      </td>
                      <td className="min-w-15v max-w-15v py-0 text-center text-slate-700 border font-semibold">
                        {el[1].stattot && (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              totEkuitas.err_value &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                totEkuitas.err_value
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab disini"
                                name="jwb_value"
                                value={
                                  totEkuitas.jwb_value === 0
                                    ? ""
                                    : totEkuitas.jwb_value
                                }
                                onChange={(e) => changeData(e, totEkuitas.uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                                inputProps={{
                                  prefix:
                                    totEkuitas.jwb_value < 0 ? " Rp (" : "Rp ",
                                  suffix: totEkuitas.jwb_value < 0 ? ")" : "",
                                  style: {
                                    textAlign: "center",
                                    fontSize: 14,
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
                    </Fragment>
                  ) : (
                    <Fragment>
                      <td
                        className={`min-w-10v max-w-10v p-0 text-slate-700 border`}
                      >
                        {el[1].stat && el[1].head ? (
                          <div className="font-semibold text-center py-1.5">
                            {el[1].noakun}
                          </div>
                        ) : el[1].key_noakun ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[1].err_noakun &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[1].err_noakun
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab No"
                                name="jwb_noakun"
                                value={
                                  el[1].jwb_noakun === 0 ? "" : el[1].jwb_noakun
                                }
                                onChange={(e) => changeData(e, el[1].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                }}
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                    fontSize: 14,
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
                          <div className="text-center py-1.5">
                            {el[1].noakun}
                          </div>
                        )}
                      </td>
                      <td
                        className={`min-w-30v max-w-30v p-0 text-slate-700 border`}
                      >
                        {el[1].stat && el[1].head ? (
                          <div className="font-semibold pl-1">
                            {el[1].alias}
                          </div>
                        ) : el[1].key_alias ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[1].err_alias &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[1].err_alias
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab Nama Akun"
                                name="jwb_alias"
                                value={
                                  el[1].jwb_alias === 0 ? "" : el[1].jwb_alias
                                }
                                onChange={(e) => changeData(e, el[1].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                }}
                                inputProps={{
                                  style: {
                                    fontSize: 14,
                                    paddingLeft: 5,
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
                          <div className="pl-2 py-1.5">{el[1].alias}</div>
                        )}
                      </td>
                      <td className="min-w-15v max-w-15v p-0 text-slate-700 border">
                        {el[1].stat && el[1].head ? (
                          <div></div>
                        ) : el[1].key_value ? (
                          <div
                            className={`relative py-1 ${
                              checking &&
                              el[1].err_value &&
                              " bg-red-300 animate-pulse"
                            }`}
                          >
                            <Tooltip
                              title={
                                el[1].err_value
                                  ? " Jawaban yang anda masukkan salah"
                                  : ""
                              }
                            >
                              <TextField
                                classes={{ root: classes.customTextField }}
                                placeholder="Jawab disini"
                                name="jwb_value"
                                value={
                                  el[1].jwb_value === 0 ? "" : el[1].jwb_value
                                }
                                onChange={(e) => changeData(e, el[1].uid)}
                                fullWidth
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                                inputProps={{
                                  prefix: el[1].jwb_value < 0 ? " Rp (" : "Rp ",
                                  suffix: el[1].jwb_value < 0 ? ")" : "",
                                  style: {
                                    textAlign: "center",
                                    fontSize: 14,
                                    paddingLeft: 5,
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
                          <div className="text-center py-1.5">
                            {numberFormat(el[1].value)}
                          </div>
                        )}
                      </td>
                    </Fragment>
                  )}
                </tr>
              );
            })}
            <tr>
              <td className="border py-1.5">&nbsp;</td>
              <td className="border"></td>
              <td className="border"></td>
              <td className="border"></td>
              <td className="border"></td>
              <td className="border"></td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border py-1.5 text-center uppercase font-semibold"
              >
                Jumlah Aset
              </td>
              <td className="min-w-15v max-w-15v py-0 text-center text-slate-700 border">
                <div
                  className={`relative py-1 ${
                    checking &&
                    totDebet.err_value &&
                    " bg-red-300 animate-pulse"
                  }`}
                >
                  <Tooltip
                    title={
                      totDebet.err_value
                        ? " Jawaban yang anda masukkan salah"
                        : ""
                    }
                  >
                    <TextField
                      classes={{ root: classes.customTextField }}
                      placeholder="Jawab disini"
                      name="jwb_value"
                      value={totDebet.jwb_value === 0 ? "" : totDebet.jwb_value}
                      onChange={(e) => changeData(e, totDebet.uid)}
                      fullWidth
                      InputProps={{
                        readOnly: checking,
                        inputComponent: NumberFormatCustom,
                      }}
                      inputProps={{
                        prefix: totDebet.jwb_value < 0 ? " Rp (" : "Rp ",
                        suffix: totDebet.jwb_value < 0 ? ")" : "",
                        style: {
                          textAlign: "center",
                          fontSize: 14,
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
              <td
                colSpan={2}
                className="border py-1.5 text-center uppercase font-semibold"
              >
                Jumlah Liabilitas dan Ekuitas
              </td>
              <td className="min-w-15v max-w-15v py-0 text-center text-slate-700 border">
                <div
                  className={`relative py-1 ${
                    checking &&
                    totKredit.err_value &&
                    " bg-red-300 animate-pulse"
                  }`}
                >
                  <Tooltip
                    title={
                      totKredit.err_value
                        ? " Jawaban yang anda masukkan salah"
                        : ""
                    }
                  >
                    <TextField
                      classes={{ root: classes.customTextField }}
                      placeholder="Jawab disini"
                      name="jwb_value"
                      value={
                        totKredit.jwb_value === 0 ? "" : totKredit.jwb_value
                      }
                      onChange={(e) => changeData(e, totKredit.uid)}
                      fullWidth
                      InputProps={{
                        readOnly: checking,
                        inputComponent: NumberFormatCustom,
                      }}
                      inputProps={{
                        prefix: totKredit.jwb_value < 0 ? " Rp (" : "Rp ",
                        suffix: totKredit.jwb_value < 0 ? ")" : "",
                        style: {
                          textAlign: "center",
                          fontSize: 14,
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
