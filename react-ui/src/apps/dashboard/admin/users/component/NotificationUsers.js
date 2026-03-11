import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../../../../../utils/host.config";
import { ShimmerTable } from "react-shimmer-effects";
import ConfirmDeny from "./ConfirmDeny";
import { toast } from "react-hot-toast";
import ConfirmListNew from "./ConfirmListNew";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

function NotificationUsers(props) {
  const counter = useSelector((state) => state.counter);
  const [activeedd, setactiveedd] = useState(0);
  const [load, setLoad] = useState(false);
  const [dataa, setDataa] = useState({ confirm: null, reject: null });

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      await axios(`${API.HOST}/api/v2/users/needconfirmall`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          setDataa(res.data);
          //
        })
        .catch((error) => {
          if (error.response && !error.response.data.auth) {
            toast.error("Token Tidak valid");
            alert("Token Tidak valid");
          } else {
            toast.error("Terjadi Kesalahan silahkan ulangi kembali");
          }
        })
        .finally(() => {
          setLoad(false);
        });
    };

    fetchData();
  }, [counter.value]);

  return (
    <div className="m-1 relative">
      {load && (
        <div className="absolute inset-0 z-50 bg-slate-300 bg-opacity-10 flex items-center justify-center">
          <CircularProgress />
        </div>
      )}
      <div className="border-b">
        <ul className="flex cursor-pointer">
          <li
            onClick={() => setactiveedd(0)}
            className={`py-2 px-6 mx-1 rounded-t-lg ${
              activeedd === 0
                ? "text-white bg-blue-400"
                : "text-slate-500 bg-slate-200 border-slate-800"
            }`}
          >
            Membutuhkan Konfirmasi
          </li>
          <li
            onClick={() => setactiveedd(1)}
            className={`py-2 px-6 mx-1 rounded-t-lg ${
              activeedd === 1
                ? "text-white bg-blue-400"
                : "text-slate-500 bg-slate-200 border-slate-800"
            }`}
          >
            Ditolak
          </li>
        </ul>
      </div>
      {!dataa.confirm ? (
        <div className="bg-white border rounded">
          <ShimmerTable row={2} col={4} />
        </div>
      ) : activeedd === 0 ? (
        <ConfirmListNew data={dataa.confirm} />
      ) : (
        <ConfirmDeny data={dataa.reject} />
      )}
    </div>
  );
}

export default NotificationUsers;
