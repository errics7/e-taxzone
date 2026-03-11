//#region import 
import NumberFormat from "react-number-format";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import { sumBy } from "lodash";
import { ShimmerSectionHeader } from "react-shimmer-effects";
import { ShimmerTable } from "react-shimmer-effects";
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
});
//#endregion

export default function LaporanBiayaMhs(props) {
  const checking = props.checking;
  const jawab1 = props.jawab1;
  const jawab2 = props.jawab2;
  const dataConfig = props.dataConfig;
  const dataPersediaan = props.dataPersediaan;

  const data1 = dataPersediaan.filter((el) => el.type === "1");
  const data2 = dataPersediaan.filter((el) => el.type === "2");

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString();
  };
  //#region Hitung total
  const total1 = sumBy(jawab1, (r) => r.value);
  const total2 = sumBy(jawab2, (r) => r.valtotbiaya);
  const totalbiayaunit = sumBy(jawab2, (r) => r.valbyunit);
  //#endregion

  return (
    <div className="w-full min-h-20v relative border bg-white">
      <div className="absolute opacity-50 italic font-semibold p-1 pr-2">
        Worksheet:
      </div>
      {dataConfig ? (
        <>
          <div className="flex flex-col items-center pt-4 pb-4 border-b">
            <div className="text-xl relative">
              {dataConfig ? dataConfig.namept : ""}
            </div>
            <div className="mt-5 text-xl relative">
              {dataConfig ? dataConfig.title : ""}
            </div>
            <div className="text-xl relative">
              {dataConfig ? dataConfig.subtitle : ""}
            </div>
          </div>
          <div className="px-3 pb-10 pt-4">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="font-semibold text-left text-base" colSpan="4">
                    <div className="inline relative">
                      {dataConfig ? dataConfig.subtable1 : ""}
                    </div>
                  </th>
                </tr>
                <tr>
                  <th className="min-w-25v ">&nbsp;</th>
                  <th className="min-w-10v max-w-10v border-l">Total Biaya</th>
                  <th className="min-w-10v max-w-10v border-l">Unit Ekuiv</th>
                  <th className="min-w-10v max-w-10v p-2 table-cell border-l border-r">
                    Biaya /Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="font-semibold text-left" colSpan="4">
                    Persediaan awal:
                  </th>
                </tr>
                {data1.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th className="border-b min-w-25v text-left py-1 relative">
                        <div>
                          <div className="relative pl-4 py-1">{item.name}</div>
                        </div>
                      </th>
                      <th className="border-l border-r border-b min-w-10v max-w-10v">
                        <div
                          className={`relative ${
                            checking &&
                            jawab1[index].error &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <Tooltip
                            title={
                              checking && jawab1[index].error
                                ? `Pastikan inputan nilai benar`
                                : ""
                            }
                            placement="top"
                          >
                            <TextField
                              value={jawab1[index] ? jawab1[index].value : 0}
                              onChange={(event) =>
                                props.setJawab1(
                                  jawab1.map((u, i) =>
                                    i === index
                                      ? {
                                          ...u,
                                          value: parseFloat(event.target.value),
                                        }
                                      : u
                                  )
                                )
                              }
                              name="debit"
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                          </Tooltip>
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                          />
                        </div>
                      </th>
                      <th className="border-l border-r border-b min-w-10v max-w-10v">
                        &nbsp;
                      </th>
                      <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell">
                        &nbsp;
                      </th>
                    </tr>
                  );
                })}
                <tr className="py-1.5">
                  <th className="min-w-25v text-left font-semibold relative">
                    <div className="border-b absolute inset-0 left-4 flex items-center">
                      Total Biaya persediaan awal
                    </div>
                  </th>
                  <th className="border-l border-r border-b p-0 min-w-10v max-w-10v">
                    <div className="w-full border-b -mb-1.5 text-base font-semibold">
                      {toRp(total1)}
                    </div>
                  </th>
                  <th className="border-b min-w-10v max-w-10v">&nbsp;</th>
                  <th className="border-b min-w-10v max-w-10v py-2 table-cell">
                    &nbsp;
                  </th>
                </tr>
                <tr className="py-1.5">
                  <th colSpan="4">&nbsp;</th>
                </tr>
                <tr>
                  <th className="font-semibold text-left" colSpan="4">
                    Biaya ditambahkan selama periode berjalan:
                  </th>
                </tr>
                {data2.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th className="border-b min-w-25v text-left py-1 relative">
                        <div>
                          <div className="relative pl-4">{item.name}</div>
                        </div>
                      </th>
                      <th className="border-l border-r border-b min-w-10v max-w-10v">
                        <div
                          className={`relative ${
                            checking &&
                            jawab2[index].error_valtotbiaya &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <Tooltip
                            title={
                              checking && jawab2[index].error_valtotbiaya
                                ? `Pastikan inputan nilai benar`
                                : ""
                            }
                            placement="top"
                          >
                            <TextField
                              value={
                                jawab2[index] ? jawab2[index].valtotbiaya : ""
                              }
                              onChange={(event) =>
                                props.setJawab2(
                                  jawab2.map((u, i) =>
                                    i === index
                                      ? {
                                          ...u,
                                          valtotbiaya: parseFloat(
                                            event.target.value
                                          ),
                                        }
                                      : u
                                  )
                                )
                              }
                              name="debit"
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                          </Tooltip>
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                          />
                        </div>
                      </th>
                      <th className="border-l border-r border-b min-w-10v max-w-10v">
                        <div
                          className={`relative ${
                            checking &&
                            jawab2[index].error_valekuiv &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <Tooltip
                            title={
                              checking && jawab2[index].error_valekuiv
                                ? `Pastikan inputan nilai benar`
                                : ""
                            }
                            placement="top"
                          >
                            <TextField
                              value={
                                jawab2[index] ? jawab2[index].valekuiv : ""
                              }
                              onChange={(event) =>
                                props.setJawab2(
                                  jawab2.map((u, i) =>
                                    i === index
                                      ? {
                                          ...u,
                                          valekuiv: parseFloat(
                                            event.target.value
                                          ),
                                        }
                                      : u
                                  )
                                )
                              }
                              name="debit"
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                          </Tooltip>
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                          />
                        </div>
                      </th>
                      <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell">
                        <div
                          className={`relative ${
                            checking &&
                            jawab2[index].error_valbyunit &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <Tooltip
                            title={
                              checking && jawab2[index].error_valbyunit
                                ? `Pastikan inputan nilai benar`
                                : ""
                            }
                            placement="top"
                          >
                            <TextField
                              value={
                                jawab2[index] ? jawab2[index].valbyunit : ""
                              }
                              onChange={(event) =>
                                props.setJawab2(
                                  jawab2.map((u, i) =>
                                    i === index
                                      ? {
                                          ...u,
                                          valbyunit: parseFloat(
                                            event.target.value
                                          ),
                                        }
                                      : u
                                  )
                                )
                              }
                              name="debit"
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                  fontSize: 15,
                                },
                              }}
                            />
                          </Tooltip>
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                          />
                        </div>
                      </th>
                    </tr>
                  );
                })}
                <tr className="py-1.5">
                  <th className="min-w-25v text-left font-semibold relative">
                    <div className="border-b absolute inset-0 left-4 flex items-center">
                      Total Biaya ditambahkan selama periode berjalan
                    </div>
                  </th>
                  <th className="border-l border-r border-b p-0 min-w-10v max-w-10v">
                    <div className="w-full border-b -mb-1.5 text-base font-semibold">
                      {toRp(total2)}
                    </div>
                  </th>
                  <th className="border-b min-w-10v max-w-10v">&nbsp;</th>
                  <th className="border-b min-w-10v max-w-10v py-2 table-cell">
                    &nbsp;
                  </th>
                </tr>
                <tr className="py-1.5">
                  <th colSpan="4">&nbsp;</th>
                </tr>
                <tr className="py-1.5">
                  <th className="min-w-25v text-left font-semibold relative">
                    <div className="border-b absolute inset-0 flex text-base items-center">
                      <div className="inline relative">
                        {dataConfig ? dataConfig.subtable2 : ""}
                      </div>
                    </div>
                  </th>
                  <th className="border-b p-0 min-w-10v max-w-10v">
                    <div className="w-full border-b pb-0.5 text-base font-semibold">
                      {toRp(total1 + total2)}
                    </div>
                  </th>
                  <th className="border-b min-w-10v max-w-10v">&nbsp;</th>
                  <th className="border-b min-w-10v max-w-10v py-1 pt-2 table-cell">
                    <div className="w-full border-b pb-0.5 text-base font-semibold">
                      {toRp(totalbiayaunit)}
                    </div>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <br />
          <ShimmerSectionHeader center />
          <ShimmerTable row={4} col={5} />;
        </>
      )}
    </div>
  );
}
