import { TextField } from "@mui/material";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";

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
  const { dataConfig, setdataConfig } = props;
  const { dataakun } = dataConfig;

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...dataakun];
    list[index][name] = value;

    setdataConfig({
      ...dataConfig,
      dataakun: list,
    });
  };

  return (
    <>
      <table className="border-collapse mt-3">
        <thead>
          <tr>
            <th
              colSpan="12"
              className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
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
          {dataakun &&
            dataakun.map((data, i) => (
              <tr key={i}>
                <td className="p-2 text-center border border-slate-300 table-cell">
                  <div className="relative">
                    <TextField
                      multiline
                      placeholder="no akun"
                      value={data.noakun}
                      onChange={(e) => handleInputChange(e, i)}
                      name="noakun"
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
                <td className="p-2 text-center border border-slate-300 table-cell">
                  {numberFormat(data.jumlah)}
                </td>
                <td className="p-2 text-center border border-slate-300 table-cell capitalize">
                  {data.posisi === "debit" || data.posisi === "debet"
                    ? "Debet"
                    : data.posisi}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default TableAkun;
