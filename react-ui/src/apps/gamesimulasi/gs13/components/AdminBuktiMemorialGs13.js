import EditIcon from "@mui/icons-material/Edit";
import { InputGrowUpText } from "../../componentglobal/InputGrowUpText";
import InlinePopInputTText from "./InlinePopInputTText";

export default function AdminBuktiMemorialGs13(props) {
  const config = props.config;
  const alokasi = props.dasaralokasi;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };
  const dnominalkred = alokasi.filter((x) => x.jenis === "kredit");

  return (
    <div className="border bg-white">
      <div className="mx-1 mt-4">Editor bukti memorial:</div>
      <div className="mx-1 mb-3 p-3 border border-dashed">
        <div className="">
          <div className="inline pr-3 relative font-semibold">
            <InputGrowUpText
              value={config ? config.namept : ""}
              onChange={(text) =>
                props.setDataConfig({ ...config, namept: text })
              }
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
                onChange={(text) =>
                  props.setDataConfig({ ...config, nobm: text })
                }
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
              value={config ? config.narasibuktimemo : ""}
              onChange={(val) => {
                props.setDataConfig({
                  ...config,
                  narasibuktimemo: val,
                });
              }}
            />
          </div>
          <div className="inline pl-1">
            {" "}
            {dnominalkred[0] && toRp(dnominalkred[0].value)} dialokasikan ke:
          </div>
        </div>
        <table className="border-collapse w-full">
          <tbody>
            {alokasi
              .filter((x) => x.jenis !== "kredit")
              .map((item, index) => (
                <tr key={index}>
                  <td className="w-3/5 p-2 px-3 text-left border border-slate-300 table-cell">
                    {item.keterangan}
                  </td>
                  <td className="w-2/5 p-2 text-right border border-slate-300 table-cell">
                    <div
                      className={`relative px-1 border-b hover:border-blue-200`}
                    >
                      <span className="pr-3">{toRp(item.value)}</span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
