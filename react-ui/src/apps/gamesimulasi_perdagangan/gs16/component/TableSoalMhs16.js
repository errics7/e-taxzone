import NumberFormat from "react-number-format";
import { find, sumBy, filter, includes } from "lodash";
import { Fragment } from "react";

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

export default function TableSoalMhs16(props) {
  const { dataConfig } = props;

  //#region
  const hitungJumlahLoc = () => {
    const nil = dataConfig.dataheader.map((dat) => {
      return [
        sumBy(
          filter(dataConfig.datanilai, {
            idc: dat.uid,
            type: "debet",
          }),
          (x) => Number(x.value)
        ),
        sumBy(
          filter(dataConfig.datanilai, {
            idc: dat.uid,
            type: "kredit",
          }),
          (x) => Number(x.value)
        ),
      ];
    });
    // console.log(nil);
    return nil;
  };
  // For Beter Perform
  const jumlahLokal = hitungJumlahLoc();

  const selisihChk = (i) => {
    const d = jumlahLokal[i][0];
    const k = jumlahLokal[i][1];
    const x = Math.abs(d - k);

    const hsl1 = x !== 0 ? x : false;
    const hsl2 = hsl1 ? (d < k ? "debet" : "kredit") : false;

    // console.log([hsl1, d + " : " + k]);
    // console.log(hsl2);
    return [hsl1, hsl2];
  };
  const totalChk = (i) => {
    const d = jumlahLokal[i][0];
    const k = jumlahLokal[i][1];
    const x = Math.abs(d - k);

    const hsl1 = x !== 0 ? x : false;
    const hsl2 = hsl1 ? (d < k ? k : d) : false;

    return hsl2;
  };
  //#endregion

  return (
    <div className="bg-white pt-8">
      <div className="relative">
        <div className="flex flex-col items-center font-bold">
          <div className="text-xl relative font-semibold uppercase">
            {dataConfig ? dataConfig.cvname : ""}
          </div>
        </div>
        <div className="flex flex-col items-center mb-1">
          <div className="text-lg font-semibold relative uppercase">
            Kertas kerja
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl relative font-semibold tracking-wider">
            {dataConfig ? dataConfig.tblsoalname : ""}
          </div>
        </div>
        <span className="absolute -bottom-1 right-0">(dalam ribuan)</span>
      </div>
      <div className="pt-3 overflow-x-auto border-collapse pb-3">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th
                rowSpan="2"
                className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                No. Akun
              </th>
              <th
                rowSpan="2"
                className="min-w-25v max-w-25v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Nama Akun
              </th>
              {dataConfig.dataheader.map((el, i) => (
                <th
                  key={i}
                  colSpan="2"
                  className="py-1.5 font-bold bg-slate-50 text-slate-600 border border-slate-300"
                >
                  {el.alias}
                </th>
              ))}
            </tr>
            <tr>
              {dataConfig.dataheader.map((el, i) => (
                <Fragment key={i}>
                  <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    D
                  </th>
                  <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                    K
                  </th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="min-w-10v max-w-10v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              <td className="min-w-25v max-w-25v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              {dataConfig.dataheader.map((dat, ii) => (
                <Fragment key={ii}>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                </Fragment>
              ))}
            </tr>
          </tbody>
          {/* DATA UTAMA */}
          <tbody>
            {dataConfig.dataakun.map((el, i) => {
              return (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="group min-w-10v max-w-10v text-center text-slate-800 border border-b">
                    <div className="relative">{el.noakun}</div>
                  </td>
                  <td className="group min-w-30v max-w-30v text-slate-800 border border-b">
                    <div className="relative pl-3">{el.alias}</div>
                  </td>
                  {dataConfig.dataheader.map((dat, ii) => {
                    const fd = find(dataConfig.datanilai, {
                      idc: dat.uid,
                      idr: el.uid,
                      type: "debet",
                    });
                    const fk = find(dataConfig.datanilai, {
                      idc: dat.uid,
                      idr: el.uid,
                      type: "kredit",
                    });

                    return (
                      <Fragment key={ii}>
                        <td className="min-w-15v max-w-15v px-1 py-0 text-center text-slate-800 border border-b relative group">
                          {fd && fd.type === "debet" && (
                            <>{numberFormat(fd.value)}</>
                          )}
                        </td>
                        <td className="h-9  min-w-15v max-w-15v px-1 py-0 text-center text-slate-800 border border-b relative group">
                          {fk && fk.type === "kredit" && (
                            <>{numberFormat(fk.value)}</>
                          )}
                        </td>
                      </Fragment>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {/* End DATA UTAMA */}
          <tfoot>
            <tr>
              <td className="min-w-10v max-w-10v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              <td className="min-w-25v max-w-25v p-0.5 text-center text-slate-800 border border-b">
                ...
              </td>
              {dataConfig.dataheader.map((dat, ii) => (
                <Fragment key={ii}>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                  <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                    &nbsp;
                  </td>
                </Fragment>
              ))}
            </tr>
            <tr className="hover:bg-slate-100 bg-slate-50 font-semibold">
              <td
                colSpan="2"
                className="p-0.5 uppercase text-center text-slate-800 border border-b"
              >
                Total
              </td>
              {dataConfig.dataheader.map((dat, ii) => {
                return (
                  <Fragment key={ii}>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      <div className={`p-1.5`}>
                        {numberFormat(jumlahLokal[ii][0])}
                      </div>
                    </td>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      <div className={`p-1.5`}>
                        {numberFormat(jumlahLokal[ii][1])}
                      </div>
                    </td>
                  </Fragment>
                );
              })}
            </tr>
            <tr className="hover:bg-slate-100 bg-slate-50 font-semibold">
              <td
                colSpan="2"
                className="p-0.5 uppercase text-center text-slate-800 border border-b"
              >
                LABA
              </td>
              {dataConfig.dataheader.map((dat, ii) => {
                const ky = includes(dataConfig.showrowlaba, dat.uid);
                const diff = ky ? selisihChk(ii) : false;

                return (
                  <Fragment key={ii}>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      {ky && diff && diff[1] === "debet" && (
                        <div className={`p-1.5`}>{numberFormat(diff[0])}</div>
                      )}
                    </td>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      {ky && diff && diff[1] === "kredit" && (
                        <div className={`p-1.5`}>{numberFormat(diff[0])}</div>
                      )}
                    </td>
                  </Fragment>
                );
              })}
            </tr>
            {/* Total 2 */}
            <tr className="hover:bg-slate-100 bg-slate-50 font-semibold">
              <td
                colSpan="2"
                className="p-0.5 uppercase text-center text-slate-800 border border-b"
              >
                Total
              </td>
              {dataConfig.dataheader.map((dat, ii) => {
                const ky = includes(dataConfig.showrowtotal, dat.uid);
                const cmpr = ky ? totalChk(ii) : false;

                return (
                  <Fragment key={ii}>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      {ky && cmpr && (
                        <div className={`p-1.5`}>{numberFormat(cmpr)}</div>
                      )}
                    </td>
                    <td className="min-w-15v max-w-15v p-0.5 text-center text-slate-800 border border-b">
                      {ky && cmpr && (
                        <div className={`p-1.5`}>{numberFormat(cmpr)}</div>
                      )}
                    </td>
                  </Fragment>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
