export default function BuktiMemorialGs15(props) {
  const config = props.config;
  const dasaralokasi = props.dasaralokasi;

  const dnominalkred =
    dasaralokasi && dasaralokasi.filter((x) => x.jenis === "kredit");
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="">
      <div className="mx-1 mb-3 p-3 border border-dashed min-h-30v">
        <div className="">
          <div className="inline pr-3 relative font-semibold">
            {config ? config.namept : ""}
          </div>
          <div className="inline">( ) Harian ( ) Penyesuaian</div>
        </div>
        <br />
        <h1 className="mt-5 mx-auto text-center text-2xl font-semibold">
          BUKTI MEMORIAL
        </h1>
        <div className="mx-auto text-sm text-center">
          <div>
            <div className="inline">NO. BM:</div>
            <div className="inline pr-3 relative">
              {config ? config.nobm : ""}
            </div>
          </div>
        </div>
        <div className="mt-3 mb-2">
          <div className="inline">{config ? config.narasibuktimemo : ""}</div>
          <div className={`inline-flex ml-1`}>
            {dnominalkred[0] ? toRp(dnominalkred[0].value) : toRp(0)}
          </div>
        </div>
        <table className="border-collapse w-full">
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}
