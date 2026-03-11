import ListBukuPembantuBiayaMhs14 from "./ListBukuPembantuBiayaMhs14";

export default function BukuPembantuBiayaMhs14(props) {
  const alokasi = props.alokasi;
  const listPembantu = props.listPembantu;

  return (
    <div className="border min-h-25v">
      {alokasi.map((item, index) => {
        return (
          <div key={index}>
            <ListBukuPembantuBiayaMhs14
              item={item}
              checking={props.checking}
              listPembantu={listPembantu}
              jawab={props.jawab}
              setJawab={(x) => props.setJawab(x)}
            />
          </div>
        );
      })}
    </div>
  );
}
