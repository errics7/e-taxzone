import { TextField, Tooltip } from "@mui/material";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit"; 
import { findIndex } from "lodash";
import PopMenuRowAkun12 from "./PopMenuRowAkun12";
import InfoIcon from "@mui/icons-material/Info";
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

export default function TableAkun12(props) {
  const { dataakun } = props.dataConfig;

  const handleInputChange = (e, item) => {
    const { name, value } = e.target;
    const indx = findIndex(dataakun, { uid: item.uid });
    dataakun.splice(indx, 1, { ...item, [name]: value });

    props.setdataConfig({ ...props.dataConfig, dataakun: dataakun });
  };
  const swapArrayLocs = (arr, index1, index2) => {
    var arry = [...arr];
    var temp = arry[index1];

    arry[index1] = arry[index2];
    arry[index2] = temp;
    return arry;
  };
  const move1 = (A1, A2) => {
    const p1 = findIndex(dataakun, { uid: A1.uid });
    const p2 = findIndex(dataakun, { uid: A2.uid });
    props.setdataConfig({
      ...props.dataConfig,
      dataakun: [...swapArrayLocs(dataakun, p1, p2)],
    });
  };

  return (
    <>
      <h2 className="mt-5 font-medium text-base">Data Akun</h2>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="min-w-5v max-w-5v relative py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              No. Akun
              <Tooltip title="Perubahan posisi (pergeseran) no.akun juga dapat mempengaruhi posisi no.akun di worksheet">
                <InfoIcon
                  fontSize="small"
                  className="absolute p-0.5 inset-y-0 right-1"
                />
              </Tooltip>
            </th>
            <th className="min-w-35v max-w-35v relative py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Keterangan
            </th>
          </tr>
        </thead>
        <tbody>
          {dataakun.map((item, i) => {
            const stup = i === 0 ? false : true;
            const stdown = i === dataakun.length - 1 ? false : true;

            return (
              <tr key={i}>
                <td className="py-0.5 text-center border border-slate-300 table-cell">
                  <div className="relative">
                    <div className="absolute inset-y-0 -left-1.5 flex items-center z-50">
                      <PopMenuRowAkun12
                        stup={stup}
                        stdown={stdown}
                        moveUp={() => move1(dataakun[i], dataakun[i - 1])}
                        moveDown={() => move1(dataakun[i], dataakun[i + 1])}
                      />
                    </div>
                    <TextField
                      placeholder="no akun"
                      value={item.noakun}
                      onChange={(e) => handleInputChange(e, item)}
                      name="noakun"
                      InputProps={{
                        disableUnderline: true,
                        inputComponent: NumberFormatCustom,
                      }}
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
                <td className="py-0.5 text-center border border-slate-300 table-cell">
                  <div className="relative">
                    <TextField
                      fullWidth
                      multiline
                      placeholder="Keterangan"
                      value={item.keterangan}
                      onChange={(e) => handleInputChange(e, item)}
                      name="keterangan"
                      inputProps={{
                        style: {
                          paddingLeft: 5,
                        },
                      }}
                      InputProps={{
                        disableUnderline: true,
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
