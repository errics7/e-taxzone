import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Itemsharga from "./itemsharga";

export default function DataRowNeracaSaldo(props) {
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };
  //
  const { itemss, checking } = props;
  const uid = uuidv4();
  const datanilai = toRp(itemss.nominal);

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const idsource = source.droppableId.split("_");
    const iddest = destination.droppableId.split("_");
    //
    if (idsource[0] !== iddest[0]) {
      // check kondisi benar salah
      props.setData(iddest[0]);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <tr>
        <th className="min-w-10v max-w-10v border py-1">
          <span className="m-1 py-1"> {itemss.code}</span>
        </th>
        <th className="min-w-20v max-w-20v border py-1">
          <span className="m-1 py-1">{itemss.name}</span>
        </th>
        <th className="min-w-15v max-w-15v border py-1">
          <Droppable droppableId={`_${uid}_${props.indexd}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`grow p-1 ${
                  snapshot.isDraggingOver && "bg-slate-100"
                }`}
              >
                {itemss.info === "" && (
                  <Itemsharga
                    data={datanilai}
                    stat={itemss.benar}
                    checker={checking}
                    idd={uid}
                    index={props.indexd}
                  />
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </th>
        <th className="min-w-15v max-w-15v border py-1">
          <Droppable droppableId={`debit_${uid}_${props.indexd}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`grow p-1 ${
                  snapshot.isDraggingOver && "bg-slate-100"
                }`}
              >
                {itemss.info === "debit" && (
                  <Itemsharga
                    data={datanilai}
                    stat={itemss.benar}
                    checker={checking}
                    idd={uid}
                    index={props.indexd}
                  />
                )}
                {itemss.info === "" && (
                  <div className="text-center font-light opacity-20">
                    Drop disini
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </th>
        <th className="min-w-15v max-w-15v border py-1">
          <Droppable droppableId={`kredit_${uid}_${props.indexd}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`grow p-1 ${
                  snapshot.isDraggingOver && "bg-slate-100"
                }`}
              >
                {itemss.info === "kredit" && (
                  <Itemsharga
                    data={datanilai}
                    stat={itemss.benar}
                    checker={checking}
                    idd={uid}
                    index={props.indexd}
                  />
                )}
                {itemss.info === "" && (
                  <div className="text-center font-light opacity-20">
                    Drop disini
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </th>
      </tr>
    </DragDropContext>
  );
}
