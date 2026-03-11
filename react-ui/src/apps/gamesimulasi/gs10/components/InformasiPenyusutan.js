import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import PostAddIcon from "@mui/icons-material/PostAdd";
import makeStyles from "@mui/styles/makeStyles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import MenuPop from "./MenuDeleteAlokasi";
import { forwardRef } from "react";
import { TextField } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  btnaddalokasi: {
    color: "#FFF",
    backgroundColor: "#2D90DA",
    "&:hover": {
      backgroundColor: "#216CA3",
      boxShadow: "none",
    },
    textTransform: "capitalize",
  },
}));

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
      style={{
        textAlign: "right",
        paddingRight: 10,
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

export default function InformasiPenyusutan(props) {
  const classes = useStyles();

  const data = props.data;
  const dataAlokasi = props.alokasi;
  const selected = props.dataselected;

  const addAlokasi = () => {
    props.setalokasi([
      ...dataAlokasi,
      {
        nama: "",
        nilai: 0,
      },
    ]);
  };
  const handleRemoveItemAlokasi = (idx) => {
    // assigning the list to temp variable
    const temp = [...dataAlokasi];
    // removing the element using splice
    temp.splice(idx, 1);
    // updating the list
    props.setalokasi(temp);
  };

  return (
    <div className="mt-8">
      <span>Informasi Penyusutan:</span>
      <table className="border-collapse w-full">
        <tbody>
          <tr>
            <td className="w-2/6 p-3 border table-cell">Harga Perolehan</td>
            <td className="w-2/6 p-3 border table-cell">
              <div className="relative">
                <input
                  placeholder="Gedung (*contoh)"
                  value={data ? data.perolehan : ""}
                  onChange={(event) => {
                    props.setdata({
                      ...data,
                      perolehan: event.target.value,
                    });
                  }}
                  className="text-left py-1 pl-1 bg-white rounded-sm"
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 absolute inset-y-0 right-1 opacity-50"
                />
              </div>
            </td>
            <td className="w-2/6 p-2 border table-cell">
              <div className="relative px-1">
                <TextField
                  value={data ? data.hargaperolehan : ""}
                  name="nilai"
                  fullWidth
                  InputProps={{
                    // disableUnderline: true,
                    inputComponent: NumberFormatCustom,
                  }}
                  onChange={(event) => {
                    props.setdata({
                      ...data,
                      hargaperolehan: Number(event.target.value),
                    });
                  }}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 absolute inset-y-0 -right-1 opacity-40"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="w-2/6 p-3 border table-cell">
              Nilai sisa
            </td>
            <td className="w-2/6 p-2 border table-cell">
              <div className="relative px-1">
                <TextField
                  value={data ? data.nilaisisa : ""}
                  name="nilai"
                  fullWidth
                  InputProps={{
                    // disableUnderline: true,
                    inputComponent: NumberFormatCustom,
                  }}
                  onChange={(event) => {
                    props.setdata({
                      ...data,
                      nilaisisa: Number(event.target.value),
                    });
                  }}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 absolute inset-y-0 -right-1 opacity-40"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="w-2/6 p-3 border table-cell">
              Umur ekonomis (tahun)
            </td>
            <td className="w-2/6 p-2 border table-cell">
              <div className="relative px-1">
                <NumberFormat
                  decimalSeparator="."
                  thousandSeparator={true}
                  allowNegative={false}
                  value={data ? data.umur : ""}
                  onChange={(event) => {
                    props.setdata({
                      ...data,
                      umur: event.target.value,
                    });
                  }}
                  className="text-right py-1 px-3 w-full text-base border-b"
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 absolute inset-y-0 -right-1 opacity-40"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="3" className="w-2/6 p-3 border table-cell">
              Alokasi :
            </td>
          </tr>
        </tbody>
        <tbody>
          {dataAlokasi.map((item, index) => (
            <tr key={index}>
              <td className="w-2/6 p-0 border table-cell">
                <div className="flex items-center justify-between px-2 p-2">
                  <MenuPop
                    index={index}
                    removeButton={(id) => handleRemoveItemAlokasi(id)}
                  />
                  <Tooltip
                    title="Kode akun digunakan sebagai acuan alokasi"
                    placement="right-start"
                    arrow
                  >
                    <Select
                      value={item.kodeacuan ? item.kodeacuan : ""}
                      onChange={(event) => {
                        console.log(event);
                        props.setalokasi(
                          dataAlokasi.map((el, i) =>
                            index === i
                              ? {
                                  ...el,
                                  kodeacuan: event.target.value,
                                }
                              : el
                          )
                        );
                      }}
                      fullWidth
                      displayEmpty
                      size="small"
                      placeholder="Pilih kode"
                      inputProps={{ "aria-label": "Without label" }}
                      className={`w-16 text-center ${
                        !selected.find((x) => x.code === item.kodeacuan) &&
                        " bg-red-400 animate-pulse"
                      }`}
                    >
                      <MenuItem disabled value="">
                        <em>Pilih kode</em>
                      </MenuItem>
                      {selected.map((item, index) => (
                        <MenuItem
                          key={index}
                          value={item.code}
                          disabled={item.jenis === "kredit" ? true : false}
                        >
                          <div
                            className={` ${
                              item.jenis === "kredit" && "text-red-500 font-extrabold"
                            }`}
                          >
                            {item.code}
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </Tooltip>
                </div>
              </td>
              <td className="w-2/6 p-3 border table-cell">
                <div className="relative">
                  <input
                    placeholder="Sie Pulp (*contoh)"
                    value={item.nama}
                    onChange={(event) =>
                      props.setalokasi(
                        dataAlokasi.map((el, i) =>
                          index === i
                            ? {
                                ...el,
                                nama: event.target.value,
                              }
                            : el
                        )
                      )
                    }
                    className="text-left py-1 pl-1 bg-white rounded-sm"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute inset-y-0 right-1 opacity-50"
                  />
                </div>
              </td>
              <td className="w-2/6 p-2 border table-cell">
                <div className="relative px-1">
                  <Input
                    value={item.nilai}
                    onChange={(event) =>
                      props.setalokasi(
                        dataAlokasi.map((el, i) =>
                          index === i
                            ? {
                                ...el,
                                nilai: Number(event.target.value),
                              }
                            : el
                        )
                      )
                    }
                    endAdornment={
                      <InputAdornment position="end">%</InputAdornment>
                    }
                    className="text-center"
                    inputProps={{
                      "aria-label": "weight",
                      style: { textAlign: "right" },
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td className="w-2/6 p-3 table-cell"></td>
            <td colSpan="2" className="w-2/6 p-3 border table-cell">
              <Button
                variant="contained"
                size="small"
                className={classes.btnaddalokasi}
                startIcon={<PostAddIcon />}
                onClick={() => addAlokasi()}
              >
                Tambah Alokasi
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
