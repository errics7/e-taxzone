import NumberFormat from "react-number-format";

const numberFormat = (number) => {
  return (
    <NumberFormat
      value={number}
      prefix={"Rp "}
      displayType={"text"}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      renderText={(value, props) => <div {...props}>{value}</div>}
    />
  );
};

function TableMhs(props) {
  const data = props.data;
  const header1 = props.dataheader1;
  const header2 = props.dataheader2;

  const saldo = data && data.map((item) => item.hargabeli * item.stok);

  const totalSaldo = (dataSaldo) =>
    dataSaldo.reduce((saldoAwal, saldoAkhir) => saldoAwal + saldoAkhir, 0);

  return (
    <>
      <div className="text-center">{props.title}</div>
      <div className="mt-3 overflow-x-auto">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th className="min-w-7v max-w-7v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                No
              </th>
              <th className="min-w-7v max-w-7v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Kode
              </th>
              <th className="min-w-25v max-w-25v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Nama Barang
              </th>
              <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Harga Jual (Rp)
              </th>
              <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Harga Beli (Rp)
              </th>
              <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                {header1}
              </th>
              <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                {header2}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
              >
                <td className="px-1 py-2  text-slate-800 text-center border border-b">
                  {index + 1}
                </td>
                <td className="px-1 py-2  text-slate-800 text-center border border-b">
                  {item.kode ? (
                    item.kode
                  ) : (
                    <span className="opacity-30">Kode</span>
                  )}
                </td>
                <td className="px-1 py-2  text-slate-800 pl-3 border border-b">
                  <div className="relative">{item.namabarang}</div>
                </td>
                <td className="px-1 py-2  text-slate-800 text-center border border-b">
                  <div className="relative">{numberFormat(item.hargajual)}</div>
                </td>
                <td className="px-1 py-2  text-slate-800 text-center border border-b">
                  <div className="relative">{numberFormat(item.hargabeli)}</div>
                </td>
                <td className="px-1 py-2  text-slate-800 text-center border border-b">
                  <div className="relative">{item.stok}</div>
                </td>
                <td className="px-1 py-2  text-slate-800 text-center border border-b">
                  {numberFormat(item.stok * item.hargabeli)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan="6"
                className="bg-slate-50 py-2 font-semibold text-slate-600 border text-center"
              >
                Jumlah
              </td>
              <td className="bg-slate-50 font-semibold text-slate-600 border text-center">
                {numberFormat(totalSaldo(saldo))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default TableMhs;
