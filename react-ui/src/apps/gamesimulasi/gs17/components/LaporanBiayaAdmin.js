//#region import
import { v4 as uuidv4 } from "uuid";
import NumberFormat from "react-number-format";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import { find, remove, findIndex } from "lodash";
import PopMenuRowLaporanBiaya from "./PopMenuRowLaporanBiaya";
import {
  InputGrowUpTextH2,
  InputGrowUpTextH1,
} from "../../componentglobal/InputGrowUpTextH";
import { InputGrowUpSubTable } from "./InputGrowUpSubTable";
import { TextField } from "@mui/material";
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

export default function LaporanBiayaAdmin(props) {
  const dataConfig = props.dataConfig;
  const dataAkun = props.dataAkun;
  const dataPersediaan = props.dataPersediaan;
  // console.log(dataPersediaan);
  const data1 = dataPersediaan.filter((el) => el.type === "1");
  const data2 = dataPersediaan.filter((el) => el.type === "2");
  // console.log("dataPersediaan", dataPersediaan);

  //#region
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
  const gantiDataakun = (uuid, value, name) => {
    props.setDataAkun(
      dataAkun.map((u, i) =>
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
  const removePersediaan = (uid, eluid) => {
    const temp = remove(dataPersediaan, (x) => x.uuid !== uid);
    props.setDataPersediaan([...temp]);
    props.setDataAkun(
      dataAkun.map((u, i) =>
        u.uuid === eluid
          ? {
              ...u,
              status: "non",
            }
          : u
      )
    );
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
    props.setDataPersediaan([...swapArrayLocs(data1, p1, p2), ...data2]);
  };
  const move2 = (A1, A2) => {
    const p1 = findIndex(data2, { uuid: A1.uuid });
    const p2 = findIndex(data2, { uuid: A2.uuid });
    props.setDataPersediaan([...data1, ...swapArrayLocs(data2, p1, p2)]);
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
    const a = [...da, ...data2];
    console.log("add1", a);
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
    const a = [...data1, ...da];
    console.log("add2", a);
    props.setDataPersediaan(a);
  };
  //#endregion
  //#region Hitung total
  var total1 = 0;
  var total2 = 0;
  var totalbiayaunit = 0;
  data1.forEach((element) => {
    const dat = find(dataAkun, { uuid: element.eluid });
    if (dat) {
      total1 += parseFloat(dat.debit);
    } else {
      total1 += parseFloat(element.valtotbiaya);
    }
  });
  data2.forEach((element, index) => {
    const dat = find(dataAkun, { uuid: element.eluid });
    if (dat) {
      total2 += Number(dat.debit);
    } else {
      total2 += Number(element.valtotbiaya);
    }
    //for hitung biaya/unit
    const sunit = data1.length === data2.length ? true : false;
    var bunit = 0;
    if (sunit) {
      const dat1 = find(dataAkun, { uuid: data1[index].eluid });
      const d1 = dat1 ? dat1.debit : data1[index].valtotbiaya;
      const d2 = dat ? dat.debit : element.valtotbiaya;
      if (Number(element.valekuiv) === 0) {
        bunit = 0;
      } else {
        bunit = (Number(d1) + Number(d2)) / Number(element.valekuiv);
      }
    }
    totalbiayaunit += Number(bunit);
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
      <div className="px-3 pb-10 pt-4">
        <table className="border-collapse w-full">
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
                Persediaan awal:
              </th>
            </tr>
            {data1.map((item, index) => {
              const dat = find(dataAkun, { uuid: item.eluid });
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
                          removeRow={() =>
                            removePersediaan(item.uuid, item.eluid)
                          }
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
                          {dat && (
                            <Tooltip
                              title={
                                dat
                                  ? `Data terlink dengan ${dat.keterangan}`
                                  : ""
                              }
                              placement="top"
                            >
                              <LinkIcon
                                className="mr-0.5 -mt-1 transform -rotate-12"
                                fontSize="small"
                              />
                            </Tooltip>
                          )}
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
                      {dat ? (
                        <TextField
                          value={dat.debit}
                          onChange={(event) =>
                            gantiDataakun(
                              dat.uuid,
                              parseFloat(event.target.value),
                              "debit"
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
                      ) : (
                        <TextField
                          value={item.valtotbiaya}
                          onChange={(event) =>
                            ganti(
                              item.uuid,
                              parseFloat(event.target.value),
                              "valtotbiaya"
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
                      )}
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
              const dat = find(dataAkun, { uuid: item.eluid });
              const stup = index === 0 ? false : true;
              const stdown = index === data2.length - 1 ? false : true;
              //for hitung biaya/unit
              const sunit = data1.length === data2.length ? true : false;
              var bunit = 0;
              if (sunit) {
                const dat1 = find(dataAkun, { uuid: data1[index].eluid });
                const d1 = dat1 ? dat1.debit : data1[index].valtotbiaya;
                const d2 = dat ? dat.debit : item.valtotbiaya;
                if (Number(item.valekuiv) === 0) {
                  bunit = 0;
                } else {
                  bunit = (Number(d1) + Number(d2)) / Number(item.valekuiv);
                }
              }

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
                          removeRow={() =>
                            removePersediaan(item.uuid, item.eluid)
                          }
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
                          {dat && (
                            <Tooltip
                              title={
                                dat
                                  ? `Data terlink dengan ${dat.keterangan}`
                                  : ""
                              }
                              placement="top"
                            >
                              <LinkIcon
                                className="mr-0.5 -mt-1 transform -rotate-12"
                                fontSize="small"
                              />
                            </Tooltip>
                          )}
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
                      {dat ? (
                        <TextField
                          value={dat.debit}
                          onChange={(event) =>
                            gantiDataakun(
                              dat.uuid,
                              parseFloat(event.target.value),
                              "debit"
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
                      ) : (
                        <TextField
                          value={item.valtotbiaya}
                          onChange={(event) =>
                            ganti(
                              item.uuid,
                              parseFloat(event.target.value),
                              "valtotbiaya"
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
                      )}
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
                      <div>{toRp(bunit)}</div>
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
            <tr className="py-1.5">
              <th colSpan="4">&nbsp;</th>
            </tr>
            <tr className="py-1.5">
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
    </div>
  );
}
