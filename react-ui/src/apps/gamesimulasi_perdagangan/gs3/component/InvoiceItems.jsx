import React, { forwardRef } from "react";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import PopMenuRow from "./PopMenuRow";
import { v4 as uuidv4 } from "uuid";
import NumberFormat from "react-number-format";
import { filter, findIndex, sumBy } from "lodash";

const toRp = (number) => {
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

export default function InvoiceItems(props) {
  const { data, dataConfig, setdataConfig } = props;
  const { databarang } = dataConfig;

  const listBarang = filter(databarang, { id_invoice: data.uid });

  const removed = (id) => {
    const index = findIndex(databarang, { id: id });
    const list = [...databarang];
    list.splice(index, 1);

    refreshAll({
      ...dataConfig,
      databarang: list,
    });
  };

  const refreshAll = (conf) => {
    //#1 databarang
    const totHbrg = sumBy(
      filter(conf.databarang, { id_invoice: data.uid }),
      (x) => Number(x.total)
    );
    const totPpn = totHbrg * 0.1;
    const totAll = totPpn + totHbrg;
    //#2 datainvoice
    const listInv = [...conf.datainvoice];
    const indxInv = findIndex(listInv, { uid: data.uid });
    listInv.splice(indxInv, 1, {
      ...listInv[indxInv],
      subtotal: totHbrg,
      ppn: totPpn,
      jumlah: totAll,
    });
    //#3 dataakun
    const totpersediaan = sumBy(listInv, (x) => Number(x.subtotal));
    const totppnmasukan = sumBy(listInv, (x) => Number(x.ppn));
    const tothutangdagang = sumBy(listInv, (x) => Number(x.jumlah));

    const listdataakun = conf.dataakun.map((el) => {
      if (el.name === "persediaan") {
        return { ...el, jumlah: totpersediaan };
      } else if (el.name === "ppnmasukan") {
        return { ...el, jumlah: totppnmasukan };
      } else if (el.name === "hutangdagang") {
        return { ...el, jumlah: tothutangdagang };
      } else {
        return el;
      }
    });

    //finish
    setdataConfig({
      ...conf,
      datainvoice: listInv,
      dataakun: listdataakun,
    });
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    const index = findIndex(databarang, { id: id });
    const list = [...databarang];
    if (name === "harga" || name === "jumlah") {
      var tot = 0;
      if (name === "harga") {
        tot = Number(value) * list[index]["jumlah"];
      } else {
        tot = Number(value) * list[index]["harga"];
      }
      list.splice(index, 1, {
        ...list[index],
        [name]: Number(value),
        total: tot,
      });
    } else {
      list.splice(index, 1, {
        ...list[index],
        [name]: value,
      });
    }

    refreshAll({
      ...dataConfig,
      databarang: list,
    });
  };

  const handleAddClick = (uid) => {
    setdataConfig({
      ...dataConfig,
      databarang: [
        ...databarang,
        {
          id: uuidv4(), //to ezy edit in FE
          id_invoice: uid,
          namabarang: "",
          satuan: "",
          jumlah: 0,
          harga: 0,
          total: 0,
        },
      ],
    });
  };

  // console.log(data);
  return (
    <>
      {listBarang.map((item, index) => {
        // hitungSubtotal(item.total)
        return (
          <tr key={index} className="border-b">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
              <EditIcon
                fontSize="inherit"
                className="text-blue-700 absolute inset-y-1 right-3 opacity-30"
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
            <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
              <TextField
                placeholder="Jumlah"
                value={item.jumlah}
                name="jumlah"
                onChange={(event) => handleInputChange(event, item.id)}
                fullWidth
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
            <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
              <TextField
                placeholder="Harga"
                value={item.harga}
                name="harga"
                onChange={(event) => handleInputChange(event, item.id)}
                fullWidth
                InputProps={{
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
                className="text-blue-700 absolute inset-y-2 right-3 opacity-30"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium  text-slate-900 border-r relative">
              {toRp(item.harga * item.jumlah)}
            </td>
          </tr>
        );
      })}
      <tr className="border-b">
        <td className="text-sm text-right text-slate-900 font-medium whitespace-nowrap border-r flex justify-center items-center py-4">
          <button
            className="bg-slate-400 text-white px-2 py-1 rounded hover:scale-105 hover:shadow-lg transition-all"
            onClick={() => handleAddClick(data.uid)}
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
          {toRp(data.subtotal)}
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
          {toRp(data.ppn)}
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
          {toRp(data.jumlah)}
        </td>
      </tr>
    </>
  );
}
