import { Draggable } from "react-beautiful-dnd";
import NumberFormat from "react-number-format";

const numberFormat = (number) => {
  return (
    <NumberFormat
      value={number}
      displayType={"text"}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      renderText={(value, props) => <div {...props}>{value}</div>}
    />
  );
};

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
          <div className="text-center w-full">{numberFormat(props.data)}</div>
        </div>
      )}
    </Draggable>
  );
}
