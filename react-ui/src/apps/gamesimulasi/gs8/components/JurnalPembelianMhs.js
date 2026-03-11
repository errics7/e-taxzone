import EditIcon from "@mui/icons-material/Edit";
import { TextField } from "@mui/material";
import { forwardRef } from "react";
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
      style={{ textAlign: "center" }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

export default function JurnalPembelianMhs(props) {
  const jawab = props.datajawab;
  const data = props.data;
  const validate = props.validate;

  return (
    <div className="bg-white py-3 overflow-x-auto">
      Worksheet :
      <table className="border-collapse w-full text-center">
        <thead>
          <tr>
            <th
              colSpan="12"
              className="p-8 text-lg border border-slate-300 uppercase"
            >
              Jurnal pembelian
            </th>
          </tr>
          <tr>
            <th
              rowSpan="4"
              className="p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Tanggal
            </th>
            <th
              rowSpan="4"
              className="p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Nama Rekening
            </th>
            <th
              rowSpan="4"
              className="p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              No Bukti
            </th>
            <th
              colSpan="6"
              className="p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              DEBET
            </th>
            <th
              colSpan="3"
              className="p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              KREDIT
            </th>
          </tr>
          <tr className="w-full border bg-slate-50">
            <td className="p-1 border">Persediaan</td>
            <td className="p-1 border">Persediaan</td>
            <td className="p-1 border">Persediaan</td>
            <td className="p-1 border">Persekot</td>
            <td colSpan="2" className="p-1 border">
              Lain-lain
            </td>
            <td className="p-1 border">Hutang</td>
            <td colSpan="2" className="p-1 border">
              Lain-lain
            </td>
          </tr>
          <tr className="border bg-slate-50">
            <td className="p-1 border">BB</td>
            <td className="p-1 border">Bh Bakar</td>
            <td className="p-1 border">Lain-lain</td>
            <td className="p-1 border">PPN</td>
            <td className="p-1 border">No Rek</td>
            <td className="p-1 border">Jumlah</td>
            <td className="p-1 border">Dagang</td>
            <td className="p-1 border">No Rek</td>
            <td className="p-1 border">Jumlah</td>
          </tr>
          <tr className="border bg-white">
            <td className="py-2 border">{data && data.kpbb1}</td>
            <td className="p-2 border">035</td>
            <td className="p-2 border">036</td>
            <td className="p-2 border">{data && data.kpppn1}</td>
            <td className="p-2 border">&nbsp;</td>
            <td className="p-2 border">&nbsp;</td>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white hover:bg-slate-100">
            <td className="py-2 px-1 text-center border relative min-w-15v max-w-15v">
              <div className="relative px-0">
                <input
                  value={jawab ? jawab.tanggal.value : ""}
                  placeholder="Tanggal"
                  onChange={(event) => {
                    //edited row & REGEX number
                    props.setjawab({
                      ...jawab,
                      tanggal: {
                        ...jawab.tanggal,
                        value: event.target.value,
                      },
                    });
                  }}
                  className={`bg-white text-center py-1 w-full ${
                    validate &&
                    !jawab.tanggal.status &&
                    " animate-pulse bg-red-300 rounded"
                  }`}
                  readOnly={validate}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                />
              </div>
            </td>
            <td className="py-2 px-2 text-left border min-w-15v max-w-15v">
              <div className="relative px-0">
                <input
                  value={jawab ? jawab.namarek.value : ""}
                  placeholder="Nama rekening"
                  onChange={(event) => {
                    //edited row & REGEX number
                    props.setjawab({
                      ...jawab,
                      namarek: {
                        ...jawab.namarek,
                        value: event.target.value,
                      },
                    });
                  }}
                  className={`text-left py-1 pl-1 bg-white w-full   ${
                    validate &&
                    !jawab.namarek.status &&
                    " animate-pulse bg-red-300 rounded"
                  }`}
                  readOnly={validate}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                />
              </div>
            </td>
            <td className="py-2 px-1 border min-w-15v max-w-15v">
              <div className="relative px-0">
                <input
                  value={jawab ? jawab.nobukti.value : ""}
                  placeholder="No bukti"
                  onChange={(event) => {
                    //edited row & REGEX number
                    props.setjawab({
                      ...jawab,
                      nobukti: {
                        ...jawab.nobukti,
                        value: event.target.value,
                      },
                    });
                  }}
                  className={`bg-white text-left py-1 pl-1 w-full ${
                    validate &&
                    !jawab.nobukti.status &&
                    " animate-pulse bg-red-300 rounded"
                  }`}
                  readOnly={validate}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                />
              </div>
            </td>
            <td className="border min-w-10v max-w-10v">
              <div className="relative px-0">
                <TextField
                  placeholder="Persediaan"
                  fullWidth
                  margin="none"
                  value={jawab ? jawab.persediaan.value : ""}
                  name="persediaan"
                  onChange={(event) => {
                    props.setjawab({
                      ...jawab,
                      persediaan: {
                        ...jawab.persediaan,
                        value: event.target.value.replace(/\D/, ""),
                      },
                    });
                  }}
                  InputProps={{
                    disableUnderline: true,
                    readOnly: validate,
                    inputComponent: NumberFormatCustom,
                  }}
                  className={`bg-white text-center py-1 w-full ${
                    validate &&
                    !jawab.persediaan.status &&
                    " animate-pulse bg-red-300 rounded"
                  }`}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 opacity-30 absolute inset-y-0 -right-1"
                />
              </div>
            </td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">
              <div className="relative px-0">
                <TextField
                  placeholder="PPN"
                  fullWidth
                  margin="none"
                  value={jawab ? jawab.persekot.value : ""}
                  name="persediaan"
                  onChange={(event) => {
                    props.setjawab({
                      ...jawab,
                      persekot: {
                        ...jawab.persekot,
                        value: event.target.value.replace(/\D/, ""),
                      },
                    });
                  }}
                  InputProps={{
                    disableUnderline: true,
                    readOnly: validate,
                    inputComponent: NumberFormatCustom,
                  }}
                  className={`bg-white text-center py-1 pl-1 w-full  ${
                    validate &&
                    !jawab.persekot.status &&
                    " animate-pulse bg-red-300 rounded"
                  }`}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                />
              </div>
            </td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">
              <div className="relative px-0">
                <TextField
                  placeholder="Total"
                  fullWidth
                  margin="none"
                  value={jawab ? jawab.hutang.value : ""}
                  name="persediaan"
                  onChange={(event) => {
                    props.setjawab({
                      ...jawab,
                      hutang: {
                        ...jawab.hutang,
                        value: event.target.value.replace(/\D/, ""),
                      },
                    });
                  }}
                  InputProps={{
                    disableUnderline: true,
                    readOnly: validate,
                    inputComponent: NumberFormatCustom,
                  }}
                  className={`bg-white text-center py-1 pl-1 w-full ${
                    validate &&
                    !jawab.hutang.status &&
                    " animate-pulse bg-red-300 rounded"
                  }`}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                />
              </div>
            </td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
          </tr>
          {/* Abv Dummy */}
          <tr className="bg-white hover:bg-slate-100">
            <td className="py-2 border min-w-15v max-w-15v">&nbsp;</td>
            <td className="py-2 border min-w-15v max-w-15v">&nbsp;</td>
            <td className="py-2 border min-w-15v max-w-15v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
            <td className="p-1 border min-w-10v max-w-10v">&nbsp;</td>
          </tr>
        </tbody>
      </table>
      {/* Tabel Rekapitulasi */}
      <table className="border-collapse w-4/12 mt-4">
        <thead>
          <tr>
            <th colSpan="3" className="p-3 border border-slate-300 uppercase">
              Rekapitulasi
            </th>
          </tr>
          <tr>
            <th className="w-4/12 p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              No Rek
            </th>
            <th className="w-4/12 p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Debit
            </th>
            <th className="w-4/12 p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Kredit
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            <td className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative">
              <div className="relative px-1">&nbsp;</div>
            </td>
            <td className="py-1 px-2 text-left border border-b">
              <div className="relative">&nbsp;</div>
            </td>
            <td className="py-1 px-1 text-center border border-b">
              <div className="relative px-3">&nbsp;</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
