//#region
import "./adminfakturpajak.css";
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
      style={{ textAlign: "center" }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
    />
  );
});

function AutoGrowTextArea({ value, onChange }) {
  return (
    <div
      className="auto-grow-input"
      style={{
        display: "inline-grid",
        alignItems: "stretch",
        padding: 2,
        borderRadius: 4,
      }}
    >
      <textarea
        rows="1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          gridArea: "1 / 1 / 2 / 2",
          width: "100%",
          padding: 0,
          border: "none",
        }}
      />
      <span
        style={{
          gridArea: "1 / 1 / 2 / 2",
          visibility: "hidden",
          whiteSpace: "pre-wrap",
        }}
      >
        {value}
        {"123"}
      </span>
    </div>
  );
}

//#endregion

export default function FakturPajakAdm(props) {
  const classes = useStyles();
  const data = props.dataConfig;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <>
      Tampilan Faktur Pajak:
      <div className="flex flex-col border">
        <div className="text-center text-xl font-semibold py-2">
          Faktur Pajak
        </div>
        <div className="px-1 flex justify-between border-b">
          <div className="px-2 py-3 flex items-center hover:bg-slate-100">
            <span>Nomor Faktur :</span>
            <div className="relative px-1">{data ? data.fpnomorf : ""}</div>
          </div>
          <div className="px-2 py-3 flex items-center hover:bg-slate-100">
            <span>No :</span>
            <div className="relative px-1">
              <input
                value={data ? data.fpno : ""}
                placeholder="Masukkan no biaya"
                onChange={(event) => {
                  props.setdata({
                    ...data,
                    fpno: event.target.value,
                  });
                }}
                className="text-left py-1 w-full pl-2"
              />
              <EditIcon
                fontSize="inherit"
                className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
              />
            </div>
          </div>
        </div>
        <span className="px-3 mt-3">Pengusaha Kena Pajak</span>
        <div>
          <div className="px-3 mt-1 flex items-center">
            <div className="w-32 flex justify-between">
              <span>Nama</span>
              <span>:</span>
            </div>
            <div className="relative px-1">
              <input
                value={data ? data.fpnama : ""}
                placeholder="Masukkan nama PT"
                onChange={(event) => {
                  props.setdata({
                    ...data,
                    fpnama: event.target.value,
                  });
                }}
                className="text-left py-1 px-2 w-full"
              />
              <EditIcon
                fontSize="inherit"
                className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
              />
            </div>
          </div>
          <div className="px-3 mt-1 flex">
            <div className="w-32 flex justify-between">
              <span>Alamat</span>
              <span>:</span>
            </div>
            <div className="relative px-2">
              <AutoGrowTextArea
                value={data ? data.fpalamat : ""}
                onChange={(da) => {
                  props.setdata({
                    ...data,
                    fpalamat: da,
                  });
                }}
              />
              <EditIcon
                fontSize="inherit"
                className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
              />
            </div>
          </div>
          <div className="px-3 mt-1 flex items-center">
            <div className="w-32 flex justify-between">
              <span>NPWP</span>
              <span>:</span>
            </div>
            <div className="relative px-1">
              <input
                value={data ? data.fpnpwp : ""}
                placeholder="Masukkan NPWP"
                onChange={(event) => {
                  props.setdata({
                    ...data,
                    fpnpwp: event.target.value,
                  });
                }}
                className="text-left py-1 px-2 w-full"
              />
              <EditIcon
                fontSize="inherit"
                className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
              />
            </div>
          </div>
          <div className="px-3 mt-1 flex flex-row items-center">
            <div className="w-1/3 flex">
              <div className="w-32 flex justify-between items-center">
                <span>SK. Pengukuhan</span>
                <span>:</span>
              </div>
              <div className="relative px-1">
                <input
                  value={data ? data.fpskpengukuhan : ""}
                  placeholder="Masukkan SK pengukuhan"
                  onChange={(event) => {
                    props.setdata({
                      ...data,
                      fpskpengukuhan: event.target.value,
                    });
                  }}
                  className="text-left py-1 px-2 w-full"
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
                />
              </div>
            </div>
            <div className="w-1/3 flex">
              <div className="w-20 flex justify-between items-center">
                <span>Tanggal</span>
                <span>:</span>
              </div>
              <div className="relative px-1">
                <input
                  value={data ? data.fptglfaktur : ""}
                  placeholder="Masukkan tanggal"
                  onChange={(event) => {
                    props.setdata({
                      ...data,
                      fptglfaktur: event.target.value,
                    });
                  }}
                  className="text-left py-1 px-2 w-full"
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
                />
              </div>
            </div>
          </div>
          {/* List Faktur */}
          <table className="border-collapse w-full mt-2">
            <thead>
              <tr>
                <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  No.
                </th>
                <th className="w-4/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Nama Barang/ Jasa Kena Pajak
                </th>
                <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Kuantum
                </th>
                <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Satuan
                </th>
                <th className="w-3/12 p-0 font-bold bg-slate-50 text-slate-600 border border-slate-300 lg:table-cell">
                  Harga Jual
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white lg:hover:bg-slate-100">
                <td className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative">
                  <div className="relative px-1">
                    <input
                      value={data ? data.fpitmno : ""}
                      placeholder="No"
                      onChange={(event) => {
                        props.setdata({
                          ...data,
                          fpitmno: event.target.value.replace(/\D/, ""),
                        });
                      }}
                      className="text-center py-1 w-full"
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute opacity-40 inset-y-1 right-1"
                    />
                  </div>
                </td>
                <td className="py-1 px-2 text-left border border-b">
                  <div className="relative bg-white">
                    <TextField
                      placeholder="Nama Rekening"
                      fullWidth
                      value={data ? data.fpitmnama : ""}
                      className={classes.inpputBahanNama}
                      onChange={(event) => {
                        props.setdata({
                          ...data,
                          fpitmnama: event.target.value,
                        });
                      }}
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute opacity-40 inset-y-1 right-1"
                    />
                  </div>
                </td>
                <td className="py-1 px-1 text-left border border-b">
                  <div className="relative px-3">
                    <input
                      value={data ? data.fpitmkuantum : ""}
                      placeholder="jumlah kuantum"
                      onChange={(event) => {
                        props.setdata({
                          ...data,
                          fpitmkuantum: event.target.value.replace(/\D/, ""),
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
                <td className="py-1 lg:w-auto text-slate-800 text-left border border-b block lg:table-cell relative lg:static">
                  <div className="relative px-3">
                    <input
                      value={data ? data.fpitmsatuan : ""}
                      placeholder="harga satuan"
                      onChange={(event) => {
                        props.setdata({
                          ...data,
                          fpitmsatuan: event.target.value.replace(/\D/, ""),
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
                <td className="py-1 px-3 lg:w-auto text-slate-800 text-left border border-b block lg:table-cell relative lg:static">
                  <div className="relative">
                    <TextField
                      value={
                        data
                          ? Number(data.fpitmkuantum) * Number(data.fpitmsatuan)
                          : 0
                      }
                      className="text-center py-1"
                      name="nilai"
                      fullWidth
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="5"
                  className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative"
                >
                  {" "}
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td
                  colSpan="4"
                  className="lg:w-auto py-2 px-5 text-slate-600 font-semibold text-left border border-b block lg:table-cell relative"
                >
                  Jumlah Harga Jual/Pengganti
                </td>
                <td className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative">
                  {data
                    ? toRp(Number(data.fpitmkuantum) * Number(data.fpitmsatuan))
                    : toRp(0)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="4"
                  className="lg:w-auto py-2 px-5 text-slate-600 font-semibold text-left border border-b block lg:table-cell relative"
                >
                  (-) Potongan Harga / Uang Muka
                </td>
                <td className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative"></td>
              </tr>
              <tr>
                <td
                  colSpan="4"
                  className="lg:w-auto py-2 px-5 text-slate-600 font-semibold text-left border border-b block lg:table-cell relative"
                >
                  Dasar Pengenaan Pajak
                </td>
                <td className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative">
                  {data
                    ? toRp(Number(data.fpitmkuantum) * Number(data.fpitmsatuan))
                    : toRp(0)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="4"
                  className="lg:w-auto py-2 px-5 text-slate-600 font-semibold text-left border border-b block lg:table-cell relative"
                >
                  PPN = 10% x Dasar Pengenaan Pajak
                </td>
                <td className="lg:w-auto py-1 px-1 text-slate-800 text-center border border-b block lg:table-cell relative">
                  {data
                    ? toRp(
                        0.1 *
                          (Number(data.fpitmkuantum) * Number(data.fpitmsatuan))
                      )
                    : toRp(0)}
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <br />
          <div className="flex flex-row-reverse">
            <div className="flex flex-col w-1/4">
              <div className="relative min-w-25v">
                Malang, {data ? data.ktanggal : ""}
                {/* <AutoGrowTextArea
                value={data ? data.fpitmtgl : ""}
                onChange={(da) => {
                  props.setdata({
                    ...data,
                    fpitmtgl: da,
                  });
                }}
              />  */}
              </div>
              <br />
              <br />
              <div className="relative w-48">
                <input
                  value={data ? data.fpitmpemilik : ""}
                  placeholder="Pemilik"
                  onChange={(event) => {
                    props.setdata({
                      ...data,
                      fpitmpemilik: event.target.value,
                    });
                  }}
                  className="text-left py-1 px-2 w-full"
                />
                <EditIcon
                  fontSize="inherit"
                  className="text-blue-700 absolute opacity-40 inset-y-1 right-3"
                />
              </div>
            </div>
          </div>
          <br />
          <br />
        </div>
      </div>
    </>
  );
}
