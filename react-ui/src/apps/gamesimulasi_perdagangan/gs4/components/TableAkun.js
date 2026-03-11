import { TextField } from "@mui/material";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import { find, findIndex } from "lodash";

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

function TableAkun(props) {
  const { dataakun } = props.dataConfig;

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...dataakun];
    list[index][name] = value;
    props.setdataConfig({ ...props.dataConfig, dataakun: list });
  };

  return (
    <>
      <table className="border-collapse mt-3">
        <thead>
          <tr>
            <th
              colSpan="12"
              className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 uppercase"
            >
              <div>Rekapuitulasi</div>
            </th>
          </tr>
          <tr>
            <th className="min-w-7v font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
              No. Akun
            </th>
            <th className="min-w-20v font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
              Jumlah
            </th>
            <th className="min-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
              Posisi
            </th>
          </tr>
        </thead>
        <tbody>
          {["piutangdagang", "hpp", "penjualan", "ppnkeluar", "persediaan"].map(
            (item, i) => {
              const dat = find(dataakun, { name: item });
              const idx = findIndex(dataakun, { name: item });
              return (
                <tr key={i}>
                  <td className="p-2 text-center border border-slate-300 table-cell">
                    <div className="relative">
                      <TextField
                        multiline
                        placeholder="no akun"
                        value={dat.noakun}
                        onChange={(e) => handleInputChange(e, idx)}
                        name="noakun"
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
                  <td className="p-2 text-center border border-slate-300 table-cell">
                    {numberFormat(dat.jumlah)}
                  </td>
                  <td className="p-2 text-center capitalize border border-slate-300 table-cell">
                    {dat.posisi === "debit" || dat.posisi === "debet"
                      ? "Debet"
                      : dat.posisi}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </>
  );
}

export default TableAkun;
