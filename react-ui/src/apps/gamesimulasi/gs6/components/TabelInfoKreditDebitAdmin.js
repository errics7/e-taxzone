export default function TabelInfoKreditDebitAdmin(props) {
  const data = props.data;
  // Filter
  const dataD = data.filter((x) => "debit" === x.posisi);
  const dataK = data.filter((x) => "kredit" === x.posisi);

  const panjang =
    dataD.length > dataK.length
      ? [...Array(dataD.length)]
      : [...Array(dataK.length)];
  const datafinal = panjang.map((element, i) => ({
    debit: dataD[i]
      ? {
          kode: dataD[i].kode,
          nilai: dataD[i].nilai,
        }
      : null,
    kredit: dataK[i]
      ? {
          kode: dataK[i].kode,
          nilai: dataK[i].nilai,
        }
      : null,
  }));

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  // console.log(datafinal);

  return (
    <div className={props.className}>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Kode
            </th>
            <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Debet (Rp)
            </th>
            <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Kode
            </th>
            <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Kredit (Rp)
            </th>
          </tr>
        </thead>
        <tbody>
          {datafinal.map((item, index) => (
            <tr
              key={index}
              className="bg-white border-t border-slate-300 lg:hover:bg-slate-100"
            >
              <td className="lg:w-auto p-3 text-slate-800 text-center border border-b">
                {item.debit && item.debit.kode}
              </td>
              <td className="lg:w-auto p-3 text-slate-800 text-center border border-b">
                {item.debit && toRp(item.debit.nilai)}
              </td>
              <td className="lg:w-auto p-3 text-slate-800 text-center border border-b">
                {item.kredit && item.kredit.kode}
              </td>
              <td className="lg:w-auto p-3 text-slate-800 text-center border border-b">
                {item.kredit && toRp(item.kredit.nilai)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
