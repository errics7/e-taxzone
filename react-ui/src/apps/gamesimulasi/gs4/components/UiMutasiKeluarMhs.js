import { ShimmerTable } from "react-shimmer-effects";
import { Droppable } from "react-beautiful-dnd";
import ItemsDataNoId from "./ItemsDataNoId";
import ItemsDataKeperluan from "./ItemsDataKeperluan";
import ItemsDataKakel from "./ItemsDataKakel";
import ItemsDataHarga from "./ItemsDataHarga";

export default function UiMutasiKeluarMhs(props) {
  const dataDrag = props.dataDrag;
  const data = props.selected;
  const jawaban = props.jawaban;
  const validate = props.validate === null ? false : props.validate;

  const toPuluhan = (number) => {
    if (number) {
      var rupiah = "";
      var numberrev = number.toString().split("").reverse().join("");
      for (var i = 0; i < numberrev.length; i++)
        if (i % 3 === 0) rupiah += numberrev.substr(i, 3) + ".";
      return rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("");
    } else {
      return number;
    }
  };

  return (
    <div className="w-full min-h-20v relative mt-5 bg-white">
      <div className="border border-dashed p-3 min-h-1/2 w-full">
        <div className="absolute opacity-50 italic font-semibold">
          Worksheet :
        </div>
        <br />
        <div className="text-lg uppercase font-semibold mb-3 mt-2">
          kartu Persediaan
        </div>
        <div className="text-base flex flex-col">
          <div className="flex ">
            <div className="flex-none w-2/12 flex justify-between">
              <span>Kelompok</span>
              <span>:</span>
            </div>
            <div className="grow pl-2  uppercase">Bahan Penolong</div>
          </div>
        </div>
        <div className="text-base flex flex-col">
          <div className="flex ">
            <div className="flex-none w-2/12 flex justify-between">
              <span>Nama Barang</span>
              <span>:</span>
            </div>
            <div className="grow uppercase">
              <span className="px-2">{data && data.namabhn}</span>
            </div>
          </div>
        </div>
        <br />
        {dataDrag ? (
          <table className="border-collapse w-full bg-white">
            <thead>
              <tr>
                <th
                  rowSpan="2"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Tanggal
                </th>
                <th
                  rowSpan="2"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Keterangan
                </th>
                <th
                  rowSpan="2"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  No Bukti
                </th>
                <th
                  colSpan="3"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Masuk
                </th>
                <th
                  colSpan="3"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Keluar
                </th>
                <th
                  colSpan="3"
                  className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  Saldo
                </th>
              </tr>
              <tr className="border-t">
                <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kwt
                </th>
                <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Harga
                </th>
                <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jumlah
                </th>
                <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kwt
                </th>
                <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Harga
                </th>
                <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jumlah
                </th>
                <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kwt
                </th>
                <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Harga
                </th>
                <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jumlah
                </th>
              </tr>
            </thead>
            {/* Body */}
            <tbody>
              <tr>
                <td className="p-3 border border-slate-300 text-center">
                  {dataDrag ? dataDrag.tgl_mutasikeluar : ""}
                </td>
                <td className="p-3 border border-slate-300">Saldo Awal</td>
                <td className="p-3 border border-slate-300"></td>
                <td className="p-3 border border-slate-300"></td>
                <td className="p-3 border border-slate-300"></td>
                <td className="p-3 border border-slate-300"></td>
                <td className="p-3 border border-slate-300"></td>
                <td className="p-3 border border-slate-300"></td>
                <td className="p-3 border border-slate-300"></td>
                <td className="p-3 border border-slate-300">
                  {dataDrag ? toPuluhan(dataDrag.sal_kwt) : 0}
                </td>
                <td className="p-3 border border-slate-300">
                  {dataDrag ? toPuluhan(dataDrag.sal_harga) : 0}
                </td>
                <td className="p-3 border border-slate-300">
                  {dataDrag ? toPuluhan(dataDrag.sal_jumlah) : 0}
                </td>
              </tr>
              {/* data main */}
              {[...Array(1)].map((el, index) => (
                <tr key={index} className="lg:hover:bg-slate-50">
                  <td className="min-w-10v max-w-10v py-2 px-0 border border-slate-300 text-center">
                    <div className="p-0">
                      {/* {dataDrag && dataDrag.info_tglbgudang} */}
                      <Droppable droppableId={`dst_tglbgudang_0`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`relative bg-white inline-block p-1 w-full items-stretch ${
                              snapshot.isDraggingOver && "bg-slate-200"
                            }`}
                          >
                            {jawaban.arrTgl.map((item, i) => (
                              <ItemsDataNoId
                                key={i}
                                data={item.value}
                                index={i}
                                checker={validate}
                                stat={item.stat}
                              />
                            ))}
                            {jawaban.arrTgl.length === 0 && (
                              <div className="text-sm absolute inset-0 p-0 z-0">
                                <div className="border border-dashed opacity-80 font-light text-center -mt-2 bg-white">
                                  Drop disini
                                </div>
                              </div>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                  <td className="min-w-10v max-w-10v p-0 border border-slate-300">
                    <div className="p-0">
                      {/* {data && data.keperluan} */}
                      <Droppable droppableId={`dst_keperluan_0`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`relative bg-white inline-block p-1 w-full items-stretch ${
                              snapshot.isDraggingOver && "bg-slate-200"
                            }`}
                          >
                            {jawaban.arrKet.map((item, i) => (
                              <ItemsDataKeperluan
                                key={i}
                                data={item.value}
                                index={i}
                                checker={validate}
                                stat={item.stat}
                              />
                            ))}
                            {jawaban.arrKet.length === 0 && (
                              <div className="text-sm absolute inset-0 p-0 z-0">
                                <div className="border border-dashed opacity-80 font-light text-center -mt-2 bg-white">
                                  Drop disini
                                </div>
                              </div>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                  <td className="min-w-10v max-w-10v p-0 border border-slate-300 text-center">
                    <div className="p-0">
                      {/* {dataDrag && dataDrag.nobppb} */}
                      <Droppable droppableId={`dst_noid_0`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`relative bg-white inline-block p-1 w-full items-stretch ${
                              snapshot.isDraggingOver && "bg-slate-200"
                            }`}
                          >
                            {jawaban.arrNoid.map((item, i) => (
                              <ItemsDataNoId
                                key={i}
                                data={item.value}
                                index={i}
                                checker={validate}
                                stat={item.stat}
                              />
                            ))}
                            {jawaban.arrNoid.length === 0 && (
                              <div className="text-sm absolute inset-0 p-0 z-0">
                                <div className="border border-dashed opacity-80 font-light text-center -mt-2 bg-white">
                                  Drop disini
                                </div>
                              </div>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </td>
                  <td className="min-w-7v max-w-7v border text-center">
                    &nbsp;
                  </td>
                  <td className="min-w-7v max-w-7v border text-center">
                    &nbsp;
                  </td>
                  <td className="min-w-7v max-w-7v border text-center">
                    &nbsp;
                  </td>
                  <td className="min-w-10v max-w-10v p-0 border text-center">
                    {/* {data && toPuluhan(data.keluarqty drag_keluarqty)} */}
                    <Droppable droppableId={`dst_keluarqty_0`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`relative bg-white inline-block p-1 w-full items-stretch ${
                            snapshot.isDraggingOver && "bg-slate-200"
                          }`}
                        >
                          {jawaban.arrKelqty.map((item, i) => (
                            <ItemsDataKakel
                              key={i}
                              data={toPuluhan(item.value)}
                              index={i}
                              checker={validate}
                              stat={item.stat}
                            />
                          ))}
                          {jawaban.arrKelqty.length === 0 && (
                            <div className="text-sm absolute inset-0 p-0 z-0">
                              <div className="border border-dashed opacity-80 font-light text-center -mt-2 bg-white">
                                Drop disini
                              </div>
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>
                  <td className="min-w-10v max-w-10v p-0 border text-center">
                    <Droppable droppableId={`dst_hargasat_0`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`relative bg-white inline-block p-1 w-full items-stretch ${
                            snapshot.isDraggingOver && "bg-slate-200"
                          }`}
                        >
                          {jawaban.arrHargasat.map((item, i) => (
                            <ItemsDataHarga
                              key={i}
                              data={toPuluhan(item.value)}
                              index={i}
                              checker={validate}
                              stat={item.stat}
                            />
                          ))}
                          {jawaban.arrHargasat.length === 0 && (
                            <div className="text-sm absolute inset-0 p-0 z-0">
                            <div className="border border-dashed opacity-80 font-light text-center -mt-2 bg-white">
                                Drop disini
                              </div>
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </td>
                  <td className="min-w-10v max-w-10v border text-center">
                    {jawaban.arrKelqty[index] &&
                      jawaban.arrHargasat[index] &&
                      toPuluhan(
                        Number(
                          jawaban.arrKelqty[index].value
                            ? jawaban.arrKelqty[index].value
                            : 0
                        ) *
                          Number(
                            jawaban.arrHargasat[index].value
                              ? jawaban.arrHargasat[index].value
                              : 0
                          )
                      )}
                  </td>
                  <td className="min-w-7v max-w-7v border text-center">
                    {jawaban.arrKelqty[index] &&
                      (jawaban.arrHargasat[index] ? (
                        (dataDrag ? Number(dataDrag.sal_kwt) : 0) -
                        (jawaban.arrKelqty[index].value
                          ? jawaban.arrKelqty[index].value
                          : 0)
                      ) : (
                        <div>&nbsp;</div>
                      ))}
                  </td>
                  <td className="min-w-7v max-w-7v border text-center">
                    {jawaban.arrHargasat[index] ? (
                      toPuluhan(jawaban.arrHargasat[index].value)
                    ) : (
                      <div>&nbsp;</div>
                    )}
                  </td>
                  <td className="min-w-7v max-w-7v border text-center">
                    {jawaban.arrKelqty[index] &&
                      (jawaban.arrHargasat[index] ? (
                        toPuluhan(
                          ((dataDrag ? Number(dataDrag.sal_kwt) : 0) -
                            (jawaban.arrKelqty[index].value
                              ? jawaban.arrKelqty[index].value
                              : 0)) *
                            jawaban.arrHargasat[index].value
                        )
                      ) : (
                        <div>&nbsp;</div>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <ShimmerTable row={3} col={7} />
        )}
      </div>
    </div>
  );
}
