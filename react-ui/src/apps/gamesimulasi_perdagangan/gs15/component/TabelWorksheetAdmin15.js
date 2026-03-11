import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { filter, find, map, sumBy } from "lodash";

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

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
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
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function TabelWorksheetAdmin15(props) {
  const { dataConfig, setdataConfig } = props; 

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
        <h1 className="text-xl text-center">LAPORAN LABA/RUGI</h1>
        <div className="text-xl relative">
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
            {map(
              filter(dataConfig.datanilai, { key: true, type: "kredit" }),
              (el, index) => {
                const cari = find(dataConfig.dataakun, { uid: el.idr });
                return (
                  <tr key={index} className="border">
                    <td className="min-w-7v max-w-7v p-0.5 whitespace-nowrap text-center text-slate-900 border-r relative">
                      <div className="bg-amber-200 p-1.5">{cari.noakun}</div>
                    </td>
                    <td className="min-w-20v max-w-20v p-0.5 whitespace-nowrap text-slate-900 border-r relative">
                      <div className="bg-amber-200 p-1.5 pl-2">
                        {cari.alias}
                      </div>
                    </td>
                    <td className="min-w-10v max-w-10v py-2 whitespace-nowrap  text-slate-900 border-r relative">
                      {/* {el.noakun} */}
                    </td>
                    <td className="min-w-10v max-w-10v p-0.5 whitespace-nowrap text-center text-slate-900 border-r relative">
                      <div className="bg-amber-200 p-1.5">
                        {Number(el.value) === 0 ? "-" : numberFormat(el.value)}
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
            <tr>
              <td colSpan={4}>
                <div className="px-3 py-0.5 text-base text-slate-900">
                  <div className="pt-2">Beban-beban :</div>
                </div>
              </td>
            </tr>
            {map(
              filter(dataConfig.datanilai, { key: true, type: "debet" }),
              (el, index) => {
                const cari = find(dataConfig.dataakun, { uid: el.idr });

                return (
                  <tr key={index} className="border">
                    <td className="min-w-7v max-w-7v p-0.5 whitespace-nowrap text-center text-slate-900 border-r relative">
                      <div className="bg-amber-200 p-1.5">{cari.noakun}</div>
                    </td>
                    <td className="min-w-20v max-w-20v p-0.5 whitespace-nowrap text-slate-900 border-r relative">
                      <div className="bg-amber-200 p-1.5 pl-2">
                        {cari.alias}
                      </div>
                    </td>
                    <td className="min-w-10v max-w-10v p-0.5 whitespace-nowrap text-center text-slate-900 border-r relative">
                      <div className="bg-amber-200 p-1.5">
                        {Number(el.value) === 0 ? "-" : numberFormat(el.value)}
                      </div>
                    </td>
                    <td className="min-w-10v max-w-10v py-2 whitespace-nowrap text-center text-slate-900 border-r relative">
                      {/* {el.noakun} */}
                    </td>
                  </tr>
                );
              }
            )}
            <tr className="border">
              <td className="min-w-7v max-w-7v py-2 whitespace-nowrap text-center text-slate-900 border-r relative"></td>
              <td className="min-w-20v max-w-20v py-2 pl-2 whitespace-nowrap font-semibold text-slate-900 border-r relative">
                Total Beban
              </td>
              <td className="min-w-10v max-w-10v py-2 text-slate-900 border-t-2 border-black"></td>
              <td className="min-w-10v max-w-10v p-0.5 whitespace-nowrap text-center text-slate-900 border-r relative">
                <div className="bg-amber-200 p-1.5">
                  {numberFormat(
                    sumBy(
                      filter(dataConfig.datanilai, {
                        key: true,
                        type: "debet",
                      }),
                      (x) => Number(x.value)
                    )
                  )}
                </div>
              </td>
            </tr>
            <tr className="border">
              <td className="min-w-7v max-w-7v py-2 whitespace-nowrap text-center text-slate-900 border-r relative"></td>
              <td className="min-w-20v max-w-20v py-2 pl-2 whitespace-nowrap font-semibold text-slate-900 border-r relative">
                Laba Bersih (Sebelum Pajak)
              </td>
              <td className="min-w-10v max-w-10v py-2 whitespace-nowrap text-slate-900"></td>
              <td className="min-w-10v max-w-10v p-0.5 text-slate-900 border-t-2 border-black text-center">
                <div className="bg-amber-200 p-1.5 font-semibold">
                  {numberFormat(
                    sumBy(
                      filter(dataConfig.datanilai, {
                        key: true,
                        type: "kredit",
                      }),
                      (x) => Number(x.value)
                    ) -
                      sumBy(
                        filter(dataConfig.datanilai, {
                          key: true,
                          type: "debet",
                        }),
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
