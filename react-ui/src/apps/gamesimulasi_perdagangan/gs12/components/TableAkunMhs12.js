import { Droppable } from "react-beautiful-dnd";
import ItemsDataDragAkun from "./ItemsDataDragAkun";
import ItemsDataDragKet from "./ItemsDataDragKet";

export default function TableAkunMhs12(props) {
  const { jwbdata } = props;

  return (
    <>
      <h2 className="mt-2 font-medium text-base">Data Akun</h2>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="min-w-10v max-w-10v py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
              No. Akun
            </th>
            <th className="min-w-25v max-w-25v py-2 font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
              Keterangan
            </th>
          </tr>
        </thead>
        <tbody>
          {jwbdata &&
            jwbdata.map((item, i) => {
              return (
                <tr key={i}>
                  <td className="py-0.5 px-1 min-w-10v max-w-10v text-center border border-slate-300 table-cell">
                    <Droppable droppableId={"src_noakun_" + item.uid + "_" + i}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-slate-100"
                          }`}
                        >
                          {item.soal_noakun ? (
                            <ItemsDataDragAkun
                              data={item.noakun}
                              index={i}
                              uid={item.uid}
                            />
                          ) : (
                            <span className="opacity-40 w-full text-center p-1 border border-dashed">
                              {item.noakun}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>
                  <td className="py-0.5 px-0.5 min-w-25v max-w-25v text-left border border-slate-300 table-cell">
                    <Droppable
                      droppableId={"src_keterangan_" + item.uid + "_" + i}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-full items-center p-0.5 ${
                            snapshot.isDraggingOver && "bg-slate-100"
                          }`}
                        >
                          {item.soal_keterangan ? (
                            <ItemsDataDragKet
                              data={item.keterangan}
                              index={i}
                              uid={item.uid}
                            />
                          ) : (
                            <div className="opacity-40 min-w-25v max-w-25v px-1 border border-dashed">
                              {item.keterangan}
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}
