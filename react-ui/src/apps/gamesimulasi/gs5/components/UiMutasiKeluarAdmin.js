import EditIcon from "@mui/icons-material/Edit";
import { TextField } from "@mui/material";
import { forwardRef } from "react";
import NumberFormat from "react-number-format";

const numberFormat = (number) => {
  return (
    <NumberFormat
      value={number}
      displayType={"text"}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      // prefix="Rp "
      renderText={(value, props) => <div {...props}>{value}</div>}
    />
  );
};

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
            value: Number(values.value),
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
    />
  );
});

export default function UiMutasiKeluarAdmin(props) {
  const dataC = props.dataC;
  const data = props.selected;

  return (
    <div className="w-full relative">
      <div className="w-full">
        <div className="text-lg uppercase font-semibold mb-5">
          kartu Persediaan
        </div>
        <div className="text-base flex flex-col">
          <div className="flex ">
            <div className="flex-none w-2/12 flex justify-between">
              <span>Kelompok</span>
              <span>:</span>
            </div>
            <div className="grow pl-2  uppercase">Bahan Penolong</div>
          </div>
        </div>
        <div className="text-base flex flex-col">
          <div className="flex ">
            <div className="flex-none w-2/12 flex justify-between">
              <span>Nama Barang</span>
              <span>:</span>
            </div>
            <div className="grow uppercase">
              <span className="px-2">{data && data.namabhn}</span>
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
              <th className="w-2/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
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
              <th className="w-2/12 font-bold bg-slate-50 text-slate-600 border border-slate-300">
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
              <th className="w-2/12 p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
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
              <td className="w-1/12 p-3 border border-slate-300 text-center">
                <div className="relative">
                  <input
                    value={dataC ? dataC.tgl_mutasikeluar : ""}
                    onChange={(event) => {
                      //edited row
                      props.setdata({
                        ...dataC,
                        tgl_mutasikeluar: event.target.value,
                      });
                    }}
                    className="text-center"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute -inset-y-1 right-0 opacity-40"
                  />
                </div>
              </td>
              <td className="w-1/12 p-3 border border-slate-300">Saldo Awal</td>
              <td className="w-1/12 p-3 border border-slate-300">&nbsp;</td>
              <td className="w-2/12 p-3 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-1/3">&nbsp;</td>
                      <td className="w-1/3 border-l border-r">&nbsp;</td>
                      <td className="w-1/3">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="w-2/12 p-3 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-1/3">&nbsp;</td>
                      <td className="w-1/3 border-l border-r">&nbsp;</td>
                      <td className="w-1/3">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="w-2/12 py-3 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className=" text-center">
                      <td className="w-1/3">
                        <div className="relative">
                          <TextField
                            fullWidth
                            placeholder="Kwantitas"
                            margin="none"
                            value={dataC ? dataC.sal_kwt : ""}
                            name="sal_kwt"
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...dataC,
                                sal_kwt: event.target.value,
                              });
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              prefix: "",
                              style: {
                                textAlign: "center",
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-1 left-0 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3 border-l border-r">
                        <div className="relative">
                          <TextField
                            fullWidth
                            placeholder="harga sat"
                            margin="none"
                            value={dataC ? dataC.sal_harga : ""}
                            name="sal_harga"
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...dataC,
                                sal_harga: event.target.value,
                              });
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              prefix: "",
                              style: {
                                textAlign: "center",
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-1 left-0 opacity-40"
                          />
                        </div>
                      </td>
                      <td className="w-1/3">
                        <div className="relative">
                          <TextField
                            fullWidth
                            placeholder="Jumlah"
                            margin="none"
                            value={dataC ? dataC.sal_jumlah : 0}
                            name="sal_jumlah"
                            onChange={(event) => {
                              //edited row
                              props.setdata({
                                ...dataC,
                                sal_jumlah: event.target.value,
                              });
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                            inputProps={{
                              prefix: "",
                              style: {
                                textAlign: "center",
                              },
                            }}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-1 left-0 opacity-40"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            {/* data main */}
            <tr>
              <td className="w-1/12 p-3 border border-slate-300 text-center">
                <div className="py-1">{dataC && dataC.info_tglbgudang}</div>
              </td>
              <td className="w-1/12 p-3 border border-slate-300">
                <div className=" p-2">{data && data.keperluan}</div>
              </td>
              <td className="w-1/12 p-3 border border-slate-300 text-center">
                <div className="relative">
                  <input
                    value={dataC ? dataC.nobppb : ""}
                    onChange={(event) => {
                      //edited row
                      props.setdata({
                        ...dataC,
                        nobppb: event.target.value,
                      });
                    }}
                    className="text-center"
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 absolute -inset-y-1 right-0 opacity-40"
                  />
                </div>
              </td>
              <td className="w-2/12 p-3 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-1/3">&nbsp;</td>
                      <td className="w-1/3 border-l border-r">&nbsp;</td>
                      <td className="w-1/3">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="w-2/12 py-3 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="text-center">
                      <td className="w-1/3">
                        {data ? numberFormat(data.keluarqty) : <>&nbsp;</>}
                      </td>
                      <td className="w-1/3 border-l border-r ">
                        {data ? numberFormat(data.hrgsatuan) : <>&nbsp;</>}
                      </td>
                      <td className="w-1/3">
                        {data ? (
                          numberFormat(
                            Number(data.keluarqty) * Number(data.hrgsatuan)
                          )
                        ) : (
                          <>&nbsp;</>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="w-2/12 py-3 border border-slate-300">
                <table className="w-full">
                  <tbody>
                    <tr className="text-center">
                      <td className="w-1/3">
                        {data ? (
                          dataC &&
                          numberFormat(
                            Number(dataC.sal_kwt) - Number(data.keluarqty)
                          )
                        ) : (
                          <>&nbsp;</>
                        )}
                      </td>
                      <td className="w-1/3 border-l border-r">
                        {data ? numberFormat(data.hrgsatuan) : <>&nbsp;</>}
                      </td>
                      <td className="w-1/3">
                        {data ? (
                          dataC &&
                          numberFormat(
                            (dataC.sal_kwt - data.keluarqty) * data.hrgsatuan
                          )
                        ) : (
                          <>&nbsp;</>
                        )}
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
