import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import { forwardRef } from "react";

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
    />
  );
});

export default function UiMutasiKeluarAdmin(props) {
  const dataC = props.dataC;
  const data = props.selected;

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
    <div className="w-full min-h-20v relative mt-5 bg-white">
      <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
        Tampilan Worksheet :
      </div>
      <div className="border border-dashed p-3 min-h-1/4 w-full ">
        <div className="text-lg uppercase font-semibold mb-5 mt-5">
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
              <Tooltip title="Jawaban isian benar Mahasiswa" placement="right">
                <span className="bg-amber-50 px-2">{data && data.namabhn}</span>
              </Tooltip>
            </div>
          </div>
        </div>
        <br />
        <div className="overflow-x-auto">
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th
                  rowSpan="2"
                  className="font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Tanggal
                </th>
                <th
                  rowSpan="2"
                  className="font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Keterangan
                </th>
                <th
                  rowSpan="2"
                  className="font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  No Bukti
                </th>
                <th
                  colSpan="3"
                  className="font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Masuk
                </th>
                <th
                  colSpan="3"
                  className="font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Keluar
                </th>
                <th
                  colSpan="3"
                  className="py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Saldo
                </th>
              </tr>
              <tr>
                <th className="py-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kwt
                </th>
                <th className="min-w-5v max-w-5v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Harga
                </th>
                <th className="min-w-5v max-w-5v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jumlah
                </th>
                <th className="font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kwt
                </th>
                <th className="min-w-5v max-w-5v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Harga
                </th>
                <th className="min-w-5v max-w-5v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jumlah
                </th>
                <th className="font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kwt
                </th>
                <th className="min-w-5v max-w-5v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Harga
                </th>
                <th className="min-w-5v max-w-5v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jumlah
                </th>
              </tr>
            </thead>
            {/* Body */}
            <tbody>
              <tr>
                <td className="border border-slate-300 text-center">
                  <div className="relative">
                    <input
                      value={dataC ? dataC.tgl_mutasikeluar : ""}
                      onChange={(event) => {
                        //edited row
                        props.setdata({
                          ...dataC,
                          tgl_mutasikeluar: event.target.value,
                        });
                      }}
                      className="text-center min-w-15v max-w-15v"
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-50"
                    />
                  </div>
                </td>
                <td className="min-w-15v max-w-15v p-3 border border-slate-300">
                  Saldo Awal
                </td>
                <td className="min-w-15v max-w-15v border border-slate-300">
                  &nbsp;
                </td>
                <td className="min-w-7v max-w-7v border border-slate-300">
                  &nbsp;
                </td>
                <td className="min-w-10v max-w-10v border border-slate-300">
                  &nbsp;
                </td>
                <td className="min-w-10v max-w-10v border border-slate-300">
                  &nbsp;
                </td>
                <td className="min-w-7v max-w-7v border border-slate-300">
                  &nbsp;
                </td>
                <td className="min-w-10v max-w-10v border border-slate-300">
                  &nbsp;
                </td>
                <td className="min-w-10v max-w-10v border border-slate-300">
                  &nbsp;
                </td>
                <td className="min-w-10v max-w-10v border border-slate-300">
                  <div className="relative">
                    <TextField
                      placeholder="kwantitas"
                      name="sal_harga"
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center" },
                      }}
                      value={dataC ? dataC.sal_kwt : 0}
                      onChange={(event) => {
                        //edited row
                        props.setdata({
                          ...dataC,
                          sal_kwt: event.target.value,
                        });
                      }}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                        disableUnderline: true,
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-1 left-0 opacity-50"
                    />
                  </div>
                </td>
                <td className="min-w-10v max-w-10v border border-slate-300">
                  <div className="relative">
                    <TextField
                      placeholder="harga"
                      value={dataC ? dataC.sal_harga : 0}
                      name="sal_harga"
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center" },
                      }}
                      onChange={(event) => {
                        //edited row
                        props.setdata({
                          ...dataC,
                          sal_harga: event.target.value,
                        });
                      }}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                        disableUnderline: true,
                      }}
                    />
                  </div>
                </td>
                <td className="min-w-10v max-w-10v border border-slate-300">
                  <div className="relative">
                    <TextField
                      placeholder="jumlah"
                      value={dataC ? dataC.sal_jumlah : 0}
                      name="sal_jumlah"
                      prefix=""
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center" },
                      }}
                      onChange={(event) => {
                        //edited row
                        props.setdata({
                          ...dataC,
                          sal_jumlah: event.target.value,
                        });
                      }}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                        disableUnderline: true,
                      }}
                    />
                  </div>
                </td>
              </tr>
              {/* data main */}
              <tr>
                <td className="border border-slate-300 text-center">
                  <div className="bg-amber-50 py-1">
                    {dataC && dataC.info_tglbgudang}
                  </div>
                </td>
                <td className="border border-slate-300 p-1">
                  <div className="bg-amber-50 p-2">
                    {data && data.keperluan}
                  </div>
                </td>
                <td className="border border-slate-300 text-center">
                  <div className="bg-amber-50 p-1">{dataC && dataC.nobppb}</div>
                </td>
                <td className="border border-slate-300"> &nbsp;</td>
                <td className="border border-slate-300"> &nbsp;</td>
                <td className="border border-slate-300"> &nbsp;</td>
                <td className="border border-slate-300 text-center p-1">
                  <div className="bg-amber-50 p-2">
                    {data && toPuluhan(data.keluarqty)}
                  </div>
                </td>
                <td className="border border-slate-300 text-center p-1">
                  <div className="bg-amber-50 p-2">
                    {data && toPuluhan(data.hrgsatuan)}
                  </div>
                </td>
                <td className="border border-slate-300 text-center p-1">
                  <div className="bg-amber-50 p-2">
                    {data &&
                      toPuluhan(
                        Number(data.keluarqty) * Number(data.hrgsatuan)
                      )}
                  </div>
                </td>
                <td className="border border-slate-300 text-center">
                  {data &&
                    dataC &&
                    toPuluhan(Number(dataC.sal_kwt) - Number(data.keluarqty))}
                </td>
                <td className="border border-slate-300 text-center">
                  {data && toPuluhan(data.hrgsatuan)}
                </td>
                <td className="border border-slate-300 text-center">
                  {data &&
                    dataC &&
                    toPuluhan(
                      (dataC.sal_kwt - data.keluarqty) * data.hrgsatuan
                    )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
