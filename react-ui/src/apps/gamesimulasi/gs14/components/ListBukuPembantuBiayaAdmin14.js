//#region
import NumberFormat from "react-number-format";
import { remove } from "lodash";
import { v4 as uuidv4 } from "uuid";
import Tooltip from "@mui/material/Tooltip";
import toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { InputGrowUpText } from "../../componentglobal/InputGrowUpText";
import PopBukuPembantuBiaya14 from "./PopBukuPembantuBiaya14";
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

export default function ListBukuPembantuBiayaAdmin14(props) {
  const dataLoc = props.item;
  const dataList = props.listPembantu;
  const alokasi = props.alokasi;
  const data = dataList.filter((x) => x.cuid === dataLoc.uuid);

  //#region
  const gantiAlokasiData = (val, name) => {
    if (val.toString().length > 4) {
      toast.error("Panjang Nilai dibatasi");
    } else {
      props.setAlokasi(
        alokasi.map((u, i) =>
          dataLoc.uuid === u.uuid
            ? {
                ...u,
                [name]: val,
              }
            : u
        )
      );
    }
  };
  const gantiItemList = (uid, val, name) => {
    props.setListPembantu(
      dataList.map((u, i) =>
        uid === u.uuid
          ? {
              ...u,
              [name]: val,
            }
          : u
      )
    );
  };
  const dataListBaru = (p) => {
    const dataOther = dataList.filter((x) => x.cuid !== dataLoc.uuid);
    const da = [...data];
    da.splice(p + 1, 0, {
      uuid: uuidv4(),
      cuid: dataLoc.uuid,
      bln: "Des",
      tgl: "",
      ket: "",
      ref: "",
      debit: 0,
      kredit: 0,
      status: "no",
    });
    props.setListPembantu([...da, ...dataOther]);
    toast.success("Data baru ditambahkan");
  };
  const removeListData = (uid) => {
    const temp = remove(dataList, (x) => x.uuid !== uid);
    props.setListPembantu([...temp]);
  };
  const setSoalDisini = (uid) => {
    const dataOther = dataList.filter((x) => x.cuid !== dataLoc.uuid);
    const da = [...data].map((u, i) =>
      uid === u.uuid
        ? {
            ...u,
            status: "key",
          }
        : {
            ...u,
            status: "no",
          }
    );
    props.setListPembantu([...dataOther, ...da]);
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
    // console.log("kr:", kre);
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
          <div className="inline pr-2 relative">
            <InputGrowUpText
              placeholder="No Pusat"
              value={dataLoc.nopusatbiaya}
              onChange={(text) => gantiAlokasiData(text, "nopusatbiaya")}
            />
            <EditIcon
              fontSize="inherit"
              className="text-blue-700 absolute -inset-y-1 right-1 opacity-10"
            />
          </div>
        </div>
        <div className="flex items-center">
          <span>No Pembantu Biaya : </span>
          <div className=" pr-2 relative w-24">
            <TextField
              placeholder="Kode"
              value={dataLoc.nopembantubiaya}
              onChange={(event) =>
                gantiAlokasiData(event.target.value, "nopembantubiaya")
              }
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
          </div>
        </div>
      </div>
      <div className="pt-2 pb-3 overflow-x-auto">
        <table className="border-collapse min-w-full table-fixed">
          <thead className="font-semibold">
            <tr className="text-slate-600">
              <th
                rowSpan="2"
                colSpan="2"
                className="min-w-10v max-w-10v border"
              >
                Tanggal
              </th>
              <th rowSpan="2" className="min-w-15v max-w-15v border">
                Keterangan
              </th>
              <th rowSpan="2" className="min-w-5v max-w-5v border">
                Ref
              </th>
              <th rowSpan="2" className="min-w-10v max-w-10v border">
                Debit
              </th>
              <th rowSpan="2" className="min-w-10v max-w-10v border">
                Kredit
              </th>
              <th colSpan="2" className="border py-1">
                Saldo
              </th>
            </tr>
            <tr className="text-slate-600">
              <th className="min-w-10v max-w-10v border py-1">Debit</th>
              <th className="min-w-10v max-w-10v border py-1">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const stup = data.length > 1 ? true : false;
              return (
                <tr key={index} className="group">
                  <td className="border text-center min-w-3v max-w-3v relative">
                    <div className="w-12 mx-auto">
                      {index === 0 ? item.bln : <>&nbsp;</>}
                    </div>
                  </td>
                  <td className="border text-center min-w-3v max-w-3v p-0 relative">
                    <div className=" w-24 mx-auto">
                      <div className="absolute inset-y-0 -left-1 flex items-center z-50">
                        <PopBukuPembantuBiaya14
                          stup={stup}
                          addRow={() => dataListBaru(index)}
                          setSoalIni={() => setSoalDisini(item.uuid)}
                          removeRow={() => removeListData(item.uuid)}
                        />
                        {item.status === "key" && (
                          <Tooltip
                            title="Baris Terpilih sebagai kunci jawaban pada Mahasiswa"
                            arrow
                            placement="top"
                          >
                            <VerifiedUserIcon
                              fontSize="small"
                              className="-ml-1 text-emerald-600"
                            />
                          </Tooltip>
                        )}
                      </div>
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-1 right-3 opacity-5 group-hover:opacity-40"
                      />
                      <TextField
                        placeholder="Tanggal"
                        value={item.tgl ? item.tgl : ""}
                        name="Tanggal"
                        onChange={(event) =>
                          gantiItemList(item.uuid, event.target.value, "tgl")
                        }
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
                    </div>
                  </td>
                  <td className="border px-1 py-1.5 min-w-15v max-w-15v">
                    <div
                      className={`relative ${
                        item.status === "key" &&
                        " bg-amber-50 group-hover:bg-amber-100"
                      }`}
                    >
                      <Tooltip
                        title={
                          item.status === "key"
                            ? "Diterapkan sebagai kunci jawaban pada Mahasiswa"
                            : ""
                        }
                        placement="top"
                      >
                        <TextField
                          placeholder="Keterangan"
                          value={item.ket}
                          name="ket"
                          onChange={(event) => {
                            const va = event.target.value;
                            gantiItemList(item.uuid, va, "ket");
                          }}
                          fullWidth
                          InputProps={{
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
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-5 group-hover:opacity-40"
                      />
                    </div>
                  </td>
                  <td className="border text-center min-w-5v max-w-5v">
                    <div className="relative">
                      <TextField
                        // placeholder="Ref"
                        value={item.ref}
                        name="ref"
                        onChange={(event) =>
                          gantiItemList(item.uuid, event.target.value, "ref")
                        }
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
                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-0 group-hover:opacity-40"
                      />
                    </div>
                  </td>
                  <td className="border min-w-10v max-w-10v">
                    <div
                      className={`relative ${
                        item.status === "key" &&
                        item.debit !== 0 &&
                        " bg-amber-50 group-hover:bg-amber-100"
                      }`}
                    >
                      <Tooltip
                        title={
                          item.status === "key" && item.debit !== 0
                            ? "Diterapkan sebagai kunci jawaban pada Mahasiswa"
                            : ""
                        }
                        placement="top"
                      >
                        {item.debit !== 0 ? (
                          <TextField
                            value={item.debit}
                            onChange={(event) => {
                              gantiItemList(
                                item.uuid,
                                parseFloat(event.target.value),
                                "debit"
                              );
                            }}
                            name="debit"
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
                        ) : (
                          <input
                            value={item.debit === 0 ? "" : item.debit}
                            className="text-center flex"
                            onChange={(event) =>
                              gantiItemList(
                                item.uuid,
                                event.target.value,
                                "debit"
                              )
                            }
                          />
                        )}
                      </Tooltip>
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-10 group-hover:opacity-40"
                      />
                    </div>
                  </td>
                  <td className="border min-w-10v max-w-10v">
                    <div
                      className={`relative ${
                        item.status === "key" &&
                        item.kredit !== 0 &&
                        " bg-amber-50 group-hover:bg-amber-100"
                      }`}
                    >
                      <Tooltip
                        title={
                          item.status === "key" && item.kredit !== 0
                            ? "Diterapkan sebagai kunci jawaban pada Mahasiswa"
                            : ""
                        }
                        placement="top"
                      >
                        {item.kredit !== 0 ? (
                          <TextField
                            value={item.kredit}
                            onChange={(event) => {
                              const a =
                                isNaN(parseFloat(event.target.value)) ||
                                event.target.value === 0
                                  ? Number(0)
                                  : parseFloat(event.target.value);
                              console.log(a);
                              gantiItemList(item.uuid, a, "kredit");
                            }}
                            name="kredit"
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
                        ) : (
                          <input
                            value={item.kredit === 0 ? "" : item.kredit}
                            className="text-center flex"
                            onChange={(event) =>
                              gantiItemList(
                                item.uuid,
                                event.target.value,
                                "kredit"
                              )
                            }
                          />
                        )}
                      </Tooltip>
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-10 group-hover:opacity-40"
                      />
                    </div>
                  </td>
                  <td className="border min-w-10v max-w-10v text-center text-base">
                    <>
                      {tsaldo[index].debit !== 0 ? (
                        toRp(tsaldo[index].debit)
                      ) : (
                        <>&nbsp;</>
                      )}
                    </>
                  </td>
                  <td className="border min-w-10v max-w-10v text-center text-base">
                    <>
                      {tsaldo[index].kredit !== 0 ? (
                        toRp(tsaldo[index].kredit)
                      ) : (
                        <>&nbsp;</>
                      )}
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
