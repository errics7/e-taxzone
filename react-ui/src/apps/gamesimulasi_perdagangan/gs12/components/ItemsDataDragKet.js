import { Draggable } from "react-beautiful-dnd";

export default function ItemsDataDragKet(props) {
  const { checker, stat } = props;

  return (
    <Draggable
      draggableId={props.index + "_" + props.data + "_" + props.uid}
      index={props.index}
    >
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`rounded-sm py-1 px-1 shadow border max-w-25v bg-white z-50 ${
            checker &&
            !stat &&
            "animate-pulse border-red-400 text-red-600 font-semibold"
          }`}
        >
          <p className="mx-auto text-left pl-1 w-full">{props.data}</p>
        </div>
      )}
    </Draggable>
  );
}
