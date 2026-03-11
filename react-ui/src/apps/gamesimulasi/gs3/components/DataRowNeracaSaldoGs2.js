import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Itemsharga from "./ItemsHargaGs2";

export default function divNeracaSaldoGs2(props) {
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const { code, name, nominal, jenis, autoCheck } = props;
  const datanilai = toRp(nominal);
  const [istrue, setistrue] = useState(false);
  const [dataUt, setDataUt] = useState({
    asal: {
      id: "asal",
      data: [datanilai],
    },
    debit: {
      id: "debit",
      data: [],
    },
    kredit: {
      id: "kredit",
      data: [],
    },
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const dataStart = Array.from(dataUt[source.droppableId].data);
    const dataFinish = Array.from(dataUt[destination.droppableId].data);
    if (source.droppableId !== destination.droppableId) {
      dataStart.splice(source.index, 1);
      const newStart = {
        ...dataUt[source.droppableId],
        data: dataStart,
      };

      dataFinish.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...dataUt[destination.droppableId],
        data: dataFinish,
      };
      // check kondisi benar salah
      const benarsalah = newFinish.id === jenis ? true : false;
      setistrue(benarsalah);
      props.setData(newFinish.id, benarsalah);
      //
      setDataUt({
        ...dataUt,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex  flex-row justify-evenly">
        <div className="py-2 w-full border text-center flex flex-col ">
          <span className="m-1 py-1"> {code}</span>
        </div>
        <div className="py-2 w-full border text-center flex flex-col ">
          <span className="m-1 py-1">{name}</span>
        </div>
        <div className="py-2 w-full border text-center flex flex-col ">
          <Droppable droppableId={"asal"}>
            {(provided, snapshot) => (
              <div
                className="grow"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {dataUt.asal.data.map((items, index) => (
                  <Itemsharga
                    key={index}
                    data={items}
                    stat={istrue}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className="py-2 w-full border text-center flex flex-col ">
          <Droppable droppableId={"debit"}>
            {(provided, snapshot) => (
              <div
                className="grow"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {dataUt.debit.data.map((items, index) => (
                  <Itemsharga
                    key={index}
                    data={items}
                    stat={istrue}
                    checker={autoCheck}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className="py-2 w-full border text-center flex flex-col ">
          <Droppable droppableId={"kredit"}>
            {(provided, snapshot) => (
              <div
                className="grow"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {dataUt.kredit.data.map((items, index) => (
                  <Itemsharga
                    key={index}
                    data={items}
                    stat={istrue}
                    checker={autoCheck}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}
