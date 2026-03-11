import { TextareaAutosize, TextField } from "@mui/material";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import { filter, findIndex, map, sum, sumBy } from "lodash";
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
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

function TableHpp(props) {
  const { databarang, datainvoice, dataakun } = props.dataConfig;

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    const index = findIndex(databarang, { uid: id });
    const listbrg = [...databarang];
    listbrg[index][name] = Number(value);
    //UPDATE LINK AUTO TOTAL  next
    //UPDATE LINK AUTO DI INVOICE
    const iinv = findIndex(datainvoice, { uid: listbrg[index]["id_invoice"] });
    const listinv = [...datainvoice];
    const bardiinv = filter(databarang, {
      id_invoice: listbrg[index]["id_invoice"],
    });
    const tot = sumBy(bardiinv, "total");
    listinv[iinv]["subtotal"] = tot;
    listinv[iinv]["ppn"] = Number(tot) * 0.1;
    listinv[iinv]["jumlah"] = Number(tot) * 0.1 + tot;
    const datasama = sum(
      map(bardiinv, (x) => {
        const hpp = Number(x.jumlah) * Number(x.hpp);
        return hpp ? hpp : 0;
      })
    );
    listinv[iinv]["hpp"] = datasama;
    listinv[iinv]["persediaan"] = datasama;
    //UPDATE LINK AUTO DI Dataakun
    // ["piutangdagang", "hpp", "penjualan", "ppnkeluar", "persediaan"];
    var listakun = [...dataakun];
    listakun = updtDaakun(listakun, "piutangdagang", sumBy(listinv, "jumlah"));
    listakun = updtDaakun(listakun, "hpp", sumBy(listinv, "hpp"));
    listakun = updtDaakun(listakun, "penjualan", sumBy(listinv, "subtotal"));
    listakun = updtDaakun(listakun, "ppnkeluar", sumBy(listinv, "ppn"));
    listakun = updtDaakun(listakun, "persediaan", sumBy(listinv, "persediaan"));

    props.setdataConfig({
      ...props.dataConfig,
      databarang: listbrg,
      datainvoice: listinv,
      dataakun: listakun,
    });
  };

  const updtDaakun = (inarr, name, val) => {
    var arr = inarr;
    const i = findIndex(arr, { name: name });
    // Replace item at index using native splice
    arr.splice(i, 1, { ...arr[i], jumlah: val });
    return arr;
  };

  return (
    <div>
      <div className="mt-2 relative">
        <TextareaAutosize
          className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
          value={props.dataConfig ? props.dataConfig.narasibarang : " "}
          onChange={(e) => {
            props.setdataConfig({
              ...props.dataConfig,
              narasibarang: e.target.value,
            });
          }}
        />
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 opacity-70 absolute inset-y-1 right-0"
        />
      </div>
      <table className="border-collapse mt-3 mb-5">
        <thead>
          <tr>
            <th className="min-w-20v max-w-20v font-bold bg-slate-50 text-slate-600 border border-slate-300 p-2">
              Nama Barang
            </th>
            <th className="min-w-10v max-w-10v  font-bold bg-slate-50 text-slate-600 border border-slate-300 p-2">
              HPP per satuan (Rp)
            </th>
          </tr>
        </thead>
        <tbody>
          {databarang.map((item, i) => {
            return (
              <tr key={i}>
                <td className="p-2 text-center border border-slate-300 table-cell">
                  {item.namabarang === "" ? (
                    <span className="text-red-300 animate-pulse">
                      Masukkan Nama Barang di Invoice
                    </span>
                  ) : (
                    item.namabarang
                  )}
                </td>
                <td className="p-2 text-center border border-slate-300 table-cell">
                  <div className="relative">
                    <TextField
                      multiline
                      placeholder="HPP Satuan"
                      value={item.hpp}
                      onChange={(e) => handleInputChange(e, item.uid)}
                      name="hpp"
                      inputProps={{
                        style: {
                          textAlign: "center",
                        },
                      }}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
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
    </div>
  );
}

export default TableHpp;
