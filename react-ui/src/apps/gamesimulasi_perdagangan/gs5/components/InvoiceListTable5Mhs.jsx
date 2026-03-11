//#region
import React from "react";
import NotaKontanMhs from "./NotaKontanMhs";
import NotaKasMhs from "./NotaKasMhs";
//#endregion

export default function InvoiceListTable5Mhs(props) {
  const datanota = props.dataConfig.datanota;

  return (
    <div className="">
      <div className="w-full flex flex-col items-center justify-center">
        {datanota.map((itmnota, i) => {
          return (
            <div className="w-full mt-8" key={i}>
              <div className="relative py-2">
                {itmnota.type === "kontan" ? (
                  <p>{props.dataConfig ? props.dataConfig.introkontan : " "}</p>
                ) : (
                  <p>{props.dataConfig ? props.dataConfig.introkas : " "}</p>
                )}
              </div>
              {itmnota.type === "kontan" ? (
                <NotaKontanMhs
                  itmnota={itmnota}
                  dataConfig={props.dataConfig}
                />
              ) : (
                <NotaKasMhs itmnota={itmnota} dataConfig={props.dataConfig} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
