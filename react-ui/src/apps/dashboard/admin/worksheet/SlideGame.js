import CardWorksheet from "../../component/CardWorksheet";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "./slidegame.css";

// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

export default function SlideGame(props) {
  const idws = props.idws;
  const item = props.items;
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span className="mx-1 p-2 ' + className + '"></span>';
    },
  };

  const countGsActive = () => {
    var x = 0;
    if (item.gs1) x += 1;
    if (item.gs2) x += 1;
    if (item.gs3) x += 1;
    if (item.gs4) x += 1;
    if (item.gs5) x += 1;
    if (item.gs6) x += 1;
    if (item.gs7) x += 1;
    if (item.gs8) x += 1;
    if (item.gs9) x += 1;
    if (item.gs10) x += 1;
    if (item.gs11) x += 1;
    if (item.gs12) x += 1;
    if (item.gs13) x += 1;
    if (item.gs14) x += 1;
    if (item.gs15) x += 1;
    if (item.gs16) x += 1;
    if (item.gs17) x += 1;
    if (item.gs18) x += 1;
    if (item.prdg1) x += 1;
    if (item.prdg2) x += 1;
    if (item.prdg3) x += 1;
    if (item.prdg4) x += 1;
    if (item.prdg5) x += 1;
    if (item.prdg6) x += 1;
    if (item.prdg7) x += 1;
    if (item.prdg8) x += 1;
    if (item.prdg9) x += 1;
    if (item.prdg10) x += 1;
    if (item.prdg11) x += 1;
    if (item.prdg12) x += 1;
    if (item.prdg13) x += 1;
    if (item.prdg14) x += 1;
    if (item.prdg15) x += 1;
    if (item.prdg16) x += 1;
    if (item.prdg17) x += 1;
    return x;
  };

  const updateList = () => {
    props.update();
  };

  return (
    <div className="w-full px-3">
      <Swiper
        slidesPerView={3} // or 'auto'
        slidesPerColumn={2}
        slidesPerGroup={3}
        spaceBetween={10}
        slidesPerColumnFill="row"
        grabCursor={true}
        navigation={countGsActive() > 6 ? true : false}
        pagination={pagination}
      >
        {item.gs1 !== 0 && item.gs1_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs1}
              gs={"gs1"}
              title={item.gs1_title}
              deskripsi={item.gs1_deskripsi}
              img_path={item.gs1_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs2 !== 0 && item.gs2_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs2}
              gs={"gs2"}
              title={item.gs2_title}
              deskripsi={item.gs2_deskripsi}
              img_path={item.gs2_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs3 !== 0 && item.gs3_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs3}
              gs={"gs3"}
              title={item.gs3_title}
              deskripsi={item.gs3_deskripsi}
              img_path={item.gs3_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs4 !== 0 && item.gs4_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs4}
              gs={"gs4"}
              title={item.gs4_title}
              deskripsi={item.gs4_deskripsi}
              img_path={item.gs4_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs5 !== 0 && item.gs5_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs5}
              gs={"gs5"}
              title={item.gs5_title}
              deskripsi={item.gs5_deskripsi}
              img_path={item.gs5_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs6 !== 0 && item.gs6_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs6}
              gs={"gs6"}
              title={item.gs6_title}
              deskripsi={item.gs6_deskripsi}
              img_path={item.gs6_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs7 !== 0 && item.gs7_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs7}
              gs={"gs7"}
              title={item.gs7_title}
              deskripsi={item.gs7_deskripsi}
              img_path={item.gs7_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs8 !== 0 && item.gs8_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs8}
              gs={"gs8"}
              title={item.gs8_title}
              deskripsi={item.gs8_deskripsi}
              img_path={item.gs8_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs9 !== 0 && item.gs9_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs9}
              gs={"gs9"}
              title={item.gs9_title}
              deskripsi={item.gs9_deskripsi}
              img_path={item.gs9_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs10 !== 0 && item.gs10_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs10}
              gs={"gs10"}
              title={item.gs10_title}
              deskripsi={item.gs10_deskripsi}
              img_path={item.gs10_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs11 !== 0 && item.gs11_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs11}
              gs={"gs11"}
              title={item.gs11_title}
              deskripsi={item.gs11_deskripsi}
              img_path={item.gs11_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs12 !== 0 && item.gs12_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs12}
              gs={"gs12"}
              title={item.gs12_title}
              deskripsi={item.gs12_deskripsi}
              img_path={item.gs12_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs13 !== 0 && item.gs13_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs13}
              gs={"gs13"}
              title={item.gs13_title}
              deskripsi={item.gs13_deskripsi}
              img_path={item.gs13_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs14 !== 0 && item.gs14_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs14}
              gs={"gs14"}
              title={item.gs14_title}
              deskripsi={item.gs14_deskripsi}
              img_path={item.gs14_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs15 !== 0 && item.gs15_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs15}
              gs={"gs15"}
              title={item.gs15_title}
              deskripsi={item.gs15_deskripsi}
              img_path={item.gs15_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs16 !== 0 && item.gs16_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs16}
              gs={"gs16"}
              title={item.gs16_title}
              deskripsi={item.gs16_deskripsi}
              img_path={item.gs16_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs17 !== 0 && item.gs17_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs17}
              gs={"gs17"}
              title={item.gs17_title}
              deskripsi={item.gs17_deskripsi}
              img_path={item.gs17_img_path}
            />
          </SwiperSlide>
        )}
        {item.gs18 !== 0 && item.gs18_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.gs18}
              gs={"gs18"}
              title={item.gs18_title}
              deskripsi={item.gs18_deskripsi}
              img_path={item.gs18_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg1 !== 0 && item.prdg1_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg1}
              gs={"perdagangan1"}
              title={item.prdg1_title}
              deskripsi={item.prdg1_deskripsi}
              img_path={item.prdg1_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg2 !== 0 && item.prdg2_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg2}
              gs={"perdagangan2"}
              title={item.prdg2_title}
              deskripsi={item.prdg2_deskripsi}
              img_path={item.prdg2_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg3 !== 0 && item.prdg3_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg3}
              gs={"perdagangan3"}
              title={item.prdg3_title}
              deskripsi={item.prdg3_deskripsi}
              img_path={item.prdg3_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg4 !== 0 && item.prdg4_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg4}
              gs={"perdagangan4"}
              title={item.prdg4_title}
              deskripsi={item.prdg4_deskripsi}
              img_path={item.prdg4_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg5 !== 0 && item.prdg5_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg5}
              gs={"perdagangan5"}
              title={item.prdg5_title}
              deskripsi={item.prdg5_deskripsi}
              img_path={item.prdg5_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg6 !== 0 && item.prdg6_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg6}
              gs={"perdagangan6"}
              title={item.prdg6_title}
              deskripsi={item.prdg6_deskripsi}
              img_path={item.prdg6_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg7 !== 0 && item.prdg7_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg7}
              gs={"perdagangan7"}
              title={item.prdg7_title}
              deskripsi={item.prdg7_deskripsi}
              img_path={item.prdg7_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg8 !== 0 && item.prdg8_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg8}
              gs={"perdagangan8"}
              title={item.prdg8_title}
              deskripsi={item.prdg8_deskripsi}
              img_path={item.prdg8_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg9 !== 0 && item.prdg9_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg9}
              gs={"perdagangan9"}
              title={item.prdg9_title}
              deskripsi={item.prdg9_deskripsi}
              img_path={item.prdg9_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg10 !== 0 && item.prdg10_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg10}
              gs={"perdagangan10"}
              title={item.prdg10_title}
              deskripsi={item.prdg10_deskripsi}
              img_path={item.prdg10_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg11 !== 0 && item.prdg11_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg11}
              gs={"perdagangan11"}
              title={item.prdg11_title}
              deskripsi={item.prdg11_deskripsi}
              img_path={item.prdg11_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg12 !== 0 && item.prdg12_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg12}
              gs={"perdagangan12"}
              title={item.prdg12_title}
              deskripsi={item.prdg12_deskripsi}
              img_path={item.prdg12_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg13 !== 0 && item.prdg13_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg13}
              gs={"perdagangan13"}
              title={item.prdg13_title}
              deskripsi={item.prdg13_deskripsi}
              img_path={item.prdg13_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg14 !== 0 && item.prdg14_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg14}
              gs={"perdagangan14"}
              title={item.prdg14_title}
              deskripsi={item.prdg14_deskripsi}
              img_path={item.prdg14_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg15 !== 0 && item.prdg15_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg15}
              gs={"perdagangan15"}
              title={item.prdg15_title}
              deskripsi={item.prdg15_deskripsi}
              img_path={item.prdg15_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg16 !== 0 && item.prdg16_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg16}
              gs={"perdagangan16"}
              title={item.prdg16_title}
              deskripsi={item.prdg16_deskripsi}
              img_path={item.prdg16_img_path}
            />
          </SwiperSlide>
        )}
        {item.prdg17 !== 0 && item.prdg17_title !== "" && (
          <SwiperSlide className="grid-container">
            <CardWorksheet
              updateList={() => updateList()}
              idws={idws}
              id={item.prdg17}
              gs={"perdagangan17"}
              title={item.prdg17_title}
              deskripsi={item.prdg17_deskripsi}
              img_path={item.prdg17_img_path}
            />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
}
