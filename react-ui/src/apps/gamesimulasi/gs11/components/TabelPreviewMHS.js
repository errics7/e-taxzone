import { groupBy, map, find } from "lodash";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      style={{
        textAlign: "right",
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function TabelPreviewMHS(props) {
  const dataori = props.data ? props.data : [];
  const datajwb = props.jawab;
  const datajwbtot = props.jawabtot;
  const check = props.check;
  const totrow = props.totrow;

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

  // data for row jumlah
  const dataforrow = adptiveGrouping(props.data, "kpembantu");

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
    <div className="p-1 overflow-x-auto">
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
                        {datajwb &&
                          datajwb[index].map((elc, ii) => {
                            return (
                              <td
                                key={ii}
                                colSpan={1}
                                className="capitalize min-w-25v max-w-20v border"
                              >
                                <div
                                  className={`py-0 text-center ${
                                    check &&
                                    elc.error &&
                                    " bg-red-300 animate-pulse"
                                  }`}
                                >
                                  <Tooltip
                                    title={
                                      check && elc.error
                                        ? "Jumlah salah silahkan ulangi kembali"
                                        : ""
                                    }
                                    placement="top-start"
                                  >
                                    {elc.status ? (
                                      <TextField
                                        value={elc.value}
                                        name="nilai"
                                        fullWidth
                                        InputProps={{
                                          style: { paddingTop: "5px" },
                                          inputComponent: NumberFormatCustom,
                                        }}
                                        onChange={(event) => {
                                          props.setjawab(
                                            datajwb.map((u, ui) =>
                                              ui === index
                                                ? u.map((uu, uii) =>
                                                    uii === ii
                                                      ? {
                                                          ...uu,
                                                          value:
                                                            event.target.value,
                                                        }
                                                      : uu
                                                  )
                                                : u
                                            )
                                          );
                                        }}
                                      />
                                    ) : (
                                      <div className="py-2">&nbsp;</div>
                                    )}
                                  </Tooltip>
                                </div>
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
          {/* TOTAL LIST */}
          <tr>
            <td className="py-2 text-center border table-cell">Jumlah</td>
            <td className="text-center border table-cell">
              <div
                className={`${
                  check && datajwbtot[0].error && " bg-red-300 animate-pulse"
                }`}
              >
                <Tooltip
                  title={
                    check && datajwbtot[0].error
                      ? "Jumlah salah silahkan ulangi kembali"
                      : ""
                  }
                  placement="bottom-start"
                >
                  <TextField
                    value={datajwbtot && datajwbtot[0].value}
                    name="nilai"
                    fullWidth
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    onChange={(event) => {
                      props.setjawabtot(
                        datajwbtot.map((u, ui) =>
                          ui === 0
                            ? {
                                ...u,
                                value: Number(event.target.value),
                              }
                            : u
                        )
                      );
                    }}
                  />
                </Tooltip>
              </div>
            </td>
            <td className="p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {dataforcol.map((el, index) => {
                      const objascol = find(
                        el.values,
                        (x) => x.status === true
                      );

                      return (
                        <td
                          key={index}
                          className="p-0 capitalize min-w-20v max-w-20v border text-center"
                        >
                          {objascol ? (
                            <div
                              className={`${
                                check &&
                                datajwbtot[index + 1].error &&
                                " bg-red-300 animate-pulse"
                              }`}
                            >
                              <Tooltip
                                title={
                                  check && datajwbtot[index + 1].error
                                    ? "Jumlah salah silahkan ulangi kembali"
                                    : ""
                                }
                                placement="bottom-start"
                              >
                                <TextField
                                  value={
                                    datajwbtot && datajwbtot[index + 1].value
                                  }
                                  name="nilai"
                                  fullWidth
                                  InputProps={{
                                    inputComponent: NumberFormatCustom,
                                  }}
                                  onChange={(event) => {
                                    props.setjawabtot(
                                      datajwbtot.map((u, ui) =>
                                        ui === index + 1
                                          ? {
                                              ...u,
                                              value: Number(event.target.value),
                                            }
                                          : u
                                      )
                                    );
                                  }}
                                />
                              </Tooltip>
                            </div>
                          ) : (
                            <div>-</div>
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
