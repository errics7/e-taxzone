import { sumBy } from "lodash";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";

import { InputGrowUpTextH1 } from "../../componentglobal/inputGrowUpTextWithName";

const WorksheetAdmin = (props) => {
  const dataakun = props.dataakun;
  const dataConfig = props.dataConfig;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div>
      <div className="flex flex-col items-center font-bold">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.cvname : ""}
            className={"font-semibold uppercase"}
            onChange={(text) =>
              props.setDataConfig({ ...dataConfig, cvname: text })
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
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.subtabel : ""}
            className={"font-semibold uppercase"}
            onChange={(text) =>
              props.setDataConfig({ ...dataConfig, subtabel: text })
            }
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
      </div>
      <div className="flex flex-col items-center mb-4">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            className={"font-semibold tracking-wider"}
            value={dataConfig ? dataConfig.tglsoal : ""}
            onChange={(text) =>
              props.setDataConfig({ ...dataConfig, tglsoal: text })
            }
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
      </div>
      <table className="border-collapse min-w-full table-fixed">
        <thead>
          <tr>
            <th
              rowSpan="2"
              className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              No. Akun
            </th>
            <th
              rowSpan="2"
              className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Nama Akun
            </th>

            <th
              colSpan="2"
              className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Neraca Saldo
            </th>
          </tr>
          <tr>
            <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
              D
            </th>
            <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
              K
            </th>
          </tr>
        </thead>
        <tbody>
          {dataakun &&
            dataakun.map((akun, idx) => (
              <tr key={idx}>
                <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                  {akun.noakun}
                </td>
                <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                  {akun.nama}
                </td>
                <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                  {akun.type_saldo === "debet" && toRp(akun.total_debet)}
                </td>
                <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                  {akun.type_saldo === "kredit" && toRp(akun.total_kredit)}
                </td>
              </tr>
            ))}
          <tr>
            <td
              colSpan={2}
              className="font-bold min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b"
            >
              Jumlah
            </td>
            <td className="font-bold min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b">
              {toRp(sumBy(dataakun, "total_debet"))}
            </td>
            <td className="font-bold min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b">
              {toRp(sumBy(dataakun, "total_kredit"))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WorksheetAdmin;
