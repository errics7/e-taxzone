import { ShimmerTable } from "react-shimmer-effects";
import EditIcon from "@mui/icons-material/Edit";

export default function TabelInfoBahanAdmin(props) {
  const data = props.data;

  return (
    <>
      <div className="grid grid-cols-12 overflow-x-auto">
        {data ? (
          <table className="border-collapse w-full col-span-8">
            <thead>
              <tr>
                <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"></th>
                <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Akutansi
                </th>
                <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Penerima Bahan
                </th>
                <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Bagian Gudang
                </th>
                <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Kepala Bagian
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 mb-10 lg:mb-0">
                <td className="p-3 text-slate-800 text-left border border-b relative">
                  Tanggal
                </td>
                <td className="p-0 text-left border border-b"></td>
                <td className="p-3 text-slate-800 text-center border border-b relative">
                  <div className="relative">
                    <input
                      value={data ? data.info_tglpbahan : ""}
                      onChange={(event) => {
                        //edited row
                        props.setdata({
                          ...data,
                          info_tglpbahan: event.target.value,
                        });
                      }}
                      className="text-center"
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-1 right-3"
                    />
                  </div>
                </td>
                <td className="p-3 text-slate-800 text-center border border-b relative">
                  <div className="relative">
                    <input
                      value={data ? data.info_tglbgudang : ""}
                      className="text-center"
                      onChange={(event) => {
                        //edited row
                        props.setdata({
                          ...data,
                          info_tglbgudang: event.target.value,
                        });
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-1 right-3"
                    />
                  </div>
                </td>
                <td className="p-3 text-slate-800 text-center border border-b relative">
                  <div className="relative">
                    <input
                      value={data ? data.info_tglkbagian : ""}
                      className="text-center"
                      onChange={(event) => {
                        //edited row
                        props.setdata({
                          ...data,
                          info_tglkbagian: event.target.value,
                        });
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-1 right-3"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="col-span-8">
            <ShimmerTable row={1} col={5} />
          </div>
        )}
      </div>
    </>
  );
}
