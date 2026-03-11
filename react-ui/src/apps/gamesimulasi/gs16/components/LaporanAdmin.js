import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import { remove, sumBy } from "lodash";
import { v4 as uuidv4 } from "uuid";

import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";

import {
  InputGrowUpTextH2,
  InputGrowUpTextH1,
} from "../../componentglobal/InputGrowUpTextH";
import PopMenuRow from "../../componentglobal/PopMenuRow";
import PopMenuRowJumlah from "../../componentglobal/PopMenuRowJumlah";
import { InputGrowUpTitleJumlah } from "./InputGrowUpTitleJumlah";
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

export default function LaporanAdmin(props) {
  const dataConfig = props.dataConfig;
  const { dataTabel, dataSoal, dataPerecent } = props;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const addsoal1 = (p, type) => {
    const uid = uuidv4();
    const tbl1 = dataTabel.filter((x) => x.type === 1);
    const tbl2 = dataTabel.filter((x) => x.type === 2);
    const h = [...tbl1];
    h.splice(p + 1, 0, {
      uuid: uid,
      name: "",
      value: 0,
      type: type,
    });
    props.setDataTabel([...h, ...tbl2]);
    props.setDataSoal([
      ...dataSoal,
      {
        uuid: uid,
        alias: "",
        value: 0,
        status: "legacy",
      },
    ]);
  };
  const addsoal2 = (p, type) => {
    const uid = uuidv4();
    const tbl1 = dataTabel.filter((x) => x.type === 1);
    const tbl2 = dataTabel.filter((x) => x.type === 2);
    const h = [...tbl2];
    h.splice(p + 1, 0, {
      uuid: uid,
      name: "",
      value: 0,
      type: type,
    });
    props.setDataTabel([...tbl1, ...h]);
    props.setDataSoal([
      ...dataSoal,
      {
        uuid: uid,
        alias: "",
        value: 0,
        status: "legacy",
      },
    ]);
  };
  const removesoal = (uid) => {
    const temp = remove(dataTabel, (x) => x.uuid !== uid);
    props.setDataTabel([...temp]);
    const temp2 = remove(dataSoal, (x) => x.uuid !== uid);
    props.setDataSoal([...temp2]);
  };

  const addpercent = (uid) => {
    console.log("click", uid);
    props.setDataPercent([
      ...dataPerecent,
      {
        uuid: uid,
        alias: "Barang dalam proses akhir",
        bbb: 100,
        btkl: 50,
        bop: 60,
        status: "legacy",
      },
    ]);
  };
  const addinitDtabel2 = (p, type) => {
    const h1 = [...dataTabel.filter((x) => x.type === 1)];
    const h = [...dataTabel.filter((x) => x.type === 2)];
    const uid = uuidv4();

    h.splice(p + 1, 0, {
      uuid: uid,
      name: "",
      value: 0,
      type: type,
    });
    props.setDataTabel([...h1, ...h]);
    props.setDataSoal([
      ...dataSoal,
      {
        uuid: uid,
        alias: "",
        value: 0,
      },
    ]);
  };

  return (
    <div className="mt-5 min-h-30v border border-dashed bg-white">
      {/* //header */}
      <div className="flex flex-col items-center pt-4 px-5 md:px-0">
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
        <div className="mt-8 text-xl relative">
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
      {/* Body */}
      <div className="mt-5 mb-3 mx-2 overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="min-w-25v border border-slate-300 ">&nbsp;</th>
              <th className="min-w-10v max-w-10v border border-slate-300">
                BB
              </th>
              <th className="min-w-10v max-w-10v border border-slate-300">
                BTKL
              </th>
              <th className="min-w-10v max-w-10v border border-slate-300">
                BOP
              </th>
              <th className="min-w-15v max-w-15v border border-slate-300 p-2 table-cell">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="border px-3 py-1 pt-2">
                <div className="inline pl-2 relative font-semibold text-base">
                  <InputGrowUpTitleJumlah
                    value={dataConfig ? dataConfig.subtitletbl1 : ""}
                    onChange={(text) =>
                      props.setDataConfig({ ...dataConfig, subtitletbl1: text })
                    }
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute -inset-y-1 right-2 opacity-50"
                  />
                </div>
              </td>
            </tr>
            {dataTabel
              .filter((x) => x.type === 1)
              .map((items, index) => {
                const rpercent = dataPerecent.find(
                  (el) => el.uuid === items.uuid
                );

                return (
                  <tr key={index} className="group">
                    <td className="p-1 py-2 border relative">
                      <div>
                        <div className="pl-5">
                          <TextField
                            value={items.name}
                            name="nilai"
                            fullWidth
                            InputProps={{}}
                            onChange={(event) => {
                              props.setDataTabel(
                                dataTabel.map((u, i) =>
                                  items.uuid === u.uuid
                                    ? {
                                        ...u,
                                        name: event.target.value,
                                      }
                                    : u
                                )
                              );
                            }}
                          />
                        </div>
                        <div className="absolute inset-y-0 left-0 flex items-center opacity-5 group-hover:opacity-100">
                          <PopMenuRow
                            addRow={() => addsoal1(index, 1)}
                            removeRow={() => removesoal(items.uuid)}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center">
                        {rpercent ? (
                          <span className="mx-auto">{rpercent.bbb}%</span>
                        ) : (
                          <Tooltip
                            title="Tambahkan Data Persentase"
                            placement="top"
                          >
                            <div
                              onClick={() => {
                                addpercent(items.uuid);
                              }}
                              className="mx-auto px-1 cursor-pointer rounded-full group-hover:bg-slate-300 transform hover:scale-125"
                            >
                              <span className="font-semibold opacity-10 group-hover:opacity-100 group-hover:text-white">
                                %
                              </span>
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center">
                        {rpercent ? (
                          <span className="mx-auto">{rpercent.btkl}%</span>
                        ) : (
                          <Tooltip
                            title="Tambahkan Data Persentase"
                            placement="top"
                          >
                            <div
                              onClick={() => {
                                addpercent(items.uuid);
                              }}
                              className="mx-auto px-1 cursor-pointer rounded-full group-hover:bg-slate-300 transform hover:scale-125"
                            >
                              <span className="font-semibold opacity-10 group-hover:opacity-100 group-hover:text-white">
                                %
                              </span>
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center">
                        {rpercent ? (
                          <span className="mx-auto">{rpercent.bop}%</span>
                        ) : (
                          <Tooltip
                            title="Tambahkan Data Persentase"
                            placement="top"
                          >
                            <div
                              onClick={() => {
                                addpercent(items.uuid);
                              }}
                              className="mx-auto px-1 cursor-pointer rounded-full group-hover:bg-slate-300 transform hover:scale-125"
                            >
                              <span className="font-semibold opacity-10 group-hover:opacity-100 group-hover:text-white">
                                %
                              </span>
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className="p-1 border min-w-15v max-w-15v ">
                      <div className="relative">
                        <TextField
                          value={items.value}
                          name="nilai"
                          fullWidth
                          InputProps={{
                            inputComponent: NumberFormatCustom,
                            disableUnderline: true,
                          }}
                          onChange={(event) => {
                            props.setDataSoal(
                              dataSoal.map((u, i) =>
                                items.uuid === u.uuid
                                  ? {
                                      ...u,
                                      value: Number(event.target.value),
                                    }
                                  : u
                              )
                            );
                            props.setDataTabel(
                              dataTabel.map((u, i) =>
                                items.uuid === u.uuid
                                  ? {
                                      ...u,
                                      value: Number(event.target.value),
                                    }
                                  : u
                              )
                            );
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 -right-1 opacity-30"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td colSpan="4" className="border pt-1">
                <div className="relative">
                  <div className="inline pl-4 relative font-semibold text-base">
                    <InputGrowUpTitleJumlah
                      value={dataConfig ? dataConfig.titlejumlah1 : ""}
                      onChange={(text) =>
                        props.setDataConfig({
                          ...dataConfig,
                          titlejumlah1: text,
                        })
                      }
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute -inset-y-1 right-0 opacity-50"
                    />
                  </div>
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <PopMenuRowJumlah
                      addRow={() => {
                        addinitDtabel2(-1, 2);
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="p-1 border text-right text-base">
                <div className="p-1 px-3 border-b border-slate-400">
                  {toRp(
                    sumBy(
                      dataTabel.filter((x) => x.type === 1),
                      (r) => r.value
                    )
                  )}
                </div>
              </td>
            </tr>
            {/* TABEL 2 */}
            {dataTabel
              .filter((x) => x.type === 2)
              .map((items, index) => {
                const rpercent = dataPerecent.find(
                  (el) => el.uuid === items.uuid
                );

                return (
                  <tr key={index} className="group">
                    <td className="p-1 py-2 border relative">
                      <div>
                        <div className="pl-5">
                          <TextField
                            value={items.name}
                            name="nilai"
                            fullWidth
                            InputProps={{}}
                            onChange={(event) => {
                              props.setDataTabel(
                                dataTabel.map((u, i) =>
                                  items.uuid === u.uuid
                                    ? {
                                        ...u,
                                        name: event.target.value,
                                      }
                                    : u
                                )
                              );
                            }}
                          />
                        </div>
                        <div className="absolute inset-y-0 left-0 flex items-center opacity-5 group-hover:opacity-100">
                          <PopMenuRow
                            addRow={() => addsoal2(index, 2)}
                            removeRow={() => removesoal(items.uuid)}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center">
                        {rpercent ? (
                          <span className="mx-auto">{rpercent.bbb}%</span>
                        ) : (
                          <Tooltip
                            title="Tambahkan Data Persentase"
                            placement="top"
                          >
                            <div
                              onClick={() => {
                                addpercent(items.uuid);
                              }}
                              className="mx-auto px-1 cursor-pointer rounded-full group-hover:bg-slate-300 transform hover:scale-125"
                            >
                              <span className="font-semibold opacity-10 group-hover:opacity-100 group-hover:text-white">
                                %
                              </span>
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center">
                        {rpercent ? (
                          <span className="mx-auto">{rpercent.btkl}%</span>
                        ) : (
                          <Tooltip
                            title="Tambahkan Data Persentase"
                            placement="top"
                          >
                            <div
                              onClick={() => {
                                addpercent(items.uuid);
                              }}
                              className="mx-auto px-1 cursor-pointer rounded-full group-hover:bg-slate-300 transform hover:scale-125"
                            >
                              <span className="font-semibold opacity-10 group-hover:opacity-100 group-hover:text-white">
                                %
                              </span>
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center">
                        {rpercent ? (
                          <span className="mx-auto">{rpercent.bop}%</span>
                        ) : (
                          <Tooltip
                            title="Tambahkan Data Persentase"
                            placement="top"
                          >
                            <div
                              onClick={() => {
                                addpercent(items.uuid);
                              }}
                              className="mx-auto px-1 cursor-pointer rounded-full group-hover:bg-slate-300 transform hover:scale-125"
                            >
                              <span className="font-semibold opacity-10 group-hover:opacity-100 group-hover:text-white">
                                %
                              </span>
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className="p-1 border min-w-15v max-w-15v ">
                      <div className="relative">
                        <TextField
                          value={items.value}
                          name="nilai"
                          fullWidth
                          InputProps={{
                            inputComponent: NumberFormatCustom,
                            disableUnderline: true,
                          }}
                          onChange={(event) => {
                            props.setDataSoal(
                              dataSoal.map((u, i) =>
                                items.uuid === u.uuid
                                  ? {
                                      ...u,
                                      value: Number(event.target.value),
                                    }
                                  : u
                              )
                            );
                            props.setDataTabel(
                              dataTabel.map((u, i) =>
                                items.uuid === u.uuid
                                  ? {
                                      ...u,
                                      value: Number(event.target.value),
                                    }
                                  : u
                              )
                            );
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 -right-1 opacity-30"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td colSpan="4" className="border pt-1">
                <div className="relative">
                  <div className="inline pl-4 relative font-semibold text-base">
                    <InputGrowUpTitleJumlah
                      value={dataConfig ? dataConfig.titlejumlah2 : ""}
                      onChange={(text) =>
                        props.setDataConfig({
                          ...dataConfig,
                          titlejumlah2: text,
                        })
                      }
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute -inset-y-1 right-0 opacity-50"
                    />
                  </div>
                </div>
              </td>
              <td className="p-1 border text-right text-base">
                <div className="p-1 px-3 border-b border-slate-400">
                  {toRp(
                    sumBy(
                      dataTabel.filter((x) => x.type === 2),
                      (r) => r.value
                    )
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
