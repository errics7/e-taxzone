import { find, map, sum } from "lodash";
import { Droppable } from "react-beautiful-dnd";
import ItemsDataDrag from "../../gs3/component/ItemsDataDrag";

function TableWorksheetRekapMhs4(props) {
  const { jawab2, checking } = props;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const allsubnoakun = () => {
    const res = [];
    jawab2.forEach((element) => {
      if (element.soal_noakun === null) {
        res.push(true);
      } else {
        res.push(false);
      }
    });
    return res.every((x) => x === true);
  };
  const allsubjumlah = () => {
    const res = [];
    jawab2.forEach((element) => {
      if (element.soal_jumlah === null) {
        res.push(true);
      } else {
        res.push(false);
      }
    });
    return res.every((x) => x === true);
  };

  return (
    <div>
      <table className="border-collapse table-fixed">
        <thead>
          <tr>
            <th
              colSpan="4"
              className="p-2 font-bold capitalize bg-slate-50 text-slate-600 border border-slate-300"
            >
              Rekapitulasi
            </th>
          </tr>
          <tr>
            <th
              colSpan="2"
              className="p-1 capitalize font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Debit
            </th>
            <th
              colSpan="2"
              className="p-1 capitalize font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Kredit
            </th>
          </tr>
          <tr>
            <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              No. Akun
            </th>
            <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Total
            </th>
            <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              No. Akun
            </th>
            <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {jawab2 &&
            jawab2.map((item, index) => (
              <tr key={index} className="bg-white border-t border-slate-300 ">
                <td className="min-w-15v max-w-15v px-0.5 py-2  text-slate-800 text-center border border-b">
                  <div
                    className={`relative ${
                      checking &&
                      item.err_noakun_debit &&
                      " bg-red-300 animate-pulse"
                    }`}
                  >
                    <Droppable
                      droppableId={
                        "dst_noakun_debit_" + item.uuid + "_" + index
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
                          {item.jwb_noakun_debit ? (
                            <ItemsDataDrag
                              data={
                                find(jawab2, { uuid: item.jwb_noakun_debit })
                                  .noakun
                              }
                              index={index}
                              uid={item.uuid}
                            />
                          ) : !allsubnoakun() ? (
                            <span className="flex opacity-40 w-full text-center border border-dashed">
                              Drop disini
                            </span>
                          ) : (
                            <>&nbsp;</>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </td>
                <td className="min-w-20v max-w-20v px-0.5 py-2  text-slate-800 text-center border border-b">
                  <div
                    className={`relative ${
                      checking &&
                      item.err_jumlah_debit &&
                      " bg-red-300 animate-pulse"
                    }`}
                  >
                    <Droppable
                      droppableId={
                        "dst_jumlah_debit_" + item.uuid + "_" + index
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
                          {item.jwb_jumlah_debit ? (
                            <ItemsDataDrag
                              data={toRp(
                                find(jawab2, { uuid: item.jwb_jumlah_debit })
                                  .jumlah
                              )}
                              index={index}
                              uid={item.uuid}
                            />
                          ) : !allsubjumlah() ? (
                            <span className="flex opacity-40 w-full text-center border border-dashed">
                              Drop disini
                            </span>
                          ) : (
                            <>&nbsp;</>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </td>
                <td className="min-w-15v max-w-15v px-0.5 py-2  text-slate-800 text-center border border-b">
                  <div
                    className={`relative ${
                      checking &&
                      item.err_noakun_kredit &&
                      " bg-red-300 animate-pulse"
                    }`}
                  >
                    <Droppable
                      droppableId={
                        "dst_noakun_kredit_" + item.uuid + "_" + index
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
                          {item.jwb_noakun_kredit ? (
                            <ItemsDataDrag
                              data={
                                find(jawab2, { uuid: item.jwb_noakun_kredit })
                                  .noakun
                              }
                              index={index}
                              uid={item.uuid}
                            />
                          ) : !allsubnoakun() ? (
                            <span className="flex opacity-40 w-full text-center border border-dashed">
                              Drop disini
                            </span>
                          ) : (
                            <>&nbsp;</>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </td>
                <td className="min-w-20v max-w-20v px-0.5 py-2  text-slate-800 text-center border border-b">
                  <div
                    className={`relative ${
                      checking &&
                      item.err_jumlah_kredit &&
                      " bg-red-300 animate-pulse"
                    }`}
                  >
                    <Droppable
                      droppableId={
                        "dst_jumlah_kredit_" + item.uuid + "_" + index
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
                          {item.jwb_jumlah_kredit ? (
                            <ItemsDataDrag
                              data={toRp(
                                find(jawab2, { uuid: item.jwb_jumlah_kredit })
                                  .jumlah
                              )}
                              index={index}
                              uid={item.uuid}
                            />
                          ) : !allsubjumlah() ? (
                            <span className="flex opacity-40 w-full text-center border border-dashed">
                              Drop disini
                            </span>
                          ) : (
                            <>&nbsp;</>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
        <tbody>
          <tr className="bg-white border-t border-slate-300">
            <td className="min-w-15v max-w-15v px-0.5 py-2 font-semibold text-slate-800 text-center border border-b">
              TOTAL
            </td>
            <td className="min-w-20v max-w-20v px-0.5 py-2  text-slate-800 text-center border border-b">
              {toRp(
                sum(
                  map(jawab2, (x) => {
                    const r = find(jawab2, { uuid: x.jwb_jumlah_debit });
                    return r ? r.jumlah : 0;
                  })
                )
              )}
            </td>
            <td className="min-w-15v max-w-15v px-0.5 py-2 font-semibold text-slate-800 text-center border border-b">
              TOTAL
            </td>
            <td className="min-w-20v max-w-20v px-0.5 py-2  text-slate-800 text-center border border-b">
              {toRp(
                sum(
                  map(jawab2, (x) => {
                    const r = find(jawab2, { uuid: x.jwb_jumlah_kredit });
                    return r ? r.jumlah : 0;
                  })
                )
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TableWorksheetRekapMhs4;
