export default function TabelInfoBahanMhs(props) {
  const data = props.selected ? props.selected : null;

  return (
    <>
        
      <div className="grid grid-cols-12 overflow-x-auto">
        <table className="border-collapse w-full col-span-8">
          <thead>
            <tr>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"></th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Akutansi
              </th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Penerima Bahan
              </th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Bagian Gudang
              </th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Kepala Bagian
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-t border-slate-300 ">
              <td className="min-w-10v max-w-10v p-3 text-slate-800 text-left border border-b relative">
                Tanggal
              </td>
              <td className="min-w-10v max-w-10v p-0 text-left border border-b"></td>
              <td className="min-w-15v max-w-15v p-3 text-slate-800 text-center border border-b relative">
                {data && data.config.info_tglpbahan}
              </td>
              <td className="min-w-15v max-w-15v p-3 text-slate-800 text-center border border-b relative">
                {data && data.config.info_tglbgudang}
              </td>
              <td className="min-w-15v max-w-15v p-3 text-slate-800 text-center border border-b relative">
                {data && data.config.info_tglkbagian}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
