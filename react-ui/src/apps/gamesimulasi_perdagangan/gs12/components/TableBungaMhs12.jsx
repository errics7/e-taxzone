import { filter } from "lodash";
import NumberFormat from "react-number-format";

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

export default function TableBungaMhs12(props) {
  const { dataConfig } = props;

  return (
    <div className="relative mt-3">
      <p className="text-base mb-2 pl-0.5">
        {props.dataConfig ? props.dataConfig.introsoal2 : " "}
      </p>
      <>
        <div className="overflow-x-auto border-collapse pb-1">
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th className="min-w-20v max-w-20v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Tanggal
                </th>
                <th className="min-w-15v max-w-15v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Pemberi Pinjaman
                </th>
                <th className="min-w-20v max-w-20v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jumlah
                </th>
                <th className="min-w-20v max-w-20v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jangka Waktu
                </th>
                <th className="min-w-20v max-w-20v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Bunga Tahunan
                </th>
              </tr>
            </thead>
            <tbody>
              {dataConfig &&
                filter(dataConfig.databahan, { type: "bunga" }).map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-t border-slate-300"
                    >
                      <td className="px-1 py-2 text-slate-800 text-center border border-b">
                        {item.tgl}
                      </td>
                      <td className="px-3 py-2 text-slate-800 border border-b">
                        {item.keterangan}
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        {numberFormat(item.jumlah)}
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className={`relative flex justify-center`}>
                          {item.durasi}
                          <p className="pl-1">{item.satuanwaktu}</p>
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        {item.keterangan.toLowerCase() === "tanah" ? (
                          <>&nbsp;</>
                        ) : (
                          <div className={`relative flex justify-center`}>
                            {item.bungath}
                            <p className="pl-1">%</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
}
