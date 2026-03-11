export default function TabelInfoKreditDebitMhs(props) {
  // Filter
  const dataDaa = props.data.filter((x) => "debit" === x.posisi);
  const dataKaa = props.data.filter((x) => "kredit" === x.posisi);
  const panjang =
    dataDaa.length > dataKaa.length
      ? [...Array(dataDaa.length)]
      : [...Array(dataKaa.length)];
  const data = panjang.map((element, i) => ({
    debit: dataDaa[i]
      ? {
          kode: dataDaa[i].kode,
          nilai: dataDaa[i].nilai,
        }
      : null,
    kredit: dataKaa[i]
      ? {
          kode: dataKaa[i].kode,
          nilai: dataKaa[i].nilai,
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
          {data.map((item, index) => (
            <tr
              key={index}
              className="bg-white border-t border-slate-300"
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
