import makeStyles from "@mui/styles/makeStyles";
import { TextareaAutosize, TextField } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import NumberFormat from "react-number-format"; 
import EditIcon from "@mui/icons-material/Edit";

import { findIndex, filter, remove } from "lodash";
import { InputGrowUpTextWithName } from "../../componentglobal/inputGrowUpTextWithName";
import PopMenuRowBupem12 from "./PopMenuRowBupem12";
import { forwardRef } from "react";

const numberFormat = (number) => {
  return (
    <NumberFormat
      value={number}
      displayType={"text"}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
      renderText={(value, props) => <div {...props}>{value}</div>}
    />
  );
};

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
            value: Number(values.value),
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

const useStyles = makeStyles((theme) => ({
  inpputTanggal: {
    padding: "0px 0px 0px 20px",
  },
}));

export default function TableBupemAdmin12(props) {
  const classes = useStyles();
  const { dataConfig, setdataConfig } = props;

  const bupm = filter(dataConfig.databahan, { type: "bupem" });

  //#region
  const handleInputChange = (e, uid) => {
    const { name, value } = e.target;
    const index = findIndex(dataConfig.databahan, { uid: uid });
    const list = [...dataConfig.databahan];
    list[index][name] = value;
    setdataConfig({ ...dataConfig, databahan: list });
  };
  const swapArrayLocs = (arr, index1, index2) => {
    var arry = [...arr];
    var temp = arry[index1];

    arry[index1] = arry[index2];
    arry[index2] = temp;
    return arry;
  };
  const move1 = (A1, A2) => {
    const p1 = findIndex(bupm, { uid: A1.uid });
    const p2 = findIndex(bupm, { uid: A2.uid });
    const bahan = filter(dataConfig.databahan, (x) => x.type !== "bupem");
    // console.log(tmp);
    // console.log(swapArrayLocs(bupm, p1, p2));
    // const newsort = swapArrayLocs(bupm, p1, p2);

    props.setdataConfig({
      ...props.dataConfig,
      databahan: [...bahan, ...swapArrayLocs(bupm, p1, p2)],
    });
  };
  const tambahRows = (pos) => {
    const list = [...bupm];
    list.splice(pos + 1, 0, {
      uid: uuidv4(),
      type: "bupem",
      tgl: "",
      keterangan: "",
      perolehan: 0,
      nilaisisa: 0,
      durasi: 0,
      satuanwaktu: "tahun",

      jumlah: 0,
      bungath: 0,

      ref: "Jurnal Kas Masuk",
      debet: 0,
      kredit: 0,
      genformula: "",
    });

    const bahan = filter(dataConfig.databahan, (x) => x.type !== "bupem");

    setdataConfig({
      ...dataConfig,
      databahan: [...bahan, ...list],
    });
  };
  const deleteRows = (items) => {
    const list = [...dataConfig.databahan];
    remove(list, (x) => x.uid === items.uid);

    setdataConfig({
      ...dataConfig,
      databahan: list,
    });
  };
  //#endregion
  const countDebit = [];

  return (
    <div className="relative mt-10">
      <InputGrowUpTextWithName
        icon={true}
        name="introsoal3"
        type="text"
        placeholder="No"
        value={props.dataConfig ? props.dataConfig.introsoal3 : " "}
        index={0}
        style={`text-base font-medium mr-40`}
        onChange={(e) => {
          props.setdataConfig({
            ...props.dataConfig,
            introsoal3: e.target.value,
          });
        }}
      />
      <div className="mt-2 mb-0 relative">
        <TextareaAutosize
          className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
          value={props.dataConfig ? props.dataConfig.introsoal3sub : " "}
          onChange={(e) => {
            props.setdataConfig({
              ...props.dataConfig,
              introsoal3sub: e.target.value,
            });
          }}
        />
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 opacity-70 absolute inset-y-1 right-0"
        />
      </div>
      <table className="border-collapse table-fixed -mb-5">
        <thead>
          <tr>
            <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Pengaturan Persentase
            </th>
            <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              <div className={`relative`}>
                <TextField
                  fullWidth
                  placeholder="Persentase"
                  value={dataConfig.persentase}
                  onChange={(e) => {
                    setdataConfig({
                      ...dataConfig,
                      persentase: e.target.value,
                    });
                  }}
                  name="bungath"
                  inputProps={{
                    suffix: " %",
                    style: {
                      textAlign: "center",
                    },
                  }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                />
              </div>
            </th>
          </tr>
        </thead>
      </table>
      <>
        <div className="mt-5 mb-3 relative">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-start-1 col-end-4 flex text-base">
              <div className="flex items-center ml-3 mt-3 space-y-2 text-xl">
                <InputGrowUpTextWithName
                  icon={true}
                  name="cvname"
                  type="text"
                  placeholder="No"
                  value={props.dataConfig ? props.dataConfig.cvname : " "}
                  index={0}
                  style={`text-xl font-medium uppercase`}
                  onChange={(e) => {
                    props.setdataConfig({
                      ...props.dataConfig,
                      cvname: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-end-10">
              <div className="flex flex-col mt-3 space-y-2 pr-3">
                <h1 className="text-xl font-medium uppercase">
                  Buku Pembantu Piutang
                </h1>
                <div className="flex">
                  <label>Nama Pelanggan : </label>
                  <InputGrowUpTextWithName
                    icon={true}
                    name="namapelanggan"
                    type="text"
                    placeholder="No"
                    value={
                      props.dataConfig ? props.dataConfig.namapelanggan : " "
                    }
                    index={0}
                    style={`text-base pl-2`}
                    onChange={(e) => {
                      props.setdataConfig({
                        ...props.dataConfig,
                        namapelanggan: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <>
          <div className="overflow-x-auto border-collapse">
            <table className="border-collapse min-w-full table-fixed">
              <thead>
                <tr>
                  <th
                    rowSpan="2"
                    className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Tanggal
                  </th>
                  <th
                    rowSpan="2"
                    className="min-w-20v max-w-20v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Keterangan
                  </th>
                  <th
                    rowSpan="2"
                    className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Ref
                  </th>
                  <th
                    rowSpan="2"
                    className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Debet
                  </th>
                  <th
                    rowSpan="2"
                    className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Kredit
                  </th>
                  <th
                    colSpan="2"
                    className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Saldo
                  </th>
                </tr>
                <tr>
                  <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Debet
                  </th>
                  <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Kredit
                  </th>
                </tr>
              </thead>
              <tbody>
                {bupm.map((element, index) => {
                  if (index === 0) {
                    //start
                    countDebit.push(element.jumlah);
                  } else {
                    //
                    const x = Number(element.debet) - Number(element.kredit);
                    countDebit.push(Number(countDebit[index - 1] + x));
                  }
                  //

                  return (
                    <tr
                      key={index}
                      className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                    >
                      <td className="px-1 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                        <div className="relative">
                          <div className="absolute inset-y-0 -left-1.5 flex items-center z-50">
                            <PopMenuRowBupem12
                              indx={index}
                              length={bupm.length}
                              moveUp={() => move1(bupm[index], bupm[index - 1])}
                              moveDown={() =>
                                move1(bupm[index], bupm[index + 1])
                              }
                              addRow={() => tambahRows(index)}
                              removeRow={() => deleteRows(element)}
                            />
                          </div>
                          <TextField
                            fullWidth
                            className={classes.inpputKeperluan}
                            placeholder="Tanggal"
                            value={element.tgl}
                            name="tgl"
                            onChange={(e) => handleInputChange(e, element.uid)}
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-left border border-b">
                        {index === 0 ? (
                          <div className={`p-1 text-base`}>
                            {element.keterangan}
                          </div>
                        ) : (
                          <div className="relative">
                            <TextField
                              fullWidth
                              className={classes.inpputKeperluan}
                              placeholder="Keterangan"
                              value={element.keterangan}
                              name="keterangan"
                              onChange={(e) =>
                                handleInputChange(e, element.uid)
                              }
                              inputProps={{
                                style: {
                                  paddingLeft: 5,
                                },
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                        {index === 0 ? (
                          <>&nbsp;</>
                        ) : (
                          <div className="relative">
                            <TextField
                              fullWidth
                              className={classes.inpputKeperluan}
                              placeholder="REF"
                              value={element.ref}
                              name="ref"
                              onChange={(e) =>
                                handleInputChange(e, element.uid)
                              }
                              inputProps={{
                                style: { paddingLeft: 5 },
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                        <div className="relative">
                          {index === 0 ? (
                            <>&nbsp;</>
                          ) : (
                            <div className="relative">
                              <TextField
                                placeholder="-"
                                value={element.debet === 0 ? "" : element.debet}
                                onChange={(e) =>
                                  handleInputChange(e, element.uid)
                                }
                                name="debet"
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                InputProps={{
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                        {index === 0 ? (
                          <>&nbsp;</>
                        ) : (
                          <div className="relative">
                            <TextField
                              placeholder="-"
                              value={element.kredit === 0 ? "" : element.kredit}
                              onChange={(e) =>
                                handleInputChange(e, element.uid)
                              }
                              name="kredit"
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                },
                              }}
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-1 py-2 min-w-15v max-w-15v  text-slate-800 text-center border border-b">
                        {index === 0 ? (
                          <div className="relative">
                            <TextField
                              placeholder="Saldo Awal"
                              value={element.jumlah}
                              onChange={(e) =>
                                handleInputChange(e, element.uid)
                              }
                              name="jumlah"
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                },
                              }}
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                            />
                          </div>
                        ) : (
                          <div className="relative capitalize py-1 text-base">
                            {numberFormat(countDebit[index])}
                          </div>
                        )}
                      </td>
                      <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                        <div className="relative">&nbsp;</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                  <td className="py-2 font-bold text-slate-600 border border-slate-300">
                    &nbsp;
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      </>
    </div>
  );
}
