import { TextField } from "@mui/material";
import NumberFormat from "react-number-format"; 
import EditIcon from "@mui/icons-material/Edit";
import { map, filter, find, findIndex } from "lodash";
import ItemsDataDragAkun from "./ItemsDataDragAkun";
import { Droppable } from "react-beautiful-dnd";
import ItemsDataDragKet from "./ItemsDataDragKet";
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

export default function TableWorksheetMhs12(props) {
  const { dataConfig, jwbtgl, setJwbtgl, jwbdata, setJwbdata, checking } =
    props;
  const { dataakun } = props.dataConfig;

  const changeTgl = (e) => {
    const { name, value } = e.target;
    setJwbtgl({
      ...jwbtgl,
      [name]: value,
    });
  };

  const handleInputJwb = (e, uid) => {
    const { name, value } = e.target;
    const idx = findIndex(jwbdata, { uid: uid });
    const list = [...jwbdata];
    list.splice(idx, 1, {
      ...list[idx],
      [name]: value,
    });

    setJwbdata(list);
  };

  return (
    <>
      <div className="flex flex-col items-center font-bold">
        <div className="text-xl font-semibold uppercase">
          {dataConfig && dataConfig.cvname}
        </div>
      </div>
      <div className="flex flex-col items-center mb-1">
        <div className="text-lg font-semibold uppercase">
          Jurnal Penyesuaian
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-xl font-semibold tracking-wider">
          {dataConfig && dataConfig.tblworkname}
        </div>
      </div>
      <div className="pt-3 border-collapse pb-1">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Tanggal
              </th>
              <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                No. Akun
              </th>
              <th className="min-w-25v max-w-25v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Keterangan
              </th>
              <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
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
          {/* Aset */}
          <tbody>
            {map(filter(jwbdata, { base: "aset" }), (item, index) => {
              return (
                <tr key={index}>
                  {index === 0 && (
                    <td
                      rowSpan={filter(jwbdata, { base: "aset" }).length}
                      className="py-2 min-w-15v max-w-15v relative text-slate-800 border border-b"
                    >
                      &nbsp;
                      <div className={`absolute inset-y-0 top-1 px-1`}>
                        <div
                          className={`${
                            checking &&
                            jwbtgl.err_tgl1 &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <TextField
                            fullWidth
                            placeholder="Jawab Tanggal 1"
                            value={jwbtgl ? jwbtgl.jwb_tgl1 : ""}
                            name="jwb_tgl1"
                            onChange={(e) => changeTgl(e)}
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                          />
                        </div>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-0.5 py-0.5 text-slate-800 text-center border border-b">
                    <div
                      className={`relative ${
                        checking &&
                        item.err_noakun &&
                        " bg-red-300 animate-pulse p-0.5"
                      }`}
                    >
                      <Droppable
                        droppableId={
                          "dst_noakun_" + item.uid + "_aset_" + index
                        }
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`w-full  items-center p-0.5 ${
                              snapshot.isDraggingOver && "bg-slate-100"
                            }`}
                          >
                            {item.jwb_noakun ? (
                              <ItemsDataDragAkun
                                data={
                                  find(dataakun, { uid: item.jwb_noakun })
                                    .noakun
                                }
                                index={index}
                                uid={item.uid}
                              />
                            ) : (
                              <span className="flex opacity-40 w-full justify-center border border-dashed">
                                Drop disini
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                  <td className="px-0.5 py-0.5 min-w-25v max-w-25v  text-slate-800 border border-b">
                    <div
                      className={`relative ${
                        checking &&
                        item.err_keterangan &&
                        " bg-red-300 animate-pulse p-0.5"
                      }`}
                    >
                      <Droppable
                        droppableId={
                          "dst_keterangan_" + item.uid + "_aset_" + index
                        }
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`w-full  items-center p-0.5 ${
                              snapshot.isDraggingOver && "bg-slate-100"
                            }`}
                          >
                            {item.jwb_keterangan ? (
                              <ItemsDataDragKet
                                data={
                                  find(dataakun, { uid: item.jwb_keterangan })
                                    .keterangan
                                }
                                index={index}
                                uid={item.uid}
                              />
                            ) : (
                              <span className="flex items-center justify-center opacity-40 w-full border border-dashed">
                                Drop disini
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    &nbsp;
                  </td>
                  <td className="py-0  text-slate-800 text-center border border-b">
                    {item.posisi === "debet" ? (
                      <div
                        className={`relative -mb-1 ${
                          checking &&
                          item.err_jumlah &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          fullWidth
                          placeholder="Jawab jumlah"
                          value={item.jwb_jumlah === 0 ? "" : item.jwb_jumlah}
                          onChange={(e) => handleInputJwb(e, item.uid)}
                          name="jwb_jumlah"
                          inputProps={{
                            prefix: "Rp ",
                            style: {
                              textAlign: "center",
                            },
                          }}
                          InputProps={{
                            readOnly: checking,
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                        )}
                      </div>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                  <td className="py-0  text-slate-800 text-center border border-b">
                    {item.posisi === "kredit" ? (
                      <div
                        className={`relative -mb-1 ${
                          checking &&
                          item.err_jumlah &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          fullWidth
                          placeholder="Jawab jumlah"
                          value={item.jwb_jumlah === 0 ? "" : item.jwb_jumlah}
                          onChange={(e) => handleInputJwb(e, item.uid)}
                          name="jwb_jumlah"
                          inputProps={{
                            prefix: "Rp ",
                            style: {
                              textAlign: "center",
                            },
                          }}
                          InputProps={{
                            readOnly: checking,
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                        )}
                      </div>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Bunga */}
          <tbody>
            {map(filter(jwbdata, { base: "bunga" }), (item, index) => {
              return (
                <tr key={index}>
                  {index === 0 && (
                    <td
                      rowSpan={filter(jwbdata, { base: "bunga" }).length}
                      className="py-2 min-w-15v max-w-15v relative text-slate-800 border border-b"
                    >
                      &nbsp;
                      <div className={`absolute inset-y-0 top-1 px-1`}>
                        <div
                          className={`${
                            checking &&
                            jwbtgl.err_tgl2 &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <TextField
                            fullWidth
                            placeholder="Jawab Tanggal 2"
                            value={jwbtgl ? jwbtgl.jwb_tgl2 : ""}
                            name="jwb_tgl2"
                            onChange={(e) => changeTgl(e)}
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                          />
                        </div>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-0.5 py-0.5 text-slate-800 text-center border border-b">
                    <div
                      className={`relative ${
                        checking &&
                        item.err_noakun &&
                        " bg-red-300 animate-pulse p-0.5"
                      }`}
                    >
                      <Droppable
                        droppableId={
                          "dst_noakun_" + item.uid + "_bunga_" + index
                        }
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`w-full  items-center p-0.5 ${
                              snapshot.isDraggingOver && "bg-slate-100"
                            }`}
                          >
                            {item.jwb_noakun ? (
                              <ItemsDataDragAkun
                                data={
                                  find(dataakun, { uid: item.jwb_noakun })
                                    .noakun
                                }
                                index={index}
                                uid={item.uid}
                              />
                            ) : (
                              <span className="flex opacity-40 w-full justify-center border border-dashed">
                                Drop disini
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                  <td className="px-1 py-1  text-slate-800 border border-b">
                    <div
                      className={`relative ${
                        checking &&
                        item.err_keterangan &&
                        " bg-red-300 animate-pulse p-0.5"
                      }`}
                    >
                      <Droppable
                        droppableId={
                          "dst_keterangan_" + item.uid + "_bunga_" + index
                        }
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`w-full  items-center p-0.5 ${
                              snapshot.isDraggingOver && "bg-slate-100"
                            }`}
                          >
                            {item.jwb_keterangan ? (
                              <ItemsDataDragKet
                                data={
                                  find(dataakun, { uid: item.jwb_keterangan })
                                    .keterangan
                                }
                                index={index}
                                uid={item.uid}
                              />
                            ) : (
                              <span className="flex items-center justify-center opacity-40 w-full border border-dashed">
                                Drop disini
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    &nbsp;
                  </td>
                  <td className="py-0  text-slate-800 text-center border border-b">
                    {item.posisi === "debet" ? (
                      <div
                        className={`relative -mb-1 ${
                          checking &&
                          item.err_jumlah &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          fullWidth
                          placeholder="Jawab jumlah"
                          value={item.jwb_jumlah === 0 ? "" : item.jwb_jumlah}
                          onChange={(e) => handleInputJwb(e, item.uid)}
                          name="jwb_jumlah"
                          inputProps={{
                            prefix: "Rp ",
                            style: {
                              textAlign: "center",
                            },
                          }}
                          InputProps={{
                            readOnly: checking,
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                        )}
                      </div>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                  <td className="py-0  text-slate-800 text-center border border-b">
                    {item.posisi === "kredit" ? (
                      <div
                        className={`relative -mb-1 ${
                          checking &&
                          item.err_jumlah &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          fullWidth
                          placeholder="Jawab jumlah"
                          value={item.jwb_jumlah === 0 ? "" : item.jwb_jumlah}
                          onChange={(e) => handleInputJwb(e, item.uid)}
                          name="jwb_jumlah"
                          inputProps={{
                            prefix: "Rp ",
                            style: {
                              textAlign: "center",
                            },
                          }}
                          InputProps={{
                            readOnly: checking,
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                        )}
                      </div>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* piutang */}
          <tbody>
            {map(filter(jwbdata, { base: "piutang" }), (item, index) => {
              return (
                <tr key={index}>
                  {index === 0 && (
                    <td
                      rowSpan={filter(jwbdata, { base: "bunga" }).length}
                      className="py-2 min-w-15v max-w-15v relative text-slate-800 border border-b"
                    >
                      &nbsp;
                      <div className={`absolute inset-y-0 top-1 px-1`}>
                        <div
                          className={`${
                            checking &&
                            jwbtgl.err_tgl3 &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <TextField
                            fullWidth
                            placeholder="Jawab Tanggal 3"
                            value={jwbtgl ? jwbtgl.jwb_tgl3 : ""}
                            name="jwb_tgl3"
                            onChange={(e) => changeTgl(e)}
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                          />
                        </div>
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-0.5 py-0.5 text-slate-800 text-center border border-b">
                    <div
                      className={`relative ${
                        checking &&
                        item.err_noakun &&
                        " bg-red-300 animate-pulse p-0.5"
                      }`}
                    >
                      <Droppable
                        droppableId={
                          "dst_noakun_" + item.uid + "_piutang_" + index
                        }
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`w-full  items-center p-0.5 ${
                              snapshot.isDraggingOver && "bg-slate-100"
                            }`}
                          >
                            {item.jwb_noakun ? (
                              <ItemsDataDragAkun
                                data={
                                  find(dataakun, { uid: item.jwb_noakun })
                                    .noakun
                                }
                                index={index}
                                uid={item.uid}
                              />
                            ) : (
                              <span className="flex opacity-40 w-full justify-center border border-dashed">
                                Drop disini
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                  <td className="px-1 py-1  text-slate-800 border border-b">
                    <div
                      className={`relative ${
                        checking &&
                        item.err_keterangan &&
                        " bg-red-300 animate-pulse p-0.5"
                      }`}
                    >
                      <Droppable
                        droppableId={
                          "dst_keterangan_" + item.uid + "_piutang_" + index
                        }
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`w-full  items-center p-0.5 ${
                              snapshot.isDraggingOver && "bg-slate-100"
                            }`}
                          >
                            {item.jwb_keterangan ? (
                              <ItemsDataDragKet
                                data={
                                  find(dataakun, { uid: item.jwb_keterangan })
                                    .keterangan
                                }
                                index={index}
                                uid={item.uid}
                              />
                            ) : (
                              <span className="flex items-center justify-center opacity-40 w-full border border-dashed">
                                Drop disini
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    &nbsp;
                  </td>
                  <td className="py-0 text-slate-800 text-center border border-b">
                    {item.posisi === "debet" ? (
                      <div
                        className={`relative -mb-1 ${
                          checking &&
                          item.err_jumlah &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          fullWidth
                          placeholder="Jawab jumlah"
                          value={item.jwb_jumlah === 0 ? "" : item.jwb_jumlah}
                          onChange={(e) => handleInputJwb(e, item.uid)}
                          name="jwb_jumlah"
                          inputProps={{
                            prefix: "Rp ",
                            style: {
                              textAlign: "center",
                            },
                          }}
                          InputProps={{
                            readOnly: checking,
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                        )}
                      </div>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                  <td className="py-0  text-slate-800 text-center border border-b">
                    {item.posisi === "kredit" ? (
                      <div
                        className={`relative -mb-1 ${
                          checking &&
                          item.err_jumlah &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          fullWidth
                          placeholder="Jawab jumlah"
                          value={item.jwb_jumlah === 0 ? "" : item.jwb_jumlah}
                          onChange={(e) => handleInputJwb(e, item.uid)}
                          name="jwb_jumlah"
                          inputProps={{
                            prefix: "Rp ",
                            style: {
                              textAlign: "center",
                            },
                          }}
                          InputProps={{
                            readOnly: checking,
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                        {!checking && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                        )}
                      </div>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
