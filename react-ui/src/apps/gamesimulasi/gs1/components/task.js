import { Draggable } from "react-beautiful-dnd";

function Task(props) {
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="border p-3 my-2 bg-white"
        >
          {props.task.content}
        </div>
      )}
    </Draggable>
  );
}

export default Task;
