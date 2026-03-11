import makeStyles from "@mui/styles/makeStyles";
import { Tooltip, TextField } from "@mui/material";
import NumberFormat from "react-number-format"; 
import EditIcon from "@mui/icons-material/Edit";
import { findIndex, map, groupBy } from "lodash";
import { find } from "lodash";
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
      prefix="Rp "
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

const useStyles = makeStyles((theme) => ({}));

export default function TableBuPemAdmin9(props) {
  const classes = useStyles();
  const { dataConfig, setdataConfig } = props;

  const handleInputChange = (e, uid) => {
    const { name, value } = e.target;
    const index = findIndex(dataConfig.datajurnal, { uid: uid });
    const list = [...dataConfig.datajurnal];
    list[index][name] = value;
    setdataConfig({ ...dataConfig, datajurnal: list });
  };

  const data = groupBy(dataConfig.datajurnal, "gen");
  const objJurnal = map(data, (obj, key) => {
    return { head: key, values: obj };
  });

  return (
    <>
      {dataConfig &&
        objJurnal.map((item, i) => {
          const obItem = find(dataConfig.datajurnal, { gen: item.head });
          const countDebit = [];

          return (
            <div key={i} className="relative mt-10">
              <div className="mt-5 mb-3 relative">
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-start-1 col-end-4 flex text-base">
                    <div className="flex items-center ml-3 mt-3 space-y-2 text-xl">
                      <div className="text-xl font-medium uppercase">
                        {dataConfig.cvname}
                      </div>
                    </div>
                  </div>
                  <div className="col-end-10">
                    <div className="flex flex-col mt-3 space-y-2 pr-3">
                      <h1 className="text-xl font-medium uppercase">
                        Buku Pembantu Hutang
                      </h1>
                      <div className="flex">
                        <label>Nama Pemasok : </label>
                        <p className="pl-2">{obItem.namapemasok}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <>
                <div className="mt-0 overflow-x-auto border-collapse">
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
                      {item.values.map((element, index) => {
                        if (index === 0) {
                          //start
                          countDebit.push(element.jumlah);
                        } else {
                          //
                          const x =
                            element.posisi === "debit"
                              ? element[element.key] * -1
                              : element[element.key];
                          countDebit.push(Number(countDebit[index - 1] + x));
                        }

                        return (
                          <tr
                            key={index}
                            className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                          >
                            <td className="px-1 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                              {element.type === "intro" ? (
                                <div className="relative">
                                  <TextField
                                    fullWidth
                                    className={classes.inpputKeperluan}
                                    placeholder="Tanggal"
                                    value={element.tgl}
                                    name="tgl"
                                    onChange={(e) =>
                                      handleInputChange(e, element.uid)
                                    }
                                    inputProps={{
                                      style: {
                                        fontSize: 14,
                                        textAlign: "center",
                                      },
                                    }}
                                  />
                                  <EditIcon
                                    fontSize="inherit"
                                    className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                                  />
                                </div>
                              ) : (
                                <Tooltip
                                  title="Kunci Jawaban benar di Mahasiswa"
                                  placement="top"
                                >
                                  <div className="bg-amber-100 py-1">
                                    {element.tgl}
                                  </div>
                                </Tooltip>
                              )}
                            </td>
                            <td className="px-1 py-2  text-slate-800 text-center border border-b">
                              <Tooltip
                                title={
                                  element.type !== "intro"
                                    ? "Kunci Jawaban benar di Mahasiswa"
                                    : ""
                                }
                                placement="top"
                              >
                                <div
                                  className={`py-1 ${
                                    element.type !== "intro" && "bg-amber-100"
                                  }`}
                                >
                                  {element.keterangan}
                                </div>
                              </Tooltip>
                            </td>
                            <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                              {element.type === "intro" ? (
                                <>&nbsp;</>
                              ) : (
                                <Tooltip
                                  title="Kunci Jawaban benar di Mahasiswa"
                                  placement="top"
                                >
                                  <div className="relative capitalize bg-amber-100 py-1">
                                    {element.type}
                                  </div>
                                </Tooltip>
                              )}
                            </td>
                            <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                              <div className="relative">
                                {element.type !== "intro" &&
                                element.posisi === "debit" ? (
                                  <Tooltip
                                    title="Kunci Jawaban benar di Mahasiswa"
                                    placement="top"
                                  >
                                    <div className="relative capitalize bg-amber-100 py-1">
                                      {numberFormat(element[element.key])}
                                    </div>
                                  </Tooltip>
                                ) : (
                                  <>&nbsp;</>
                                )}
                              </div>
                            </td>
                            <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                              {element.type !== "intro" &&
                              element.posisi === "kredit" ? (
                                <Tooltip
                                  title="Kunci Jawaban benar di Mahasiswa"
                                  placement="top"
                                >
                                  <div className="relative capitalize bg-amber-100 py-1">
                                    {numberFormat(element[element.key])}
                                  </div>
                                </Tooltip>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            <td className="px-1 py-2 min-w-15v max-w-15v text-slate-800 text-center border border-b">
                              <div className="relative">&nbsp;</div>
                            </td>
                            <td className="px-1 py-2 min-w-15v max-w-15v  text-slate-800 text-center border border-b">
                              {element.type === "intro" ? (
                                <div className="relative">
                                  <TextField
                                    placeholder="Piutang Dagang"
                                    value={element.jumlah}
                                    onChange={(e) =>
                                      handleInputChange(e, element.uid)
                                    }
                                    name="jumlah"
                                    inputProps={{
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
                                <Tooltip
                                  title="Kunci Jawaban benar di Mahasiswa"
                                  placement="top"
                                >
                                  <div className="relative capitalize bg-amber-100 py-1">
                                    {numberFormat(countDebit[index])}
                                  </div>
                                </Tooltip>
                              )}
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
            </div>
          );
        })}
    </>
  );
}
