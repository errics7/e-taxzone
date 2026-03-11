import { Draggable } from "react-beautiful-dnd";

export default function ItemsDataNoId(props) {
  const { checker, stat } = props;

  return (
    <Draggable
      draggableId={props.index + "_noid_" + props.data}
      index={props.index}
    >
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`rounded-sm text-sm px-1 py-1 shadow border flex items-center bg-white ${
            checker &&
            !stat &&
            "animate-pulse border-red-400 text-red-600 font-semibold"
          }`}
        >
          <p className="text-center">{props.data}</p>
        </div>
      )}
    </Draggable>
  );
}
