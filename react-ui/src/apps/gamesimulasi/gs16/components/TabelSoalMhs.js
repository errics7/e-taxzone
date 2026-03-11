import { Droppable } from "react-beautiful-dnd";
import ItemsDataGs16 from "./ItemsDataGs16";

export default function TabelSoalMhs(props) {
  const { dataSoal, dataConfig } = props;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="bg-white">
      <div className="flex items-center">
        <div
          className={`mx-auto text-xl relative ${
            !dataConfig &&
            " bg-slate-100 rounded-md animate-pulse min-w-20v h-7"
          }`}
        >
          {dataConfig && dataConfig.titlesoal}
        </div>
      </div>
      <div className="mt-2 mb-3">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="min-w-25v border border-slate-300 "></th>
              <th className="min-w-10v max-w-10v border border-slate-300 p-2 table-cell">
                Unit Produksi
              </th>
            </tr>
          </thead>
          <tbody>
            {dataSoal.map((items, index) => {
              return (
                <tr key={index}>
                  <td className="p-1 border relative table-cell">
                    <div className="pl-2 py-1 text-base">{items.alias}</div>
                  </td>
                  <td className="p-0.5 border min-w-15v max-w-15v text-base text-right px-3">
                    <div>
                      <Droppable droppableId={"src_soal_" + items.uuid}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex w-full items-stretch p-0.5"
                          >
                            {/* IItems */}
                            {!items.used ? (
                              <ItemsDataGs16
                                data={toRp(items.value)}
                                index={index}
                                addon={items.uuid}
                              />
                            ) : (
                              <span className="border w-full opacity-30">
                                {toRp(items.value)}
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
