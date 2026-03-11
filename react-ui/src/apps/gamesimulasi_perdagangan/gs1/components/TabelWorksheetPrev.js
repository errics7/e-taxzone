import { Grid } from "@mui/material";
import { InputGrowUpTextH1 } from "../../componentglobal/InputGrowUpTextH";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";

export default function TabelWorksheetPrev(props) {
  const { dataConf, setDataConf } = props;
  const databuku = dataConf ? dataConf.databuku : [];

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const upperCase = (str) => {
    return str.toUpperCase();
  };

  const updateInput = (i, e) => {
    const { name, value } = e.target;
    const lst = [...databuku];
    lst.splice(i, 1, { ...lst[i], [name]: value });

    setDataConf({ ...dataConf, databuku: lst });
  };

  return (
    <div className="mt-8">
      {databuku.map((item, j) => (
        <Grid
          container
          key={j}
          direction="column"
          justifyContent="center"
          alignItems="stretch"
          className="my-3 w-full overflow-x-auto"
        >
          <div className="p-5 border border-solid ">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-start-1 col-end-12 text-center font-bold">
                BUKU PEMBANTU {upperCase(item.jenis)}
              </div>
              <div className="col-start-1 col-end-6 text-xl font-bold">
                <div className="w-auto">
                  <InputGrowUpTextH1
                    value={dataConf ? dataConf.narasi_adt2 : ""}
                    onChange={(text) =>
                      props.setDataConf({ ...dataConf, narasi_adt2: text })
                    }
                  />
                  <EditIcon
                    fontSize="inherit"
                    className="text-blue-700 opacity-40 -mt-3 -ml-5"
                  />
                </div>
              </div>
              <div className="col-end-10 col-span-2">
                Nama {item.jenis === "hutang" ? "Pemasok" : "Pelanggan"} :
                <span className="bg-amber-100 px-2 py-1">{item.name}</span>
              </div>
            </div>

            <div className="overflow-x-auto border mt-5">
              <table className="border-collapse min-w-full table-fixed">
                <thead className="font-semibold">
                  <tr>
                    <th rowSpan={2} className="min-w-10v max-w-10v border py-1">
                      Tanggal
                    </th>
                    <th rowSpan={2} className="min-w-10v max-w-10v border py-1">
                      Keterangan
                    </th>
                    <th rowSpan={2} className="min-w-10v max-w-10v border py-1">
                      Ref.
                    </th>
                    <th rowSpan={2} className="min-w-15v max-w-15v border py-1">
                      Debet (Rp)
                    </th>
                    <th rowSpan={2} className="min-w-15v max-w-15v border py-1">
                      Kredit (Rp)
                    </th>
                    <th colSpan={2} className="min-w-15v max-w-15v border py-1">
                      Saldo
                    </th>
                  </tr>
                  <tr>
                    <th className="min-w-15v max-w-15v border py-1">Debet</th>
                    <th className="min-w-15v max-w-15v border py-1">Kredit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="min-w-10v max-w-10v border py-1.5 ">
                      <div className="text-center">
                        <div className="relative">
                          <TextField
                            // className={classes.inpputtgl}
                            InputProps={{
                              disableUnderline: true,
                            }}
                            inputProps={{
                              style: { textAlign: "center", fontSize: 14 },
                            }}
                            placeholder="Tanggal"
                            fullWidth
                            name="tgl_worksheet"
                            value={item.tgl_worksheet}
                            onChange={(e) => updateInput(j, e)}
                          />
                          <EditIcon
                            fontSize="inherit"
                            className="text-blue-700 absolute inset-y-0 right-0 opacity-30"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="min-w-10v max-w-10v border py-1.5 text-center">
                      Pembelian
                    </td>
                    <td className="min-w-15v max-w-15v border py-1.5 text-center"></td>
                    <td className="min-w-15v max-w-15v border py-1.5">
                      &nbsp;
                    </td>
                    <td className="min-w-15v max-w-15v border py-1.5">
                      &nbsp;
                    </td>
                    <td className="min-w-15v max-w-15v border py-1.5">
                      {item.jenis === "piutang" ? (
                        <div className="text-center bg-amber-100 ">
                          {toRp(item.jumlah)}
                        </div>
                      ) : (
                        <>&nbsp;</>
                      )}
                    </td>
                    <td className="min-w-15v max-w-15v border py-1.5 ">
                      {item.jenis === "hutang" ? (
                        <div className="text-center bg-amber-100 ">
                          {toRp(item.jumlah)}
                        </div>
                      ) : (
                        <>&nbsp;</>
                      )}
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td className="min-w-10v max-w-10v border py-1.5">
                      &nbsp;
                    </td>
                    <td className="min-w-10v max-w-10v border py-1.5">
                      &nbsp;
                    </td>
                    <td className="min-w-15v max-w-15v border py-1.5">
                      &nbsp;
                    </td>
                    <td className="min-w-15v max-w-15v border py-1.5">
                      &nbsp;
                    </td>
                    <td className="min-w-15v max-w-15v border py-1.5">
                      &nbsp;
                    </td>
                    <td className="min-w-15v max-w-15v border py-1.5">
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Grid>
      ))}
    </div>
  );
}
