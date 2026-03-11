import { InputGrowUpTextWithName } from "../../componentglobal/inputGrowUpTextWithName";
import TextField from "@mui/material/TextField";
import { findIndex, filter, sumBy, sum, map } from "lodash";
import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
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
            value: parseFloat(values.value).toFixed(2),
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

export default function NotaKontan(props) {
  const { itmnota, i } = props;
  const datanota = props.dataConfig.datanota;
  const databarang = props.dataConfig.databarang;
  const dataakun = props.dataConfig.dataakun;

  //format
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  //Invoice handle input
  const handleInpInvoice = (e, index) => {
    const { name, value } = e.target;
    const lstnota = [...datanota];
    lstnota[index][name] = value;

    props.setdataConfig({
      ...props.dataConfig,
      datanota: lstnota,
    });
  };
  //DataBarang Input Handle Barang
  const handleInpBarang = (e, uid) => {
    const { name, value } = e.target;
    const index = findIndex(databarang, { uid: uid });
    const listbrg = [...databarang];
    listbrg[index][name] =
      name === "harga" || name === "total" || name === "jumlah"
        ? Number(value)
        : value;
    //UPDATE LINK AUTO TOTAL
    listbrg[index]["total"] = Number(
      listbrg[index]["harga"] * Number(listbrg[index]["jumlah"])
    );
    //UPDATE LINK AUTO DI INVOICE / NOTA
    const iinv = findIndex(datanota, { uid: listbrg[index]["uid_invoice"] });
    const listinv = [...datanota];
    const bardiinv = filter(databarang, {
      uid_invoice: listbrg[index]["uid_invoice"],
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
    listakun = updtDaakun(
      listakun,
      "kas",
      sumBy(listinv, "jumlah") + sumBy(listinv, "nilaia")
    );
    listakun = updtDaakun(listakun, "hpp", sumBy(listinv, "hpp"));
    listakun = updtDaakun(listakun, "penjualan", sumBy(listinv, "subtotal"));
    listakun = updtDaakun(listakun, "ppnkeluar", sumBy(listinv, "ppn"));
    listakun = updtDaakun(listakun, "piutangdagang", sumBy(listinv, "nilaia"));
    listakun = updtDaakun(listakun, "persediaan", sumBy(listinv, "persediaan"));

    props.setdataConfig({
      ...props.dataConfig,
      databarang: listbrg,
      datanota: listinv,
      dataakun: listakun,
    });
  };
  //DataBarang Hapus Barang
  // const hapusDataBarang = (id) => {
  //   //
  //   const listbrg = [...databarang];
  //   const index = findIndex(databarang, { id: id });
  //   const inv_id = listbrg[index]["id_invoice"]; // to recalculate
  //   listbrg.splice(index, 1);

  //   //UPDATE LINK AUTO DI INVOICE
  //   const iinv = findIndex(datanota, { uid: inv_id });
  //   const listinv = [...datanota];
  //   const bardiinv = filter(listbrg, {
  //     id_invoice: inv_id,
  //   });
  //   const tot = sumBy(bardiinv, "total");
  //   listinv[iinv]["subtotal"] = tot;
  //   listinv[iinv]["ppn"] = Number(tot) * 0.1;
  //   listinv[iinv]["jumlah"] = Number(tot) * 0.1 + tot;

  //   props.setdataConfig({
  //     ...props.dataConfig,
  //     databarang: listbrg,
  //   });
  // };
  //DataAkun Update Arr
  const updtDaakun = (inarr, name, val) => {
    var arr = inarr;
    const i = findIndex(arr, { name: name });
    // Replace item at index using native splice
    arr.splice(i, 1, { ...arr[i], jumlah: val });
    return arr;
  };

  return (
    <div className="w-full border-2 border-dashed">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-start-1 col-end-4  text-base">
          <div className="flex flex-col ml-3 mt-3 space-y-2">
            <InputGrowUpTextWithName
              name="CV Name"
              type="text"
              placeholder="Nama CV"
              value={props.dataConfig ? props.dataConfig.cvname : ""}
              index={0}
              style={`font-semibold text-2xl uppercase`}
              onChange={(e) => {
                props.setdataConfig({
                  ...props.dataConfig,
                  cvname: e.target.value,
                });
              }}
            />
            <InputGrowUpTextWithName
              name="cvalamat"
              type="text"
              value={props.dataConfig ? props.dataConfig.cvalamat : ""}
              index={0}
              style={`text-base font-medium`}
              onChange={(e) => {
                props.setdataConfig({
                  ...props.dataConfig,
                  cvalamat: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="col-end-10">
          <div className="flex flex-col mt-3 space-y-2 pr-3">
            <h1 className="text-2xl font-semibold">NOTA KONTAN</h1>
            <div>
              <label>
                No &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
              </label>
              <InputGrowUpTextWithName
                icon={true}
                name="no"
                type="text"
                placeholder="No"
                value={itmnota.no}
                index={i}
                style={`text-base`}
                onChange={(e) => handleInpInvoice(e, i)}
              />
            </div>
            <div>
              <label>Tanggal : </label>
              <InputGrowUpTextWithName
                icon={true}
                name="tgl"
                type="text"
                placeholder="Tanggal"
                value={itmnota.tgl}
                index={i}
                style={`text-base`}
                onChange={(e) => handleInpInvoice(e, i)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* TABEL BARANG */}
      <div className="flex justify-center px-2 border-t mt-5">
        <table className="w-full border  text-center mx-2 my-6">
          <thead className="border-b">
            <tr>
              <th
                scope="col"
                className="font-semibold text-base text-slate-900 px-6 py-4 border-r"
              >
                Jumlah
              </th>
              <th
                scope="col"
                className="font-semibold text-base text-slate-900 px-6 py-4 border-r"
              >
                Uraian
              </th>
              <th
                scope="col"
                className="font-semibold text-base text-slate-900 px-6 py-4 border-r"
              >
                Harga per Unit
              </th>
              <th
                scope="col"
                className="font-semibold text-base text-slate-900 px-6 py-4"
              >
                Total
              </th>
            </tr>
          </thead>
          {/* ITEM BARANG LIST */}
          <tbody>
            {filter(databarang, { uid_invoice: itmnota.uid }).map(
              (ibrg, index) => {
                return (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        {/* <PopMenuRow
                                    // status={item}
                                    removeRow={() => hapusDataBarang(ibrg.uid)}
                                  /> */}
                      </div>
                      <TextField
                        placeholder="Jumlah"
                        value={ibrg.jumlah}
                        name="jumlah"
                        onChange={(e) => handleInpBarang(e, ibrg.uid)}
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
                        className="text-blue-700 absolute inset-y-2 right-3 opacity-30"
                      />
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                      <TextField
                        placeholder="Nama Barang"
                        value={ibrg.namabarang}
                        name="namabarang"
                        onChange={(e) => handleInpBarang(e, ibrg.uid)}
                        fullWidth
                        InputProps={{
                          disableUnderline: true,
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
                        className="text-blue-700 absolute inset-y-2 right-1 opacity-30"
                      />
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                      <TextField
                        placeholder="Harga"
                        value={ibrg.harga}
                        name="harga"
                        onChange={(e) => handleInpBarang(e, ibrg.uid)}
                        fullWidth
                        InputProps={{
                          disableUnderline: true,
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
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-2 right-1 opacity-30"
                      />
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-base text-slate-900 border-r relative">
                      {toRp(ibrg.total)}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
          <tbody>
            <tr className="border-b font-semibold">
              <td
                colSpan={3}
                className="text-sm text-right text-slate-900 font-semibold px-6 py-4 whitespace-nowrap border-r"
              >
                Subtotal
              </td>
              <td className="text-sm text-slate-900 font-semibold px-6 py-4 whitespace-nowrap">
                {toRp(itmnota.subtotal)}
              </td>
            </tr>
            <tr className="border-b">
              <td
                colSpan={3}
                className="text-sm text-right text-slate-900 font-semibold px-6 py-4 whitespace-nowrap border-r"
              >
                PPN
              </td>
              <td className="text-sm text-slate-900 font-semibold px-6 py-4 whitespace-nowrap">
                {toRp(itmnota.ppn)}
              </td>
            </tr>
            <tr className="border-b">
              <td
                colSpan={3}
                className="text-sm text-right text-slate-900 font-semibold px-6 py-4 whitespace-nowrap border-r"
              >
                Total
              </td>
              <td className="text-sm text-slate-900 font-semibold px-6 py-4 whitespace-nowrap">
                {toRp(itmnota.jumlah)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
