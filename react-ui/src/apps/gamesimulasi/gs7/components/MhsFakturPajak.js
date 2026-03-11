import "./adminfakturpajak.css";

export default function MhsFakturPajak(props) {
  // const classes = useStyles();
  const data = props.dataConfig;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="bg-white py-3">
      <div className="opacity-50 italic font-semibold">Data (soal):</div>
      <div className="flex flex-col border">
        <div className="text-center text-xl font-semibold py-2">
          Faktur Pajak
        </div>
        <div className="px-1 flex justify-between border-b">
          <div className="px-2 py-3 flex items-center">
            <span>Nomor Faktur :</span>
            <div className="relative px-1">{data && data.kp_nobukti3}</div>
          </div>
          <div className="px-2 py-3 flex items-center">
            <span>No : MT 462</span>
          </div>
        </div>
        <span className="px-3 mt-3">Pengusaha Kena Pajak</span>
        <div>
          {/* INfo */}
          <div>
            <div className="px-3 mt-1 flex items-center">
              <div className="w-32 flex justify-between">
                <span>Nama</span>
                <span>:</span>
              </div>
              <div className="relative px-2">PT. Mitra</div>
            </div>
            <div className="px-3 mt-1 flex">
              <div className="w-32 flex justify-between">
                <span>Alamat</span>
                <span>:</span>
              </div>
              <div className="relative px-2">Jl. Kabupaten Malang</div>
            </div>
            <div className="px-3 mt-1 flex items-center">
              <div className="w-32 flex justify-between">
                <span>NPWP</span>
                <span>:</span>
              </div>
              <div className="relative px-2">1.423.394.1.52</div>
            </div>
            <div className="px-3 mt-1 flex flex-col md:flex-row items-center">
              <div className="flex w-full md:w-1/3">
                <div className="w-32 flex justify-between items-center">
                  <span>SK. Pengukuhan</span>
                  <span>:</span>
                </div>
                <div className="relative px-2">10142/II/1984</div>
              </div>
              <div className="flex w-full md:w-1/3">
                <div className="w-20 flex justify-between items-center">
                  <span>Tanggal</span>
                  <span>:</span>
                </div>
                <div className="relative px-2">14 Feb 1984</div>
              </div>
            </div>
          </div>
          {/* List Faktur */}
          <table className="border-collapse w-full mt-2">
            <thead>
              <tr>
                <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  No.
                </th>
                <th className="w-4/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Nama Barang/ Jasa Kena Pajak
                </th>
                <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kuantum
                </th>
                <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Satuan
                </th>
                <th className="w-3/12 p-0 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Harga Jual
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="py-1 px-1 text-slate-800 text-center border">
                  <div className="relative py-2 px-1">
                    {data ? data.fp_no : 0}
                  </div>
                </td>
                <td className="py-1 px-2 text-left border border-b">
                  <div className="relative py-2 pl-1">
                    {data ? data.kp_namabarang : ""}
                  </div>
                </td>
                <td className="py-1 px-1 text-left border border-b">
                  <div className="relative text-center py-2 px-1">
                    {data ? data.kp_mk3 : 0}
                  </div>
                </td>
                <td className="py-1 text-slate-800 text-left border">
                  <div className="relative text-center py-2 px-1">
                    {data ? toRp(data.kp_mh3) : 0}
                  </div>
                </td>
                <td className="py-1 px-3 text-slate-800 border">
                  <div className="relative text-right text-base pr-3">
                    {data
                      ? toRp(
                          Number(data.kp_mk3.replaceAll(",", "")) *
                            Number(data.kp_mh3.replaceAll(",", ""))
                        )
                      : 0}
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="5"
                  className="py-1 px-1 text-slate-800 text-center border"
                >
                  {" "}
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td
                  colSpan="4"
                  className="py-2 px-5 text-slate-600 font-semibold text-left border"
                >
                  Jumlah Harga Jual/Pengganti
                </td>
                <td className="py-1 px-1 text-base text-slate-800 text-right pr-6 border">
                  {data
                    ? toRp(
                        Number(data.kp_mk3.replaceAll(",", "")) *
                          Number(data.kp_mh3.replaceAll(",", ""))
                      )
                    : toRp(0)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="4"
                  className="py-2 px-5 text-slate-600 font-semibold text-left border"
                >
                  (-) Potongan Harga / Uang Muka
                </td>
                <td className="py-1 px-1 text-slate-800 text-right border">
                  {" "}
                  <span className="px-5 text-base">{toRp(0)}</span>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="4"
                  className="py-2 px-5 text-slate-600 font-semibold text-left border"
                >
                  Dasar Pengenaan Pajak
                </td>
                <td className="py-1 px-1 text-base text-slate-800 text-right pr-6 border">
                  {data
                    ? toRp(
                        Number(data.kp_mk3.replaceAll(",", "")) *
                          Number(data.kp_mh3.replaceAll(",", ""))
                      )
                    : toRp(0)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="4"
                  className="py-2 px-5 text-slate-600 font-semibold text-left border"
                >
                  PPN = 10% x Dasar Pengenaan Pajak
                </td>
                <td className="py-1 px-1 text-base text-slate-800 text-right pr-6 border">
                  {data
                    ? toRp(
                        0.1 *
                          (Number(data.kp_mk3.replaceAll(",", "")) *
                            Number(data.kp_mh3.replaceAll(",", "")))
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
              <div className="min-w-15v pl-1">
                Malang, {data ? data.kp_tgl3 : ""}
              </div>
              <br />
              <br />
              <div className="relative">
                <div className="inline-flex pl-1 relative">
                  {data ? data.fp_nama : ""}
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}
