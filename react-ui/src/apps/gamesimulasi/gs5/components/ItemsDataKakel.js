import { Draggable } from "react-beautiful-dnd";

export default function ItemsDataKakel(props) {
  const { checker, stat } = props;

  return (
    <Draggable
      draggableId={props.index + "_" + props.data + "_kakel"}
      index={props.index}
    >
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`rounded-sm text-base px-3 py-1 shadow border flex items-center bg-white ${
            checker &&
            !stat &&
            "animate-pulse border-red-400 text-red-600 font-semibold"
          }`}
        >
          <p className="text-center w-full">{props.data}</p>
        </div>
      )}
    </Draggable>
  );
}
