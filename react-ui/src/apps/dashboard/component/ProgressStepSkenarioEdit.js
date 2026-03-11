import React, { useState } from "react";
import axios from "axios";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

function ProgressStepSkenarioEdit({
  posisi,
  setPosisi,
  setDataWsScn,
  dataScn,
}) {
  const [isLoad, setIsLoad] = useState(false);

  const getlistWorksheet = () => {
    setIsLoad(true);
    const call = axios(
      `${API.HOST}/api/v2/skenario/listgsworksheet/${dataScn.worksheet_id}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    ).catch((err) => {
      setIsLoad(false);
      console.error(err);
    });

    toast.promise(
      call,
      {
        loading: "mohon tunggu ...",
        success: (data) => {
          setIsLoad(false);
          // console.log(data.data);
          setDataWsScn(data.data);
          setPosisi(2);
          return "";
        },
        error: (error) => {
          setIsLoad(false);
          console.log(error);

          return (
            <div className="relative">
              <span className="absolute inset-y-0 -left-5 flex items-center">
                ❌
              </span>
              <p className="pl-3">
                <b>{error.response.data.message}</b>
              </p>
            </div>
          );
        },
      },
      {
        style: {
          minWidth: "250px",
          border: "1px solid #1E40AF",
          padding: "16px",
          color: "#1E40AF",
          marginBottom: "25px",
        },
        success: {
          duration: 1,
          icon: "",
        },
        error: {
          duration: 4500,
          icon: "",
        },
      }
    );
  };

  return (
    <div className="my-4 relative">
      {isLoad && (
        <div className="absolute inset-0 z-50">
          <div className="flex justify-center items-center min-h-50v">
            <CircularProgress />
          </div>
        </div>
      )}
      <div className="flex pb-3 border-b">
        <div
          className="flex-1 text-center group cursor-pointer"
          onClick={() => {
            setPosisi(1);
          }}
        >
          <div
            className={`group-hover:bg-sky-400 group-hover:text-white mx-auto font-bold text-lg border-2 rounded-full ${
              posisi === 1
                ? "bg-sky-600 border-blue-500 text-white"
                : "bg-white border-blue-200 text-blue-300"
            } flex items-center justify-center`}
            style={{ height: "38px", width: "38px" }}
          >
            1
          </div>
          <p
            className={`group-hover:text-sky-400 pt-1 text-sm ${
              posisi === 1 ? "text-blue-500" : "text-slate-300"
            }`}
          >
            informasi
          </p>
        </div>

        <div className="w-1/3 align-center items-center align-middle content-center flex">
          <div
            className={`w-full h-2 border border-blue-100 ${
              posisi > 1 && "bg-blue-400"
            } rounded-full items-center align-middle align-center flex-1`}
          >
            &nbsp;
          </div>
        </div>

        <div
          className="flex-1 group text-center cursor-pointer "
          onClick={() => {
            getlistWorksheet();
          }}
        >
          <div
            className={` group-hover:bg-sky-400 group-hover:text-white mx-auto font-bold text-lg border-2 rounded-full ${
              posisi === 2
                ? "bg-sky-600 border-blue-500 text-white"
                : "bg-white border-blue-200 text-blue-300"
            } flex items-center justify-center`}
            style={{ height: "38px", width: "38px" }}
          >
            2
          </div>
          <p
            className={`group-hover:text-sky-400 pt-1 text-sm ${
              posisi === 2 ? "text-blue-500" : "text-slate-300"
            }`}
          >
            Game Simulasi
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProgressStepSkenarioEdit;
