import makeStyles from "@mui/styles/makeStyles"; 
import NumberFormat from "react-number-format"; 
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import { forwardRef } from "react";

const useStyles = makeStyles((theme) => ({
  inpputBahanNama: {
    paddingLeft: "5px",
    paddingRight: "5px",
    background: "#fff",
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
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

export default function JurnalPembelianAdm(props) {
  const classes = useStyles();
  const data = props.dataConfig;

  return (
    <>
      Kunci Jawaban:
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
              Tanggal
            </th>
            <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
              Nama Rekening
            </th>
            <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
              No Bukti
            </th>
            <th className="w-2/12 font-bold p-0 text-slate-600 border border-slate-300 lg:table-cell ">
              <table className="w-full">
                <tbody>
                  <tr className="border-b bg-slate-50">
                    <td colSpan="2" className="py-1">
                      Kwantitas
                    </td>
                  </tr>
                  <tr className="border-t bg-slate-50">
                    <td className="w-1/2 border-r">Persediaan</td>
                    <td className="w-1/2 border-l">Persekot</td>
                  </tr>
                  <tr className="border-t bg-slate-50">
                    <td className="w-1/2 border-r">BB</td>
                    <td className="w-1/2 border-l">PPN</td>
                  </tr>
                  <tr className="border-t bg-white lg:hover:bg-slate-100">
                    <td className="py-3 border-r">
                      <div className="relative px-3">
                        <input
                          value={data ? data.kpbb1 : 0}
                          placeholder="Masukkan no persediaan"
                          onChange={(event) => {
                            //edited row & REGEX number
                            props.setdata({
                              ...data,
                              kpbb1: event.target.value.replace(/\D/, ""),
                            });
                          }}
                          className="text-center py-1 w-full"
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
                        />
                      </div>
                    </td>
                    <td className="py-3 border-l">
                      <div className="relative px-3">
                        <input
                          value={data ? data.kpppn1 : 0}
                          placeholder="Masukkan no biaya"
                          onChange={(event) => {
                            props.setdata({
                              ...data,
                              kpppn1: event.target.value.replace(/\D/, ""),
                            });
                          }}
                          className="text-center py-1 w-full"
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </th>
            <th className="w-2/12 p-0 font-bold bg-white text-slate-600 border border-slate-300 lg:table-cell">
              <table className="w-full ">
                <tbody>
                  <tr className="border-b bg-slate-50">
                    <td className="p-1">Kredit</td>
                  </tr>
                  <tr className="border-t bg-slate-50">
                    <td className="w-full">Hutang</td>
                  </tr>
                  <tr className="border-t bg-slate-50">
                    <td className="w-full ">Dagang</td>
                  </tr>
                  <tr className="border-t bg-white lg:hover:bg-slate-100">
                    <td className="py-2.5 px-3">
                      <div className="relative bg-white">
                        <TextField
                          value={data ? data.kkhd1 : 0}
                          className="text-center py-1"
                          onChange={(event) => {
                            props.setdata({
                              ...data,
                              kkhd1: event.target.value.replace(/\D/, ""),
                            });
                          }}
                          name="nilai"
                          fullWidth
                          InputProps={{
                            inputComponent: NumberFormatCustom,
                            className: "px-2",
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white lg:hover:bg-slate-100">
            <td className="lg:w-auto p-0 px-1 text-slate-800 text-center border border-b block lg:table-cell relative">
              <TextField
                placeholder="Tanggal"
                fullWidth
                value={data ? data.ktanggal : ""}
                className={classes.inpputBahanNama}
                onChange={(event) => {
                  props.setdata({
                    ...data,
                    ktanggal: event.target.value,
                  });
                }}
              />
            </td>
            <td className="p-0 px-2 text-left border border-b">
              <div className="relative bg-white">
                <TextField
                  placeholder="Nama Rekening"
                  fullWidth
                  value={data ? data.knamarek : ""}
                  className={classes.inpputBahanNama}
                  onChange={(event) => {
                    props.setdata({
                      ...data,
                      knamarek: event.target.value,
                    });
                  }}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 absolute opacity-40 inset-y-1 right-1"
                />
              </div>
            </td>
            <td className="p-0 px-1 text-left border border-b">
              <div className="relative bg-white">
                <TextField
                  placeholder="No Bukti"
                  fullWidth
                  value={data ? data.knobukti : ""}
                  className={classes.inpputBahanNama}
                  onChange={(event) => {
                    props.setdata({
                      ...data,
                      knobukti: event.target.value,
                      fpnomorf: event.target.value,
                    });
                  }}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
                />
              </div>
            </td>
            <td className="p-0 lg:w-auto text-slate-800 text-left border border-b block lg:table-cell relative lg:static">
              <table className="w-full">
                <tbody>
                  <tr className="border-t">
                    <td className="py-2 border-r">
                      <div className="relative px-3">
                        <input
                          value={data ? data.kpbb2 : 0}
                          placeholder="Masukkan no persediaan"
                          onChange={(event) => {
                            props.setdata({
                              ...data,
                              kpbb2: event.target.value.replace(/\D/, ""),
                            });
                          }}
                          className="text-center py-1 w-full"
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
                        />
                      </div>
                    </td>
                    <td className="py-2 border-l">
                      <div className="relative px-3">
                        <input
                          value={data ? data.kpppn2 : 0}
                          placeholder="Masukkan no ppn"
                          onChange={(event) => {
                            props.setdata({
                              ...data,
                              kpppn2: event.target.value.replace(/\D/, ""),
                            });
                          }}
                          className="text-center py-1 w-full"
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td className="p-0 px-3 lg:w-auto text-slate-800 text-left border border-b block lg:table-cell relative lg:static">
              <div className="relative bg-white">
                <TextField
                  value={data ? data.kkhd2 : 0}
                  className="text-center py-1"
                  onChange={(event) => {
                    props.setdata({
                      ...data,
                      kkhd2: event.target.value.replace(/\D/, ""),
                    });
                  }}
                  name="nilai"
                  fullWidth
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    className: "px-2",
                  }}
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
