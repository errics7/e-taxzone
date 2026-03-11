import { v4 as uuidv4 } from "uuid";
import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format"; 
import { filter, find, findIndex, map, remove, sumBy } from "lodash";
import { TextField } from "@mui/material";
import { InputGrowUpTextWithName } from "../../componentglobal/inputGrowUpTextWithName";
import PopMenuRowWorksheet16 from "./PopMenuRowWorksheet16";
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

export default function TabelWorksheetAdmin16(props) {
  const { dataConfig, setdataConfig } = props;
  const dataAdd = filter(dataConfig.datawork, { type: "add" });
  const dataMin = filter(dataConfig.datawork, { type: "min" });

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
  const newDataW = (uid, type) => {
    const idx = findIndex(dataConfig.datawork, { uid: uid });
    const list = [...dataConfig.datawork];
    list.splice(idx + 1, 0, {
      uid: uuidv4(),
      alias: "",
      value: 0,
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

  return (
    <div className="border overflow-x-auto max-w-4xl">
      <div className="my-4 flex flex-col items-center relative">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.cvname : ""}
            className={"font-semibold uppercase"}
            onChange={(text) => setdataConfig({ ...dataConfig, cvname: text })}
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute p-0.5 -inset-y-1 -right-0 opacity-30"
          />
        </div>
        <h1 className="text-xl text-center">LAPORAN PERUBAHAN EKUITAS</h1>
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
      <div className="w-full border-t-2 px-2 pt-3 pb-2">
        <table className="w-full">
          <tbody>
            {map(
              filter(dataConfig.datawork, { type: "ekuitasawal" }),
              (el, i) => (
                <tr key={i}>
                  <td
                    colSpan={3}
                    className="text-base font-semibold text-slate-900"
                  >
                    <InputGrowUpTextWithName
                      icon={true}
                      name="alias"
                      type="text"
                      style={`-ml-1 text-base font-semibold text-slate-900`}
                      placeholder="Ekuitas Per -- --- ----"
                      value={el.alias}
                      index={1}
                      onChange={(e) => changeData(e, el.uid)}
                    />
                  </td>
                  <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                    <div
                      className={`p-1 ${
                        el.value !== 0 && "bg-emerald-500 bg-opacity-50"
                      }`}
                    >
                      <TextField
                        placeholder="Rp        -   "
                        name="value"
                        value={el.value === 0 ? "" : el.value}
                        onChange={(e) => changeData(e, el.uid)}
                        fullWidth
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                        inputProps={{
                          prefix: "Rp ",
                          style: {
                            textAlign: "center",
                            fontSize: 13,
                          },
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-2 opacity-30 group-hover:opacity-70"
                      />
                    </div>
                  </td>
                </tr>
              )
            )}
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
                    <div className="absolute z-50 inset-y-0 left-0 flex items-center">
                      <PopMenuRowWorksheet16
                        length={dataAdd.length}
                        addRow={() => newDataW(el.uid, "add")}
                        removeRow={() => removeDataW(el.uid)}
                      />
                    </div>
                    <TextField
                      placeholder="Isi Keterangan"
                      name="alias"
                      value={el.alias}
                      onChange={(e) => changeData(e, el.uid)}
                      fullWidth
                      inputProps={{
                        style: {
                          paddingBottom: 5,
                          paddingLeft: 5,
                          fontSize: 14,
                        },
                      }}
                    />
                  </td>
                  <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                    <div
                      className={`p-1 ${
                        el.value !== 0 && "bg-emerald-500 bg-opacity-50"
                      }`}
                    >
                      <TextField
                        placeholder="Rp        -   "
                        name="value"
                        value={el.value === 0 ? "" : el.value}
                        onChange={(e) => changeData(e, el.uid)}
                        fullWidth
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                        inputProps={{
                          prefix: "Rp ",
                          style: {
                            textAlign: "center",
                            fontSize: 13,
                          },
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-2 opacity-30 group-hover:opacity-70"
                      />
                    </div>
                  </td>
                  <td className="min-w-10v max-w-10v whitespace-nowrap  text-slate-900 relative"></td>
                  <td className="min-w-10v max-w-10v whitespace-nowrap  text-slate-900 relative"></td>
                </tr>
              );
            })}
            <tr>
              <td className="min-w-30v max-w-30v p-0 pl-4 whitespace-nowrap text-slate-900">
                <div className="p-1">Total Penambahan</div>
              </td>
              <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                <div className="p-1">&nbsp;</div>
              </td>
              <td className="min-w-10v max-w-10v p-1 bg-emerald-500 bg-opacity-50 whitespace-nowrap text-center text-slate-900 relative">
                <div className={`p-0.5 border-b border-slate-500`}>
                  {numberFormat(
                    sumBy(filter(dataConfig.datawork, { type: "add" }), (x) =>
                      Number(x.value)
                    )
                  )}
                </div>
              </td>
              <td className="min-w-10v max-w-10v whitespace-nowrap  text-slate-900 relative"></td>
            </tr>
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
                    <div className="absolute z-50 inset-y-0 left-0 flex items-center">
                      <PopMenuRowWorksheet16
                        length={dataMin.length}
                        addRow={() => newDataW(el.uid, "min")}
                        removeRow={() => removeDataW(el.uid)}
                      />
                    </div>
                    <TextField
                      placeholder="Isi Keterangan"
                      name="alias"
                      value={el.alias}
                      onChange={(e) => changeData(e, el.uid)}
                      fullWidth
                      inputProps={{
                        style: {
                          paddingBottom: 5,
                          paddingLeft: 5,
                          fontSize: 14,
                        },
                      }}
                    />
                  </td>
                  <td className="min-w-10v max-w-10v py-0.5 whitespace-nowrap text-slate-900 relative">
                    <div className="p-1 border-b ">&nbsp;</div>
                  </td>
                  <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                    <div
                      className={`p-1 ${
                        el.value !== 0 && "bg-emerald-500 bg-opacity-50"
                      }`}
                    >
                      <TextField
                        placeholder="Rp        -   "
                        name="value"
                        value={el.value === 0 ? "" : el.value}
                        onChange={(e) => changeData(e, el.uid)}
                        fullWidth
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                        inputProps={{
                          prefix: "Rp ",
                          style: {
                            textAlign: "center",
                            fontSize: 13,
                          },
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-2 opacity-30 group-hover:opacity-70"
                      />
                    </div>
                  </td>
                  <td className="min-w-10v max-w-10v whitespace-nowrap  text-slate-900 relative"></td>
                </tr>
              );
            })}
            <tr>
              <td className="min-w-30v max-w-30v p-0 pl-4 whitespace-nowrap text-slate-900">
                &nbsp;
              </td>
              <td className="min-w-10v max-w-10v p-0 whitespace-nowrap text-center text-slate-900 relative">
                &nbsp;
              </td>
              <td className="min-w-10v max-w-10v whitespace-nowrap  text-slate-900 relative"></td>
              <td className="min-w-10v max-w-10v p-1 bg-emerald-500 bg-opacity-50 whitespace-nowrap text-center text-slate-900 relative">
                <div className={`p-0.5 border-b border-slate-500`}>
                  {numberFormat(
                    sumBy(filter(dataConfig.datawork, { type: "add" }), (x) =>
                      Number(x.value)
                    ) -
                      sumBy(filter(dataConfig.datawork, { type: "min" }), (x) =>
                        Number(x.value)
                      )
                  )}
                </div>
              </td>
            </tr>
            {map(
              filter(dataConfig.datawork, { type: "ekuitasakhir" }),
              (el, i) => (
                <tr key={i}>
                  <td
                    colSpan={3}
                    className="text-base font-semibold text-slate-900"
                  >
                    <InputGrowUpTextWithName
                      icon={true}
                      name="alias"
                      type="text"
                      style={`-ml-1 text-base font-semibold text-slate-900`}
                      placeholder="Ekuitas Per -- --- ----"
                      value={el.alias}
                      index={1}
                      onChange={(e) => changeData(e, el.uid)}
                    />
                  </td>
                  <td className="min-w-10v max-w-10v p-1 bg-emerald-500 bg-opacity-50 whitespace-nowrap text-center text-slate-900 relative">
                    <div className={`p-0.5 border-b border-slate-500`}>
                      {numberFormat(
                        sumBy(
                          filter(dataConfig.datawork, { type: "add" }),
                          (x) => Number(x.value)
                        ) -
                          sumBy(
                            filter(dataConfig.datawork, { type: "min" }),
                            (x) => Number(x.value)
                          ) +
                          find(dataConfig.datawork, { type: "ekuitasawal" })
                            .value
                      )}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
