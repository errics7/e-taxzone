import { ShimmerTable } from "react-shimmer-effects";

export default function TabelAlokasiMhs(props) {
  const dataAlokasi = props.dataAlokasi;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed border-collapse mb-4">
        <tbody>
          <tr className="break-words bg-slate-50">
            <th className="min-w-25v py-3 px-2 border text-left" colSpan="2">
              Dasar Alokasi
            </th>
          </tr>
          {dataAlokasi.map((el, i) => {
            return (
              <tr key={i}>
                <td className="min-w-25v py-2 px-2 border">{el.keterangan}</td>
                <td className="min-w-10v px-2 text-right border">
                  {el.mode === "nominal" ? (
                    el.value < 0 ? (
                      <>({toRp(Math.abs(el.value))})</>
                    ) : (
                      toRp(el.value)
                    )
                  ) : (
                    <>{el.value}%</>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {dataAlokasi.length === 0 && (
        <div>
          <ShimmerTable row={2} col={2} />{" "}
        </div>
      )}
    </div>
  );
}
