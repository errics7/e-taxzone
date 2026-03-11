import { Droppable } from "react-beautiful-dnd";

import ItemsDataGs9 from "./ItemsDataGs9";

export default function TblDropableBB(props) {
  const i = props.i;
  const item = props.item;
  const autoChecker = props.autoChecker;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <tr>
      <td className="py-1 border table-cell">
        <Droppable droppableId={`dst_code_${i}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`grow p-1 grid ${
                snapshot.isDraggingOver && "bg-slate-100"
              }`}
            >
              {item.code.value ? (
                <ItemsDataGs9
                  data={item.code.value}
                  index={i}
                  msg={"Pastikan Kode sudah urut dari kecil ke besar"}
                  checker={autoChecker}
                  stat={item.code.error}
                />
              ) : i === 0 ? (
                <div className="text-center opacity-40">Drop disini</div>
              ) : null}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </td>
      <td className="py-1 border table-cell">
        <Droppable droppableId={`dst_name_${i}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`grow grid p-1 ${
                snapshot.isDraggingOver && "bg-slate-100"
              }`}
            >
              {item.name.value ? (
                <ItemsDataGs9
                  index={i}
                  data={item.name.value}
                  msg={"Pastikan Nama Akun sesuai Kode"}
                  checker={autoChecker}
                  stat={item.name.error}
                />
              ) : i === 0 ? (
                <div className="text-center opacity-40">Drop disini</div>
              ) : null}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </td>
      <td className="py-1 border table-cell">
        <Droppable droppableId={`dst_jum-jumdebit-jumkredit_${i}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`grow grid p-1 ${
                snapshot.isDraggingOver && "bg-slate-100"
              }`}
            >
              {item.jumdebit.value ? (
                <ItemsDataGs9
                  index={i}
                  data={toRp(item.jumdebit.value)}
                  addon="jum-jumdebit"
                  msg={"Pastikan Jenis saldo sesuai Kode"}
                  checker={autoChecker}
                  stat={item.jumdebit.error}
                />
              ) : i === 0 && !item.jumkredit.value ? (
                <div className="text-center opacity-40">Drop disini</div>
              ) : null}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </td>
      <td className="py-1 border table-cell">
        <Droppable droppableId={`dst_jum-jumkredit-jumdebit_${i}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`grow grid p-1 ${
                snapshot.isDraggingOver && "bg-slate-100"
              }`}
            >
              {item.jumkredit.value ? (
                <ItemsDataGs9
                  index={i}
                  data={toRp(item.jumkredit.value)}
                  addon="jum-jumkredit"
                  msg={"Pastikan Jenis saldo sesuai Kode"}
                  checker={autoChecker}
                  stat={item.jumkredit.error}
                />
              ) : i === 0 && !item.jumdebit.value ? (
                <div className="text-center opacity-40">Drop disini</div>
              ) : (
                <div>&nbsp;</div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </td>
    </tr>
  );
}
