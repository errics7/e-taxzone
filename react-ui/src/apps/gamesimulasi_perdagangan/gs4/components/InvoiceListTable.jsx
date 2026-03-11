//#region
import React, { forwardRef } from "react";
import { InputGrowUpTextWithName } from "../../componentglobal/inputGrowUpTextWithName";
import { v4 as uuidv4 } from "uuid";
import TextField from "@mui/material/TextField";
import NumberFormat from "react-number-format";
import { findIndex, filter, sumBy, sum, map } from "lodash";
import EditIcon from "@mui/icons-material/Edit";
import { TextareaAutosize } from "@mui/material";

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

//#endregion

export default function InvoiceListTable(props) {
  const datainvoice = props.dataConfig.datainvoice;
  const databarang = props.dataConfig.databarang;
  const dataakun = props.dataConfig.dataakun;

  //#region
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
    const lstinv = [...datainvoice];
    lstinv[index][name] = value;

    props.setdataConfig({
      ...props.dataConfig,
      datainvoice: lstinv,
    });
  };
  //Invoice handle Remove INVOICE
  const handleRemoveClick = (itminv) => { 
    const list = filter([...datainvoice], (x) => x.uid !== itminv.uid);
    const xlist = filter([...databarang], (x) => x.id_invoice !== itminv.uid);

    props.setdataConfig({
      ...props.dataConfig,
      datainvoice: list,
      databarang: xlist,
    });
  };
  //Invoice handle Add button INVOICE
  const handleAddClick = () => {
    const uid = uuidv4();
    const lstinv = [
      ...datainvoice,
      {
        uid: uid,
        noinvoice: "A101",
        buyername: "",
        buyeralamat: "",
        tanggal: "7-Dec-2021",
        noorder: "6701",
        subtotal: 0,
        ppn: 0,
        jumlah: 0,
        hpp: 0,
        persediaan: 0,
      },
    ];
    const lstbarang = [
      ...databarang,
      {
        uid: uuidv4(), //to ezy edit in FE
        id_invoice: uid,
        namabarang: "",
        satuan: "",
        jumlah: 0,
        harga: 0,
        total: 0,
        hpp: 0,
      },
    ];

    props.setdataConfig({
      ...props.dataConfig,
      datainvoice: lstinv,
      databarang: lstbarang,
    });
  };
  //#region
  //DataBarang Data-BARANG BARU
  // const tambahBarang = (uid) => {
  //   const lstBrg = [
  //     ...databarang,
  //     {
  //       id: uuidv4(),
  //       id_invoice: uid,
  //       namabarang: "",
  //       satuan: "",
  //       jumlah: 0,
  //       total: 0,
  //       harga: 0,
  //     },
  //   ];
  //   props.setdataConfig({
  //     ...props.dataConfig,
  //     databarang: lstBrg,
  //   });
  // };
  //#endregion
  //DataBarang Input Handle Barang
  const handleInpBarang = (e, id) => {
    const { name, value } = e.target;
    const index = findIndex(databarang, { uid: id });
    const listbrg = [...databarang];
    listbrg[index][name] =
      name === "harga" || name === "total" || name === "jumlah"
        ? Number(value)
        : value;
    //UPDATE LINK AUTO TOTAL
    listbrg[index]["total"] = Number(
      listbrg[index]["harga"] * Number(listbrg[index]["jumlah"])
    );
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
  //DataBarang Hapus Barang
  // const hapusDataBarang = (id) => {
  //   //
  //   const listbrg = [...databarang];
  //   const index = findIndex(databarang, { id: id });
  //   const inv_id = listbrg[index]["id_invoice"]; // to recalculate
  //   listbrg.splice(index, 1);

  //   //UPDATE LINK AUTO DI INVOICE
  //   const iinv = findIndex(datainvoice, { uid: inv_id });
  //   const listinv = [...datainvoice];
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

  //#endregion

  return (
    <div className="border min-h-10v mt-5">
      <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
        Tampilan Data (soal):
      </div>
      <div className="mt-10 relative">
        <TextareaAutosize
          className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
          value={props.dataConfig ? props.dataConfig.subinvoice : " "}
          onChange={(e) => {
            props.setdataConfig({
              ...props.dataConfig,
              subinvoice: e.target.value,
            });
          }}
        />
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 opacity-70 absolute inset-y-1 right-0"
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center p-4">
        {datainvoice.map((itminv, i) => {
          return (
            <div className="w-full" key={i}>
              <div className="w-full flex justify-end mb-0.5 mt-4">
                <button
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={() => handleRemoveClick(itminv)}
                >
                  Hapus Invoice
                </button>
              </div>

              <div className="w-full border-2 border-dashed">
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-start-1 col-end-4  text-base">
                    <div className="flex flex-col ml-3 mt-3 space-y-2">
                      <InputGrowUpTextWithName
                        name="CV Name"
                        type="text"
                        placeholder="Nama CV"
                        value={props.dataConfig ? props.dataConfig.cvname : ""}
                        index={i}
                        // untuk style yang dikirim font-weight dan font size
                        style={`font-semibold text-2xl`}
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
                        value={props.dataConfig ? props.dataConfig.alamat : ""}
                        index={i}
                        style={`text-base font-medium`}
                        onChange={(e) => {
                          props.setdataConfig({
                            ...props.dataConfig,
                            alamat: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-end-10">
                    <div className="flex flex-col mt-3 space-y-2">
                      <h1 className="text-2xl font-semibold">INVOICE</h1>
                      <div>
                        <label>No : </label>
                        <InputGrowUpTextWithName
                          icon={true}
                          name="noinvoice"
                          type="text"
                          placeholder="No"
                          value={itminv.noinvoice}
                          index={i}
                          style={`text-base font-medium`}
                          onChange={(e) => handleInpInvoice(e, i)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t-2 px-4 py-2 my-2">
                  <h2 className="font-medium text-lg">Customer</h2>
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-start-1 col-end-6 flex flex-col text-base">
                      <div className="my-1">
                        <label className="mr-2">
                          Nama &nbsp;&nbsp;&nbsp; :{" "}
                        </label>
                        <InputGrowUpTextWithName
                          icon={true}
                          name="buyername"
                          type="text"
                          placeholder="Nama Customer"
                          value={itminv.buyername}
                          index={i}
                          onChange={(e) => handleInpInvoice(e, i)}
                        />
                      </div>
                      <div className="my-1 relative">
                        <label className="mr-2">Alamat &nbsp;&nbsp;: </label>
                        <InputGrowUpTextWithName
                          icon={true}
                          name="buyeralamat"
                          type="text"
                          placeholder="Alamat Customer"
                          value={itminv.buyeralamat}
                          index={i}
                          onChange={(e) => handleInpInvoice(e, i)}
                        />
                      </div>
                    </div>
                    <div className="col-end-10 col-span-2 text-base ">
                      <div className="my-1">
                        <label className="mr-2">Tanggal &nbsp;&nbsp;: </label>
                        <InputGrowUpTextWithName
                          icon={true}
                          name="tanggal"
                          type="text"
                          placeholder="Tanggal"
                          value={itminv.tanggal}
                          index={i}
                          onChange={(e) => handleInpInvoice(e, i)}
                        />
                      </div>
                      <div className="my-2">
                        <label className="mr-2">No Order : </label>
                        <InputGrowUpTextWithName
                          icon={true}
                          name="noorder"
                          type="text"
                          placeholder="No Order"
                          value={itminv.noorder}
                          index={i}
                          onChange={(e) => handleInpInvoice(e, i)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* TABEL BARANG */}
                <div className="flex justify-center px-2 border-t-2">
                  <table className="w-full border  text-center mx-2 my-6">
                    <thead className="border-b">
                      <tr>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                        >
                          Nama Barang
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                        >
                          Satuan
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                        >
                          Jumlah
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                        >
                          Harga (Rp)
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-slate-900 px-6 py-4"
                        >
                          Total (Rp)
                        </th>
                      </tr>
                    </thead>
                    {/* ITEM BARANG LIST */}
                    <tbody>
                      {filter(databarang, { id_invoice: itminv.uid }).map(
                        (ibrg, index) => {
                          return (
                            <tr key={index} className="border-b">
                              <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                                <div className="absolute inset-y-0 left-0 flex items-center">
                                  {/* <PopMenuRow
                                    // status={item}
                                    removeRow={() => hapusDataBarang(ibrg.id)}
                                  /> */}
                                </div>
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
                                  className="text-blue-700 absolute inset-y-2 right-3 opacity-30"
                                />
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                                <TextField
                                  placeholder="Satuan"
                                  value={ibrg.satuan}
                                  name="satuan"
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
                      {/* <tr className="border-b">
                        <td className="text-sm text-right text-slate-900 font-medium whitespace-nowrap border-r flex justify-center items-center py-4">
                          <button
                            className="bg-slate-400 text-white px-1 py-1"
                            onClick={() => tambahBarang(itminv.uid)}
                          >
                            Tambah Barang
                          </button>
                        </td>
                      </tr> */}
                    </tbody>
                    <tbody>
                      <tr className="border-b font-semibold">
                        <td
                          colSpan={4}
                          className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                        >
                          Subtotal
                        </td>
                        <td className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap">
                          {toRp(itminv.subtotal)}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td
                          colSpan={4}
                          className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                        >
                          PPN
                        </td>
                        <td
                          colSpan={4}
                          className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap"
                        >
                          {toRp(itminv.ppn)}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td
                          colSpan={4}
                          className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                        >
                          Total
                        </td>
                        <td
                          colSpan={4}
                          className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap"
                        >
                          {toRp(itminv.jumlah)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
        <button
          className="bg-slate-400 text-white px-2 py-2 mt-4"
          onClick={handleAddClick}
        >
          Tambahkan Invoice Baru
        </button>
      </div>
    </div>
  );
}
