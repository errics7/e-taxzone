//#region 
//#endregion

export default function BuktiMemorialMhs14(props) {
  const config = props.dataConfig;
  const alokasi = props.alokasi;
  const dataInfo = props.dataInfo;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString();
  };

  return (
    <div className="border min-h-25v">
      <h1 className="mt-3 mx-auto text-center text-xl font-semibold">
        BUKTI MEMORIAL
      </h1>
      <div className="mx-auto text-sm text-center">
        <div>
          <div className="inline">NO. BM:</div>
          <div className="inline relative">{config ? config.nobm : ""}</div>
        </div>
        <div className="mt-3 mb-2 px-2 flex">
          <div className="inline">{config ? config.narasibuktimemo : ""}</div>
        </div>
      </div>
      <div>
        <div className="px-1">
          <table className="border-collapse w-full">
            <tbody>
              {alokasi.map((item, index) => { 
                return (
                  <tr key={index} className="group">
                    <td className="w-3/5 py-2 text-left border border-slate-300 table-cell">
                      <div className="relative pl-3">{item.keterangan}</div>
                    </td>
                    <td className="w-2/5 p-2 text-right border border-slate-300 table-cell">
                      <div className="relative">{toRp(item.nominal)}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/*  */}
        {/* Keterangan kode alokasi */}
        <div className="px-1 mt-10 mb-5 w-10/12">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="w-2/12 p-1.5 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Kode
                </th>
                <th className="w-4/12 p-1.5 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Debet (Rp)
                </th>
                <th className="w-2/12 p-1.5 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Kode
                </th>
                <th className="w-4/12 p-1.5 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Kredit (Rp)
                </th>
              </tr>
            </thead>
            <tbody>
              {dataInfo.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 group"
                  >
                    <td className="w-2/12 p-1.5 text-slate-800 text-center border border-b">
                      <div className="relative">{item.no_debit}</div>
                    </td>
                    <td className="w-4/12 py-1.5 text-slate-800 text-center border border-b">
                      <div className="relative pr-1">
                        {item.val_debit === 0 ? "" : toRp(item.val_debit)}
                      </div>
                    </td>
                    <td className="w-2/12 p-1.5 text-slate-800 text-center border border-b">
                      <div className="relative">{item.no_kredit}</div>
                    </td>
                    <td className="w-4/12 p-1.5 text-slate-800 text-center border border-b">
                      <div className="relative">
                        {item.val_kredit === 0 ? "" : toRp(item.val_kredit)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
