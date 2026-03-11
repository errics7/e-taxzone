import NumberFormat from "react-number-format";
import Tooltip from "@mui/material/Tooltip";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { find, remove } from "lodash";
import PopMenuRowAlokasiDasar from "../../componentglobal/PopMenuRowAlokasiDasar";
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
        textAlign: "right",
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

export default function TabelKunciJawaban(props) {
  const dasaralokasi = props.dasaralokasi;
  const kode = props.kode;

  const removeRowAlokasi = (uid) => {
    const temp = remove(dasaralokasi, (x) => x.uuid !== uid);
    props.setDataAlokasi(temp);
  };
  const dnominalkred = dasaralokasi.filter((x) => x.jenis === "kredit");

  return (
    <div className="p-1 border grid gap-1 bg-white">
      <div className="my-2 overflow-x-auto ">
        Data Kunci Jawaban:
        <table className="min-w-full mb-4">
          <thead>
            <tr className="break-words bg-slate-50">
              <th className="px-5 py-3 border max-w-10v table-cell">
                Kode Pusat biaya
              </th>

              <th className="px-2 py-3 border min-w-20v">Nominal</th>
              <th className="px-2 py-3 border">Posisi (Debit/kredit)</th>
            </tr>
          </thead>
          <tbody>
            {dasaralokasi.map((el, index) => {
              const folowcol = find(kode, (x) => x.uuid === el.idc);
              return (
                <tr key={index} className="text-center">
                  <td className="py-2 border">
                    <div className="px-0 flex items-center">
                      <div className="-ml-1">
                        <PopMenuRowAlokasiDasar
                          removeRow={() => removeRowAlokasi(el.uuid)}
                        />
                      </div>
                      <span className="text-base font-semibold">
                        {folowcol.alias}
                      </span>
                    </div>
                  </td>

                  <td className="px-2 py-2 min-w-25v border">
                    <div className="relative">
                      <TextField
                        value={el.value}
                        name="nilai"
                        fullWidth
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                        onChange={(event) => {
                          props.setDataAlokasi(
                            dasaralokasi.map((u, i) =>
                              el.uuid === u.uuid
                                ? {
                                    ...u,
                                    value: Number(event.target.value),
                                  }
                                : u
                            )
                          );
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2 border">
                    <Tooltip
                      title={`${
                        el.jenis === "kredit" && dnominalkred.length > 1
                          ? "Pastikan hanya ada 1 tipe Kredit"
                          : ""
                      }${
                        dnominalkred.length === 0
                          ? "Pastikan ada 1 tipe Kredit"
                          : ""
                      }`}
                      placement="right"
                      arrow
                    >
                      <FormControl
                        className={`w-full ${
                          el.jenis === "kredit" &&
                          dnominalkred.length > 1 &&
                          " px-2 bg-red-300 animate-pulse"
                        } ${
                          dnominalkred.length === 0 &&
                          " px-2 bg-red-300 animate-pulse"
                        }`}
                      >
                        <Select
                          value={el.jenis}
                          onChange={(event) => {
                            props.setDataAlokasi(
                              dasaralokasi.map((u, i) =>
                                el.uuid === u.uuid
                                  ? {
                                      ...u,
                                      jenis: event.target.value,
                                    }
                                  : u
                              )
                            );
                          }}
                          displayEmpty
                          fullWidth
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="kredit">Kredit</MenuItem>
                          <MenuItem value="debit">Debit</MenuItem>
                        </Select>
                      </FormControl>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
            {dasaralokasi.length === 0 && (
              <tr className="">
                <td colSpan="3" className="px-2 py-3 text-center table-cell">
                  <div className="font-extrabold relative">
                    <p className="absolute inset-0 z-50 table-cell h-10">
                      Pilih data kunci pada baris soal
                    </p>
                    <div className="bg-red-300 py-2 px-2 absolute inset-0 z-30 h-10 animate-pulse"></div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          {/* Dummy */}
          <tbody className="border">
            <tr className="">
              <td className="px-2 py-3  table-cell">&nbsp;</td>
              <td className="px-2 ">&nbsp;</td>
              <td className="px-2 ">&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
