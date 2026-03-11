import React, { useState } from "react";
import { useSelector } from "react-redux";
import ClassIcon from "@mui/icons-material/Class";
import ModalSceneManagerDosen from "./ModalSceneManagerDosen";
import { Checkbox, FormControlLabel } from "@mui/material";

function PilihScenarioAdmin(props) {
  const { source, mode, setMode } = props;
  const state = useSelector((state) => state.scen);
  const [manageScen, setManageScen] = useState(false);

  const handeMode = () => {
    if (mode === "default") {
      setMode("skenario");
    } else {
      setMode("default");
    }
  };

  return (
    <div className="bg-white shadow rounded min-h-7v p-5 -mt-5">
      <p>Pilih Mode :</p>
      <div className="flex flex-col md:flex-row items-center space-x-3">
        <div className="flex items-center">
          <FormControlLabel
            control={
              <Checkbox
                checked={mode === "skenario" ? true : false}
                onChange={() => handeMode()}
              />
            }
          />
          <label className="text-sm">Skenario kelas :</label>
          <div
            className={`flex flex-row min-w-20v max-w-xs mx-3 border rounded hover:bg-opacity-100 ${
              mode !== "skenario"
                ? " blur-xs"
                : "cursor-pointer hover:bg-slate-100"
            }`}
            onClick={() => {
              if (mode === "skenario") {
                setManageScen(true);
              }
            }}
          >
            <div className="flex-grow flex justify-center p-2 text-xs text-center truncate">
              {state.selectedcode === "-" ? (
                <div className="relative">
                  Skenario Kelas Belum Dipillih
                  <div className="absolute top-0 -right-1  w-1 h-1 animate-pulse bg-red-500 rounded-full z-10"></div>
                </div>
              ) : (
                state.nama
              )}
            </div>

            <div className="flex-shrink w-10 flex justify-center items-center">
              <ClassIcon className="text-slate-600 mr-1 p-0.5 z-50" />
            </div>
          </div>
        </div>
        <div className="flex items-center border-l pl-5">
          <FormControlLabel
            control={
              <Checkbox
                checked={mode === "default" ? true : false}
                onChange={() => handeMode()}
              />
            }
            label="Pengaturan Template Virtual Tour."
          />
        </div>
      </div>

      <ModalSceneManagerDosen
        openn={manageScen}
        source={source}
        closeCallback={() => setManageScen(false)}
      />
    </div>
  );
}

export default PilihScenarioAdmin;
<div></div>;
