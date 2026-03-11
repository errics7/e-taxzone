import { Draggable } from "react-beautiful-dnd";

export default function ItemsDataKeperluan(props) {
  const { checker, stat } = props;

  return (
    <Draggable
      draggableId={props.index + "_" + props.data + "_" + props.parparam}
      index={props.index}
    >
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`rounded-sm text-sm px-2 py-1 shadow border flex items-center bg-white ${
            checker &&
            !stat &&
            "animate-pulse border-red-400 text-red-600 font-semibold"
          }`}
        >
          <p className="text-left w-full">{props.data}</p>
        </div>
      )}
    </Draggable>
  );
}
