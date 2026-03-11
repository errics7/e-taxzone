import React from "react";
import axios from "axios"; 
import API from "../../../../../utils/host.config";
import toast from "react-hot-toast";

const ConfirmDeleteUsers = (props) => { 

  const deleteusers = () => {
    const deleting = axios.post(
      `${API.HOST}/api/v1/users/deleted`,
      {
        id: props.data.id,
        name: props.data.nama,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    toast.promise(
      deleting,
      {
        loading: "Deleting...",
        success: (data) => {
          // dispatch({
          //   type: "REFRESH",
          //   payload: { count: state.refreshcount + 1 },
          // });
          if (data.data.success === true) props.closeui();
          return data.data.message;
        },
        error: (error) => {
          // if (!error.response.data.auth) dispatch({ type: "LOGOUT" });
          return <b>{error.response.data.message}</b>;
        },
      },
      {
        style: {
          minWidth: "250px",
          border: "1px solid #1E40AF",
          padding: "16px",
          color: "#1E40AF",
          marginBottom: "35px",
        },
        success: {
          duration: 4000,
        },
      }
    );
    //
  };

  return (
    <div className="relative">
      <div className="flex justify-center items-center fixed inset-0 z-50">
        <div className="relative w-auto my-6 mx-auto max-w-6xl">
          <div className="h-48 w-96 py-5 flex flex-col justify-between items-center rounded-lg bg-white shadow-2xl">
            <div>
              <h1>Delete {props.data.role} ?</h1>
            </div>
            <div className="font-bold text-2xl">"{props.data.nama}"</div>
            <div>
              <button
                onClick={() => props.closeui()}
                className="inline-block mr-4 px-6 py-2 text-xs font-medium leading-6 text-center text-red-500 uppercase transition bg-slate-100 rounded-full shadow ripple hover:shadow-lg hover:bg-slate-200 focus:outline-none"
              >
                cancel
              </button>
              <button
                onClick={() => {
                  deleteusers();
                }}
                className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-red-400 rounded-full shadow ripple hover:shadow-lg hover:bg-red-600 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};

export default ConfirmDeleteUsers;
