import { Draggable } from "react-beautiful-dnd";

export default function ItemsDataOther(props) {
  const { checker, stat } = props;

  return (
    <Draggable
      draggableId={props.index + "_" + props.data + "_" + props.parparam}
      index={props.index}
    >
      {(provided) => (
        <div
          $stat={props.stat}
          $ccheck={checker}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`rounded-sm text-base px-3 py-1 shadow border flex items-center  ${
            p.$ccheck &&
            !p.$stat &&
            "animate-pulse border-red-400 text-red-600 font-semibold"
          }`}
        >
          <p className="text-center w-full">{props.data}</p>
        </div>
      )}
    </Draggable>
  );
}
