import makeStyles from '@mui/styles/makeStyles';
import TextField from "@mui/material/TextField"; 

import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
import { find } from "lodash";

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

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({}));

function TableAdmin5(props) {
  const classes = useStyles();
  const { dataConfig, setdataConfig } = props;

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...dataConfig.datanota];
    list[index][name] = value;
    setdataConfig({ ...dataConfig, datanota: list });
  };

  return (
    <div className="relative mt-5">
      <div className="flex flex-col items-center font-bold">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.cvname : ""}
            className={"font-semibold uppercase"}
            onChange={(text) => setdataConfig({ ...dataConfig, cvname: text })}
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
              setdataConfig({ ...dataConfig, tblworkname: text })
            }
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
      </div>
      <>
        <div className="mt-3 overflow-x-auto border-collapse border pb-1">
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th
                  rowSpan="3"
                  className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Tanggal
                </th>
                <th
                  rowSpan="3"
                  className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Keterangan
                </th>
                <th
                  rowSpan="3"
                  className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  No. BKM
                </th>
                <th
                  colSpan="2"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Debet
                </th>
                <th
                  colSpan="4"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Kredit
                </th>
              </tr>
              <tr>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kas
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  HPP
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Penjualan
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  PPN Keluaran
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Piutang Dagang
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Persediaan
                </th>
              </tr>
              <tr>
                {[
                  "kas",
                  "hpp",
                  "penjualan",
                  "ppnkeluar",
                  "piutangdagang",
                  "persediaan",
                ].map((item, index) => {
                  const dat = find(dataConfig.dataakun, { name: item });
                  return (
                    <th
                      key={index}
                      className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                    >
                      {dat && dat.noakun}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {dataConfig &&
                dataConfig.datanota.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                  >
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      <div className="relative">
                        <TextField
                          fullWidth 
                          className={classes.inpputKeperluan}
                          placeholder="Tanggal"
                          value={item.tgl}
                          name="tgl"
                          onChange={(e) => handleInputChange(e, index)}
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
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      <div className="relative">
                        <TextField
                          fullWidth 
                          className={classes.inpputKeperluan}
                          placeholder="Keterangan"
                          value={item.keterangan}
                          name="keterangan"
                          onChange={(e) => handleInputChange(e, index)}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                        />
                      </div>
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      <div className="relative">
                        <TextField 
                          className={classes.inpputKeperluan}
                          placeholder="No. BKM"
                          value={item.no}
                          name="no"
                          onChange={(e) => handleInputChange(e, index)}
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
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {item.type === "kontan"
                        ? numberFormat(item.jumlah)
                        : numberFormat(item.nilaia)}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {item.type === "kontan" ? (
                        numberFormat(item.hpp)
                      ) : (
                        <>&nbsp;</>
                      )}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {item.type === "kontan" ? (
                        numberFormat(item.subtotal)
                      ) : (
                        <>&nbsp;</>
                      )}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {item.type === "kontan" ? (
                        numberFormat(item.ppn)
                      ) : (
                        <>&nbsp;</>
                      )}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {item.type === "kontan" ? (
                        <>&nbsp;</>
                      ) : (
                        numberFormat(item.nilaia)
                      )}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {item.type === "kontan" ? (
                        numberFormat(item.persediaan)
                      ) : (
                        <>&nbsp;</>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan="3"
                  className="px-10 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-right"
                >
                  Jumlah
                </td>
                {[
                  "kas",
                  "hpp",
                  "penjualan",
                  "ppnkeluar",
                  "piutangdagang",
                  "persediaan",
                ].map((item, index) => {
                  const dat = find(dataConfig.dataakun, { name: item });
                  return (
                    <th
                      key={index}
                      className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center"
                    >
                      {dat && numberFormat(dat.jumlah)}
                    </th>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    </div>
  );
}

export default TableAdmin5;
