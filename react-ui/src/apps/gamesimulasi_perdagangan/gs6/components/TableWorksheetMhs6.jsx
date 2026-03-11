import React, { forwardRef } from "react";
import { makeStyles } from "@mui/styles";
import NumberFormat from "react-number-format";
import { find, sumBy } from "lodash";
import { Droppable } from "react-beautiful-dnd";
import ItemsDataDrag from "../../gs3/component/ItemsDataDrag";
import { TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

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
      prefix="Rp "
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

const useStyles = makeStyles((theme) => ({
  inputtext: {
    paddingLeft: "2px",
    paddingRight: "2px",
  },
}));

const TableWorksheetMhs6 = (props) => {
  const classes = useStyles();
  const { config, jawab1, checking1, done1, jawab2 } = props;

  const updtJwb = (index, e) => {
    const { name, value } = e.target;
    const temp = [...jawab1];
    temp[index][name] = Number(value);

    props.setJawab1(temp);
  };

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="relative">
      <div className="mx-auto mb-1 flex items-center justify-center text-xl font-semibold uppercase">
        {config && config.cvname}
      </div>
      <div className="mx-auto mb-1 flex items-center justify-center text-xl font-semibold uppercase">
        Jurnal Penjualan
      </div>
      <div className="mx-auto mb-1 flex items-center justify-center text-xl font-semibold tracking-wider uppercase">
        {config && config.tblworkname}
      </div>

      <>
        <div className={`mt-3 pb-3 ${!done1 && " overflow-x-auto"}`}>
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th
                  rowSpan="3"
                  className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Tanggal
                </th>
                <th
                  rowSpan="3"
                  className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Keterangan
                </th>
                <th
                  rowSpan="3"
                  className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  No. BKK
                </th>
                <th
                  colSpan="3"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Debet
                </th>
                <th
                  colSpan="1"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Kredit
                </th>
              </tr>
              <tr>
                <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Persediaan
                </th>
                <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  PPN Masukan
                </th>
                <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Beban Gaji
                </th>
                <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kas
                </th>
              </tr>
              <tr>
                {jawab2 &&
                  ["persediaan", "ppnmasukan", "bebangaji", "kas"].map(
                    (item, index) => {
                      const dat = find(jawab2, { name: item });
                      return (
                        <th
                          key={index}
                          className={`p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300 ${
                            done1 &&
                            dat.soal_noakun &&
                            " bg-amber-600 bg-opacity-20"
                          }`}
                        >
                          {done1 ? (
                            <>
                              <Droppable
                                droppableId={
                                  "src_noakun_" +
                                  dat.name +
                                  "_" +
                                  dat.uuid +
                                  "_" +
                                  index
                                }
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`w-full items-center p-0.5 ${
                                      snapshot.isDraggingOver && "bg-slate-100"
                                    }`}
                                  >
                                    {dat.soal_noakun ? (
                                      <ItemsDataDrag
                                        data={dat.noakun}
                                        index={index}
                                        uid={dat.uuid}
                                      />
                                    ) : (
                                      <span className="opacity-40 w-full text-center p-1 border border-dashed">
                                        {dat.noakun}
                                      </span>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </>
                          ) : (
                            dat.noakun
                          )}
                        </th>
                      );
                    }
                  )}
              </tr>
            </thead>
            <tbody>
              {jawab1 &&
                jawab1.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-t border-slate-300 "
                  >
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      {item.tgl}
                    </td>
                    <td className="min-w-20v max-w-20v px-1 py-2  text-slate-800 text-center border border-b">
                      {item.keterangan}
                    </td>
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      {item.no}
                    </td>
                    <td className="min-w-17v max-w-17v px-1 py-2  text-slate-800 text-center border border-b">
                      {item.type === "kontan" ? (
                        <div
                          className={`relative ${
                            checking1 &&
                            item.err_persediaan &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <TextField
                            className={classes.inputtext}
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                            placeholder="Jawab Persediaan"
                            name="jwb_persediaan"
                            value={item.jwb_persediaan}
                            onChange={(e) => updtJwb(index, e)}
                            InputProps={{
                              readOnly: done1,
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                          {!done1 && (
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute opacity-20 -inset-y-1 right-0"
                            />
                          )}
                        </div>
                      ) : (
                        <div />
                      )}
                    </td>
                    <td className="min-w-17v max-w-17v px-1 py-2  text-slate-800 text-center border border-b">
                      {item.type === "kontan" ? (
                        <div
                          className={`relative ${
                            checking1 &&
                            item.err_ppn &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <TextField
                            className={classes.inputtext}
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                            placeholder="Jawab PPN"
                            name="jwb_ppn"
                            value={item.jwb_ppn}
                            onChange={(e) => updtJwb(index, e)}
                            InputProps={{
                              readOnly: done1,
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                          {!done1 && (
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute opacity-20 -inset-y-1 right-0"
                            />
                          )}
                        </div>
                      ) : (
                        <>&nbsp;</>
                      )}
                    </td>
                    <td className="min-w-17v max-w-17v px-1 py-2  text-slate-800 text-center border border-b">
                      {item.type === "kas" ? (
                        <div
                          className={`relative ${
                            checking1 &&
                            item.err_bebangaji &&
                            " bg-red-300 animate-pulse"
                          }`}
                        >
                          <TextField
                            className={classes.inputtext}
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                            placeholder="Jawab Beban Gaji"
                            name="jwb_bebangaji"
                            value={item.jwb_bebangaji}
                            onChange={(e) => updtJwb(index, e)}
                            InputProps={{
                              readOnly: done1,
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                          {!done1 && (
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 absolute opacity-20 -inset-y-1 right-0"
                            />
                          )}
                        </div>
                      ) : (
                        <>&nbsp;</>
                      )}
                    </td>
                    <td className="min-w-17v max-w-17v px-1 py-2  text-slate-800 text-center border border-b">
                      <div
                        className={`relative ${
                          checking1 &&
                          item.err_kas &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          className={classes.inputtext}
                          inputProps={{
                            style: {
                              textAlign: "center",
                            },
                          }}
                          placeholder="Jawab Kas"
                          name="jwb_kas"
                          value={item.jwb_kas}
                          onChange={(e) => updtJwb(index, e)}
                          InputProps={{
                            readOnly: done1,
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                        {!done1 && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute opacity-20 -inset-y-1 right-0"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan="3"
                  className="px-1 py-2 bg-slate-50 text-slate-600 border text-center"
                >
                  Jumlah
                </td>
                {jawab2 &&
                  ["persediaan", "ppnmasukan", "bebangaji", "kas"].map(
                    (item, index) => {
                      const dat = find(jawab2, { name: item });
                      var nil = 0;
                      if (item === "kas")
                        nil = sumBy(jawab1, (x) => Number(x.jwb_kas));
                      if (item === "bebangaji")
                        nil = sumBy(jawab1, (x) => Number(x.jwb_bebangaji));
                      if (item === "ppnmasukan")
                        nil = sumBy(jawab1, (x) => Number(x.jwb_ppn));
                      if (item === "persediaan")
                        nil = sumBy(jawab1, (x) => Number(x.jwb_persediaan));

                      return (
                        <th
                          key={index}
                          className={`p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300 ${
                            done1 &&
                            dat.soal_jumlah &&
                            " bg-amber-600 bg-opacity-20"
                          }`}
                        >
                          {done1 ? (
                            <>
                              <Droppable
                                droppableId={
                                  "src_jumlah_" +
                                  dat.name +
                                  "_" +
                                  dat.uuid +
                                  "_" +
                                  index
                                }
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`w-full items-center p-0.5 ${
                                      snapshot.isDraggingOver && "bg-slate-100"
                                    }`}
                                  >
                                    {dat.soal_jumlah ? (
                                      <ItemsDataDrag
                                        data={toRp(dat.jumlah)}
                                        index={index}
                                        uid={dat.uuid}
                                      />
                                    ) : (
                                      <span className="opacity-40 w-full text-center p-1 border border-dashed">
                                        {toRp(dat.jumlah)}
                                      </span>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </>
                          ) : (
                            toRp(nil)
                          )}
                        </th>
                      );
                    }
                  )}
              </tr>
            </tfoot>
          </table>
        </div>
      </>
      {/* )} */}
    </div>
  );
};

export default TableWorksheetMhs6;
