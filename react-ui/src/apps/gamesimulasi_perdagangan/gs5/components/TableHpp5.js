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
            value: Number(values.value),
          },
        });
      }}
      prefix="Rp "
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

function TableHpp5(props) {
  const { databarang, datanota, dataakun } = props.dataConfig;

  const handleInputChange = (e, uid) => {
    const { name, value } = e.target;
    const index = findIndex(databarang, { uid: uid });
    const listbrg = [...databarang];
    listbrg[index][name] = Number(value);
    // UPDATE HPP ==linked==> nota/inv->dataakun //
    //UPDATE LINK AUTO barang DI INVOICE /datanota
    const inota = findIndex(datanota, { uid: listbrg[index]["uid_invoice"] });
    const listnota = [...datanota];
    //
    const bardiinv = filter(databarang, {
      uid_invoice: listbrg[index]["uid_invoice"],
    });

    const datasama = sum(
      map(bardiinv, (x) => {
        const hpp = Number(x.jumlah) * Number(x.hpp);
        return hpp ? hpp : 0;
      })
    );
    listnota[inota]["hpp"] = datasama;
    listnota[inota]["persediaan"] = datasama;
    //UPDATE LINK AUTO DI Dataakun
    var listakun = [...dataakun];
    listakun = updtDaakun(
      listakun,
      "kas",
      sumBy(listnota, "jumlah") + sumBy(listnota, "nilaia")
    );
    listakun = updtDaakun(listakun, "hpp", sumBy(listnota, "hpp"));
    listakun = updtDaakun(listakun, "penjualan", sumBy(listnota, "subtotal"));
    listakun = updtDaakun(listakun, "ppnkeluar", sumBy(listnota, "ppn"));
    listakun = updtDaakun(listakun, "piutangdagang", sumBy(listnota, "nilaia"));
    listakun = updtDaakun(
      listakun,
      "persediaan",
      sumBy(listnota, "persediaan")
    );

    props.setdataConfig({
      ...props.dataConfig,
      databarang: listbrg,
      datanota: listnota,
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
  //format
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div>
      <div className="font-semibold">Data HPP</div>
      <div className="mt-2 relative">
        <TextareaAutosize
          className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
          value={props.dataConfig ? props.dataConfig.introsoal : " "}
          onChange={(e) => {
            props.setdataConfig({
              ...props.dataConfig,
              introsoal: e.target.value,
            });
          }}
        />
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 opacity-70 absolute inset-y-1 right-0"
        />
      </div>
      <table className="border-collapse mt-1 mb-5">
        <thead>
          <tr>
            <th className="min-w-20v max-w-20v font-bold bg-slate-50 text-slate-600 border border-slate-300 p-2">
              Nama Barang
            </th>
            <th className="min-w-10v max-w-10v  font-bold bg-slate-50 text-slate-600 border border-slate-300 p-2">
              HPP per satuan (Rp)
            </th>
            <th className="min-w-15v max-w-15v  font-bold bg-slate-50 text-slate-600 border border-slate-300 p-2">
              HPP Total (Rp)
            </th>
            <th className="min-w-15v max-w-15v  font-bold bg-slate-50 text-slate-600 border border-slate-300 p-2">
              Persediaan
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
                <td className="p-2 text-center border border-slate-300 table-cell">
                  {toRp(item.hpp * item.jumlah)}
                </td>
                <td className="p-2 text-center border border-slate-300 table-cell">
                  {toRp(item.hpp * item.jumlah)}
                </td>
              </tr>
            );
          })}
          <tr className="group">
            <td
              colSpan="2"
              className="p-2 font-semibold text-center border border-slate-300 table-cell"
            >
              Jumlah
            </td>
            <td className="p-2 font-semibold text-center border border-slate-300 table-cell group-hover:bg-emerald-500 group-hover:bg-opacity-40">
              {toRp(
                sum(map(databarang, (x) => Number(x.hpp) * Number(x.jumlah)))
              )}
            </td>
            <td className="p-2 font-semibold text-center border border-slate-300 table-cell group-hover:bg-emerald-500 group-hover:bg-opacity-40">
              {toRp(
                sum(map(databarang, (x) => Number(x.hpp) * Number(x.jumlah)))
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TableHpp5;
