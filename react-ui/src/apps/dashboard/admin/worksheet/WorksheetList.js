import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
//import { AuthContext } from "../../../../AppRoute";

import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";

import axios from "axios";
import API from "../../../../utils/host.config";
import ModalNewGameset from "./ModalNewGameset";
import ModalEditGameset from "./ModalEditGameset";
import SlideGame from "./SlideGame";
import LoadingWait from "../../component/LoadingWait";

const useStyles = makeStyles((theme) => ({
  btngameset: {
    textTransform: "capitalize",
  },
}));

export default function WorksheetList() {
  const classes = useStyles();
  // const { dispatch } = useContext(AuthContext);
  const [updated, setUpdated] = useState(0); //counter
  const [load, setLoad] = useState(false);
  const [openNewSet, setOpenNewSet] = useState(false);
  const [openEditSet, setOpenEditSet] = useState(false);

  const [datatemp, setDatatemp] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v1/worksheet/list`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          setData(res.data);
          setLoad(false);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            // dispatch({ type: "LOGOUT" });
          }
        });
    };

    fetchData();
  }, [updated]);

  console.log('datanya ', data);
  return (
    <div className="relative min-h-1/2">
      <Button
        variant="outlined"
        color="primary"
        className={classes.btngameset}
        onClick={() => setOpenNewSet(true)}
      >
        Buat Worksheet
      </Button>

      {load && <LoadingWait />}
      {data.length === 0 && (
        <div className="my-5 p-5 bg-slate-200 text-center text-xl">
          Tidak ada Worksheet tersedia.
        </div>
      )}

      {/* CONTAINER */}
      <div className="mt-5">
        {data.map((item, i) => {
          // console.log(item);
          return (
            <div
              key={i}
              className="pt-5 pb-2 my-2 bg-white shadow rounded border-t"
            >
              <div className="px-5 flex justify-between border-b">
                <h1 className="font-semibold text-lg">{item.name}</h1>
                <IconButton
                  aria-label="setting"
                  onClick={() => {
                    console.log("clik item setting", item);
                    setDatatemp(item);
                    setOpenEditSet(true);
                  }}
                  size="large"
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </div>
              <div className="mt-2 pt-2 min-h-20v">
                <SlideGame
                  items={item}
                  idws={item.id}
                  update={() => setUpdated(updated + 1)}
                />
              </div>
            </div>
          );
        })}

        {/* END CONTAINER */}
      </div>
      <br />

      <ModalNewGameset
        open={openNewSet}
        update={() => setUpdated(updated + 1)}
        close={() => setOpenNewSet(false)}
      />
      {openEditSet && (
        <ModalEditGameset
          open={openEditSet}
          datatemp={datatemp}
          update={() => setUpdated(updated + 1)}
          close={() => setOpenEditSet(false)}
        />
      )}
    </div>
  );
}
