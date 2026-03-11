import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import NumberFormat from "react-number-format";
import MenuPop from "./MenuDelete";
import { forwardRef } from "react";
import { Tooltip } from "@material-ui/core";

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
            value: values.value,
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
    paddingLeft: "20px",
  },
}));

export default function TabelBahanAdmin(props) {
  const classes = useStyles();
  const dataSoal = props.data;

  const handleRemoveItemSoal = (idx) => {
    // assigning the list to temp variable
    const temp = [...dataSoal];
    // removing the element using splice
    temp.splice(idx, 1);
    // updating the list
    props.setdata(temp);
  };

  return (
    <>
      Data Barang :
      <div className="overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th
                rowSpan="2"
                className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Nama Barang
              </th>
              <th
                colSpan="5"
                className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Kartu persediaan keluar
              </th>
              <th
                rowSpan="2"
                className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300"
              >
                Keterangan
              </th>
            </tr>
            <tr>
              <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Satuan
              </th>
              <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Diminta
              </th>
              <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Kwt
              </th>
              <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Harga
              </th>
              <th className="p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            {dataSoal &&
              dataSoal.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white lg:hover:bg-slate-100  mb-10"
                >
                  <td className="min-w-25v max-w-25v text-slate-800 text-left border relative">
                    <div className="absolute inset-y-0 left-0 pl-1 flex items-center">
                      <Tooltip title="centang untuk mengaktifkan di soal" arrow>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.status}
                              onChange={(event) => {
                                const stat = item.status ? true : !item.status;
                                //
                                const dat = [...dataSoal].map((el, i) => ({
                                  ...el,
                                  status: false,
                                }));
                                // memberi last sorting
                                props.setdata(
                                  dat.map((el, i) =>
                                    index === i
                                      ? {
                                          ...el,
                                          status: stat,
                                        }
                                      : el
                                  )
                                );
                              }}
                            />
                          }
                        />
                      </Tooltip>
                    </div>
                    <TextField
                      placeholder="Nama bahan"
                      fullWidth
                      value={item.namabhn}
                      className={classes.inpputBahanNama}
                      onChange={(event) => {
                        //edited row
                        props.setdata(
                          dataSoal.map((el, i) =>
                            index === i
                              ? {
                                  ...el,
                                  namabhn: event.target.value,
                                }
                              : el
                          )
                        );
                      }}
                      inputProps={{ style: { paddingLeft: 10 } }}
                    />
                  </td>
                  <td className="min-w-5v max-w-5v border">
                    <TextField
                      placeholder="satuan"
                      className={classes.inpputqty}
                      value={item.satuan}
                      name="satuan"
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center" },
                      }}
                      onChange={(event) => {
                        //edited row
                        props.setdata(
                          dataSoal.map((el, i) =>
                            index === i
                              ? {
                                  ...el,
                                  satuan: event.target.value,
                                }
                              : el
                          )
                        );
                      }}
                    />
                  </td>
                  <td className="min-w-5v max-w-5v border">
                    <TextField
                      placeholder="Diminta"
                      className={classes.inpputqty}
                      value={item.dimintaqty}
                      name="dimintaqty"
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center" },
                      }}
                      onChange={(event) => {
                        //edited row
                        props.setdata(
                          dataSoal.map((el, i) =>
                            index === i
                              ? {
                                  ...el,
                                  dimintaqty: event.target.value,
                                  // hrgjumlah:
                                  //   Number(event.target.value) *
                                  //   Number(el.hrgsatuan),
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
                  <td className="min-w-5v max-w-5v border">
                    <TextField
                      placeholder="kwt"
                      className={classes.inpputqty}
                      value={item.keluarqty}
                      name="keluarqty"
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center" },
                      }}
                      onChange={(event) => {
                        //edited row
                        props.setdata(
                          dataSoal.map((el, i) =>
                            index === i
                              ? {
                                  ...el,
                                  keluarqty: event.target.value,
                                  hrgjumlah:
                                    Number(event.target.value) *
                                    Number(el.hrgsatuan),
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
                  <td className="min-w-10v max-w-10v border">
                    <TextField
                      style={{ marginTop: "10px" }}
                      placeholder="Harga"
                      margin="normal"
                      value={item.hrgsatuan}
                      name="nilaisatuan"
                      className={classes.inpputJumlah}
                      onChange={(event) => {
                        //edited row
                        props.setdata(
                          dataSoal.map((el, i) =>
                            index === i
                              ? {
                                  ...el,
                                  hrgsatuan: event.target.value,
                                  hrgjumlah:
                                    event.target.value * Number(el.keluarqty),
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
                        style: { textAlign: "center" },
                      }}
                    />
                  </td>
                  <td className="min-w-10v max-w-10v border">
                    <TextField
                      style={{ marginTop: "10px" }}
                      placeholder="Jumlah"
                      margin="normal"
                      value={item.hrgjumlah}
                      name="nilaijumlah"
                      className={classes.inpputJumlah}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                        readOnly: true,
                      }}
                      inputProps={{
                        prefix: "Rp ",
                        style: { textAlign: "center" },
                      }}
                    />
                  </td>
                  <td className="min-w-10v max-w-10v p-3 text-slate-800 text-center border relative">
                    <TextField
                      multiline
                      fullWidth
                      className={classes.inpputKeperluan}
                      placeholder="Keperluan"
                      value={item.keperluan}
                      onChange={(event) => {
                        //edited row
                        props.setdata(
                          dataSoal.map((el, i) =>
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
                ...dataSoal,
                {
                  namabhn: "",
                  satuan: "kg",
                  dimintaqty: 0,
                  keluarqty: 0,
                  hrgsatuan: 0,
                  hrgjumlah: 0,
                  keperluan: "",
                  status: false,
                },
              ]);
            }}
          >
            Tambah
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
