import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import InlinePopInput from "./InlinePopInput";
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

export default function BuktiMemorialGs13(props) {
  const config = props.config;
  const jawab = props.jawab;

  const dnominalkred = jawab && jawab.filter((x) => x.jenis === "kredit");

  return (
    <div className="">
      <div className="mx-1 mb-3 p-3 border border-dashed">
        <div className="">
          <div className="inline pr-3 relative font-semibold">
            {config ? config.namept : ""}
          </div>
          <div className="inline">( ) Harian ( ) Penyesuaian</div>
        </div>
        <br />
        <h1 className="mt-5 mx-auto text-center text-2xl font-semibold">
          BUKTI MEMORIAL
        </h1>
        <div className="mx-auto text-sm text-center">
          <div>
            <div className="inline">NO. BM:</div>
            <div className="inline pr-3 relative">
              {config ? config.nobm : ""}
            </div>
          </div>
        </div>
        <div className="mt-3 mb-2">
          <div className="inline">{config ? config.narasibuktimemo : ""}</div>
          <div className="inline ml-1">
            <InlinePopInput
              value={dnominalkred && dnominalkred[0].value}
              seterror={props.check && dnominalkred[0].error}
              onChange={(event) => {
                props.setJawab(
                  jawab.map((u, i) =>
                    dnominalkred[0].uuid === u.uuid
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
          <div className="inline pl-1">dialokasikan ke:</div>
        </div>
        <table className="border-collapse w-full">
          <tbody>
            {jawab &&
              jawab
                .filter((x) => x.jenis !== "kredit")
                .map((item, index) => (
                  <tr key={index}>
                    <td className="w-3/5 p-2 px-3 text-left border border-slate-300 table-cell">
                      {item.keterangan}
                    </td>
                    <td className="w-2/5 p-2 text-right border border-slate-300 table-cell">
                      <div
                        className={`relative px-1 border-b hover:border-blue-200 ${
                          props.check &&
                          item.error &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            props.check && item.error
                              ? "Pastikan anda mengisi dengan benar"
                              : ""
                          }
                          placement="top"
                        >
                          <TextField
                            value={item.value}
                            name="nilai"
                            fullWidth
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                            onChange={(event) => {
                              props.setJawab(
                                jawab.map((u, i) =>
                                  item.uuid === u.uuid
                                    ? {
                                        ...u,
                                        value: Number(event.target.value),
                                      }
                                    : u
                                )
                              );
                            }}
                          />
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
