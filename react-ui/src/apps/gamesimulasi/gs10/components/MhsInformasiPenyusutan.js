export default function MhsInformasiPenyusutan(props) {
  const data = props.data && props.data.config;
  const alokasi = props.data ? props.data.dataalokasi : [];

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="mt-1">
      <span>Informasi Penyusutan:</span>
      <table className="border-collapse w-full">
        <tbody>
          <tr>
            <td className="w-2/6 p-1 px-3 border-t border-l  table-cell">
              Harga Perolehan
            </td>
            <td className="w-2/6 p-1 border-t table-cell">
              : {data ? data.perolehan : ""}
            </td>
            <td className="w-2/6 p-2 border table-cell">
              <div className="relative px-1">
                {data ? toRp(data.hargaperolehan) : ""}
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="w-2/6 p-1 px-3 border table-cell">
              Nilai sisa
            </td>
            <td className="w-2/6 p-2 border table-cell">
              <div className="relative px-1">
                {data ? toRp(data.nilaisisa) : ""}
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="w-2/6 p-1 px-3 border table-cell">
              Umur ekonomis (tahun)
            </td>
            <td className="w-2/6 p-2 border table-cell">
              <div className="relative px-1">{data ? data.umur : ""}</div>
            </td>
          </tr>
          <tr>
            <td colSpan="3" className="w-2/6 p-1 px-3 border table-cell">
              Alokasi :
            </td>
          </tr>
        </tbody>
        <tbody>
          {alokasi.map((item, index) => (
            <tr key={index}>
              <td className="w-2/6 p-1 px-3 border-l border-b border-r table-cell"></td>
              <td className="w-2/6 p-1 px-3 border table-cell">
                <div className="relative">{item.nama}</div>
              </td>
              <td className="w-2/6 p-2 px-3 border table-cell">
                {item.nilai}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
