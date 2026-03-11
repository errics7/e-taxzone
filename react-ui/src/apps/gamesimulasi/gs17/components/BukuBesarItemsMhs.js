//#region
// import Tooltip from "@mui/material/Tooltip";
//#endregion

export default function BukuBesarItemsMhs(props) {
  const databb = props.item;
  const dataAkun = props.dataAkun;
  const data = dataAkun.filter((x) => x.cuid === databb.uuid);

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  //#region total saldo
  var deb = 0;
  var kre = 0;
  const tsaldo = [];
  data.forEach((el) => {
    deb += Number(el.debit);
    kre += Number(el.kredit);
    tsaldo.push({
      debit: deb,
      kredit: kre,
    });
  });
  //#endregion

  return (
    <div className="flex flex-col border border-dashed p-2 mt-3">
      <div className="flex justify-center items-center">
        <h1 className="text-center uppercase font-semibold text-base">
          Buku Besar
        </h1>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span>Nama Akun : </span>
          <div className="inline pr-2 relative">{databb.namaakun}</div>
        </div>
        <div className="flex items-center">
          <span>Kode : </span>
          <div className=" pl-2 relative w-24">{databb.kode}</div>
        </div>
      </div>
      <div className="pt-2">
        <table className="border-collapse w-full">
          <thead className="font-semibold">
            <tr className="text-slate-600">
              <th
                rowSpan="2"
                colSpan="2"
                className="min-w-10v max-w-10v border"
              >
                Tanggal
              </th>
              <th rowSpan="2" className="min-w-15v max-w-15v border">
                Keterangan
              </th>
              <th rowSpan="2" className="min-w-5v max-w-5v border">
                Ref
              </th>
              <th rowSpan="2" className="min-w-10v max-w-10v border">
                Debit
              </th>
              <th rowSpan="2" className="min-w-10v max-w-10v border">
                Kredit
              </th>
              <th colSpan="2" className="border py-1">
                Saldo
              </th>
            </tr>
            <tr className="text-slate-600">
              <th className="min-w-10v max-w-10v border py-1">Debit</th>
              <th className="min-w-10v max-w-10v border py-1">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="border text-center min-w-3v max-w-3v relative">
                    <div className="w-12 mx-auto">
                      {index === 0 ? "Nop" : <>&nbsp;</>}
                    </div>
                  </td>
                  <td className="border text-center min-w-3v max-w-3v p-0 relative">
                    <div className=" w-24 mx-auto">
                      {item.tgl ? item.tgl : ""}
                    </div>
                  </td>
                  <td className="border px-1 py-1.5 min-w-15v max-w-15v">
                    <div className="relative">{item.keterangan}</div>
                  </td>
                  <td className="border text-center min-w-5v max-w-5v">
                    <div className="relative">{item.ref}</div>
                  </td>
                  <td className="border min-w-10v max-w-10v">
                    <div className="relative text-center text-base">
                      {item.debit === 0 ? "" : toRp(item.debit)}
                    </div>
                  </td>
                  <td className="border min-w-10v max-w-10v">
                    <div className="relative hidden text-center text-base">
                      {item.kredit === 0 ? "" : toRp(item.kredit)}
                    </div>
                  </td>
                  <td className="border min-w-10v max-w-10v text-center text-base">
                    {tsaldo[index].debit === 0 ? "" : toRp(tsaldo[index].debit)}
                  </td>
                  <td className="border min-w-10v max-w-10v text-center text-base">
                    {tsaldo[index].kredit === 0
                      ? ""
                      : toRp(tsaldo[index].kredit)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
