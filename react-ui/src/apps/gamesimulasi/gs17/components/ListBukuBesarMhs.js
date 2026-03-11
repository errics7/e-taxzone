import BukuBesarItemsMhs from "./BukuBesarItemsMhs";

export default function ListBukuBesarMhs(props) {
  const bb = props.dataBB;
  const dataAkun = props.dataAkun;

  return (
    <div className="min-h-10v relative">
      <div className="border-b opacity-50 italic font-semibold p-1 pr-2">
        Data Buku besar
      </div> 
      <div className="flex flex-col pb-12 xl:mx-3">
        {/*  */}
        {bb.map((item, index) => {
          return <BukuBesarItemsMhs key={index} item={item} dataAkun={dataAkun} />;
        })}
      </div>
    </div>
  );
}
