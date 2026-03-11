import { filter } from "lodash";

export default function NotaKontanMhs(props) {
  const { itmnota } = props;
  const databarang = props.dataConfig.databarang;

  //format
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="w-full border-2 border-dashed">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-start-1 col-end-4  text-base">
          <div className="flex flex-col ml-5 mt-3 space-y-2">
            <p className="font-semibold text-2xl uppercase">
              {props.dataConfig ? props.dataConfig.cvname : ""}
            </p>
            <p className="text-base font-medium">
              {props.dataConfig ? props.dataConfig.cvalamat : ""}
            </p>
          </div>
        </div>
        <div className="col-end-10">
          <div className="flex flex-col mt-3 space-y-2 pr-5">
            <h1 className="text-2xl font-semibold">NOTA KONTAN</h1>
            <div className="flex">
              <label>
                No &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
              </label>
              <p className="text-base pl-2">{itmnota.no}</p>
            </div>
            <div className="flex">
              <label>Tanggal : </label>
              <p className="text-base pl-2">{itmnota.tgl}</p>
            </div>
          </div>
        </div>
      </div>
      {/* TABEL BARANG */}
      <div className="flex justify-center px-2 border-t mt-5">
        <table className="w-full border  text-center mx-2 my-6">
          <thead className="border-b">
            <tr>
              <th
                scope="col"
                className="font-semibold text-base text-slate-900 px-6 py-4 border-r"
              >
                Jumlah
              </th>
              <th
                scope="col"
                className="font-semibold text-base text-slate-900 px-6 py-4 border-r"
              >
                Uraian
              </th>
              <th
                scope="col"
                className="font-semibold text-base text-slate-900 px-6 py-4 border-r"
              >
                Harga per Unit
              </th>
              <th
                scope="col"
                className="font-semibold text-base text-slate-900 px-6 py-4"
              >
                Total
              </th>
            </tr>
          </thead>
          {/* ITEM BARANG LIST */}
          <tbody>
            {filter(databarang, { uid_invoice: itmnota.uid }).map(
              (ibrg, index) => {
                return (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-2 whitespace-nowrap text-base text-slate-900 border-r relative">
                      <p>{ibrg.jumlah}</p>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-base text-slate-900 border-r relative">
                      <p>{ibrg.namabarang}</p>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-base text-slate-900 border-r relative">
                      <p>{toRp(ibrg.harga)}</p>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-base text-slate-900 border-r relative">
                      {toRp(ibrg.total)}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
          <tbody>
            <tr className="border-b font-semibold">
              <td
                colSpan={3}
                className="text-sm text-right text-slate-900 font-semibold px-6 py-2 whitespace-nowrap border-r"
              >
                Subtotal
              </td>
              <td className="text-sm text-slate-900 font-semibold px-6 py-2 whitespace-nowrap">
                {toRp(itmnota.subtotal)}
              </td>
            </tr>
            <tr className="border-b">
              <td
                colSpan={3}
                className="text-sm text-right text-slate-900 font-semibold px-6 py-2 whitespace-nowrap border-r"
              >
                PPN
              </td>
              <td className="text-sm text-slate-900 font-semibold px-6 py-2 whitespace-nowrap">
                {toRp(itmnota.ppn)}
              </td>
            </tr>
            <tr className="border-b">
              <td
                colSpan={3}
                className="text-sm text-right text-slate-900 font-semibold px-6 py-2 whitespace-nowrap border-r"
              >
                Total
              </td>
              <td className="text-sm text-slate-900 font-semibold px-6 py-2 whitespace-nowrap">
                {toRp(itmnota.jumlah)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
