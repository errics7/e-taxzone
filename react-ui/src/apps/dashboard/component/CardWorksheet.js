import { Link, useHistory } from "react-router-dom";
import React, { Fragment, useState } from "react";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import Dialog from "@mui/material/Dialog";

import CardUpdateWorksheet from "./CardUpdateWorksheet";

export default function CardWorksheet(props) {
  const history = useHistory();

  const [dialogeditablegallery, setdialogeditablegallery] = useState(false);

  return (
    <Fragment>
      <Grid item xs={12} md={12} lg={12}>
        <div className="bg-white h-full rounded shadow-md flex flex-col cursor-pointer hover:shadow-lg hover:scale-102 transition-all">
          <div className="flex items-end flex-col grow pb-0 relative">
            <div className="absolute -mt-1 -mr-1">
              <IconButton
                aria-label="edit"
                onClick={() => {
                  setdialogeditablegallery(true);
                }}
                size="large"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </div>

            <div
              className="bg-cover bg-center h-32 w-full px-5 bg-no-repeat"
              style={{
                backgroundImage: `url(${props.img_path})`,
                border: "inset 20px transparent",
              }}
              onClick={() => {
                history.push(`${props.gs}/${props.id}`);
              }}
            ></div>
            <Link
              to={`${props.gs}/${props.id}`}
              className="px-2 flex-col w-full pb-3 bg-slate-100"
            >
              <h2 className="text-xl pt-3 truncate">{props.title}</h2>
              <p className="truncate">{props.deskripsi}</p>
            </Link>
          </div>
        </div>
      </Grid>

      {/*  ISi dialog new Gallery view  */}
      <Dialog fullWidth={true} maxWidth="sm" open={dialogeditablegallery}>
        <CardUpdateWorksheet
          closeui={() => setdialogeditablegallery(false)}
          dataa={props}
          idws={props.idws}
          url={props.img_path}
          isshow={dialogeditablegallery}
        />
      </Dialog>
    </Fragment>
  );
}
