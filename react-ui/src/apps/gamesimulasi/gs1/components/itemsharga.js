import { Draggable } from "react-beautiful-dnd";

export default function Itemsharga(props) {
  const { checker, idd, stat } = props;

  return (
    <Draggable
      draggableId={idd + "_" + props.index + "_" + props.data}
      index={props.index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`rounded m-1 py-1 shadow border bg-white ${
            checker &&
            stat &&
            "border-emerald-400 text-emerald-700 font-semibold"
          }  ${
            checker &&
            !stat &&
            "border-red-400 text-red-600 font-semibold animate-pulse"
          }`}
        >
          {props.data}
        </div>
      )}
    </Draggable>
  );
}
