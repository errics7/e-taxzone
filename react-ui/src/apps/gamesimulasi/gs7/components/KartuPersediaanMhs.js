import EditIcon from "@mui/icons-material/Edit";
import NumberFormat from "react-number-format";
import { ShimmerBadge } from "react-shimmer-effects";
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
      style={{ textAlign: "center" }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

export default function KartuPersediaanMhs(props) {
  const data = props.dataC;
  const jawab = props.jawab;
  const validate = props.validate;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  return (
    <div className="w-full relative bg-white">
      <div className="opacity-50 italic font-semibold">Worksheet:</div>
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
              {data ? data.kp_kelompok : <ShimmerBadge width={150} />}
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
              {data ? data.kp_namabarang : <ShimmerBadge width={200} />}
            </div>
          </div>
        </div>
        <br />
        <div className="overflow-x-auto">
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
            <tbody>
              <tr>
                <td className="w-1/12 px-2 py-1 border border-slate-300 text-center">
                  <div className="relative py-1">
                    {data ? data.kp_tgl1 : ""}
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
                          <div className="relative text-sm">
                            {data ? data.kp_saldok1 : 0}
                          </div>
                        </td>
                        <td className="w-1/3 border-l border-r">
                          <div className="relative text-sm">
                            {data ? toRp(data.kp_saldoh1) : 0}
                          </div>
                        </td>
                        <td className="w-1/3">
                          <div className="relative text-sm">
                            {data ? toRp(data.kp_saldoj1) : 0}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td className="w-0.5/12 px-1 py-1 border border-slate-300 group-hover:bg-blue-50 text-center">
                  <div className="relative py-1">
                    {data ? data.kp_tgl2 : ""}
                  </div>
                </td>
                <td className="w-1/12 px-1 py-1 border border-slate-300 group-hover:bg-blue-50">
                  <div className="relative pl-1">
                    {data ? data.kp_keterangan2 : ""}
                  </div>
                </td>
                <td className="w-1/12 px-1 py-1 border border-slate-300 group-hover:bg-blue-50">
                  <div className="relative pl-1">
                    {data ? data.kp_nobukti2 : ""}
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
                          <div className="relative text-sm">
                            {data ? data.kp_kk2 : 0}
                          </div>
                        </td>
                        <td className="w-1/3 border-l border-r">
                          <div className="relative text-sm">
                            {data ? toRp(data.kp_kh2) : 0}
                          </div>
                        </td>
                        <td className="w-1/3">
                          <div className="relative text-sm">
                            {data ? toRp(data.kp_kj2) : 0}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="w-3/12 px-0 py-1 border border-slate-300 group-hover:bg-blue-50">
                  <table className="w-full">
                    <tbody>
                      <tr className="text-center text-sm">
                        <td className="w-1/3">
                          <div className="relative">
                            {data ? data.kp_saldok2 : 0}
                          </div>
                        </td>
                        <td className="w-1/3 border-l border-r">
                          <div className="relative">
                            {data ? toRp(data.kp_saldoh2) : 0}
                          </div>
                        </td>
                        <td className="w-1/3">
                          <div className="relative">
                            {data ? toRp(data.kp_saldoj2) : 0}
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
                <td className="w-1/12 px-1 py-1 border border-slate-300 group-hover:bg-slate-100 text-center">
                  <div className="relative">
                    <input
                      readOnly={validate}
                      placeholder="Tanggal"
                      value={jawab ? jawab.tanggal.value : ""}
                      onChange={(event) => {
                        props.setjawab({
                          ...jawab,
                          tanggal: {
                            ...jawab.tanggal,
                            value: event.target.value,
                          },
                        });
                      }}
                      className={`text-center py-1 bg-white rounded-sm ${
                        validate &&
                        !jawab.tanggal.status &&
                        " animate-pulse bg-red-300 rounded"
                      }`}
                    />
                    {!validate && (
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-1 opacity-50"
                      />
                    )}
                  </div>
                </td>
                <td className="w-1/12 px-1 py-1 border border-slate-300 group-hover:bg-slate-100">
                  <div className="relative">
                    <input
                      readOnly={validate}
                      placeholder="Keterangan"
                      value={jawab ? jawab.keterangan.value : ""}
                      onChange={(event) => {
                        props.setjawab({
                          ...jawab,
                          keterangan: {
                            ...jawab.keterangan,
                            value: event.target.value,
                          },
                        });
                      }}
                      className={`text-left py-1 pl-1 bg-white rounded-sm  ${
                        validate &&
                        !jawab.keterangan.status &&
                        " animate-pulse bg-red-300 rounded"
                      }`}
                    />
                    {!validate && (
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-1 opacity-50"
                      />
                    )}
                  </div>
                </td>
                <td className="w-1/12 px-1 py-1 border border-slate-300 group-hover:bg-slate-100">
                  <div className="relative">
                    <input
                      readOnly={validate}
                      placeholder="No bukti"
                      value={jawab ? jawab.nobukti.value : ""}
                      onChange={(event) => {
                        props.setjawab({
                          ...jawab,
                          nobukti: {
                            ...jawab.nobukti,
                            value: event.target.value,
                          },
                        });
                      }}
                      className={`text-left py-1 pl-1 bg-white rounded-sm  ${
                        validate &&
                        !jawab.nobukti.status &&
                        " animate-pulse bg-red-300 rounded"
                      }`}
                    />
                    {!validate && (
                      <EditIcon
                        fontSize="inherit"
                        className="text-blue-700 absolute inset-y-0 right-1 opacity-50"
                      />
                    )}
                  </div>
                </td>
                <td className="w-3/12 px-0 py-1 border border-slate-300 group-hover:bg-slate-100">
                  <table className="w-full">
                    <tbody>
                      <tr className="text-center">
                        <td className="w-1/3">
                          <div
                            className={`relative w-full bg-white rounded-sm  ${
                              validate &&
                              !jawab.masukkwt.status &&
                              " animate-pulse bg-red-300 rounded"
                            }`}
                          >
                            <TextField
                              style={{ marginTop: 0 }}
                              fullWidth
                              placeholder="0"
                              name="jumlah"
                              value={jawab ? jawab.masukkwt.value : 0}
                              onChange={(event) => {
                                props.setjawab({
                                  ...jawab,
                                  masukkwt: {
                                    ...jawab.masukkwt,
                                    value: event.target.value,
                                  },
                                });
                              }}
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                                readOnly: validate,
                              }}
                            />
                            {!validate && (
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-0 left-1 opacity-50"
                              />
                            )}
                          </div>
                        </td>
                        <td className="w-1/3 border-l border-r">
                          <div
                            className={`relative w-full bg-white rounded-sm  ${
                              validate &&
                              !jawab.masukharga.status &&
                              " animate-pulse bg-red-300 rounded"
                            }`}
                          >
                            <TextField
                              style={{ marginTop: 0 }}
                              fullWidth
                              placeholder="0"
                              name="jumlah"
                              value={jawab ? jawab.masukharga.value : 0}
                              onChange={(event) => {
                                props.setjawab({
                                  ...jawab,
                                  masukharga: {
                                    ...jawab.masukharga,
                                    value: event.target.value,
                                  },
                                });
                              }}
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                                readOnly: validate,
                              }}
                            />
                            {!validate && (
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-0 left-1 opacity-50"
                              />
                            )}
                          </div>
                        </td>
                        <td className="w-1/3">
                          <div
                            className={`relative w-full bg-white rounded-sm  ${
                              validate &&
                              !jawab.masukjumlah.status &&
                              " animate-pulse bg-red-300 rounded"
                            }`}
                          >
                            <TextField
                              style={{ marginTop: 0 }}
                              fullWidth
                              placeholder="0"
                              name="jumlah"
                              value={jawab ? jawab.masukjumlah.value : 0}
                              onChange={(event) => {
                                props.setjawab({
                                  ...jawab,
                                  masukjumlah: {
                                    ...jawab.masukjumlah,
                                    value: event.target.value,
                                  },
                                });
                              }}
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                                readOnly: validate,
                              }}
                            />
                            {!validate && (
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-0 left-1 opacity-50"
                              />
                            )}
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
                <td className="w-3/12 px-0 py-1 border border-slate-300 group-hover:bg-slate-100">
                  <table className="w-full">
                    <tbody>
                      <tr className="text-center">
                        <td className="w-1/3">
                          <div
                            className={`relative w-full bg-white rounded-sm  ${
                              validate &&
                              !jawab.saldokwt.status &&
                              " animate-pulse bg-red-300 rounded"
                            }`}
                          >
                            <TextField
                              style={{ marginTop: 0 }}
                              fullWidth
                              placeholder="0"
                              name="saldokwt"
                              value={jawab ? jawab.saldokwt.value : 0}
                              onChange={(event) => {
                                props.setjawab({
                                  ...jawab,
                                  saldokwt: {
                                    ...jawab.saldokwt,
                                    value: event.target.value,
                                  },
                                });
                              }}
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                                readOnly: validate,
                              }}
                            />
                            {!validate && (
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-0 left-1 opacity-50"
                              />
                            )}
                          </div>
                        </td>
                        <td className="w-1/3 border-l border-r">
                          <div
                            className={`relative w-full bg-white rounded-sm  ${
                              validate &&
                              !jawab.saldoharga.status &&
                              " animate-pulse bg-red-300 rounded"
                            }`}
                          >
                            <TextField
                              style={{ marginTop: 0 }}
                              fullWidth
                              placeholder="0"
                              name="saldoharga"
                              value={jawab ? jawab.saldoharga.value : 0}
                              onChange={(event) => {
                                props.setjawab({
                                  ...jawab,
                                  saldoharga: {
                                    ...jawab.saldoharga,
                                    value: event.target.value,
                                  },
                                });
                              }}
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                                readOnly: validate,
                              }}
                            />
                            {!validate && (
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-0 left-1 opacity-50"
                              />
                            )}
                          </div>
                        </td>
                        <td className="w-1/3">
                          <div
                            className={`relative w-full bg-white rounded-sm  ${
                              validate &&
                              !jawab.saldojumlah.status &&
                              " animate-pulse bg-red-300 rounded"
                            }`}
                          >
                            <TextField
                              style={{ marginTop: 0 }}
                              fullWidth
                              placeholder="0"
                              name="saldoharga"
                              value={jawab ? jawab.saldojumlah.value : 0}
                              onChange={(event) => {
                                props.setjawab({
                                  ...jawab,
                                  saldojumlah: {
                                    ...jawab.saldojumlah,
                                    value: event.target.value,
                                  },
                                });
                              }}
                              InputProps={{
                                disableUnderline: true,
                                inputComponent: NumberFormatCustom,
                                readOnly: validate,
                              }}
                            />
                            {!validate && (
                              <EditIcon
                                fontSize="inherit"
                                className="text-blue-700 absolute inset-y-0 left-1 opacity-50"
                              />
                            )}
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
    </div>
  );
}
