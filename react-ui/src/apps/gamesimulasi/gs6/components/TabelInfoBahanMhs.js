export default function TabelInfoBahanMhs(props) {
  const data = props.data;

  return (
    <div className="w-full lg:w-6/12 overflow-x-auto">
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"></th>
            <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Akutansi
            </th>
            <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Penerima Bahan
            </th>
            <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Bagian Gudang
            </th>
            <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Kepala Bagian
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-t border-slate-300">
            <td className="lg:w-auto p-3 text-slate-800 text-left border border-b">
              Tanggal
            </td>
            <td className="p-0 text-left border border-b"></td>
            <td className="lg:w-auto p-3 text-slate-800 text-center border border-b">
              {data ? data.tgl_penerimabahan : ""}
            </td>
            <td className="lg:w-auto p-3 text-slate-800 text-center border border-b">
              {data ? data.tgl_bagiangudang : ""}
            </td>
            <td className="lg:w-auto p-3 text-slate-800 text-center border border-b">
              {data ? data.tgl_kepalabagian : ""}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
