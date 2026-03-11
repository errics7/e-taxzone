import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
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

export default function KodeAlokasiMhs(props) {
  const jawab2 = props.jawab;

  return (
    <table className="w-full border-collapse bg-white">
      <tbody>
        <tr>
          <td className="border py-2 text-center font-semibold min-w-7v">
            No Akun
          </td>
          <td className="border py-2 text-center font-semibold min-w-15v max-w-15v">
            Debet (Rp)
          </td>
          <td className="border py-2 text-center font-semibold min-w-7v">
            No Akun
          </td>
          <td className="border py-2 text-center font-semibold min-w-15v max-w-15v">
            Kredit (Rp)
          </td>
        </tr>
        {jawab2 &&
          jawab2.map((el, i) => {
            return (
              <tr key={i}>
                <td className="border py-2 text-center font-semibold min-w-7v max-w-7v">
                  <Tooltip
                    title={
                      props.check && el.debit.noakun.error
                        ? "Pastikan anda mengisi di urutan yang benar"
                        : ""
                    }
                    placement="top"
                  >
                    <div
                      className={`${
                        props.check &&
                        el.debit.noakun.error &&
                        "bg-red-300 animate-pulse"
                      }`}
                    >
                      <TextField
                        value={
                          el.debit.noakun.value === 0
                            ? ""
                            : el.debit.noakun.value
                        }
                        placeholder={i === 0 ? "Jawab disini" : ""}
                        inputProps={{ style: { textAlign: "center" } }}
                        onChange={(event) => {
                          props.setJawab2(
                            jawab2.map((u, i) =>
                              el.uuid === u.uuid
                                ? {
                                    ...u,
                                    debit: {
                                      ...u.debit,
                                      noakun: {
                                        ...u.debit.noakun,
                                        value: event.target.value,
                                      },
                                    },
                                  }
                                : u
                            )
                          );
                        }}
                        className="text-left py-1 pl-1 rounded-sm"
                      />
                    </div>
                  </Tooltip>
                </td>
                <td className="border py-2 text-center font-semibold min-w-15v max-w-15v">
                  <Tooltip
                    title={
                      props.check && el.debit.nominal.error
                        ? "Pastikan anda mengisi di urutan yang benar"
                        : ""
                    }
                    placement="top"
                  >
                    <div
                      className={`${
                        props.check &&
                        el.debit.nominal.error &&
                        "bg-red-300 animate-pulse"
                      }`}
                    >
                      <TextField
                        value={
                          el.debit.nominal.value === 0
                            ? ""
                            : el.debit.nominal.value
                        }
                        placeholder={i === 0 ? "Jawab disini" : ""}
                        name="nilai"
                        fullWidth
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                        onChange={(event) => {
                          props.setJawab2(
                            jawab2.map((u, i) =>
                              el.uuid === u.uuid
                                ? {
                                    ...u,
                                    debit: {
                                      ...u.debit,
                                      nominal: {
                                        ...u.debit.nominal,
                                        value: Number(event.target.value),
                                      },
                                    },
                                  }
                                : u
                            )
                          );
                        }}
                      />
                    </div>
                  </Tooltip>
                </td>
                <td className="border py-2 text-center font-semibold min-w-7v max-w-7v">
                  <Tooltip
                    title={
                      props.check && el.kredit.noakun.error
                        ? "Pastikan anda mengisi di urutan yang benar"
                        : ""
                    }
                    placement="top"
                  >
                    <div
                      className={`${
                        props.check &&
                        el.kredit.noakun.error &&
                        "bg-red-300 animate-pulse"
                      }`}
                    >
                      <TextField
                        value={
                          el.kredit.noakun.value === 0
                            ? ""
                            : el.kredit.noakun.value
                        }
                        placeholder={i === 0 ? "Jawab disini" : ""}
                        inputProps={{ style: { textAlign: "center" } }}
                        onChange={(event) => {
                          props.setJawab2(
                            jawab2.map((u, i) =>
                              el.uuid === u.uuid
                                ? {
                                    ...u,
                                    kredit: {
                                      ...u.kredit,
                                      noakun: {
                                        ...u.kredit.noakun,
                                        value: event.target.value,
                                      },
                                    },
                                  }
                                : u
                            )
                          );
                        }}
                        className="text-left py-1 pl-1 rounded-sm"
                      />
                    </div>
                  </Tooltip>
                </td>
                <td className="border py-2 text-center font-semibold min-w-15v max-w-15v">
                  <Tooltip
                    title={
                      props.check && el.kredit.nominal.error
                        ? "Pastikan anda mengisi di urutan yang benar"
                        : ""
                    }
                    placement="top"
                  >
                    <div
                      className={`${
                        props.check &&
                        el.kredit.nominal.error &&
                        "bg-red-300 animate-pulse"
                      }`}
                    >
                      <TextField
                        value={
                          el.kredit.nominal.value === 0
                            ? ""
                            : el.kredit.nominal.value
                        }
                        placeholder={i === 0 ? "Jawab disini" : ""}
                        name="nilai"
                        fullWidth
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                        onChange={(event) => {
                          props.setJawab2(
                            jawab2.map((u, i) =>
                              el.uuid === u.uuid
                                ? {
                                    ...u,
                                    kredit: {
                                      ...u.kredit,
                                      nominal: {
                                        ...u.kredit.nominal,
                                        value: Number(event.target.value),
                                      },
                                    },
                                  }
                                : u
                            )
                          );
                        }}
                      />
                    </div>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
