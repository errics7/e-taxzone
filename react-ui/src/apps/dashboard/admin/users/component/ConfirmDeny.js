//#region
import React, { useState } from "react";
import axios from "axios";
import API from "../../../../../utils/host.config";
import MUIDataTable from "mui-datatables";
import { Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { refresh } from "../../../../../redux/counterSlice";
import { useDispatch } from "react-redux";
import swal from "sweetalert";
//

//#endregion

export default function ConfirmDeny(props) {
  const { data } = props;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const confirmCall = (data, st) => {
    return axios
      .post(
        `${API.HOST}/api/v2/users/regconfirm`,
        {
          id: data?.id,
          name: data?.nama,
          status: st,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
          },
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  const confirmationUser = (id, status) => {
    if (isLoading) return;
    setIsLoading(true);

    let promise = confirmCall(data[id], status);
    toast.promise(
      promise,
      {
        loading: "Mohon Tunggu...",
        success: (data) => {
          dispatch(refresh());

          return data.data.success ? (
            <div className="relative">
              <span className="absolute inset-y-0 -left-5 flex items-center">
                ✅
              </span>
              <p className="pl-3">{data.data.message}</p>
            </div>
          ) : (
            <div className="relative">
              <span className="absolute inset-y-0 -left-5 flex items-center">
                ❌
              </span>
              <p className="pl-3">{data.data.message}</p>
            </div>
          );
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
        },
        success: {
          duration: 5000,
          icon: "",
        },
      }
    );
  };

  const columns = [
    {
      label: "Name",
      name: "nama",
    },
    {
      label: "NIM",
      name: "nim",
    },
    {
      label: "kelas",
      name: "kelas",
    },
    {
      label: "Tanggal Daftar",
      name: "lastlogin",
    },
    {
      name: "Aksi",
      options: {
        filter: false,
        sort: false,
        empty: true,
        setCellHeaderProps: (value) => {
          return {
            style: {
              textAlign: "center",
            },
          };
        },
        customBodyRenderLite: (dataIndex) => {
          return (
            <div className="flex justify-around">
              <button
                onClick={(event) => {
                  confirmationUser(dataIndex, "restore");
                }}
                className="bg-slate-200 hover:bg-blue-400 rounded hover:text-slate-50 hover:font-bold py-1 px-3 mx-1 text-xs focus:outline-none hover:scale-105 transition-all hover:shadow"
              >
                restore
              </button>
              <button
                onClick={(event) => {
                  swal(`Akun "${data[dataIndex].nama}" akan dihapus`, {
                    buttons: {
                      cancel: "Batal",
                      catch: {
                        text: "Hapus",
                        value: "oke",
                        className: "ml-5 bg-red-400 hover:bg-red-500",
                      },
                    },
                    icon: "info",
                    dangerMode: true,
                  }).then((value) => {
                    switch (value) {
                      case "oke":
                        confirmationUser(dataIndex, "deleteforever");
                        break;
                      default:
                        return;
                    }
                  });
                }}
                className="py-1 px-2 mx-1 focus:outline-none hover:text-red-500 hover:scale-110 transition-all hover:shadow"
              >
                <Tooltip placement="top" title="Click untuk Hapus ini Akun">
                  <DeleteForeverIcon fontSize="small" />
                </Tooltip>
              </button>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    rowsPerPage: 3,
    rowsPerPageOptions: [3, 5, 10],
    filterType: "dropdown",
    responsive: "vertical",
    filter: false,
    viewColumns: false,
    download: false,
    print: false,
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "Data Kosong ...",
      },
    },
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-slate-300 bg-opacity-10 flex items-center justify-center">
          <CircularProgress />
        </div>
      )}
      <MUIDataTable
        title={"Akun Ditolak"}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
}
