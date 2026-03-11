import { v4 as uuidv4 } from "uuid";
import { remove } from "lodash";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";

import { InputGrowUpTextH2 } from "../../componentglobal/InputGrowUpTextH";
import PopMenuRowPercent from "../../componentglobal/PopMenuRowPercent";

export default function PercentAdmin(props) {
  const { dataPerecent, dataConfig } = props;

  return (
    <div className="mt-5 bg-white">
      <div className="flex items-center">
        <div className="mx-auto text-xl relative">
          <InputGrowUpTextH2
            value={dataConfig.titelpercent}
            onChange={(text) =>
              props.setDataConfig({ ...dataConfig, titelpercent: text })
            }
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute -inset-y-1 -right-2 opacity-50"
          />
        </div>
      </div>
      <div className="mt-2 mb-3">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="min-w-25v border border-slate-300 "></th>
              <th className="border border-slate-300 p-2 table-cell">BBB</th>
              <th className="border border-slate-300 p-2 table-cell">BTKL</th>
              <th className="border border-slate-300 p-2 table-cell">BOP</th>
            </tr>
          </thead>
          <tbody>
            {dataPerecent.map((items, index) => {
              // console.log("d", items);
              return (
                <tr key={index}>
                  <td className="p-1 border relative">
                    <div className="pl-5">
                      <TextField
                        value={items.alias}
                        placeholder="Keterangan data (Pengecoh)"
                        name="name"
                        fullWidth
                        onChange={(event) => {
                          props.setDataPercent(
                            dataPerecent.map((u, i) =>
                              items.uuid === u.uuid
                                ? {
                                    ...u,
                                    alias: event.target.value,
                                  }
                                : u
                            )
                          );
                        }}
                      />
                    </div>
                    <Tooltip
                      title={
                        items.status === "dummy"
                          ? "Ini merupakan data dummy"
                          : ""
                      }
                      placement="top"
                    >
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        {items.status === "dummy" && (
                          <AssignmentLateIcon
                            className="mr-0.5 -mt-5 transform -rotate-12 text-slate-300 transition-all hover:text-slate-400 hover:scale-110"
                            fontSize="small"
                          />
                        )}
                      </div>
                    </Tooltip>
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <PopMenuRowPercent
                        addRow={() => {
                          props.setDataPercent([
                            ...dataPerecent,
                            {
                              uuid: uuidv4(),
                              alias: "",
                              bbb: 100,
                              btkl: 50,
                              bop: 60,
                              status: "dummy",
                            },
                          ]);
                        }}
                        removeRow={() => {
                          const temp = remove(
                            dataPerecent,
                            (x) => x.uuid !== items.uuid
                          );
                          props.setDataPercent([...temp]);
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-1 border w-24">
                    <Input
                      value={items.bbb}
                      onChange={(event) => {
                        props.setDataPercent(
                          dataPerecent.map((u, i) =>
                            items.uuid === u.uuid
                              ? {
                                  ...u,
                                  bbb: Number(
                                    event.target.value.replace(/\D/, "")
                                  ),
                                }
                              : u
                          )
                        );
                      }}
                      endAdornment={
                        <InputAdornment position="end">%</InputAdornment>
                      }
                      className="text-center"
                      inputProps={{
                        "aria-label": "weight",
                        style: { textAlign: "right" },
                        maxLength: 3,
                      }}
                    />
                  </td>
                  <td className="p-1 border w-24">
                    <Input
                      value={items.btkl}
                      onChange={(event) => {
                        props.setDataPercent(
                          dataPerecent.map((u, i) =>
                            items.uuid === u.uuid
                              ? {
                                  ...u,
                                  btkl: Number(
                                    event.target.value.replace(/\D/, "")
                                  ),
                                }
                              : u
                          )
                        );
                      }}
                      endAdornment={
                        <InputAdornment position="end">%</InputAdornment>
                      }
                      className="text-center"
                      inputProps={{
                        "aria-label": "weight",
                        style: { textAlign: "right" },
                        maxLength: 3,
                      }}
                    />
                  </td>
                  <td className="p-1 border w-24">
                    <Input
                      value={items.bop}
                      onChange={(event) => {
                        props.setDataPercent(
                          dataPerecent.map((u, i) =>
                            items.uuid === u.uuid
                              ? {
                                  ...u,
                                  bop: Number(
                                    event.target.value.replace(/\D/, "")
                                  ),
                                }
                              : u
                          )
                        );
                      }}
                      endAdornment={
                        <InputAdornment position="end">%</InputAdornment>
                      }
                      className="text-center"
                      inputProps={{
                        "aria-label": "weight",
                        style: { textAlign: "right" },
                        maxLength: 3,
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
