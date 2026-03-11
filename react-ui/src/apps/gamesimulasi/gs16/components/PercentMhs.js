import { Droppable } from "react-beautiful-dnd";
import ItemsDataGs16 from "./ItemsDataGs16";

export default function PercentMhs(props) {
  const dataConfig = props.dataConfig;
  const dataPerecent = props.dataPerecent;

  return (
    <div>
      <div className="flex items-center">
        <div
          className={`mx-auto text-xl relative ${
            !dataConfig && " bg-slate-100 rounded-md animate-pulse min-w-20v h-7"
          }`}
        >
          {dataConfig && dataConfig.titelpercent}
        </div>
      </div>
      <div className="mt-2 mb-3">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="min-w-25v border border-slate-300 "></th>
              <th className="border border-slate-300 p-2 table-cell">BBB</th>
              <th className="border border-slate-300 p-2 table-cell">BTKL</th>
              <th className="border border-slate-300 p-2 table-cell">BOP</th>
            </tr>
          </thead>
          <tbody>
            {dataPerecent.map((items, index) => {
              // console.log("d", items);
              return (
                <tr key={index}>
                  <td className="p-1 border relative">
                    <div className="pl-2 py-1 text-base">{items.alias}</div>
                  </td>
                  <td className="p-1 border w-24">
                    <div className="flex items-center">
                      {/* <span className="mx-auto">{items.bbb}%</span> */}
                      <Droppable droppableId={"src_bbb_" + items.uuid}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex w-full items-stretch p-0.5"
                          >
                            {/* IItems */}
                            {!items.usedbbb ? (
                              <ItemsDataGs16
                                data={items.bbb + "%"}
                                index={index}
                                addon={items.uuid + "_bbb"}
                              />
                            ) : (
                              <span className="border mx-auto opacity-40">
                                {items.bbb}%
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                  <td className="p-1 border w-24">
                    <div className="flex items-center">
                      {/* <span className="mx-auto">{items.btkl}%</span> */}
                      <Droppable droppableId={"src_btkl_" + items.uuid}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex w-full items-stretch p-0.5"
                          >
                            {/* IItems */}
                            {!items.usedbtkl ? (
                              <ItemsDataGs16
                                data={items.btkl + "%"}
                                index={index}
                                addon={items.uuid + "_btkl"}
                              />
                            ) : (
                              <span className="border mx-auto opacity-40">
                                {items.btkl}%
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                  <td className="p-1 border w-24">
                    <div className="flex items-center">
                      {/* <span className="mx-auto">{items.bop}%</span> */}
                      <Droppable droppableId={"src_bop_" + items.uuid}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex w-full items-stretch p-0.5"
                          >
                            {/* IItems */}
                            {!items.usedbop ? (
                              <ItemsDataGs16
                                data={items.bop + "%"}
                                index={index}
                                addon={items.uuid + "_bop"}
                              />
                            ) : (
                              <span className="border mx-auto opacity-40">
                                {items.bop}%
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
