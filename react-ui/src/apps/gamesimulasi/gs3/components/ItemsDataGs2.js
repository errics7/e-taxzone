import { Draggable } from "react-beautiful-dnd";

export default function ItemsDataGs2(props) {
  const { checker, stat } = props;

  return (
    <Draggable draggableId={props.data} index={props.index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`rounded-sm py-1 shadow border w-full flex items-center grow bg-white ${
            checker &&
            stat &&
            "animate-pulse border-red-400 text-red-600 font-semibold"
          }`}
        >
          <p className="mx-auto text-center grow flex-wrap overflow-hidden">
            {props.data}
          </p>
        </Container>
      )}
    </Draggable>
  );
}
