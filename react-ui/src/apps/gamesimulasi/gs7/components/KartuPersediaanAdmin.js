import EditIcon from "@mui/icons-material/Edit";
import { TextField } from "@mui/material";
import { forwardRef } from "react";
import NumberFormat from "react-number-format";
import { InputGrowUp } from "./InputGrowUp";

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

export default function KartuPersediaanAdmin(props) {
  const data = props.dataC;

  return (
    <div className="w-full relative ">
      Pengaturan Jawaban:
      <div className="w-full border">
        <div className="text-lg uppercase text-center font-semibold mt-4 mb-4">
          kartu Persediaan
        </div>
        <div className="text-base flex flex-col mb-1">
          <div className="flex pl-3">
            <div className="flex-none w-2/12 flex justify-between">
              <span>Kelompok</span>
              <span>:</span>
            </div>
            <div className="pl-2 relative">
              <InputGrowUp
                value={data ? data.kp_kelompok : ""}
                onChange={(text) => {
                  //edited row
                  props.setdata({
                    ...data,
                    kp_kelompok: text,
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
        <div className="text-base flex flex-col">
          <div className="flex pl-3">
            <div className="flex-none w-2/12 flex justify-between">
              <span>Nama Barang</span>
              <span>:</span>
            </div>
            <div className="pl-2 relative">
              <InputGrowUp
                placeholder="Nama barang"
                value={data ? data.kp_namabarang : ""}
                onChange={(text) => {
                  //edited row
                  props.setdata({
                    ...data,
                    kp_namabarang: text,
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
        <br />
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Tanggal
              </th>
              <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Keterangan
              </th>
              <th className="w-1/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                No Bukti
              </th>
              <th className="w-3/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td colSpan="3">Masuk</td>
                    </tr>
                    <tr className="border-t">
                      <td className="w-1/3 border-r">Kwt</td>
                      <td className="w-1/3 border-r">Harga</td>
                      <td className="w-1/3 border-l">Jumlah</td>
                    </tr>
                  </tbody>
                </table>
              </th>
              <th className="w-3/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td colSpan="3">Keluar</td>
                    </tr>
                    <tr className="border-t">
                      <td className="w-1/3 border-r">Kwt</td>
                      <td className="w-1/3 border-r">Harga</td>
                      <td className="w-1/3 border-l">Jumlah</td>
                    </tr>
                  </tbody>
                </table>
              </th>
              <th className="w-3/12 p-0 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td colSpan="3">Saldo</td>
                    </tr>
                    <tr className="border-t">
                      <td className="w-1/3 border-r">Kwt</td>
                      <td className="w-1/3 border-r">Harga</td>
                      <td className="w-1/3 border-l">Jumlah</td>
                    </tr>
                  </tbody>
                </table>
              </th>
            </tr>
          </thead>
          {/* Body */}
          <tbody className="group">
            <tr>
              <td className="w-1/12 px-2 py-1 border border-slate-300 group-hover:bg-blue-50 text-center">
                <div className="relative">
                  <input
                    placeholder="Tanggal"
                    value={data ? data.kp_tgl1 : ""}
                    onChange={(event) => {
                      props.setdata({
                        ...data,
                        kp_tgl1: event.target.value,
                      });
                    }}
                    className="text-center py-1 rounded-sm"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute inset-y-0 right-0 opacity-40"
                  />
                </div>
              </td>
              <td className="w-1/12 px-2 py-1 border border-slate-300">
                Saldo Awal
              </td>
              <td className="w-1/12 px-2 py-1 border border-slate-300"></td>
              <td className="w-3/12 px-0 py-1 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="">
                      <td className="w-1/3">&nbsp;</td>
                      <td className="w-1/3 border-l border-r">&nbsp;</td>
                      <td className="w-1/3">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="w-3/12 px-0 py-1 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="">
                      <td className="w-1/3">&nbsp;</td>
                      <td className="w-1/3 border-l border-r">&nbsp;</td>
                      <td className="w-1/3">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="w-3/12 px-0 py-1 border border-slate-300 group-hover:bg-blue-50">
                <table className="w-full">
                  <tbody>
                    <tr className="text-center">
                      <td className="w-1/3">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_saldok1 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_saldok1: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_saldok1"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3 border-l border-r">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_saldoh1 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_saldoh1: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_saldoh1"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_saldoj1 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_saldoj1: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_saldoh1"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td className="w-0.5/12 px-1 py-1 border border-slate-300 group-hover:bg-blue-50 text-center">
                <div className="relative">
                  <input
                    placeholder="Tanggal"
                    value={data ? data.kp_tgl2 : ""}
                    onChange={(event) => {
                      props.setdata({
                        ...data,
                        kp_tgl2: event.target.value,
                      });
                    }}
                    className="text-center py-1 rounded-sm"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute inset-y-0 right-1 opacity-40"
                  />
                </div>
              </td>
              <td className="w-1/12 px-1 py-1 border border-slate-300 group-hover:bg-blue-50">
                <div className="relative">
                  <input
                    placeholder="Keterangan"
                    value={data ? data.kp_keterangan2 : ""}
                    onChange={(event) => {
                      props.setdata({
                        ...data,
                        kp_keterangan2: event.target.value,
                      });
                    }}
                    className="text-left py-1 pl-1 rounded-sm"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute inset-y-0 right-1 opacity-40"
                  />
                </div>
              </td>
              <td className="w-1/12 px-1 py-1 border border-slate-300 group-hover:bg-blue-50">
                <div className="relative">
                  <input
                    placeholder="No bukti"
                    value={data ? data.kp_nobukti2 : ""}
                    onChange={(event) => {
                      props.setdata({
                        ...data,
                        kp_nobukti2: event.target.value,
                      });
                    }}
                    className="text-left py-1 pl-1 rounded-sm"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute inset-y-0 right-1 opacity-40"
                  />
                </div>
              </td>
              <td className="w-3/12 px-0 py-1 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="">
                      <td className="w-1/3">&nbsp;</td>
                      <td className="w-1/3 border-l border-r">&nbsp;</td>
                      <td className="w-1/3">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="w-3/12 px-0 py-1 border border-slate-300 group-hover:bg-blue-50">
                <table className="w-full">
                  <tbody>
                    <tr className="text-center">
                      <td className="w-1/3">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_kk2 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_kk2: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_kk2"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3 border-l border-r">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_kh2 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_kh2: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_kh2"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_kj2 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_kj2: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_kj2"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="w-3/12 px-0 py-1 border border-slate-300 group-hover:bg-blue-50">
                <table className="w-full">
                  <tbody>
                    <tr className="text-center">
                      <td className="w-1/3">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_saldok2 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_saldok2: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_saldok2"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3 border-l border-r">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_saldoh2 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_saldoh2: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_saldoh2"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_saldoj2 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_saldoj2: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_saldoj2"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
          <tbody className="group">
            {/* data main */}
            <tr>
              <td className="w-1/12 px-1 py-1 border border-slate-300 group-hover:bg-emerald-100 text-center">
                <div className="relative">
                  <input
                    placeholder="Tanggal"
                    value={data ? data.kp_tgl3 : ""}
                    onChange={(event) => {
                      props.setdata({
                        ...data,
                        kp_tgl3: event.target.value,
                      });
                    }}
                    className="text-center py-1 rounded-sm"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute inset-y-0 right-1 opacity-40"
                  />
                </div>
              </td>
              <td className="w-1/12 px-1 py-1 border border-slate-300 group-hover:bg-emerald-100">
                <div className="relative">
                  <input
                    placeholder="Keterangan"
                    value={data ? data.kp_keterangan3 : ""}
                    onChange={(event) => {
                      props.setdata({
                        ...data,
                        kp_keterangan3: event.target.value,
                      });
                    }}
                    className="text-left py-1 pl-1 rounded-sm"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute inset-y-0 right-1 opacity-40"
                  />
                </div>
              </td>
              <td className="w-1/12 px-1 py-1 border border-slate-300 group-hover:bg-emerald-100">
                <div className="relative">
                  <input
                    placeholder="No bukti"
                    value={data ? data.kp_nobukti3 : ""}
                    onChange={(event) => {
                      props.setdata({
                        ...data,
                        kp_nobukti3: event.target.value,
                      });
                    }}
                    className="text-left py-1 pl-1 rounded-sm"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute inset-y-0 right-1 opacity-40"
                  />
                </div>
              </td>
              <td className="w-3/12 px-0 py-1 border border-slate-300 group-hover:bg-emerald-100">
                <table className="w-full">
                  <tbody>
                    <tr className="text-center">
                      <td className="w-1/3">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_mk3 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_mk3: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_mk3"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3 border-l border-r">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_mh3 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_mh3: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_mh3"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_mj3 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_mj3: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_mj3"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="w-3/12 px-2 py-1 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="">
                      <td className="w-1/3">&nbsp;</td>
                      <td className="w-1/3 border-l border-r">&nbsp;</td>
                      <td className="w-1/3">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="w-3/12 px-0 py-1 border border-slate-300 group-hover:bg-emerald-100">
                <table className="w-full">
                  <tbody>
                    <tr className="text-center">
                      <td className="w-1/3">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_saldok3 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_saldok3: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_saldok3"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3 border-l border-r">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_saldoh3 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_saldoh3: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_saldoh3"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3">
                        <div className="relative px-0">
                          <TextField
                            value={data ? data.kp_saldoj3 : 0}
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...data,
                                kp_saldoj3: event.target.value,
                              });
                            }}
                            className="text-center py-1 w-full rounded-sm"
                            name="kp_saldoj3"
                            fullWidth
                            margin="none"
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
                            className="text-blue-700 absolute inset-y-0 left-1 opacity-40"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
