import { TextField, Tooltip } from "@mui/material";
import React, { forwardRef } from "react";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";

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
            value: parseFloat(values.value),
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

const WorksheetMhsGs11 = ({ dataConfig, jwbdata, setJwbdata, checking }) => {
  const handleChange = (e, idx) => {
    const { value, name } = e.target;
    const tempData = [...jwbdata];
    tempData[idx][name] = value;
    setJwbdata(tempData);
  };

  return (
    <div className="mx-4">
      <div className="flex flex-col items-center font-bold">
        <div className="text-xl relative">
          <h1 className={"font-semibold uppercase"}>
            {dataConfig && dataConfig.cvname}
          </h1>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-lg font-semibold relative uppercase">
          <h1 className={"font-semibold uppercase"}>
            {dataConfig && dataConfig.subtabel}
          </h1>
        </div>
      </div>
      <div className="flex flex-col items-center mb-4">
        <div className="text-xl relative">
          <h1 className={"font-semibold tracking-wider"}>
            {dataConfig && dataConfig.tglsoal}
          </h1>
        </div>
      </div>
      <div className="overflow-x-auto border-collapse">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th
                rowSpan="2"
                className="p-3 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300"
              >
                No. Akun
              </th>
              <th
                rowSpan="2"
                className="p-3 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300"
              >
                Nama Akun
              </th>

              <th
                colSpan="2"
                className="p-1 font-bold bg-gray-50 text-gray-600 border border-gray-300"
              >
                Neraca Saldo
              </th>
              <th
                colSpan="2"
                className="p-1 font-bold bg-gray-50 text-gray-600 border border-gray-300"
              >
                Penyesuaian
              </th>
              <th
                colSpan="2"
                className="p-1 font-bold bg-gray-50 text-gray-600 border border-gray-300"
              >
                Neraca Saldo Setelah Penyesuaian
              </th>
              <th
                colSpan="2"
                className="p-1 font-bold bg-gray-50 text-gray-600 border border-gray-300"
              >
                Laba/Rugi
              </th>
              <th
                colSpan="2"
                className="p-1 font-bold bg-gray-50 text-gray-600 border border-gray-300"
              >
                Neraca
              </th>
            </tr>
            <tr>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300">
                D
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300">
                K
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300">
                D
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300">
                K
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300">
                D
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300">
                K
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300">
                D
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300">
                K
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300">
                D
              </th>
              <th className="p-1 min-w-15v max-w-15v font-bold bg-gray-50 text-gray-600 border border-gray-300">
                K
              </th>
            </tr>
          </thead>
          <tbody>
            {jwbdata &&
              jwbdata.slice(0, jwbdata.length - 2).map((akun, idx) => (
                <tr key={idx}>
                  <td className="min-w-10v max-w-10v px-1 py-2  text-gray-800 text-center border border-b">
                    <div
                      className={`relative py-1 ${
                        checking &&
                        akun.err_noakun &&
                        " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          akun.err_noakun
                            ? " Jawaban yang anda masukkan salah"
                            : ""
                        }
                      >
                        <TextField
                          placeholder="No akun"
                          value={akun.jwb_noakun}
                          name="jwb_noakun"
                          onChange={(e) => handleChange(e, idx)}
                          fullWidth
                          InputProps={{
                            disableUnderline: false,
                          }}
                          inputProps={{
                            style: {
                              textAlign: "center",
                              fontSize: 15,
                            },
                          }}
                        />
                      </Tooltip>
                      {!checking && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                        />
                      )}
                    </div>
                  </td>
                  <td className="min-w-20v max-w-20v px-1 py-2  text-gray-800 text-center border border-b">
                    <div
                      className={`relative py-1 ${
                        checking && akun.err_nama && " bg-red-300 animate-pulse"
                      }`}
                    >
                      <Tooltip
                        title={
                          akun.err_nama
                            ? " Jawaban yang anda masukkan salah"
                            : ""
                        }
                      >
                        <TextField
                          placeholder="Nama akun"
                          value={akun.jwb_nama}
                          name="jwb_nama"
                          onChange={(e) => handleChange(e, idx)}
                          fullWidth
                          InputProps={{
                            disableUnderline: false,
                          }}
                          inputProps={{
                            style: {
                              textAlign: "left",
                              fontSize: 15,
                              paddingLeft: 5,
                            },
                          }}
                        />
                      </Tooltip>
                      {!checking && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                        />
                      )}
                    </div>
                  </td>
                  <td className="min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b">
                    {akun.type_saldo === "debet" && (
                      <div
                        className={`relative py-1 ${
                          checking &&
                          akun.err_debet &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            akun.err_debet
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Total Debet"
                            value={akun.jwb_debet}
                            name="jwb_debet"
                            onChange={(e) => handleChange(e, idx)}
                            fullWidth
                            InputProps={{
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
                        </Tooltip>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                          />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b">
                    {akun.type_saldo === "kredit" && (
                      <div
                        className={`relative py-1 ${
                          checking &&
                          akun.err_kredit &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            akun.err_kredit
                              ? " Jawaban yang anda masukkan salah"
                              : ""
                          }
                        >
                          <TextField
                            placeholder="Total Kredit"
                            value={akun.jwb_kredit}
                            name="jwb_kredit"
                            onChange={(e) => handleChange(e, idx)}
                            fullWidth
                            InputProps={{
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
                        </Tooltip>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                          />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
                  <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
                  <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
                  <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
                  <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
                  <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
                  <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
                  <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
                </tr>
              ))}
            <tr>
              <td
                colSpan={2}
                className="font-bold min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b"
              >
                Jumlah
              </td>
              <td className="min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b">
                <div
                  className={`relative font-bold py-1 ${
                    checking &&
                    jwbdata[jwbdata.length - 1].err_total_debet &&
                    " bg-red-300 animate-pulse"
                  }`}
                >
                  <Tooltip
                    title={
                      jwbdata[jwbdata.length - 1].err_total_debet
                        ? " Jawaban yang anda masukkan salah"
                        : ""
                    }
                  >
                    <TextField
                      placeholder="Total Debet"
                      value={jwbdata[jwbdata.length - 1].jwb_total_debet}
                      name="jwb_total_debet"
                      onChange={(e) => handleChange(e, jwbdata.length - 1)}
                      fullWidth
                      InputProps={{
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
                  </Tooltip>
                  {!checking && (
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                    />
                  )}
                </div>
              </td>
              <td className="min-w-15v max-w-15v px-1 py-2  text-gray-800 text-center border border-b">
                <div
                  className={`relative font-bold py-1 ${
                    checking &&
                    jwbdata[jwbdata.length - 2].err_total_kredit &&
                    " bg-red-300 animate-pulse"
                  }`}
                >
                  <Tooltip
                    title={
                      jwbdata[jwbdata.length - 2].err_total_kredit
                        ? " Jawaban yang anda masukkan salah"
                        : ""
                    }
                  >
                    <TextField
                      placeholder="Total Kredit"
                      value={jwbdata[jwbdata.length - 2].jwb_total_kredit}
                      name="jwb_total_kredit"
                      onChange={(e) => handleChange(e, jwbdata.length - 2)}
                      fullWidth
                      InputProps={{
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
                  </Tooltip>
                  {!checking && (
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-0 opacity-30 group-hover:opacity-70"
                    />
                  )}
                </div>
              </td>
              <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
              <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
              <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
              <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
              <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
              <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
              <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
              <td className="min-w-8v max-w-8v px-1 py-2  text-gray-800 text-center border border-b"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorksheetMhsGs11;
