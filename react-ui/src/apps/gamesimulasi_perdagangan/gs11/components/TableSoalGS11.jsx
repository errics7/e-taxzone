import React from "react";

const TableSoalGS11 = (props) => {
  const {
    dataakun: dataAkun,
    dataposting: dataPosting,
    ...dataConfig
  } = props.dataConfig;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="mb-4 mt-3 px-2 -ml-3 pb-6">
      <h1 className="text-xl text-center font-bold">{dataConfig.cvname}</h1>
      <h1 className="text-xl text-center font-bold mt-2">
        {dataConfig.subinvoice}
      </h1>
      {dataAkun &&
        dataAkun.map((akun, idx) => (
          <div key={idx} className=" my-4 border-2 p-4">
            <div className="my-1">
              <label className="mr-2">Nama akun &nbsp;&nbsp;&nbsp; :</label>

              <span>{akun.nama}</span>
            </div>
            <div className="my-1">
              <label className="mr-2">No. akun &nbsp;&nbsp;&nbsp; :</label>
              <span>{akun.noakun}</span>
            </div>
            <div className="overflow-x-auto border-collapse">
              <table className="border-collapse min-w-full table-fixed">
                <thead>
                  <tr>
                    <th
                      rowSpan="2"
                      className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                    >
                      Tanggal
                    </th>
                    <th
                      rowSpan="2"
                      className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                    >
                      Keterangan
                    </th>
                    <th
                      rowSpan="2"
                      className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                    >
                      Ref
                    </th>
                    <th
                      rowSpan="2"
                      className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                    >
                      Debet
                    </th>
                    <th
                      rowSpan="2"
                      className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                    >
                      Kredit
                    </th>
                    <th
                      colSpan="2"
                      className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                    >
                      Saldo
                    </th>
                  </tr>
                  <tr>
                    <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Debet
                    </th>
                    <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                      Kredit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-t border-slate-300 ">
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      <p>{dataConfig.tgl}</p>
                    </td>
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      Saldo Awal
                    </td>
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b"></td>
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b"></td>
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b"></td>
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      {akun.type_saldo === "debet" && (
                        <div className="relative">
                          <p>{toRp(akun.saldo_awal)}</p>
                        </div>
                      )}
                    </td>
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      {akun.type_saldo === "kredit" && (
                        <div className="relative">
                          <p>{toRp(akun.saldo_awal)}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                  {dataPosting &&
                    dataPosting
                      .filter((posting) => posting.id_akun === akun.id_akun)
                      .map((posting, index) => (
                        <tr
                          key={index}
                          className="bg-white border-t border-slate-300 "
                        >
                          <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                            <p>{posting.tgl}</p>
                          </td>
                          <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                            <p>{posting.keterangan}</p>
                          </td>
                          <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                            <p>{posting.ref}</p>
                          </td>
                          <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                            {posting.posisi === "debet" && (
                              <div className="relative">
                                <p>{toRp(posting.debet)}</p>
                              </div>
                            )}
                          </td>
                          <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                            {posting.posisi === "kredit" && (
                              <div className="relative">
                                <p>{toRp(posting.kredit)}</p>
                              </div>
                            )}
                          </td>
                          <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                            {akun.type_saldo === "debet" &&
                              toRp(posting.saldototal)}
                          </td>
                          <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                            {akun.type_saldo === "kredit" &&
                              toRp(posting.saldototal)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TableSoalGS11;
