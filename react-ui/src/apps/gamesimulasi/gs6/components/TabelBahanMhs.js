export default function TabelBahanMhs(props) {
  const data = props.data;
  const dataConfig = props.dataConfig;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="relative">
      <div className="absolute opacity-50 italic font-semibold p-1 pr-2">
        Data informasi :
      </div>
      <div className="text-lg uppercase text-center mt-3 border-t pt-8">
        Bukti Permintaan & Pemakaian Bahan
      </div>
      <div className="text-base flex flex-col items-center uppercase text-center">
        <div className="flex mt-1 mb-3">
          <div>NO BPPB : </div>
          <div className="px-2 relative">
            {dataConfig ? dataConfig.bppb : ""}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                No
              </th>
              <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Bahan Nama
              </th>
              <th className="w-3/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td colSpan="3">Kwantitas</td>
                    </tr>
                    <tr className="border-t">
                      <td className="w-1/3 border-r">Sat</td>
                      <td className="w-1/3 border-r">Diminta</td>
                      <td className="w-1/3 border-l">Keluar</td>
                    </tr>
                  </tbody>
                </table>
              </th>
              <th className="w-4/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td colSpan="2">Harga Pokok</td>
                    </tr>
                    <tr className="border-t">
                      <td className="w-1/2 border-r">/sat (Rp)</td>
                      <td className="w-1/2">Jumlah (Rp)</td>
                    </tr>
                  </tbody>
                </table>
              </th>
              <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Keperluan
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, index) => (
                <tr key={index} className="bg-white">
                  <td className="lg:w-auto text-center p-3 text-slate-800 border border-b">
                    {index + 1}
                  </td>
                  <td className="lg:w-auto p-1 px-3 text-slate-800 text-left border border-b">
                    {item.namabhn}
                  </td>
                  <td className="p-0 text-left border border-b">
                    <table className="w-full h-full text-center">
                      <tbody>
                        <tr className="">
                          <td className="w-1/3 border-r">{item.satuan}</td>
                          <td className="w-1/3 border-r">{item.diminta}</td>
                          <td className="w-1/3 border-l">{item.keluar}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td className="p-0 lg:w-auto text-slate-800 text-left border border-b">
                    <table className="w-full h-full text-center">
                      <tbody>
                        <tr className="">
                          <td className="w-1/3 border-r">
                            {toRp(item.hargasatuan)}
                          </td>
                          <td className="w-1/3 border-r">
                            {toRp(item.hargajumlah)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td className="lg:w-auto p-3 text-slate-800 text-left border border-b">
                    {item.keperluan}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
