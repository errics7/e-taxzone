import { Draggable } from "react-beautiful-dnd";
import Tooltip from "@mui/material/Tooltip";

export default function ItemsDataGs9(props) {
  const { checker, stat, msg } = props;

  return (
    <Draggable
      draggableId={`${props.index}_${props.data}_${props.addon}`}
      index={props.index}
    >
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`rounded-sm py-1 shadow border w-full flex items-center grow bg-white ${
            checker &&
            stat &&
            "animate-pulse border-red-400 text-red-600 font-semibold"
          }`}
        >
          {checker && stat ? (
            <Tooltip title={msg} placement="top-start">
              <p className="mx-auto text-center grow flex-wrap overflow-hidden">
                {props.data}
              </p>
            </Tooltip>
          ) : (
            <p className="mx-auto text-center grow flex-wrap overflow-hidden truncate">
              {props.data}
            </p>
          )}
        </div>
      )}
    </Draggable>
  );
}
