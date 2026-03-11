import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

export default function RowBukuBesarGs2(props) {
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const { nominal, jenis } = props;
  const datanilai = toRp(nominal);
  // const [istrue, setistrue] = useState(false);
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
      // setistrue(benarsalah);
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
      <div className="flex flex-row justify-evenly mb-3">
        <div className="py-2 w-full border text-center flex flex-col ">
          <span className="m-1 py-1"> Des</span>
        </div>
        <div className="py-2 w-full border text-center flex flex-col ">
          <span className="m-1 py-1">01</span>
        </div>
        <div className="py-2 w-full border text-center flex flex-col ">
          <span className="m-1 py-1">Saldo awal</span>
        </div>
        <div className="py-2 w-full border text-center flex flex-col ">
          <span className="m-1 py-1">NA</span>
        </div>
        <div className="py-2 w-full border text-center flex flex-col ">
          <span className="m-1 py-1"></span>
        </div>
        <div className="py-2 w-full border text-center flex flex-col ">
          <span className="m-1 py-1"></span>
        </div>
        <div className="py-2 w-full border text-center flex flex-col ">
          <span className="m-1 py-1">{toRp(nominal)}</span>
        </div>
      </div>
    </DragDropContext>
  );
}
