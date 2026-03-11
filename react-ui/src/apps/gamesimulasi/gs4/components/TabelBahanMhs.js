import NumberFormat from "react-number-format";
import { Droppable } from "react-beautiful-dnd";
import ItemsDataKakel from "./ItemsDataKakel";
import ItemsDataHarga from "./ItemsDataHarga";
import ItemsDataKeperluan from "./ItemsDataKeperluan";

const numberFormat = (number) => {
  return (
    <NumberFormat
      value={number}
      displayType={"text"}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
      renderText={(value, props) => <div {...props}>{value}</div>}
    />
  );
};
export default function TabelBahanMhs(props) {
  const dataSoal = props.data ? props.data : [];

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="block bg-red-300">
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th
              rowSpan="2"
              className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Bahan Nama
            </th>
            <th
              colSpan="3"
              className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Kwantitas
            </th>
            <th
              colSpan="2"
              className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Harga Pokok
            </th>
            <th
              rowSpan="2"
              className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
            >
              Keperluan
            </th>
          </tr>
          <tr>
            <th className="p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Sat
            </th>
            <th className="p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Diminta
            </th>
            <th className="p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Keluar
            </th>
            <th className="p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              /sat (Rp)
            </th>
            <th className="p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
              Jumlah (Rp)
            </th>
          </tr>
        </thead>
        <tbody>
          {dataSoal &&
            dataSoal.map((item, index) => (
              <tr key={index} className="bg-white relative mb-10 lg:mb-0">
                <td className="p-3 text-slate-800 text-left text-base border">
                  {item.namabhn}
                </td>
                <td className="p-3 text-slate-800 text-center text-base border">
                  {item.satuan}
                </td>
                <td className="p-1 text-slate-800 text-center text-base border">
                  {item.dimintaqty}
                  {/* <Droppable droppableId={`src_kadim_${index}`}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`inline-block p-1 w-full items-stretch ${
                                  snapshot.isDraggingOver && "bg-slate-200"
                                }`}
                              >
                                <ItemsDataKadim
                                  data={item.dimintaqty}
                                  index={index}
                                  checker={false}
                                />
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable> */}
                </td>
                <td className="p-1 text-slate-800 text-center text-base border">
                  <Droppable droppableId={`src_kakel_${index}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`inline-block p-1 w-full items-stretch ${
                          snapshot.isDraggingOver && "bg-slate-200"
                        }`}
                      >
                        {item.drag_keluarqty ? (
                          <ItemsDataKakel
                            data={item.drag_keluarqty}
                            index={index}
                            checker={false}
                          />
                        ) : (
                          <span className="opacity-60">{item.keluarqty}</span>
                        )}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </td>
                <td className="p-1 text-slate-800 text-center text-base border">
                  <Droppable droppableId={`src_hargasat_${index}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`inline-block p-1 w-full items-stretch ${
                          snapshot.isDraggingOver && "bg-slate-200"
                        }`}
                      >
                        {item.drag_hrgsatuan ? (
                          <ItemsDataHarga
                            data={"" + item.drag_hrgsatuan}
                            index={index}
                            checker={false}
                          />
                        ) : (
                          <span className="opacity-60">
                            {numberFormat(item.hrgsatuan)}
                          </span>
                        )}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </td>
                <td className="p-1 text-slate-800 text-center text-base border">
                  {toRp(item.hrgjumlah)}
                  {/* <Droppable droppableId={`src_hargajumlah_${index}`}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`inline-block p-1 w-full items-stretch ${
                                  snapshot.isDraggingOver && "bg-slate-200"
                                }`}
                              >
                                <ItemsDataHarga
                                  data={toRp(item.hrgjumlah)}
                                  parparam="hargajumlah"
                                  index={index}
                                  checker={false}
                                />
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable> */}
                </td>
                <td className="p-1 text-slate-800 text-left border">
                  <Droppable droppableId={`src_keperluan_${index}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`inline-block p-1 w-full items-stretch ${
                          snapshot.isDraggingOver && "bg-slate-200"
                        }`}
                      >
                        {item.drag_keterangan ? (
                          <ItemsDataKeperluan
                            data={item.drag_keterangan}
                            parparam="keperluan"
                            index={index}
                            checker={false}
                          />
                        ) : (
                          <span className="opacity-60">{item.keperluan}</span>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
