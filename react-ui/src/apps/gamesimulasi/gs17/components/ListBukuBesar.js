import BukuBesarItems from "./BukuBesarItems";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { v4 as uuidv4 } from "uuid";
import { remove } from "lodash";
import PopCatatan from "./PopCatatan";

export default function ListBukuBesar(props) {
  const bb = props.dataBB;
  const dataAkun = props.dataAkun;
  const dataPersediaan = props.dataPersediaan;

  const bbBaru = () => {
    const uid = uuidv4();
    props.setDataBB([
      ...bb,
      {
        uuid: uid,
        namaakun: "",
        kode: "",
      },
    ]);
    props.setDataAkun([
      ...dataAkun,
      {
        uuid: uuidv4(),
        cuid: uid,
        tgl: 1,
        keterangan: "Saldo awal",
        ref: "NSA",
        debit: 0,
        kredit: 0,
        status: "non",
      },
    ]);
  };
  const gantiBB = (uid, text, key) => {
    props.setDataBB(
      bb.map((u, i) =>
        uid === u.uuid
          ? {
              ...u,
              [key]: text,
            }
          : u
      )
    );
  };
  const hapusBB = (uid) => {
    const temp = remove(bb, (x) => x.uuid !== uid);
    props.setDataBB([...temp]);
    const temp1 = remove(dataAkun, (x) => x.cuid !== uid);
    props.setDataAkun([...temp1]);
  };
  const dataBaru = (uid) => {
    props.setDataAkun([
      ...dataAkun,
      {
        uuid: uuidv4(),
        cuid: uid,
        tgl: "",
        keterangan: "",
        ref: "",
        debit: 0,
        kredit: 0,
        status: "non",
      },
    ]);
  };
  const dataPersediaanBaru = (uid, typ) => {
    const temp = remove(dataPersediaan, (x) => x.eluid !== uid);

    props.setDataPersediaan([
      ...temp,
      {
        uuid: uuidv4(),
        eluid: uid,
        name: "",
        valtotbiaya: 0,
        valekuiv: 0,
        valbiayaunit: 0,
        type: typ,
      },
    ]);
  };

  return (
    <div className="border min-h-10v relative bg-white">
      <div className="absolute opacity-50 bg-blue-200 italic font-semibold p-1 pr-2">
        Tampilan Data (soal):
      </div>
      <div className="flex flex-col mt-6 pb-12 xl:mx-3">
        {/*  */}
        {bb.map((item, index) => {
          return (
            <BukuBesarItems
              key={index}
              item={item}
              gantiNama={(tx) => gantiBB(item.uuid, tx, "namaakun")}
              gantiKode={(tx) => gantiBB(item.uuid, tx, "kode")}
              hapusBB={() => hapusBB(item.uuid)}
              dataAkun={dataAkun}
              dataBaru={() => dataBaru(item.uuid)}
              setDataAkun={(x) => props.setDataAkun(x)}
              dataPersediaanBaru={(x, typ) => dataPersediaanBaru(x, typ)}
            />
          );
        })}
        {/* New */}
        <div className="absolute inset-x-0 bottom-0 flex">
          <div className="relative w-full">
            <div className="absolute bottom-0 left-0 bg-amber-200 ml-10 px-3 py-1 rounded-t cursor-pointer transition-all hover:bg-amber-300 transform hover:scale-105">
              <PopCatatan />
            </div>

            <div className="flex justify-center">
              <div className="group">
                <div
                  onClick={() => bbBaru()}
                  className="bg-slate-400 rounded-t-md min-w-30v max-w-30v py-1 flex items-center justify-center cursor-pointer transition-all group-hover:bg-blue-400 transform hover:scale-105"
                >
                  <AddCircleOutlineIcon className="text-white" />
                  <span className="text-white font-semibold pl-1">
                    Buku Besar Baru
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
