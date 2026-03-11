import makeStyles from '@mui/styles/makeStyles';
import { TextareaAutosize, TextField } from "@mui/material";
import NumberFormat from "react-number-format"; 
import EditIcon from "@mui/icons-material/Edit";
import { findIndex, filter } from "lodash";
import { InputGrowUpTextWithName } from "../../componentglobal/inputGrowUpTextWithName";
import { forwardRef } from 'react';
 
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

export default function TableAsetAdmin12(props) {
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
    <div className="relative mt-5">
      <div className="mt-2 mb-5 relative">
        <TextareaAutosize
          className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
          value={props.dataConfig ? props.dataConfig.introsoal : " "}
          onChange={(e) => {
            props.setdataConfig({
              ...props.dataConfig,
              introsoal: e.target.value,
            });
          }}
        />
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 opacity-70 absolute inset-y-1 right-0"
        />
      </div>
      <InputGrowUpTextWithName
        icon={true}
        name="introsoal1"
        type="text"
        placeholder="No"
        value={props.dataConfig ? props.dataConfig.introsoal1 : " "}
        index={0}
        style={`text-base font-medium mr-32`}
        onChange={(e) => {
          props.setdataConfig({
            ...props.dataConfig,
            introsoal1: e.target.value,
          });
        }}
      />
      <div className="mt-2 mb-0 relative">
        <TextareaAutosize
          className="w-full p-1 font-medium font-sans focus:ring-1 focus:ring-violet-300"
          value={props.dataConfig ? props.dataConfig.introsoal1sub : " "}
          onChange={(e) => {
            props.setdataConfig({
              ...props.dataConfig,
              introsoal1sub: e.target.value,
            });
          }}
        />
        <EditIcon
          fontSize="inherit"
          className="text-blue-700 opacity-70 absolute inset-y-1 right-0"
        />
      </div>
      <>
        <div className="overflow-x-auto border-collapse pb-1">
          <table className="border-collapse min-w-full table-fixed">
            <thead>
              <tr>
                <th className="min-w-20v max-w-20v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Nama Aset
                </th>
                <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Tanggal Perolehan
                </th>
                <th className="min-w-20v max-w-20v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Harga Perolehan
                </th>
                <th className="min-w-20v max-w-20v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Nilai Sisa
                </th>
                <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                  Masa Manfaat
                </th>
              </tr>
            </thead>
            <tbody>
              {dataConfig &&
                filter(dataConfig.databahan, { type: "aset" }).map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
                    >
                      <td className="px-1 py-2  text-slate-800 text-center border border-b">
                        <div className="relative">
                          <TextField
                            fullWidth
                            className={classes.inpputTanggal}
                            placeholder="Nama Aset"
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
                        <div className="relative">
                          <TextField
                            fullWidth
                            className={classes.inpputKeperluan}
                            placeholder="Tanggal Perolehan"
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
                        <div className={`relative`}>
                          <TextField
                            fullWidth
                            placeholder="Harga Perolehan"
                            value={item.perolehan}
                            onChange={(e) => handleInputChange(e, item.uid)}
                            name="perolehan"
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
                        {item.keterangan.toLowerCase() === "tanah" ? (
                          <>&nbsp;</>
                        ) : (
                          <div className={`relative`}>
                            <TextField
                              fullWidth
                              placeholder="-"
                              value={item.nilaisisa === 0 ? "" : item.nilaisisa}
                              onChange={(e) => handleInputChange(e, item.uid)}
                              name="nilaisisa"
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
                        )}
                      </td>
                      <td className="px-1 py-2 text-slate-800 text-center border border-b">
                        {item.keterangan.toLowerCase() === "tanah" ? (
                          <>&nbsp;</>
                        ) : (
                          <div className={`relative flex justify-center`}>
                            <TextField
                              placeholder="Masa"
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
