import "./adminfakturpajak.css";
import { InputGrowUp } from "./InputGrowUp";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
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
    />
  );
});

export default function AdminFakturPajak(props) {
  // const classes = useStyles();
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
      <div>
        Tampilan <span className="italic">Data (soal)</span>:
      </div>
      <div className="flex flex-col border">
        <div className="text-center text-xl font-semibold py-2">
          Faktur Pajak
        </div>
        <div className="px-1 flex justify-between border-b">
          <div className="px-2 py-3 flex items-center">
            <span>Nomor Faktur :</span>
            <div className="relative px-1">{data && data.kp_nobukti3}</div>
          </div>
          <div className="px-2 py-3 flex items-center">
            <span>No : MT 462</span>
          </div>
        </div>
        <span className="px-3 mt-3">Pengusaha Kena Pajak</span>
        <div>
          {/* INfo */}
          <div>
            <div className="px-3 mt-1 flex items-center">
              <div className="w-32 flex justify-between">
                <span>Nama</span>
                <span>:</span>
              </div>
              <div className="relative px-2">PT. Mitra</div>
            </div>
            <div className="px-3 mt-1 flex">
              <div className="w-32 flex justify-between">
                <span>Alamat</span>
                <span>:</span>
              </div>
              <div className="relative px-2">Jl. Kabupaten Malang</div>
            </div>
            <div className="px-3 mt-1 flex items-center">
              <div className="w-32 flex justify-between">
                <span>NPWP</span>
                <span>:</span>
              </div>
              <div className="relative px-2">1.423.394.1.52</div>
            </div>
            <div className="px-3 mt-1 flex flex-row items-center">
              <div className="w-1/3 flex">
                <div className="w-32 flex justify-between items-center">
                  <span>SK. Pengukuhan</span>
                  <span>:</span>
                </div>
                <div className="relative px-2">10142/II/1984</div>
              </div>
              <div className="w-1/3 flex">
                <div className="w-20 flex justify-between items-center">
                  <span>Tanggal</span>
                  <span>:</span>
                </div>
                <div className="relative px-2">14 Feb 1984</div>
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
              <tr className="bg-white group">
                <td className="lg:w-auto py-1 px-1 group-hover:bg-blue-50 text-slate-800 text-center border border-b block lg:table-cell relative">
                  <div className="relative px-1">
                    <NumberFormat
                      thousandSeparator="."
                      decimalSeparator=","
                      isNumericString
                      allowNegative={false}
                      value={data ? data.fp_no : 0}
                      onChange={(event) => {
                        //edited row
                        props.setdata({
                          ...data,
                          fp_no: event.target.value,
                        });
                      }}
                      className="text-center py-2 w-full bg-white rounded-sm"
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-40"
                    />
                  </div>
                </td>
                <td className="py-1 px-2 group-hover:bg-blue-50 text-left border border-b">
                  <div className="relative">
                    <input
                      placeholder="Nama Rekening"
                      value={data ? data.kp_namabarang : ""}
                      onChange={(event) => {
                        props.setdata({
                          ...data,
                          kp_namabarang: event.target.value,
                        });
                      }}
                      className="text-left py-2 pl-1 bg-white rounded-sm w-full"
                    />
                    <EditIcon
                      fontSize="inherit"
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-40"
                    />
                  </div>
                </td>
                <td className="py-1 px-1 group-hover:bg-blue-50 text-left border border-b">
                  <div className="relative px-1">
                    <TextField
                      value={data ? data.kp_mk3 : 0}
                      onChange={(event) => {
                        //edited row
                        props.setdata({
                          ...data,
                          kp_mk3: event.target.value,
                        });
                      }}
                      className="py-2 w-full bg-white rounded-sm"
                      name="nilai"
                      fullWidth
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
                      className="text-blue-700 absolute inset-y-0 right-1 opacity-40"
                    />
                  </div>
                </td>
                <td className="py-1 lg:w-auto text-slate-800 group-hover:bg-blue-50 text-left border border-b block lg:table-cell relative lg:static">
                  <div className="relative px-1">
                    <TextField
                      value={data ? data.kp_mh3 : 0}
                      onChange={(event) => {
                        //edited row
                        props.setdata({
                          ...data,
                          kp_mh3: event.target.value,
                        });
                      }}
                      className="text-center py-2 w-full bg-white rounded-sm"
                      name="nilai"
                      fullWidth
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
                      className="text-blue-700 absolute inset-y-0 right-0 opacity-40"
                    />
                  </div>
                </td>
                <td className="py-1 px-3 lg:w-auto text-slate-800 text-right border border-b block lg:table-cell relative lg:static">
                  <div className="relative text-center">
                    <TextField
                      value={
                        data ? Number(data.kp_mk3) * Number(data.kp_mh3) : 0
                      }
                      className="py-1 text-center"
                      name="nilai"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        inputComponent: NumberFormatCustom,
                      }}
                      inputProps={{
                        style: {
                          textAlign: "right",
                          paddingRight: 10,
                        },
                        prefix: "Rp ",
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
                <td className="lg:w-auto py-1 px-1 text-base text-slate-800 text-right pr-6 border border-b block lg:table-cell relative">
                  {data
                    ? toRp(
                        Number(data.kp_mk3.replaceAll(",", "")) *
                          Number(data.kp_mh3.replaceAll(",", ""))
                      )
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
                <td className="lg:w-auto py-1 px-1 text-base text-slate-800 text-right pr-6 border border-b block lg:table-cell relative">
                  {data
                    ? toRp(
                        Number(data.kp_mk3.replaceAll(",", "")) *
                          Number(data.kp_mh3.replaceAll(",", ""))
                      )
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
                <td className="lg:w-auto py-1 px-1 text-base text-slate-800 text-right pr-6 border border-b block lg:table-cell relative">
                  {data
                    ? toRp(
                        0.1 *
                          (Number(data.kp_mk3.replaceAll(",", "")) *
                            Number(data.kp_mh3.replaceAll(",", "")))
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
              <div className="relative w-40 pl-1">
                Malang, {data ? data.kp_tgl3 : ""}
              </div>
              <br />
              <br />
              <div className="relative">
                <div className="inline-flex relative">
                  <InputGrowUp
                    value={data ? data.fp_nama : ""}
                    onChange={(text) => {
                      //edited row
                      props.setdata({
                        ...data,
                        fp_nama: text,
                      });
                    }}
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute inset-y-0 right-1 opacity-40"
                  />
                </div>
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
