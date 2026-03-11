import NumberFormat from "react-number-format";
import Tooltip from "@mui/material/Tooltip";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { find, remove } from "lodash";
import PopMenuRowAlokasiDasar from "./PopMenuRowAlokasiDasar";
import InfoIcon from "@mui/icons-material/Info";
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

export default function DasarAlokasi(props) {
  const dasaralokasi = props.dasaralokasi;
  const kode = props.kode;

  const removeRowAlokasi = (uid) => {
    const temp = remove(dasaralokasi, (x) => x.uuid !== uid);
    props.setDataAlokasi(temp);
  };
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const dnominal = dasaralokasi.filter((x) => x.mode === "nominal");

  return (
    <div className="p-1 border grid gap-1 bg-white">
      <div className="my-2 overflow-x-auto ">
        Data Kunci Jawaban:
        <table className="mb-4">
          <thead>
            <tr>
              <th
                colSpan="3"
                className=" p-2 py-2  border table-cell text-left font-bold text-base"
              >
                DASAR ALOKASI ->
              </th>
            </tr>
            <tr className="break-words bg-slate-50">
              <th className="px-5 py-3 border table-cell"></th>
              <th className="px-5 py-3 border table-cell relative">
                <Tooltip
                  title="Keterangan ini sebagai informasi alokasi soal pada mahasiswa"
                  placement="right"
                >
                  <div>
                    Keterangan
                    <InfoIcon
                      style={{ width: 20 }}
                      className="absolute inset-y-0 right-0 opacity-30"
                    />
                  </div>
                </Tooltip>
              </th>
              <th className="px-2 py-3 border">Tipe</th>
              <th className="px-2 py-3 border">Nilai</th>
              <th className="px-5 py-3 border">Alokasi (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {dasaralokasi.map((el, index) => {
              const folowcol = find(kode, (x) => x.uuid === el.idc);
              return (
                <tr key={index} className="text-center">
                  <td className="px-2 py-2 border table-cell">
                    <PopMenuRowAlokasiDasar
                      removeRow={() => removeRowAlokasi(el.uuid)}
                    />
                  </td>
                  <td className="px-2 py-1 min-w-20v border table-cell">
                    <div className="flex justify-between items-center pad">
                      <TextField
                        label={"-> " + folowcol.alias}
                        value={el.keterangan}
                        placeholder="Keterangan Alokasi"
                        name="keterangan"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(event) => {
                          props.setDataAlokasi(
                            dasaralokasi.map((u, i) =>
                              el.uuid === u.uuid
                                ? {
                                    ...u,
                                    keterangan: event.target.value,
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
                        el.mode === "nominal" && dnominal.length > 1
                          ? "Pastikan hanya ada 1 tipe Nominal"
                          : ""
                      }${
                        dnominal.length === 0
                          ? "Pastikan ada 1 tipe Nominal"
                          : ""
                      }`}
                      placement="right"
                    >
                      <FormControl
                        className={` ${
                          el.mode === "nominal" &&
                          dnominal.length > 1 &&
                          " bg-red-300 animate-pulse"
                        } ${
                          dnominal.length === 0 && " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Select
                          value={el.mode}
                          onChange={(event) => {
                            props.setDataAlokasi(
                              dasaralokasi.map((u, i) =>
                                el.uuid === u.uuid
                                  ? {
                                      ...u,
                                      mode: event.target.value,
                                    }
                                  : u
                              )
                            );
                          }}
                          displayEmpty
                          fullWidth
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="nominal">Nominal</MenuItem>
                          <MenuItem value="persentase">Persentase</MenuItem>
                        </Select>
                      </FormControl>
                    </Tooltip>
                  </td>
                  <td className="px-2 py-2 min-w-15v border">
                    <div className="relative">
                      {el.mode === "nominal" ? (
                        <>
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
                        </>
                      ) : (
                        <Input
                          value={el.value}
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
                          endAdornment={
                            <InputAdornment position="end">%</InputAdornment>
                          }
                          className="text-center"
                          inputProps={{
                            "aria-label": "weight",
                            style: { textAlign: "right" },
                          }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-2 min-w-15v border">
                    {el.mode === "nominal" ? (
                      <div className="relative text-right">
                        {el.value < 0 ? (
                          <>({toRp(Math.abs(el.value))})</>
                        ) : (
                          toRp(Math.abs(el.value))
                        )}
                      </div>
                    ) : (
                      <div className="relative text-right">
                        {dnominal.length > 0
                          ? toRp(Math.abs((el.value / 100) * dnominal[0].value))
                          : "-"}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Dummy */}
          <tbody className="border">
            <tr className="">
              <td className="px-2 py-3  table-cell">&nbsp;</td>
              <td className="px-2 ">&nbsp;</td>
              <td className="px-2 ">&nbsp;</td>
              <td className="px-2 ">&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
