import { Droppable } from "react-beautiful-dnd"; 
import Task from "./task.js";

function Column(props) {
  return (
    <div className="m-3 border-2 w-full mx-3 flex flex-col">
      <div className="p-3">{props.column.title}</div>
      <Droppable droppableId={props.column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
            className={`p-5 grow ${
              props.isDraggingOver ? "bg-red-100" : "bg-white"
            }`}
          >
            {props.tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;
