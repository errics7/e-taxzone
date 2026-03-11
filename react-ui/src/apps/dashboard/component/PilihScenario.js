import React, { useState } from "react";
import { useSelector } from "react-redux";
import ClassIcon from "@mui/icons-material/Class";
import ModalSceneManagerDosen from "./ModalSceneManagerDosen";

function PilihScenario(props) {
  const { source } = props;
  const state = useSelector((state) => state.scen);
  const [manageScen, setManageScen] = useState(false);

  return (
    <div className="bg-white shadow rounded min-h-7v p-5 -mt-5">
      <div className="flex flex-col md:flex-row items-center">
        <label className="text-sm">Kelas :</label>
        <div
          className="flex flex-row min-w-20v max-w-xs mx-3 border rounded cursor-pointer hover:bg-slate-100 hover:bg-opacity-100"
          onClick={() => setManageScen(true)}
        >
          <div className="flex-grow flex justify-center p-2 text-xs text-center truncate">
            {state.selectedcode === "-" ? (
              <div className="relative">
                Kelas Belum Dipillih
                <div className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-ping z-10" />
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

      <ModalSceneManagerDosen
        openn={manageScen}
        source={source}
        closeCallback={() => setManageScen(false)}
      />
    </div>
  );
}

export default PilihScenario;
