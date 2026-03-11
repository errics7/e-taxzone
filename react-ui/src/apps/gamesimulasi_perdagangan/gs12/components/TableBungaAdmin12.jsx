import makeStyles from "@mui/styles/makeStyles";
import { TextField } from "@mui/material";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";

import { findIndex, filter } from "lodash";
import { InputGrowUpTextWithName } from "../../componentglobal/inputGrowUpTextWithName";
import { forwardRef } from "react";

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: Number(values.value),
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});
const useStyles = makeStyles((theme) => ({
  inpputTanggal: {
    padding: "0px 0px 0px 0px",
  },
}));

export default function TableBungaAdmin12(props) {
  const classes = useStyles();
  const { dataConfig, setdataConfig } = props;

  //#region
  const handleInputChange = (e, uid) => {
    const { name, value } = e.target;
    const index = findIndex(dataConfig.databahan, { uid: uid });
    const list = [...dataConfig.databahan];
    list[index][name] = value;
    setdataConfig({ ...dataConfig, databahan: list });
  };

  //#endregion

  return (
    <div className="relative mt-8">
      <InputGrowUpTextWithName
        icon={true}
        name="introsoal1"
        type="text"
        placeholder="No"
        value={props.dataConfig ? props.dataConfig.introsoal2 : " "}
        index={0}
        style={`text-base font-medium mr-32 mb-3`}
        onChange={(e) => {
          props.setdataConfig({
            ...props.dataConfig,
            introsoal2: e.target.value,
          });
        }}
      />
      <>
        <div className="overflow-x-auto border-collapse pb-1">
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th className="min-w-20v max-w-20v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Tanggal
                </th>
                <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Pemberi Pinjaman
                </th>
                <th className="min-w-20v max-w-20v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jumlah
                </th>
                <th className="min-w-20v max-w-20v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Jangka Waktu
                </th>
                <th className="min-w-20v max-w-20v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Bunga Tahunan
                </th>
              </tr>
            </thead>
            <tbody>
              {dataConfig &&
                filter(dataConfig.databahan, { type: "bunga" }).map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                    >
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className="relative">
                          <TextField
                            fullWidth
                            className={classes.inpputKeperluan}
                            placeholder="Tanggal"
                            value={item.tgl}
                            name="tgl"
                            onChange={(e) => handleInputChange(e, item.uid)}
                            inputProps={{
                              style: {
                                textAlign: "center",
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className="relative">
                          <TextField
                            fullWidth
                            className={classes.inpputTanggal}
                            placeholder="Pemberi Pinjaman"
                            value={item.keterangan}
                            name="keterangan"
                            onChange={(e) => handleInputChange(e, item.uid)}
                            inputProps={{
                              style: {
                                paddingLeft: 10,
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                          />
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className={`relative`}>
                          <TextField
                            fullWidth
                            placeholder="Jumlah"
                            value={item.jumlah}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="jumlah"
                            inputProps={{
                              prefix: "Rp ",
                              style: {
                                textAlign: "center",
                              },
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                          />
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className={`relative flex justify-center`}>
                          <TextField
                            fullWidth
                            placeholder="Jangka waktu"
                            value={item.durasi}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="durasi"
                            // style={{ width: 60 }}
                            inputProps={{
                              suffix: " Tahun",
                              style: {
                                textAlign: "center",
                              },
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                          {/* <FormControl>
                            <Select
                              labelId="demo-simple-select-autowidth-label"
                              id="demo-simple-select-autowidth"
                              name="satuanwaktu"
                              value={item.satuanwaktu}
                              onChange={(e) => handleInputChange(e, item.uid)}
                              style={{ width: 100 }}
                            >
                              <MenuItem value="tahun">Tahun</MenuItem>
                              <MenuItem value="bulan">Bulan</MenuItem>
                            </Select>
                          </FormControl> */}
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 opacity-30 absolute -inset-y-1 right-0"
                          />
                        </div>
                      </td>
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        {item.keterangan.toLowerCase() === "tanah" ? (
                          <>&nbsp;</>
                        ) : (
                          <div className={`relative`}>
                            <TextField
                              fullWidth
                              placeholder="Bunga Tahunan"
                              value={item.bungath}
                              onChange={(e) => handleInputChange(e, item.uid)}
                              name="bungath"
                              inputProps={{
                                suffix: " %",
                                style: {
                                  textAlign: "center",
                                },
                              }}
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                            <EditIcon
                              fontSize="inherit"
                              className="text-blue-700 opacity-30 absolute inset-y-0 right-0"
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
}
