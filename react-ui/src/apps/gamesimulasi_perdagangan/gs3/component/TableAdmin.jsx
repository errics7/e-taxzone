import makeStyles from "@mui/styles/makeStyles";
import TextField from "@mui/material/TextField";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import { InputGrowUpTextH1 } from "../../../gamesimulasi/componentglobal/InputGrowUpTextH";
import { find, sumBy } from "lodash";

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

function TableAdmin(props) {
  const classes = useStyles();
  const { dataConfig, setdataConfig } = props;

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...dataConfig.datainvoice];
    list[index][name] = value;

    setdataConfig({
      ...dataConfig,
      datainvoice: list,
    });
  };

  return (
    <div className="relative">
      <div className="absolute opacity-50 bg-blue-200 italic font-semibold  -mt-8 p-1 pr-2">
        Kunci jawaban :
      </div>
      <div className="flex flex-col items-center pt-1 pb-1 font-bold  mt-8">
        <div className="text-xl relative uppercase">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.cvname : ""}
            onChange={(text) => setdataConfig({ ...dataConfig, cvname: text })}
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute p-0.5 -inset-y-1 -right-0 opacity-30"
          />
        </div>
      </div>
      <div className="flex flex-col items-center pt-1 pb-1">
        <div className="text-xl relative">JURNAL PEMBELIAN</div>
      </div>
      <div className="flex flex-col items-center pt-1 pb-1 font-bold">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.subtable : ""}
            onChange={(text) =>
              setdataConfig({ ...dataConfig, subtable: text })
            }
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute p-0.5 -inset-y-1 -right-0 opacity-30"
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
                  className="min-w-17v max-w-17v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Tanggal Transaksi
                </th>
                <th
                  rowSpan="3"
                  className="min-w-1/4 max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Nama Pemasok
                </th>
                <th
                  rowSpan="3"
                  className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  No Faktur
                </th>
                <th
                  colSpan={2}
                  className="min-w-1/4 max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Debet
                </th>
                <th className="min-w-1/4 max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kredit
                </th>
              </tr>
              <tr>
                {["persediaan", "ppnmasukan", "hutangdagang"].map(
                  (item, index) => {
                    const dat = find(dataConfig ? dataConfig.dataakun : [], {
                      name: item,
                    });
                    return (
                      <th
                        key={index}
                        className="min-w-1/4 max-w-10v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                      >
                        {dat && dat.alias}
                      </th>
                    );
                  }
                )}
              </tr>
              <tr>
                {["persediaan", "ppnmasukan", "hutangdagang"].map(
                  (item, index) => {
                    const dat = find(dataConfig ? dataConfig.dataakun : [], {
                      name: item,
                    });
                    return (
                      <th
                        key={index}
                        className="bg-amber-500 bg-opacity-30 min-w-1/4 max-w-10v p-1 font-bold text-slate-600 border border-slate-300"
                      >
                        {dat && dat.noakun}
                      </th>
                    );
                  }
                )}
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
                      <div className="relative bg-yellow-100 bg-opacity-80">
                        <TextField
                          multiline
                          className={classes.inpputKeperluan}
                          placeholder="tanggal"
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
                          className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                        />
                      </div>
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      <div className="relative bg-yellow-100 bg-opacity-80">
                        <TextField
                          fullWidth
                          multiline
                          className={classes.inpputKeperluan}
                          placeholder="vendor name"
                          value={item.vendorname}
                          onChange={(e) => handleInputChange(e, index)}
                          name="vendorname"
                          inputProps={{
                            style: {
                              textAlign: "left",
                              paddingLeft: 5,
                            },
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                        />
                      </div>
                    </td>
                    <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                      <div className="relative bg-yellow-100 bg-opacity-80">
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
                          className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                        />
                      </div>
                    </td>

                    <td className="lg:w-auto px-1 text-slate-800 text-center border border-b">
                      <div className="relative  py-2 bg-yellow-100 bg-opacity-80">
                        {numberFormat(item.subtotal)}
                      </div>
                    </td>
                    <td className="lg:w-auto px-1 text-slate-800 text-center border border-b">
                      <div className="relative  py-2 bg-yellow-100 bg-opacity-80">
                        {numberFormat(item.ppn)}
                      </div>
                    </td>
                    <td className="lg:w-auto px-1 text-slate-800 text-center border border-b">
                      <div className="relative  py-2 bg-yellow-100 bg-opacity-80">
                        {numberFormat(item.jumlah)}
                      </div>
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
                <td className="bg-amber-500 bg-opacity-30 px-1 py-3 text-base font-semibold text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig?.datainvoice, "subtotal"))}
                </td>
                <td className="bg-amber-500 bg-opacity-30 px-1 py-3 text-base font-semibold text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig?.datainvoice, "ppn"))}
                </td>
                <td className="bg-amber-500 bg-opacity-30 px-1 py-3 text-base font-semibold text-slate-600 border text-center">
                  {numberFormat(sumBy(dataConfig?.datainvoice, "jumlah"))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    </div>
  );
}

export default TableAdmin;
