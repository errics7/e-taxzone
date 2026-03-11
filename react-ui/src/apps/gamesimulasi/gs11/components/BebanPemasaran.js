import { v4 as uuidv4 } from "uuid";
import { remove } from "lodash"; 
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField"; 
import PostAddIcon from "@mui/icons-material/PostAdd";
import MenuPop from "./PopMenuDelete";

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

export default function BebanPemasaran(props) {
  const classes = useStyles();
  const data = props.data;

  const addBiayaProduksi = () => {
    props.setData([
      ...data,
      {
        uuid: uuidv4(),
        status: false,
        golongan: "Beban Pemasaran",
        departemen: "",
        seksi: "",
        kpusat: "",
        kpembantu: "",
        keterangan: "",
        saldo: 0,
      },
    ]);
  };
  const handleRemoveItem = (uid) => {
    const temp = remove(data, (x) => x.uuid !== uid);
    props.setData(temp);
  };

  return (
    <div className="my-4 overflow-x-auto bg-white">
      <table className="min-w-full table-fixed mb-4">
        <thead>
          <tr>
            <th
              colSpan="3"
              className="w-4/12 p-2 py-2  border table-cell text-left font-bold text-base"
            >
              Beban Pemasaran
            </th>
            <th className="w-7/12 p-1 py-2  border table-cell">
              <div className="flex items-baseline">
                <Button
                  variant="contained"
                  size="small"
                  className={classes.btnaddadata}
                  startIcon={<PostAddIcon />}
                  onClick={() => addBiayaProduksi()}
                >
                  Tambah data
                </Button>
              </div>
            </th>
          </tr>
          <tr className="break-words bg-slate-50">
            <th className="px-5 py-3 border table-cell"></th>
            <th className="px-5 py-3 border table-cell">Kode Utama</th>
            <th className="px-2 py-3 border">Kode Pembantu</th>
            <th className="min-w-15v px-2 py-3 border">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((x) => x.golongan === "Beban Pemasaran")
            .map((el, index) => {
              return (
                <tr key={index} className="text-center">
                  <td className="px-2 py-2 border table-cell">
                    <MenuPop
                      index={el.uuid}
                      removeButton={(uid) => handleRemoveItem(uid)}
                    />
                  </td>
                  <td className="px-2 py-2 border table-cell">
                    <div className="relative bg-white">
                      <TextField
                        value={el.kpusat}
                        name="kpusat"
                        placeholder="Kode Pusat"
                        onChange={(event) => {
                          props.setData(
                            data.map((u, i) =>
                              el.uuid === u.uuid
                                ? {
                                    ...u,
                                    kpusat: event.target.value.replace(
                                      /\D/,
                                      ""
                                    ),
                                  }
                                : u
                            )
                          );
                        }}
                        inputProps={{ style: { textAlign: "center" } }}
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2 border">
                    <div className="relative bg-white">
                      <TextField
                        value={el.kpembantu}
                        name="kpembantu"
                        placeholder="Kode Pembantu"
                        onChange={(event) => {
                          props.setData(
                            data.map((u, i) =>
                              el.uuid === u.uuid
                                ? {
                                    ...u,
                                    kpembantu: event.target.value.replace(
                                      /\D/,
                                      ""
                                    ),
                                  }
                                : u
                            )
                          );
                        }}
                        inputProps={{ style: { textAlign: "center" } }}
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2 border">
                    <div className="relative bg-white">
                      <TextField
                        placeholder="Keterangan"
                        fullWidth
                        value={el.keterangan}
                        className={classes.inpputBahanNama}
                        onChange={(event) => {
                          props.setData(
                            data.map((u, i) =>
                              el.uuid === u.uuid
                                ? { ...u, keterangan: event.target.value }
                                : u
                            )
                          );
                        }}
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
            <td className="px-2 py-3  table-cell">&nbsp;</td>
            <td className="px-2 ">&nbsp;</td>
            <td className="px-2 ">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
