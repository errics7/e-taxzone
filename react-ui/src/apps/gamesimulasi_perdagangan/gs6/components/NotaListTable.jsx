import React, { forwardRef } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { TextareaAutosize, TextField } from "@mui/material";
import { InputGrowUpTextWithName } from "../../componentglobal/inputGrowUpTextWithName";
import { filter, findIndex, sumBy } from "lodash";
import NumberFormat from "react-number-format";

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

const NotaListTable = (props) => {
  const dataConfig = props.dataConfig;
  const datanota = dataConfig.datanota;
  const databarang = dataConfig.databarang;
  const dataakun = dataConfig.dataakun;

  const handleInputNota = (e, index) => {
    const { name, value } = e.target;
    const tempNota = [...datanota];
    tempNota[index][name] = value;

    props.setdataConfig({
      ...props.dataConfig,
      datanota: tempNota,
    });
  };

  // Name A changer
  const handleGaji = (e, idx) => {
    const { name, value } = e.target;
    console.log("name:", name);
    console.log("value:", value);
    const tempNota = [...datanota];
    tempNota[idx][name] = Number(value);
    tempNota[idx]["total"] = Number(value);
    let tempAkun = [...dataakun];
    tempAkun = updtDaakun(tempAkun, "bebangaji", sumBy(tempNota, "nilaia"));
    tempAkun = updtDaakun(tempAkun, "kas", sumBy(tempNota, "total"));

    props.setdataConfig({
      ...props.dataConfig,
      datanota: tempNota,
      dataakun: tempAkun,
    });
  };

  const handleInputBarang = (e, id) => {
    const { name, value } = e.target;
    const index = findIndex(databarang, { id: id });
    const tempBarang = [...databarang];
    tempBarang[index][name] =
      name === "jumlah" || name === "hpp" || name === "nilaia"
        ? Number(value)
        : value;

    tempBarang[index]["total"] = Number(
      tempBarang[index]["hpp"] * tempBarang[index]["jumlah"]
    );

    const idNota = findIndex(datanota, { uid: tempBarang[index]["uid"] });
    const tempNota = [...datanota];
    const barangInNota = filter(databarang, { uid: tempBarang[index]["uid"] });
    const total = sumBy(barangInNota, "total");
    tempNota[idNota]["subtotal"] = total;
    tempNota[idNota]["ppn"] = Number(total) * 0.1;
    tempNota[idNota]["total"] = Number(total) * 0.1 + total;

    let tempAkun = [...dataakun];
    tempAkun = updtDaakun(tempAkun, "persediaan", sumBy(tempNota, "subtotal"));
    tempAkun = updtDaakun(tempAkun, "ppnmasukan", sumBy(tempNota, "ppn"));
    tempAkun = updtDaakun(tempAkun, "bebangaji", sumBy(tempNota, "nilaia"));
    tempAkun = updtDaakun(tempAkun, "kas", sumBy(tempNota, "total"));

    props.setdataConfig({
      ...props.dataConfig,
      datanota: tempNota,
      databarang: tempBarang,
      dataakun: tempAkun,
    });
  };

  //DataAkun Update Arr
  const updtDaakun = (inarr, name, val) => {
    var arr = inarr;
    const i = findIndex(arr, { name: name });
    // Replace item at index using native splice
    arr.splice(i, 1, { ...arr[i], jumlah: val });
    return arr;
  };

  return (
    <div className="border min-h-10v mt-5">
      <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
        Tampilan Data (soal):
      </div>
      {datanota.map((nota, idx) => (
        <div key={idx}>
          <div className="mt-10 ml-2 relative">
            {nota.type === "kontan" ? (
              <TextareaAutosize
                className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
                value={props.dataConfig ? props.dataConfig.introkontan : " "}
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
              className="text-blue-700 opacity-30 absolute inset-y-1 right-5"
            />
          </div>
          <div className="border-2 border-dashed m-4">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-start-1 col-end-4  text-base">
                <div className="flex flex-col ml-3 mt-3 space-y-2">
                  {nota.type === "kontan" ? (
                    <>
                      <InputGrowUpTextWithName
                        name="penerima"
                        type="text"
                        placeholder="Penerima"
                        value={nota.penerima ? nota.penerima : ""}
                        index={idx}
                        // untuk style yang dikirim font-weight dan font size
                        style={`font-semibold text-2xl`}
                        onChange={(e) => handleInputNota(e, idx)}
                      />
                      <InputGrowUpTextWithName
                        name="alamat"
                        type="text"
                        value={nota.alamat ? nota.alamat : ""}
                        index={idx}
                        style={`text-base font-medium`}
                        onChange={(e) => handleInputNota(e, idx)}
                      />
                    </>
                  ) : (
                    <>
                      <InputGrowUpTextWithName
                        name="cvname"
                        type="text"
                        placeholder="Nama CV"
                        value={dataConfig.cvname ? dataConfig.cvname : ""}
                        index={idx}
                        // untuk style yang dikirim font-weight dan font size
                        style={`font-semibold text-2xl`}
                        onChange={(e) =>
                          props.setdataConfig({
                            ...dataConfig,
                            cvname: e.target.value,
                          })
                        }
                      />
                      <InputGrowUpTextWithName
                        name="cvalamat"
                        type="text"
                        value={dataConfig.cvalamat ? dataConfig.cvalamat : ""}
                        index={idx}
                        style={`text-base font-medium`}
                        onChange={(e) =>
                          props.setdataConfig({
                            ...dataConfig,
                            cvalamat: e.target.value,
                          })
                        }
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="col-end-10">
                <div className="flex flex-col mt-3 space-y-2">
                  <h1 className="text-xl font-semibold">
                    {nota.type === "kontan"
                      ? "NOTA KONTAN"
                      : "BUKTI KAS KELUAR"}
                  </h1>
                  <div className="flex">
                    <div className="flex justify-between w-16">
                      <p>No</p>
                      <p>:</p>
                    </div>
                    <InputGrowUpTextWithName
                      icon={true}
                      name="no"
                      type="text"
                      placeholder="No"
                      value={nota.no}
                      index={idx}
                      style={`text-base`}
                      onChange={(e) => handleInputNota(e, idx)}
                    />
                  </div>
                  <div className="flex">
                    <div className="flex justify-between w-16">
                      <p>Tanggal</p>
                      <p>:</p>
                    </div>
                    <InputGrowUpTextWithName
                      icon={true}
                      name="tgl"
                      type="text"
                      placeholder="Tanggal"
                      value={nota.tgl}
                      index={idx}
                      onChange={(e) => handleInputNota(e, idx)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t-2 px-4 py-2 my-2">
              <div className="grid grid-cols-6 gap-4">
                {nota.type === "kontan" ? (
                  <div className="col-start-1 col-end-6 flex flex-col">
                    <div className="my-1">
                      <label className="mr-2">
                        Kepada &nbsp;&nbsp;&nbsp; :
                      </label>
                      <InputGrowUpTextWithName
                        icon={true}
                        name="cvname"
                        type="text"
                        placeholder="Nama Customer"
                        value={dataConfig.cvname}
                        index={idx}
                        onChange={(e) =>
                          props.setdataConfig({
                            ...dataConfig,
                            cvname: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="my-1 relative -ml-1">
                      <InputGrowUpTextWithName
                        icon={true}
                        name="cvalamat"
                        type="text"
                        placeholder="Alamat Customer"
                        value={dataConfig.cvalamat}
                        index={idx}
                        onChange={(e) =>
                          props.setdataConfig({
                            ...props.dataConfig,
                            cvalamat: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="col-start-1 col-end-6 flex flex-col text-base mt-3 space-y-1">
                    <div className="flex">
                      <div className="flex justify-between w-44">
                        <p>Dibayarkan kepada</p>
                        <p>:</p>
                      </div>
                      <InputGrowUpTextWithName
                        icon={true}
                        name="penerima"
                        type="text"
                        placeholder="Penerima"
                        value={nota.penerima}
                        index={idx}
                        style={`text-base ml-3`}
                        onChange={(e) => handleInputNota(e, idx)}
                      />
                    </div>
                    <div className="flex">
                      <div className="flex justify-between w-44">
                        <p>Untuk Pembayaran</p>
                        <p>:</p>
                      </div>
                      <InputGrowUpTextWithName
                        icon={true}
                        name="keperluan"
                        type="text"
                        placeholder="Keperluan"
                        value={nota.keperluan ? nota.keperluan : ""}
                        index={idx}
                        style={`text-base ml-3`}
                        onChange={(e) => handleInputNota(e, idx)}
                      />
                    </div>
                    <div className="flex">
                      <div className="flex justify-between w-44">
                        <p>Sebesar</p>
                        <p>:</p>
                      </div>
                      <InputGrowUpTextWithName
                        icon={true}
                        name="nilaih"
                        type="text"
                        placeholder="Nilai dalam Huruf"
                        value={nota.nilaih}
                        index={idx}
                        style={`text-base ml-3`}
                        onChange={(e) => handleInputNota(e, idx)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* TABEL BARANG */}
            {nota.type === "kontan" ? (
              <div className="flex justify-center px-2 border-t-2">
                <table className="w-full border  text-center mx-2 my-6">
                  <thead className="border-b">
                    <tr>
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
                        Uraian
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-slate-900 px-6 py-4 border-r"
                      >
                        Harga per Unit
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
                    {filter(dataConfig.databarang, { uid: nota.uid }).map(
                      (barang, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-6 py-2 whitespace-nowrap text-sm font-light text-slate-900 border-r relative">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                              {/* <PopMenuRow
                                    // status={item}
                                    removeRow={() => hapusDataBarang(ibrg.id)}
                                  /> */}
                            </div>
                            <TextField
                              placeholder="Jumlah"
                              value={barang.jumlah}
                              name="jumlah"
                              onChange={(e) => handleInputBarang(e, barang.id)}
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
                            <div className="absolute inset-y-0 left-0 flex items-center">
                              {/* <PopMenuRow
                                    // status={item}
                                    removeRow={() => hapusDataBarang(ibrg.id)}
                                  /> */}
                            </div>
                            <TextField
                              placeholder="Uraian"
                              value={barang.namabarang}
                              name="namabarang"
                              onChange={(e) => handleInputBarang(e, barang.id)}
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
                            <div className="absolute inset-y-0 left-0 flex items-center">
                              {/* <PopMenuRow
                                    // status={item}
                                    removeRow={() => hapusDataBarang(ibrg.id)}
                                  /> */}
                            </div>
                            <TextField
                              placeholder="HPP"
                              value={barang.hpp}
                              name="hpp"
                              onChange={(e) => handleInputBarang(e, barang.id)}
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
                              className="text-blue-700 absolute inset-y-2 right-3 opacity-30"
                            />
                          </td>

                          <td className="px-6 py-2 whitespace-nowrap text-base text-slate-900 border-r relative">
                            {toRp(barang.total)}
                          </td>
                        </tr>
                      )
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
                        colSpan={3}
                        className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                      >
                        Subtotal
                      </td>
                      <td className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap">
                        {toRp(nota.subtotal)}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td
                        colSpan={3}
                        className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                      >
                        PPN
                      </td>
                      <td
                        colSpan={3}
                        className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap"
                      >
                        {toRp(nota.ppn)}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td
                        colSpan={3}
                        className="text-sm text-right text-slate-900 font-medium px-6 py-4 whitespace-nowrap border-r"
                      >
                        Total
                      </td>
                      <td
                        colSpan={3}
                        className="text-sm text-slate-900 font-medium px-6 py-4 whitespace-nowrap"
                      >
                        {toRp(nota.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-4 mx-6 mb-10 mt-5">
                  <div className="col-start-1 col-end-4 relative bg-slate-100">
                    <TextField
                      placeholder="Nilai"
                      value={nota.nilaia}
                      name="nilaia"
                      onChange={(e) => handleGaji(e, idx)}
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
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 mb-12 -mr-10">
                  <div className="col-start-5 col-end-12 flex justify-around">
                    <div className="text-center pb-28 border-b-2 border-slate-400">
                      Disetujui oleh
                    </div>
                    <div className="text-center pb-28 border-b-2 border-slate-400">
                      Dibayarkan oleh
                    </div>
                    <div className="text-center pb-28 border-b-2 border-slate-400">
                      Diterima oleh
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotaListTable;
