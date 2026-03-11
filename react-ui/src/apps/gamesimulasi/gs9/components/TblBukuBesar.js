import Grid from "@mui/material/Grid";
import { Droppable } from "react-beautiful-dnd";

import ItemsDataGs9 from "../components/ItemsDataGs9";

export default function TblBukuBesar(props) {
  const item = props.item;
  const j = props.i;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="stretch"
      className={
        props.autoChecker && item.error
          ? `border-2 border-red-300 my-3`
          : `my-3 rounded-sm relative `
      }
    >
      <div className="p-5 border border-solid ">
        <div className="">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-start-1 col-end-7 font-bold text-center">
              BUKU BESAR
            </div>
          </div>
          <div className="grid grid-cols-6 gap-0">
            <div className="col-start-1 col-end-4 flex items-center my-2">
              <span className="flex-none">Nama Akun :</span>
              <Droppable droppableId={"src_name_" + item.name}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex w-full items-stretch p-1"
                  >
                    {/* IItems */}
                    {item.dragable.name ? (
                      <ItemsDataGs9 data={item.dragable.name} index={j} />
                    ) : (
                      <span className="border opacity-40">
                        {item.source.name}
                      </span>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="col-end-7 col-span-2 flex items-center">
              <div className="flex-none"> Kode : </div>
              <Droppable droppableId={"src_code_" + item.code}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex w-full items-stretch p-1"
                  >
                    {/* IItems */}
                    {item.dragable.code ? (
                      <ItemsDataGs9 data={item.dragable.code} index={j} />
                    ) : (
                      <span className="border opacity-40">
                        {item.source.code}
                      </span>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
        <table className="border-collapse w-full table-fixed">
          <thead>
            <tr>
              <th
                rowSpan="2"
                className="min-w-5v max-w-5v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Tanggal
              </th>
              <th
                rowSpan="2"
                className="min-w-30v max-w-30v px-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Keterangan
              </th>
              <th
                rowSpan="2"
                className="min-w-15v max-w-15v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Ref.
              </th>
              <th
                rowSpan="2"
                className="min-w-15v max-w-15v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Debet
              </th>
              <th
                rowSpan="2"
                className="min-w-15v max-w-15v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Kredit
              </th>
              <th
                colSpan="2"
                className="min-w-30v max-w-30v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Saldo
              </th>
            </tr>
            <tr>
              <th className="min-w-15v max-w-15v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Debet
              </th>
              <th className="min-w-15v max-w-15v p-2 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Kredit
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1.5 border text-center">
                <table className="border-collapse w-full table-fixed">
                  <tbody>
                    <tr>
                      <td className="border-r">Des</td>
                      <td className="border-l">1</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="py-1.5 border text-center">Saldo awal</td>
              <td className="py-1.5 border text-center">NSA</td>
              <td className="py-1.5 border text-center">&nbsp;</td>
              <td className="py-1.5 border text-center">&nbsp;</td>
              <td className="py-1.5 border text-center">
                <div className="text-center">
                  {item.jenis === "debit" ? (
                    item.dragable.saldodebit === 0 ? (
                      "-"
                    ) : (
                      toRp(item.dragable.saldodebit)
                    )
                  ) : (
                    <div className="table-cell">&nbsp;</div>
                  )}
                </div>
              </td>
              <td className="py-1.5 border text-center">
                <div className="flex items-center">
                  {item.jenis === "kredit" ? (
                    <Droppable droppableId={"src_jum-jumkredit_" + item.code}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex w-full items-stretch p-1"
                        >
                          {/* IItems */}
                          {item.dragable.jumkredit ? (
                            <ItemsDataGs9
                              data={toRp(item.dragable.jumkredit)}
                              index={j}
                            />
                          ) : (
                            <span className="border opacity-40">
                              {toRp(item.source.jumkredit)}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ) : (
                    <div>&nbsp;</div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
          <tbody>
            {item.jenis === "debit" ? (
              <tr>
                <td className="py-1.5 border text-center">
                  <table className="border-collapse w-full table-fixed">
                    <tbody>
                      <tr>
                        <td className="border-r"></td>
                        <td className="border-l">2</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="py-1.5 border text-center">Penjualan</td>
                <td className="py-1.5 border text-center">RJP</td>
                <td className="py-1.5 border text-center">
                  <div className="text-center">
                    {item.jenis === "debit" ? (
                      item.dragable.debit === 0 ? (
                        "-"
                      ) : (
                        toRp(item.dragable.debit)
                      )
                    ) : (
                      <div className="table-cell">&nbsp;</div>
                    )}
                  </div>
                </td>
                <td className="py-1.5 border text-center">&nbsp;</td>
                <td className="py-1.5 border text-center">
                  <div className="flex items-center">
                    <Droppable droppableId={"src_jum-jumdebit_" + item.code}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex w-full items-stretch p-1"
                        >
                          {/* IItems */}
                          {item.dragable.jumdebit ? (
                            <ItemsDataGs9
                              data={toRp(item.dragable.jumdebit)}
                              index={j}
                            />
                          ) : (
                            <span className="border opacity-40">
                              {toRp(item.source.jumdebit)}
                            </span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </td>
                <td className="py-1.5 border text-center">&nbsp;</td>
              </tr>
            ) : (
              <tr>
                <td className="py-1.5 border text-center">
                  <table className="border-collapse w-full table-fixed">
                    <tbody>
                      <tr>
                        <td className="border-r">&nbsp;</td>
                        <td className="border-l">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="py-1.5 border text-center">&nbsp;</td>
                <td className="py-1.5 border text-center">&nbsp;</td>
                <td className="py-1.5 border text-center">&nbsp;</td>
                <td className="py-1.5 border text-center">&nbsp;</td>
                <td className="py-1.5 border text-center">&nbsp;</td>
                <td className="py-1.5 border text-center">&nbsp;</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Grid>
  );
}
