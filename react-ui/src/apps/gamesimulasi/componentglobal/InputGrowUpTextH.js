import "./InputGrowUp.css";

export function InputGrowUpTextH2({ value, onChange, placeholder }) {
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
        className="pl-1 text-lg text-center focus:ring-2 focus:ring-blue-500 rounded-sm "
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
