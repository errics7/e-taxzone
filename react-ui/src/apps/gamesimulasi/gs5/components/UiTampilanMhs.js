export default function UiTampilanMhs(props) {
  const dataSoal = props.data;
  const dataC = props.dataC;
  // console.log('oioi',dataC);
  return (
    <>
      <div className="text-xl uppercase text-center mt-1">
        Bukti Permintaan & Pemakaian Bahan
      </div>
      <div className="text-lg flex flex-col items-center uppercase text-center">
        <div className="flex items-center mt-2">
          <div>NO BPPB :{dataC && dataC.nobppb}</div>
        </div>
      </div>
      <br />
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
              Bahan Nama
            </th>
            <th className="w-3/12 font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
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
            <th className="w-4/12 font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
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
            <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
              Keperluan
            </th>
          </tr>
        </thead>
        <tbody>
          {dataSoal &&
            dataSoal.map((item, index) => (
              <tr key={index} className="bg-white lg:hover:bg-slate-100 mb-10">
                <td className="lg:w-auto p-3 text-slate-800 text-left border border-b block lg:table-cell relative">
                  {item.namabhn}
                </td>
                <td className="p-0 text-left border border-b">
                  <table className="w-full h-full text-center">
                    <tbody>
                      <tr className="">
                        <td className="w-1/3 border-r">{item.satuan}</td>
                        <td className="w-1/3 border-r">{item.dimintaqty}</td>
                        <td className="w-1/3 border-l">{item.keluarqty}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="p-0 lg:w-auto text-slate-800 text-left border border-b block lg:table-cell relative lg:static">
                  <table className="w-full h-full text-center">
                    <tbody>
                      <tr className="">
                        <td className="w-1/3 border-r">{item.hrgsatuan}</td>
                        <td className="w-1/3 border-r">{item.hrgjumlah}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="lg:w-auto p-3 text-slate-800 text-center border border-b block lg:table-cell relative">
                  {item.keperluan}
                </td>
              </tr>
            ))}

          {/* Dumm */}
          <tr className="bg-white ">
            <td className="lg:w-auto p-3 text-slate-800 text-left border border-b block lg:table-cell relative lg:static"></td>
            <td className="p-0 text-left border border-b">
              <table className="w-full h-full text-center">
                <tbody>
                  <tr className="">
                    <td className="w-1/3 border-r"></td>
                    <td className="w-1/3 border-r"></td>
                    <td className="w-1/3 border-l"></td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td className="p-0 lg:w-auto text-slate-800 text-left border border-b block lg:table-cell relative lg:static">
              <table className="w-full h-full text-center">
                <tbody>
                  <tr className="">
                    <td className="w-1/3 border-r"></td>
                    <td className="w-1/3 border-r"></td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td className="lg:w-auto p-3 text-slate-800 text-center border border-b block lg:table-cell relative lg:static"></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
