import { Grid } from "@mui/material";
import { find } from "lodash";
import { Droppable } from "react-beautiful-dnd";
import ItemsDataSoal from "./ItemsDataSoal";

export default function TabelWorksheetMhs(props) {
  const { cv, jawab, checking } = props;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="p-1">
      {jawab &&
        jawab.map((item, j) => (
          <Grid
            container
            key={j}
            direction="column"
            justifyContent="center"
            alignItems="stretch"
            className="my-3 w-full"
          >
            <div className="p-5 border border-solid ">
              <div className="grid grid-cols-6 gap-0">
                <div className="col-end-7 col-span-2 font-bold">
                  BUKU PEMBANTU {item.jenis === "hutang" ? "HUTANG" : "PIUTANG"}
                </div>
                <div className="col-start-1 col-end-4 text-lg font-bold">
                  <div className="w-auto">{cv}</div>
                </div>
                <div className="col-end-7 col-span-2 flex items-center">
                  <span className="flex-none">
                    Nama {item.jenis === "hutang" ? "Pemasok" : "Pelanggan"} :
                  </span>
                  <div
                    className={`p-1 w-full ${
                      checking && item.err_name && " bg-red-300 animate-pulse"
                    }`}
                  >
                    <Droppable droppableId={"dst_name_" + item.uuid + "_1"}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full  items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-slate-100"
                          }`}
                        >
                          {item.jwb_name ? (
                            <ItemsDataSoal
                              data={find(jawab, { uuid: item.jwb_name }).name}
                              index={j}
                              sec={1}
                            />
                          ) : (
                            <span className="flex opacity-40 w-full text-center border border-dashed">
                              Drop disini
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>

              <div className="border mt-5">
                <table className="border-collapse min-w-full table-fixed">
                  <thead className="font-semibold">
                    <tr>
                      <th
                        rowSpan={2}
                        className="min-w-10v max-w-10v border py-1"
                      >
                        Tanggal
                      </th>
                      <th
                        rowSpan={2}
                        className="min-w-10v max-w-10v border py-1"
                      >
                        Keterangan
                      </th>
                      <th
                        rowSpan={2}
                        className="min-w-10v max-w-10v border py-1"
                      >
                        Ref.
                      </th>
                      <th
                        rowSpan={2}
                        className="min-w-15v max-w-15v border py-1"
                      >
                        Debet (Rp)
                      </th>
                      <th
                        rowSpan={2}
                        className="min-w-15v max-w-15v border py-1"
                      >
                        Kredit (Rp)
                      </th>
                      <th
                        colSpan={2}
                        className="min-w-15v max-w-15v border py-1"
                      >
                        Saldo
                      </th>
                    </tr>
                    <tr>
                      <th className="min-w-15v max-w-15v border py-1">Debet</th>
                      <th className="min-w-15v max-w-15v border py-1">
                        Kredit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="min-w-10v max-w-10v border py-1.5 text-center">
                        {item.tgl_worksheet}
                      </td>
                      <td className="min-w-10v max-w-10v border py-1.5 text-center">
                        Saldo Awal
                      </td>
                      <td className="min-w-15v max-w-15v border py-1.5 text-center"></td>
                      <td className="min-w-15v max-w-15v border py-1.5">
                        &nbsp;
                      </td>
                      <td className="min-w-15v max-w-15v border py-1.5">
                        &nbsp;
                      </td>
                      <td
                        className={`min-w-15v max-w-15v border py-1.5 ${
                          checking &&
                          !item.jwb_jumlah_debit &&
                          !item.jwb_jumlah_kredit &&
                          " bg-red-300 animate-pulse"
                        } ${
                          checking &&
                          item.err_jumlah &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Droppable
                          droppableId={"dst_jumlah_" + item.uuid + "_debit_1"}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`w-full items-center p-0.5 ${
                                snapshot.isDraggingOver && "bg-slate-100"
                              }`}
                            >
                              {item.jwb_jumlah_debit ? (
                                <ItemsDataSoal
                                  data={toRp(
                                    find(jawab, { uuid: item.jwb_jumlah_debit })
                                      .jumlah
                                  )}
                                  index={j}
                                  sec={1}
                                />
                              ) : (
                                <span className="flex opacity-40 w-full text-center p-1 border border-dashed">
                                  {!item.jwb_jumlah_kredit && "Drop disini"}
                                </span>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </td>
                      <td
                        className={`min-w-15v max-w-15v border py-1.5 ${
                          checking &&
                          !item.jwb_jumlah_debit &&
                          !item.jwb_jumlah_kredit &&
                          " bg-red-300 animate-pulse"
                        } ${
                          checking &&
                          item.err_jumlah &&
                          " bg-red-300 animate-pulse"
                        }`}
                      >
                        <Droppable
                          droppableId={"dst_jumlah_" + item.uuid + "_kredit_1"}
                        >
                          {(provided, snapshot) => {
                            // console.log(provided);
                            // console.log(snapshot);
                            // console.log("snap:", item);
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`w-full items-center p-0.5 ${
                                  snapshot.isDraggingOver && "bg-slate-100"
                                }`}
                              >
                                {item.jwb_jumlah_kredit ? (
                                  <ItemsDataSoal
                                    data={toRp(
                                      find(jawab, {
                                        uuid: item.jwb_jumlah_kredit,
                                      }).jumlah
                                    )}
                                    index={j}
                                    sec={1}
                                  />
                                ) : (
                                  <span className="flex opacity-40 w-full text-center p-1 border border-dashed">
                                    {!item.jwb_jumlah_debit && "Drop disini"}
                                  </span>
                                )}
                                {provided.placeholder}
                              </div>
                            );
                          }}
                        </Droppable>
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td className="min-w-10v max-w-10v border py-1.5">
                        &nbsp;
                      </td>
                      <td className="min-w-10v max-w-10v border py-1.5">
                        &nbsp;
                      </td>
                      <td className="min-w-15v max-w-15v border py-1.5">
                        &nbsp;
                      </td>
                      <td className="min-w-15v max-w-15v border py-1.5">
                        &nbsp;
                      </td>
                      <td className="min-w-15v max-w-15v border py-1.5">
                        &nbsp;
                      </td>
                      <td className="min-w-15v max-w-15v border py-1.5">
                        &nbsp;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Grid>
        ))}
    </div>
  );
}
