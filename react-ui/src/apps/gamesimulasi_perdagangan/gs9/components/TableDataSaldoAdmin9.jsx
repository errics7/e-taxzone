import NumberFormat from "react-number-format";
import { map, groupBy } from "lodash";

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

export default function TableDataSaldoAdmin9(props) {
  const { dataConfig } = props;

  const data = groupBy(dataConfig.datajurnal, "gen");
  const objJurnal = map(data, (obj, key) => {
    return { head: key, values: obj };
  });

  return (
    <div className="mt-0 overflow-x-auto border-collapse">
      <div className="mt-5 mb-2">Data Saldo :</div>
      <table className="border-collapse table-fixed">
        <thead>
          <tr>
            <th className="min-w-15v max-w-15v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Nama Pemasok
            </th>
            <th className="min-w-10v max-w-10v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Tanggal
            </th>
            <th className="min-w-15v max-w-15v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Keterangan
            </th>
            <th className="min-w-15v max-w-15v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Jumlah
            </th>
            <th className="min-w-10v max-w-10v px-1 py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Posisi
            </th>
          </tr>
        </thead>
        {objJurnal.map((el, i) => {
          return (
            <tbody key={i}>
              {el.values.map((item, index) => {
                return (
                  <tr key={index}>
                    {index === 0 && (
                      <td
                        rowSpan={el.values.length}
                        className="min-w-15v max-w-15v px-1 py-2 font-semibold text-center bg-slate-50 text-slate-600 border border-slate-300"
                      >
                        {item.namapemasok}
                      </td>
                    )}
                    <td className="min-w-15v max-w-15v px-0.5 py-0.5 text-center bg-slate-50 text-slate-600 border border-slate-300">
                      <div
                        className={
                          index !== 0
                            ? "bg-emerald-500 bg-opacity-40 py-1.5 px-0.5"
                            : " py-1.5"
                        }
                      >
                        {item.tgl}
                      </div>
                    </td>
                    <td className="min-w-15v max-w-15v px-0.5 py-0.5 bg-slate-50 text-slate-600 border border-slate-300">
                      <div
                        className={
                          index !== 0
                            ? "bg-emerald-500 bg-opacity-40 py-1.5 px-0.5"
                            : " py-1.5 px-0.5"
                        }
                      >
                        {item.keterangan}
                      </div>
                    </td>
                    <td className="min-w-15v max-w-15v px-0.5 py-0.5 bg-slate-50 text-slate-600 border border-slate-300 text-center">
                      <div
                        className={
                          index !== 0
                            ? "bg-emerald-500 bg-opacity-40 py-1.5 px-0.5"
                            : " py-1.5 px-0.5"
                        }
                      >
                        {index === 0
                          ? numberFormat(item.jumlah)
                          : numberFormat(item[item.key])}
                      </div>
                    </td>
                    <td className="min-w-10v max-w-10v capitalize text-center px-1 py-2 bg-slate-50 text-slate-600 border border-slate-300">
                      {item.posisi === "debit" || item.posisi === "debet"
                        ? "Debet"
                        : item.posisi}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}
