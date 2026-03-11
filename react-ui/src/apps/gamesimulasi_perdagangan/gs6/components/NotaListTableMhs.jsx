import React from "react";
import { filter } from "lodash";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: parseFloat(values.value).toFixed(2),
          },
        });
      }}
      style={{
        textAlign: "center",
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const NotaListTableMhs = (props) => {
  const dataConfig = props.dataConfig;
  const datanota = dataConfig.datanota;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="border min-h-10v mt-5">
      <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
        Tampilan Data (soal):
      </div>
      {datanota.map((nota, idx) => (
        <div key={idx}>
          <div className="mt-10 ml-4 relative">
            {nota.type === "kontan" ? (
              <p className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300">
                {props.dataConfig.introkontan}
              </p>
            ) : (
              <p className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300">
                {props.dataConfig.introkas}
              </p>
            )}
          </div>
          <div className="border-2 border-dashed m-4">
            <div className="grid grid-cols-6 gap-4 pb-2">
              <div className="col-start-1 col-end-4  text-base">
                <div className="flex flex-col ml-3 mt-3 space-y-2">
                  {nota.type === "kontan" ? (
                    <>
                      <p className="font-semibold text-2xl">{nota.penerima}</p>
                      <p className="text-base font-medium">{nota.alamat}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-2xl">
                        {dataConfig.cvname}
                      </p>
                      <p className="text-base font-medium">
                        {dataConfig.cvalamat}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-end-10">
                <div className="flex flex-col mt-3 mr-4 space-y-2">
                  <h1 className="text-xl font-semibold">
                    {nota.type === "kontan"
                      ? "NOTA KONTAN"
                      : "BUKTI KAS KELUAR"}
                  </h1>
                  <div className="flex">
                    <div className="flex justify-between w-16">
                      <p>No</p>
                      <p>:</p>
                    </div>
                    <span className="pl-2">{nota.no}</span>
                  </div>
                  <div className="flex">
                    <div className="flex justify-between w-16">
                      <p>Tanggal</p>
                      <p>:</p>
                    </div>
                    <span className="pl-2">{nota.tgl}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t-2 px-4 py-2 my-2">
              <div className="grid grid-cols-6 gap-4">
                {nota.type === "kontan" ? (
                  <div className="col-start-1 col-end-6 flex flex-col text-base">
                    <div className="my-1">
                      <label className="mr-2">
                        Kepada &nbsp;&nbsp;&nbsp; :
                      </label>
                      <span>{dataConfig.cvname}</span>
                    </div>
                    <div className="my-1 relative">
                      <p>{dataConfig.cvalamat}</p>
                    </div>
                  </div>
                ) : (
                  <div className="col-start-1 col-end-6 flex flex-col text-base mt-3 space-y-1">
                    <div className="flex">
                      <div className="flex justify-between w-44">
                        <p>Dibayarkan kepada</p>
                        <p>:</p>
                      </div>
                      <span className={`text-base ml-3`}>{nota.penerima}</span>
                    </div>
                    <div className="flex">
                      <div className="flex justify-between w-44">
                        <p>Untuk Pembayaran</p>
                        <p>:</p>
                      </div>
                      <span className={`text-base ml-3`}>{nota.keperluan}</span>
                    </div>
                    <div className="flex">
                      <div className="flex justify-between w-44">
                        <p>Sebesar</p>
                        <p>:</p>
                      </div>
                      <span className={`text-base ml-3`}>{nota.nilaih}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* TABEL BARANG */}
            {nota.type === "kontan" ? (
              <div className="flex justify-center px-2 border-t-2">
                <table className="w-full border  text-center mx-2 my-6">
                  <thead className="border-b">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                      >
                        Jumlah
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                      >
                        Uraian
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                      >
                        Harga per Unit
                      </th>

                      <th
                        scope="col"
                        className="text-sm font-medium text-slate-900 px-6 py-4"
                      >
                        Total (Rp)
                      </th>
                    </tr>
                  </thead>
                  {/* ITEM BARANG LIST */}
                  <tbody>
                    {filter(dataConfig.databarang, { uid: nota.uid }).map(
                      (barang, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                              {/* <PopMenuRow
                                    // status={item}
                                    removeRow={() => hapusDataBarang(ibrg.id)}
                                  /> */}
                            </div>
                            <p style={{ textAlign: "center", fontSize: 15 }}>
                              {barang.jumlah}
                            </p>
                          </td>

                          <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                              {/* <PopMenuRow
                                    // status={item}
                                    removeRow={() => hapusDataBarang(ibrg.id)}
                                  /> */}
                            </div>
                            <p style={{ textAlign: "center", fontSize: 15 }}>
                              {barang.namabarang}
                            </p>
                          </td>

                          <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                              {/* <PopMenuRow
                                    // status={item}
                                    removeRow={() => hapusDataBarang(ibrg.id)}
                                  /> */}
                            </div>
                            <p style={{ textAlign: "center", fontSize: 15 }}>
                              {toRp(barang.jumlah)}
                            </p>
                          </td>

                          <td className="px-6 py-2 whitespace-nowrap text-base text-slate-900 border-r relative">
                            {toRp(barang.total)}
                          </td>
                        </tr>
                      )
                    )}
                    {/* <tr className="border-b">
                        <td className="text-sm text-right text-slate-900 font-medium whitespace-nowrap border-r flex justify-center items-center py-4">
                          <button
                            className="bg-slate-400 text-white px-1 py-1"
                            onClick={() => tambahBarang(itminv.uid)}
                          >
                            Tambah Barang
                          </button>
                        </td>
                      </tr> */}
                  </tbody>
                  <tbody>
                    <tr className="border-b font-semibold">
                      <td
                        colSpan={3}
                        className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                      >
                        Subtotal
                      </td>
                      <td className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap">
                        {toRp(nota.subtotal)}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td
                        colSpan={3}
                        className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                      >
                        PPN
                      </td>
                      <td
                        colSpan={3}
                        className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap"
                      >
                        {toRp(nota.ppn)}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td
                        colSpan={3}
                        className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                      >
                        Total
                      </td>
                      <td
                        colSpan={3}
                        className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap"
                      >
                        {toRp(nota.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-4 mx-6 mb-10 mt-5">
                  <div className="col-start-1 col-end-4 relative bg-slate-100 px-3 py-2 text-right text-base">
                    <span>{toRp(nota.nilaia)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-12 mb-12 -mr-10">
                  <div className="col-start-5 col-end-12 flex justify-around">
                    <div className="text-center pb-24 border-b-2 border-slate-400">
                      Disetujui oleh
                    </div>
                    <div className="text-center pb-24 border-b-2 border-slate-400">
                      Dibayarkan oleh
                    </div>
                    <div className="text-center pb-24 border-b-2 border-slate-400">
                      Diterima oleh
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotaListTableMhs;
