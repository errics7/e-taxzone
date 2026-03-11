import { Draggable } from "react-beautiful-dnd";

export default function ItemsDataGs3(props) {
  const { checker, stat } = props;

  return (
    <Draggable
      draggableId={props.ddid + "_" + props.index + "_" + props.data}
      index={props.index}
    >
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{ width: "100%", ...provided.draggableProps.style }}
          className={`rounded-sm py-1 shadow border w-full flex items-center grow bg-white ${
            checker &&
            !stat &&
            "animate-pulse border-red-400 text-red-600 font-semibold"
          }`}
        >
          <p className="mx-auto text-center grow flex-wrap overflow-hidden">
            {props.data}
          </p>
        </div>
      )}
    </Draggable>
  );
}
