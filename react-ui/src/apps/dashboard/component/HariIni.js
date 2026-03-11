import React from "react";
import moment from "moment";
import idLocale from "moment/locale/id";

function HariIni(props) {
  return <div>{moment().locale("id", idLocale).format("LLLL")}</div>;
}

export default HariIni;
