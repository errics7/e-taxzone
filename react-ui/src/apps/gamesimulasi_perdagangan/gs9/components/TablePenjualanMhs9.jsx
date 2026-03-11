import NumberFormat from "react-number-format";
import { filter, sumBy } from "lodash";

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

export default function TablePenjualanMhs9(props) {
  const { dataConfig } = props;

  return (
    <div className="relative mt-5">
      <div className="mt-2 mb-2 relative">
        <p className="w-full p-1">
          {props.dataConfig ? props.dataConfig.intropembelian : " "}
        </p>
      </div>
      <div className="flex flex-col items-center font-bold">
        <div className="text-xl relative">
          <p className={"font-semibold uppercase"}>
            {dataConfig ? dataConfig.cvname : ""}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center mb-1">
        <div className="text-lg font-semibold relative uppercase">
          Jurnal pembelian
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-xl relative">
          <p className={"font-semibold tracking-wider"}>
            {dataConfig ? dataConfig.tblworkname : ""}
          </p>
        </div>
      </div>
      <>
        <div className="mt-3 overflow-x-auto border-collapse border pb-1">
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th
                  rowSpan="3"
                  className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Tanggal
                </th>
                <th
                  rowSpan="3"
                  className="min-w-25v max-w-25v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Keterangan <br />
                  (Nama Pemasok)
                </th>
                <th
                  rowSpan="3"
                  className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  No. Faktur
                </th>
                <th
                  colSpan="2"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Debet
                </th>
                <th
                  colSpan="1"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Kredit
                </th>
              </tr>
              <tr>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Persediaan
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  PPN Masukan
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Hutang Dagang
                </th>
              </tr>
              <tr>
                {["115", "116", "210"].map((item, index) => {
                  //   const dat = find(dataConfig.dataakun, { name: item });
                  return (
                    <th
                      key={index}
                      className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                    >
                      {/* {dat && dat.noakun} */}
                      {item}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {dataConfig &&
                filter(dataConfig.datajurnal, { type: "jurnal pembelian" }).map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                    >
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className="relative">{item.tgl}</div>
                      </td>
                      <td className="pl-3 pr-1 py-2  text-slate-800 text-left border border-b">
                        <div className="relative">{item.namapemasok}</div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className="relative">{item.no}</div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className={`relative`}>
                          {numberFormat(item.persediaan)}
                        </div>
                      </td>
                      <td className=" text-slate-800 text-center border border-b">
                        <div className={`relative`}>
                          {numberFormat(item.ppnmasukan)}
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className={`relative`}>
                          {numberFormat(item.hutangdagang)}
                        </div>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
            <tfoot>
              <tr>
                <td className="p-1 font-bold text-slate-600 border border-slate-300">
                  &nbsp;
                </td>
                <td className="p-1 font-bold text-slate-600 border border-slate-300">
                  &nbsp;
                </td>
                <td className="p-1 font-bold text-slate-600 border border-slate-300">
                  &nbsp;
                </td>
                <td className="p-1 font-bold text-slate-600 border border-slate-300">
                  &nbsp;
                </td>
                <td className="p-1 font-bold text-slate-600 border border-slate-300">
                  &nbsp;
                </td>
                <td className="p-1 font-bold text-slate-600 border border-slate-300">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td
                  colSpan="3"
                  className="px-10 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-right"
                >
                  Jumlah
                </td>
                {["persediaan", "ppnmasukan", "hutangdagang"].map(
                  (item, index) => {
                    //   const dat = find(dataConfig.dataakun, { name: item });
                    return (
                      <th
                        key={index}
                        className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center"
                      >
                        {numberFormat(
                          sumBy(
                            filter(dataConfig.datajurnal, {
                              type: "jurnal pembelian",
                            }),
                            item
                          )
                        )}
                      </th>
                    );
                  }
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    </div>
  );
}
