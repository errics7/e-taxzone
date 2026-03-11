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

export default function TabelControlAdmin(props) {
  const data = props.data;
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
      <div>Data Kunci:</div>
      <div className="overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Kode
              </th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                No. Pusat Biaya
              </th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                No. Pembantu Biaya
              </th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Nilai
              </th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Posisi (Debit/Kredit)
              </th>
              <th className="p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Keperluan
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
                  <td className="min-w-10v max-w-10v px-1 py-2  text-slate-800 text-center border border-b">
                    {item.kode ? (
                      item.kode
                    ) : (
                      <span className="opacity-30">Kode</span>
                    )}
                  </td>
                  <td className="min-w-10v max-w-10v px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative px-3">
                      <input
                        value={item.nopusatbiaya}
                        placeholder="Masukkan no biaya"
                        onChange={(event) => {
                          //edited row & REGEX number
                          props.setdata(
                            data.map((el, i) =>
                              index === i
                                ? {
                                    ...el,
                                    nopusatbiaya: event.target.value.replace(
                                      /\D/,
                                      ""
                                    ),
                                    kode:
                                      event.target.value.replace(/\D/, "") +
                                      (el.nopembantubiaya.toString().length > 0
                                        ? "." + el.nopembantubiaya
                                        : ""),
                                  }
                                : el
                            )
                          );
                        }}
                        className="text-center py-1 w-full"
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-40"
                      />
                    </div>
                  </td>
                  <td className="min-w-10v max-w-10v px-1 py-2  text-slate-800 text-center border border-b">
                    <div className="relative px-3">
                      <input
                        value={item.nopembantubiaya}
                        placeholder="Masukkan no biaya"
                        onChange={(event) => {
                          var dat = event.target.value.replace(/\D/, "");
                          //edited row & REGEX number
                          props.setdata(
                            data.map((el, i) =>
                              index === i
                                ? {
                                    ...el,
                                    nopembantubiaya: dat,
                                    kode:
                                      el.nopusatbiaya +
                                      (dat.length > 0 ? "." + dat : ""),
                                  }
                                : el
                            )
                          );
                        }}
                        className="text-center py-1 w-full"
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-40"
                      />
                    </div>
                  </td>
                  <td className="min-w-20v max-w-20v px-3 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <TextField
                        value={item.nilai}
                        className="text-center py-1"
                        onChange={(event) => {
                          //edited row & REGEX number
                          props.setdata(
                            data.map((el, i) =>
                              index === i
                                ? {
                                    ...el,
                                    nilai: event.target.value.replace(/\D/, ""),
                                  }
                                : el
                            )
                          );
                        }}
                        name="nilai"
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-0 opacity-40"
                      />
                    </div>
                  </td>
                  <td className="min-w-10v max-w-10v px-3 py-2  text-slate-800 text-center border border-b">
                    <div className="relative">
                      <FormControl fullWidth={true}>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={item.posisi}
                          autoWidth={true}
                          onChange={(event) => {
                            //edited row selected
                            props.setdata(
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
                          <MenuItem value="debit">Debit</MenuItem>
                          <MenuItem value="kredit">Kredit</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </td>
                  <td className="min-w-20v max-w-20v px-1 py-2 text-slate-800 text-center border border-b">
                    <div className="relative">
                      <TextField
                        multiline
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
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="col-span-2 py-2 px-3 w-full border text-left flex justify-between flex-row items-center">
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<LibraryAddIcon />}
          onClick={() => {
            props.setdata([
              ...data,
              {
                kode: "",
                nopusatbiaya: "",
                nopembantubiaya: "",
                nilai: 0,
                posisi: "debit",
                keperluan: "",
              },
            ]);
          }}
        >
          Tambah
        </Button>
        <Button
          onClick={() => {
            props.setdata([]);
          }}
        >
          Hapus semua
        </Button>
      </div>
    </>
  );
}
