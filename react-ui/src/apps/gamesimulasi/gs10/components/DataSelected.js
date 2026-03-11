export default function dataSelected(props) {
  const data = props.data;

  return (
    <>
      Data Akun:
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="w-1/5 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
              Kode
            </th>
            <th className="w-3/5 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
              Nama Akun
            </th>
            <th className="w-1/5 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
              Jenis
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((data, i) => (
            <tr key={i}>
              <td className="p-2 text-center border border-slate-300 table-cell">
                {data.code}
              </td>
              <td className="p-2 text-left border border-slate-300 table-cell">
                {data.name}
              </td>
              <td className="p-2 text-center border border-slate-300 table-cell">
                {data.jenis}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="min-h-20v flex items-center justify-center border-2 border-red-300">
          <p className="text-red-500 font-extrabold">Belum Ada akun Aktif terpilih</p>
        </div>
      )}
    </>
  );
}
