import { TextField, Tooltip } from "@mui/material";
import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
import NumberFormat from "react-number-format";
import EditIcon from "@mui/icons-material/Edit";
import { map, filter, find } from "lodash";

const numberFormat = (number) => {
  return (
    <NumberFormat
      value={number}
      displayType={"text"}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix="Rp "
      renderText={(value, props) => <div {...props}>{value}</div>}
    />
  );
};

export default function TableWorksheetAdmin12(props) {
  const { dataConfig, setdataConfig } = props;
  const { databahan, dataakun } = props.dataConfig;

  const changeTgl = (e) => {
    const { name, value } = e.target;

    setdataConfig({
      ...dataConfig,
      [name]: value,
    });
  };

  const hitungNilai = (item) => {
    switch (item.gen) {
      case "bangunan":
        const bhn1 = find(databahan, { uid: item.uidbahan });
        const h =
          (Number(bhn1.perolehan) - Number(bhn1.nilaisisa)) /
          Number(bhn1.durasi) /
          12;
        return h;
      case "peralatan":
        const bhn2 = find(databahan, { uid: item.uidbahan });
        const h2 =
          (Number(bhn2.perolehan) - Number(bhn2.nilaisisa)) /
          Number(bhn2.durasi) /
          12;
        return h2;
      case "bunga":
        const bhn3 = find(databahan, { uid: item.uidbahan });
        const h3 =
          ((Number(bhn3.jumlah) / Number(bhn3.durasi)) *
            (Number(bhn3.bungath) / 100)) /
          12;
        return h3;
      case "piutang":
        // console.log("piutang", item.posisi);
        const countDebit = [];
        const databupem = filter(dataConfig.databahan, {
          type: "bupem",
        });
        databupem.forEach((element, index) => {
          if (index === 0) {
            //start
            countDebit.push(element.jumlah);
          } else {
            //
            const x = Number(element.debet) - Number(element.kredit);
            countDebit.push(Number(countDebit[index - 1] + x));
          }
        });

        const hpiut =
          (Number(dataConfig.persentase) / 100) *
          countDebit[countDebit.length - 1];
        return hpiut;
      default:
        break;
    }
  };

  return (
    <>
      <div className="pt-5 flex flex-col items-center font-bold">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            value={dataConfig ? dataConfig.cvname : ""}
            className={"font-semibold uppercase"}
            onChange={(text) => setdataConfig({ ...dataConfig, cvname: text })}
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
      </div>
      <div className="flex flex-col items-center mb-1">
        <div className="text-lg font-semibold relative uppercase">
          Jurnal Penyesuaian
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-xl relative">
          <InputGrowUpTextH1
            className={"font-semibold tracking-wider"}
            value={dataConfig ? dataConfig.tblworkname : ""}
            onChange={(text) =>
              setdataConfig({ ...dataConfig, tblworkname: text })
            }
          />
          <EditIcon
            fontSize="small"
            className="text-blue-700 p-0.5 absolute -inset-y-1 -right-2 opacity-30"
          />
        </div>
      </div>
      <div className="pt-3 overflow-x-auto border-collapse pb-1">
        <table className="border-collapse min-w-full table-fixed">
          <thead>
            <tr>
              <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Tanggal
              </th>
              <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                No. Akun
              </th>
              <th className="min-w-25v max-w-25v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Keterangan
              </th>
              <th className="min-w-10v max-w-10v p-3 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Ref
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Debet
              </th>
              <th className="min-w-15v max-w-15v p-1 font-bold bg-slate-50 text-slate-600 border border-slate-300">
                Kredit
              </th>
            </tr>
          </thead>
          {/* Aset */}
          <tbody>
            {map(filter(dataakun, { base: "aset" }), (item, index) => {
              return (
                <tr key={index}>
                  {index === 0 && (
                    <td
                      rowSpan={filter(dataakun, { base: "aset" }).length}
                      className="py-2 min-w-15v max-w-15v relative text-slate-800 border border-b"
                    >
                      &nbsp;
                      <div className="absolute inset-y-0 top-1 px-1">
                        <TextField
                          fullWidth
                          placeholder="Tanggal"
                          value={dataConfig.tgl1}
                          name="tgl1"
                          onChange={(e) => changeTgl(e)}
                          inputProps={{
                            style: {
                              textAlign: "center",
                            },
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                        />
                      </div>
                    </td>
                  )}
                  <td className="px-1 py-1 text-slate-800 text-center border border-b">
                    <div className="border px-2 py-1 border-amber-700 border-opacity-40">
                      {item.noakun}
                    </div>
                  </td>
                  <td className="px-1 py-1  text-slate-800 border border-b">
                    <div className="border px-2 py-1 border-amber-700 border-opacity-40">
                      {item.keterangan}
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    &nbsp;
                  </td>
                  <td className="px-1 py-1  text-slate-800 text-center border border-b">
                    {item.posisi === "debet" ? (
                      <Tooltip title="Jawaban benar isian di mahasiswa">
                        <div className="border-b">
                          {numberFormat(hitungNilai(item))}
                        </div>
                      </Tooltip>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                  <td className="px-1 py-1  text-slate-800 text-center border border-b">
                    {item.posisi === "kredit" ? (
                      <Tooltip title="Jawaban benar isian di mahasiswa">
                        <div className="border-b">
                          {numberFormat(hitungNilai(item))}
                        </div>
                      </Tooltip>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Bunga */}
          <tbody>
            {map(filter(dataakun, { base: "bunga" }), (item, index) => {
              return (
                <tr key={index}>
                  {index === 0 && (
                    <td
                      rowSpan={filter(dataakun, { base: "bunga" }).length}
                      className="py-2 min-w-15v max-w-15v relative text-slate-800 border border-b"
                    >
                      &nbsp;
                      <div className="absolute inset-y-0 top-1 px-1">
                        <TextField
                          fullWidth
                          placeholder="Tanggal"
                          value={dataConfig.tgl2}
                          name="tgl2"
                          onChange={(e) => changeTgl(e)}
                          inputProps={{
                            style: {
                              textAlign: "center",
                            },
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                        />
                      </div>
                    </td>
                  )}
                  <td className="px-1 py-1 text-slate-800 text-center border border-b">
                    <div className="border px-2 py-1 border-amber-700 border-opacity-40">
                      {item.noakun}
                    </div>
                  </td>
                  <td className="px-1 py-1  text-slate-800 border border-b">
                    <div className="border px-2 py-1 border-amber-700 border-opacity-40">
                      {item.keterangan}
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    &nbsp;
                  </td>
                  <td className="px-1 py-1  text-slate-800 text-center border border-b">
                    {item.posisi === "debet" ? (
                      <Tooltip title="Jawaban benar isian di mahasiswa">
                        <div className="border-b">
                          {numberFormat(hitungNilai(item))}
                        </div>
                      </Tooltip>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                  <td className="px-1 py-1  text-slate-800 text-center border border-b">
                    {item.posisi === "kredit" ? (
                      <Tooltip title="Jawaban benar isian di mahasiswa">
                        <div className="border-b">
                          {numberFormat(hitungNilai(item))}
                        </div>
                      </Tooltip>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* piutang */}
          <tbody>
            {map(filter(dataakun, { base: "piutang" }), (item, index) => {
              return (
                <tr key={index}>
                  {index === 0 && (
                    <td
                      rowSpan={filter(dataakun, { base: "bunga" }).length}
                      className="py-2 min-w-15v max-w-15v relative text-slate-800 border border-b"
                    >
                      &nbsp;
                      <div className="absolute inset-y-0 top-1 px-1">
                        <TextField
                          fullWidth
                          placeholder="Tanggal"
                          value={dataConfig.tgl3}
                          name="tgl3"
                          onChange={(e) => changeTgl(e)}
                          inputProps={{
                            style: {
                              textAlign: "center",
                            },
                          }}
                        />
                        <EditIcon
                          fontSize="inherit"
                          className="text-blue-700 opacity-30 absolute inset-y-0 right-1"
                        />
                      </div>
                    </td>
                  )}
                  <td className="px-1 py-1 text-slate-800 text-center border border-b">
                    <div className="border px-2 py-1 border-amber-700 border-opacity-40">
                      {item.noakun}
                    </div>
                  </td>
                  <td className="px-1 py-1  text-slate-800 border border-b">
                    <div className="border px-2 py-1 border-amber-700 border-opacity-40">
                      {item.keterangan}
                    </div>
                  </td>
                  <td className="px-1 py-2  text-slate-800 text-center border border-b">
                    &nbsp;
                  </td>
                  <td className="px-1 py-1  text-slate-800 text-center border border-b">
                    {item.posisi === "debet" ? (
                      <Tooltip title="Jawaban benar isian di mahasiswa">
                        <div className="border-b">
                          {numberFormat(hitungNilai(item))}
                        </div>
                      </Tooltip>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                  <td className="px-1 py-1  text-slate-800 text-center border border-b">
                    {item.posisi === "kredit" ? (
                      <Tooltip title="Jawaban benar isian di mahasiswa">
                        <div className="border-b">
                          {numberFormat(hitungNilai(item))}
                        </div>
                      </Tooltip>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
