import { Droppable } from "react-beautiful-dnd";
import ItemsDataBaseGs10 from "./ItemsDataBaseGs10";
import { ShimmerTable } from "react-shimmer-effects";

export default function MhsDataAkun(props) {
  const { data, valid } = props;

  return (
    <div className="w-full relative ">
      <div className="opacity-50 italic font-semibold">Data (soal)</div>
      <div className="w-full">
        <span className="py-1 text-center block">Data Akun</span>
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="w-1/5 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
                Kode
              </th>
              <th className="w-3/5 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 hidden lg:table-cell">
                Nama Akun
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((itm, i) => (
              <tr key={i}>
                <td className="p-2 text-center border border-slate-300 table-cell">
                  {valid.check && valid.pass ? (
                    <Droppable droppableId={`src_kode_${i}`}>
                      {(provided, snapshot) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="inline-block w-full items-stretch"
                        >
                          {itm.code_dnd ? (
                            <ItemsDataBaseGs10
                              data={itm.code_dnd}
                              addon={"akun"}
                              index={i}
                              checker={false}
                            />
                          ) : (
                            <span className="opacity-30">{itm.code}</span>
                          )}

                          {provided.placeholder}
                        </span>
                      )}
                    </Droppable>
                  ) : (
                    <>{itm.code}</>
                  )}
                </td>
                <td className="p-2 text-left border border-slate-300 table-cell">
                  {itm.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <ShimmerTable row={2} col={2} />}
        <br />
      </div>
    </div>
  );
}
