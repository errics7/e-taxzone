import React from "react";
import { InputGrowUpTextWithName } from "../../componentglobal/inputGrowUpTextWithName";
import InvoiceItems from "./InvoiceItems";
import { v4 as uuidv4 } from "uuid";
import { remove } from "lodash";
import swal from "sweetalert";
import toast from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import { TextareaAutosize } from "@mui/material";

export default function Invoice(props) {
  const { dataConfig, setdataConfig } = props;
  const { datainvoice, databarang } = dataConfig;

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...datainvoice];
    list[index][name] = value;
    setdataConfig({
      ...dataConfig,
      datainvoice: list,
    });
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const listold = datainvoice[index];
    const listbrg = [...databarang];
    const list = [...datainvoice];

    list.splice(index, 1);
    remove(listbrg, (x) => x.id_invoice === listold.uid);

    setdataConfig({
      ...dataConfig,
      datainvoice: list,
      databarang: listbrg,
    });
    toast.success("Menghapus Invoice Berhasil");
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setdataConfig({
      ...dataConfig,
      datainvoice: [
        ...datainvoice,
        {
          uid: uuidv4(),
          vendorname: "Vendor Name",
          vendoralamat: "Jl. Alamat vendor",
          buyername: "CV Rovadi",
          buyeralamat: "Jl. Soekarno Blok A1, Malang",
          tanggal: "3-Dec-2021",
          noinvoice: "J-",
          noorder: "123",
          subtotal: 0,
          ppn: 0,
          jumlah: 0,
        },
      ],
    });
  };

  return (
    <div className="border min-h-10v mt-10">
      <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
        Tampilan Data (soal):
      </div>
      <div className="mt-10 relative mx-3">
        <TextareaAutosize
          className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
          value={dataConfig ? dataConfig.subinvoice : " "}
          onChange={(e) => {
            setdataConfig({
              ...dataConfig,
              subinvoice: e.target.value,
            });
          }}
        />
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 opacity-60 absolute inset-y-1 right-5"
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center p-4">
        {datainvoice &&
          datainvoice.map((x, i) => {
            return (
              <div className="w-full" key={i}>
                <div className="w-full flex justify-end mb-0.5 mt-4">
                  <button
                    className="bg-red-500 text-white px-2 py-1"
                    onClick={() =>
                      swal({
                        title: `Anda akan mengapus Invoice ${x.vendorname} ?`,
                        text: "",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      }).then((willDelete) => {
                        if (willDelete) {
                          handleRemoveClick(i);
                        } else {
                          return;
                        }
                      })
                    }
                  >
                    Hapus Invoice
                  </button>
                </div>

                <div key={i} className="w-full border-2 border-dashed">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-start-1 col-end-6  text-base">
                      <div className="flex flex-col ml-3 mt-3 space-y-2">
                        <InputGrowUpTextWithName
                          name="vendorname"
                          type="text"
                          placeholder="Nama Vendor"
                          value={x.vendorname}
                          index={i}
                          // untuk style yang dikirim font-weight dan font size
                          style={`font-semibold text-2xl`}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                        <InputGrowUpTextWithName
                          name="vendoralamat"
                          type="text"
                          placeholder="Alamat Vendor"
                          value={x.vendoralamat}
                          index={i}
                          style={`text-base font-medium`}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </div>
                    </div>
                    <div className="col-end-10">
                      <div className="flex flex-col mt-3 space-y-2">
                        <h1 className="text-2xl font-semibold">INVOICE</h1>
                        <div>
                          <label>No : </label>
                          <InputGrowUpTextWithName
                            name="noinvoice"
                            type="text"
                            placeholder="No"
                            value={x.noinvoice}
                            index={i}
                            style={`text-base font-medium`}
                            icon={true}
                            onChange={(e) => handleInputChange(e, i)}
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
                            name="buyername"
                            type="text"
                            placeholder="Nama"
                            value={x.buyername}
                            index={i}
                            icon={true}
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </div>
                        <div className="my-1">
                          <label className="mr-2">Alamat &nbsp;&nbsp;: </label>
                          <InputGrowUpTextWithName
                            name="buyeralamat"
                            type="text"
                            placeholder="Alamat"
                            value={x.buyeralamat}
                            index={i}
                            icon={true}
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </div>
                      </div>
                      <div className="col-end-10 col-span-2 text-base ">
                        <div className="my-1">
                          <label className="mr-2">Tanggal &nbsp;&nbsp;: </label>
                          <InputGrowUpTextWithName
                            name="tanggal"
                            type="text"
                            placeholder="Tanggal"
                            value={x.tanggal}
                            index={i}
                            icon={true}
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </div>
                        <div className="my-2">
                          <label className="mr-2">No Order : </label>
                          <InputGrowUpTextWithName
                            name="noorder"
                            type="text"
                            placeholder="No Order"
                            value={x.noorder}
                            index={i}
                            icon={true}
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
                      <tbody>
                        <InvoiceItems
                          data={x}
                          dataConfig={dataConfig}
                          setdataConfig={(x) => setdataConfig(x)}
                        />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        <button
          className="bg-slate-400 text-white px-3 py-2 mt-4 rounded hover:scale-105 hover:shadow-lg transition-all"
          onClick={handleAddClick}
        >
          Tambahkan Invoice Baru
        </button>
      </div>
    </div>
  );
}
