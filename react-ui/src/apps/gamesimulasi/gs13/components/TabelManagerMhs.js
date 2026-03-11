//#region

import { find, sumBy } from "lodash";

export default function TabelManagerMhs(props) {
  const headers = props.headers;
  const departements = props.departements;
  const sections = props.sections;
  const kode = props.kode;
  const kpembantu1 = props.kpembantu.filter((x) => x.type === 1);
  const kpembantu2 = props.kpembantu.filter((x) => x.type === 2);
  const data = props.data;
  const dataAlokasi = props.dataAlokasi;

  //#region
  // PREPARAtion DATA
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };
  const drowpembantu = kpembantu2.filter(
    (x) => x.status === true || x.status === 1
  );
  const dataInRowActiv = [...kode].map((u, i) => {
    const aloActv = find(dataAlokasi, {
      idc: u.uuid,
    });
    var tot = 0;
    if (aloActv) {
      if (aloActv.jenis === "kredit") {
        tot = -aloActv.value;
      } else {
        tot = aloActv.value;
      }
    }

    return {
      idc: u.uuid,
      value: tot,
      status: aloActv ? true : false,
    };
  });
  const total1 = sumBy(
    data.filter((x) => x.type === 1),
    (r) => r.value
  );
  //#endregion

  return (
    <div className=" overflow-x-auto">
      <table className="min-w-full table-fixed mb-4">
        <thead>
          <tr className="break-words bg-slate-50">
            <th className="min-w-10v max-w-10v px-2 border">
              Kode Rek Pembantu
            </th>
            <th className="min-w-15v max-w-15v px-2 border">Jumlah</th>
            <th className="p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {headers.map((item1, index) => (
                      <th
                        key={index}
                        colSpan={item1.colspan}
                        rowSpan={item1.rowspan}
                        className="p-0 border relative group"
                      >
                        <div className="py-3 min-w-20v text-lg">
                          {item1.alias}
                        </div>
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {departements.map((item2, index) => (
                      <th
                        key={index}
                        colSpan={item2.colspan}
                        rowSpan={item2.rowspan}
                        className="p-0 border relative group"
                      >
                        <div className="py-2 min-w-20v">{item2.alias}</div>
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {sections.map((item3, index) => (
                      <th
                        key={index}
                        colSpan={item3.colspan}
                        rowSpan={item3.rowspan}
                        className="p-0 border relative group"
                      >
                        <div className="py-2 min-w-20v">{item3.alias}</div>
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {kode.map((item3, index) => (
                      <th
                        key={index}
                        colSpan={item3.colspan}
                        rowSpan={item3.rowspan}
                        className="p-0 border min-w-20v max-w-20v relative group"
                      >
                        <div className="py-1">{item3.alias}</div>
                      </th>
                    ))}
                  </tr>
                </tbody>
              </table>
            </th>
          </tr>
        </thead>
        <tbody>
          {kpembantu1.map((trl, index) => {
            return (
              <tr key={index}>
                <td className="p-0 max-w-10v border group">
                  <div className="py-1 font-semibold text-center relative">
                    {trl.alias}
                  </div>
                </td>
                <td className="px-2 py-2 min-w-10v max-w-10v border text-center">
                  {sumBy(
                    data.filter((x) => x.idr === trl.uuid),
                    (r) => r.value
                  ) > 0
                    ? toRp(
                        sumBy(
                          data.filter((x) => x.idr === trl.uuid),
                          (r) => r.value
                        )
                      )
                    : ""}
                </td>
                <td className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        {kode.map((item, index) => {
                          const f = find(data, {
                            idc: item.uuid,
                            idr: trl.uuid,
                          });
                          return (
                            <td
                              key={index}
                              className="p-0 border relative group min-w-20v max-w-20v"
                            >
                              {f ? (
                                <div className="py-2.5 text-center">
                                  {toRp(f.value)}
                                </div>
                              ) : (
                                <div className="py-2.5 flex items-center opacity-0 group-hover:opacity-100">
                                  &nbsp;
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
          {/* JUMLAH #1 */}
          <tr className="bg-slate-50">
            <td className="py-2 text-center border relative">Jumlah</td>
            <td className="text-center border table-cell">
              {total1 < 0 ? <>({toRp(Math.abs(total1))})</> : toRp(total1)}
            </td>
            <td className="p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {kode.map((item, index) => {
                      const val = sumBy(
                        data.filter((x) => x.type === 1 && x.idc === item.uuid),
                        (r) => r.value
                      );

                      return (
                        <td
                          key={index}
                          className="p-0 border relative group min-w-20v max-w-20v"
                        >
                          <div className="py-2.5 text-center">
                            {val < 0 ? <>({toRp(Math.abs(val))})</> : toRp(val)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
        <tbody>
          {kpembantu2.map((trl, index) => {
            return (
              <tr key={index}>
                <td className="p-0 max-w-10v border group">
                  <div className="py-1 text-center font-semibold relative">
                    {trl.alias}
                  </div>
                </td>
                <td className="px-2 py-2 min-w-10v max-w-10v border text-center"></td>
                <td className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        {kode.map((item, i) => {
                          // filter jika selected row nilai tidak digunakan
                          const f =
                            !trl.status &&
                            find(data, {
                              idc: item.uuid,
                              idr: trl.uuid,
                            });

                          return (
                            <td
                              key={i}
                              className="p-0 border relative group min-w-20v max-w-20v"
                            >
                              {f ? ( //untuuk status row false & data found
                                <div className="py-2.5 text-center">
                                  {f.value < 0 ? (
                                    <>({toRp(Math.abs(f.value))})</>
                                  ) : (
                                    toRp(Math.abs(f.value))
                                  )}
                                </div>
                              ) : !trl.status ? (
                                //untuk bukan row selected
                                <div className="py-2.5 flex items-center opacity-0 group-hover:opacity-100">
                                  &nbsp;
                                </div>
                              ) : //
                              // Status Row TRUE
                              //Cehcek
                              dataInRowActiv[i].status ? (
                                <div className="py-2.5 text-center">
                                  {dataInRowActiv[i].value < 0 ? (
                                    <>
                                      ({toRp(Math.abs(dataInRowActiv[i].value))}
                                      )
                                    </>
                                  ) : (
                                    toRp(Math.abs(dataInRowActiv[i].value))
                                  )}
                                </div>
                              ) : (
                                //alookasi kosong
                                <div className="py-2.5 flex items-center opacity-5 group-hover:opacity-100">
                                  &nbsp;
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
          {/* JUMLAH #2 */}
          <tr className="bg-slate-50">
            <td className="py-2 text-center border relative">Jumlah</td>
            <td className="text-center border table-cell"></td>
            <td className="p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {kode.map((item, index) => {
                      const val =
                        sumBy(
                          data.filter(
                            (x) =>
                              drowpembantu[0] &&
                              x.idc === item.uuid &&
                              x.idr !== drowpembantu[0].uuid
                          ),
                          (r) => r.value
                        ) + dataInRowActiv[index].value;

                      return (
                        <td
                          key={index}
                          className="p-0 border relative group min-w-20v max-w-20v"
                        >
                          <div className="py-2.5 text-center">
                            {val < 0 ? <>({toRp(Math.abs(val))})</> : toRp(val)}
                          </div>
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
