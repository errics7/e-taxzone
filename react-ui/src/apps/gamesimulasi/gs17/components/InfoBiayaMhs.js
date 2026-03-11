export default function InfoBiayaMhs(props) {
  const dataRedaksi = props.dataRedaksi;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString();
  };
  const numWitComm = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  };
  const toLTous = (x) => {
    return numWitComm(parseFloat(x.toFixed(2)));
  };

  return (
    <div className="mt-5">
      <h1 className="font-semibold">Data Biaya & Produksi</h1>
      <div className="max-w-3xl">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="w-3/5"></th>
              <th className="border w-1/5 py-1.5 font-semibold">
                Unit Produksi
              </th>
              <th className="border w-1/5 py-1.5 font-semibold">Biaya</th>
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
                    <div className="relative py-1.5 text-center text-base">
                      {item.unitprod === 0 ? "" : toLTous(item.unitprod)}
                    </div>
                  </td>
                  <td className="border">
                    <div className="relative py-1.5 text-center text-base">
                      {item.biaya === 0 ? "" : toRp(item.biaya)}
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
