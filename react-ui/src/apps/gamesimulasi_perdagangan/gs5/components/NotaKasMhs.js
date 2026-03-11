export default function NotaKasMhs(props) {
  const { itmnota } = props;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="w-full border-2 border-dashed">
      <div className="grid grid-cols-6 gap-4 border-b pb-8">
        <div className="col-start-1 col-end-4  text-base">
          <div className="flex flex-col ml-5 mt-3 space-y-2">
            <p className="font-semibold text-2xl uppercase">
              {props.dataConfig ? props.dataConfig.cvname : ""}
            </p>
            <p className="text-base font-medium">
              {props.dataConfig ? props.dataConfig.cvalamat : ""}
            </p>
          </div>
        </div>
        <div className="col-end-10">
          <div className="flex flex-col mt-3 space-y-2 pr-5">
            <h1 className="text-2xl font-semibold">BUKTI KAS MASUK</h1>
            <div className="flex">
              <label>
                No &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
              </label>
              <p className="text-base pl-2">{itmnota.no}</p>
            </div>
            <div className="flex">
              <label>Tanggal : </label>
              <p className="text-base pl-2">{itmnota.tgl}</p>
            </div>
          </div>
        </div>
      </div>
      {/* PENERIMA KAS */}
      <div className="flex flex-col px-3 py-5 mt-5 max-w-4xl mx-auto space-y-2">
        <div className="flex text-lg">
          <div className="flex justify-between w-44">
            <p>Sudah Terima dari</p>
            <p>:</p>
          </div>
          <p className="text-base ml-3">{itmnota.penerima}</p>
        </div>
        <div className="flex text-lg">
          <div className="flex justify-between w-44">
            <p>Untuk Pembayaran</p>
            <p>:</p>
          </div>
          <p className="text-base ml-3">{itmnota.keperluan}</p>
        </div>
        <div className="flex text-lg">
          <div className="flex justify-between w-44">
            <p>Sebesar</p>
            <p>:</p>
          </div>
          <p className="text-base ml-3">{itmnota.nilaih}</p>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4 mt-10 mb-24">
        <div className="col-end-10">
          <div className="flex flex-col mt-3 space-y-2">
            <p className="text-base -ml-3">{itmnota.tgl2}</p>
          </div>
        </div>
        <div className="col-start-1 col-end-12 mx-auto p-1 border border-dashed">
          <div className="px-10 py-2 relative bg-slate-50 text-xl font-semibold tracking-widest">
            <p>{toRp(itmnota.nilaia)}</p>
          </div>
        </div>
        <div className="col-end-10">
          <div className="mx-auto block text-center mt-3">
            Kasir {props.dataConfig ? props.dataConfig.cvname : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
