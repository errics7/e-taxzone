import { filter, find, map } from "lodash";
import WarningIcon from "@mui/icons-material/Warning";

export default function BukuPembantuBiayaMhs(props) {
  const { data, kode, kpembantu } = props.ori;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="bg-white">
      <p className="py-3">Tampilan Soal:</p>
      {map(filter(data, { type: 1 }), (item, i) => {
        const kpust = find(kode, { uuid: item.idc });
        const kpem = find(kpembantu, { uuid: item.idr });

        return (
          <div key={i} className="border mt-5 mb-10 py-5 relative">
            <div className="text-xl uppercase text-center mt-1 mb-3">
              BUKU PEMBANTU BIAYA
            </div>
            <div>
              <div className="text-base flex flex-row justify-between mt-10 px-2">
                <div className="flex items-center w-6/12">
                  <div className="flex justify-between">
                    <span>Kode Pusat Biaya</span>
                    <span className="ml-2">:</span>
                  </div>
                  <div className="uppercase px-2">{kpust.alias}</div>
                </div>
                <div className="flex flex-row-reverse items-center w-6/12">
                  <div className="uppercase px-2">{kpem.alias}</div>
                  <div className="flex justify-between">
                    <span>Kode Pembantu Biaya</span>
                    <span className="ml-2">:</span>
                  </div>
                </div>
              </div>
              <table className="border-collapse w-full mt-5">
                <thead>
                  <tr>
                    <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Tanggal
                    </th>
                    <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Keterangan
                    </th>
                    <th className="w-1/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Ref
                    </th>
                    <th className="w-1/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Debit
                    </th>
                    <th className="w-1/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Kredit
                    </th>
                    <th className="w-4/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      <table className="w-full">
                        <tbody>
                          <tr className="border-b">
                            <td colSpan="2">Saldo</td>
                          </tr>
                          <tr className="border-t">
                            <td className="w-1/2 border-r">Debit</td>
                            <td className="w-1/2">Kredit</td>
                          </tr>
                        </tbody>
                      </table>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white lg:hover:bg-slate-100 flex-row mb-10">
                    <td className="lg:w-auto text-center p-0 text-slate-800 border border-b block lg:table-cell relative">
                      <table className="w-full h-full text-center">
                        <tbody>
                          <tr className="">
                            <td className="w-1/3 border-r">Nop</td>
                            <td className="w-1/3">1</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="lg:w-auto p-1 px-3 text-slate-800 text-left border border-b block lg:table-cell relative">
                      Saldo awal
                    </td>
                    <td className="p-0 text-left border border-b"></td>
                    <td className="p-0 lg:w-auto text-slate-800 text-left border border-b block lg:table-cell relative lg:static"></td>
                    <td className="lg:w-auto p-3 text-slate-800 text-left border border-b block lg:table-cell relative"></td>
                    <td className="lg:w-auto p-3 text-slate-800 text-left border border-b block lg:table-cell relative">
                      <table className="w-full h-full text-center">
                        <tbody>
                          <tr className="">
                            <td className="w-1/3 border-r">-</td>
                            <td className="w-1/3"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr className="bg-white lg:hover:bg-slate-100 flex-row mb-10">
                    <td className="w-2/12 p-0 text-center text-slate-800 border border-b table-cell ">
                      <table className="w-full h-full text-center ">
                        <tbody>
                          <tr className="">
                            <td className="w-1/3 border-r">&nbsp;</td>
                            <td className="w-1/3"> 2</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="w-3/12 p-1 px-3 text-slate-800 text-left border border-b table-cell relative">
                      {!item.keterangan || item.keterangan === "" ? (
                        <div className="flex items-center">
                          <p className="px-2 text-red-500">
                            Keterangan Kosong isi terlebih dahulu
                          </p>
                          <WarningIcon className="text-red-500 animate-bounce" />
                        </div>
                      ) : (
                        item.keterangan
                      )}
                    </td>
                    <td className="w-1/12 p-0 text-left border border-b table-cell"></td>
                    <td className="w-1/12 p-0 px-1 text-slate-800 text-left border border-b table-cell relative">
                      {toRp(item.value)}
                    </td>
                    <td className="w-1/12 p-3 text-slate-800 text-left border border-b table-cell relative"></td>
                    <td className="w-4/12 p-3 text-slate-800 text-left border border-b table-cell relative">
                      <table className="w-full h-full text-center">
                        <tbody>
                          <tr className="">
                            <td className="w-1/2 border-r">
                              {toRp(item.value)}
                            </td>
                            <td className="w-1/2"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
