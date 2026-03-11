import { v4 as uuidv4 } from "uuid";
import { remove, find, sumBy } from "lodash";
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Addicon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Assignment from "@mui/icons-material/AssignmentReturned";
import PopMenuHeaders from "./PopMenuHeaders";
import PopMenuKode from "./PopMenuKode";
import PopMenuSection from "./PopMenuSection";
import PopMenuRow from "./PopMenuRow";
import PopMenuCell from "./PopMenuCell";
import PopMenuJumlah from "./PopMenuJumlah";
import PopMenuRowStar from "./PopMenuRowStar";
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
        textAlign: "center",
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

export default function TabelPreviewAdminv2(props) {
  const headers = props.headers;
  const departements = props.departements;
  const sections = props.sections;
  const kode = props.kode;
  const kpembantu1 = props.kpembantu.filter((x) => x.type === 1);
  const kpembantu2 = props.kpembantu.filter((x) => x.type === 2);
  const data = props.data;
  const dataAlokasi = props.dataAlokasi;

  //#region HEADERS
  const addHeaders = (p) => {
    const h = [...headers];
    h.splice(p + 1, 0, {
      uuid: uuidv4(),
      alias: "a",
      colspan: 1,
      rowspan: 1,
    });
    props.setHeaders(h);
  };
  const removeHeaders = (uid) => {
    const temp = remove(headers, (x) => x.uuid !== uid);
    props.setHeaders(temp);
  };
  const updateColRowSpanHeaders = (uuid, col, row) => {
    props.setHeaders(
      headers.map((u, i) =>
        u.uuid === uuid
          ? {
              ...u,
              colspan: col,
              rowspan: row,
            }
          : u
      )
    );
  };
  //#endregion HEADERS
  //#region Departemnts
  const addDepartements = (p) => {
    const h = [...departements];
    h.splice(p + 1, 0, {
      uuid: uuidv4(),
      alias: "",
      colspan: 1,
      rowspan: 1,
    });
    props.setDepartements(h);
  };
  const removeDepartements = (uid) => {
    const temp = remove(departements, (x) => x.uuid !== uid);
    props.setDepartements(temp);
  };
  const updateColRowSpanDepartements = (uuid, col, row) => {
    props.setDepartements(
      departements.map((u, i) =>
        u.uuid === uuid
          ? {
              ...u,
              colspan: col,
              rowspan: row,
            }
          : u
      )
    );
  };
  //#endregion DEPARTEMENTS
  //#region SECTIONS
  const addSections = (p) => {
    const h = [...sections];
    h.splice(p + 1, 0, {
      uuid: uuidv4(),
      alias: "",
      colspan: 1,
      rowspan: 1,
    });
    props.setSections(h);
  };
  const removeSections = (uid) => {
    const temp = remove(sections, (x) => x.uuid !== uid);
    props.setSections(temp);
  };
  const updateColRowSpanSections = (uuid, col, row) => {
    props.setSections(
      sections.map((u, i) =>
        u.uuid === uuid
          ? {
              ...u,
              colspan: col,
              rowspan: row,
            }
          : u
      )
    );
  };
  //#endregion SECTIONS
  //#region KODE
  const addKode = (p) => {
    const h = [...kode];
    h.splice(p + 1, 0, {
      uuid: uuidv4(),
      alias: "",
      colspan: 1,
      rowspan: 1,
    });
    props.setKode(h);
  };
  const removeKode = (uid) => {
    const temp = remove(kode, (x) => x.uuid !== uid);
    props.setKode(temp);
    const temp1 = remove(data, (x) => x.idc !== uid);
    props.setData(temp1);
  };
  //#endregion Kode
  //#region ROW
  const addKpembantu1 = (p, type) => {
    const h = [...kpembantu1];
    h.splice(p + 1, 0, {
      uuid: uuidv4(),
      alias: "",
      type: type,
      status: false,
    });
    props.setKpembantu([...h, ...kpembantu2]);
  };
  const addKpembantu2 = (p, type) => {
    const h = [...kpembantu2];
    h.splice(p + 1, 0, {
      uuid: uuidv4(),
      alias: "",
      type: type,
      status: false,
    });
    props.setKpembantu([...kpembantu1, ...h]);
  };
  const removeKpembantu1 = (uid) => {
    const temp = remove(kpembantu1, (x) => x.uuid !== uid);
    props.setKpembantu([...temp, ...kpembantu2]);

    const temp1 = remove(data, (x) => x.idr !== uid);
    props.setData(temp1);
  };
  const removeKpembantu2 = (uid) => {
    const temp = remove(kpembantu2, (x) => x.uuid !== uid);
    props.setKpembantu([...kpembantu1, ...temp]);
    const temp1 = remove(data, (x) => x.idr !== uid);
    props.setData(temp1);
  };
  const activeRow = (uuid) => {
    const tmp = kpembantu2.map((u, i) => ({
      ...u,
      status: false,
    }));
    const tmp2 = tmp.map((u, i) =>
      u.uuid === uuid
        ? {
            ...u,
            status: true,
          }
        : u
    );
    props.setKpembantu([...kpembantu1, ...tmp2]);
  };
  //#endregion ROW
  //#region CELL
  const addData = (idc, idr, type) => {
    const a = [...data];
    a.push({
      uuid: uuidv4(),
      idc: idc,
      idr: idr,
      value: 0,
      type: type,
    });
    props.setData(a);
  };
  const removeCell = (uid) => {
    const temp = remove(data, (x) => x.uuid !== uid);
    props.setData(temp);
  };
  //#endregion CELL
  //#region
  const addAlokasiData = (idc) => {
    const a = [...dataAlokasi];
    a.push({
      uuid: uuidv4(),
      idc: idc,
      keterangan: "",
      mode: "nominal",
      value: 0,
    });
    props.setDataAlokasi(a);
  };
  //#endregion
  // PREPARAtion DATA
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const drowpembantu = kpembantu2.filter(
    (x) => x.status === true || x.status === 1
  );
  const dnominal = dataAlokasi.filter((x) => x.mode === "nominal");
  const dataInRowActiv = [...kode].map((u, i) => {
    const aloActv = find(dataAlokasi, {
      idc: u.uuid,
    });
    var tot = 0;
    if (aloActv && dnominal[0]) {
      if (aloActv.mode === "nominal") {
        tot = aloActv.value;
      } else {
        tot = Math.abs((aloActv.value / 100) * dnominal[0].value);
      }
    }

    return {
      idc: u.uuid,
      value: tot,
      status: aloActv ? true : false,
    };
  });
  const total1 = sumBy(
    data.filter((x) => x.type === 1),
    (r) => r.value
  );

  return (
    <div className="p-1 border overflow-x-auto bg-white">
      Preview Worksheet Mahasiswa :
      <table className="min-w-full table-fixed mb-4">
        <thead>
          <tr className="break-words bg-slate-50">
            <th className="min-w-10v max-w-10v px-2 border">
              Kode Rek Pembantu
            </th>
            <th className="min-w-15v max-w-15v px-2 border">Jumlah</th>
            <th className="p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {headers.map((item1, index) => (
                      <th
                        key={index}
                        colSpan={item1.colspan}
                        rowSpan={item1.rowspan}
                        className="p-0 border relative group"
                      >
                        <div className="py-3 min-w-20v">
                          <TextField
                            placeholder="Header name"
                            value={item1.alias}
                            onChange={(event) =>
                              props.setHeaders(
                                headers.map((u, i) =>
                                  u.uuid === item1.uuid
                                    ? {
                                        ...u,
                                        alias: event.target.value,
                                      }
                                    : u
                                )
                              )
                            }
                            fullWidth
                            InputProps={{
                              disableUnderline: true,
                            }}
                            inputProps={{
                              style: { textAlign: "center", fontWeight: 600 },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-6 opacity-10 group-hover:opacity-70"
                          />
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100">
                          <PopMenuHeaders
                            data={item1}
                            addHeaders={() => addHeaders(index)}
                            removeHeaders={() => removeHeaders(item1.uuid)}
                            updateColRow={(c, r) =>
                              updateColRowSpanHeaders(item1.uuid, c, r)
                            }
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {departements.map((item2, index) => (
                      <th
                        key={index}
                        colSpan={item2.colspan}
                        rowSpan={item2.rowspan}
                        className="p-0 border relative group"
                      >
                        <div className="py-1 min-w-20v">
                          <TextField
                            placeholder="Departements name"
                            value={item2.alias}
                            onChange={(event) =>
                              props.setDepartements(
                                departements.map((u, i) =>
                                  u.uuid === item2.uuid
                                    ? {
                                        ...u,
                                        alias: event.target.value,
                                      }
                                    : u
                                )
                              )
                            }
                            fullWidth
                            InputProps={{
                              disableUnderline: true,
                            }}
                            inputProps={{
                              style: {
                                textAlign: "center",
                                fontSize: 15,
                                fontWeight: 600,
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-6 opacity-10 group-hover:opacity-70"
                          />
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100">
                          <PopMenuHeaders
                            data={item2}
                            addHeaders={() => addDepartements(index)}
                            removeHeaders={() => removeDepartements(item2.uuid)}
                            updateColRow={(c, r) =>
                              updateColRowSpanDepartements(item2.uuid, c, r)
                            }
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {sections.map((item3, index) => (
                      <th
                        key={index}
                        colSpan={item3.colspan}
                        rowSpan={item3.rowspan}
                        className="p-0 border relative group"
                      >
                        <div className="py-1 min-w-20v">
                          <TextField
                            placeholder="Sections name"
                            value={item3.alias}
                            onChange={(event) =>
                              props.setSections(
                                sections.map((u, i) =>
                                  u.uuid === item3.uuid
                                    ? {
                                        ...u,
                                        alias: event.target.value,
                                      }
                                    : u
                                )
                              )
                            }
                            fullWidth
                            InputProps={{
                              disableUnderline: true,
                            }}
                            inputProps={{
                              style: {
                                textAlign: "center",
                                fontSize: 15,
                                fontWeight: 600,
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-6 opacity-10 group-hover:opacity-70"
                          />
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100">
                          <PopMenuSection
                            data={item3}
                            addHeaders={() => addSections(index)}
                            removeHeaders={() => removeSections(item3.uuid)}
                            updateColRow={(c, r) =>
                              updateColRowSpanSections(item3.uuid, c, r)
                            }
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {kode.map((item3, index) => (
                      <th
                        key={index}
                        colSpan={item3.colspan}
                        rowSpan={item3.rowspan}
                        className="p-0 border min-w-20v max-w-20v relative group"
                      >
                        <div className="py-1">
                          <TextField
                            placeholder="Kode Utama *(510)"
                            value={item3.alias}
                            onChange={(event) =>
                              props.setKode(
                                kode.map((u, i) =>
                                  u.uuid === item3.uuid
                                    ? {
                                        ...u,
                                        alias: event.target.value,
                                      }
                                    : u
                                )
                              )
                            }
                            fullWidth
                            InputProps={{
                              disableUnderline: true,
                            }}
                            inputProps={{
                              style: {
                                textAlign: "center",
                                fontSize: 15,
                                fontWeight: 600,
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-6 opacity-10 group-hover:opacity-70"
                          />
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100">
                          <PopMenuKode
                            data={item3}
                            addHeaders={() => addKode(index)}
                            removeHeaders={() => removeKode(item3.uuid)}
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                </tbody>
              </table>
            </th>
          </tr>
        </thead>
        <tbody>
          {kpembantu1.map((trl, index) => {
            return (
              <tr key={index}>
                <td className="p-0 max-w-10v border group">
                  <div className="py-1 relative">
                    <TextField
                      placeholder="Kode"
                      value={trl.alias}
                      onChange={(event) => {
                        props.setKpembantu([
                          ...kpembantu1.map((u, i) =>
                            u.uuid === trl.uuid
                              ? {
                                  ...u,
                                  alias: event.target.value,
                                }
                              : u
                          ),
                          ...kpembantu2,
                        ])
                      }}
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                      }}
                      inputProps={{
                        style: {
                          textAlign: "center",
                          fontSize: 15,
                          fontWeight: 600,
                        },
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-6 opacity-10 group-hover:opacity-70"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100">
                      <PopMenuRow
                        addRow={() => addKpembantu1(index, 1)}
                        removeRow={() => removeKpembantu1(trl.uuid)}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2 min-w-10v max-w-10v border text-center">
                  {sumBy(
                    data.filter((x) => x.idr === trl.uuid),
                    (r) => r.value
                  ) > 0
                    ? toRp(
                        sumBy(
                          data.filter((x) => x.idr === trl.uuid),
                          (r) => r.value
                        )
                      )
                    : ""}
                </td>
                <td className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        {kode.map((item, index) => {
                          const f = find(data, {
                            idc: item.uuid,
                            idr: trl.uuid,
                          });
                          return (
                            <td
                              key={index}
                              className="p-0 border relative group min-w-20v max-w-20v"
                            >
                              {f ? (
                                <div className="py-2.5 mx-auto ">
                                  <TextField
                                    placeholder="Value Rp"
                                    value={f.value}
                                    onChange={(event) =>
                                      props.setData(
                                        data.map((u, i) =>
                                          u.uuid === f.uuid
                                            ? {
                                                ...u,
                                                value: Number(
                                                  event.target.value
                                                ),
                                              }
                                            : u
                                        )
                                      )
                                    }
                                    name="nilai"
                                    fullWidth
                                    InputProps={{
                                      disableUnderline: true,
                                      inputComponent: NumberFormatCustom,
                                    }}
                                    inputProps={{
                                      style: {
                                        textAlign: "center",
                                        fontSize: 15,
                                        fontWeight: 400,
                                      },
                                    }}
                                  />
                                  <EditIcon
                                    fontSize="inherit"
                                    className="text-blue-700 absolute inset-y-0 right-6 opacity-10 group-hover:opacity-70"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100">
                                    <PopMenuCell
                                      removeCell={() => removeCell(f.uuid)}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="py-2.5 flex items-center opacity-0 group-hover:opacity-100">
                                  <IconButton
                                    style={{
                                      margin: "auto",
                                    }}
                                    size="small"
                                    className="transform hover:scale-125"
                                    onClick={() =>
                                      addData(item.uuid, trl.uuid, 1)
                                    }
                                  >
                                    <Addicon />
                                  </IconButton>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
          {/* JUMLAH #1 */}
          <tr className="bg-slate-50">
            <td className="py-2 text-center border relative">
              Jumlah
              <div className="absolute inset-y-0 right-0 flex items-center">
                <PopMenuJumlah addRow={() => addKpembantu2(-1, 2)} />
              </div>
            </td>
            <td className="text-center border table-cell">
              {total1 < 0 ? <>({toRp(Math.abs(total1))})</> : toRp(total1)}
            </td>
            <td className="p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {kode.map((item, index) => {
                      const val = sumBy(
                        data.filter((x) => x.type === 1 && x.idc === item.uuid),
                        (r) => r.value
                      );

                      return (
                        <td
                          key={index}
                          className="p-0 border relative group min-w-20v max-w-20v"
                        >
                          <div className="py-2.5 text-center">
                            {val < 0 ? <>({toRp(Math.abs(val))})</> : toRp(val)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
        <tbody>
          {kpembantu2.map((trl, index) => {
            return (
              <tr
                key={index}
                className={` ${trl.status && " bg-amber-50 bg-opacity-80"}`}
              >
                <td className="p-0 max-w-10v border group">
                  <div className="py-1 relative">
                    {trl.status ? (
                      <div className="absolute inset-y-0 left-2 flex items-center">
                        <VerifiedUserIcon
                          fontSize="small"
                          className="text-emerald-600"
                        />
                      </div>
                    ) : null}
                    <TextField
                      placeholder="Kode"
                      value={trl.alias}
                      onChange={(event) =>
                        props.setKpembantu([
                          ...kpembantu1,
                          ...kpembantu2.map((u, i) =>
                            u.uuid === trl.uuid
                              ? {
                                  ...u,
                                  alias: event.target.value,
                                }
                              : u
                          ),
                        ])
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                      }}
                      inputProps={{
                        style: {
                          textAlign: "center",
                          fontSize: 15,
                          fontWeight: 600,
                        },
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-6 opacity-10 group-hover:opacity-70"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center opacity-30 group-hover:opacity-100">
                      <PopMenuRowStar
                        addRow={() => addKpembantu2(index, 2)}
                        removeRow={() => removeKpembantu2(trl.uuid)}
                        setSelect={() => {
                          activeRow(trl.uuid);
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2 min-w-10v max-w-10v border text-center"></td>
                <td className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        {kode.map((item, i) => {
                          // filter jika selected row nilai tidak digunakan
                          const f =
                            !trl.status &&
                            find(data, {
                              idc: item.uuid,
                              idr: trl.uuid,
                            });

                          return (
                            <td
                              key={i}
                              className="p-0 border relative group min-w-20v max-w-20v"
                            >
                              {f ? ( //untuuk status row false & data found
                                <div className="py-2.5 mx-auto ">
                                  <TextField
                                    placeholder="Value Rp"
                                    value={f.value}
                                    onChange={(event) =>
                                      props.setData(
                                        data.map((u, i) =>
                                          u.uuid === f.uuid
                                            ? {
                                                ...u,
                                                value: Number(
                                                  event.target.value
                                                ),
                                              }
                                            : u
                                        )
                                      )
                                    }
                                    name="nilai"
                                    fullWidth
                                    InputProps={{
                                      disableUnderline: true,
                                      inputComponent: NumberFormatCustom,
                                    }}
                                    inputProps={{
                                      style: {
                                        textAlign: "center",
                                        fontSize: 15,
                                        fontWeight: 400,
                                      },
                                    }}
                                  />
                                  <EditIcon
                                    fontSize="inherit"
                                    className="text-blue-700 absolute inset-y-0 right-6 opacity-10 group-hover:opacity-70"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100">
                                    <PopMenuCell
                                      removeCell={() => removeCell(f.uuid)}
                                    />
                                  </div>
                                </div>
                              ) : !trl.status ? (
                                //untuk bukan row selected
                                <div className="py-2.5 flex items-center opacity-0 group-hover:opacity-100">
                                  <IconButton
                                    style={{
                                      margin: "auto",
                                    }}
                                    size="small"
                                    className="transform hover:scale-125"
                                    onClick={() =>
                                      addData(item.uuid, trl.uuid, 2)
                                    }
                                  >
                                    <Addicon />
                                  </IconButton>
                                </div>
                              ) : //
                              // Status Row TRUE
                              //Cehcek
                              dataInRowActiv[i].status ? (
                                <div className="py-2.5 text-center">
                                  {dataInRowActiv[i].value < 0 ? (
                                    <>
                                      ({toRp(Math.abs(dataInRowActiv[i].value))}
                                      )
                                    </>
                                  ) : (
                                    toRp(Math.abs(dataInRowActiv[i].value))
                                  )}
                                </div>
                              ) : (
                                //alookasi kosong
                                <div className="py-2.5 flex items-center opacity-5 group-hover:opacity-100">
                                  <Tooltip
                                    title="Pilih sebagai Dasar Alokasi"
                                    placement="top"
                                    arrow
                                  >
                                    <IconButton
                                      style={{
                                        margin: "auto",
                                      }}
                                      size="small"
                                      className="transform hover:scale-125"
                                      onClick={() => addAlokasiData(item.uuid)}
                                    >
                                      <Assignment />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
          {/* JUMLAH #2 */}
          <tr className="bg-slate-50">
            <td className="py-2 text-center border relative">Jumlah</td>
            <td className="text-center border table-cell"></td>
            <td className="p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {kode.map((item, index) => {
                      const val =
                        sumBy(
                          data.filter(
                            (x) =>
                              drowpembantu[0] &&
                              x.idc === item.uuid &&
                              x.idr !== drowpembantu[0].uuid
                          ),
                          (r) => r.value
                        ) + dataInRowActiv[index].value;

                      return (
                        <td
                          key={index}
                          className="p-0 border relative group min-w-20v max-w-20v"
                        >
                          <div className="py-2.5 text-center">
                            {val < 0 ? <>({toRp(Math.abs(val))})</> : toRp(val)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
