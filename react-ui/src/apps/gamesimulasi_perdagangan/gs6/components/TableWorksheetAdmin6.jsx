import { TextField } from "@mui/material";
import { find, sumBy } from "lodash";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
import NumberFormat from "react-number-format";

const toRp = (number) => {
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

const TableWorksheetAdmin6 = (props) => {
  const dataConfig = props.dataConfig;
  const dataakun = props.dataConfig.dataakun;
  const datanota = props.dataConfig.datanota;

  const handleNotaChange = (e, index) => {
    const { name, value } = e.target;
    const tempNota = [...datanota];
    tempNota[index][name] = value;
    props.setdataConfig({
      ...dataConfig,
      datanota: tempNota,
    });
  };

  return (
    <>
      <div className="flex flex-col items-center font-bold">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.cvname : ""}
            className={"font-semibold uppercase"}
            onChange={(text) =>
              props.setdataConfig({ ...dataConfig, cvname: text })
            }
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
      </div>
      <div className="flex flex-col items-center mb-1">
        <div className="text-lg font-semibold relative uppercase">
          Jurnal penjualan
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            className={"font-semibold tracking-wider"}
            value={dataConfig ? dataConfig.tblworkname : ""}
            onChange={(text) =>
              props.setdataConfig({ ...dataConfig, tblworkname: text })
            }
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
      </div>
      <div className="mb-4 mt-3">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th
                rowSpan="3"
                className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Tanggal
              </th>
              <th
                rowSpan="3"
                className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Keterangan
              </th>
              <th
                rowSpan="3"
                className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                No. BKK
              </th>
              <th
                colSpan="3"
                className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Debet
              </th>
              <th
                colSpan="1"
                className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Kredit
              </th>
            </tr>
            <tr>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Persediaan
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                PPN Masukan
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Beban Gaji
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Kas
              </th>
            </tr>
            <tr>
              {dataakun &&
                ["persediaan", "ppnmasukan", "bebangaji", "kas"].map(
                  (item, index) => {
                    const dat = find(dataakun, { name: item });
                    return (
                      <th
                        key={index}
                        className={`p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300 `}
                      >
                        {dat.noakun}
                      </th>
                    );
                  }
                )}
            </tr>
          </thead>
          <tbody>
            {datanota &&
              datanota.map((nota, idx) => (
                <tr key={idx} className="bg-white border-t border-slate-300 ">
                  <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <TextField
                        multiline
                        placeholder="Tanggal"
                        value={nota.tgl}
                        onChange={(e) => handleNotaChange(e, idx)}
                        name="tgl"
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
                  <td className="min-w-20v max-w-20v px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <TextField
                        multiline
                        placeholder="Keterangan"
                        value={nota.keterangan}
                        onChange={(e) => handleNotaChange(e, idx)}
                        name="keterangan"
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
                  <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <TextField
                        multiline
                        placeholder="No"
                        value={nota.no}
                        onChange={(e) => handleNotaChange(e, idx)}
                        name="no"
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
                  <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                    {nota.type === "kontan" && toRp(nota.subtotal)}
                  </td>
                  <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                    {nota.type === "kontan" && toRp(nota.ppn)}
                  </td>
                  <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                    {nota.type !== "kontan" && toRp(nota.nilaia)}
                  </td>
                  <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                    {toRp(nota.total)}
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan="3"
                className="px-1 py-2 bg-slate-50 text-slate-600 border text-center"
              >
                Jumlah
              </td>
              <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                {toRp(sumBy(datanota, "subtotal"))}
              </td>
              <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                {toRp(sumBy(datanota, "ppn"))}
              </td>
              <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                {toRp(sumBy(datanota, "nilaia"))}
              </td>
              <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                {toRp(sumBy(datanota, "total"))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default TableWorksheetAdmin6;
