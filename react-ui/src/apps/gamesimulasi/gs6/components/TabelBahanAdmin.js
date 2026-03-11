import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import MenuPop from "./MenuDelete";
import { forwardRef } from "react";
import { TextField } from "@mui/material";

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
  btnsave: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "15px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
  btnIconEdit: {
    marginTop: "-5px",
  },
  btnadd: {
    marginTop: "5px",
    textTransform: "capitalize",
    backgroundColor: "#2D90DA",
    "&:hover": {
      backgroundColor: "#216CA3",
      boxShadow: "none",
    },
  },
  btnreset: {
    marginTop: "15px",
    marginLeft: "10px",
  },
  btnresetsoal: {
    textTransform: "capitalize",
  },
  inpputqty: {
    marginLeft: "10px",
    marginRight: "10px",
  },
  inpputJumlah: {
    marginLeft: "5px",
    marginRight: "5px",
  },
  inpputKeperluan: {
    marginRight: "10px",
  },
  inpputBahanNama: {
    paddingLeft: "0px",
  },
}));

export default function TabelBahanAdmin(props) {
  const classes = useStyles();
  const { data, dataConfig } = props;

  const handleRemoveItemSoal = (idx) => {
    // assigning the list to temp variable
    const temp = [...data];
    // removing the element using splice
    temp.splice(idx, 1);
    // updating the list
    props.setdata(temp);
  };

  return (
    <>
      <div className="text-lg uppercase text-center mt-3 border-t pt-3 mx-10">
        Bukti Permintaan & Pemakaian Bahan
      </div>
      <div className="text-base flex flex-col items-center uppercase text-center">
        <div className="flex mt-1 mb-3">
          <div>NO BPPB : </div>
          <div className="px-2 relative">
            <input
              value={dataConfig ? dataConfig.bppb : ""}
              placeholder="Masukkan No bppb"
              className="text-left px-3"
              onChange={(event) => {
                //edited row
                props.setdataConfig({
                  ...dataConfig,
                  bppb: event.target.value,
                });
              }}
            />
            <EditIcon
              fontSize="inherit"
              className="text-blue-700 absolute inset-y-0 right-0 opacity-40"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                No
              </th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Bahan Nama
              </th>
              <th className="font-bold bg-slate-50 text-slate-600 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td colSpan="3">Kwantitas</td>
                    </tr>
                    <tr className="border-t">
                      <td className="border-r">Sat</td>
                      <td className="border-r">Diminta</td>
                      <td className="border-l">Keluar</td>
                    </tr>
                  </tbody>
                </table>
              </th>
              <th className="font-bold bg-slate-50 text-slate-600 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td colSpan="2">Harga Pokok</td>
                    </tr>
                    <tr className="border-t">
                      <td className="border-r">/sat (Rp)</td>
                      <td className="">Jumlah (Rp)</td>
                    </tr>
                  </tbody>
                </table>
              </th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Keperluan
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, index) => (
                <tr key={index} className="bg-white lg:hover:bg-slate-100">
                  <td className="lg:w-auto text-center p-3 text-slate-800 border border-b">
                    {index + 1}
                  </td>
                  <td className="min-w-15v max-w-15v p-1 text-slate-800 text-left border border-b">
                    <TextField
                      placeholder="Nama bahan"
                      fullWidth
                      value={item.namabhn}
                      className={classes.inpputBahanNama}
                      onChange={(event) => {
                        //edited row
                        props.setdata(
                          data.map((el, i) =>
                            index === i
                              ? {
                                  ...el,
                                  namabhn: event.target.value,
                                }
                              : el
                          )
                        );
                      }}
                    />
                  </td>
                  <td className="p-0 text-left border border-b">
                    <table className="w-full h-full text-center">
                      <tbody>
                        <tr className="">
                          <td className="min-w-5v max-w-5v border-r">
                            <FormControl fullWidth={true}>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={item.satuan}
                                autoWidth={true}
                                onChange={(event) => {
                                  //edited row selected
                                  props.setdata(
                                    data.map((el, i) =>
                                      index === i
                                        ? {
                                            ...el,
                                            satuan: event.target.value,
                                          }
                                        : el
                                    )
                                  );
                                }}
                              >
                                <MenuItem value="kg">Kg</MenuItem>
                                <MenuItem value="liter">Liter</MenuItem>
                              </Select>
                            </FormControl>
                          </td>
                          <td className="min-w-5v max-w-5v border-r">
                            <TextField
                              placeholder="jumlah"
                              className={classes.inpputqty}
                              value={item.diminta}
                              name="diminta"
                              inputProps={{
                                min: 0,
                                style: { textAlign: "center" },
                              }}
                              onChange={(event) => {
                                //edited row
                                props.setdata(
                                  data.map((el, i) =>
                                    index === i
                                      ? {
                                          ...el,
                                          diminta: event.target.value,
                                        }
                                      : el
                                  )
                                );
                              }}
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                          </td>
                          <td className="min-w-5v max-w-5v border-l">
                            <TextField
                              placeholder="jumlah"
                              className={classes.inpputqty}
                              value={item.keluar}
                              name="keluar"
                              inputProps={{
                                min: 0,
                                style: { textAlign: "center" },
                              }}
                              onChange={(event) => {
                                //edited row
                                props.setdata(
                                  data.map((el, i) =>
                                    index === i
                                      ? {
                                          ...el,
                                          keluar: event.target.value,
                                          hargajumlah:
                                            Number(event.target.value) *
                                            Number(el.hargasatuan),
                                        }
                                      : el
                                  )
                                );
                              }}
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td className="p-0 lg:w-auto text-slate-800 text-left border border-b lg:static">
                    <table className="w-full h-full text-center">
                      <tbody>
                        <tr className="">
                          <td className="min-w-10v max-w-10v border-r">
                            <TextField
                              style={{ marginTop: "10px" }}
                              placeholder="Masukkan Jumlah"
                              margin="normal"
                              value={item.hargasatuan}
                              name="hargasatuan"
                              className={classes.inpputJumlah}
                              onChange={(event) => {
                                //edited row
                                props.setdata(
                                  data.map((el, i) =>
                                    index === i
                                      ? {
                                          ...el,
                                          hargasatuan: event.target.value,
                                          hargajumlah:
                                            event.target.value *
                                            Number(el.keluar),
                                        }
                                      : el
                                  )
                                );
                              }}
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                              }}
                              inputProps={{
                                prefix: "Rp ",
                              }}
                            />
                          </td>
                          <td className="min-w-10v max-w-10v border-r">
                            <TextField
                              style={{ marginTop: "10px" }}
                              placeholder="Masukkan Jumlah"
                              margin="normal"
                              value={item.hargajumlah}
                              name="nilaijumlah"
                              className={classes.inpputJumlah}
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                                readOnly: true,
                              }}
                              inputProps={{
                                prefix: "Rp ",
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td className="min-w-15v max-w-15v p-3 text-slate-800 text-center border border-b relative">
                    <TextField
                      multiline
                      className={classes.inpputKeperluan}
                      placeholder="Keperluan"
                      value={item.keperluan}
                      onChange={(event) => {
                        //edited row
                        props.setdata(
                          data.map((el, i) =>
                            index === i
                              ? {
                                  ...el,
                                  keperluan: event.target.value,
                                }
                              : el
                          )
                        );
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <MenuPop
                        index={index}
                        removeButton={(id) => handleRemoveItemSoal(id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-evenly">
        <div className="col-span-2 py-2 px-3 w-full border text-left flex justify-between flex-row items-center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.btnadd}
            startIcon={<LibraryAddIcon />}
            onClick={() => {
              props.setdata([
                ...data,
                {
                  namabhn: "",
                  satuan: "kg",
                  diminta: 0,
                  keluar: 0,
                  hargasatuan: 0,
                  hargajumlah: 0,
                  keperluan: "",
                },
              ]);
            }}
          >
            Tambah soal
          </Button>
          <Button
            className={classes.btnresetsoal}
            onClick={() => {
              props.setdata([]);
            }}
          >
            Hapus semua
          </Button>
        </div>
      </div>
    </>
  );
}
