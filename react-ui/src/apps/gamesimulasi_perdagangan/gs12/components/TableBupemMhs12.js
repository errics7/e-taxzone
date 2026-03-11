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

export default function TableBupemMhs12(props) {
  const { dataConfig } = props;
  const bupm = filter(dataConfig.databahan, { type: "bupem" });
  const countDebit = [];

  return (
    <div className="relative mt-4">
      <p className="text-base pl-1">
        {props.dataConfig ? props.dataConfig.introsoal3 : " "}
      </p>
      <div className="mt-1 pl-1 mb-2 relative">
        {props.dataConfig ? props.dataConfig.introsoal3sub : " "}
      </div>
      <div className="px-1 py-2 pb-3 border border-dashed">
        <div className="mb-3 relative">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-start-1 col-end-4 flex text-base">
              <div className="flex items-center ml-3 mt-3 space-y-2 text-xl font-medium uppercase">
                {props.dataConfig ? props.dataConfig.cvname : " "}
              </div>
            </div>
            <div className="col-end-10">
              <div className="flex flex-col mt-3 space-y-2 pr-3">
                <h1 className="text-xl font-medium uppercase">
                  Buku Pembantu Piutang
                </h1>
                <div className="flex">
                  <label>Nama Pelanggan : </label>
                  <p className=" pl-2">
                    {props.dataConfig ? props.dataConfig.namapelanggan : " "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <>
          <div className="overflow-x-auto border-collapse">
            <table className="border-collapse min-w-full table-fixed">
              <thead>
                <tr>
                  <th
                    rowSpan="2"
                    className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Tanggal
                  </th>
                  <th
                    rowSpan="2"
                    className="min-w-20v max-w-20v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Keterangan
                  </th>
                  <th
                    rowSpan="2"
                    className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Ref
                  </th>
                  <th
                    rowSpan="2"
                    className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Debet
                  </th>
                  <th
                    rowSpan="2"
                    className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Kredit
                  </th>
                  <th
                    colSpan="2"
                    className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Saldo
                  </th>
                </tr>
                <tr>
                  <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Debet
                  </th>
                  <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Kredit
                  </th>
                </tr>
              </thead>
              <tbody>
                {bupm.map((element, index) => {
                  if (index === 0) {
                    //start
                    countDebit.push(element.jumlah);
                  } else {
                    //
                    const x = Number(element.debet) - Number(element.kredit);
                    countDebit.push(Number(countDebit[index - 1] + x));
                  }
                  //

                  return (
                    <tr
                      key={index}
                      className="bg-white border-t border-slate-300"
                    >
                      <td className="px-1 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                        <div className="relative">{element.tgl}</div>
                      </td>
                      <td className="px-1 py-2 text-slate-800 text-left border border-b">
                        {index === 0 ? (
                          <div className={`px-2`}>{element.keterangan}</div>
                        ) : (
                          <div className="px-2">{element.keterangan}</div>
                        )}
                      </td>
                      <td className="pl-2 py-2 min-w-15v max-w-15v text-slate-800 border border-b">
                        {index === 0 ? (
                          <>&nbsp;</>
                        ) : (
                          <div className="relative">{element.ref}</div>
                        )}
                      </td>
                      <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                        <div className="relative">
                          {index === 0 ? (
                            <>&nbsp;</>
                          ) : (
                            <div className="relative">
                              {element.debet === 0
                                ? ""
                                : numberFormat(element.debet)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                        {index === 0 ? (
                          <>&nbsp;</>
                        ) : (
                          <div className="relative">
                            {element.kredit === 0
                              ? ""
                              : numberFormat(element.kredit)}
                          </div>
                        )}
                      </td>
                      <td className="px-1 py-2 min-w-15v max-w-15v  text-slate-800 text-center border border-b">
                        {index === 0 ? (
                          <div className="relative">
                            {numberFormat(element.jumlah)}
                          </div>
                        ) : (
                          <div className="relative">
                            {numberFormat(countDebit[index])}
                          </div>
                        )}
                      </td>
                      <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                        <div className="relative">&nbsp;</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      </div>
    </div>
  );
}
