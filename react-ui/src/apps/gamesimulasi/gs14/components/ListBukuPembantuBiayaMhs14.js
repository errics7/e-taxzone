//#region
import NumberFormat from "react-number-format";
import { find, findIndex } from "lodash";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
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
//#endregion

export default function ListBukuPembantuBiayaMhs14(props) {
  const checking = props.checking;
  const dataLoc = props.item;
  const dataList = props.listPembantu;
  const jawab = props.jawab;
  const data = dataList.filter((x) => x.cuid === dataLoc.uuid);
  const batas = findIndex(data, { status: "key" });
  //   console.log(batas);

  //#region
  const gantiItem = (uid, val, name) => {
    props.setJawab(
      jawab.map((u, i) =>
        uid === u.uuid
          ? {
              ...u,
              [name]: val,
            }
          : u
      )
    );
  };
  //#endregion

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString();
  };
  //#region total saldo
  var deb = 0;
  var kre = 0;
  const tsaldo = [];
  data.forEach((el) => {
    deb += isNaN(Number(el.debit)) ? 0 : Number(el.debit);
    kre += isNaN(Number(el.kredit)) ? 0 : Number(el.kredit);
    tsaldo.push({
      debit: deb,
      kredit: kre,
    });
  });
  //   console.log(tsaldo);
  //#endregion

  return (
    <div className="flex flex-col border border-dashed p-2 mt-3">
      <div className="flex justify-center items-center">
        <h1 className="text-center uppercase font-semibold text-base">
          BUKU PEMBANTU BIAYA
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span>No Pusat Biaya : </span>
          <div className="inline pr-2 relative">{dataLoc.nopusatbiaya}</div>
        </div>
        <div className="flex items-center">
          <span>No Pembantu Biaya : </span>
          <div className=" pr-2 relative w-24">{dataLoc.nopembantubiaya}</div>
        </div>
      </div>
      <div className="pt-2 pb-3 overflow-x-auto">
        <table className="border-collapse min-w-full table-fixed">
          <thead className="font-semibold">
            <tr className="text-slate-600">
              <th rowSpan="2" colSpan="2" className="w-16 border">
                Tanggal
              </th>
              <th rowSpan="2" className="border">
                Keterangan
              </th>
              <th rowSpan="2" className="border">
                Ref
              </th>
              <th rowSpan="2" className="border">
                Debit
              </th>
              <th rowSpan="2" className="border">
                Kredit
              </th>
              <th colSpan="2" className="border py-1">
                Saldo
              </th>
            </tr>
            <tr className="text-slate-600">
              <th className="min-w-15v max-w-15v border py-1">Debit</th>
              <th className="min-w-15v max-w-15v border py-1">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const dat =
                item.status === "key" ? find(jawab, { uuid: item.uuid }) : null;

              return (
                <tr key={index} className="group">
                  <td className="border text-center relative">
                    <div className="w-12 mx-auto">
                      {index === 0 ? item.bln : <>&nbsp;</>}
                    </div>
                  </td>
                  <td className="border text-center p-0 relative">
                    <div className="w-14 mx-auto">
                      {item.tgl ? item.tgl : ""}
                    </div>
                  </td>
                  <td className="border px-1 py-1.5 min-w-20v max-w-20v">
                    {dat ? (
                      <div
                        className={`relative ${
                          checking && dat.err_ket && " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            checking && dat.err_ket
                              ? "Masukkan data dengan sesuai"
                              : ""
                          }
                          placement="top"
                        >
                          <TextField
                            placeholder="Jawab keterangan"
                            value={dat.val_ket}
                            name="ket"
                            onChange={(event) =>
                              gantiItem(dat.uuid, event.target.value, "val_ket")
                            }
                            fullWidth
                            InputProps={{
                              readOnly: checking,
                              disableUnderline: true,
                            }}
                            inputProps={{
                              style: {
                                textAlign: "left",
                                fontSize: 15,
                              },
                            }}
                          />
                        </Tooltip>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute -inset-y-1 right-1 opacity-40 group-hover:opacity-40"
                          />
                        )}
                      </div>
                    ) : (
                      item.ket
                    )}
                  </td>
                  <td className="border text-center min-w-5v max-w-5v">
                    <div className="relative">{item.ref}</div>
                  </td>
                  <td className="border min-w-15v max-w-15v">
                    {dat ? (
                      <div
                        className={`relative ${
                          checking &&
                          dat.err_debit &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            checking && dat.err_debit
                              ? "Nominal yang anda masukkan tidak sesuai"
                              : ""
                          }
                          placement="top"
                        >
                          <TextField
                            value={dat.val_debit === 0 ? "" : dat.val_debit}
                            onChange={(event) => {
                              const a =
                                isNaN(parseFloat(event.target.value)) ||
                                event.target.value === 0
                                  ? Number(0)
                                  : parseFloat(event.target.value);
                              gantiItem(dat.uuid, a, "val_debit");
                            }}
                            name="val_debit"
                            placeholder={
                              dat.val_debit === 0 && dat.val_kredit === 0
                                ? "Jawab disini"
                                : ""
                            }
                            fullWidth
                            InputProps={{
                              readOnly: checking,
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
                        </Tooltip>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute -inset-y-1 right-1 opacity-40 group-hover:opacity-40"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        {item.debit === 0 ? null : toRp(item.debit)}
                      </div>
                    )}
                  </td>
                  <td className="border min-w-15v max-w-15v">
                    {dat ? (
                      <div
                        className={`relative ${
                          checking &&
                          dat.err_kredit &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Tooltip
                          title={
                            checking && dat.err_kredit
                              ? "Nominal yang anda masukkan tidak sesuai"
                              : ""
                          }
                          placement="top"
                        >
                          <TextField
                            value={dat.val_kredit === 0 ? "" : dat.val_kredit}
                            onChange={(event) => {
                              const a =
                                isNaN(parseFloat(event.target.value)) ||
                                event.target.value === 0
                                  ? Number(0)
                                  : parseFloat(event.target.value);
                              gantiItem(dat.uuid, a, "val_kredit");
                            }}
                            placeholder={
                              dat.val_debit === 0 && dat.val_kredit === 0
                                ? "Jawab disini"
                                : ""
                            }
                            name="kredit"
                            fullWidth
                            InputProps={{
                              readOnly: checking,
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
                        </Tooltip>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute -inset-y-1 right-1 opacity-40 group-hover:opacity-40"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        {item.kredit === 0 ? null : toRp(item.kredit)}
                      </div>
                    )}
                  </td>
                  <td className="border min-w-15v max-w-15v text-center ">
                    <>
                      {index < batas && tsaldo[index].debit !== 0
                        ? toRp(tsaldo[index].debit)
                        : null}
                    </>
                  </td>
                  <td className="border min-w-15v max-w-15v text-center ">
                    <>
                      {index < batas && tsaldo[index].kredit !== 0
                        ? toRp(tsaldo[index].kredit)
                        : null}
                    </>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
