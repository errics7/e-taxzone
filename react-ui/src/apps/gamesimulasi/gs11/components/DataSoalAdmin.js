import { find } from "lodash";
import NumberFormat from "react-number-format";
import makeStyles from "@mui/styles/makeStyles";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import WarningIcon from "@mui/icons-material/Warning";
import { forwardRef } from "react";

const useStyles = makeStyles((theme) => ({
  inpputBahanNama: {
    background: "#fff",
  },
  btnaddadata: {
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

export default function DataSoalAdmin(props) {
  const classes = useStyles();
  const { data, kode, kpembantu } = props;

  const changeValue = (uid, e) => {
    const { name, value } = e.target;
    props.setData(
      data.map((u, i) => (u.uuid === uid ? { ...u, [name]: value } : u))
    );
  };

  return (
    <div className="p-1 border overflow-x-auto bg-white max-w-4xl">
      <p className="py-3">Pengaturan Data Soal:</p>
      <table className="min-w-full table-fixed mb-4">
        <thead>
          <tr className="break-words bg-slate-50">
            <th className="min-w-10v max-w-10v p-2 border">
              Kode Pembantu Biaya
            </th>
            <th className="min-w-10v max-w-10v p-2 border">Kode Pusat Biaya</th>
            <th className="min-w-25v max-w-25v p-2 border">Keterangan</th>
            <th className="min-w-15v max-w-15v p-2 border">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((x) => x.type === 1)
            .map((el, index) => {
              const kpust = find(kode, { uuid: el.idc });
              const kpem = find(kpembantu, { uuid: el.idr });

              return (
                <tr key={index} className="text-center">
                  <td className="py-2 border">
                    <div className="relative bg-white">{kpem?.alias}</div>
                  </td>
                  <td className="py-2 border">
                    <div className="relative bg-white">{kpust?.alias}</div>
                  </td>
                  <td className="py-2 border">
                    <div className="relative bg-white">
                      <TextField
                        placeholder="Masukkan Keterangan"
                        fullWidth
                        value={el.keterangan ? el.keterangan : ""}
                        name="keterangan"
                        className={classes.inpputBahanNama}
                        onChange={(event) => changeValue(el.uuid, event)}
                        inputProps={{
                          style: {
                            paddingLeft: 8,
                          },
                        }}
                      />
                      {!el.keterangan || el.keterangan === "" ? (
                        <div className="absolute inset-y-0 right-1 z-50">
                          <WarningIcon className="text-red-500 animate-bounce" />
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-2 border table-cell ">
                    <div className="relative px-1">
                      <TextField
                        value={el.value}
                        name="value"
                        fullWidth
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                        onChange={(event) => changeValue(el.uuid, event)}
                      />
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 -right-1 opacity-40 p-0.5"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
        {/* Dummy */}
        <tbody className="border">
          <tr className="">
            <td className="px-2 py-3 table-cell">&nbsp;</td>
            <td className="px-2">&nbsp;</td>
            <td className="px-2">&nbsp;</td>
            <td className="px-2">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
