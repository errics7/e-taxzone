import { Draggable } from "react-beautiful-dnd";

export default function ItemsDataNilaiAlokasiGs10(props) {
  const { checker } = props;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <Draggable draggableId={props.index + "_" + props.data} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`z-50 rounded-sm text-sm px-3 shadow border flex items-center bg-white  ${
            checker &&
            !props.stat &&
            "animate-pulse border-red-400 text-red-600 font-semibold"
          }`}
        >
          <p className="text-center">{toRp(props.data)}</p>
        </div>
      )}
    </Draggable>
  );
}
