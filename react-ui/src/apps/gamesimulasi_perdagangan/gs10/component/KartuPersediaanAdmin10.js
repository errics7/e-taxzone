import { v4 as uuidv4 } from "uuid";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import { map, groupBy, find, filter, findIndex } from "lodash";
import { forwardRef } from "react";

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

export default function KartuPersediaanAdmin10(props) {
  const { dataConfig, setdataConfig } = props;

  const data = groupBy(dataConfig.databarang, "gen");
  const objBrg = map(data, (obj, key) => {
    return { head: key, values: obj };
  });
  //#region
  const handleInputConf = (e) => {
    const { name, value } = e.target;
    setdataConfig({ ...dataConfig, [name]: value });
  };
  //#endregion
  const prepare = () => {
    const daUtama = [];
    const dbSaldo = [
      {
        uid: uuidv4(),
        saldoqty: dataConfig.awalkuantitas,
        saldohpunit: dataConfig.awalhpunit,
        saldojumlah: dataConfig.awalkuantitas * dataConfig.awalhpunit,
      },
    ];

    //#2 start from Pembelian Kredit
    filter(dataConfig.databarang, {
      type: "buy",
      gen: dataConfig.selectedbrg,
    }).forEach((el) => {
      const dummPembelian = [...dbSaldo];
      const jikhrgsama = find(dbSaldo, { saldohpunit: el.harga });

      if (jikhrgsama) {
        const idx = findIndex(dbSaldo, { saldohpunit: el.harga });
        const newed = {
          ...dbSaldo[idx],
          saldoqty: dbSaldo[idx].saldoqty + el.jumlah,
        };
        //setUtama
        dbSaldo.splice(idx, 1, newed);
        //set lokal
        dummPembelian.splice(idx, 1, {
          buy: true,
          buyqty: el.jumlah,
          buyhpunit: el.harga,
          buyjumlah: Number(el.jumlah) * Number(el.harga),
          sell: false,
          saldoqty: dbSaldo[idx].saldoqty + el.jumlah,
          saldohpunit: dbSaldo[idx].saldohpunit,
          saldojumlah: dbSaldo[idx].saldojumlah,
        });
      } else {
        const newed = {
          uid: uuidv4(),
          saldoqty: el.jumlah,
          saldohpunit: el.harga,
          saldojumlah: Number(el.jumlah) * Number(el.harga),
        };
        dbSaldo.push(newed);
        //set lokal
        dummPembelian.splice(0, 1, {
          buy: true,
          buyqty: el.jumlah,
          buyhpunit: el.harga,
          buyjumlah: Number(el.jumlah) * Number(el.harga),
          sell: false,
          saldoqty: dbSaldo[0].saldoqty,
          saldohpunit: dbSaldo[0].saldohpunit,
          saldojumlah: dbSaldo[0].saldojumlah,
        });
        dummPembelian.push({
          buy: false,
          sell: false,
          saldoqty: el.jumlah,
          saldohpunit: el.harga,
          saldojumlah: Number(el.jumlah) * Number(el.harga),
        });
      }
      //
      const forspan = [...dbSaldo];
      daUtama.push({
        type: "buy",
        uraian: "Pembelian Kredit",
        rowspan: forspan.length,
        value: dummPembelian,
      });
    });
    //
    //#3 Penjualan
    filter(dataConfig.databarang, {
      type: "sell",
      gen: dataConfig.selectedbrg,
    }).forEach((el) => {
      const dummSell = [];
      // console.log(el);

      var daQty = el.jumlah * -1; //to -mines
      var indx = 0;
      do {
        const oldqty = daQty;
        const oldsaldo = dbSaldo[indx].saldoqty;
        //trace
        // console.log(
        //   "(" + dbSaldo[indx].saldoqty + "-" + daQty + ")",
        //   dbSaldo[indx].saldoqty + daQty
        // );
        //Operation
        const sisa = Number(dbSaldo[indx].saldoqty) + daQty;
        if (sisa >= 0) {
          //set Sisa
          dbSaldo[indx].saldoqty = sisa;
          daQty = 0;
          //push
          dummSell.push({
            buy: false,
            sell: oldqty === 0 ? false : true,
            sellqty: Math.abs(oldqty),
            sellhpunit: dbSaldo[indx].saldohpunit,
            selljumlah:
              Number(Math.abs(oldqty)) * Number(dbSaldo[indx].saldohpunit),
            saldo: sisa === 0 ? false : true,
            saldoqty: dbSaldo[indx].saldoqty,
            saldohpunit: dbSaldo[indx].saldohpunit,
            saldojumlah:
              Number(dbSaldo[indx].saldoqty) *
              Number(dbSaldo[indx].saldohpunit),
          });
        } else {
          dbSaldo[indx].saldoqty = sisa;
          daQty = sisa;
          //push
          dummSell.push({
            buy: false,
            sell: oldqty === 0 ? false : true,
            sellqty: Math.abs(oldsaldo),
            sellhpunit: dbSaldo[indx].saldohpunit,
            selljumlah:
              Number(Math.abs(oldsaldo)) * Number(dbSaldo[indx].saldohpunit),
            saldo: sisa < 0 ? false : true,
            saldoqty: dbSaldo[indx].saldoqty,
            saldohpunit: dbSaldo[indx].saldohpunit,
            saldojumlah:
              Number(dbSaldo[indx].saldoqty) *
              Number(dbSaldo[indx].saldohpunit),
          });
        }
        indx++;
      } while (indx <= dbSaldo.length - 1);
      //endd
      daUtama.push({
        type: "sell",
        uraian: "Penjualan Tunai",
        rowspan: dbSaldo.length,
        value: dummSell,
      });
    });

    // console.log(dbSaldo);
    // console.log(daUtama);
    return daUtama;
  };

  const dataData = prepare();

  return (
    <div className="relative pt-10 mb-8">
      <div className="border pb-3">
        <div className="p-1 pb-3 bg-blue-50">
          <h1 className="text-center my-4 text-xl font-semibold">
            KARTU PERSEDIAAN
          </h1>
          <div className="flex items-center">
            <label>Nama Barang : </label>
            {/* <span className={`text-base font-medium`}>Paperfine F4 75gr</span>  */}
            <FormControl>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                name="selectedbrg"
                value={dataConfig.selectedbrg}
                className="ml-2"
                onChange={(e) => handleInputConf(e)}
              >
                {map(objBrg, (x, index) => {
                  const da = find(dataConfig.databarang, { gen: x.head });

                  return (
                    <MenuItem key={index} value={da.gen}>
                      {da.namabarang}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        </div>
        <>
          <div className={`overflow-x-auto`}>
            <table className="border-collapse min-w-full table-fixed">
              <thead>
                <tr>
                  <th
                    rowSpan="3"
                    className="p-3 font-bold bg-slate-100 text-slate-600 border border-slate-300"
                  >
                    Tanggal
                  </th>
                  <th
                    rowSpan="3"
                    className="p-3 font-bold bg-slate-100 text-slate-600 border border-slate-300"
                  >
                    Uraian
                  </th>
                  <th
                    colSpan="3"
                    className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300"
                  >
                    Pembelian
                  </th>
                  <th
                    colSpan="3"
                    className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300"
                  >
                    Penjulan
                  </th>
                  <th
                    colSpan="3"
                    className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300"
                  >
                    Saldo
                  </th>
                </tr>
                <tr>
                  <th className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300">
                    Kuantitas
                  </th>
                  <th className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300">
                    HP/Unit (Rp)
                  </th>
                  <th className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300">
                    Jumlah (Rp)
                  </th>

                  <th className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300">
                    Kuantitas
                  </th>
                  <th className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300">
                    HP/Unit (Rp)
                  </th>
                  <th className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300">
                    Jumlah (Rp)
                  </th>

                  <th className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300">
                    Kuantitas
                  </th>
                  <th className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300">
                    HP/Unit (Rp)
                  </th>
                  <th className="p-1 font-bold bg-slate-100 text-slate-600 border border-slate-300">
                    Jumlah (Rp)
                  </th>
                </tr>
              </thead>
              {/* Saldo Awal */}
              <tbody>
                <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-50 ">
                  <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b">
                    <div className={`relative`}>
                      <TextField
                        inputProps={{
                          style: {
                            textAlign: "center",
                            fontSize: 15,
                          },
                        }}
                        placeholder="Tanggal"
                        name="awaltgl"
                        value={dataConfig.awaltgl}
                        onChange={(e) => handleInputConf(e)}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                      />
                    </div>
                  </td>
                  <td className="min-w-20v max-w-20v px-0.5 py-1.5  text-slate-800 text-center border border-b">
                    Saldo Awal
                  </td>
                  <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b">
                    <div className={`relative`}>
                      <TextField
                        inputProps={{
                          style: {
                            textAlign: "center",
                            fontSize: 15,
                          },
                        }}
                        placeholder="Kuantitas"
                        name="awalkuantitas"
                        value={dataConfig.awalkuantitas}
                        onChange={(e) => handleInputConf(e)}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                      />
                    </div>
                  </td>
                  <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b">
                    <div className={`relative`}>
                      <TextField
                        inputProps={{
                          style: {
                            textAlign: "center",
                            fontSize: 15,
                          },
                          prefix: "Rp ",
                        }}
                        placeholder="Hp / Unit"
                        name="awalhpunit"
                        value={dataConfig.awalhpunit}
                        onChange={(e) => handleInputConf(e)}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                      />
                    </div>
                  </td>
                  <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b">
                    <TextField
                      inputProps={{
                        style: {
                          textAlign: "center",
                          fontSize: 15,
                        },
                        prefix: "Rp ",
                      }}
                      name="jumlah"
                      value={dataConfig.awalkuantitas * dataConfig.awalhpunit}
                      InputProps={{
                        readOnly: true,
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                  </td>
                </tr>
              </tbody>
              {/* Pembelian Row 2 */}
              <tbody>
                {filter(dataData, {
                  type: "buy",
                }).map((items, index) => {
                  return items.value.map((element, i) => {
                    return (
                      <tr
                        key={i}
                        className="bg-white border-t border-slate-300 group"
                      >
                        {i === 0 && (
                          <td
                            rowSpan={items.rowspan}
                            className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b"
                          >
                            <div className={`relative`}>
                              <TextField
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                    fontSize: 15,
                                  },
                                }}
                                placeholder="Tanggal"
                                name="buytgl"
                                value={dataConfig.buytgl}
                                onChange={(e) => handleInputConf(e)}
                              />
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                              />
                            </div>
                          </td>
                        )}
                        {i === 0 && (
                          <td
                            rowSpan={items.rowspan}
                            className="min-w-20v max-w-20v px-0.5 py-1.5  text-slate-800 text-center border border-b"
                          >
                            {items.uraian}
                          </td>
                        )}
                        <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.buy && (
                            <div className={`relative bg-amber-100`}>
                              <TextField
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Kuantitas"
                                name="buyqty"
                                value={element.buyqty}
                                InputProps={{
                                  readOnly: true,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.buy && (
                            <div className={`relative bg-amber-100`}>
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Hp/Unit"
                                name="buyhpunit"
                                value={element.buyhpunit}
                                InputProps={{
                                  readOnly: true,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.buy && (
                            <div className={`relative bg-amber-100`}>
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Jumlah"
                                name="buyjumlah"
                                value={element.buyjumlah}
                                InputProps={{
                                  readOnly: true,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                            </div>
                          )}
                        </td>
                        <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50"></td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50"></td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50"></td>

                        <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          <div className={`relative bg-amber-100`}>
                            <TextField
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                },
                              }}
                              placeholder="Kuantitas"
                              name="saldoqty"
                              value={element.saldoqty}
                              InputProps={{
                                readOnly: true,
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                          </div>
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          <div className={`relative bg-amber-100`}>
                            <TextField
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                },
                              }}
                              placeholder="HP /Unit"
                              name="saldohpunit"
                              value={element.saldohpunit}
                              InputProps={{
                                readOnly: true,
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                          </div>
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          <div className={`relative bg-amber-100`}>
                            <TextField
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                },
                              }}
                              placeholder="HP /Unit"
                              name="saldojumlah"
                              value={element.saldojumlah}
                              InputProps={{
                                readOnly: true,
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
              {/* Row ke 3 */}
              <tbody>
                {filter(dataData, {
                  type: "sell",
                }).map((items, index) => {
                  return items.value.map((element, i) => {
                    return (
                      <tr
                        key={i}
                        className="bg-white border-t border-slate-300 group"
                      >
                        {i === 0 && (
                          <td
                            rowSpan={items.rowspan}
                            className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b"
                          >
                            <div className={`relative`}>
                              <TextField
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                    fontSize: 15,
                                  },
                                }}
                                placeholder="Tanggal"
                                name="selltgl"
                                value={dataConfig.selltgl}
                                onChange={(e) => handleInputConf(e)}
                              />
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                              />
                            </div>
                          </td>
                        )}
                        {i === 0 && (
                          <td
                            rowSpan={items.rowspan}
                            className="min-w-20v max-w-20v px-0.5 py-1.5  text-slate-800 text-center border border-b"
                          >
                            {items.uraian}
                          </td>
                        )}
                        <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50"></td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50"></td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50"></td>
                        <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.sell && (
                            <div className={`relative bg-amber-100`}>
                              <TextField
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Kuantitas"
                                name="sellqty"
                                value={element.sellqty}
                                InputProps={{
                                  readOnly: true,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.sell && (
                            <div className={`relative bg-amber-100`}>
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Hp/Unit"
                                name="sellhpunit"
                                value={element.sellhpunit}
                                InputProps={{
                                  readOnly: true,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.sell && (
                            <div className={`relative bg-amber-100`}>
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Jumlah"
                                name="selljumlah"
                                value={element.selljumlah}
                                InputProps={{
                                  readOnly: true,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                            </div>
                          )}
                        </td>
                        <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.saldo && (
                            <div className={`relative bg-amber-100`}>
                              <TextField
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Kuantitas"
                                name="saldoqty"
                                value={element.saldoqty}
                                InputProps={{
                                  readOnly: true,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.saldo && (
                            <div className={`relative bg-amber-100`}>
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Kuantitas"
                                name="saldohpunit"
                                value={element.saldohpunit}
                                InputProps={{
                                  readOnly: true,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.saldo && (
                            <div className={`relative bg-amber-100`}>
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Kuantitas"
                                name="saldojumlah"
                                value={element.saldojumlah}
                                InputProps={{
                                  readOnly: true,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        </>
      </div>
    </div>
  );
}
