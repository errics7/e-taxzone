function TableHppMhs(props) {
  const { databarang } = props.dataConfig;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div>
      <div className="mt-2 relative">
        <p>{props.dataConfig && props.dataConfig.narasibarang}</p>
      </div>
      <table className="border-collapse mt-3 mb-5">
        <thead>
          <tr>
            <th className="min-w-20v max-w-20v font-bold bg-slate-50 text-slate-600 border border-slate-300 p-2">
              Nama Barang
            </th>
            <th className="min-w-20v max-w-20v  font-bold bg-slate-50 text-slate-600 border border-slate-300 p-2">
              HPP per satuan
            </th>
          </tr>
        </thead>
        <tbody>
          {databarang.map((item, i) => {
            return (
              <tr key={i}>
                <td className="p-2 pl-3 border border-slate-300 table-cell">
                  {item.namabarang}
                </td>
                <td className="p-2 text-center border border-slate-300 table-cell">
                  <div className="relative">{toRp(item.hpp)}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TableHppMhs;
