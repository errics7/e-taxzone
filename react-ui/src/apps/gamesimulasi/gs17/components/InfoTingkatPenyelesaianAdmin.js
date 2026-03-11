//#region
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import { ShimmerTable } from 'react-shimmer-effects';
//#endregion

export default function InfoTingkatPenyelesaianAdmin(props) {
  const dataConfig = props.dataConfig;

  return (
    <div className="mt-5">
      <h1 className="font-semibold">Tingkat Penyelesaian</h1>
      <div className="max-w-3xl">
        {props.ori ? (
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="border w-2/6 py-1.5 font-semibold">
                  Keterangan
                </th>
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
                    <TextField
                      value={dataConfig.keteranganpen}
                      placeholder="Keterangan"
                      onChange={(event) =>
                        props.setDataConfig({
                          ...dataConfig,
                          keteranganpen: event.target.value,
                        })
                      }
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                      }}
                      inputProps={{
                        style: {
                          textAlign: "left",
                          fontSize: 15,
                        },
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-20"
                    />
                  </div>
                </td>
                <td className="border">
                  <div className="relative py-1.5 px-3">
                    <Input
                      value={dataConfig ? dataConfig.bbb : 0}
                      onChange={(event) =>
                        props.setDataConfig({
                          ...dataConfig,
                          bbb: event.target.value,
                        })
                      }
                      endAdornment={
                        <InputAdornment position="end">%</InputAdornment>
                      }
                      inputProps={{
                        "aria-label": "weight",
                        style: { textAlign: "right" },
                        maxLength: 3,
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-20"
                    />
                  </div>
                </td>
                <td className="border">
                  <div className="relative py-1.5 px-3">
                    <Input
                      value={dataConfig ? dataConfig.bbp : 0}
                      onChange={(event) =>
                        props.setDataConfig({
                          ...dataConfig,
                          bbp: event.target.value,
                        })
                      }
                      endAdornment={
                        <InputAdornment position="end">%</InputAdornment>
                      }
                      inputProps={{
                        "aria-label": "weight",
                        style: { textAlign: "right" },
                        maxLength: 3,
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-20"
                    />
                  </div>
                </td>
                <td className="border">
                  <div className="relative py-1.5 px-3">
                    <Input
                      value={dataConfig ? dataConfig.btkl : 0}
                      onChange={(event) =>
                        props.setDataConfig({
                          ...dataConfig,
                          btkl: event.target.value,
                        })
                      }
                      endAdornment={
                        <InputAdornment position="end">%</InputAdornment>
                      }
                      inputProps={{
                        "aria-label": "weight",
                        style: { textAlign: "right" },
                        maxLength: 3,
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-20"
                    />
                  </div>
                </td>
                <td className="border">
                  <div className="relative py-1.5 px-3">
                    <Input
                      value={dataConfig ? dataConfig.bop : 0}
                      onChange={(event) =>
                        props.setDataConfig({
                          ...dataConfig,
                          bop: event.target.value,
                        })
                      }
                      endAdornment={
                        <InputAdornment position="end">%</InputAdornment>
                      }
                      inputProps={{
                        "aria-label": "weight",
                        style: { textAlign: "right" },
                        maxLength: 3,
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-20"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <ShimmerTable row={1} col={5} />
        )}
      </div>
    </div>
  );
}
