import EditIcon from "@mui/icons-material/Edit";
import { InputGrowUpText } from "../../componentglobal/InputGrowUpText";
import InlinePopInputTText from "./InlinePopInputTText";

export default function AdminBuktiMemorial(props) {
  const config = props.config;
  const alokasi = props.alokasi;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <>
      <div className="mt-5">Editor bukti memorial:</div>
      <div className="p-3 border border-dashed">
        <div className="">
          <div className="inline pr-3 relative font-semibold">
            <InputGrowUpText
              value={config ? config.namept : ""}
              onChange={(text) => props.setConfig({ ...config, namept: text })}
            />
            <EditIcon
              fontSize="inherit"
              className="text-blue-700 absolute -inset-y-1 right-2 opacity-50"
            />
          </div>
          <div className="inline">( ) Harian ( ) Penyesuaian</div>
        </div>
        <br />
        <h1 className="mt-5 mx-auto text-center text-2xl font-semibold">
          BUKTI MEMORIAL
        </h1>
        <div className="mx-auto text-sm text-center">
          <div className="pl-7">
            <div className="inline">NO. BM:</div>
            <div className="inline pr-3 relative">
              <InputGrowUpText
                value={config ? config.nobm : ""}
                onChange={(text) => props.setConfig({ ...config, nobm: text })}
              />
              <EditIcon
                fontSize="inherit"
                className="text-blue-700 absolute -inset-y-1 right-2 opacity-50"
              />
            </div>
          </div>
        </div>
        <div className="mt-3 mb-2">
          <div className="inline">
            <InlinePopInputTText
              value={config ? config.narasialokasi : ""}
              onChange={(val) => {
                props.setConfig({
                  ...config,
                  narasialokasi: val,
                });
              }}
            />
          </div>
          <div className="inline pl-1">
            {" "}
            {config &&
              toRp(
                (config.hargaperolehan - config.nilaisisa) / config.umur
              )}{" "}
            dialokasikan ke:
          </div>
        </div>
        <table className="border-collapse w-full">
          <tbody>
            {alokasi.map((item, index) => (
              <tr key={index}>
                <td className="w-3/5 p-2 px-3 text-left border border-slate-300 table-cell">
                  {item.nama}
                </td>
                <td className="w-2/5 p-2 text-right border border-slate-300 table-cell">
                  <div
                    className={`relative px-1 border-b hover:border-blue-200`}
                  >
                    <span className="pr-3">
                      {toRp(
                        ((config.hargaperolehan - config.nilaisisa) /
                          config.umur) *
                          (item.nilai / 100)
                      )}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
