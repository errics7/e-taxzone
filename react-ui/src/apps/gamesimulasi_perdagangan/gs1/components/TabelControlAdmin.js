import makeStyles from "@mui/styles/makeStyles";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import Button from "@mui/material/Button";

import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import MenuPop from "./MenuDelete";
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
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

const useStyles = makeStyles((theme) => ({
  inpputname: {
    paddingLeft: "3px",
    paddingRight: "3px",
  },
  inpputtgl: {
    paddingLeft: "3px",
    paddingRight: "3px",
  },
  inpputselect: {
    paddingLeft: "2px",
    paddingRight: "13px",
  },
}));

export default function TabelControlAdmin(props) {
  const classes = useStyles();

  const data = props.data;
  const handleRemoveItemSoal = (idx) => {
    // assigning the list to temp variable
    const temp = [...data];
    // removing the element using splice
    temp.splice(idx, 1);
    // updating the list
    props.setData(temp);
  };

  return (
    <>
      <table className="border-collapse w-full col-span-8">
        <thead>
          <tr>
            <th className="w-4/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 table-cell">
              {props.named === "hutang" ? "Pemasok" : "Pelanggan"}
            </th>
            <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 table-cell">
              {props.named === "hutang" ? "Tanggal Beli" : "Tanggal Jual"}
            </th>
            <th className="w-3/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 table-cell">
              Jumlah
            </th>
            <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 table-cell">
              Posisi
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-t border-slate-300 lg:hover:bg-slate-100 "
              >
                <td className="lg:w-auto px-1 py-2 text-slate-800 text-center border border-b table-cell relative">
                  <div className="relative">
                    <TextField
                      className={classes.inpputname}
                      fullWidth
                      placeholder={
                        props.named === "hutang" ? "Pemasok" : "Pelanggan"
                      }
                      value={item.name}
                      onChange={(event) => {
                        props.setData(
                          data.map((el, i) =>
                            index === i
                              ? {
                                  ...el,
                                  name: event.target.value,
                                }
                              : el
                          )
                        );
                      }}
                      inputProps={{
                        style: {
                          paddingLeft: 5,
                        },
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                    />
                  </div>
                </td>
                <td className="lg:w-auto px-1 py-2 text-slate-800 text-center border border-b table-cell relative">
                  <div className="relative">
                    <TextField
                      className={classes.inpputtgl}
                      // inputProps={{ style: { textAlign: "center" } }}
                      placeholder="Tanggal"
                      fullWidth
                      value={item.tgl}
                      onChange={(event) => {
                        props.setData(
                          data.map((el, i) =>
                            index === i
                              ? {
                                  ...el,
                                  tgl: event.target.value,
                                }
                              : el
                          )
                        );
                      }}
                      inputProps={{
                        style: {
                          textAlign: "center",
                        },
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                    />
                  </div>
                </td>
                <td className="lg:w-auto px-3 py-2  text-slate-800 text-center border border-b table-cell relative">
                  <div className="relative">
                    <TextField
                      className={classes.inpputtgl}
                      fullWidth
                      value={item.jumlah}
                      onChange={(event) => {
                        //edited row & REGEX number
                        props.setData(
                          data.map((el, i) =>
                            index === i
                              ? {
                                  ...el,
                                  jumlah: event.target.value.replace(/\D/, ""),
                                }
                              : el
                          )
                        );
                      }}
                      name="jumlah"
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      inputProps={{
                        style: {
                          textAlign: "center",
                        },
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-30"
                    />
                  </div>
                </td>
                <td className="lg:w-auto px-2 py-2  text-slate-800 text-center border border-b table-cell relative">
                  <div className="relative">
                    <FormControl
                      fullWidth={true}
                      className={classes.inpputselect}
                    >
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={item.posisi}
                        autoWidth={true}
                        onChange={(event) => {
                          props.setData(
                            data.map((el, i) =>
                              index === i
                                ? {
                                    ...el,
                                    posisi: event.target.value,
                                  }
                                : el
                            )
                          );
                        }}
                      >
                        <MenuItem value="debit">Debet</MenuItem>
                        <MenuItem value="kredit">Kredit</MenuItem>
                      </Select>
                    </FormControl>
                    <div className="absolute inset-y-0 -right-2 flex items-center">
                      <MenuPop
                        index={index}
                        removeButton={(id) => handleRemoveItemSoal(id)}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="col-span-2 py-2 px-3 w-full border text-left flex justify-between flex-row items-center">
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.btnadd}
          startIcon={<LibraryAddIcon />}
          onClick={() => {
            props.setData([
              ...data,
              {
                name: "PT. Name",
                tgl: "03-Nov-2021",
                tgl_worksheet: "1-Des-2021",
                jumlah: 0,
                posisi: props.named === "hutang" ? "kredit" : "debit",
                jenis: props.named,
              },
            ]);
          }}
        >
          Tambah
        </Button>
        <Button
          className={classes.btnresetsoal}
          onClick={() => {
            props.setData([]);
          }}
        >
          Hapus semua
        </Button>
      </div>
    </>
  );
}
