import { groupBy, map, sortBy, sum, find } from "lodash";
import Tooltip from "@mui/material/Tooltip";

export default function TabelPreviewAdmin(props) {
  const dataori = sortBy(props.data, (o) => o.kpusat);

  const data = groupBy(dataori, "golongan");
  const dataObj = map(data, (obj, key) => {
    return { head: key, values: obj };
  });

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const adptiveGrouping = (el, col) => {
    const data = groupBy(el, col);
    const head = map(data, (obj, key) => {
      return { head: key, values: obj };
    });
    return head;
  };

  // data for row
  const totrow = [];
  const dataforrow = adptiveGrouping(props.data, "kpembantu");
  dataforrow.forEach((item, index) => {
    var tr = 0;
    //obj map
    dataObj.forEach((itemg, idx) => {
      // gol
      itemg.values.forEach((cel, i) => {
        if (item.head === cel.kpembantu) {
          tr += Number(cel.saldo);
        }
      });
    });
    totrow.push(tr);
  });
  //var totalcol
  const totcol = [];
  const dataforcol = adptiveGrouping(props.data, "kpusat");
  dataforcol.forEach((item, index) => {
    var tr = 0;
    //obj map
    item.values.forEach((cel, i) => {
      if (cel.status) {
        tr += Number(cel.saldo);
      }
    });
    totcol.push(tr);
  });

  return (
    <div className="p-1 border overflow-x-auto bg-white">
      Preview Worksheet Mahasiswa :
      <table className="min-w-full table-fixed mb-4">
        <thead>
          <tr className="break-words bg-slate-50">
            <th className="min-w-10v max-w-10v px-2 border">
              Kode Rek Pembantu
            </th>
            <th className="min-w-15v px-2 border">Jumlah</th>
            <th className="p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {dataObj.map((item, index) => {
                      //adaptive by kpusat
                      const datakode = adptiveGrouping(item.values, "kpusat");
                      return (
                        <td
                          key={index}
                          colSpan={datakode.length}
                          rowSpan={item.head === "biaya produksi" ? 1 : 3}
                          className="py-2 capitalize border"
                        >
                          {item.head}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    {dataObj
                      .filter((x) => x.head === "biaya produksi")
                      .map((item, index) => {
                        const dataproduksi = adptiveGrouping(
                          item.values,
                          "departemen"
                        );
                        return dataproduksi.map((el, i) => {
                          //adaptive for hpusat
                          const headkode = adptiveGrouping(el.values, "kpusat");
                          return (
                            <td
                              key={i}
                              colSpan={headkode.length}
                              className="py-1 capitalize border"
                            >
                              {el.head}
                            </td>
                          );
                        });
                      })}
                  </tr>
                  <tr>
                    {dataObj
                      .filter((x) => x.head === "biaya produksi")
                      .map((item, index) => {
                        const dataseksi = adptiveGrouping(item.values, "seksi");
                        return dataseksi.map((el, i) => {
                          //adaptiv grouping kpusat
                          const headkode = adptiveGrouping(el.values, "kpusat");
                          return (
                            <td
                              key={i}
                              colSpan={headkode.length}
                              className="py-1 capitalize border"
                            >
                              {el.head}
                            </td>
                          );
                        });
                      })}
                  </tr>
                  <tr>
                    {dataObj.map((item, index) => {
                      const datakode = adptiveGrouping(item.values, "kpusat");
                      return datakode.map((el, i) => {
                        //adaptiv grouping kpusat
                        const headkode = adptiveGrouping(el.values, "kpusat");
                        return (
                          <td
                            key={i}
                            colSpan={headkode.length}
                            className="py-1 capitalize min-w-25v max-w-20v border"
                          >
                            {el.head}
                          </td>
                        );
                      });
                    })}
                  </tr>
                </tbody>
              </table>
            </th>
          </tr>
        </thead>
        <tbody className="group">
          {/* Worksheet LIST */}
          {dataforrow.map((elr, index) => {
            return (
              <tr key={index} className="break-words">
                <td className="min-w-10v max-w-10v px-2 border">{elr.head}</td>
                <td className="min-w-15v px-2 border">
                  {find(elr.values, (x) => x.status === true) ? (
                    <span>{toRp(totrow[index])}</span>
                  ) : (
                    <>-</>
                  )}
                </td>
                <td className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        {dataObj.map((item, index) => {
                          const datakode = adptiveGrouping(
                            item.values,
                            "kpusat"
                          );
                          return datakode.map((el, i) => {
                            //adaptiv grouping kpusat
                            const headkode = adptiveGrouping(
                              el.values,
                              "kpusat"
                            );
                            //obj di row benar
                            const objasrow = find(
                              el.values,
                              (x) => x.kpembantu === elr.head
                            );

                            return (
                              <td
                                key={i}
                                colSpan={headkode.length}
                                className="capitalize min-w-25v max-w-20v border"
                              >
                                {objasrow && objasrow.status ? (
                                  <Tooltip
                                    title="jawaban diisi benar mahasiswa"
                                    placement="bottom-start"
                                    arrow
                                  >
                                    <div className="py-2 text-center group-hover:bg-amber-50">
                                      {toRp(objasrow.saldo)}
                                    </div>
                                  </Tooltip>
                                ) : (
                                  <div className="py-2 text-xs">&nbsp;</div>
                                )}
                              </td>
                            );
                          });
                        })}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
          {/* TOTAL LIST */}
          <tr>
            <td className="py-2 text-center border table-cell">Jumlah</td>
            <td className="text-center border table-cell">
              <Tooltip title="jawaban benar mahasiswa" placement="bottom-start">
                <div className="py-2 group-hover:bg-amber-50">
                  {toRp(sum(totrow))}
                </div>
              </Tooltip>
            </td>
            <td className="p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {dataforcol.map((el, index) => {
                      return (
                        <td
                          key={index}
                          className="p-0 capitalize min-w-20v max-w-20v border text-center"
                        >
                          {find(el.values, (x) => x.status) ? (
                            <Tooltip
                              title="jawaban benar diisi mahasiswa"
                              placement="bottom-start"
                            >
                              <div className="py-2 group-hover:bg-amber-50">
                                {toRp(totcol[index])}
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="py-2">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
