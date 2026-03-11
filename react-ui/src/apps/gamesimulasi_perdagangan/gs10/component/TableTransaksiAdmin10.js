import { TextareaAutosize, TextField } from "@mui/material";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import { findIndex, filter, sumBy, map, remove } from "lodash";
import { InputGrowUpTextWithName } from "../../componentglobal/inputGrowUpTextWithName";
import PopMenuRowTransaksi10 from "./PopMenuRowTransaksi10";
import { forwardRef, useState } from "react";
import NewBarangModal10 from "./NewBarangModal10";

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
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

export default function TableTransaksiAdmin10(props) {
  const { dataConfig, setdataConfig } = props;
  const barangBuy = filter(dataConfig.databarang, { type: "buy" });
  const barangSell = filter(dataConfig.databarang, { type: "sell" });
  const [title, setTitle] = useState(false);
  const [showNewb, setShowNewb] = useState(false);

  //#region
  const handleInputConf = (e) => {
    const { name, value } = e.target;
    setdataConfig({ ...dataConfig, [name]: value });
  };
  const handleInputBrg = (e, uid) => {
    const { name, value } = e.target;
    const idx = findIndex(dataConfig.databarang, { uid: uid });
    console.log(idx);
    const list = [...dataConfig.databarang];
    if (name === "jumlah" || name === "harga") {
      list[idx][name] = value;
      list[idx]["total"] =
        Number(list[idx]["jumlah"]) * Number(list[idx]["harga"]);
    } else {
      list[idx][name] = value;
    }

    setdataConfig({ ...dataConfig, databarang: list });
  };
  const handleChangeName = (e, gen) => {
    const { name, value } = e.target;
    const da = [...dataConfig.databarang];
    const list = map(da, (x) => (x.gen === gen ? { ...x, [name]: value } : x));
    setdataConfig({ ...dataConfig, databarang: list });
  };
  const swapArrayLocs = (arr, index1, index2) => {
    var arry = [...arr];
    var temp = arry[index1];

    arry[index1] = arry[index2];
    arry[index2] = temp;
    return arry;
  };
  const moveData = (A1, A2, type) => {
    const data = type === "buy" ? [...barangBuy] : [...barangSell];
    const p1 = findIndex(data, { uid: A1.uid });
    const p2 = findIndex(data, { uid: A2.uid });
    const brg = filter(dataConfig.databarang, (x) => x.type !== type);

    setdataConfig({
      ...props.dataConfig,
      databarang: [...brg, ...swapArrayLocs(data, p1, p2)],
    });
  };
  const removeBrg = (item) => {
    const list = [...dataConfig.databarang];
    remove(list, (x) => x.gen === item.gen);

    setdataConfig({
      ...dataConfig,
      databarang: list,
    });
  };
  //#endregion

  const totalbuy = sumBy(barangBuy, (x) => x.total);
  const totalsell = sumBy(barangSell, (x) => x.total);

  return (
    <div className="relative mt-5 pt-3">
      <div className="mt-2 mb-5 relative">
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
      <div className="mt-2 mb-0 relative">
        <TextareaAutosize
          className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
          value={props.dataConfig ? props.dataConfig.buyintro : " "}
          onChange={(e) => {
            props.setdataConfig({
              ...props.dataConfig,
              buyintro: e.target.value,
            });
          }}
        />
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 opacity-70 absolute inset-y-1 right-0"
        />
      </div>
      <>
        <div className="overflow-x-auto border-collapse">
          <div className="w-full border-2 border-dashed mb-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col px-4 pt-4">
                <InputGrowUpTextWithName
                  icon={true}
                  name="buyptname"
                  type="text"
                  placeholder="PT NAME"
                  style={`font-semibold text-2xl mb-3`}
                  value={dataConfig.buyptname}
                  index={1}
                  onChange={(e) => handleInputConf(e)}
                />
                {/* <p className="font-semibold text-xl">PT PAPIER</p> */}
                <InputGrowUpTextWithName
                  icon={true}
                  name="buyptalamat"
                  type="text"
                  style={`pr-5`}
                  placeholder="PT Alamat"
                  value={dataConfig.buyptalamat}
                  index={1}
                  onChange={(e) => handleInputConf(e)}
                />
                {/* <p>Jl.Jakarta No.10 Gresik, Jawa Timur</p> */}
              </div>
              <div className="flex flex-col px-4 -mb-3">
                <h1 className="text-2xl font-medium">INVOICE</h1>
                <div>
                  <label>No : </label>
                  <InputGrowUpTextWithName
                    icon={true}
                    name="buynoinvoice"
                    type="text"
                    style={`text-base mt-1`}
                    placeholder="PT Invoice"
                    value={dataConfig.buynoinvoice}
                    index={1}
                    onChange={(e) => handleInputConf(e)}
                  />
                  {/* <span index={1} className={`text-base font-medium`}>
                  J-660
                </span> */}
                </div>
              </div>
            </div>

            <div className="border-t-2 px-4 py-2 my-2">
              <h2 className="font-medium text-lg">Customer</h2>
              <div className="grid grid-cols-6">
                <div className="col-start-1 col-end-6 text-base">
                  <div className="flex flex-col mt-3 space-y-2">
                    <div className="flex items-center">
                      <div className="flex w-24 justify-between">
                        <label>Nama</label>
                        <label>:</label>
                      </div>
                      <InputGrowUpTextWithName
                        icon={true}
                        name="buycustname"
                        type="text"
                        style={`text-base ml-1`}
                        placeholder="Customer Name"
                        value={dataConfig.buycustname}
                        index={1}
                        onChange={(e) => handleInputConf(e)}
                      />
                      {/* <span>CV Rofadi</span> */}
                    </div>
                    <div className="flex">
                      <div className="flex w-24 justify-between">
                        <label>Alamat</label>
                        <label>:</label>
                      </div>
                      <InputGrowUpTextWithName
                        icon={true}
                        name="buycustalamat"
                        type="text"
                        style={`ml-1 mr-5`}
                        placeholder="Customer Alamat"
                        value={dataConfig.buycustalamat}
                        index={1}
                        onChange={(e) => handleInputConf(e)}
                      />
                      {/* <span>Jl.Soekarno Blok A1, Malang</span> */}
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
                      <InputGrowUpTextWithName
                        icon={true}
                        name="buytgl"
                        type="text"
                        style={`ml-1`}
                        placeholder="Tanggal"
                        value={dataConfig.buytgl}
                        index={1}
                        onChange={(e) => handleInputConf(e)}
                      />
                    </div>
                    <div className="flex">
                      <div className="flex w-24 justify-between">
                        <label>No Order :</label>
                        <label>:</label>
                      </div>
                      <InputGrowUpTextWithName
                        icon={true}
                        name="buynoorder"
                        type="text"
                        style={`ml-1`}
                        placeholder="No Order"
                        value={dataConfig.buynoorder}
                        index={1}
                        onChange={(e) => handleInputConf(e)}
                      />
                      {/* <span>765476</span> */}
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
                        <td className="py-2 text-slate-900 border-r relative">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-1 flex items-center z-50">
                              <PopMenuRowTransaksi10
                                indx={index}
                                length={barangBuy.length}
                                alowDel={
                                  dataConfig.selectedbrg === item.gen
                                    ? false
                                    : true
                                }
                                moveUp={() =>
                                  moveData(
                                    barangBuy[index],
                                    barangBuy[index - 1],
                                    "buy"
                                  )
                                }
                                moveDown={() =>
                                  moveData(
                                    barangBuy[index],
                                    barangBuy[index + 1],
                                    "buy"
                                  )
                                }
                                addRow={() => {
                                  setTitle("Transaksi Pembelian Baru");
                                  setShowNewb(true);
                                }}
                                removeRow={() => removeBrg(item)}
                              />
                            </div>
                            <TextField
                              placeholder="Nama Barang"
                              value={item.namabarang}
                              name="namabarang"
                              onChange={(e) => handleChangeName(e, item.gen)}
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
                              className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                            />
                          </div>
                        </td>
                        <td className="py-2 min-w-7v max-w-7v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Satuan"
                              value={item.satuan}
                              name="satuan"
                              onChange={(e) => handleInputBrg(e, item.uid)}
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
                              className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                            />
                          </div>
                        </td>
                        <td className="py-2 min-w-15v max-w-15v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Jumlah"
                              value={item.jumlah}
                              name="jumlah"
                              onChange={(e) => handleInputBrg(e, item.uid)}
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
                              className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                            />
                          </div>
                        </td>
                        <td className="py-2 min-w-15v max-w-15v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Harga"
                              value={item.harga}
                              name="harga"
                              onChange={(e) => handleInputBrg(e, item.uid)}
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
                              className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                            />
                          </div>
                        </td>
                        <td className="py-2 min-w-15v max-w-15v text-slate-900 border-r relative">
                          <div className="relative">
                            <TextField
                              placeholder="Total"
                              value={item.total}
                              name="total"
                              fullWidth
                              InputProps={{
                                disableUnderline: true,
                                readOnly: true,
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
        <TextareaAutosize
          className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
          value={props.dataConfig ? props.dataConfig.sellintro : " "}
          onChange={(e) => {
            props.setdataConfig({
              ...props.dataConfig,
              sellintro: e.target.value,
            });
          }}
        />
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 opacity-70 absolute inset-y-1 right-0"
        />
      </div>
      <>
        <div key={1} className="w-full border-2 border-dashed mb-4">
          <div className="flex justify-between ">
            <div className="flex flex-col px-4 pt-6">
              <InputGrowUpTextWithName
                icon={true}
                name="sellptname"
                type="text"
                placeholder="PT NAME"
                style={`font-semibold text-2xl mb-3`}
                value={dataConfig.sellptname}
                index={1}
                onChange={(e) => handleInputConf(e)}
              />
              {/* <p className="font-semibold text-xl">PT PAPIER</p> */}
              <InputGrowUpTextWithName
                icon={true}
                name="sellptalamat"
                type="text"
                style={`pr-5`}
                placeholder="PT Alamat"
                value={dataConfig.sellptalamat}
                index={1}
                onChange={(e) => handleInputConf(e)}
              />
              {/* <p>Jl.Jakarta No.10 Gresik, Jawa Timur</p> */}
            </div>
            <div className="flex flex-col pt-6 mb-2">
              <h1 className="text-2xl font-medium">NOTA KONTAN</h1>
              <div className="flex items-center pt-1">
                <div className="flex w-24 justify-between">
                  <label>No</label>
                  <label>:</label>
                </div>
                <InputGrowUpTextWithName
                  icon={true}
                  name="sellptno"
                  type="text"
                  style={`text-base ml-1`}
                  placeholder="PT Invoice"
                  value={dataConfig.sellptno}
                  index={1}
                  onChange={(e) => handleInputConf(e)}
                />
              </div>
              <div className="flex items-center pt-1">
                <div className="flex w-24 justify-between">
                  <label>Tanggal</label>
                  <label>:</label>
                </div>
                <InputGrowUpTextWithName
                  icon={true}
                  name="selltgl"
                  type="text"
                  style={`text-base ml-1`}
                  placeholder="PT Invoice"
                  value={dataConfig.selltgl}
                  index={1}
                  onChange={(e) => handleInputConf(e)}
                />
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
                      <td className="py-2 min-w-15v max-w-15v text-slate-900 border-r relative">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-1 flex items-center z-50">
                            <PopMenuRowTransaksi10
                              indx={index}
                              length={barangSell.length}
                              alowDel={
                                dataConfig.selectedbrg === element.gen
                                  ? false
                                  : true
                              }
                              moveUp={() =>
                                moveData(
                                  barangSell[index],
                                  barangSell[index - 1],
                                  "sell"
                                )
                              }
                              moveDown={() =>
                                moveData(
                                  barangSell[index],
                                  barangSell[index + 1],
                                  "sell"
                                )
                              }
                              addRow={() => {
                                setTitle("Transaksi Penjualan Tunai Baru");
                                setShowNewb(true);
                              }}
                              removeRow={() => removeBrg(element)}
                            />
                          </div>

                          <TextField
                            placeholder="Jumlah"
                            value={element.jumlah}
                            name="jumlah"
                            onChange={(e) => handleInputBrg(e, element.uid)}
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
                            className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                          />
                        </div>
                      </td>
                      <td className="py-2 text-slate-900 border-r relative">
                        <div className="relative">
                          <TextField
                            placeholder="Uraian"
                            value={element.namabarang}
                            name="namabarang"
                            onChange={(e) => handleChangeName(e, element.gen)}
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
                            className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                          />
                        </div>
                      </td>
                      <td className="py-2 min-w-15v max-w-15v text-slate-900 border-r relative">
                        <div className="relative">
                          <TextField
                            placeholder="Harga per Unit"
                            value={element.harga}
                            name="harga"
                            onChange={(e) => handleInputBrg(e, element.uid)}
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
                            className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                          />
                        </div>
                      </td>
                      <td className="py-2 min-w-15v max-w-15v text-slate-900 border-r relative">
                        <div className="relative">
                          <TextField
                            placeholder="Total"
                            value={element.total}
                            name="total"
                            fullWidth
                            InputProps={{
                              disableUnderline: true,
                              readOnly: true,
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
      <NewBarangModal10
        title={title}
        dataConfig={dataConfig}
        setdataConfig={(x) => setdataConfig(x)}
        openn={showNewb}
        closeCallback={() => setShowNewb(false)}
      />
    </div>
  );
}
