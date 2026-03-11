import { sumBy, filter } from "lodash";

export default function TabelSoalPrev(props) {
  const { data } = props;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <>
      <table className="border-collapse w-full col-span-8">
        <thead>
          <tr>
            <th className="w-4/12 p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200 lg:table-cell">
              Pemasok
            </th>
            <th className="w-3/12 p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200 lg:table-cell">
              Tanggal Beli
            </th>
            <th className="w-3/12 p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200 lg:table-cell">
              Jumlah
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            filter(data, { jenis: "hutang" }).map((item, index) => (
              <tr
                key={index}
                className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
              >
                <td className="lg:w-auto p-1 text-slate-800 text-center border border-b table-cell relative">
                  <div className="relative">{item.name}</div>
                </td>
                <td className="lg:w-auto p-1 text-slate-800 text-center border border-b table-cell relative">
                  <div className="relative">{item.tgl}</div>
                </td>
                <td className="lg:w-auto p-1  text-slate-800 text-center border border-b table-cell relative">
                  <div className="relative">{toRp(item.jumlah)}</div>
                </td>
              </tr>
            ))}
          <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 font-semibold">
            <td
              colSpan={2}
              className="lg:w-auto p-1 text-slate-800 text-center border border-b table-cell relative"
            >
              Jumlah
            </td>
            <td className="lg:w-auto p-1  text-slate-800 text-center border border-b table-cell relative">
              <div className="relative">
                {toRp(
                  sumBy(filter(data, { jenis: "hutang" }), (r) =>
                    Number(r.jumlah)
                  )
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="border-collapse w-full col-span-8 mt-5 mb-3">
        <thead>
          <tr>
            <th className="w-4/12 p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200 lg:table-cell">
              Pelanggan
            </th>
            <th className="w-3/12 p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200 lg:table-cell">
              Tanggal Jual
            </th>
            <th className="w-3/12 p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200 lg:table-cell">
              Jumlah
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            filter(data, { jenis: "piutang" }).map((item, index) => (
              <tr
                key={index}
                className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
              >
                <td className="lg:w-auto p-1 text-slate-800 text-center border border-b table-cell relative">
                  <div className="relative">{item.name}</div>
                </td>
                <td className="lg:w-auto p-1 text-slate-800 text-center border border-b table-cell relative">
                  <div className="relative">{item.tgl}</div>
                </td>
                <td className="lg:w-auto p-1  text-slate-800 text-center border border-b table-cell relative">
                  <div className="relative">{toRp(item.jumlah)}</div>
                </td>
              </tr>
            ))}
          <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 font-semibold">
            <td
              colSpan={2}
              className="lg:w-auto p-1 text-slate-800 text-center border border-b table-cell relative"
            >
              Jumlah
            </td>
            <td className="lg:w-auto p-1  text-slate-800 text-center border border-b table-cell relative">
              <div className="relative">
                {toRp(
                  sumBy(filter(data, { jenis: "piutang" }), (r) =>
                    Number(r.jumlah)
                  )
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
