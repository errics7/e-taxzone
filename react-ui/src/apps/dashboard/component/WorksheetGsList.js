import React from "react";
import CardWorksheet from "./CardWorksheet";

function WorksheetGsList(props) {
  const { data } = props;

  return (
    <div className="mt-5 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-w-screen-2xl gap-3">
      {data && (data.gs1 !== 0 && data.gs1_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs1}
          gs={"gs1-manufaktur"}
          title={data.gs1_title}
          deskripsi={data.gs1_deskripsi}
          img_path={data.gs1_img_path}
        />
      )}
      {data && (data.gs2 !== 0 && data.gs2_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs2}
          gs={"gs2-manufaktur"}
          title={data.gs2_title}
          deskripsi={data.gs2_deskripsi}
          img_path={data.gs2_img_path}
        />
      )}
      {data && (data.gs3 !== 0 && data.gs3_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs3}
          gs={"gs3-manufaktur"}
          title={data.gs3_title}
          deskripsi={data.gs3_deskripsi}
          img_path={data.gs3_img_path}
        />
      )}
      {data && (data.gs4 !== 0 && data.gs4_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs4}
          gs={"gs4-manufaktur"}
          title={data.gs4_title}
          deskripsi={data.gs4_deskripsi}
          img_path={data.gs4_img_path}
        />
      )}
      {data && (data.gs5 !== 0 && data.gs5_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs5}
          gs={"gs5-manufaktur"}
          title={data.gs5_title}
          deskripsi={data.gs5_deskripsi}
          img_path={data.gs5_img_path}
        />
      )}
      {data && (data.gs6 !== 0 && data.gs6_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs6}
          gs={"gs6-manufaktur"}
          title={data.gs6_title}
          deskripsi={data.gs6_deskripsi}
          img_path={data.gs6_img_path}
        />
      )}
      {data && (data.gs7 !== 0 && data.gs7_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs7}
          gs={"gs7-manufaktur"}
          title={data.gs7_title}
          deskripsi={data.gs7_deskripsi}
          img_path={data.gs7_img_path}
        />
      )}
      {data && (data.gs8 !== 0 && data.gs8_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs8}
          gs={"gs8-manufaktur"}
          title={data.gs8_title}
          deskripsi={data.gs8_deskripsi}
          img_path={data.gs8_img_path}
        />
      )}
      {data && (data.gs9 !== 0 && data.gs9_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs9}
          gs={"gs9-manufaktur"}
          title={data.gs9_title}
          deskripsi={data.gs9_deskripsi}
          img_path={data.gs9_img_path}
        />
      )}
      {data && (data.gs10 !== 0 && data.gs10_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs10}
          gs={"gs10-manufaktur"}
          title={data.gs10_title}
          deskripsi={data.gs10_deskripsi}
          img_path={data.gs10_img_path}
        />
      )}
      {data && (data.gs11 !== 0 && data.gs11_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs11}
          gs={"gs11-manufaktur"}
          title={data.gs11_title}
          deskripsi={data.gs11_deskripsi}
          img_path={data.gs11_img_path}
        />
      )}
      {data && (data.gs12 !== 0 && data.gs12_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs12}
          gs={"gs12-manufaktur"}
          title={data.gs12_title}
          deskripsi={data.gs12_deskripsi}
          img_path={data.gs12_img_path}
        />
      )}
      {data && (data.gs13 !== 0 && data.gs13_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs13}
          gs={"gs13-manufaktur"}
          title={data.gs13_title}
          deskripsi={data.gs13_deskripsi}
          img_path={data.gs13_img_path}
        />
      )}
      {data && (data.gs14 !== 0 && data.gs14_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs14}
          gs={"gs14-manufaktur"}
          title={data.gs14_title}
          deskripsi={data.gs14_deskripsi}
          img_path={data.gs14_img_path}
        />
      )}
      {data && (data.gs15 !== 0 && data.gs15_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs15}
          gs={"gs15-manufaktur"}
          title={data.gs15_title}
          deskripsi={data.gs15_deskripsi}
          img_path={data.gs15_img_path}
        />
      )}
      {data && (data.gs16 !== 0 && data.gs16_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs16}
          gs={"gs16-manufaktur"}
          title={data.gs16_title}
          deskripsi={data.gs16_deskripsi}
          img_path={data.gs16_img_path}
        />
      )}
      {data && (data.gs17 !== 0 && data.gs17_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs17}
          gs={"gs17-manufaktur"}
          title={data.gs17_title}
          deskripsi={data.gs17_deskripsi}
          img_path={data.gs17_img_path}
        />
      )}
      {data && (data.gs18 !== 0 && data.gs18_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.gs18}
          gs={"gs18-manufaktur"}
          title={data.gs18_title}
          deskripsi={data.gs18_deskripsi}
          img_path={data.gs18_img_path}
        />
      )}
      {data && (data.prdg1 !== 0 && data.prdg1_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg1}
          gs={"gs1-perdagangan"}
          title={data.prdg1_title}
          deskripsi={data.prdg1_deskripsi}
          img_path={data.prdg1_img_path}
        />
      )}
      {data && (data.prdg2 !== 0 && data.prdg2_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg2}
          gs={"gs2-perdagangan"}
          title={data.prdg2_title}
          deskripsi={data.prdg2_deskripsi}
          img_path={data.prdg2_img_path}
        />
      )}
      {data && (data.prdg3 !== 0 && data.prdg3_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg3}
          gs={"gs3-perdagangan"}
          title={data.prdg3_title}
          deskripsi={data.prdg3_deskripsi}
          img_path={data.prdg3_img_path}
        />
      )}
      {data && (data.prdg4 !== 0 && data.prdg4_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg4}
          gs={"gs4-perdagangan"}
          title={data.prdg4_title}
          deskripsi={data.prdg4_deskripsi}
          img_path={data.prdg4_img_path}
        />
      )}
      {data && (data.prdg5 !== 0 && data.prdg5_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg5}
          gs={"gs5-perdagangan"}
          title={data.prdg5_title}
          deskripsi={data.prdg5_deskripsi}
          img_path={data.prdg5_img_path}
        />
      )}
      {data && (data.prdg6 !== 0 && data.prdg6_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg6}
          gs={"gs6-perdagangan"}
          title={data.prdg6_title}
          deskripsi={data.prdg6_deskripsi}
          img_path={data.prdg6_img_path}
        />
      )}
      {data && (data.prdg7 !== 0 && data.prdg7_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg7}
          gs={"gs7-perdagangan"}
          title={data.prdg7_title}
          deskripsi={data.prdg7_deskripsi}
          img_path={data.prdg7_img_path}
        />
      )}
      {data && (data.prdg8 !== 0 && data.prdg8_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg8}
          gs={"gs8-perdagangan"}
          title={data.prdg8_title}
          deskripsi={data.prdg8_deskripsi}
          img_path={data.prdg8_img_path}
        />
      )}
      {data && (data.prdg9 !== 0 && data.prdg9_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg9}
          gs={"gs9-perdagangan"}
          title={data.prdg9_title}
          deskripsi={data.prdg9_deskripsi}
          img_path={data.prdg9_img_path}
        />
      )}
      {data && (data.prdg10 !== 0 && data.prdg10_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg10}
          gs={"gs10-perdagangan"}
          title={data.prdg10_title}
          deskripsi={data.prdg10_deskripsi}
          img_path={data.prdg10_img_path}
        />
      )}
      {data && (data.prdg11 !== 0 && data.prdg11_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg11}
          gs={"gs11-perdagangan"}
          title={data.prdg11_title}
          deskripsi={data.prdg11_deskripsi}
          img_path={data.prdg11_img_path}
        />
      )}
      {data && (data.prdg12 !== 0 && data.prdg12_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg12}
          gs={"gs12-perdagangan"}
          title={data.prdg12_title}
          deskripsi={data.prdg12_deskripsi}
          img_path={data.prdg12_img_path}
        />
      )}
      {data && (data.prdg13 !== 0 && data.prdg13_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg13}
          gs={"gs13-perdagangan"}
          title={data.prdg13_title}
          deskripsi={data.prdg13_deskripsi}
          img_path={data.prdg13_img_path}
        />
      )}
      {data && (data.prdg14 !== 0 && data.prdg14_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg14}
          gs={"gs14-perdagangan"}
          title={data.prdg14_title}
          deskripsi={data.prdg14_deskripsi}
          img_path={data.prdg14_img_path}
        />
      )}
      {data && (data.prdg15 !== 0 && data.prdg15_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg15}
          gs={"gs15-perdagangan"}
          title={data.prdg15_title}
          deskripsi={data.prdg15_deskripsi}
          img_path={data.prdg15_img_path}
        />
      )}
      {data && (data.prdg16 !== 0 && data.prdg16_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg16}
          gs={"gs16-perdagangan"}
          title={data.prdg16_title}
          deskripsi={data.prdg16_deskripsi}
          img_path={data.prdg16_img_path}
        />
      )}
      {data && (data.prdg17 !== 0 && data.prdg17_title !== "") && (
        <CardWorksheet
          idws={data.id}
          id={data.prdg17}
          gs={"gs17-perdagangan"}
          title={data.prdg17_title}
          deskripsi={data.prdg17_deskripsi}
          img_path={data.prdg17_img_path}
        />
      )}
    </div>
  );
}

export default WorksheetGsList;
