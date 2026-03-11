//#region import
import { v4 as uuidv4 } from "uuid";
import NumberFormat from "react-number-format";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import { sum, remove, findIndex } from "lodash";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";

import {
  InputGrowUpTextH2,
  InputGrowUpTextH1,
} from "../../componentglobal/InputGrowUpTextH";
import PopMenuRowLaporanBiaya from "./PopMenuRowLaporanBiaya";
import { InputGrowUpSubTable } from "./InputGrowUpSubTable";
import PopMenuRowHeadLaporanBiaya from "./PopMenuRowHeadLaporanBiaya";
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
    />
  );
});
//#endregion

export default function LaporanBiayaAdmin(props) {
  const dataConfig = props.dataConfig;
  const dataPersediaan = props.dataPersediaan;
  const data1 = dataPersediaan.filter((el) => el.type === "1");
  const data2 = dataPersediaan.filter((el) => el.type === "2");
  const data3 = dataPersediaan.filter((el) => el.type === "3");
  const data4 = dataPersediaan.filter((el) => el.type === "4");
  // console.log("dataPersediaan", JSON.stringify(dataPersediaan));
  // console.log("l", uuidv4());

  const ganti = (uuid, value, name) => {
    props.setDataPersediaan(
      dataPersediaan.map((u, i) =>
        u.uuid === uuid
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
    return numWitComm(parseFloat(x.toFixed(2)));
  };
  const removePersediaan = (uid) => {
    const temp = remove(dataPersediaan, (x) => x.uuid !== uid);
    props.setDataPersediaan([...temp]);
  };
  const swapArrayLocs = (arr, index1, index2) => {
    var arry = [...arr];
    var temp = arry[index1];

    arry[index1] = arry[index2];
    arry[index2] = temp;
    return arry;
  };
  const move1 = (A1, A2) => {
    const p1 = findIndex(data1, { uuid: A1.uuid });
    const p2 = findIndex(data1, { uuid: A2.uuid });
    props.setDataPersediaan([
      ...swapArrayLocs(data1, p1, p2),
      ...data2,
      ...data3,
      ...data4,
    ]);
  };
  const move2 = (A1, A2) => {
    const p1 = findIndex(data2, { uuid: A1.uuid });
    const p2 = findIndex(data2, { uuid: A2.uuid });
    props.setDataPersediaan([
      ...data1,
      ...swapArrayLocs(data2, p1, p2),
      ...data3,
      ...data4,
    ]);
  };
  const move4 = (A1, A2) => {
    const p1 = findIndex(data4, { uuid: A1.uuid });
    const p2 = findIndex(data4, { uuid: A2.uuid });
    props.setDataPersediaan([
      ...data1,
      ...data2,
      ...data3,
      ...swapArrayLocs(data4, p1, p2),
    ]);
  };
  const dataPersediaanBaru1 = (p, typ) => {
    const da = [...data1];
    da.splice(p + 1, 0, {
      uuid: uuidv4(),
      eluid: "xxxx",
      name: "",
      valtotbiaya: 0,
      valekuiv: 0,
      valbiayaunit: 0,
      type: typ,
    });
    const a = [...da, ...data2, ...data3, ...data4];
    props.setDataPersediaan(a);
  };
  const dataPersediaanBaru2 = (p, typ) => {
    const da = [...data2];
    da.splice(p + 1, 0, {
      uuid: uuidv4(),
      eluid: "xxxx",
      name: "",
      valtotbiaya: 0,
      valekuiv: 0,
      valbiayaunit: 0,
      type: typ,
    });
    const a = [...data1, ...da, ...data3, ...data4];
    props.setDataPersediaan(a);
  };
  const dataPersediaanBaru4 = (p, typ) => {
    const da = [...data4];
    da.splice(p + 1, 0, {
      uuid: uuidv4(),
      eluid: "xxxx",
      name: "",
      valekuiv: 0,
      valbiayaunit: 0,
      valtotbiaya: 0,
      type: typ,
    });
    const a = [...data1, ...data2, ...data3, ...da];
    props.setDataPersediaan(a);
  };
  //#region Hitung total & Bi/Unit2
  const sunit = data1.length === data2.length ? true : false;
  const sunit4 = data2.length === data4.length ? true : false;
  var total1 = 0;
  var total2 = 0;
  var bunit2 = [];
  var totall3 = 0;
  var totbunit3 = [];
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
  data3.forEach((element, index) => {
    if (index === data3.length - 1) {
      totall3 =
        Number(element.valbiayaunit) *
        (100 / Number(element.valekuiv)) *
        sum(bunit2);
    }
  });
  data4.forEach((element, index) => {
    //for hitung total4
    if (sunit) {
      const x =
        parseFloat(
          Number(element.valbiayaunit) * (Number(element.valekuiv) / 100)
        ).toFixed(2) * parseFloat(bunit2[index]).toFixed(2);

      totbunit3.push(parseFloat(parseFloat(x).toFixed(2)));
    }
    // totalbiayaunit += Number(bunit);
  });
  //#endregion

  return (
    <div className="w-full min-h-20v relative border bg-white">
      <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
        Tampilan Worksheet:
      </div>
      <div className="flex flex-col items-center pt-4 pb-4 border-b">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.namept : ""}
            onChange={(text) =>
              props.setDataConfig({ ...dataConfig, namept: text })
            }
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute -inset-y-1 -right-2 opacity-50"
          />
        </div>
        <div className="mt-5 text-xl relative">
          <InputGrowUpTextH2
            value={dataConfig.title}
            onChange={(text) =>
              props.setDataConfig({ ...dataConfig, title: text })
            }
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute -inset-y-1 -right-2 opacity-50"
          />
        </div>
        <div className="text-xl relative">
          <InputGrowUpTextH2
            value={dataConfig.subtitle}
            onChange={(text) =>
              props.setDataConfig({ ...dataConfig, subtitle: text })
            }
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute -inset-y-1 -right-2 opacity-50"
          />
        </div>
      </div>
      {/* TABEL PRT 1 */}
      <div className="px-3 pb-8 pt-4 overflow-x-auto">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th className="font-semibold text-left text-base" colSpan="4">
                <div className="inline relative">
                  <InputGrowUpSubTable
                    value={dataConfig.subtable1}
                    onChange={(text) =>
                      props.setDataConfig({
                        ...dataConfig,
                        subtable1: text,
                      })
                    }
                  />{" "}
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute -inset-y-1 right-0 opacity-50"
                  />
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
                <div className="relative">
                  <div className="absolute inset-y-0 -left-5 flex items-center z-50">
                    <PopMenuRowHeadLaporanBiaya
                      addRow={() => dataPersediaanBaru1(-1, "1")}
                    />
                  </div>
                  Persediaan awal:
                </div>
              </th>
            </tr>
            {data1.map((item, index) => {
              const stup = index === 0 ? false : true;
              const stdown = index === data1.length - 1 ? false : true;

              return (
                <tr key={index}>
                  <th className="border-b min-w-25v text-left py-1 relative">
                    <div>
                      <div className="absolute inset-y-0 -left-3 flex items-center z-50">
                        <PopMenuRowLaporanBiaya
                          stup={stup}
                          stdown={stdown}
                          moveUp={() => move1(data1[index], data1[index - 1])}
                          moveDown={() => move1(data1[index], data1[index + 1])}
                          addRow={() => dataPersediaanBaru1(index, "1")}
                          removeRow={() => removePersediaan(item.uuid)}
                        />
                      </div>
                      <div className="relative pl-4">
                        <TextField
                          placeholder="Nama Keterangan"
                          value={item.name}
                          onChange={(event) =>
                            ganti(item.uuid, event.target.value, "name")
                          }
                          fullWidth
                          InputProps={{
                            disableUnderline: true,
                          }}
                          inputProps={{
                            style: {
                              textAlign: "left",
                              fontSize: 15,
                            },
                          }}
                        />
                        <div className="text-blue-700 absolute -inset-y-1 right-3">
                          <EditIcon
                            fontSize="inherit"
                            className="-mt-1 opacity-30"
                          />
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div className="relative">
                      <TextField
                        value={item.valtotbiaya}
                        onChange={(event) => {
                          const num = event.target.value;
                          ganti(item.uuid, parseFloat(num), "valtotbiaya");
                        }}
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
                <div className="relative">
                  <div className="absolute inset-y-0 -left-5 flex items-center z-50">
                    <PopMenuRowHeadLaporanBiaya
                      addRow={() => dataPersediaanBaru1(-1, "2")}
                    />
                  </div>
                  Biaya ditambahkan selama periode berjalan:
                </div>
              </th>
            </tr>
            {data2.map((item, index) => {
              const stup = index === 0 ? false : true;
              const stdown = index === data2.length - 1 ? false : true;

              return (
                <tr key={index}>
                  <th className="border-b min-w-25v text-left py-1 relative">
                    <div>
                      <div className="absolute inset-y-0 -left-3 flex items-center z-50">
                        <PopMenuRowLaporanBiaya
                          stup={stup}
                          stdown={stdown}
                          moveUp={() => move2(data2[index], data2[index - 1])}
                          moveDown={() => move2(data2[index], data2[index + 1])}
                          addRow={() => dataPersediaanBaru2(index, "2")}
                          removeRow={() => removePersediaan(item.uuid)}
                        />
                      </div>
                      <div className="relative pl-4">
                        <TextField
                          placeholder="Nama Keterangan"
                          value={item.name}
                          onChange={(event) =>
                            ganti(item.uuid, event.target.value, "name")
                          }
                          fullWidth
                          InputProps={{
                            disableUnderline: true,
                          }}
                          inputProps={{
                            style: {
                              textAlign: "left",
                              fontSize: 15,
                            },
                          }}
                        />
                        <div className="text-blue-700 absolute -inset-y-1 right-3">
                          <EditIcon
                            fontSize="inherit"
                            className="-mt-1 opacity-30"
                          />
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div className="relative">
                      <TextField
                        value={item.valtotbiaya}
                        onChange={(event) => {
                          const num = event.target.value;
                          ganti(item.uuid, parseFloat(num), "valtotbiaya");
                        }}
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
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                      />
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div className="relative">
                      <TextField
                        value={item.valekuiv}
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "valekuiv")
                        }
                        name="Ekuiv"
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
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                      />
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell">
                    {sunit ? (
                      <div className="font-normal">{toRp(bunit2[index])}</div>
                    ) : (
                      <Tooltip
                        title={`Pastikan jumlah data sesuai antara persediaan awal & periode berjalan`}
                        placement="top"
                      >
                        <div className="text-red-400 font-semibold animate-pulse">
                          #N/A
                        </div>
                      </Tooltip>
                    )}
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
            <tr className="">
              <th className="min-w-25v text-left font-semibold relative">
                <div className="border-b absolute inset-0 flex text-base items-center">
                  <div className="inline relative">
                    <InputGrowUpSubTable
                      value={dataConfig.subtable2}
                      onChange={(text) =>
                        props.setDataConfig({
                          ...dataConfig,
                          subtable2: text,
                        })
                      }
                    />{" "}
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute -inset-y-1 right-0 opacity-50"
                    />
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
                  {dataConfig.subtable3}
                  {/* <InputGrowUpSubTable
                    value={dataConfig.subtable3}
                    onChange={(text) =>
                      props.setDataConfig({
                        ...dataConfig,
                        subtable3: text,
                      })
                    }
                  />{" "}
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute -inset-y-1 right-0 opacity-50"
                  /> */}
                </div>
              </th>
              <th className="min-w-10v max-w-10v border-l">Unit</th>
              <th className="min-w-10v max-w-10v border-l">% Penyelesaian</th>
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
                    <div className="relative pl-4">
                      <TextField
                        placeholder="Nama Keterangan"
                        value={item.name}
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "name")
                        }
                        fullWidth
                        InputProps={{
                          disableUnderline: true,
                        }}
                        inputProps={{
                          style: {
                            textAlign: "left",
                            fontSize: 15,
                          },
                        }}
                      />
                      <div className="text-blue-700 absolute -inset-y-1 right-3">
                        <EditIcon
                          fontSize="inherit"
                          className="-mt-1 opacity-30"
                        />
                      </div>
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div className="relative">
                      <TextField
                        value={item.valbiayaunit}
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "valbiayaunit")
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
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                      />
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div className="relative py-1.5 px-4">
                      <Input
                        value={item.valekuiv}
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "valekuiv")
                        }
                        endAdornment={
                          <InputAdornment position="end">%</InputAdornment>
                        }
                        inputProps={{
                          "aria-label": "weight",
                          style: { textAlign: "right" },
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-1 opacity-20"
                      />
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v font-normal">
                    <div className="relative py-1.5 px-4">
                      {toLTous(
                        Number(item.valbiayaunit) *
                          (Number(item.valekuiv) / 100)
                      )}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell font-normal">
                    {toRp(sum(bunit2))}
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell">
                    &nbsp;
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell">
                    {toRp(totall3)}
                  </th>
                </tr>
              );
            })}
            <tr>
              <th
                className="font-semibold text-left border-b py-1 pt-4"
                colSpan="7"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 -left-5 flex items-center z-50">
                    <PopMenuRowHeadLaporanBiaya
                      addRow={() => dataPersediaanBaru4(-1, "4")}
                    />
                  </div>
                  Barang Dalam Proses Akhir:
                </div>
              </th>
            </tr>
            {data4.map((item, index) => {
              const stup = index === 0 ? false : true;
              const stdown = index === data4.length - 1 ? false : true;
              //for hitung biaya/unit
              return (
                <tr key={index}>
                  <th className="border-b min-w-25v text-left py-1 relative">
                    <div className="relative pl-4">
                      <div className="absolute inset-y-0 -left-3 flex items-center z-50">
                        <PopMenuRowLaporanBiaya
                          stup={stup}
                          stdown={stdown}
                          moveUp={() => move4(data4[index], data4[index - 1])}
                          moveDown={() => move4(data4[index], data4[index + 1])}
                          addRow={() => dataPersediaanBaru4(index, "4")}
                          removeRow={() => removePersediaan(item.uuid)}
                        />
                      </div>
                      <TextField
                        placeholder="Nama Keterangan"
                        value={item.name}
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "name")
                        }
                        fullWidth
                        InputProps={{
                          disableUnderline: true,
                        }}
                        inputProps={{
                          style: {
                            textAlign: "left",
                            fontSize: 15,
                          },
                        }}
                      />
                      <div className="text-blue-700 absolute -inset-y-1 right-3">
                        <EditIcon
                          fontSize="inherit"
                          className="-mt-1 opacity-30"
                        />
                      </div>
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div className="relative">
                      <TextField
                        value={item.valbiayaunit}
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "valbiayaunit")
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
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-20"
                      />
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div className="relative py-1.5 px-4">
                      <Input
                        value={item.valekuiv}
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "valekuiv")
                        }
                        endAdornment={
                          <InputAdornment position="end">%</InputAdornment>
                        }
                        inputProps={{
                          "aria-label": "weight",
                          style: { textAlign: "right" },
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-1 opacity-20"
                      />
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v">
                    <div className="relative py-1.5 px-4 font-normal">
                      {toLTous(
                        Number(item.valbiayaunit) *
                          (Number(item.valekuiv) / 100)
                      )}
                    </div>
                  </th>
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell ">
                    {sunit4 ? (
                      <div className="font-normal">{toRp(bunit2[index])}</div>
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
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell">
                    {sunit4 ? (
                      <div className="font-normal">
                        {toRp(totbunit3[index])}
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
                  <th className="border-l border-r border-b min-w-10v max-w-10v py-1.5 table-cell">
                    {stdown ? <>&nbsp;</> : toRp(sum(totbunit3))}
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
                {toRp(sum(totbunit3) + totall3)}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
