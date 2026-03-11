import makeStyles from "@mui/styles/makeStyles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import { InputGrowUpTextH1 } from "../../../gamesimulasi_perdagangan/componentglobal/InputGrowUpTextH";
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

const useStyles = makeStyles((theme) => ({}));

function TableAdmin4(props) {
  const classes = useStyles();
  const { dataConfig, setdataConfig } = props;

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...dataConfig.datainvoice];
    list[index][name] = value;
    setdataConfig({ ...dataConfig, datainvoice: list });
  };

  return (
    <div className="relative mt-5">
      <div className="flex flex-col items-center font-bold">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.cvname : ""}
            className={"font-semibold"}
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
            value={dataConfig ? dataConfig.subtabel : ""}
            onChange={(text) =>
              setdataConfig({ ...dataConfig, subtabel: text })
            }
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
      </div>
      <>
        <div className="mt-3 overflow-x-auto border-collapse border">
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th
                  rowSpan="3"
                  className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Tanggal
                </th>
                <th
                  rowSpan="3"
                  className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Nama Customer
                </th>
                <th
                  rowSpan="3"
                  className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  No Faktur
                </th>
                <th
                  colSpan="2"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Debet
                </th>
                <th
                  colSpan="3"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Kredit
                </th>
              </tr>
              <tr>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Piutang Dagang
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
                  Persediaan
                </th>
              </tr>
              <tr>
                {[
                  "piutangdagang",
                  "hpp",
                  "penjualan",
                  "ppnkeluar",
                  "persediaan",
                ].map((item, index) => {
                  const dat = find(dataConfig.dataakun, { name: item });
                  return (
                    <th
                      key={index}
                      className="min-w-10v max-w-10v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                    >
                      {dat && dat.noakun}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {dataConfig &&
                dataConfig.datainvoice.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                  >
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      <div className="relative">
                        <TextField
                          fullWidth
                          multiline
                          className={classes.inpputKeperluan}
                          placeholder="Tanggal"
                          value={item.tanggal}
                          onChange={(e) => handleInputChange(e, index)}
                          name="tanggal"
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
                          multiline
                          className={classes.inpputKeperluan}
                          placeholder="Nama Pembeli"
                          value={item.buyername}
                          onChange={(e) => handleInputChange(e, index)}
                          name="buyername"
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
                          multiline
                          className={classes.inpputKeperluan}
                          placeholder="no invoice"
                          value={item.noinvoice}
                          onChange={(e) => handleInputChange(e, index)}
                          name="noinvoice"
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
                      {numberFormat(item.jumlah)}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {numberFormat(item.hpp)}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {numberFormat(item.subtotal)}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {numberFormat(item.ppn)}
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      {numberFormat(item.persediaan)}
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
                  "piutangdagang",
                  "hpp",
                  "penjualan",
                  "ppnkeluar",
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
                {/* <td className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig.datainvoice, "jumlah"))}
                </td>
                <td className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig.datainvoice, "hpp"))}
                </td>
                <td className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig.datainvoice, "subtotal"))}
                </td>
                <td className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig.datainvoice, "ppn"))}
                </td>
                <td className="px-1 py-3 text-base font-semibold bg-slate-50 text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig.datainvoice, "persediaan"))}
                </td> */}
              </tr>
            </tfoot>
          </table>
          <div className="py-2 px-3">
            <Button
              className={classes.btnresetsoal}
              onClick={() => props.setDataInvoice([])}
            >
              Hapus semua
            </Button>
          </div>
        </div>
      </>
    </div>
  );
}

export default TableAdmin4;
