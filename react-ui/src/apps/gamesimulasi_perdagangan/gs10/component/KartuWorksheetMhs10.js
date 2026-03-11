import { TextField } from "@mui/material";
import NumberFormat from "react-number-format"; 
import EditIcon from "@mui/icons-material/Edit";
import { find, filter, findIndex } from "lodash";
import { forwardRef } from "react";

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

export default function KartuWorksheetMhs10(props) {
  const { dataConfig, jwbdata, setJwbdata, checking } = props;
  const dataData = jwbdata;
  //   console.log(dataData);

  const handleJwb = (e, uid1, uid2) => {
    const { name, value } = e.target;
    const idm = findIndex(jwbdata, { uid: uid1 });
    const idel = findIndex(jwbdata[idm].value, { uid: uid2 });
    //update sub
    const tmpval = [...jwbdata[idm].value];
    tmpval.splice(idel, 1, {
      ...jwbdata[idm].value[idel],
      [name]: value,
    });
    //update master
    const tmpJwb = [...jwbdata];
    tmpJwb.splice(idm, 1, {
      ...jwbdata[idm],
      value: tmpval,
    });
    //set
    setJwbdata(tmpJwb);
  };

  return (
    <div className="relative">
      <div className="border">
        <div className="p-1 pb-3 bg-blue-50">
          <h1 className="text-center my-4 text-xl font-semibold">
            KARTU PERSEDIAAN
          </h1>
          <div className="flex items-center px-1">
            <p>Nama Barang : </p>
            <p className={`font-medium pl-2`}>
              {
                find(dataConfig.databarang, { gen: dataConfig.selectedbrg })
                  .namabarang
              }
            </p>
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
                  <td className="min-w-15v max-w-15v px-0.5 py-3  text-slate-800 text-center border border-b">
                    <div className={`relative`}>{dataConfig.awaltgl}</div>
                  </td>
                  <td className="min-w-20v max-w-20v px-0.5 py-3  text-slate-800 text-center border border-b">
                    Saldo Awal
                  </td>
                  <td className="min-w-10v max-w-10v px-0.5 py-3  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-15v max-w-15v px-0.5 py-3  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-15v max-w-15v px-0.5 py-3  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-10v max-w-10v px-0.5 py-3  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-15v max-w-15v px-0.5 py-3  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-15v max-w-15v px-0.5 py-3  text-slate-800 text-center border border-b"></td>
                  <td className="min-w-10v max-w-10v px-0.5 py-3  text-slate-800 text-center border border-b">
                    <div className={`relative`}>{dataConfig.awalkuantitas}</div>
                  </td>
                  <td className="min-w-15v max-w-15v px-0.5 py-3  text-slate-800 text-center border border-b">
                    <div className={`relative`}>
                      {numberFormat(dataConfig.awalhpunit)}
                    </div>
                  </td>
                  <td className="min-w-15v max-w-15v px-0.5 py-3  text-slate-800 text-center border border-b">
                    {numberFormat(
                      dataConfig.awalkuantitas * dataConfig.awalhpunit
                    )}
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
                              {dataConfig.buytgl}
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
                            <div
                              className={`relative ${
                                checking &&
                                element.err_buyqty &&
                                "bg-red-300 animate-pulse"
                              }`}
                            >
                              <TextField
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Jawab Kuantitas"
                                name="jwb_buyqty"
                                value={
                                  element.jwb_buyqty === 0
                                    ? ""
                                    : element.jwb_buyqty
                                }
                                onChange={(e) =>
                                  handleJwb(e, items.uid, element.uid)
                                }
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                              {!checking && (
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                  
                                />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.buy && (
                            <div
                              className={`relative ${
                                checking &&
                                element.err_buyhpunit &&
                                "bg-red-300 animate-pulse"
                              }`}
                            >
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Jawab Hp/Unit"
                                name="jwb_buyhpunit"
                                value={
                                  element.jwb_buyhpunit === 0
                                    ? ""
                                    : element.jwb_buyhpunit
                                }
                                onChange={(e) =>
                                  handleJwb(e, items.uid, element.uid)
                                }
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                              {!checking && (
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                  
                                />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.buy && (
                            <div
                              className={`relative ${
                                checking &&
                                element.err_buyjumlah &&
                                "bg-red-300 animate-pulse"
                              }`}
                            >
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Jawab Jumlah"
                                name="jwb_buyjumlah"
                                value={
                                  element.jwb_buyjumlah === 0
                                    ? ""
                                    : element.jwb_buyjumlah
                                }
                                onChange={(e) =>
                                  handleJwb(e, items.uid, element.uid)
                                }
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                              {!checking && (
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                  
                                />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50"></td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50"></td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50"></td>

                        <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          <div
                            className={`relative ${
                              checking &&
                              element.err_saldoqty &&
                              "bg-red-300 animate-pulse"
                            }`}
                          >
                            <TextField
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                },
                              }}
                              placeholder="Jawab Kuantitas"
                              name="jwb_saldoqty"
                              value={
                                element.jwb_saldoqty === 0
                                  ? ""
                                  : element.jwb_saldoqty
                              }
                              onChange={(e) =>
                                handleJwb(e, items.uid, element.uid)
                              }
                              InputProps={{
                                readOnly: checking,
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                            {!checking && (
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                
                              />
                            )}
                          </div>
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          <div
                            className={`relative ${
                              checking &&
                              element.err_saldohpunit &&
                              "bg-red-300 animate-pulse"
                            }`}
                          >
                            <TextField
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                },
                              }}
                              placeholder="Jawab Hp/Unit"
                              name="jwb_saldohpunit"
                              value={
                                element.jwb_saldohpunit === 0
                                  ? ""
                                  : element.jwb_saldohpunit
                              }
                              onChange={(e) =>
                                handleJwb(e, items.uid, element.uid)
                              }
                              InputProps={{
                                readOnly: checking,
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                            {!checking && (
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                
                              />
                            )}
                          </div>
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          <div
                            className={`relative ${
                              checking &&
                              element.err_saldojumlah &&
                              "bg-red-300 animate-pulse"
                            }`}
                          >
                            <TextField
                              inputProps={{
                                prefix: "Rp ",
                                style: {
                                  textAlign: "center",
                                },
                              }}
                              placeholder="Jawab Jumlah"
                              name="jwb_saldojumlah"
                              value={
                                element.jwb_saldojumlah === 0
                                  ? ""
                                  : element.jwb_saldojumlah
                              }
                              onChange={(e) =>
                                handleJwb(e, items.uid, element.uid)
                              }
                              InputProps={{
                                readOnly: checking,
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                            {!checking && (
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                
                              />
                            )}
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
                              {dataConfig.selltgl}
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
                            <div
                              className={`relative ${
                                checking &&
                                element.err_sellqty &&
                                "bg-red-300 animate-pulse"
                              }`}
                            >
                              <TextField
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Jawab Kuantitas"
                                name="jwb_sellqty"
                                value={
                                  element.jwb_sellqty === 0
                                    ? ""
                                    : element.jwb_sellqty
                                }
                                onChange={(e) =>
                                  handleJwb(e, items.uid, element.uid)
                                }
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                              {!checking && (
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                  
                                />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.sell && (
                            <div
                              className={`relative ${
                                checking &&
                                element.err_sellhpunit &&
                                "bg-red-300 animate-pulse"
                              }`}
                            >
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Jawab Hp/Unit"
                                name="jwb_sellhpunit"
                                value={
                                  element.jwb_sellhpunit === 0
                                    ? ""
                                    : element.jwb_sellhpunit
                                }
                                onChange={(e) =>
                                  handleJwb(e, items.uid, element.uid)
                                }
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                              {!checking && (
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                  
                                />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.sell && (
                            <div
                              className={`relative ${
                                checking &&
                                element.err_selljumlah &&
                                "bg-red-300 animate-pulse"
                              }`}
                            >
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Jawab Jumlah"
                                name="jwb_selljumlah"
                                value={
                                  element.jwb_selljumlah === 0
                                    ? ""
                                    : element.jwb_selljumlah
                                }
                                onChange={(e) =>
                                  handleJwb(e, items.uid, element.uid)
                                }
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                              {!checking && (
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                  
                                />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="min-w-10v max-w-10v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.saldo && (
                            <div
                              className={`relative ${
                                checking &&
                                element.err_saldoqty &&
                                "bg-red-300 animate-pulse"
                              }`}
                            >
                              <TextField
                                inputProps={{
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Jawab Kuantitas"
                                name="jwb_saldoqty"
                                value={
                                  element.jwb_saldoqty === 0
                                    ? ""
                                    : element.jwb_saldoqty
                                }
                                onChange={(e) =>
                                  handleJwb(e, items.uid, element.uid)
                                }
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                              {!checking && (
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                  
                                />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.saldo && (
                            <div
                              className={`relative ${
                                checking &&
                                element.err_saldohpunit &&
                                "bg-red-300 animate-pulse"
                              }`}
                            >
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Jawab Hp/Unit"
                                name="jwb_saldohpunit"
                                value={
                                  element.jwb_saldohpunit === 0
                                    ? ""
                                    : element.jwb_saldohpunit
                                }
                                onChange={(e) =>
                                  handleJwb(e, items.uid, element.uid)
                                }
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                              {!checking && (
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                  
                                />
                              )}
                            </div>
                          )}
                        </td>
                        <td className="min-w-15v max-w-15v px-0.5 py-1.5  text-slate-800 text-center border border-b group-hover:bg-slate-50">
                          {element.saldo && (
                            <div
                              className={`relative ${
                                checking &&
                                element.err_saldojumlah &&
                                "bg-red-300 animate-pulse"
                              }`}
                            >
                              <TextField
                                inputProps={{
                                  prefix: "Rp ",
                                  style: {
                                    textAlign: "center",
                                  },
                                }}
                                placeholder="Jawab Jumlah"
                                name="jwb_saldojumlah"
                                value={
                                  element.jwb_saldojumlah === 0
                                    ? ""
                                    : element.jwb_saldojumlah
                                }
                                onChange={(e) =>
                                  handleJwb(e, items.uid, element.uid)
                                }
                                InputProps={{
                                  readOnly: checking,
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                              {!checking && (
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-0 opacity-30 p-0.5"
                                  
                                />
                              )}
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
