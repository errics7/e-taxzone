import React from "react";
import { useHistory } from "react-router-dom";
import Grid from "@mui/material/Grid";

export default function CardGameSimulasi(props) {
  const history = useHistory();
  
  return (
    <Grid
      item
      xs={12}
      md={12}
      lg={12}
      onClick={() => {
        history.push(`/home/${props.to}/${props.id}`);
      }}
    >
      <div className="bg-white h-full rounded shadow flex flex-col border-t cursor-pointer hover:scale-102 transition-all hover:shadow-lg">
        <div className="flex items-end flex-col grow pb-0">
          <div className="bg-cover bg-center h-32 w-full px-5 bg-no-repeat" 
          style={{ backgroundImage: `url(${props.img_path})`}}></div>
          <div className="px-2 flex-col w-full pb-3 bg-slate-100">
            <p className="text-xl pt-3 truncate">{props.name}</p>
            <p className="text-sm truncate">{props.desc}.</p>
          </div>
        </div>
      </div>
    </Grid>
  );
}
