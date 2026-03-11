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

export default function TableAsetMhs12(props) {
  const { dataConfig } = props;

  return (
    <div className="relative mt-5">
      <div className="mt-2 mb-2 w-full">
        {props.dataConfig ? props.dataConfig.introsoal : " "}
      </div>
      <p className="text-base">
        {props.dataConfig ? props.dataConfig.introsoal1 : " "}
      </p>
      <div className="mt-1 mb-2 relative">
        {props.dataConfig ? props.dataConfig.introsoal1sub : " "}
      </div>
      <>
        <div className="overflow-x-auto border-collapse pb-1">
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th className="min-w-20v max-w-20v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Nama Aset
                </th>
                <th className="min-w-15v max-w-15v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Tanggal Perolehan
                </th>
                <th className="min-w-20v max-w-20v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Harga Perolehan
                </th>
                <th className="min-w-20v max-w-20v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Nilai Sisa
                </th>
                <th className="p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Masa Manfaat
                </th>
              </tr>
            </thead>
            <tbody>
              {dataConfig &&
                filter(dataConfig.databahan, { type: "aset" }).map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-t border-slate-300 "
                    >
                      <td className="px-3 py-2  text-slate-800 border border-b">
                        {item.keterangan}
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className="relative">{item.tgl}</div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        {numberFormat(item.perolehan)}
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        {item.keterangan.toLowerCase() === "tanah" ? (
                          <>&nbsp;</>
                        ) : (
                          <div className={`relative`}>
                            {item.nilaisisa === 0
                              ? ""
                              : numberFormat(item.nilaisisa)}
                          </div>
                        )}
                      </td>
                      <td className="px-1 py-2 text-slate-800 text-center border border-b">
                        {item.keterangan.toLowerCase() === "tanah" ? (
                          <>&nbsp;</>
                        ) : (
                          <div className={`relative flex justify-center`}>
                            {item.durasi}
                            <p className="pl-1">{item.satuanwaktu}</p>
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
