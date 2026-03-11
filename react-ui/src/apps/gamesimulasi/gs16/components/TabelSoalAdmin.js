import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import { v4 as uuidv4 } from "uuid";
import { remove } from "lodash";
import Tooltip from "@mui/material/Tooltip";

import { InputGrowUpTextH2 } from "../../componentglobal/InputGrowUpTextH";
import PopMenuRowSoal from "./PopMenuRowSoal";
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

export default function TabelSoalAdmin(props) {
  const { dataTabel, dataSoal, dataConfig } = props;

  const addsoaldummy = (p) => {
    const h = [...dataSoal];
    h.splice(p + 1, 0, {
      uuid: uuidv4(),
      alias: "",
      value: 0,
      status: "dummy",
    });
    props.setDataSoal(h);
  };

  const removesoal = (uid) => {
    const temp = remove(dataTabel, (x) => x.uuid !== uid);
    props.setDataTabel([...temp]);
    const temp2 = remove(dataSoal, (x) => x.uuid !== uid);
    props.setDataSoal([...temp2]);
  };

  return (
    <div className="mt-5 bg-white">
      <div className="flex items-center">
        <div className="mx-auto text-xl relative">
          <InputGrowUpTextH2
            value={dataConfig.titlesoal}
            onChange={(text) =>
              props.setDataConfig({ ...dataConfig, titlesoal: text })
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
              <th className="min-w-10v max-w-10v border border-slate-300 p-2 table-cell">
                Unit Produksi
              </th>
            </tr>
          </thead>
          <tbody>
            {dataSoal.map((items, index) => {
              return (
                <tr key={index}>
                  <td className="p-1 border relative">
                    <div className="pl-5">
                      <Tooltip
                        title={
                          items.status === "dummy"
                            ? "Ini merupakan data dummy"
                            : ""
                        }
                        placement="top"
                      >
                        <TextField
                          value={items.alias}
                          name="name"
                          fullWidth
                          InputProps={{}}
                          onChange={(event) => {
                            props.setDataSoal(
                              dataSoal.map((u, i) =>
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
                      </Tooltip>
                    </div>
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <PopMenuRowSoal
                        addRow={() => {
                          addsoaldummy(index);
                        }}
                        removeRow={() => {
                          removesoal(items.uuid);
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-1 border min-w-15v max-w-15v ">
                    <TextField
                      value={items.value}
                      name="nilai"
                      fullWidth
                      InputProps={{
                        inputComponent: NumberFormatCustom,
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
