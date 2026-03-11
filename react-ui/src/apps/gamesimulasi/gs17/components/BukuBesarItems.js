//#region
import NumberFormat from "react-number-format";
import { remove } from "lodash";

import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";

import PopMenuDelBB from "./PopMenuDelBB";
import { InputGrowUpText } from "../../componentglobal/InputGrowUpText";
import PopMenuRowBB from "./PopMenuRowBB";
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

export default function BukuBesarItems(props) {
  const databb = props.item;
  const dataAkun = props.dataAkun;
  const data = dataAkun.filter((x) => x.cuid === databb.uuid);

  const removed = (uid) => {
    const temp = remove(dataAkun, (x) => x.uuid !== uid);
    props.setDataAkun([...temp]);
  };
  const ganti = (uuid, value, name) => {
    props.setDataAkun(
      dataAkun.map((u, i) =>
        u.uuid === uuid
          ? {
              ...u,
              [name]: value,
            }
          : u
      )
    );
  };
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };
  const addPersediaanBaru = (uid, type) => {
    props.dataPersediaanBaru(uid, type);
    ganti(uid, type, "status");
  };
  //#region total saldo
  var deb = 0;
  var kre = 0;
  const tsaldo = [];
  data.forEach((el) => {
    deb += Number(el.debit);
    kre += Number(el.kredit);
    tsaldo.push({
      debit: deb,
      kredit: kre,
    });
  });
  //#endregion

  return (
    <div className="flex flex-col border border-dashed p-2 mt-3">
      <div className="flex justify-center items-center">
        <h1 className="text-center uppercase font-semibold text-base">
          Buku Besar
        </h1>
        <PopMenuDelBB removeBB={() => props.hapusBB()} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span>Nama Akun : </span>
          <div className="inline pr-2 relative">
            <InputGrowUpText
              placeholder="masukkan nama akun"
              value={databb.namaakun}
              onChange={(text) => {
                props.gantiNama(text);
              }}
            />
            <EditIcon
              fontSize="inherit"
              className="text-blue-700 absolute -inset-y-1 right-1 opacity-10"
            />
          </div>
        </div>
        <div className="flex items-center">
          <span>Kode : </span>
          <div className=" pr-2 relative w-24">
            <TextField
              placeholder="Kode"
              value={databb.kode}
              onChange={(event) => props.gantiKode(event.target.value)}
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
      <div className="pt-2">
        <table className="border-collapse w-full">
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
              return (
                <tr key={index}>
                  <td className="border text-center min-w-3v max-w-3v relative">
                    <div className="w-12 mx-auto">
                      {index === 0 ? "Nop" : <>&nbsp;</>}
                    </div>
                    {item.status === "1" && (
                      <div className="absolute inset-y-1 right-3 flex items-center text-blue-600 transform -rotate-12">
                        <Tooltip
                          title="Data terlink di persediaan awal"
                          placement="top"
                        >
                          <span>
                            <LinkIcon />I
                          </span>
                        </Tooltip>
                      </div>
                    )}
                    {item.status === "2" && (
                      <div className="absolute inset-y-1 right-3 flex items-center text-blue-600 transform -rotate-12">
                        <Tooltip
                          title="Data terlink di periode berjalan"
                          placement="top"
                        >
                          <span>
                            <LinkIcon />
                            II
                          </span>
                        </Tooltip>
                      </div>
                    )}
                  </td>
                  <td className="border text-center min-w-3v max-w-3v p-0 relative">
                    <div className=" w-24 mx-auto">
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-1 right-3 opacity-10"
                      />
                      {index !== 0 ? (
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <PopMenuRowBB
                            status={item}
                            setSelect1={() => {
                              addPersediaanBaru(item.uuid, "1");
                            }}
                            setSelect2={() => {
                              addPersediaanBaru(item.uuid, "2");
                            }}
                            removeRow={() => removed(item.uuid)}
                          />
                        </div>
                      ) : null}
                      <TextField
                        placeholder="Tanggal"
                        value={item.tgl ? item.tgl : ""}
                        name="Tanggal"
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "tgl")
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
                    <div className="relative">
                      <TextField
                        placeholder="Keterangan"
                        value={item.keterangan}
                        name="Keterangan"
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "keterangan")
                        }
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
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-10"
                      />
                    </div>
                  </td>
                  <td className="border text-center min-w-5v max-w-5v">
                    <div className="relative">
                      <TextField
                        placeholder="Ref"
                        value={item.ref}
                        name="ref"
                        onChange={(event) =>
                          ganti(item.uuid, event.target.value, "ref")
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
                  </td>
                  <td className="border min-w-10v max-w-10v">
                    <div className="relative">
                      <TextField
                        value={item.debit === 0 ? "" : item.debit}
                        onChange={(event) =>
                          ganti(
                            item.uuid,
                            parseFloat(event.target.value),
                            "debit"
                          )
                        }
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
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-10"
                      />
                    </div>
                  </td>
                  <td className="border min-w-10v max-w-10v">
                    <div className="relative hidden">
                      <TextField
                        value={item.kredit === 0 ? "" : item.kredit}
                        onChange={(event) =>
                          ganti(
                            item.uuid,
                            parseFloat(event.target.value),
                            "kredit"
                          )
                        }
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
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute -inset-y-1 right-1 opacity-10"
                      />
                    </div>
                  </td>
                  <td className="border min-w-10v max-w-10v text-center text-base">
                    {tsaldo[index].debit === 0 ? "" : toRp(tsaldo[index].debit)}
                  </td>
                  <td className="border min-w-10v max-w-10v text-center text-base">
                    {tsaldo[index].kredit === 0
                      ? ""
                      : toRp(tsaldo[index].kredit)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="">&nbsp;</td>
              <td colSpan="2" className="border">
                <div className="py-1 pt-1.5 flex justify-center items-center">
                  <div
                    onClick={() => props.dataBaru()}
                    className="bg-slate-400 px-1 rounded text-white flex items-center cursor-pointer transform hover:scale-105"
                  >
                    <AddIcon />
                    <span>Tambah Data</span>
                  </div>
                </div>
              </td>
              <td colSpan="5" className="">
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
