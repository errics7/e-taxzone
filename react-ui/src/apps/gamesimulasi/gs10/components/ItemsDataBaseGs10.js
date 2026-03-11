import { Draggable } from "react-beautiful-dnd";

export default function ItemsDataBaseGs10(props) {
  const { checker } = props;

  return (
    <Draggable
      draggableId={props.index + "_" + props.data + "_" + props.addon}
      index={props.index}
    >
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`z-50 rounded-sm text-sm px-3 py-1 shadow border flex items-center w-full bg-white ${
            checker &&
            props.stat &&
            "animate-pulse border-red-400 text-red-600 font-semibold"
          }`}
        >
          <p className="text-center w-full">{props.data}</p>
        </div>
      )}
    </Draggable>
  );
}
