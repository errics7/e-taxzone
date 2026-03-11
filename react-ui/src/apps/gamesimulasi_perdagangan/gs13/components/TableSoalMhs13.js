import NumberFormat from "react-number-format";
import { find } from "lodash";

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

export default function TableSoalMhs13(props) {
  const { dataConfig } = props;

  return (
    <>
      <div className="relative">
        <div className="relative">
          {dataConfig ? dataConfig.introsoal : " "}
        </div>
        <div className="pt-8 flex flex-col items-center font-bold">
          <div className="text-xl relative font-semibold uppercase">
            {dataConfig ? dataConfig.cvname : ""}
          </div>
        </div>
        <div className="flex flex-col items-center mb-1">
          <div className="text-lg font-semibold relative uppercase">
            Jurnal Penyesuaian
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl relative font-semibold tracking-wider">
            {dataConfig ? dataConfig.tblsoalname : ""}
          </div>
        </div>
        <span className="absolute -bottom-1 right-0">(dalam ribuan)</span>
      </div>
      <div className="pt-3 overflow-x-auto border-collapse pb-5">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th className="min-w-15v max-w-15v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Tanggal
              </th>
              <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                No. Akun
              </th>
              <th className="min-w-25v max-w-25v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Nama Akun
              </th>
              <th className="min-w-7v max-w-7v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Ref
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Debet
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Kredit
              </th>
            </tr>
          </thead>
          {/* End tmp */}
          {dataConfig.datasoal.map((el, i) => {
            return (
              <tbody key={i}>
                {el.list.map((drow, ii) => {
                  const f = find(dataConfig.dataakun, { uid: drow });
                  const ddatDeb = find(dataConfig.datanilai, {
                    idr: drow,
                    type: "debet",
                  });
                  const ddatKre = find(dataConfig.datanilai, {
                    idr: drow,
                    type: "kredit",
                  });

                  return (
                    <tr key={ii} className="group">
                      {ii === 0 && (
                        <td
                          rowSpan={el.list.length}
                          className="min-w-10v max-w-10v relative text-center text-slate-800 border border-b"
                        >
                          <div className="absolute inset-0 top-1 px-1 text-center">
                            {el.tanggal}
                          </div>
                        </td>
                      )}
                      <td className="relative min-w-10v max-w-10v p-2 text-center text-slate-800 border border-b">
                        {f && f.noakun}
                      </td>
                      <td className="min-w-30v max-w-30v p-2 text-slate-800 border border-b">
                        {f && f.alias}
                      </td>
                      <td className="min-w-7v max-w-7v p-2 text-center text-slate-800 border border-b">
                        &nbsp;
                      </td>
                      <td className="min-w-15v max-w-15v p-2 text-center text-slate-800 border border-b">
                        {ddatDeb && numberFormat(ddatDeb.value)}
                      </td>
                      <td className="min-w-15v max-w-15v p-2 text-center text-slate-800 border border-b">
                        {ddatKre && numberFormat(ddatKre.value)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            );
          })}
        </table>
      </div>
    </>
  );
}
