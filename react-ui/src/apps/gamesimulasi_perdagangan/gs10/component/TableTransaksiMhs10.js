import NumberFormat from "react-number-format";
import { filter, sumBy } from "lodash";

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

export default function TableTransaksiMhs10(props) {
  const { dataConfig } = props;
  const barangBuy = filter(dataConfig.databarang, { type: "buy" });
  const barangSell = filter(dataConfig.databarang, { type: "sell" });

  const totalbuy = sumBy(barangBuy, (x) => x.total);
  const totalsell = sumBy(barangSell, (x) => x.total);

  return (
    <div className="relative bg-white">
      <div className="mb-5 px-1 relative">
        {props.dataConfig ? props.dataConfig.introsoal : " "}
      </div>
      <div className="mt-2 mb-0 relative">
        {props.dataConfig ? props.dataConfig.buyintro : " "}
      </div>
      <>
        <div className="overflow-x-auto border-collapse">
          <div className="w-full border-2 border-dashed mb-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col px-4 pt-4">
                <p className="font-semibold text-2xl mb-3">
                  {dataConfig.buyptname}
                </p>
                <p className={`pr-5`}>{dataConfig.buyptalamat}</p>
              </div>
              <div className="flex flex-col px-4 -mb-3">
                <h1 className="text-2xl font-medium">INVOICE</h1>
                <div className="flex items-center">
                  <label>No : </label>
                  <p className={`text-base ml-1 min-w-10v`}>
                    {dataConfig.buynoinvoice}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t-2 px-4 py-2 my-2">
              <h2 className="font-medium text-lg">Customer</h2>
              <div className="grid grid-cols-6">
                <div className="col-start-1 col-end-6 ">
                  <div className="flex flex-col mt-3 space-y-2">
                    <div className="flex items-center">
                      <div className="flex w-24 justify-between">
                        <label>Nama</label>
                        <label>:</label>
                      </div>
                      <p className="ml-2">{dataConfig.buycustname}</p>
                    </div>
                    <div className="flex">
                      <div className="flex w-24 justify-between">
                        <label>Alamat</label>
                        <label>:</label>
                      </div>
                      <p className="ml-2 mr-5">{dataConfig.buycustalamat}</p>
                    </div>
                  </div>
                </div>
                <div className="col-end-10">
                  <div className="flex flex-col mt-3 space-y-2">
                    <div className="flex">
                      <div className="flex w-24 justify-between">
                        <label>Tanggal</label>
                        <label>:</label>
                      </div>
                      <p className="ml-2">{dataConfig.buytgl}</p>
                    </div>
                    <div className="flex">
                      <div className="flex w-24 justify-between">
                        <label>No Order :</label>
                        <label>:</label>
                      </div>
                      <p className="ml-2">{dataConfig.buynoorder}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center px-1 border-t-2">
              <table className="w-full border  text-center mx-2 my-6">
                <thead className="border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                    >
                      Nama Barang
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-slate-900 min-w-7v max-w-7v py-3 border-r"
                    >
                      Satuan
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                    >
                      Jumlah
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                    >
                      Harga (Rp)
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3"
                    >
                      Total (Rp)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {barangBuy.map((item, index) => {
                    return (
                      <tr key={index} className="border-b">
                        <td className="py-3 text-slate-900 border-r relative">
                          <div className="relative">{item.namabarang}</div>
                        </td>
                        <td className="py-3 min-w-7v max-w-7v text-slate-900 border-r relative">
                          <div className="relative">{item.satuan}</div>
                        </td>
                        <td className="py-3 min-w-15v max-w-15v text-slate-900 border-r relative">
                          <div className="relative">{item.jumlah}</div>
                        </td>
                        <td className="py-3 min-w-15v max-w-15v text-slate-900 border-r relative">
                          <div className="relative">
                            {numberFormat(item.harga)}
                          </div>
                        </td>
                        <td className="py-3 min-w-15v max-w-15v text-slate-900 border-r relative">
                          <div className="relative">
                            {numberFormat(item.total)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-slate-900 border-r relative">
                      &nbsp;
                    </td>
                    <td className="py-3 text-slate-900 border-r relative">
                      &nbsp;
                    </td>
                    <td className="py-3 text-slate-900 border-r relative">
                      &nbsp;
                    </td>
                    <td className="py-3 text-slate-900 border-r relative">
                      &nbsp;
                    </td>
                    <td className="py-3 text-slate-900 border-r relative">
                      &nbsp;
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td
                      colSpan={4}
                      className="text-sm text-right text-slate-900 font-medium px-6 py-3 whitespace-nowrap border-r"
                    >
                      Subtotal
                    </td>
                    <td
                      colSpan={4}
                      className="text-sm text-slate-900 font-medium px-6 py-3 whitespace-nowrap"
                    >
                      {numberFormat(totalbuy)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td
                      colSpan={4}
                      className="text-sm text-right text-slate-900 font-medium px-6 py-3 whitespace-nowrap border-r"
                    >
                      PPN
                    </td>
                    <td
                      colSpan={4}
                      className="text-sm text-slate-900 font-medium px-6 py-3 whitespace-nowrap"
                    >
                      {numberFormat(totalbuy * 0.1)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td
                      colSpan={4}
                      className="text-sm text-right text-slate-900 font-medium px-6 py-3 whitespace-nowrap border-r"
                    >
                      Total
                    </td>
                    <td
                      colSpan={4}
                      className="text-sm text-slate-900 font-medium px-6 py-3 whitespace-nowrap"
                    >
                      {numberFormat(totalbuy * 0.1 + totalbuy)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
      {/* Selling Section */}
      <div className="mt-2 mb-0 relative">
        {props.dataConfig ? props.dataConfig.sellintro : " "}
      </div>
      <>
        <div key={1} className="w-full border-2 border-dashed mb-4">
          <div className="flex justify-between ">
            <div className="flex flex-col px-4 pt-6">
              <p className="font-semibold text-2xl mb-3">
                {dataConfig.sellptname}
              </p>
              <p className="pr-5">{dataConfig.sellptalamat}</p>
            </div>
            <div className="flex flex-col pt-6 mb-2 pr-5">
              <h1 className="text-2xl font-medium">NOTA KONTAN</h1>
              <div className="flex items-center pt-1">
                <div className="flex w-24 justify-between">
                  <label>No</label>
                  <label>:</label>
                </div>
                <p className="ml-2">{dataConfig.sellptno}</p>
              </div>
              <div className="flex items-center pt-1">
                <div className="flex w-24 justify-between">
                  <label>Tanggal</label>
                  <label>:</label>
                </div>
                <p className="ml-2">{dataConfig.selltgl}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center px-1 ">
            <table className="w-full border  text-center mx-2 my-6">
              <thead className="border-b">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-slate-900  min-w-7v max-w-7v py-3 border-r"
                  >
                    Jumlah
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                  >
                    Uraian
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                  >
                    Harga per Unit
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-slate-900 min-w-15v max-w-15v py-3 border-r"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {barangSell.map((element, index) => {
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-3 min-w-15v max-w-15v text-slate-900 border-r relative">
                        <div className="relative">{element.jumlah}</div>
                      </td>
                      <td className="py-3 text-slate-900 border-r relative">
                        <div className="relative">{element.namabarang}</div>
                      </td>
                      <td className="py-3 min-w-15v max-w-15v text-slate-900 border-r relative">
                        <div className="relative">
                          {numberFormat(element.harga)}
                        </div>
                      </td>
                      <td className="py-3 min-w-15v max-w-15v text-slate-900 border-r relative">
                        <div className="relative">
                          {numberFormat(element.total)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 text-slate-900 border-r relative">
                    &nbsp;
                  </td>
                  <td className="py-3 text-slate-900 border-r relative">
                    &nbsp;
                  </td>
                  <td className="py-3 text-slate-900 border-r relative">
                    &nbsp;
                  </td>
                  <td className="py-3 text-slate-900 border-r relative">
                    &nbsp;
                  </td>
                </tr>
                <tr className="border-b">
                  <td
                    colSpan={3}
                    className="text-sm text-right text-slate-900 font-medium px-6 py-3 whitespace-nowrap border-r"
                  >
                    Subtotal
                  </td>
                  <td
                    colSpan={3}
                    className="text-sm text-slate-900 font-medium px-6 py-3 whitespace-nowrap"
                  >
                    {numberFormat(totalsell)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td
                    colSpan={3}
                    className="text-sm text-right text-slate-900 font-medium px-6 py-3 whitespace-nowrap border-r"
                  >
                    PPN
                  </td>
                  <td
                    colSpan={3}
                    className="text-sm text-slate-900 font-medium px-6 py-3 whitespace-nowrap"
                  >
                    {numberFormat(totalsell * 0.1)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td
                    colSpan={3}
                    className="text-sm text-right text-slate-900 font-medium px-6 py-3 whitespace-nowrap border-r"
                  >
                    Total
                  </td>
                  <td
                    colSpan={3}
                    className="text-sm text-slate-900 font-medium px-6 py-3 whitespace-nowrap"
                  >
                    {numberFormat(totalsell * 0.1 + totalsell)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    </div>
  );
}
