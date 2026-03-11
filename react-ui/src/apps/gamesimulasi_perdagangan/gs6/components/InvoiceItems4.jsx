import React from "react";
import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import PopMenuRow from "./PopMenuRow";
import { v4 as uuidv4 } from "uuid";
import NumberFormat from "react-number-format";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
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
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function InvoiceItems4(props) {
  const dataInvoiceAll = props.dataInvoiceAll;
  const dataInvoice = props.dataInvoice;
  const dataBarang = props.dataBarang;
  const data = dataBarang.filter((x) => x.id_invoice === dataInvoice.uid);
  const hitungTotal = (total) =>
    total.reduce((saldoAwal, saldoAkhir) => saldoAwal + saldoAkhir);

  const removed = (id) => {
    const list = [...dataBarang];
    const index = dataBarang.findIndex((e) => e.id === id);
    list.splice(index, 1);
    props.setDataBarang(list);
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    const index = dataBarang.findIndex((e) => e.id === id);
    const list = [...dataBarang];
    list[index][name] =
      name === "harga" || name === "total" || name === "jumlah"
        ? Number(value)
        : value;
    props.setDataBarang(list);

    handleSubtotal(id);
  };

  const handleSubtotal = (id) => {
    const indexBarang = dataBarang.findIndex((e) => e.id === id);
    const listBarang = [...dataBarang];
    listBarang[indexBarang]["total"] =
      listBarang[indexBarang]["jumlah"] * listBarang[indexBarang]["harga"];
    const subTotal = data.map((e) => e.total);
    const index = dataInvoiceAll.findIndex((e) => e.uid === dataInvoice.uid);
    const list = [...dataInvoiceAll];
    list[index]["subtotal"] = hitungTotal(subTotal);
    props.setDataInvoice(list);

    handlePPN(hitungTotal(subTotal));
  };

  const handlePPN = (subTotal) => {
    const ppn = subTotal / 10;
    const index = dataInvoiceAll.findIndex((e) => e.uid === dataInvoice.uid);
    const list = [...dataInvoiceAll];
    list[index]["ppn"] = ppn;
    props.setDataInvoice(list);

    handleJumlah(ppn, subTotal);
  };

  const handleJumlah = (ppn, subTotal) => {
    const jumlah = ppn + subTotal;
    const index = dataInvoiceAll.findIndex((e) => e.uid === dataInvoice.uid);
    const list = [...dataInvoiceAll];
    list[index]["jumlah"] = jumlah;
    props.setDataInvoice(list);
  };

  const handleAddClick = (uid) => {
    const newId = uuidv4();
    props.setDataBarang([
      ...dataBarang,
      {
        id_invoice: uid,
        // idBarang nantinya menggunakan uuid
        id: newId,
        nama_barang: "",
        satuan: "",
        jumlah: 0,
        harga: 0,
        total: 0,
      },
    ]);
  };

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <>
      {data.map((item, index) => {
        // hitungSubtotal(item.total)
        return (
          <tr key={index} className="border-b">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
              <EditIcon
                fontSize="inherit"
                className="text-blue-700 absolute inset-y-1 right-3 opacity-10"
              />
              <div className="absolute inset-y-0 left-0 flex items-center">
                <PopMenuRow status={item} removeRow={() => removed(item.id)} />
              </div>
              <TextField
                placeholder="Nama Barang"
                value={item.namabarang}
                name="namabarang"
                onChange={(event) => handleInputChange(event, item.id)}
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
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
              <TextField
                placeholder="Satuan"
                value={item.satuan}
                name="satuan"
                onChange={(event) => handleInputChange(event, item.id)}
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
                className="text-blue-700 absolute -inset-y-1 right-1 opacity-10"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
              <TextField
                placeholder="Jumlah"
                value={item.jumlah}
                name="jumlah"
                onChange={(event) => handleInputChange(event, item.id)}
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
                className="text-blue-700 absolute -inset-y-1 right-1 opacity-10"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
              <TextField
                placeholder="Harga"
                value={item.harga}
                name="harga"
                onChange={(event) => handleInputChange(event, item.id)}
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
                className="text-blue-700 absolute -inset-y-1 right-1 opacity-10"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
              {toRp(item.harga * item.jumlah)}
              {/* <TextField
                                placeholder='Total'
                                value={item.total}
                                name='total'
                                onChange={(event) => handleInputChange(event, item.idBarang)}
                                fullWidth
                                InputProps={{
                                    disableUnderline: true,
                                    inputComponent: NumberFormatCustom,
                                }}
                                inputProps={{
                                    prefix: 'Rp ',
                                    style: {
                                        textAlign: "center",
                                        fontSize: 15,
                                    },
                                }}
                            />
                            <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute -inset-y-1 right-1 opacity-10"
                            /> */}
            </td>
          </tr>
        );
      })}
      <tr className="border-b">
        <td className="text-sm text-right text-slate-900 font-medium whitespace-nowrap border-r flex justify-center items-center py-4">
          <button
            className="bg-slate-400 text-white px-1 py-1"
            onClick={() => handleAddClick(props.dataInvoice.uid)}
          >
            Tambah Barang
          </button>
        </td>
      </tr>
      <tr className="border-b">
        <td
          colSpan={4}
          className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
        >
          Subtotal
        </td>
        <td
          colSpan={4}
          className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap"
        >
          {toRp(dataInvoice.subtotal)}
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
          {toRp(dataInvoice.ppn)}
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
          {toRp(dataInvoice.jumlah)}
        </td>
      </tr>
    </>
  );
}
