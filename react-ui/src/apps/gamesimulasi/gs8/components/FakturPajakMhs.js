import {
  ShimmerText,
  ShimmerTable,
  ShimmerSectionHeader,
} from "react-shimmer-effects";

export default function FakturPajakMhs(props) {
  const data = props.dataConfig;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="bg-white">
      Data (Soal):
      {data ? (
        <div className="flex flex-col border">
          <div className="text-center text-xl font-semibold py-2">
            Faktur Pajak
          </div>
          <div className="px-1 flex justify-between border-b">
            <div className="px-2 py-3 flex items-center">
              <span>Nomor Faktur :</span>
              <div className="relative px-1">{data ? data.fpnomorf : ""}</div>
            </div>
            <div className="px-2 py-3 flex items-center">
              <span>No :</span>
              <div className="relative px-5">{data ? data.fpno : ""}</div>
            </div>
          </div>
          <span className="px-3 mt-3">Pengusaha Kena Pajak</span>
          <div>
            <div className="px-3 mt-1 flex items-center">
              <div className="w-32 flex justify-between">
                <span>Nama</span>
                <span>:</span>
              </div>
              <div className="relative px-2">{data ? data.fpnama : ""}</div>
            </div>
            <div className="px-3 mt-1 flex">
              <div className="w-32 flex justify-between">
                <span>Alamat</span>
                <span>:</span>
              </div>
              <div className="relative px-2">{data ? data.fpalamat : ""}</div>
            </div>
            <div className="px-3 mt-1 flex items-center">
              <div className="w-32 flex justify-between">
                <span>NPWP</span>
                <span>:</span>
              </div>
              <div className="relative px-2">{data ? data.fpnpwp : ""}</div>
            </div>
            <div className="px-3 mt-1 flex flex-row items-center">
              <div className="w-1/3 flex">
                <div className="w-32 flex justify-between items-center">
                  <span>SK. Pengukuhan</span>
                  <span>:</span>
                </div>
                <div className="relative px-2">
                  {data ? data.fpskpengukuhan : ""}
                </div>
              </div>
              <div className="w-1/3 flex">
                <div className="w-20 flex justify-between items-center">
                  <span>Tanggal</span>
                  <span>:</span>
                </div>
                <div className="relative px-2">
                  {data ? data.fptglfaktur : ""}
                </div>
              </div>
            </div>
            {/* List Faktur */}
            <table className="border-collapse w-full mt-2">
              <thead>
                <tr>
                  <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                    No.
                  </th>
                  <th className="w-4/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                    Nama Barang/ Jasa Kena Pajak
                  </th>
                  <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                    Kuantum
                  </th>
                  <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                    Satuan
                  </th>
                  <th className="w-3/12 p-0 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                    Harga Jual
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="lg:w-auto py-4 px-1 text-slate-800 text-center border border-b block lg:table-cell relative">
                    <div className="relative px-1">
                      {data ? data.fpitmno : ""}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-left border border-b">
                    <div className="relative bg-white">
                      {data ? data.fpitmnama : ""}
                    </div>
                  </td>
                  <td className="py-4 px-1 text-center border border-b">
                    <div className="relative px-3">
                      {data ? data.fpitmkuantum : ""}
                    </div>
                  </td>
                  <td className="py-4 lg:w-auto text-slate-800 text-center border border-b block lg:table-cell relative lg:static">
                    <div className="relative px-3">
                      {data ? data.fpitmsatuan : ""}
                    </div>
                  </td>
                  <td className="py-4 px-3 lg:w-auto text-slate-800 text-center border border-b block lg:table-cell relative lg:static">
                    <div className="relative">
                      {data
                        ? toRp(
                            Number(data.fpitmkuantum) * Number(data.fpitmsatuan)
                          )
                        : ""}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="5"
                    className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative"
                  >
                    {" "}
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="4"
                    className="lg:w-auto py-2 px-5 text-slate-600 font-semibold text-left border border-b block lg:table-cell relative"
                  >
                    Jumlah Harga Jual/Pengganti
                  </td>
                  <td className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative">
                    {data
                      ? toRp(
                          Number(data.fpitmkuantum) * Number(data.fpitmsatuan)
                        )
                      : toRp(0)}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="4"
                    className="lg:w-auto py-2 px-5 text-slate-600 font-semibold text-left border border-b block lg:table-cell relative"
                  >
                    (-) Potongan Harga / Uang Muka
                  </td>
                  <td className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative"></td>
                </tr>
                <tr>
                  <td
                    colSpan="4"
                    className="lg:w-auto py-2 px-5 text-slate-600 font-semibold text-left border border-b block lg:table-cell relative"
                  >
                    Dasar Pengenaan Pajak
                  </td>
                  <td className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative">
                    {data
                      ? toRp(
                          Number(data.fpitmkuantum) * Number(data.fpitmsatuan)
                        )
                      : toRp(0)}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="4"
                    className="lg:w-auto py-2 px-5 text-slate-600 font-semibold text-left border border-b block lg:table-cell relative"
                  >
                    PPN = 10% x Dasar Pengenaan Pajak
                  </td>
                  <td className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative">
                    {data
                      ? toRp(
                          0.1 *
                            (Number(data.fpitmkuantum) *
                              Number(data.fpitmsatuan))
                        )
                      : toRp(0)}
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
            <div className="flex flex-row-reverse">
              <div className="flex flex-col w-1/4">
                <div className="relative min-w-25v">
                  {data ? data.fpitmtgl : ""}
                </div>
                <br />
                <br />
                <div className="relative w-48">
                  {data ? data.fpitmpemilik : ""}
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>
      ) : (
        <div className="mt-3 -mb-10">
          <ShimmerSectionHeader center />
          <ShimmerText line={2} gap={10} />
          <ShimmerTable row={1} col={2} />
        </div>
      )}
    </div>
  );
}
