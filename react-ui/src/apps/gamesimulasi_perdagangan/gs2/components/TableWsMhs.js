/* eslint-disable eqeqeq */
import React, { forwardRef } from "react";
import TextField from "@mui/material/TextField";
import NumberFormat from "react-number-format";

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

const TableWsMhs = (props) => {
  const {
    data,
    kuantitas,
    setkuantitas,
    hpunit,
    sethpunit,
    jumlah,
    setjumlah,
    isAnswer,
  } = props;

  return (
    <>
      {data.databarang.map((item, index) => (
        <div key={index} className="mt-3 col-span-8 overflow-x-auto">
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th
                  colSpan="12"
                  className="w-12/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  <div>KARTU PERSEDIAAN*</div>
                  <div className="text-left">
                    Nama Barang: {item.namabarang}
                  </div>
                </th>
              </tr>
              <tr>
                <th
                  rowSpan="2"
                  className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Tgl
                </th>
                <th
                  rowSpan="2"
                  className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Uraian
                </th>
                <th
                  colSpan="3"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Pembelian
                </th>
                <th
                  colSpan="3"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Penjualan
                </th>
                <th
                  colSpan="3"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Saldo
                </th>
              </tr>
              <tr>
                <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kuantitas
                </th>
                <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  HP/Unit
                </th>
                <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jumlah
                </th>

                <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kuantitas
                </th>
                <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  HP/Unit
                </th>
                <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jumlah
                </th>

                <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kuantitas
                </th>
                <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  HP/Unit
                </th>
                <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 ">
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                  {item.tgl}
                </td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                  Saldo Awal
                </td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                  <div className="relative">
                    <TextField
                      type="number"
                      placeholder="kuantitas"
                      className={`${
                        isAnswer === true &&
                        item.stok != kuantitas[index] &&
                        "animate-pulse bg-red-300 rounded"
                      }`}
                      value={kuantitas[index] ? kuantitas[index] : ""}
                      onChange={(event) => {
                        const tempKuantitas = [...kuantitas];
                        tempKuantitas[index] = event.target.value;
                        setkuantitas(tempKuantitas);
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        style: {
                          fontSize: 14,
                          textAlign: "center",
                        },
                      }}
                    />
                    {/* <EditIcon
                                 fontSize="inherit"
                                 className="text-blue-700 absolute inset-y-1 right-1"
                             /> */}
                  </div>
                </td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                  <div className="relative">
                    <TextField
                      multiline
                      placeholder="hp/unit"
                      className={`${
                        isAnswer === true &&
                        item.hargabeli != hpunit[index] &&
                        "animate-pulse bg-red-300 rounded"
                      }`}
                      value={hpunit[index] ? hpunit[index] : ""}
                      onChange={(event) => {
                        const tempUnit = [...hpunit];
                        tempUnit[index] = event.target.value;
                        sethpunit(tempUnit);
                      }}
                      name="hp/unit"
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      inputProps={{
                        style: {
                          fontSize: 14,
                          textAlign: "center",
                        },
                      }}
                    />
                    {/* <EditIcon
                                 fontSize="inherit"
                                 className="text-blue-700 absolute inset-y-1 right-1"
                             /> */}
                  </div>
                </td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                  <div className="relative">
                    <TextField
                      multiline
                      placeholder="jumlah"
                      className={`${
                        isAnswer === true &&
                        item.stok * item.hargabeli != jumlah[index] &&
                        "animate-pulse bg-red-300 rounded"
                      }`}
                      value={jumlah[index] ? jumlah[index] : ""}
                      onChange={(event) => {
                        const tempJumlah = [...jumlah];
                        tempJumlah[index] = event.target.value;
                        setjumlah(tempJumlah);
                      }}
                      name="hp/unit"
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      inputProps={{
                        style: {
                          fontSize: 14,
                          textAlign: "center",
                        },
                      }}
                    />
                    {/* <EditIcon
                                 fontSize="inherit"
                                 className="text-blue-700 absolute inset-y-1 right-1"
                             /> */}
                  </div>
                </td>
              </tr>
              <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 ">
                <td className="lg:w-auto px-1 py-5  text-slate-800 text-center border border-b p-28"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
              </tr>
              <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 ">
                <td className="lg:w-auto px-1 py-5  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};

export default TableWsMhs;
