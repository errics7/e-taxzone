//#region import
import NumberFormat from "react-number-format";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import { sum, sumBy } from "lodash";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
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
            value: parseFloat(values.value),
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

export default function LaporanBiayaMhs18(props) {
  const dataConfig = props.dataConfig;
  const dataPersediaan = props.dataPersediaan;
  const jawab1 = props.jawab1;
  const jawab2 = props.jawab2;
  const checking = props.checking;
  const data1 = dataPersediaan.filter((el) => el.type === "1");
  const data2 = dataPersediaan.filter((el) => el.type === "2");
  const data3 = dataPersediaan.filter((el) => el.type === "3");
  const data4 = dataPersediaan.filter((el) => el.type === "4");
  // console.log("dataPersediaan", JSON.stringify(dataPersediaan));
  // console.log("jawab2", jawab2);

  //#region Other Func
  const gantijwb1 = (id, value, name) => {
    props.setJawab1(
      jawab1.map((u, i) =>
        i === id
          ? {
              ...u,
              [name]: value,
            }
          : u
      )
    );
  };
  const gantijwb2 = (id, value, name) => {
    props.setJawab2(
      jawab2.map((u, i) =>
        i === id
          ? {
              ...u,
              [name]: value,
            }
          : u
      )
    );
  };
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString();
  };
  const numWitComm = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  };
  const toLTous = (x) => {
    const num = parseFloat(x);
    return numWitComm(parseFloat(num.toFixed(2)));
  };
  //#endregion Other Func
  //#region Hitung total & Bi/Unit2
  const sunit = data1.length === data2.length ? true : false;
  const sunit4 = data2.length === data4.length ? true : false;
  var total1 = 0;
  var total2 = 0;
  var bunit2 = [];
  //exe
  data1.forEach((element) => {
    total1 += Number(element.valtotbiaya);
  });
  data2.forEach((element, index) => {
    total2 += Number(element.valtotbiaya);
    //for hitung biaya/unit
    if (sunit) {
      const d1 = data1[index].valtotbiaya;
      const d2 = element.valtotbiaya;
      //
      if (Number(element.valekuiv) === 0) {
        bunit2.push(0);
      } else {
        bunit2.push((Number(d1) + Number(d2)) / Number(element.valekuiv));
      }
    }
    // totalbiayaunit += Number(bunit);
  });
  //#endregion

  return (
    <div className="w-full min-h-20v relative border">
      <div className="absolute opacity-50 italic font-semibold p-1 pr-2">
        Worksheet:
      </div>
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
      {/* TABEL PRT 1 */}
      <div className="px-3 pb-8 pt-4 overflow-x-auto">
        <table className="border-collapse min-w-full table-fixed">
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
                <div className="relative">Persediaan awal:</div>
              </th>
            </tr>
            {data1.map((item, index) => {
              return (
                <tr key={index}>
                  <th className="border-b min-w-25v text-left py-1 relative">
                    <div>
                      <div className="relative pl-4 font-normal">
                        {item.name}
                      </div>
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div className="relative font-normal">
                      {"Rp " + toLTous(item.valtotbiaya)}
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
                <div className="relative">
                  Biaya ditambahkan selama periode berjalan:
                </div>
              </th>
            </tr>
            {data2.map((item, index) => {
              return (
                <tr key={index}>
                  <th className="border-b min-w-25v text-left py-1 relative">
                    <div>
                      <div className="relative pl-4 font-normal">
                        {item.name}
                      </div>
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div className="relative font-normal">
                      {"Rp " + toLTous(item.valtotbiaya)}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div className="relative text-center font-normal">
                      {toLTous(item.valekuiv)}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell">
                    <div className="font-normal">
                      {"Rp " + toLTous(bunit2[index])}
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
            <tr>
              <th className="min-w-25v text-left font-semibold relative">
                <div className="border-b absolute inset-0 flex text-base items-center">
                  <div className="inline relative">
                    {dataConfig ? dataConfig.subtable2 : ""}
                  </div>
                </div>
              </th>
              <th className="border-b border-l border-r p-0 min-w-10v max-w-10v py-1 pt-4 table-cell">
                <div className="w-full border-b pb-0.5 text-base font-semibold">
                  {toRp(total1 + total2)}
                </div>
              </th>
              <th className="border-b min-w-10v max-w-10v">&nbsp;</th>
              <th className="border-b border-l border-r min-w-10v max-w-10v py-1 pt-4 table-cell">
                <div className="w-full border-b pb-0.5 text-base font-semibold">
                  {toRp(sum(bunit2))}
                </div>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      {/* TABEL PRT 2 */}
      <div className="px-3 pb-8 overflow-x-auto">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th className="font-semibold text-left text-base min-w-25v">
                <div className="inline relative">
                  {dataConfig ? dataConfig.subtable3 : ""}
                </div>
              </th>
              <th className="min-w-10v max-w-10v border-l">Unit</th>
              <th className="min-w-7v max-w-7v border-l">% Penyelesaian</th>
              <th className="min-w-10v max-w-10v border-l">Unit Ekuiv.</th>
              <th className="min-w-10v max-w-10v border-l">Biaya /Unit</th>
              <th className="min-w-10v max-w-10v border-l">&nbsp;</th>
              <th className="min-w-10v max-w-10v p-2 table-cell border-l border-r">
                Total Biaya
              </th>
            </tr>
          </thead>
          <tbody className="group">
            {data3.map((item, index) => {
              return (
                <tr key={index}>
                  <th className="border-b min-w-25v text-left py-1 relative">
                    <div className="relative pl-4">{item.name}</div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div
                      className={`relative py-1.5 ${
                        checking &&
                        jawab1[index].err_unit &&
                        " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          checking && jawab1[index].err_unit
                            ? "Pastikan mengisi dengan nilai yang benar"
                            : ""
                        }
                        placement="top"
                      >
                        <TextField
                          value={
                            jawab1[index]
                              ? parseFloat(
                                  parseFloat(jawab1[index].val_unit).toFixed(2)
                                )
                              : parseFloat(parseFloat(0).toFixed(2))
                          }
                          onChange={(event) => {
                            gantijwb1(index, event.target.value, "val_unit");
                          }}
                          name="debit"
                          fullWidth
                          InputProps={{
                            // disableUnderline: true,
                            readOnly: checking,
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
                      {!checking && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                        />
                      )}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-7v max-w-7v">
                    <div
                      className={`relative py-1.5 px-0 lg:px-4 ${
                        checking &&
                        jawab1[index].err_penyelesaian &&
                        " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          checking && jawab1[index].err_penyelesaian
                            ? "Pastikan mengisi dengan nilai yang benar"
                            : ""
                        }
                        placement="top"
                      >
                        <Input
                          value={
                            jawab1[index]
                              ? parseFloat(
                                  parseFloat(
                                    jawab1[index].val_penyelesaian
                                  ).toFixed(2)
                                )
                              : parseFloat(0)
                          }
                          onChange={(event) =>
                            gantijwb1(
                              index,
                              parseFloat(event.target.value),
                              "val_penyelesaian"
                            )
                          }
                          endAdornment={
                            <InputAdornment position="end">%</InputAdornment>
                          }
                          disabled={checking}
                          inputProps={{
                            "aria-label": "weight",
                            style: { textAlign: "right" },
                            maxLength: 3,
                          }}
                        />
                      </Tooltip>
                      {!checking && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute inset-y-0 right-1 opacity-20"
                        />
                      )}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v font-normal">
                    <div
                      className={`relative py-1.5 ${
                        checking &&
                        jawab1[index].err_uekuiv &&
                        " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          checking && jawab1[index].err_uekuiv
                            ? "Pastikan mengisi dengan nilai yang benar"
                            : ""
                        }
                        placement="top"
                      >
                        <TextField
                          value={
                            jawab1[index]
                              ? parseFloat(
                                  parseFloat(jawab1[index].val_uekuiv).toFixed(
                                    2
                                  )
                                )
                              : parseFloat(0)
                          }
                          onChange={(event) => {
                            gantijwb1(index, event.target.value, "val_uekuiv");
                          }}
                          name="val_uekuiv"
                          fullWidth
                          InputProps={{
                            // disableUnderline: true,
                            readOnly: checking,
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
                      {!checking && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                        />
                      )}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell font-normal">
                    <div
                      className={`relative py-1.5 ${
                        checking &&
                        jawab1[index].err_biayaunit &&
                        " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          checking && jawab1[index].err_biayaunit
                            ? "Pastikan mengisi dengan nilai yang benar"
                            : ""
                        }
                        placement="top"
                      >
                        <TextField
                          value={
                            jawab1[index]
                              ? parseFloat(
                                  parseFloat(
                                    jawab1[index].val_biayaunit
                                  ).toFixed(2)
                                )
                              : parseFloat(0)
                          }
                          onChange={(event) => {
                            gantijwb1(
                              index,
                              event.target.value,
                              "val_biayaunit"
                            );
                          }}
                          name="val_biayaunit"
                          fullWidth
                          InputProps={{
                            // disableUnderline: true,
                            readOnly: checking,
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
                      {!checking && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                        />
                      )}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell">
                    &nbsp;
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell font-semibold">
                    {jawab1[index]
                      ? toRp(
                          parseFloat(
                            parseFloat(jawab1[index].val_uekuiv).toFixed(2)
                          ) *
                            parseFloat(
                              parseFloat(jawab1[index].val_biayaunit).toFixed(2)
                            )
                        )
                      : toRp(0)}
                  </th>
                </tr>
              );
            })}
            <tr>
              <th
                className="font-semibold text-left border-b py-1 pt-4"
                colSpan="7"
              >
                <div className="relative">Barang Dalam Proses Akhir:</div>
              </th>
            </tr>
            {data4.map((item, index) => {
              const stdown = index === data4.length - 1 ? false : true;
              //for hitung biaya/unit
              return (
                <tr key={index}>
                  <th className="border-b min-w-25v text-left py-1 relative">
                    <div className="relative pl-4">{item.name}</div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div
                      className={`relative py-1.5 ${
                        checking &&
                        jawab2[index].err_unit &&
                        " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          checking && jawab2[index].err_unit
                            ? "Pastikan mengisi dengan nilai yang benar"
                            : ""
                        }
                        placement="top"
                      >
                        <TextField
                          value={
                            jawab2[index]
                              ? parseFloat(
                                  parseFloat(jawab2[index].val_unit).toFixed(2)
                                )
                              : parseFloat(0)
                          }
                          onChange={(event) => {
                            gantijwb2(index, event.target.value, "val_unit");
                          }}
                          name="val_unit"
                          fullWidth
                          InputProps={{
                            // disableUnderline: true,
                            readOnly: checking,
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
                      {!checking && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                        />
                      )}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-7v max-w-7v">
                    <div
                      className={`relative py-1.5 px-0 lg:px-4 ${
                        checking &&
                        jawab2[index].err_penyelesaian &&
                        " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          checking && jawab2[index].err_penyelesaian
                            ? "Pastikan mengisi dengan nilai yang benar"
                            : ""
                        }
                        placement="top"
                      >
                        <Input
                          value={
                            jawab2[index]
                              ? parseFloat(
                                  parseFloat(
                                    jawab2[index].val_penyelesaian
                                  ).toFixed(2)
                                )
                              : parseFloat(0)
                          }
                          onChange={(event) =>
                            gantijwb2(
                              index,
                              parseFloat(event.target.value),
                              "val_penyelesaian"
                            )
                          }
                          endAdornment={
                            <InputAdornment position="end">%</InputAdornment>
                          }
                          disabled={checking}
                          inputProps={{
                            "aria-label": "weight",
                            style: { textAlign: "right" },
                            maxLength: 3,
                          }}
                        />
                      </Tooltip>
                      {!checking && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute inset-y-0 right-1 opacity-20"
                        />
                      )}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v font-normal">
                    <div
                      className={`relative py-1.5 ${
                        checking &&
                        jawab2[index].err_uekuiv &&
                        " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          checking && jawab2[index].err_uekuiv
                            ? "Pastikan mengisi dengan nilai yang benar"
                            : ""
                        }
                        placement="top"
                      >
                        <TextField
                          value={
                            jawab2[index]
                              ? parseFloat(
                                  parseFloat(jawab2[index].val_uekuiv).toFixed(
                                    2
                                  )
                                )
                              : parseFloat(0)
                          }
                          onChange={(event) => {
                            gantijwb2(index, event.target.value, "val_uekuiv");
                          }}
                          name="val_uekuiv"
                          fullWidth
                          InputProps={{
                            // disableUnderline: true,
                            readOnly: checking,
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
                      {!checking && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                        />
                      )}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell font-normal">
                    <div
                      className={`relative py-1.5 ${
                        checking &&
                        jawab2[index].err_biayaunit &&
                        " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          checking && jawab2[index].err_biayaunit
                            ? "Pastikan mengisi dengan nilai yang benar"
                            : ""
                        }
                        placement="top"
                      >
                        <TextField
                          value={
                            jawab2[index]
                              ? parseFloat(
                                  parseFloat(
                                    jawab2[index].val_biayaunit
                                  ).toFixed(2)
                                )
                              : parseFloat(0)
                          }
                          onChange={(event) => {
                            gantijwb2(
                              index,
                              event.target.value,
                              "val_biayaunit"
                            );
                          }}
                          name="val_biayaunit"
                          fullWidth
                          InputProps={{
                            // disableUnderline: true,
                            readOnly: checking,
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
                      {!checking && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                        />
                      )}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell">
                    {sunit4 ? (
                      <div
                        className={`relative py-1.5 ${
                          checking &&
                          jawab2[index].err_tot &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            checking && jawab2[index].err_tot
                              ? "Pastikan mengisi dengan nilai yang benar"
                              : ""
                          }
                          placement="top"
                        >
                          <TextField
                            value={
                              jawab2[index]
                                ? parseFloat(
                                    parseFloat(jawab2[index].val_tot).toFixed(2)
                                  )
                                : parseFloat(0)
                            }
                            onChange={(event) => {
                              gantijwb2(index, event.target.value, "val_tot");
                            }}
                            name="val_tot"
                            fullWidth
                            InputProps={{
                              // disableUnderline: true,
                              readOnly: checking,
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
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                          />
                        )}
                      </div>
                    ) : (
                      <Tooltip
                        title={`Pastikan jumlah data sesuai antara periode berjalan & proses akhir`}
                        placement="top"
                      >
                        <div className="text-red-400 font-semibold animate-pulse">
                          #N/A
                        </div>
                      </Tooltip>
                    )}
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell font-semibold">
                    {stdown ? (
                      <>&nbsp;</>
                    ) : (
                      toRp(sumBy(jawab2, (x) => x.val_tot))
                    )}
                  </th>
                </tr>
              );
            })}
            <tr>
              <th
                className="font-semibold text-left border-b py-1 pt-4"
                colSpan="6"
              >
                <div className="relative">
                  Total Biaya Dipertanggungjawabkan
                </div>
              </th>
              <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 font-semibold text-base table-cell">
                {toRp(
                  sumBy(jawab2, (x) => x.val_tot) +
                    parseFloat(
                      parseFloat(jawab1[0] ? jawab1[0].val_uekuiv : 0).toFixed(
                        2
                      )
                    ) *
                      parseFloat(
                        parseFloat(
                          jawab1[0] ? jawab1[0].val_biayaunit : 0
                        ).toFixed(2)
                      )
                )}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
