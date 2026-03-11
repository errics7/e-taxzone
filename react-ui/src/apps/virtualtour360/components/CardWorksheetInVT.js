import React from "react";

export default function CardWorksheetInVT(props) {
  const { onChangeTarget, id, title, deskripsi, img_path, status, to } = props;

  return (
    <div
      onClick={() => {
        onChangeTarget({
          id: id,
          title: title,
          deskripsi: deskripsi,
          to: to,
        });
      }}
      className="bg-white relative h-full rounded border shadow-md flex flex-col cursor-pointer hover:shadow-lg hover:scale-102 transition-all"
    >
      {status && (
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-400 text-sm z-50 rounded text-white animate-lompat">
          Terpilih
        </div>
      )}
      <div className="flex items-end flex-col grow pb-0 relative">
        <div
          className="bg-cover bg-center h-32 w-full px-5 bg-no-repeat"
          style={{
            backgroundImage: `url(${img_path})`,
            border: "inset 20px transparent",
          }}
        ></div>
        <div className="px-2 flex-col w-full pb-3 bg-slate-100">
          <h2 className="text-xl pt-3 truncate">{title}</h2>
          <p className="truncate">{deskripsi}</p>
        </div>
      </div>
    </div>
  );
}
