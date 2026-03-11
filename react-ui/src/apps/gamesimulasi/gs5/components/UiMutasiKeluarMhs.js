export default function UiMutasiKeluarMhs(props) {
  const data = props.selected ? props.selected : null;

  const dataTrue = data && data.dataSoal.filter((x) => x.status === true);

  const toPuluhan = (number) => {
    if (number) {
      var rupiah = "";
      var numberrev = number.toString().split("").reverse().join("");
      for (var i = 0; i < numberrev.length; i++)
        if (i % 3 === 0) rupiah += numberrev.substr(i, 3) + ".";
      return rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("");
    } else {
      return number;
    }
  };
  return (
    <div className="w-full relative mt-5 bg-white">
      <div className="border border-dashed p-3 w-full">
        <div className="text-lg uppercase font-semibold mb-3">
          kartu Persediaan
        </div>
        <div className="text-base flex flex-col">
          <div className="flex ">
            <div className="flex-none w-2/12 flex justify-between">
              <span>Kelompok</span>
              <span>:</span>
            </div>
            <div className="grow pl-2  uppercase">Bahan Penolong</div>
          </div>
        </div>
        <div className="text-base flex flex-col">
          <div className="flex ">
            <div className="flex-none w-2/12 flex justify-between">
              <span>Nama Barang</span>
              <span>:</span>
            </div>
            <div className="grow uppercase">
              {dataTrue ? (
                <span className="px-2">{dataTrue[0].namabhn}</span>
              ) : (
                <div className="bg-slate-100 animate-pulse w-20 h-5 rounded ml-2">
                  &nbsp;
                </div>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="overflow-x-auto">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Tanggal
                </th>
                <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Keterangan
                </th>
                <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  No Bukti
                </th>
                <th className="w-2/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td colSpan="3">Masuk</td>
                      </tr>
                      <tr className="border-t">
                        <td className="w-1/3 border-r">Kwt</td>
                        <td className="w-1/3 border-r">Harga</td>
                        <td className="w-1/3 border-l">Jumlah</td>
                      </tr>
                    </tbody>
                  </table>
                </th>
                <th className="w-2/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td colSpan="3">Keluar</td>
                      </tr>
                      <tr className="border-t">
                        <td className="w-1/3 border-r">Kwt</td>
                        <td className="w-1/3 border-r">Harga</td>
                        <td className="w-1/3 border-l">Jumlah</td>
                      </tr>
                    </tbody>
                  </table>
                </th>
                <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td colSpan="3">Saldo</td>
                      </tr>
                      <tr className="border-t">
                        <td className="w-1/3 border-r">Kwt</td>
                        <td className="w-1/3 border-r">Harga</td>
                        <td className="w-1/3 border-l">Jumlah</td>
                      </tr>
                    </tbody>
                  </table>
                </th>
              </tr>
            </thead>
            {/* Body */}
            <tbody>
              <tr>
                <td className="w-1/12 p-3 border border-slate-300 text-center">
                  {data && data.config.tgl_mutasikeluar}
                </td>
                <td className="w-1/12 p-3 border border-slate-300">
                  Saldo Awal
                </td>
                <td className="w-1/12 p-3 border border-slate-300"></td>
                <td className="w-2/12 p-3 border border-slate-300">
                  <table className="w-full">
                    <tbody>
                      <tr className="">
                        <td className="w-1/3">&nbsp;</td>
                        <td className="w-1/3 border-l border-r">&nbsp;</td>
                        <td className="w-1/3">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="w-2/12 p-3 border border-slate-300">
                  <table className="w-full">
                    <tbody>
                      <tr className="">
                        <td className="w-1/3">&nbsp;</td>
                        <td className="w-1/3 border-l border-r">&nbsp;</td>
                        <td className="w-1/3">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="w-2/12 p-3 border border-slate-300">
                  <table className="w-full">
                    <tbody>
                      <tr className=" text-center">
                        <td className="w-1/3">
                          {data && toPuluhan(data.config.sal_kwt)}
                        </td>
                        <td className="w-1/3 border-l border-r">
                          {data && toPuluhan(data.config.sal_harga)}
                        </td>
                        <td className="w-1/3">
                          {data && toPuluhan(data.config.sal_jumlah)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              {/* data main */}
              {[...Array(1)].map((el, index) => (
                <tr key={index}>
                  <td className="w-1/12 py-3 px-0 border border-slate-300 text-center">
                    <div className="py-1">
                      {data && data.config.info_tglbgudang}
                    </div>
                  </td>
                  <td className="w-1/12 py-3 px-0 border border-slate-300">
                    <div className=" p-1">{data && dataTrue[0].keperluan}</div>
                  </td>
                  <td className="w-1/12 py-3 px-0 border border-slate-300 text-center">
                    <div className=" p-1">{data && data.config.nobppb}</div>
                  </td>
                  <td className="w-2/12 p-3 border border-slate-300">
                    <table className="w-full">
                      <tbody>
                        <tr className="">
                          <td className="w-1/3">&nbsp;</td>
                          <td className="w-1/3 border-l border-r">&nbsp;</td>
                          <td className="w-1/3">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td className="w-2/12 py-3 px-0 border border-slate-300">
                    <table className="w-full">
                      <tbody>
                        <tr className="text-center">
                          <td className="w-1/3">
                            {data && toPuluhan(dataTrue[0].keluarqty)}
                          </td>
                          <td className="w-1/3 border-l border-r">
                            {data && toPuluhan(dataTrue[0].hrgsatuan)}
                          </td>
                          <td className="w-1/3 ">
                            {data &&
                              toPuluhan(
                                dataTrue[0].keluarqty * dataTrue[0].hrgsatuan
                              )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td className="w-2/12 p-3 border border-slate-300">
                    <table className="w-full">
                      <tbody>
                        <tr className=" text-center">
                          <td className="w-1/3">
                            {data &&
                              toPuluhan(
                                data.config.sal_kwt - dataTrue[0].keluarqty
                              )}
                          </td>
                          <td className="w-1/3 border-l border-r">
                            {data && toPuluhan(dataTrue[0].hrgsatuan)}
                          </td>
                          <td className="w-1/3">
                            {data &&
                              toPuluhan(
                                (data.config.sal_kwt - dataTrue[0].keluarqty) *
                                  dataTrue[0].hrgsatuan
                              )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
