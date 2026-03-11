import { v4 as uuidv4 } from "uuid";
import {
  TextField,
  IconButton,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
import NumberFormat from "react-number-format";
import { find, findIndex, remove } from "lodash";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Addicon from "@mui/icons-material/AddCircle";
import PopMenuRowSoalAkun13 from "./PopMenuRowSoalAkun13";
import PopMenuRowSoalTgl13 from "./PopMenuRowSoalTgl13";
import NewSoalAkunModal13 from "./NewSoalAkunModal13";

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

export default function TableSoalAdmin13(props) {
  const { dataConfig, setdataConfig } = props;
  const [showNewSoalAkun, setShowNewSoalAkun] = useState(false);
  const [rowid, setRowid] = useState("");
  const [barisA, setBarisA] = useState(0);

  const changeDSoal = (e, i) => {
    const { name, value } = e.target;
    const list = [...dataConfig.datasoal];
    list.splice(i, 1, {
      ...list[i],
      [name]: value,
    });

    setdataConfig({
      ...dataConfig,
      datasoal: list,
    });
  };
  const swapArrayLocs = (arr, index1, index2) => {
    var arry = [...arr];
    var temp = arry[index1];

    arry[index1] = arry[index2];
    arry[index2] = temp;
    return arry;
  };
  const moveData = (midx, A1, A2) => {
    const list = [...dataConfig.datasoal];
    const listlisy = [...list[midx].list];

    const p1 = findIndex(listlisy, (x) => x === A1);
    const p2 = findIndex(listlisy, (x) => x === A2);

    list.splice(midx, 1, {
      ...list[midx],
      list: [...swapArrayLocs(listlisy, p1, p2)],
    });

    setdataConfig({
      ...props.dataConfig,
      datasoal: list,
    });
  };
  const moveDataSoal = (A1, A2) => {
    const list = [...dataConfig.datasoal];
    const p1 = findIndex(dataConfig.datasoal, (x) => x.uid === A1.uid);
    const p2 = findIndex(dataConfig.datasoal, (x) => x.uid === A2.uid);

    setdataConfig({
      ...props.dataConfig,
      datasoal: [...swapArrayLocs(list, p1, p2)],
    });
  };
  const tambahDataSoal = () => {
    const list = [...dataConfig.datasoal];
    setdataConfig({
      ...dataConfig,
      datasoal: [...list, { uid: uuidv4(), tanggal: "", list: [] }],
    });
  };
  const removeDataAkun = (uid, elid) => {
    const iuid = findIndex(dataConfig.datasoal, { uid: uid });
    const list = [...dataConfig.datasoal];
    const listlisy = [...dataConfig.datasoal[iuid].list];
    remove(listlisy, (x) => x === elid);

    list.splice(iuid, 1, {
      ...dataConfig.datasoal[iuid],
      list: listlisy,
    });
    setdataConfig({
      ...dataConfig,
      datasoal: list,
    });
  };
  const removeDataSoal = (uid) => {
    const list = [...dataConfig.datasoal];
    remove(list, (x) => x.uid === uid);

    setdataConfig({
      ...dataConfig,
      datasoal: list,
    });
  };

  return (
    <>
      <div className="relative">
        <div className="pt-8 relative">
          <TextareaAutosize
            className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
            value={dataConfig ? dataConfig.introsoal : " "}
            onChange={(e) => {
              setdataConfig({
                ...dataConfig,
                introsoal: e.target.value,
              });
            }}
          />
          <EditIcon
            fontSize="inherit"
            className="text-blue-700 opacity-70 absolute inset-y-8 right-0"
          />
        </div>
        <div className="pt-3 flex flex-col items-center font-bold">
          <div className="text-xl relative">
            <InputGrowUpTextH1
              value={dataConfig ? dataConfig.cvname : ""}
              className={"font-semibold uppercase"}
              onChange={(text) =>
                setdataConfig({ ...dataConfig, cvname: text })
              }
            />
            <EditIcon
              fontSize="small"
              className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
            />
          </div>
        </div>
        <div className="flex flex-col items-center mb-1">
          <div className="text-lg font-semibold relative uppercase">
            Jurnal Penyesuaian
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl relative">
            <InputGrowUpTextH1
              className={"font-semibold tracking-wider"}
              value={dataConfig ? dataConfig.tblsoalname : ""}
              onChange={(text) =>
                setdataConfig({ ...dataConfig, tblsoalname: text })
              }
            />
            <EditIcon
              fontSize="small"
              className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
            />
          </div>
        </div>
        <span className="absolute -bottom-1 right-0">(dalam ribuan)</span>
      </div>
      <div className="pt-3 overflow-x-auto border-collapse pb-1">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Tanggal
              </th>
              <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                No. Akun
              </th>
              <th className="min-w-25v max-w-25v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Nama Akun
              </th>
              <th className="min-w-7v max-w-7v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Ref
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Debet
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Kredit
              </th>
            </tr>
          </thead>
          {/* End tmp */}
          {dataConfig.datasoal.length > 0 ? (
            dataConfig.datasoal.map((el, i) => {
              return (
                <tbody key={i}>
                  {el.list.length > 0 ? (
                    el.list.map((drow, ii) => {
                      const f = find(dataConfig.dataakun, { uid: drow });
                      const ddatDeb = find(dataConfig.datanilai, {
                        idr: drow,
                        type: "debet",
                      });
                      const ddatKre = find(dataConfig.datanilai, {
                        idr: drow,
                        type: "kredit",
                      });

                      return (
                        <tr key={ii} className="group">
                          {ii === 0 && (
                            <td
                              rowSpan={el.list.length}
                              className="min-w-10v max-w-10v relative text-center text-slate-800 border border-b"
                            >
                              <div className="absolute z-50 top-1 -left-1 flex items-center">
                                <PopMenuRowSoalTgl13
                                  indx={i}
                                  length={dataConfig.datasoal.length}
                                  moveUp={() =>
                                    moveDataSoal(
                                      dataConfig.datasoal[i],
                                      dataConfig.datasoal[i - 1]
                                    )
                                  }
                                  moveDown={() =>
                                    moveDataSoal(
                                      dataConfig.datasoal[i],
                                      dataConfig.datasoal[i + 1]
                                    )
                                  }
                                  addRow={() => tambahDataSoal()}
                                  removeRow={() => removeDataSoal(el.uid)}
                                />
                              </div>
                              <div className="absolute inset-y-0 top-1 px-1">
                                <TextField
                                  fullWidth
                                  placeholder="Tanggal"
                                  value={el.tanggal}
                                  name="tanggal"
                                  onChange={(e) => changeDSoal(e, i)}
                                  inputProps={{
                                    style: {
                                      textAlign: "center",
                                    },
                                  }}
                                />
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                                />
                              </div>
                            </td>
                          )}
                          <td className="relative min-w-10v max-w-10v p-2 text-center text-slate-800 border border-b">
                            {f && f.noakun}
                            <div className="absolute z-50 top-1 -left-1 flex items-center opacity-10 group-hover:opacity-100">
                              <PopMenuRowSoalAkun13
                                indx={ii}
                                length={el.list.length}
                                moveUp={() =>
                                  moveData(i, el.list[ii], el.list[ii - 1])
                                }
                                moveDown={() =>
                                  moveData(i, el.list[ii], el.list[ii + 1])
                                }
                                addRow={() => {
                                  setBarisA(ii + 1);
                                  setRowid(el.uid);
                                  setShowNewSoalAkun(true);
                                }}
                                removeRow={() => removeDataAkun(el.uid, drow)}
                              />
                            </div>
                          </td>
                          <td className="min-w-30v max-w-30v p-2 text-slate-800 border border-b">
                            {f && f.alias}
                          </td>
                          <td className="min-w-7v max-w-7v p-2 text-center text-slate-800 border border-b">
                            &nbsp;
                          </td>
                          <td className="min-w-15v max-w-15v p-2 text-center text-slate-800 border border-b">
                            {ddatDeb && numberFormat(ddatDeb.value)}
                          </td>
                          <td className="min-w-15v max-w-15v p-2 text-center text-slate-800 border border-b">
                            {ddatKre && numberFormat(ddatKre.value)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="group">
                      <td className="min-w-10v max-w-10v relative text-center text-slate-800 border border-b">
                        <div className="absolute z-50 inset-y-0 -left-1 flex items-center">
                          <div className="absolute z-50 top-1 left-0 flex items-center">
                            <PopMenuRowSoalTgl13
                              indx={i}
                              length={dataConfig.datasoal.length}
                              moveUp={() =>
                                moveDataSoal(
                                  dataConfig.datasoal[i],
                                  dataConfig.datasoal[i - 1]
                                )
                              }
                              moveDown={() =>
                                moveDataSoal(
                                  dataConfig.datasoal[i],
                                  dataConfig.datasoal[i + 1]
                                )
                              }
                              addRow={() => tambahDataSoal()}
                              removeRow={() => removeDataSoal(el.uid)}
                            />
                          </div>
                        </div>
                        <div className="absolute inset-y-0 top-1 px-1">
                          <TextField
                            fullWidth
                            placeholder="Tanggal"
                            value={el.tanggal}
                            name="tanggal"
                            onChange={(e) => changeDSoal(e, i)}
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        </div>
                      </td>
                      <td
                        colSpan={5}
                        className="relative min-w-10v max-w-10v p-2 text-center text-slate-800 border border-b"
                      >
                        &nbsp;
                        <div className="absolute inset-y-0 left-8 flex items-center opacity-5 group-hover:opacity-100">
                          <Tooltip
                            placement="right"
                            title="Tambah data akun di baris ini"
                          >
                            <IconButton
                              style={{
                                margin: "auto",
                              }}
                              size="small"
                              className="transform hover:scale-125"
                              onClick={() => {
                                setBarisA(0);
                                setRowid(el.uid);
                                setShowNewSoalAkun(true);
                              }}
                            >
                              <Addicon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              );
            })
          ) : (
            <tbody>
              <tr className="group">
                <td
                  colSpan={6}
                  className="relative min-w-10v max-w-10v p-2 text-center text-slate-800 border border-b"
                >
                  &nbsp;
                  <div className="absolute inset-y-0 left-16 flex items-center opacity-5 group-hover:opacity-100">
                    <Tooltip
                      placement="right"
                      title="Tambah data Tanggal di baris ini"
                    >
                      <IconButton
                        style={{
                          margin: "auto",
                        }}
                        size="small"
                        className="transform hover:scale-125"
                        onClick={() => tambahDataSoal()}
                      >
                        <Addicon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <NewSoalAkunModal13
        rowuid={rowid}
        barisA={barisA}
        dataConfig={dataConfig}
        setdataConfig={(x) => setdataConfig(x)}
        openn={showNewSoalAkun}
        closeCallback={() => setShowNewSoalAkun(false)}
      />
    </>
  );
}
