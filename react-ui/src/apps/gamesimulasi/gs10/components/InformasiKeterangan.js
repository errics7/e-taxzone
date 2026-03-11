import Tooltip from "@mui/material/Tooltip";

export default function InformasiKeterangan(props) {
  const data = props.data;
  const dataAlokasi = props.alokasi;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div>
      <span>Informasi Keterangan:</span>
      <table className="border-collapse w-full group">
        <thead>
          <tr>
            <th className="w-2/6 p-2 border table-cell"></th>
            <th className="w-2/6 p-2 border table-cell"></th>
            <th className="w-2/6 p-2 border table-cell">Alokasi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border table-cell">Nama Aset</td>
            <td className="p-2 text-right border table-cell">
              {data && data.perolehan}
            </td>
            <td className="p-2 border table-cell"></td>
          </tr>
          <tr>
            <td className="p-2 border table-cell">Harga Perolehan</td>
            <td className="p-2 text-right border table-cell">
              {data && toRp(data.hargaperolehan)}
            </td>
            <td className="p-2 border table-cell"></td>
          </tr>
          <tr>
            <td className="p-2 border table-cell">Nilai Sisa</td>
            <td className="p-2 text-right border table-cell">
              {data && toRp(data.nilaisisa)}
            </td>
            <td className="p-2 border table-cell"></td>
          </tr>
          <tr>
            <td className="p-2 border table-cell">Umur Ekonomis</td>
            <td className="p-2 text-right border table-cell">
              {data && data.umur}
            </td>
            <td className="p-2 border table-cell"></td>
          </tr>
          <tr>
            <td className="p-2 border table-cell">Penyusutan/ th</td>
            <td className="p-2 text-right border table-cell bg-emerald-50 group-hover:bg-emerald-100">
              <Tooltip
                title="Kunci Jawaban untuk Penyusutan/th"
                placement="right-start"
                arrow
              >
                <div>
                  {data &&
                    toRp((data.hargaperolehan - data.nilaisisa) / data.umur)}
                </div>
              </Tooltip>
            </td>
            <td className="p-2 border table-cell"></td>
          </tr>
        </tbody>
        <tbody>
          {dataAlokasi.map((item, index) => (
            <tr key={index}>
              <td className="p-2 border table-cell">
                {item.nama}
                <span className="opacity-30"> - {item.kodeacuan}</span>
              </td>
              <td className="p-2 text-right border table-cell">
                {item.nilai}%
              </td>
              <td className="p-2 border text-right table-cell bg-emerald-50 group-hover:bg-emerald-100">
                <Tooltip
                  title={`Kunci Jawaban untuk ${item.nama}`}
                  placement="right-start"
                  arrow
                >
                  <div>
                    {data &&
                      toRp(
                        ((data.hargaperolehan - data.nilaisisa) / data.umur) *
                          (item.nilai / 100)
                      )}
                  </div>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
