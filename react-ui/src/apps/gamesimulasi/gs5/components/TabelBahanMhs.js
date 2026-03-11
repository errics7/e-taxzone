import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import { Tooltip } from "@mui/material";
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
      style={{
        textAlign: "center",
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

export default function TabelBahanMhs(props) {
  const dataSoal = props.data ? props.data : [];

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th
              rowSpan="2"
              className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Bahan Nama
            </th>
            <th
              colSpan="3"
              className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Kwantitas
            </th>
            <th
              colSpan="2"
              className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Harga Pokok
            </th>
            <th
              rowSpan="2"
              className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Keperluan
            </th>
          </tr>
          <tr>
            <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Sat
            </th>
            <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Diminta
            </th>
            <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Keluar
            </th>
            <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              /sat (Rp)
            </th>
            <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Jumlah (Rp)
            </th>
          </tr>
        </thead>
        <tbody>
          {dataSoal &&
            dataSoal.map((item, index) => (
              <tr key={index} className="bg-white mb-10">
                <td className="min-w-10v max-w-10v p-3 text-slate-800 text-left text-base border">
                  {item.namabhn}
                </td>
                <td className="min-w-5v max-w-5v p-3 text-slate-800 text-center text-base border">
                  {item.satuan}
                </td>
                <td className="min-w-5v max-w-5v p-3 text-slate-800 text-center text-base border">
                  {item.dimintaqty}
                </td>
                <td className="min-w-5v max-w-5v p-3 text-slate-800 text-center text-base border">
                  {item.keluarqty}
                </td>
                <td className="min-w-10v max-w-10v py-3 text-slate-800 text-center text-base border">
                  {item.status ? (
                    <div
                      className={`relative ${
                        props.validate &&
                        props.jawab.err_satuan &&
                        " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          props.validate && props.jawab.err_satuan
                            ? "Jawaban Tidak sesuai, isi dengan jawaban yang benar"
                            : ""
                        }
                      >
                        <TextField
                          value={
                            props.jawab.satuan === 0 ? "" : props.jawab.satuan
                          }
                          placeholder="Jawab Disini"
                          name="satuan"
                          fullWidth
                          InputProps={{
                            readOnly: props.validate,
                            disableUnderline: true,
                            inputComponent: NumberFormatCustom,
                          }}
                          onChange={(event) => {
                            props.setJawab({
                              ...props.jawab,
                              satuan: event.target.value,
                            });
                          }}
                        />
                      </Tooltip>
                      {!props.validate && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 right-2 opacity-40"
                        />
                      )}
                    </div>
                  ) : (
                    toRp(item.hrgsatuan)
                  )}
                </td>
                <td className="min-w-10v max-w-10v py-3 text-slate-800 text-center text-base border">
                  {item.status ? (
                    <div
                      className={`relative ${
                        props.validate &&
                        props.jawab.err_satuan &&
                        " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          props.validate && props.jawab.err_satuan
                            ? "Jawaban Tidak sesuai isi, dengan jawaban yang benar"
                            : ""
                        }
                      >
                        <TextField
                          value={
                            props.jawab.jumlah === 0 ? "" : props.jawab.jumlah
                          }
                          placeholder="Jawab Disini"
                          name="jumlah"
                          fullWidth
                          InputProps={{
                            readOnly: props.validate,
                            disableUnderline: true,
                            inputComponent: NumberFormatCustom,
                          }}
                          onChange={(event) => {
                            props.setJawab({
                              ...props.jawab,
                              jumlah: event.target.value,
                            });
                          }}
                        />
                      </Tooltip>
                      {!props.validate && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 right-2 opacity-40"
                        />
                      )}
                    </div>
                  ) : (
                    toRp(item.hrgjumlah)
                  )}
                </td>
                <td className="min-w-10v max-w-10v p-3 text-slate-800 text-center text-base border">
                  {item.keperluan}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
