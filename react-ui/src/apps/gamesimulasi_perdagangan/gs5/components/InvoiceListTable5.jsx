//#region
import React from "react";
// import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit";
import { TextareaAutosize } from "@mui/material";
import NotaKontan from "./NotaKontan";
import NotaKas from "./NotaKas";
//#endregion

export default function InvoiceListTable5(props) {
  const datanota = props.dataConfig.datanota;
  // const databarang = props.dataConfig.databarang;

  //#region

  //Invoice handle Remove INVOICE
  // const handleRemoveClick = (index) => {
  //   const list = [...datanota];
  //   list.splice(index, 1);
  //   props.setdataConfig({ ...props.dataConfig, datanota: list });
  // };
  //Invoice handle Add button INVOICE
  // const handleAddClick = () => {
  //   const uid = uuidv4();
  //   const lstinv = [
  //     ...datanota,
  //     {
  //       uid: uid,
  //       noinvoice: "A101",
  //       buyername: "",
  //       buyeralamat: "",
  //       tanggal: "7-Dec-2021",
  //       noorder: "6701",
  //       subtotal: 0,
  //       ppn: 0,
  //       jumlah: 0,
  //       hpp: 0,
  //       persediaan: 0,
  //     },
  //   ];
  //   const lstbarang = [
  //     ...databarang,
  //     {
  //       id: uuidv4(), //to ezy edit in FE
  //       id_invoice: uid,
  //       namabarang: "",
  //       satuan: "",
  //       jumlah: 0,
  //       harga: 0,
  //       total: 0,
  //       hpp: 0,
  //     },
  //   ];

  //   props.setdataConfig({
  //     ...props.dataConfig,
  //     datanota: lstinv,
  //     databarang: lstbarang,
  //   });
  // };
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

  //#endregion

  return (
    <div className="border min-h-10v mt-5">
      <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
        Tampilan Data (soal):
      </div>

      <div className="w-full flex flex-col items-center justify-center p-4 pt-5">
        {datanota.map((itmnota, i) => {
          return (
            <div className="w-full mt-8" key={i}>
              {/* <div className="w-full flex justify-end mb-0.5">
                <button
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={() => handleRemoveClick(i)}
                >
                  Hapus Nota {itmnota.type === "kontan" ? "Kontan" : "Kas"}
                </button>
              </div> */}
              <div className=" relative">
                {itmnota.type === "kontan" ? (
                  <TextareaAutosize
                    className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
                    value={
                      props.dataConfig ? props.dataConfig.introkontan : " "
                    }
                    onChange={(e) => {
                      props.setdataConfig({
                        ...props.dataConfig,
                        introkontan: e.target.value,
                      });
                    }}
                  />
                ) : (
                  <TextareaAutosize
                    className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
                    value={props.dataConfig ? props.dataConfig.introkas : " "}
                    onChange={(e) => {
                      props.setdataConfig({
                        ...props.dataConfig,
                        introkas: e.target.value,
                      });
                    }}
                  />
                )}
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 opacity-70 absolute inset-y-1 right-0"
                />
              </div>
              {itmnota.type === "kontan" ? (
                <NotaKontan
                  itmnota={itmnota}
                  i={i}
                  dataConfig={props.dataConfig}
                  setdataConfig={(dat) => props.setdataConfig(dat)}
                />
              ) : (
                <NotaKas
                  itmnota={itmnota}
                  i={i}
                  dataConfig={props.dataConfig}
                  setdataConfig={(dat) => props.setdataConfig(dat)}
                />
              )}
            </div>
          );
        })}
        {/* <button
          className="bg-slate-400 text-white px-2 py-2 mt-4"
          onClick={handleAddClick}
        >
          Tambahkan Invoice Baru
        </button> */}
      </div>
    </div>
  );
}
