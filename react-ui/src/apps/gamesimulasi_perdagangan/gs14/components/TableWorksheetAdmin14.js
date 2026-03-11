import { v4 as uuidv4 } from "uuid";
import { TextField, IconButton, Tooltip } from "@mui/material";
import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
import NumberFormat from "react-number-format";
import { filter, find, findIndex, includes, remove, sumBy } from "lodash";
import { forwardRef, Fragment } from "react"; 
import EditIcon from "@mui/icons-material/Edit";
import Addicon from "@mui/icons-material/AddCircle";
import PopMenuCell14 from "./PopMenuCell14";
import PopMenuRowWorksheet14 from "./PopMenuRowWorksheet14";

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

export default function TableWorksheetAdmin14(props) {
  const { dataConfig, setdataConfig } = props;

  // #region
  const changeData = (e, uid) => {
    const { name, value } = e.target;
    const idx = findIndex(dataConfig.datanilai, {
      uid: uid,
    });
    const list = [...dataConfig.datanilai];
    list.splice(idx, 1, {
      ...dataConfig.datanilai[idx],
      [name]: value,
    });

    setdataConfig({
      ...dataConfig,
      datanilai: list,
    });
  };
  const changeDataAkun = (e, uid) => {
    const { name, value } = e.target;
    const idx = findIndex(dataConfig.dataakun, {
      uid: uid,
    });
    const list = [...dataConfig.dataakun];
    list.splice(idx, 1, {
      ...list[idx],
      [name]: value,
    });

    setdataConfig({
      ...dataConfig,
      dataakun: list,
    });
  };
  const addData = (idc, idr, type) => {
    const list = [...dataConfig.datanilai];
    const key = includes(dataConfig.selectedwork, idc);

    list.splice(0, 0, {
      uid: uuidv4(),
      idc: idc,
      idr: idr,
      value: "",
      type: type,
      key: key,
    });

    setdataConfig({
      ...dataConfig,
      datanilai: list,
    });
  };
  const removedata = (uid) => {
    const list = [...dataConfig.datanilai];
    remove(list, (x) => x.uid === uid);

    setdataConfig({
      ...dataConfig,
      datanilai: list,
    });
  };
  const swapArrayLocs = (arr, index1, index2) => {
    var arry = [...arr];
    var temp = arry[index1];

    arry[index1] = arry[index2];
    arry[index2] = temp;
    return arry;
  };
  const moveDataAkun = (A1, A2) => {
    const list = [...dataConfig.dataakun];
    const p1 = findIndex(dataConfig.dataakun, (x) => x.uid === A1.uid);
    const p2 = findIndex(dataConfig.dataakun, (x) => x.uid === A2.uid);

    setdataConfig({
      ...props.dataConfig,
      dataakun: [...swapArrayLocs(list, p1, p2)],
    });
  };
  const tambahDataAkun = (i) => {
    const list = [...dataConfig.dataakun];
    list.splice(i, 0, { uid: uuidv4(), alias: "", noakun: "" });

    setdataConfig({
      ...dataConfig,
      dataakun: list,
    });
  };
  const removeDataAkun = (uid) => {
    const list = [...dataConfig.dataakun];
    const listnilai = [...dataConfig.datanilai];
    remove(listnilai, (x) => x.idr === uid);
    remove(list, (x) => x.uid === uid);

    setdataConfig({
      ...dataConfig,
      dataakun: list,
      datanilai: listnilai,
    });
  };

  const hitungJumlahLoc = () => {
    const nil = dataConfig.dataheader.map((dat) => {
      return [
        sumBy(
          filter(dataConfig.datanilai, {
            idc: dat.uid,
            type: "debet",
          }),
          (x) => Number(x.value)
        ),
        sumBy(
          filter(dataConfig.datanilai, {
            idc: dat.uid,
            type: "kredit",
          }),
          (x) => Number(x.value)
        ),
      ];
    });
    // console.log(nil);
    return nil;
  };
  // For Beter Perform
  const jumlahLokal = hitungJumlahLoc();

  const selisihChk = (i) => {
    const d = jumlahLokal[i][0];
    const k = jumlahLokal[i][1];
    const x = Math.abs(d - k);

    const hsl1 = x !== 0 ? x : false;
    const hsl2 = hsl1 ? (d < k ? "debet" : "kredit") : false;

    // console.log([hsl1, d + " : " + k]);
    // console.log(hsl2);
    return [hsl1, hsl2];
  };
  const totalChk = (i) => {
    const d = jumlahLokal[i][0];
    const k = jumlahLokal[i][1];
    const x = Math.abs(d - k);

    const hsl1 = x !== 0 ? x : false;
    const hsl2 = hsl1 ? (d < k ? k : d) : false;

    return hsl2;
  };
  // #endregion

  return (
    <>
      <div className="relative">
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
            Kertas kerja
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl relative">
            <InputGrowUpTextH1
              className={"font-semibold tracking-wider"}
              value={dataConfig ? dataConfig.tblworkname : ""}
              onChange={(text) =>
                setdataConfig({ ...dataConfig, tblworkname: text })
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
              <th
                rowSpan="2"
                className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                No. Akun
              </th>
              <th
                rowSpan="2"
                className="min-w-25v max-w-25v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Nama Akun
              </th>
              {dataConfig.dataheader.map((el, i) => (
                <th
                  key={i}
                  colSpan="2"
                  className="py-1.5 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  {el.alias}
                </th>
              ))}
            </tr>
            <tr>
              {dataConfig.dataheader.map((el, i) => (
                <Fragment key={i}>
                  <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    D
                  </th>
                  <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    K
                  </th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="min-w-10v max-w-10v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              <td className="min-w-25v max-w-25v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              {dataConfig.dataheader.map((dat, ii) => (
                <Fragment key={ii}>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                </Fragment>
              ))}
            </tr>
          </tbody>
          {/* DATA UTAMA */}
          <tbody>
            {dataConfig.dataakun.length > 0 ? (
              dataConfig.dataakun.map((el, i) => {
                return (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="group min-w-10v max-w-10v text-center text-slate-800 border border-b">
                      <div className="relative">
                        <div className="absolute z-50 top-1 -left-1 flex items-center">
                          <PopMenuRowWorksheet14
                            indx={i}
                            length={dataConfig.dataakun.length}
                            moveUp={() =>
                              moveDataAkun(
                                dataConfig.dataakun[i],
                                dataConfig.dataakun[i - 1]
                              )
                            }
                            moveDown={() =>
                              moveDataAkun(
                                dataConfig.dataakun[i],
                                dataConfig.dataakun[i + 1]
                              )
                            }
                            addRow={() => tambahDataAkun(i + 1)}
                            removeRow={() => removeDataAkun(el.uid)}
                          />
                        </div>
                        <TextField
                          fullWidth
                          placeholder="No Akun"
                          value={el.noakun}
                          name="noakun"
                          onChange={(e) => changeDataAkun(e, el.uid)}
                          inputProps={{
                            style: {
                              fontSize: 14,
                              textAlign: "center",
                            },
                          }}
                          InputProps={{
                            disableUnderline: true,
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 opacity-10 group-hover:opacity-60 absolute inset-y-0 right-1"
                        />
                      </div>
                    </td>
                    <td className="group min-w-30v max-w-30v text-slate-800 border border-b">
                      <div className="relative">
                        <TextField
                          fullWidth
                          placeholder="Nama Akun"
                          value={el.alias}
                          name="alias"
                          onChange={(e) => changeDataAkun(e, el.uid)}
                          inputProps={{
                            style: {
                              fontSize: 14,
                              paddingLeft: 6,
                            },
                          }}
                          InputProps={{
                            disableUnderline: true,
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 opacity-10 group-hover:opacity-60 absolute inset-y-0 right-1"
                        />
                      </div>
                    </td>
                    {dataConfig.dataheader.map((dat, ii) => {
                      const fd = find(dataConfig.datanilai, {
                        idc: dat.uid,
                        idr: el.uid,
                        type: "debet",
                      });
                      const fk = find(dataConfig.datanilai, {
                        idc: dat.uid,
                        idr: el.uid,
                        type: "kredit",
                      });

                      return (
                        <Fragment key={ii}>
                          <td className="min-w-15v max-w-15v p-1 text-center text-slate-800 border border-b relative group">
                            {fd && fd.type === "debet" ? (
                              <div className={`${fd.key && " bg-amber-200"}`}>
                                <TextField
                                  placeholder="Value Rp"
                                  name="value"
                                  value={fd.value}
                                  onChange={(e) => changeData(e, fd.uid)}
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
                                      fontWeight: 400,
                                    },
                                  }}
                                />
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-2 opacity-30 group-hover:opacity-70"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100">
                                  <PopMenuCell14
                                    removeData={() => removedata(fd.uid)}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center opacity-5 group-hover:opacity-100">
                                <IconButton
                                  style={{
                                    margin: "auto",
                                  }}
                                  size="small"
                                  className="transform hover:scale-125"
                                  onClick={() =>
                                    addData(dat.uid, el.uid, "debet")
                                  }
                                >
                                  <Addicon />
                                </IconButton>
                              </div>
                            )}
                          </td>
                          <td className="min-w-15v max-w-15v p-1 text-center text-slate-800 border border-b relative group">
                            {fk && fk.type === "kredit" ? (
                              <div className={`${fk.key && " bg-amber-200"}`}>
                                <TextField
                                  placeholder="Value Rp"
                                  name="value"
                                  value={fk.value}
                                  onChange={(e) => changeData(e, fk.uid)}
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
                                      fontWeight: 400,
                                    },
                                  }}
                                />
                                <EditIcon
                                  fontSize="inherit"
                                  className="text-blue-700 absolute inset-y-0 right-2 opacity-30 group-hover:opacity-70"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100">
                                  <PopMenuCell14
                                    removeData={() => removedata(fk.uid)}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center opacity-5 group-hover:opacity-100">
                                <IconButton
                                  style={{
                                    margin: "auto",
                                  }}
                                  size="small"
                                  className="transform hover:scale-125"
                                  onClick={() =>
                                    addData(dat.uid, el.uid, "kredit")
                                  }
                                >
                                  <Addicon />
                                </IconButton>
                              </div>
                            )}
                          </td>
                        </Fragment>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr className="group">
                <td
                  colSpan={2}
                  className="relative min-w-10v max-w-10v p-2 text-center text-slate-800 border border-b"
                >
                  &nbsp;
                  <div className="absolute inset-0 flex items-center opacity-50 group-hover:opacity-100">
                    <Tooltip
                      placement="right"
                      title="Tambah data Akun di baris ini"
                    >
                      <IconButton
                        style={{
                          margin: "auto",
                        }}
                        size="small"
                        className="transform hover:scale-125"
                        onClick={() => tambahDataAkun(0)}
                      >
                        <Addicon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          {/* End DATA UTAMA */}
          <tfoot>
            <tr>
              <td className="min-w-10v max-w-10v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              <td className="min-w-25v max-w-25v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              {dataConfig.dataheader.map((dat, ii) => (
                <Fragment key={ii}>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                </Fragment>
              ))}
            </tr>
            <tr className="hover:bg-slate-100 bg-slate-50 font-semibold">
              <td
                colSpan="2"
                className="p-0.5 uppercase text-center text-slate-800 border border-b"
              >
                Total
              </td>
              {dataConfig.dataheader.map((dat, ii) => {
                const ky = includes(dataConfig.selectedwork, dat.uid);
                return (
                  <Fragment key={ii}>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      <Tooltip
                        title={
                          ky ? "Input Nilai jawaban benar untuk Mahasiswa" : ""
                        }
                      >
                        <div className={`p-1.5 ${ky && " bg-amber-200"}`}>
                          {numberFormat(jumlahLokal[ii][0])}
                        </div>
                      </Tooltip>
                    </td>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      <Tooltip
                        title={
                          ky ? "Input Nilai jawaban benar untuk Mahasiswa" : ""
                        }
                      >
                        <div className={`p-1.5 ${ky && " bg-amber-200"}`}>
                          {numberFormat(jumlahLokal[ii][1])}
                        </div>
                      </Tooltip>
                    </td>
                  </Fragment>
                );
              })}
            </tr>
            <tr className="hover:bg-slate-100 bg-slate-50 font-semibold">
              <td
                colSpan="2"
                className="p-0.5 uppercase text-center text-slate-800 border border-b"
              >
                LABA
              </td>
              {dataConfig.dataheader.map((dat, ii) => {
                const ky = includes(dataConfig.selectedwork, dat.uid);
                const diff = ky ? selisihChk(ii) : false;
                return (
                  <Fragment key={ii}>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      {ky && diff && diff[1] === "debet" && (
                        <Tooltip title="Input Nilai jawaban benar untuk Mahasiswa">
                          <div className={`p-1.5 bg-amber-200`}>
                            {numberFormat(diff[0])}
                          </div>
                        </Tooltip>
                      )}
                    </td>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      {ky && diff && diff[1] === "kredit" && (
                        <Tooltip title="Input Nilai jawaban benar untuk Mahasiswa">
                          <div className={`p-1.5 bg-amber-200`}>
                            {numberFormat(diff[0])}
                          </div>
                        </Tooltip>
                      )}
                    </td>
                  </Fragment>
                );
              })}
            </tr>
            <tr className="hover:bg-slate-100 bg-slate-50 font-semibold">
              <td
                colSpan="2"
                className="p-0.5 uppercase text-center text-slate-800 border border-b"
              >
                Total
              </td>
              {dataConfig.dataheader.map((dat, ii) => {
                const ky = includes(dataConfig.selectedwork, dat.uid);
                const cmpr = ky ? totalChk(ii) : false;

                return (
                  <Fragment key={ii}>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      {ky && cmpr && (
                        <Tooltip title="Input Nilai jawaban benar untuk Mahasiswa">
                          <div className={`p-1.5 bg-amber-200`}>
                            {numberFormat(cmpr)}
                          </div>
                        </Tooltip>
                      )}
                    </td>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      {ky && cmpr && (
                        <Tooltip title="Input Nilai jawaban benar untuk Mahasiswa">
                          <div className={`p-1.5 bg-amber-200`}>
                            {numberFormat(cmpr)}
                          </div>
                        </Tooltip>
                      )}
                    </td>
                  </Fragment>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
