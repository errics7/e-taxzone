//#region
import React from "react";
import { filter } from "lodash";

//#endregion

export default function InvoiceListTableMhs(props) {
  const datainvoice = props.dataConfig.datainvoice;
  const databarang = props.dataConfig.databarang;

  //format
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };
  //#endregion

  return (
    <>
      <div className="my-3">
        <p>{props.dataConfig ? props.dataConfig.subinvoice : ""}</p>
      </div>
      <div className="w-full flex flex-col items-center justify-center space-y-2">
        {datainvoice.map((itminv, i) => {
          return (
            <div key={i} className="w-full border-2 border-dashed col-end-1">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-start-1 col-end-4  text-base">
                  <div className="flex flex-col ml-3 mt-3 space-y-2">
                    <p className="font-semibold text-2xl">
                      {props.dataConfig ? props.dataConfig.cvname : ""}
                    </p>
                    <p className="text-base font-medium">
                      {props.dataConfig ? props.dataConfig.alamat : ""}
                    </p>
                  </div>
                </div>
                <div className="col-end-10">
                  <div className="flex flex-col mt-3 space-y-2 pr-4">
                    <h1 className="text-2xl font-semibold">INVOICE</h1>
                    <div>
                      <label>No : </label>
                      <span className="text-base font-medium">
                        {itminv.noinvoice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t-2 px-4 py-2 my-2">
                <h2 className="font-medium text-lg">Customer</h2>
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-start-1 col-end-6 flex flex-col text-base">
                    <div className="my-1">
                      <label className="mr-2">Nama &nbsp;&nbsp;&nbsp; : </label>
                      <span>{itminv.buyername}</span>
                    </div>
                    <div className="my-1 relative">
                      <label className="mr-2">Alamat &nbsp;&nbsp;: </label>
                      <span>{itminv.buyeralamat}</span>
                    </div>
                  </div>
                  <div className="col-end-10 col-span-2 text-base ">
                    <div className="my-1">
                      <label className="mr-2">Tanggal &nbsp;&nbsp;: </label>
                      <span>{itminv.tanggal}</span>
                    </div>
                    <div className="my-2">
                      <label className="mr-2">No Order : </label>
                      <span>{itminv.noorder}</span>
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
                              <p>{ibrg.namabarang}</p>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                              <p>{ibrg.satuan}</p>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                              <p>{ibrg.jumlah}</p>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                              <p>{toRp(ibrg.harga)}</p>
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
          );
        })}
      </div>
    </>
  );
}
