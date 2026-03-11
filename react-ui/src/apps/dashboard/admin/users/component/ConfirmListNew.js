//#region
import React, { useState } from "react";
import axios from "axios";
import API from "../../../../../utils/host.config";
import MUIDataTable from "mui-datatables";
import toast from "react-hot-toast";
import { refresh } from "../../../../../redux/counterSlice";
import { useDispatch } from "react-redux";
import swal from "sweetalert";
//
//#endregion

export default function ConfirmListNew(props) {
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
      label: "Nama",
      name: "nama",
    },
    {
      label: "NIM",
      name: "nim",
    },
    {
      label: "Kelas",
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
                  swal(`Anda akan menolak akun "${data[dataIndex].nama}" ?`, {
                    buttons: {
                      cancel: "Batal",
                      catch: {
                        text: "Tolak",
                        value: "oke",
                        className: "ml-5",
                      },
                    },
                    icon: "info",
                    dangerMode: true,
                  }).then((value) => {
                    switch (value) {
                      case "oke":
                        confirmationUser(dataIndex, "deny");
                        break;
                      default:
                        return;
                    }
                  });
                }}
                className="bg-red-200 rounded font-bold py-1 px-3 mx-1 text-xs focus:outline-none hover:scale-110 transition-all hover:shadow"
              >
                Tolak
              </button>
              <button
                onClick={(event) => {
                  swal(`Konfirmasi untuk akun "${data[dataIndex].nama}" ?`, {
                    buttons: {
                      cancel: "Batal",
                      catch: {
                        text: "Konfirmasi",
                        value: "oke",
                        className: "ml-5",
                      },
                    },
                    icon: "info",
                    dangerMode: true,
                  }).then((value) => {
                    switch (value) {
                      case "oke":
                        confirmationUser(dataIndex, "allow");
                        break;
                      default:
                        return;
                    }
                  });
                }}
                className="bg-emerald-200 rounded font-bold py-1 px-3 mx-1 text-xs focus:outline-none hover:scale-110 transition-all hover:shadow"
              >
                Konfirmasi
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
    filter: false,
    viewColumns: false,
    download: false,
    print: false,
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "Tidak ada akun baru untuk dikonfirmasi",
      },
    },
  };

  return (
    <MUIDataTable
      title={"Membutuhkan Konfirmasi"}
      data={data}
      columns={columns}
      options={options}
    />
  );
}
