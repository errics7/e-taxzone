import { v4 as uuidv4 } from "uuid";
import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
import EditIcon from "@mui/icons-material/Edit";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import NumberFormat from "react-number-format"; 
import { filter, findIndex, remove, sumBy } from "lodash";
import { TextField } from "@mui/material";
import { forwardRef, Fragment } from "react";
import PopMenuRowWorksheet17 from "./PopMenuRowWorksheet17";

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

export default function TabelWorksheetAdmin17(props) {
  const { dataConfig, setdataConfig } = props;

  const asetlancar = filter(dataConfig.datawork, {
    type: "asetlancar",
    posisi: "debet",
  });
  const liabilitas = filter(dataConfig.datawork, {
    type: "liabilitas",
    posisi: "kredit",
  });
  const asettetap = filter(dataConfig.datawork, {
    type: "asettetap",
    posisi: "debet",
  });
  const ekuitas = filter(dataConfig.datawork, {
    type: "ekuitas",
    posisi: "kredit",
  });

  //#region
  const changeData = (e, uid) => {
    const { name, value } = e.target;
    const idx = findIndex(dataConfig.datawork, {
      uid: uid,
    });
    const list = [...dataConfig.datawork];
    list.splice(idx, 1, {
      ...list[idx],
      [name]: value,
    });

    setdataConfig({
      ...dataConfig,
      datawork: list,
    });
  };
  const newDataW = (uid, type, pos) => {
    const idx = findIndex(dataConfig.datawork, { uid: uid });
    const list = [...dataConfig.datawork];
    list.splice(idx + 1, 0, {
      uid: uuidv4(),
      noakun: "",
      alias: "",
      value: 0,
      key_noakun: true,
      key_alias: true,
      key_value: true,
      posisi: pos,
      type: type,
    });

    setdataConfig({
      ...dataConfig,
      datawork: list,
    });
  };
  const removeDataW = (uid) => {
    const list = [...dataConfig.datawork];
    remove(list, (x) => x.uid === uid);

    setdataConfig({
      ...dataConfig,
      datawork: list,
    });
  };
  const changeKey = (uid, prevv, name) => {
    const idx = findIndex(dataConfig.datawork, {
      uid: uid,
    });
    const list = [...dataConfig.datawork];
    list.splice(idx, 1, {
      ...list[idx],
      [name]: !prevv,
    });

    setdataConfig({
      ...dataConfig,
      datawork: list,
    });
  };
  //#endregion
  // Prepare
  const dictDat = {
    asetlancar: asetlancar.length,
    liabilitas: liabilitas.length,
    asettetap: asettetap.length,
    ekuitas: ekuitas.length,
  };

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

  const dataU1 = prepareData1();
  const dataU2 = prepareData2();

  return (
    <div className="border max-w-6xl">
      <div className="my-4 flex flex-col items-center relative">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.cvname : ""}
            className={"font-semibold text-center uppercase"}
            onChange={(text) => setdataConfig({ ...dataConfig, cvname: text })}
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute p-0.5 -inset-y-1 -right-0 opacity-30"
          />
        </div>
        <h1 className="text-xl text-center">LAPORAN POSISI KEUANGAN</h1>
        <div className="text-xl relative mb-2">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.tblworkname : ""}
            onChange={(text) =>
              setdataConfig({ ...dataConfig, tblworkname: text })
            }
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute p-0.5 -inset-y-1 -right-0 opacity-30"
          />
        </div>
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
                      <td className="min-w-15v max-w-15v py-0.5 text-center text-slate-700 border">
                        {el[0].stattot && (
                          <div className="font-semibold bg-emerald-500 bg-opacity-20 py-1.5">
                            {numberFormat(
                              sumBy(asetlancar, (x) => Number(x.value))
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
                        {el[0].stat && el[0].head ? (
                          <div className="font-semibold text-center py-1.5">
                            {el[0].noakun}
                          </div>
                        ) : (
                          <div
                            className={`relative ${
                              el[0].key_noakun && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <div className="absolute z-50 top-1 -left-1 flex items-center">
                              <PopMenuRowWorksheet17
                                indx={i}
                                length={dictDat[el[0].type]}
                                keynamed="No Akun"
                                keykey={el[0].key_noakun}
                                changeKey={() =>
                                  changeKey(
                                    el[0].uid,
                                    el[0].key_noakun,
                                    "key_noakun"
                                  )
                                }
                                addRow={() =>
                                  newDataW(el[0].uid, el[0].type, "debet")
                                }
                                removeRow={() => removeDataW(el[0].uid)}
                              />
                            </div>
                            <TextField
                              fullWidth
                              placeholder="No Akun"
                              value={el[0].noakun}
                              name="noakun"
                              onChange={(e) => changeData(e, el[0].uid)}
                              inputProps={{
                                style: {
                                  fontSize: 14,
                                  textAlign: "center",
                                },
                              }}
                              InputProps={{
                                disableUnderline: true,
                              }}
                            />
                            {el[0].key_noakun && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-0"
                            />
                          </div>
                        )}
                      </td>
                      <td
                        className={`min-w-30v max-w-30v py-1 text-slate-700 border`}
                      >
                        {el[0].stat && el[0].head ? (
                          <div className="font-semibold pl-1">
                            {el[0].alias}
                          </div>
                        ) : (
                          <div
                            className={`relative ${
                              el[0].key_alias && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <TextField
                              fullWidth
                              placeholder="Nama Akun"
                              value={el[0].alias}
                              name="alias"
                              onChange={(e) => changeData(e, el[0].uid)}
                              inputProps={{
                                style: {
                                  fontSize: 14,
                                  paddingLeft: 5,
                                },
                              }}
                              InputProps={{
                                disableUnderline: true,
                              }}
                            />
                            <div className="absolute z-50 top-1 -right-1 flex items-center opacity-10 group-hover:opacity-80">
                              <PopMenuRowWorksheet17
                                keynamed="Nama Akun"
                                keykey={el[0].key_alias}
                                changeKey={() =>
                                  changeKey(
                                    el[0].uid,
                                    el[0].key_alias,
                                    "key_alias"
                                  )
                                }
                              />
                            </div>
                            {el[0].key_alias && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-7"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3.5"
                            />
                          </div>
                        )}
                      </td>
                      <td className="min-w-15v max-w-15v p-0 text-slate-700 border">
                        {el[0].stat && el[0].head ? (
                          <div></div>
                        ) : (
                          <div
                            className={`relative ${
                              el[0].key_value && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <TextField
                              fullWidth
                              placeholder="Rp -"
                              value={el[0].value}
                              name="value"
                              onChange={(e) => changeData(e, el[0].uid)}
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: el[0].value < 0 ? " Rp (" : "Rp ",
                                suffix: el[0].value < 0 ? ")" : "",
                                style: {
                                  textAlign: "center",
                                  fontSize: 14,
                                },
                              }}
                            />
                            <div className="absolute z-50 top-1 -right-1 flex items-center opacity-10 group-hover:opacity-80">
                              <PopMenuRowWorksheet17
                                keynamed="Nilai"
                                keykey={el[0].key_value}
                                changeKey={() =>
                                  changeKey(
                                    el[0].uid,
                                    el[0].key_value,
                                    "key_value"
                                  )
                                }
                              />
                            </div>
                            {el[0].key_value && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-6"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3"
                            />
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
                      <td className="min-w-15v max-w-15v py-0.5 text-center text-slate-700 border font-semibold">
                        {el[1].stattot && (
                          <div className="font-semibold bg-emerald-500 bg-opacity-20 py-1.5">
                            {numberFormat(
                              sumBy(liabilitas, (x) => Number(x.value))
                            )}
                          </div>
                        )}
                      </td>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <td
                        className={`min-w-10v max-w-10v p-0.5 text-slate-700 border`}
                      >
                        {el[1].stat && el[1].head ? (
                          <div className="font-semibold text-center">
                            {el[1].noakun}
                          </div>
                        ) : (
                          <div
                            className={`relative ${
                              el[1].key_noakun && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <div className="absolute z-50 top-1 -left-1 flex items-center">
                              <PopMenuRowWorksheet17
                                indx={i}
                                length={dictDat[el[1].type]}
                                keynamed="No Akun"
                                keykey={el[1].key_noakun}
                                changeKey={() =>
                                  changeKey(
                                    el[1].uid,
                                    el[1].key_noakun,
                                    "key_noakun"
                                  )
                                }
                                addRow={() =>
                                  newDataW(el[1].uid, el[1].type, "debet")
                                }
                                removeRow={() => removeDataW(el[1].uid)}
                              />
                            </div>
                            <TextField
                              fullWidth
                              placeholder="No Akun"
                              value={el[1].noakun}
                              name="noakun"
                              onChange={(e) => changeData(e, el[1].uid)}
                              inputProps={{
                                style: {
                                  fontSize: 14,
                                  textAlign: "center",
                                },
                              }}
                              InputProps={{
                                disableUnderline: true,
                              }}
                            />
                            {el[1].key_noakun && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-0"
                            />
                          </div>
                        )}
                      </td>
                      <td
                        className={`min-w-30v max-w-30v py-0.5 text-slate-700 border`}
                      >
                        {el[1].stat && el[1].head ? (
                          <div className="font-semibold pl-1">
                            {el[1].alias}
                          </div>
                        ) : (
                          <div
                            className={`relative ${
                              el[1].key_alias && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <TextField
                              fullWidth
                              placeholder="Nama Akun"
                              value={el[1].alias}
                              name="alias"
                              onChange={(e) => changeData(e, el[1].uid)}
                              inputProps={{
                                style: {
                                  fontSize: 14,
                                  paddingLeft: 5,
                                },
                              }}
                              InputProps={{
                                disableUnderline: true,
                              }}
                            />
                            <div className="absolute z-50 top-1 -right-1 flex items-center opacity-10 group-hover:opacity-80">
                              <PopMenuRowWorksheet17
                                keynamed="Nama Akun"
                                keykey={el[1].key_alias}
                                changeKey={() =>
                                  changeKey(
                                    el[1].uid,
                                    el[1].key_alias,
                                    "key_alias"
                                  )
                                }
                              />
                            </div>
                            {el[1].key_alias && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-7"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3.5"
                            />
                          </div>
                        )}
                      </td>
                      <td className="min-w-15v max-w-15v py-1 text-slate-700 border">
                        {el[1].stat && el[1].head ? (
                          <div className="font-semibold"></div>
                        ) : (
                          <div
                            className={`relative ${
                              el[1].key_value && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <TextField
                              fullWidth
                              placeholder="Nama Akun"
                              value={el[1].value}
                              name="value"
                              onChange={(e) => changeData(e, el[1].uid)}
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: el[1].value < 0 ? " Rp (" : "Rp ",
                                suffix: el[1].value < 0 ? ")" : "",
                                style: {
                                  textAlign: "center",
                                  fontSize: 14,
                                },
                              }}
                            />
                            <div className="absolute z-50 top-1 -right-1 flex items-center opacity-10 group-hover:opacity-80">
                              <PopMenuRowWorksheet17
                                keynamed="Nilai"
                                keykey={el[1].key_value}
                                changeKey={() =>
                                  changeKey(
                                    el[1].uid,
                                    el[1].key_value,
                                    "key_value"
                                  )
                                }
                              />
                            </div>
                            {el[1].key_value && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-6"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3"
                            />
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
                      <td className="min-w-15v max-w-15v py-0.5 text-center text-slate-700 border">
                        {el[0].stattot && (
                          <div className="font-semibold bg-emerald-500 bg-opacity-20 py-1.5">
                            {numberFormat(
                              sumBy(asettetap, (x) => Number(x.value))
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
                        {el[0].stat && el[0].head ? (
                          <div className="font-semibold text-center py-1.5">
                            {el[0].noakun}
                          </div>
                        ) : (
                          <div
                            className={`relative ${
                              el[0].key_noakun && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <div className="absolute z-50 top-1 -left-1 flex items-center">
                              <PopMenuRowWorksheet17
                                indx={i}
                                length={dictDat[el[0].type]}
                                keynamed="No Akun"
                                keykey={el[0].key_noakun}
                                changeKey={() =>
                                  changeKey(
                                    el[0].uid,
                                    el[0].key_noakun,
                                    "key_noakun"
                                  )
                                }
                                addRow={() =>
                                  newDataW(el[0].uid, el[0].type, "debet")
                                }
                                removeRow={() => removeDataW(el[0].uid)}
                              />
                            </div>
                            <TextField
                              fullWidth
                              placeholder="No Akun"
                              value={el[0].noakun}
                              name="noakun"
                              onChange={(e) => changeData(e, el[0].uid)}
                              inputProps={{
                                style: {
                                  fontSize: 14,
                                  textAlign: "center",
                                },
                              }}
                              InputProps={{
                                disableUnderline: true,
                              }}
                            />
                            {el[0].key_noakun && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-0"
                            />
                          </div>
                        )}
                      </td>
                      <td
                        className={`min-w-30v max-w-30v py-1 text-slate-700 border`}
                      >
                        {el[0].stat && el[0].head ? (
                          <div className="font-semibold pl-1">
                            {el[0].alias}
                          </div>
                        ) : (
                          <div
                            className={`relative ${
                              el[0].key_alias && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <TextField
                              fullWidth
                              placeholder="Nama Akun"
                              value={el[0].alias}
                              name="alias"
                              onChange={(e) => changeData(e, el[0].uid)}
                              inputProps={{
                                style: {
                                  fontSize: 14,
                                  paddingLeft: 5,
                                },
                              }}
                              InputProps={{
                                disableUnderline: true,
                              }}
                            />
                            <div className="absolute z-50 top-1 -right-1 flex items-center opacity-10 group-hover:opacity-80">
                              <PopMenuRowWorksheet17
                                keynamed="Nama Akun"
                                keykey={el[0].key_alias}
                                changeKey={() =>
                                  changeKey(
                                    el[0].uid,
                                    el[0].key_alias,
                                    "key_alias"
                                  )
                                }
                              />
                            </div>
                            {el[0].key_alias && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-7"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3.5"
                            />
                          </div>
                        )}
                      </td>
                      <td className="min-w-15v max-w-15v p-0 text-slate-700 border">
                        {el[0].stat && el[0].head ? (
                          <div></div>
                        ) : (
                          <div
                            className={`relative ${
                              el[0].key_value && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <TextField
                              fullWidth
                              placeholder="Rp -"
                              value={el[0].value}
                              name="value"
                              onChange={(e) => changeData(e, el[0].uid)}
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: el[0].value < 0 ? " Rp (" : "Rp ",
                                suffix: el[0].value < 0 ? ")" : "",
                                style: {
                                  textAlign: "center",
                                  fontSize: 14,
                                },
                              }}
                            />
                            <div className="absolute z-50 top-1 -right-1 flex items-center opacity-10 group-hover:opacity-80">
                              <PopMenuRowWorksheet17
                                keynamed="Nilai"
                                keykey={el[0].key_value}
                                changeKey={() =>
                                  changeKey(
                                    el[0].uid,
                                    el[0].key_value,
                                    "key_value"
                                  )
                                }
                              />
                            </div>
                            {el[0].key_value && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-6"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3"
                            />
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
                      <td className="min-w-15v max-w-15v py-0.5 text-center text-slate-700 border font-semibold">
                        {el[1].stattot && (
                          <div className="font-semibold bg-emerald-500 bg-opacity-20 py-1.5">
                            {numberFormat(
                              sumBy(ekuitas, (x) => Number(x.value))
                            )}
                          </div>
                        )}
                      </td>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <td
                        className={`min-w-10v max-w-10v p-0.5 text-slate-700 border`}
                      >
                        {el[1].stat && el[1].head ? (
                          <div className="font-semibold text-center">
                            {el[1].noakun}
                          </div>
                        ) : (
                          <div
                            className={`relative ${
                              el[1].key_noakun && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <div className="absolute z-50 top-1 -left-1 flex items-center">
                              <PopMenuRowWorksheet17
                                indx={i}
                                length={dictDat[el[1].type]}
                                keynamed="No Akun"
                                keykey={el[1].key_noakun}
                                changeKey={() =>
                                  changeKey(
                                    el[1].uid,
                                    el[1].key_noakun,
                                    "key_noakun"
                                  )
                                }
                                addRow={() =>
                                  newDataW(el[1].uid, el[1].type, "debet")
                                }
                                removeRow={() => removeDataW(el[1].uid)}
                              />
                            </div>
                            <TextField
                              fullWidth
                              placeholder="No Akun"
                              value={el[1].noakun}
                              name="noakun"
                              onChange={(e) => changeData(e, el[1].uid)}
                              inputProps={{
                                style: {
                                  fontSize: 14,
                                  textAlign: "center",
                                },
                              }}
                              InputProps={{
                                disableUnderline: true,
                              }}
                            />
                            {el[1].key_noakun && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-0"
                            />
                          </div>
                        )}
                      </td>
                      <td
                        className={`min-w-30v max-w-30v py-0.5 text-slate-700 border`}
                      >
                        {el[1].stat && el[1].head ? (
                          <div className="font-semibold pl-1">
                            {el[1].alias}
                          </div>
                        ) : (
                          <div
                            className={`relative ${
                              el[1].key_alias && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <TextField
                              fullWidth
                              placeholder="Nama Akun"
                              value={el[1].alias}
                              name="alias"
                              onChange={(e) => changeData(e, el[1].uid)}
                              inputProps={{
                                style: {
                                  fontSize: 14,
                                  paddingLeft: 5,
                                },
                              }}
                              InputProps={{
                                disableUnderline: true,
                              }}
                            />
                            <div className="absolute z-50 top-1 -right-1 flex items-center opacity-10 group-hover:opacity-80">
                              <PopMenuRowWorksheet17
                                keynamed="Nama Akun"
                                keykey={el[1].key_alias}
                                changeKey={() =>
                                  changeKey(
                                    el[1].uid,
                                    el[1].key_alias,
                                    "key_alias"
                                  )
                                }
                              />
                            </div>
                            {el[1].key_alias && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-7"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3.5"
                            />
                          </div>
                        )}
                      </td>
                      <td className="min-w-15v max-w-15v py-1 text-slate-700 border">
                        {el[1].stat && el[1].head ? (
                          <div className="font-semibold"></div>
                        ) : (
                          <div
                            className={`relative ${
                              el[1].key_value && "bg-emerald-500 bg-opacity-20"
                            }`}
                          >
                            <TextField
                              fullWidth
                              placeholder="Nama Akun"
                              value={el[1].value}
                              name="value"
                              onChange={(e) => changeData(e, el[1].uid)}
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: el[1].value < 0 ? " Rp (" : "Rp ",
                                suffix: el[1].value < 0 ? ")" : "",
                                style: {
                                  textAlign: "center",
                                  fontSize: 14,
                                },
                              }}
                            />
                            <div className="absolute z-50 top-1 -right-1 flex items-center opacity-10 group-hover:opacity-80">
                              <PopMenuRowWorksheet17
                                keynamed="Nilai"
                                keykey={el[1].key_value}
                                changeKey={() =>
                                  changeKey(
                                    el[1].uid,
                                    el[1].key_value,
                                    "key_value"
                                  )
                                }
                              />
                            </div>
                            {el[1].key_value && (
                              <VpnKeyIcon
                                style={{ fontSize: 12 }}
                                className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-6"
                              />
                            )}
                            <EditIcon
                              style={{ fontSize: 12 }}
                              className="text-blue-700 opacity-10 group-hover:opacity-40 absolute inset-y-0 right-3"
                            />
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
              <td className="min-w-15v max-w-15v py-0.5 text-center text-slate-700 border">
                <div className="font-semibold bg-emerald-500 bg-opacity-20 py-1.5">
                  {numberFormat(
                    sumBy(
                      filter(dataConfig.datawork, { posisi: "debet" }),
                      (x) => Number(x.value)
                    )
                  )}
                </div>
              </td>
              <td
                colSpan={2}
                className="border py-1.5 text-center uppercase font-semibold"
              >
                Jumlah Liabilitas dan Ekuitas
              </td>
              <td className="min-w-15v max-w-15v py-0.5 text-center text-slate-700 border">
                <div className="font-semibold bg-emerald-500 bg-opacity-20 py-1.5">
                  {numberFormat(
                    sumBy(
                      filter(dataConfig.datawork, { posisi: "kredit" }),
                      (x) => Number(x.value)
                    )
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
