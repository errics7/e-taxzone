import ItemsDataOther from "./ItemsDataOther";
import { Droppable } from "react-beautiful-dnd";

export default function TabelInfoBahanMhs(props) {
  const dataDrag = props.dataDrag;

  return (
    <>
      <div className="grid grid-cols-12">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"></th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Akutansi
              </th>
              <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Penerima Bahan
              </th>
              <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Bagian Gudang
              </th>
              <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Kepala Bagian
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-t border-slate-300 relative mb-10 lg:mb-0">
              <td className="min-w-10v max-w-10v p-3 text-slate-800 text-left border border-b relative">
                Tanggal
              </td>
              <td className="min-w-10v max-w-10v p-0 text-left border border-b"></td>
              <td className="min-w-10v max-w-10v p-3 text-slate-800 text-center border border-b relative">
                {dataDrag && dataDrag.info_tglpbahan}
              </td>
              <td className="min-w-10v max-w-10v p-0 text-slate-800 text-center border border-b relative">
                <Droppable droppableId={`src_tglbgudang_0`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`inline-block p-1 w-full items-stretch ${
                        snapshot.isDraggingOver && "bg-slate-200"
                      }`}
                    >
                      {dataDrag &&
                        (dataDrag.drag_tglbgudang !== null ? (
                          <ItemsDataOther
                            data={dataDrag.drag_tglbgudang}
                            parparam="tglbgudang"
                            index={0}
                            checker={false}
                          />
                        ) : (
                          <span className="opacity-40">
                            {dataDrag.info_tglbgudang}
                          </span>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </td>
              <td className="min-w-10v max-w-10v px-2 text-slate-800 text-center border border-b relative">
                {dataDrag && dataDrag.info_tglkbagian}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
