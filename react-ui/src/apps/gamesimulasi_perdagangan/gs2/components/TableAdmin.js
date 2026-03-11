import React, { forwardRef } from "react";
import makeStyles from "@mui/styles/makeStyles";
import TextField from "@mui/material/TextField";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import Button from "@mui/material/Button";

import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import MenuDelete from "../../componentglobal/MenuDelete";
import { FormControl, Tooltip } from "@mui/material";
import { InputGrowUpTextH2 } from "../../componentglobal/InputGrowUpTextH";

const numberFormat = (number) => {
  return (
    <NumberFormat
      value={number}
      prefix={"Rp "}
      displayType={"text"}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
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
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

const useStyles = makeStyles((theme) => ({}));

function TableAdmin(props) {
  const classes = useStyles();
  const { dataConfig } = props;

  const handleRemoveItemSoal = (idx) => {
    // assigning the list to temp variable
    const temp = [...dataConfig.databarang];
    // removing the element using splice
    temp.splice(idx, 1);
    // updating the list
    props.setdataConfig({
      ...dataConfig,
      databarang: temp,
    });
  };
  const updtRowBarang = (index, name, val) => {
    const temp = [...dataConfig.databarang];
    const updt = temp.map((el, i) =>
      index === i
        ? {
            ...el,
            [name]: val,
          }
        : el
    );
    props.setdataConfig({
      ...dataConfig,
      databarang: updt,
    });
  };
  const addRowBarang = () => {
    props.setdataConfig({
      ...dataConfig,
      databarang: [
        ...dataConfig.databarang,
        {
          kode: "PPR005",
          namabarang: "",
          hargajual: 0,
          hargabeli: 0,
          stok: 0,
          tgl: "03/12/21",
        },
      ],
    });
  };
  const updateConf = (name, val) => {
    props.setdataConfig({
      ...dataConfig,
      [name]: val,
    });
  };

  return (
    <div className="relative">
      <div className="absolute opacity-50 bg-blue-200 italic font-semibold -mt-10 -ml-5 p-1 pr-2">
        Kunci jawaban :
      </div>
      <div className="mt-5 mb-2 w-full">
        <FormControl fullWidth className={classes.margin}>
          <TextField
            multiline
            value={dataConfig.narasiadt1}
            onChange={(event) => updateConf("narasiadt1", event.target.value)}
            className="text-center py-1"
            name="title"
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 absolute inset-y-0 right-0 opacity-40 p-0.5"
          />
        </FormControl>
      </div>
      <div className="mx-auto mt-5 mb-1 flex items-center justify-center">
        <InputGrowUpTextH2
          value={dataConfig.headadt1}
          onChange={(event) => updateConf("headadt1", event.target.value)}
        />
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 opacity-40 -mt-3 -ml-5"
        />
      </div>
      <div className="overflow-x-auto col-span-8">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th className="min-w-7v max-w-7v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                No
              </th>
              <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Tanggal
              </th>
              <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Kode
              </th>
              <th className="min-w-25v max-w-25v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Nama Barang
              </th>
              <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Harga Jual (Rp)
              </th>
              <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Harga Beli (Rp)
              </th>
              <th className="min-w-10v max-w-10v py-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                {/* Stok 30 Nov 2021 (Satuan) */}
                <div className="relative">
                  <TextField
                    fullWidth
                    value={dataConfig.headadt2}
                    onChange={(event) =>
                      updateConf("headadt2", event.target.value)
                    }
                    inputProps={{
                      style: {
                        textAlign: "center",
                        fontWeight: 700,
                      },
                    }}
                    name="stok"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute inset-y-0 right-0 opacity-40 p-0.5"
                  />
                </div>
              </th>
              <th className="min-w-20v max-w-20v py-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                <div className="relative">
                  <TextField
                    fullWidth
                    value={dataConfig.headadt3}
                    onChange={(event) =>
                      updateConf("headadt3", event.target.value)
                    }
                    inputProps={{
                      style: {
                        textAlign: "center",
                        fontWeight: 700,
                      },
                    }}
                    name="saldo"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute inset-y-0 right-0 opacity-40 p-0.5"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {dataConfig &&
              dataConfig.databarang.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                >
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    {index + 1}
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <TextField
                        className={classes.inpputKeperluan}
                        placeholder="Tanggal"
                        value={item.tgl}
                        onChange={(e) =>
                          updtRowBarang(index, "tgl", e.target.value)
                        }
                        inputProps={{
                          style: {
                            textAlign: "center",
                          },
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-40 p-0.5"
                      />
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <TextField
                        className={classes.inpputKeperluan}
                        placeholder="Kode"
                        value={item.kode}
                        onChange={(e) =>
                          updtRowBarang(index, "kode", e.target.value)
                        }
                        inputProps={{
                          style: {
                            textAlign: "center",
                          },
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-40 p-0.5"
                      />
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <TextField
                        fullWidth
                        className={classes.inpputKeperluan}
                        placeholder="Nama Barang"
                        value={item.namabarang}
                        onChange={(e) =>
                          updtRowBarang(index, "namabarang", e.target.value)
                        }
                        inputProps={{
                          style: {
                            paddingLeft: 3,
                          },
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-40 p-0.5"
                      />
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <TextField
                        value={item.hargajual}
                        className="text-center py-1"
                        onChange={(e) =>
                          updtRowBarang(
                            index,
                            "hargajual",
                            e.target.value.replace(/\D/, "")
                          )
                        }
                        name="hargajual"
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                        inputProps={{
                          style: {
                            textAlign: "center",
                          },
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-40 p-0.5"
                      />
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <TextField
                        value={item.hargabeli}
                        className="text-center py-1"
                        onChange={(e) =>
                          updtRowBarang(
                            index,
                            "hargabeli",
                            e.target.value.replace(/\D/, "")
                          )
                        }
                        name="hargabeli"
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                        inputProps={{
                          style: {
                            textAlign: "center",
                          },
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-40 p-0.5"
                      />
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <TextField
                        value={item.stok}
                        inputProps={{
                          style: { textAlign: "center", paddingRight: "20px" },
                        }}
                        onChange={(e) =>
                          updtRowBarang(index, "stok", e.target.value)
                        }
                        name="stok"
                        type="number"
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-40 p-0.5"
                      />
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <NumberFormat
                        value={item.stok * item.hargabeli}
                        thousandSeparator="."
                        decimalSeparator=","
                        isNumericString
                        prefix="Rp "
                        displayType={"text"}
                        renderText={(value, props) => (
                          <div {...props}>{value}</div>
                        )}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <MenuDelete
                          index={index}
                          removeButton={(id) => handleRemoveItemSoal(id)}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="col-span-2 py-2 px-3 w-full border text-left flex justify-between flex-row items-center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.btnadd}
            startIcon={<LibraryAddIcon />}
            onClick={() => addRowBarang()}
          >
            Tambah
          </Button>
          <Button
            className={classes.btnresetsoal}
            onClick={() =>
              props.setdataConfig({
                ...dataConfig,
                databarang: [],
              })
            }
          >
            Hapus semua
          </Button>
        </div>
      </div>
      {/* Preview */}
      {dataConfig && dataConfig.databarang.length > 0 && (
        <>
          <div className="mt-5">Data Worksheet Preview :</div>
          <div className="mt-3 overflow-x-auto col-span-8">
            <table className="border-collapse min-w-full table-fixed">
              <thead>
                <tr>
                  <th
                    colSpan="12"
                    className="w-12/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    <div>KARTU PERSEDIAAN*</div>
                    <div className="text-left">
                      Nama Barang: {dataConfig.databarang[0].namabarang}
                    </div>
                  </th>
                </tr>
                <tr>
                  <th
                    rowSpan="2"
                    className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Tgl
                  </th>
                  <th
                    rowSpan="2"
                    className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Uraian
                  </th>
                  <th
                    colSpan="3"
                    className=" p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Pembelian
                  </th>
                  <th
                    colSpan="3"
                    className=" p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Penjualan
                  </th>
                  <th
                    colSpan="3"
                    className=" p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                  >
                    Saldo
                  </th>
                </tr>
                <tr>
                  <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Kuantitas
                  </th>
                  <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    HP/Unit
                  </th>
                  <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Jumlah
                  </th>

                  <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Kuantitas
                  </th>
                  <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    HP/Unit
                  </th>
                  <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Jumlah
                  </th>

                  <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Kuantitas
                  </th>
                  <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    HP/Unit
                  </th>
                  <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 ">
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                    {dataConfig.databarang[0].tgl}
                  </td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b">
                    Saldo Awal
                  </td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                  <td className="lg:w-auto px-1 py-2 bg-amber-300  text-slate-800 text-center border border-b">
                    {numberFormat(dataConfig.databarang[0].stok)}
                  </td>
                  <td className="lg:w-auto px-1 py-2 bg-amber-300  text-slate-800 text-center border border-b">
                    {numberFormat(dataConfig.databarang[0].hargabeli)}
                  </td>
                  <td className="lg:w-auto px-1 py-2 bg-amber-300 text-slate-800 text-center border border-b">
                    {numberFormat(
                      dataConfig.databarang[0].stok *
                        dataConfig.databarang[0].hargabeli
                    )}
                  </td>
                </tr>
                <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 ">
                  <td className="lg:w-auto px-1 py-5  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                </tr>
                <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 ">
                  <td className="lg:w-auto px-1 py-5  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>

                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                  <td className="lg:w-auto px-1 py-2  text-slate-800 text-center border border-b"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-2 mb-1">
            <Tooltip
              title="isian jawaban untuk mahasiswa"
              arrow
              placement="bottom"
            >
              <Button
                variant="contained"
                color="primary"
                className="bg-amber-300"
              >
                (*)
              </Button>
            </Tooltip>{" "}
            Contoh tampil kartu persediaan dari barang No.1
          </div>
        </>
      )}
    </div>
  );
}

export default TableAdmin;
