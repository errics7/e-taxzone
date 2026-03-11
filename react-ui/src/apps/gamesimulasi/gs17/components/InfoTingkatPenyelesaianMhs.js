export default function InfoTingkatPenyelesaianMhs(props) {
  const dataConfig = props.dataConfig;

  return (
    <div className="mt-5 mb-3">
      <h1 className="font-semibold">Tingkat Penyelesaian</h1>
      <div className="max-w-3xl">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="border w-2/6 py-1.5 font-semibold">Keterangan</th>
              <th className="border w-1/6 py-1.5 font-semibold">BBB</th>
              <th className="border w-1/6 py-1.5 font-semibold">BBP</th>
              <th className="border w-1/6 py-1.5 font-semibold">BTKL</th>
              <th className="border w-1/6 py-1.5 font-semibold">BOP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border">
                <div className="px-2 pl-5 relative py-1.5">
                  {dataConfig ? (
                    dataConfig.keteranganpen
                  ) : (
                    <div className="mx-auto w-40 h-5 bg-slate-100 animate-pulse rounded"></div>
                  )}
                </div>
              </td>
              <td className="border">
                <div className="relative py-1.5 px-3 text-base text-center">
                  {dataConfig ? (
                    <>{dataConfig.bbb}%</>
                  ) : (
                    <div className="mx-auto w-40 h-5 bg-slate-100 animate-pulse rounded"></div>
                  )}
                </div>
              </td>
              <td className="border">
                <div className="relative py-1.5 px-3 text-base text-center">
                  {dataConfig ? (
                    <>{dataConfig.bbp}%</>
                  ) : (
                    <div className="mx-auto w-40 h-5 bg-slate-100 animate-pulse rounded"></div>
                  )}
                </div>
              </td>
              <td className="border">
                <div className="relative py-1.5 px-3 text-base text-center">
                  {dataConfig ? (
                    <>{dataConfig.btkl}%</>
                  ) : (
                    <div className="mx-auto w-40 h-5 bg-slate-100 animate-pulse rounded"></div>
                  )}
                </div>
              </td>
              <td className="border">
                <div className="relative py-1.5 px-3 text-base text-center">
                  {dataConfig ? (
                    <>{dataConfig.bop}%</>
                  ) : (
                    <div className="mx-auto w-40 h-5 bg-slate-100 animate-pulse rounded"></div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
