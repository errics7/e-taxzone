import React from "react";
import { useParams } from "react-router-dom";
import CardWorksheetInVT from "./CardWorksheetInVT";

function WorksheetGsListInVT(props) {
  const { code } = useParams();
  const { select, data, onChangeTarget } = props;

  console.log(data);

  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-30v overflow-y-scroll gap-3">
      {data && data.gs1_title !== "" && (
        <CardWorksheetInVT
          id={data.gs1}
          to={`home/f/${code}/gs1-manufaktur/${data.gs1}`}
          status={
            Number(data.gs1) === Number(select.to_id) &&
            select.name === data.gs1_title
          }
          title={data.gs1_title}
          deskripsi={data.gs1_deskripsi}
          img_path={data.gs1_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs2_title !== "" && (
        <CardWorksheetInVT
          id={data.gs2}
          to={`home/f/${code}/gs2-manufaktur/${data.gs2}`}
          status={
            Number(data.gs2) === Number(select.to_id) &&
            select.name === data.gs2_title
          }
          title={data.gs2_title}
          deskripsi={data.gs2_deskripsi}
          img_path={data.gs2_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs3_title !== "" && (
        <CardWorksheetInVT
          id={data.gs3}
          to={`home/f/${code}/gs3-manufaktur/${data.gs3}`}
          status={
            Number(data.gs3) === Number(select.to_id) &&
            select.name === data.gs3_title
          }
          title={data.gs3_title}
          deskripsi={data.gs3_deskripsi}
          img_path={data.gs3_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs4_title !== "" && (
        <CardWorksheetInVT
          id={data.gs4}
          to={`home/f/${code}/gs4-manufaktur/${data.gs4}`}
          status={
            Number(data.gs4) === Number(select.to_id) &&
            select.name === data.gs4_title
          }
          title={data.gs4_title}
          deskripsi={data.gs4_deskripsi}
          img_path={data.gs4_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs5_title !== "" && (
        <CardWorksheetInVT
          id={data.gs5}
          to={`home/f/${code}/gs5-manufaktur/${data.gs5}`}
          status={
            Number(data.gs5) === Number(select.to_id) &&
            select.name === data.gs5_title
          }
          title={data.gs5_title}
          deskripsi={data.gs5_deskripsi}
          img_path={data.gs5_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs6_title !== "" && (
        <CardWorksheetInVT
          id={data.gs6}
          to={`home/f/${code}/gs6-manufaktur/${data.gs6}`}
          status={
            Number(data.gs6) === Number(select.to_id) &&
            select.name === data.gs6_title
          }
          title={data.gs6_title}
          deskripsi={data.gs6_deskripsi}
          img_path={data.gs6_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs7_title !== "" && (
        <CardWorksheetInVT
          id={data.gs7}
          to={`home/f/${code}/gs7-manufaktur/${data.gs7}`}
          status={
            Number(data.gs7) === Number(select.to_id) &&
            select.name === data.gs7_title
          }
          title={data.gs7_title}
          deskripsi={data.gs7_deskripsi}
          img_path={data.gs7_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs8_title !== "" && (
        <CardWorksheetInVT
          id={data.gs8}
          to={`home/f/${code}/gs8-manufaktur/${data.gs8}`}
          status={
            Number(data.gs8) === Number(select.to_id) &&
            select.name === data.gs8_title
          }
          title={data.gs8_title}
          deskripsi={data.gs8_deskripsi}
          img_path={data.gs8_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs9_title !== "" && (
        <CardWorksheetInVT
          id={data.gs9}
          to={`home/f/${code}/gs9-manufaktur/${data.gs9}`}
          status={
            Number(data.gs9) === Number(select.to_id) &&
            select.name === data.gs9_title
          }
          title={data.gs9_title}
          deskripsi={data.gs9_deskripsi}
          img_path={data.gs9_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs10_title !== "" && (
        <CardWorksheetInVT
          id={data.gs10}
          to={`home/f/${code}/gs10-manufaktur/${data.gs10}`}
          status={
            Number(data.gs10) === Number(select.to_id) &&
            select.name === data.gs10_title
          }
          title={data.gs10_title}
          deskripsi={data.gs10_deskripsi}
          img_path={data.gs10_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs11_title !== "" && (
        <CardWorksheetInVT
          id={data.gs11}
          to={`home/f/${code}/gs11-manufaktur/${data.gs11}`}
          status={
            Number(data.gs11) === Number(select.to_id) &&
            select.name === data.gs11_title
          }
          title={data.gs11_title}
          deskripsi={data.gs11_deskripsi}
          img_path={data.gs11_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs12_title !== "" && (
        <CardWorksheetInVT
          id={data.gs12}
          to={`home/f/${code}/gs12-manufaktur/${data.gs12}`}
          status={
            Number(data.gs12) === Number(select.to_id) &&
            select.name === data.gs12_title
          }
          title={data.gs12_title}
          deskripsi={data.gs12_deskripsi}
          img_path={data.gs12_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs13_title !== "" && (
        <CardWorksheetInVT
          id={data.gs13}
          to={`home/f/${code}/gs13-manufaktur/${data.gs13}`}
          status={
            Number(data.gs13) === Number(select.to_id) &&
            select.name === data.gs13_title
          }
          title={data.gs13_title}
          deskripsi={data.gs13_deskripsi}
          img_path={data.gs13_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs14_title !== "" && (
        <CardWorksheetInVT
          id={data.gs14}
          to={`home/f/${code}/gs14-manufaktur/${data.gs14}`}
          status={
            Number(data.gs14) === Number(select.to_id) &&
            select.name === data.gs14_title
          }
          title={data.gs14_title}
          deskripsi={data.gs14_deskripsi}
          img_path={data.gs14_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs15_title !== "" && (
        <CardWorksheetInVT
          id={data.gs15}
          to={`home/f/${code}/gs15-manufaktur/${data.gs15}`}
          status={
            Number(data.gs15) === Number(select.to_id) &&
            select.name === data.gs15_title
          }
          title={data.gs15_title}
          deskripsi={data.gs15_deskripsi}
          img_path={data.gs15_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs16_title !== "" && (
        <CardWorksheetInVT
          id={data.gs16}
          to={`home/f/${code}/gs16-manufaktur/${data.gs16}`}
          status={
            Number(data.gs16) === Number(select.to_id) &&
            select.name === data.gs16_title
          }
          title={data.gs16_title}
          deskripsi={data.gs16_deskripsi}
          img_path={data.gs16_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs17_title !== "" && (
        <CardWorksheetInVT
          id={data.gs17}
          to={`home/f/${code}/gs17-manufaktur/${data.gs17}`}
          status={
            Number(data.gs17) === Number(select.to_id) &&
            select.name === data.gs17_title
          }
          title={data.gs17_title}
          deskripsi={data.gs17_deskripsi}
          img_path={data.gs17_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.gs18_title !== "" && (
        <CardWorksheetInVT
          id={data.gs18}
          to={`home/f/${code}/gs18-manufaktur/${data.gs18}`}
          status={
            Number(data.gs18) === Number(select.to_id) &&
            select.name === data.gs18_title
          }
          title={data.gs18_title}
          deskripsi={data.gs18_deskripsi}
          img_path={data.gs18_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg1_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg1}
          to={`home/f/${code}/gs1-perdagangan/${data.prdg1}`}
          status={
            Number(data.prdg1) === Number(select.to_id) &&
            select.name === data.prdg1_title
          }
          title={data.prdg1_title}
          deskripsi={data.prdg1_deskripsi}
          img_path={data.prdg1_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg2_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg2}
          to={`home/f/${code}/gs2-perdagangan/${data.prdg2}`}
          status={
            Number(data.prdg2) === Number(select.to_id) &&
            select.name === data.prdg2_title
          }
          title={data.prdg2_title}
          deskripsi={data.prdg2_deskripsi}
          img_path={data.prdg2_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg3_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg3}
          to={`home/f/${code}/gs3-perdagangan/${data.prdg3}`}
          status={
            Number(data.prdg3) === Number(select.to_id) &&
            select.name === data.prdg3_title
          }
          title={data.prdg3_title}
          deskripsi={data.prdg3_deskripsi}
          img_path={data.prdg3_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg4_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg4}
          to={`home/f/${code}/gs4-perdagangan/${data.prdg4}`}
          status={
            Number(data.prdg4) === Number(select.to_id) &&
            select.name === data.prdg4_title
          }
          title={data.prdg4_title}
          deskripsi={data.prdg4_deskripsi}
          img_path={data.prdg4_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg5_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg5}
          to={`home/f/${code}/gs5-perdagangan/${data.prdg5}`}
          status={
            Number(data.prdg5) === Number(select.to_id) &&
            select.name === data.prdg5_title
          }
          title={data.prdg5_title}
          deskripsi={data.prdg5_deskripsi}
          img_path={data.prdg5_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg6_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg6}
          to={`home/f/${code}/gs6-perdagangan/${data.prdg6}`}
          status={
            Number(data.prdg6) === Number(select.to_id) &&
            select.name === data.prdg6_title
          }
          title={data.prdg6_title}
          deskripsi={data.prdg6_deskripsi}
          img_path={data.prdg6_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg7_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg7}
          to={`home/f/${code}/gs7-perdagangan/${data.prdg7}`}
          status={
            Number(data.prdg7) === Number(select.to_id) &&
            select.name === data.prdg7_title
          }
          title={data.prdg7_title}
          deskripsi={data.prdg7_deskripsi}
          img_path={data.prdg7_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg8_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg8}
          to={`home/f/${code}/gs8-perdagangan/${data.prdg8}`}
          status={
            Number(data.prdg8) === Number(select.to_id) &&
            select.name === data.prdg8_title
          }
          title={data.prdg8_title}
          deskripsi={data.prdg8_deskripsi}
          img_path={data.prdg8_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg9_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg9}
          to={`home/f/${code}/gs9-perdagangan/${data.prdg9}`}
          status={
            Number(data.prdg9) === Number(select.to_id) &&
            select.name === data.prdg9_title
          }
          title={data.prdg9_title}
          deskripsi={data.prdg9_deskripsi}
          img_path={data.prdg9_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg10_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg10}
          to={`home/f/${code}/gs10-perdagangan/${data.prdg10}`}
          status={
            Number(data.prdg10) === Number(select.to_id) &&
            select.name === data.prdg10_title
          }
          title={data.prdg10_title}
          deskripsi={data.prdg10_deskripsi}
          img_path={data.prdg10_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg11_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg11}
          to={`home/f/${code}/gs11-perdagangan/${data.prdg11}`}
          status={
            Number(data.prdg11) === Number(select.to_id) &&
            select.name === data.prdg11_title
          }
          title={data.prdg11_title}
          deskripsi={data.prdg11_deskripsi}
          img_path={data.prdg11_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg12_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg12}
          to={`home/f/${code}/gs12-perdagangan/${data.prdg12}`}
          status={
            Number(data.prdg12) === Number(select.to_id) &&
            select.name === data.prdg12_title
          }
          title={data.prdg12_title}
          deskripsi={data.prdg12_deskripsi}
          img_path={data.prdg12_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg13_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg13}
          to={`home/f/${code}/gs13-perdagangan/${data.prdg13}`}
          status={
            Number(data.prdg13) === Number(select.to_id) &&
            select.name === data.prdg13_title
          }
          title={data.prdg13_title}
          deskripsi={data.prdg13_deskripsi}
          img_path={data.prdg13_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg14_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg14}
          to={`home/f/${code}/gs14-perdagangan/${data.prdg14}`}
          status={
            Number(data.prdg14) === Number(select.to_id) &&
            select.name === data.prdg14_title
          }
          title={data.prdg14_title}
          deskripsi={data.prdg14_deskripsi}
          img_path={data.prdg14_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg15_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg15}
          to={`home/f/${code}/gs15-perdagangan/${data.prdg15}`}
          status={
            Number(data.prdg15) === Number(select.to_id) &&
            select.name === data.prdg15_title
          }
          title={data.prdg15_title}
          deskripsi={data.prdg15_deskripsi}
          img_path={data.prdg15_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg16_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg16}
          to={`home/f/${code}/gs16-perdagangan/${data.prdg16}`}
          status={
            Number(data.prdg16) === Number(select.to_id) &&
            select.name === data.prdg16_title
          }
          title={data.prdg16_title}
          deskripsi={data.prdg16_deskripsi}
          img_path={data.prdg16_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
      {data && data.prdg17_title !== "" && (
        <CardWorksheetInVT
          id={data.prdg17}
          to={`home/f/${code}/gs17-perdagangan/${data.prdg17}`}
          status={
            Number(data.prdg17) === Number(select.to_id) &&
            select.name === data.prdg17_title
          }
          title={data.prdg17_title}
          deskripsi={data.prdg17_deskripsi}
          img_path={data.prdg17_img_path}
          onChangeTarget={(x) => onChangeTarget(x)}
        />
      )}
    </div>
  );
}

export default WorksheetGsListInVT;
