import { Draggable } from "react-beautiful-dnd";

export default function ItemsDataSoal(props) {
  const { checker, stat } = props;

  return (
    <Draggable
      draggableId={props.index + "_" + props.data + "_" + props.sec}
      index={props.index}
    >
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`rounded-sm py-1 shadow border w-full items-center bg-white z-50 ${
            checker &&
            !stat &&
            "animate-pulse border-red-400 text-red-600 font-semibold"
          }`}
        >
          <p className="mx-auto text-center w-full">{props.data}</p>
        </div>
      )}
    </Draggable>
  );
}
