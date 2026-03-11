import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../../../../../utils/host.config";
import MUIDataTable from "mui-datatables";
//mod
import { toast } from "react-hot-toast";
import { Button, CircularProgress } from "@mui/material";
import { ShimmerBadge, ShimmerTable } from "react-shimmer-effects";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import UpdateMahasiswaAdmin from "./UpdateMahasiswaAdmin";
import NewUsers from "./NewUsers";
import { UploadNewUsers } from "./UploadNewUsers";

function TableUser(props) {
  const counter = useSelector((state) => state.counter);
  const [load, setLoad] = useState(false);
  const [data, setdata] = useState(null);
  const [useredit, setuseredit] = useState(null);
  const [userBaru, setuserBaru] = useState(false);

  const columns = [
    {
      label: "Nama",
      name: "nama",
      options: {
        filter: true,
        setCellProps: (value) => {
          return {
            className: "pl-3",
          };
        },
        setCellHeaderProps: (value) => {
          return {
            style: {
              paddingLeft: 25,
            },
          };
        },
      },
    },
    {
      label: "NIM",
      name: "nim",
      options: {
        empty: true,
        setCellHeaderProps: (value) => {
          return {
            style: {
              paddingLeft: 25,
            },
          };
        },
        customBodyRenderLite: (dataIndex) => {
          return (
            <div className="">
              {data[dataIndex].role === 1 ? (
                data[dataIndex].nim
              ) : (
                <>
                  {data[dataIndex].email !== "" ? (
                    data[dataIndex].email
                  ) : (
                    <>NIP:{data[dataIndex].nim}</>
                  )}
                </>
              )}
            </div>
          );
        },
      },
    },
    {
      label: "kelas",
      name: "kelas",
      options: {
        empty: true,
        setCellHeaderProps: (value) => {
          return {
            style: {
              paddingLeft: 25,
            },
          };
        },
        customBodyRenderLite: (dataIndex) => {
          return (
            <div className="">
              {data[dataIndex].role === 1 ? data[dataIndex].kelas : <>-</>}
            </div>
          );
        },
      },
    },
    {
      label: "Login Terakhir",
      name: "lastlogin",
    },
    {
      label: "Role",
      name: "role_permission.role_name",
      options: {
        empty: true,
        setCellHeaderProps: (value) => {
          return {
            style: {
              paddingLeft: 25,
            },
          };
        },
        customBodyRenderLite: (dataIndex) => {
          return (
            <div className="">
              {data[dataIndex].role === 1 ? (
                <span className="px-4 py-1.5 text-white bg-emerald-500 rounded-md">
                  Mahasiswa
                </span>
              ) : data[dataIndex].role === 3 ? (
                <span className="px-4 py-1.5 text-white bg-red-300 rounded-md">
                  Admin
                </span>
              ) : (
                <span className="px-4 py-1.5 text-white bg-sky-500 rounded-md">
                  Dosen
                </span>
              )}
            </div>
          );
        },
      },
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
              paddingLeft: 25,
            },
          };
        },
        customBodyRenderLite: (dataIndex) => {
          return (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => {
                setuseredit(data[dataIndex]);
              }}
            >
              {" "}
              Edit
            </Button>
          );
        },
      },
    },
  ];

  useEffect(() => {
    const fetchData = () => {
      setLoad(true);
      axios(`${API.HOST}/api/v2/users/getalluser`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      })
        .then((res) => {
          // console.log(res.data);
          if (res.data.success) {
            setdata(res.data.data);
          } else {
            toast.error("Terjadi Kesalahan silahkan ulangi kembali");
          }
        })
        .catch((error) => {
          if (error.response && !error.response.data.auth) {
            toast.error("Sesi telah berakhir Silahkan login ulang");
          } else {
            toast.error("Terjadi kesalahan silahkan ulangi kembali");
          }
        })
        .finally(() => {
          setLoad(false);
        });
    };
    fetchData();
  }, [counter.value]);

  const CustomToolbar = ({ displayData }) => {
    return (
      <div className="flex gap-2 justify-end">
        <UploadNewUsers />
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PersonAddAltIcon />}
          onClick={() => setuserBaru(true)}
        >
          Tambah Pengguna
        </Button>
      </div>
    );
  };

  const options = {
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15, 25],
    filterType: "dropdown",
    responsive: "vertical",
    download: false,
    print: false,
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "Data Kosong ...",
      },
    },
    customToolbar: CustomToolbar,
  };

  return (
    <>
      <div className="relative flex flex-col my-3 min-h-40v mt-10">
        {load && (
          <div className="absolute inset-0 z-50 bg-slate-300 bg-opacity-10 flex items-center justify-center">
            <CircularProgress />
          </div>
        )}

        {data ? (
          <MUIDataTable
            title={"Daftar Pengguna"}
            data={data}
            columns={columns}
            options={options}
          />
        ) : (
          <div className="bg-white border rounded">
            <div className="mt-8 mx-5 flex justify-between">
              <ShimmerBadge width={300} />
              <ShimmerBadge width={200} />
            </div>
            <ShimmerTable row={5} col={5} />
          </div>
        )}
      </div>

      {useredit ? (
        <UpdateMahasiswaAdmin
          data={useredit}
          closeui={() => setuseredit(null)}
        />
      ) : null}

      <NewUsers isopen={userBaru} closeui={() => setuserBaru(false)} />
    </>
  );
}

export default TableUser;
