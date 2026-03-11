//#region
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import Tooltip from "@mui/material/Tooltip";

import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import NumberFormat from "react-number-format";
import { remove, findIndex } from "lodash";
import { InputGrowUpText } from "../../componentglobal/InputGrowUpText";
import InlinePopInputTText14 from "./InlinePopInputTText14";
import PopMenuRowInfoMemorial14 from "./PopMenuRowInfoMemorial14";
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
            value: values.value,
          },
        });
      }}
      style={{
        textAlign: "right",
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});
//#endregion

export default function BuktiMemorialAdmin14(props) {
  const config = props.dataConfig;
  const alokasi = props.alokasi;
  const dataInfo = props.dataInfo;
  // console.log(uuidv4());

  const swapArrayLocs = (arr, index1, index2) => {
    var arry = [...arr];
    var temp = arry[index1];

    arry[index1] = arry[index2];
    arry[index2] = temp;
    return arry;
  };
  // Alokasi
  const dataBaru = (p) => {
    const da = [...alokasi];
    const xuid = uuidv4();
    da.splice(p + 1, 0, {
      uuid: xuid,
      keterangan: "",
      nominal: 0,
      nopusatbiaya: "",
      nopembantubiaya: "",
    });
    props.setAlokasi([...da]);
    //
    const list = props.listPembantu;
    props.setListPembantu([
      ...list,
      {
        uuid: uuidv4(),
        cuid: xuid,
        bln: "Des",
        tgl: "1",
        ket: "Saldo awal",
        ref: "",
        debit: 0,
        kredit: 0,
        status: "no",
      },
      {
        uuid: uuidv4(),
        cuid: xuid,
        bln: "Des",
        tgl: "2",
        ket: "",
        ref: "",
        debit: 0,
        kredit: 0,
        status: "no",
      },
    ]);

    toast.success("Data baru ditambahkan");
  };
  const move1 = (A1, A2) => {
    const p1 = findIndex(alokasi, { uuid: A1.uuid });
    const p2 = findIndex(alokasi, { uuid: A2.uuid });
    props.setAlokasi([...swapArrayLocs(alokasi, p1, p2)]);
  };
  const gantiAlokasi = (uid, val, name) => {
    props.setAlokasi(
      alokasi.map((u, i) =>
        uid === u.uuid
          ? {
              ...u,
              [name]: val,
            }
          : u
      )
    );
  };
  const removeDataAlokasi = (uid) => {
    const temp = remove(alokasi, (x) => x.uuid !== uid);
    props.setAlokasi([...temp]);

    const list = props.listPembantu;
    const temp1 = remove(list, (x) => x.cuid !== uid);
    props.setListPembantu([...temp1]);
  };
  //#end Alokasi
  //  InfoBaru
  const dataInfoBaru = (p) => {
    const da = [...dataInfo];
    da.splice(p + 1, 0, {
      uuid: uuidv4(),
      no_debit: "",
      val_debit: 0,
      no_kredit: "",
      val_kredit: 0,
    });
    props.setDataInfo([...da]);
    toast.success("Data baru ditambahkan");
  };
  const move2 = (A1, A2) => {
    const p1 = findIndex(dataInfo, { uuid: A1.uuid });
    const p2 = findIndex(dataInfo, { uuid: A2.uuid });
    props.setDataInfo([...swapArrayLocs(dataInfo, p1, p2)]);
  };
  const gantiDataInfo = (uid, val, name) => {
    props.setDataInfo(
      dataInfo.map((u, i) =>
        uid === u.uuid
          ? {
              ...u,
              [name]: val,
            }
          : u
      )
    );
  };
  const removeDataInfo = (uid) => {
    const temp = remove(dataInfo, (x) => x.uuid !== uid);
    props.setDataInfo([...temp]);
  };
  //  InfoBaru

  return (
    <div className="border min-h-25v bg-white">
      <div className="opacity-50 italic font-semibold my-1 px-1">
        Editor Data (soal):
      </div>
      <br />
      <h1 className="mt-3 mx-auto text-center text-xl font-semibold">
        BUKTI MEMORIAL
      </h1>
      <div className="mx-auto text-sm text-center">
        <div className="pl-10">
          <div className="inline">NO. BM:</div>
          <div className="inline relative">
            <InputGrowUpText
              value={config ? config.nobm : ""}
              onChange={(text) =>
                props.setDataConfig({ ...config, nobm: text })
              }
            />
            <EditIcon
              fontSize="inherit"
              className="text-blue-700 absolute -inset-y-1 right-2 opacity-50"
            />
          </div>
        </div>
        <div className="mt-3 mb-2 px-2 flex">
          <div className="inline">
            <InlinePopInputTText14
              value={config ? config.narasibuktimemo : ""}
              onChange={(val) => {
                props.setDataConfig({
                  ...config,
                  narasibuktimemo: val,
                });
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="px-1">
          <table className="border-collapse w-full">
            <tbody>
              {alokasi.map((item, index) => {
                const stup = index === 0 ? false : true;
                const stdown = index === alokasi.length - 1 ? false : true;
                return (
                  <tr key={index} className="group">
                    <td className="w-3/5 py-2 text-left border border-slate-300 table-cell">
                      <div className="relative pl-3">
                        <div className="absolute inset-y-0 -left-1.5 flex items-center z-50">
                          <PopMenuRowInfoMemorial14
                            stup={stup}
                            stdown={stdown}
                            moveUp={() =>
                              move1(alokasi[index], alokasi[index - 1])
                            }
                            moveDown={() =>
                              move1(alokasi[index], alokasi[index + 1])
                            }
                            addRow={() => dataBaru(index)}
                            removeRow={() => removeDataAlokasi(item.uuid)}
                          />
                        </div>
                        <div className="absolute -inset-y-1 right-0 flex">
                          <Tooltip
                            title={`Data terhubung dengan Buku Pembantu Biaya No ${item.nopusatbiaya}`}
                            placement="top"
                            arrow
                          >
                            <div className="flex cursor-pointer z-50">
                              <LinkIcon
                                fontSize="inherit"
                                className="transform -rotate-45 mr-2 text-blue-700 opacity-50 group-hover:opacity-70"
                              />
                              <span className="transform -rotate-45 -mr-3 -mt-1 text-blue-700 opacity-50 text-xxxs group-hover:opacity-70">
                                {item.nopusatbiaya}
                              </span>
                            </div>
                          </Tooltip>
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-10 group-hover:opacity-40"
                          />
                        </div>
                        <TextField
                          value={item.keterangan}
                          placeholder="Keterangan"
                          name="keterangan"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            style: { 
                              paddingLeft: 10,
                            },
                          }}
                          fullWidth
                          onChange={(event) =>
                            gantiAlokasi(
                              item.uuid,
                              event.target.value,
                              "keterangan"
                            )
                          }
                        />
                      </div>
                    </td>
                    <td className="w-2/5 p-2 text-right border border-slate-300 table-cell">
                      <div className="relative">
                        <TextField
                          value={item.nominal}
                          name="nominal"
                          fullWidth
                          InputProps={{
                            inputComponent: NumberFormatCustom,
                          }}
                          onChange={(event) =>
                            gantiAlokasi(
                              item.uuid,
                              Number(event.target.value),
                              "nominal"
                            )
                          }
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 -right-1 opacity-10 group-hover:opacity-40"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/*  */}
        {/* Keterangan kode alokasi */}
        <div className="px-1 mt-10 mb-5">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="w-2/12 p-1.5 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Kode
                </th>
                <th className="w-4/12 p-1.5 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Debet (Rp)
                </th>
                <th className="w-2/12 p-1.5 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Kode
                </th>
                <th className="w-4/12 p-1.5 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Kredit (Rp)
                </th>
              </tr>
            </thead>
            <tbody>
              {dataInfo.map((item, index) => {
                const stup = index === 0 ? false : true;
                const stdown = index === dataInfo.length - 1 ? false : true;

                return (
                  <tr
                    key={index}
                    className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 group"
                  >
                    <td className="w-2/12 p-1.5 text-slate-800 text-center border border-b">
                      <div className="relative">
                        <div className="absolute inset-y-0 -left-3 flex items-center z-50">
                          <PopMenuRowInfoMemorial14
                            stup={stup}
                            stdown={stdown}
                            moveUp={() =>
                              move2(dataInfo[index], dataInfo[index - 1])
                            }
                            moveDown={() =>
                              move2(dataInfo[index], dataInfo[index + 1])
                            }
                            addRow={() => dataInfoBaru(index)}
                            removeRow={() => removeDataInfo(item.uuid)}
                          />
                        </div>
                        <input
                          value={item.no_debit}
                          className="text-center w-12"
                          onChange={(event) =>
                            gantiDataInfo(
                              item.uuid,
                              event.target.value,
                              "no_debit"
                            )
                          }
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 right-0 opacity-0 group-hover:opacity-40"
                        />
                      </div>
                    </td>
                    <td className="w-4/12 py-1.5 text-slate-800 text-center border border-b">
                      <div className="relative pr-1">
                        <TextField
                          value={item.val_debit === 0 ? "" : item.val_debit}
                          name="val_debit"
                          fullWidth
                          InputProps={{
                            disableUnderline: true,
                            inputComponent: NumberFormatCustom,
                          }}
                          onChange={(event) =>
                            gantiDataInfo(
                              item.uuid,
                              Number(event.target.value),
                              "val_debit"
                            )
                          }
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 right-0 opacity-0 group-hover:opacity-40"
                        />
                      </div>
                    </td>
                    <td className="w-2/12 p-1.5 text-slate-800 text-center border border-b">
                      <div className="relative">
                        <input
                          value={item.no_kredit}
                          className="text-center w-12"
                          onChange={(event) =>
                            gantiDataInfo(
                              item.uuid,
                              event.target.value,
                              "no_kredit"
                            )
                          }
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 right-0 opacity-0 group-hover:opacity-40"
                        />
                      </div>
                    </td>
                    <td className="w-4/12 p-1.5 text-slate-800 text-center border border-b">
                      <div className="relative">
                        <TextField
                          value={item.val_kredit === 0 ? "" : item.val_kredit}
                          name="val_kredit"
                          fullWidth
                          InputProps={{
                            disableUnderline: true,
                            inputComponent: NumberFormatCustom,
                          }}
                          onChange={(event) =>
                            gantiDataInfo(
                              item.uuid,
                              Number(event.target.value),
                              "val_kredit"
                            )
                          }
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute -inset-y-1 -right-1 opacity-0 group-hover:opacity-40"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
