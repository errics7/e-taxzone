//#region
import { v4 as uuidv4 } from "uuid";
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import { remove, findIndex } from "lodash";
import PopMenuRowInformasiData18 from "./PopMenuRowInformasiData18";
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

export default function InfoBiayaAdmin18(props) {
  const dataRedaksi = props.dataRedaksi;
  // console.log("dataRedaksi", JSON.stringify(dataRedaksi));

  const dataBaru = () => {
    props.setDataRedaksi([
      ...dataRedaksi,
      {
        uuid: uuidv4(),
        redaksi: "",
        biaya: 0,
      },
    ]);
    toast.success("Data redaksional baru ditambahkan");
  };
  const ganti = (uuid, value, name) => {
    props.setDataRedaksi(
      dataRedaksi.map((u, i) =>
        u.uuid === uuid
          ? {
              ...u,
              [name]: value,
            }
          : u
      )
    );
  };
  const dellRow = (uid) => {
    const temp = remove(dataRedaksi, (x) => x.uuid !== uid);
    props.setDataRedaksi([...temp]);
  };
  const swapArrayLocs = (arr, index1, index2) => {
    var arry = [...arr];
    var temp = arry[index1];

    arry[index1] = arry[index2];
    arry[index2] = temp;
    return arry;
  };
  const moved = (A1, A2) => {
    const p1 = findIndex(dataRedaksi, { uuid: A1.uuid });
    const p2 = findIndex(dataRedaksi, { uuid: A2.uuid });
    props.setDataRedaksi([...swapArrayLocs(dataRedaksi, p1, p2)]);
  };

  return (
    <div className="mt-5">
      <h1 className="font-semibold">Data Biaya & Produksi</h1>
      <div className="max-w-3xl">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="w-3/5"></th>
              <th className="border w-1/5 py-1.5 font-semibold">
                Unit Produksi
              </th>
            </tr>
          </thead>
          <tbody>
            {dataRedaksi.map((item, index) => {
              const stup = index === 0 ? false : true;
              const stdown = index === dataRedaksi.length - 1 ? false : true;

              return (
                <tr key={index}>
                  <td className="border">
                    <div className="px-2 pl-5 relative py-1.5">
                      <div className="absolute inset-y-0 -left-1 flex items-center z-50">
                        <PopMenuRowInformasiData18
                          stup={stup}
                          stdown={stdown}
                          moveUp={() =>
                            moved(dataRedaksi[index], dataRedaksi[index - 1])
                          }
                          moveDown={() =>
                            moved(dataRedaksi[index], dataRedaksi[index + 1])
                          }
                          removeRow={() => dellRow(item.uuid)}
                        />
                      </div>
                      <TextField
                        placeholder="Nama Redaksi"
                        value={item.redaksi}
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "redaksi")
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
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-1 opacity-20"
                      />
                    </div>
                  </td>
                  <td className="border">
                    <div className="relative py-1.5">
                      <TextField
                        value={item.biaya === 0 ? "" : item.biaya}
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "biaya")
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
                        className="text-blue-700 absolute inset-y-0 right-1 opacity-20"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr>
              <th className="border w-3/5 py-1.5">
                <div className="flex justify-center items-center">
                  <div
                    onClick={() => dataBaru()}
                    className="bg-slate-400 px-1 rounded text-white flex items-center cursor-pointer transform hover:scale-105"
                  >
                    <AddIcon />
                    <span>Tambah Data</span>
                  </div>
                </div>
              </th>
              <th colSpan="2" className="w-1/5">
                &nbsp;
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
