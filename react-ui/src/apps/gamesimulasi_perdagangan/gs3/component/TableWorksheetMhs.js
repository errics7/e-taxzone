import makeStyles from "@mui/styles/makeStyles";
import TextField from "@mui/material/TextField";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import { find, sumBy } from "lodash";
import { Droppable } from "react-beautiful-dnd";
import ItemsDataDrag from "./ItemsDataDrag";
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
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

const useStyles = makeStyles((theme) => ({
  inputtext: {
    paddingLeft: "2px",
    paddingRight: "2px",
  },
}));

function TableWorksheetMhs(props) {
  const classes = useStyles();
  const { config, jawab, checking1, done1, jawab2 } = props;

  const updtJwb = (index, name, val) => {
    const temp = [...jawab];
    const updt = temp.map((el, i) =>
      index === i
        ? {
            ...el,
            [name]: val,
          }
        : el
    );
    props.setJawab(updt);
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
        Jurnal Pembelian
      </div>
      <div className="mx-auto mb-1 flex items-center justify-center text-xl font-semibold tracking-wider uppercase">
        {config && config.subtable}
      </div>

      <>
        <div className={`mt-3 ${!done1 && " overflow-x-auto"}`}>
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th
                  rowSpan="3"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Tanggal
                </th>
                <th
                  rowSpan="3"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Nama Pemasok
                </th>
                <th
                  rowSpan="3"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  No. Faktur
                </th>
                <th
                  colSpan={2}
                  className="min-w-1/4 max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Debet
                </th>
                <th className="min-w-1/4 max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kredit
                </th>
              </tr>
              <tr>
                {["persediaan", "ppnmasukan", "hutangdagang"].map(
                  (item, index) => {
                    const dat = find(jawab2, {
                      name: item,
                    });
                    return (
                      <th
                        key={index}
                        className="min-w-1/4 max-w-10v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                      >
                        {dat && dat.alias}
                      </th>
                    );
                  }
                )}
              </tr>
              <tr>
                {jawab2 &&
                  ["persediaan", "ppnmasukan", "hutangdagang"].map(
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
                            dat?.noakun
                          )}
                        </th>
                      );
                    }
                  )}
              </tr>
            </thead>
            <tbody>
              {jawab &&
                jawab.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                  >
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      <div
                        className={`relative ${
                          checking1 &&
                          item.err_tgl &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          className={classes.inputtext}
                          InputProps={{ readOnly: done1 }}
                          inputProps={{
                            style: {
                              paddingLeft: 5,
                            },
                          }}
                          placeholder="Jawab Tanggal"
                          value={item.jwb_tgl}
                          onChange={(e) =>
                            updtJwb(index, "jwb_tgl", e.target.value)
                          }
                        />

                        {!done1 && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute opacity-20 -inset-y-1 right-0"
                          />
                        )}
                      </div>
                    </td>
                    <td className="min-w-20v max-w-20v px-1 py-2  text-slate-800 text-center border border-b">
                      <div
                        className={`relative ${
                          checking1 &&
                          item.err_nama &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          fullWidth
                          InputProps={{ readOnly: done1 }}
                          className={classes.inputtext}
                          placeholder="Jawab Nama Pemasok"
                          value={item.jwb_nama}
                          onChange={(e) =>
                            updtJwb(index, "jwb_nama", e.target.value)
                          }
                        />
                        {!done1 && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute opacity-20 -inset-y-1 right-0"
                          />
                        )}
                      </div>
                    </td>
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      <div
                        className={`relative ${
                          checking1 &&
                          item.err_faktur &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          className={classes.inputtext}
                          InputProps={{ readOnly: done1 }}
                          inputProps={{
                            style: {
                              textAlign: "center",
                            },
                          }}
                          placeholder="Jawab No.Faktur"
                          value={item.jwb_faktur}
                          onChange={(e) =>
                            updtJwb(index, "jwb_faktur", e.target.value)
                          }
                        />
                        {!done1 && (
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute opacity-20 -inset-y-1 right-0"
                          />
                        )}
                      </div>
                    </td>
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      <div
                        className={`relative ${
                          checking1 &&
                          item.err_persediaan &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          fullWidth
                          className={classes.inputtext}
                          inputProps={{
                            style: {
                              textAlign: "center",
                            },
                          }}
                          placeholder="Jawab Persediaan"
                          name="jwb_persediaan"
                          value={item.jwb_persediaan}
                          onChange={(e) =>
                            updtJwb(index, "jwb_persediaan", e.target.value)
                          }
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
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      <div
                        className={`relative ${
                          checking1 &&
                          item.err_ppn &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          fullWidth
                          className={classes.inputtext}
                          inputProps={{
                            style: {
                              textAlign: "center",
                            },
                          }}
                          placeholder="Jawab PPN Masukan"
                          name="jwb_ppn"
                          value={item.jwb_ppn}
                          onChange={(e) =>
                            updtJwb(index, "jwb_ppn", e.target.value)
                          }
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
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      <div
                        className={`relative ${
                          checking1 &&
                          item.err_hutangdag &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <TextField
                          fullWidth
                          className={classes.inputtext}
                          inputProps={{
                            style: {
                              textAlign: "center",
                            },
                          }}
                          placeholder="Jawab Hutang Dagang"
                          name="jwb_hutangdag"
                          value={item.jwb_hutangdag}
                          onChange={(e) =>
                            updtJwb(index, "jwb_hutangdag", e.target.value)
                          }
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
                  ["persediaan", "ppnmasukan", "hutangdagang"].map(
                    (item, index) => {
                      const dat = find(jawab2, { name: item });
                      var nil = 0;
                      if (item === "persediaan")
                        nil = sumBy(jawab, (x) => Number(x.jwb_persediaan));
                      if (item === "ppnmasukan")
                        nil = sumBy(jawab, (x) => Number(x.jwb_ppn));
                      if (item === "hutangdagang")
                        nil = sumBy(jawab, (x) => Number(x.jwb_hutangdag));

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
}

export default TableWorksheetMhs;
