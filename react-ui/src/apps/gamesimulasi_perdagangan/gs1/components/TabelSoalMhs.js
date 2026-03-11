import { sumBy, filter } from "lodash";
import ItemsDataSoal from "./ItemsDataSoal";
import { Droppable } from "react-beautiful-dnd";

export default function TabelSoalMhs(props) {
  const { data, narasi, jawab } = props;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <>
      <div className="mt-2 mx-2 relative">{narasi}</div>

      <div className="mt-3">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200 ">
                Tanggal Beli
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200 ">
                Pemasok
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200 ">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            {jawab &&
              filter(jawab, { jenis: "hutang" }).map((item, index) => (
                <tr key={index} className="bg-white border-t border-slate-300">
                  <td className="min-w-15v max-w-15v p-1 text-slate-800 text-center border border-b  relative">
                    <span className="w-full text-center p-1">{item.tgl}</span>
                    {/* <Droppable droppableId={"src_tgl_" + item.uuid + "_1"}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-slate-100"
                          }`}
                        >
                          {item.soal_tgl ? (
                            <ItemsDataSoal
                              data={item.soal_tgl}
                              index={index}
                              sec={1}
                            />
                          ) : (
                            <span className="opacity-40 w-full text-center p-1 border border-dashed">
                              {item.tgl}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable> */}
                  </td>
                  <td className="min-w-15v max-w-15v p-1 text-slate-800 text-center border border-b  relative">
                    <Droppable droppableId={"src_name_" + item.uuid + "_1"}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-slate-100"
                          }`}
                        >
                          {item.soal_name ? (
                            <ItemsDataSoal
                              data={item.soal_name}
                              index={index}
                              sec={1}
                            />
                          ) : (
                            <span className="opacity-40 w-full text-center p-1 border border-dashed">
                              {item.name}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>

                  <td className="min-w-15v max-w-15v p-1  text-slate-800 text-center border border-b  relative">
                    <Droppable droppableId={"src_jumlah_" + item.uuid + "_1"}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-slate-100"
                          }`}
                        >
                          {item.soal_jumlah ? (
                            <ItemsDataSoal
                              data={toRp(item.soal_jumlah)}
                              index={index}
                              sec={1}
                            />
                          ) : (
                            <span className="opacity-40 w-full text-center p-1 border border-dashed">
                              {toRp(item.jumlah)}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>
                </tr>
              ))}
            <tr className="bg-white border-t border-slate-300 font-semibold">
              <td
                colSpan={2}
                className="p-1 text-slate-800 text-center border border-b  relative"
              >
                Jumlah
              </td>
              <td className="min-w-15v max-w-15v p-1  text-slate-800 text-center border border-b  relative">
                <div className="relative">
                  {toRp(
                    sumBy(filter(data, { jenis: "hutang" }), (r) =>
                      Number(r.jumlah)
                    )
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-5 mb-3">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200">
                Tanggal Jual
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200">
                Pelanggan
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-200">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            {jawab &&
              filter(jawab, { jenis: "piutang" }).map((item, index) => (
                <tr key={index} className="bg-white border-t border-slate-300">
                  <td className="min-w-15v max-w-15v p-1 text-slate-800 text-center border border-b  relative">
                    <span className="w-full text-center p-1">{item.tgl}</span>
                    {/* <Droppable droppableId={"src_tgl_" + item.uuid + "_2"}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-slate-100"
                          }`}
                        >
                          {item.soal_tgl ? (
                            <ItemsDataSoal
                              data={item.soal_tgl}
                              index={index}
                              sec={2}
                            />
                          ) : (
                            <span className="opacity-40 w-full text-center p-1 border border-dashed">
                              {item.tgl}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable> */}
                  </td>
                  <td className="min-w-15v max-w-15v p-1 text-slate-800 text-center border border-b  relative">
                    <Droppable droppableId={"src_name_" + item.uuid + "_2"}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-slate-100"
                          }`}
                        >
                          {item.soal_name ? (
                            <ItemsDataSoal
                              data={item.soal_name}
                              index={index}
                              sec={2}
                            />
                          ) : (
                            <span className="opacity-40 w-full text-center p-1 border border-dashed">
                              {item.name}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>
                  <td className="min-w-15v max-w-15v p-1  text-slate-800 text-center border border-b  relative">
                    <Droppable droppableId={"src_jumlah_" + item.uuid + "_2"}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-slate-100"
                          }`}
                        >
                          {item.soal_jumlah ? (
                            <ItemsDataSoal
                              data={toRp(item.soal_jumlah)}
                              index={index}
                              sec={2}
                            />
                          ) : (
                            <span className="opacity-40 w-full text-center p-1 border border-dashed">
                              {toRp(item.jumlah)}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>
                </tr>
              ))}
            <tr className="bg-white border-t border-slate-300 font-semibold">
              <td
                colSpan={2}
                className="p-1 text-slate-800 text-center border border-b"
              >
                Jumlah
              </td>
              <td className="min-w-15v max-w-15v p-1  text-slate-800 text-center border border-b">
                <div className="relative">
                  {toRp(
                    sumBy(filter(data, { jenis: "piutang" }), (r) =>
                      Number(r.jumlah)
                    )
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
