//#region
//#endregion

export default function InfoBiayaMhs18(props) {
  const dataRedaksi = props.dataRedaksi;
 
  const numWitComm = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  };
  const toLTous = (x) => {
    const num = parseFloat(x);
    return numWitComm(parseFloat(num.toFixed(2)));
  };

  return (
    <div className="mt-4">
      <h1 className="font-semibold -mb-5">Data Biaya & Produksi</h1>
      <div className="max-w-3xl">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="w-3/5"></th>
              <th className="border-l border-r w-1/5 py-1.5 font-semibold">
                Unit Produksi
              </th>
            </tr>
          </thead>
          <tbody>
            {dataRedaksi.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="border">
                    <div className="px-2 pl-5 relative py-1.5">
                      {item.redaksi}
                    </div>
                  </td>
                  <td className="border">
                    <div className="relative py-1.5 text-center">
                      {item.biaya === 0 ? "" : toLTous(item.biaya)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
