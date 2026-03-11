import "./InputGrowUp.css";
import EditIcon from "@mui/icons-material/Edit";

export function InputGrowUpTextWithName({
  value,
  onChange,
  index,
  placeholder,
  name,
  style,
  icon = false,
}) {
  return (
    <div
      className="auto-grow-input relative"
      style={{
        display: "inline-grid",
        alignItems: "center",
        justifyItems: "start",
        padding: 0,
        border: "none",
        borderRadius: 4,
      }}
    >
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event, index)}
        style={{
          gridArea: "1 / 1 / 2 / 2",
          width: "100%",
          border: "none",
        }}
        className={`pl-1 focus:ring-2 focus:ring-blue-500 rounded-sm ${style}`}
      />
      <span
        style={{
          gridArea: "1 / 1 / 2 / 2",
          visibility: "hidden",
        }}
      >
        {value}&nbsp;&nbsp;&nbsp;
      </span>
      {icon && (
        <EditIcon
          className="text-blue-700 opacity-30 absolute -inset-y-0.5 right-1"
          fontSize="inherit"
        />
      )}
    </div>
  );
}

export function InputGrowUpTextH1({ value, onChange, placeholder }) {
  return (
    <div
      className="auto-grow-input"
      style={{
        display: "inline-grid",
        alignItems: "center",
        justifyItems: "start",
        padding: 0,
        border: "none",
        borderRadius: 4,
      }}
    >
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={{
          gridArea: "1 / 1 / 2 / 2",
          width: "100%",
          border: "none",
        }}
        className="pl-1 text-xl text-center focus:ring-2 focus:ring-blue-500 rounded-sm "
      />
      <span
        style={{
          gridArea: "1 / 1 / 2 / 2",
          visibility: "hidden",
        }}
      >
        {value}&nbsp;&nbsp;&nbsp;
      </span>
    </div>
  );
}
