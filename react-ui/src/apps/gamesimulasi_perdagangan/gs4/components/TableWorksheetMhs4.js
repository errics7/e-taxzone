import makeStyles from "@mui/styles/makeStyles";
import TextField from "@mui/material/TextField";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import { find, sumBy } from "lodash";
import { Droppable } from "react-beautiful-dnd";
import ItemsDataDrag from "../../gs3/component/ItemsDataDrag";
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

function TableWorksheetMhs4(props) {
  const classes = useStyles();
  const { config, jawab1, checking1, done1, jawab2 } = props;

  const updtJwb = (index, e) => {
    const { name, value } = e.target;
    const temp = [...jawab1];
    temp[index][name] = value;

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
        {config && config.subtabel}
      </div>

      <>
        <div className={`mt-3 ${!done1 && " overflow-x-auto"}`}>
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
                  Nama Customer
                </th>
                <th
                  rowSpan="3"
                  className="p-3 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  No. Faktur
                </th>
                <th
                  colSpan="2"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Debet
                </th>
                <th
                  colSpan="3"
                  className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Kredit
                </th>
              </tr>
              <tr>
                <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Piutang Dagang
                </th>
                <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  HPP
                </th>
                <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Penjualan
                </th>
                <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  PPN Keluaran
                </th>
                <th className="p-1 min-w-15v max-w-15v font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Persediaan
                </th>
              </tr>
              <tr>
                {jawab2 &&
                  [
                    "piutangdagang",
                    "hpp",
                    "penjualan",
                    "ppnkeluar",
                    "persediaan",
                  ].map((item, index) => {
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
                  })}
              </tr>
            </thead>
            <tbody>
              {jawab1 &&
                jawab1.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                  >
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      {item.tanggal}
                    </td>
                    <td className="min-w-20v max-w-20v px-1 py-2  text-slate-800 text-center border border-b">
                      {item.buyername}
                    </td>
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      {item.noinvoice}
                    </td>
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      <div
                        className={`relative ${
                          checking1 &&
                          item.err_piutangdagang &&
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
                          placeholder="Jawab Piutang Dagang"
                          name="jwb_piutangdagang"
                          value={item.jwb_piutangdagang}
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
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      <div
                        className={`relative ${
                          checking1 &&
                          item.err_hpp &&
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
                          placeholder="Jawab HPP"
                          name="jwb_hpp"
                          value={item.jwb_hpp}
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
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      <div
                        className={`relative ${
                          checking1 &&
                          item.err_penjualan &&
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
                          placeholder="Jawab Penjualan"
                          name="jwb_penjualan"
                          value={item.jwb_penjualan}
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
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
                      <div
                        className={`relative ${
                          checking1 &&
                          item.err_ppnkeluaran &&
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
                          placeholder="Jawab PPN Keluaran"
                          name="jwb_ppnkeluaran"
                          value={item.jwb_ppnkeluaran}
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
                    <td className="min-w-15v max-w-15v px-1 py-2  text-slate-800 text-center border border-b">
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
                  [
                    "piutangdagang",
                    "hpp",
                    "penjualan",
                    "ppnkeluar",
                    "persediaan",
                  ].map((item, index) => {
                    const dat = find(jawab2, { name: item });
                    var nil = 0;
                    if (item === "piutangdagang")
                      nil = sumBy(jawab1, (x) => Number(x.jwb_piutangdagang));
                    if (item === "hpp")
                      nil = sumBy(jawab1, (x) => Number(x.jwb_hpp));
                    if (item === "penjualan")
                      nil = sumBy(jawab1, (x) => Number(x.jwb_penjualan));
                    if (item === "ppnkeluar")
                      nil = sumBy(jawab1, (x) => Number(x.jwb_ppnkeluaran));
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
                  })}
              </tr>
            </tfoot>
          </table>
        </div>
      </>
      {/* )} */}
    </div>
  );
}

export default TableWorksheetMhs4;
