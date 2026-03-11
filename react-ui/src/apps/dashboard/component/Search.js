import React, { useState } from "react";
import axios from "axios";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import swal from "sweetalert";
import "./custom_sweetalert.css";
import { useDispatch } from "react-redux";
import { refresh } from "../../../redux/counterSlice";

function Search() {
  const [incode, setIncode] = useState("");
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();

  const cari = () => {
    if (load) return;
    setLoad(true);

    const find = axios.post(
      `${API.HOST}/api/v2/course/cari`,
      {
        kode: incode,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    toast.promise(
      find,
      {
        loading: "Sedang mencari...",
        success: (data) => {
          setLoad(false);
          if (!data.data.data) {
            toast.error("Kode Tidak Valid", {
              style: {
                minWidth: "250px",
                border: "1px solid #FF4C4D",
                padding: "16px",
                color: "#000",
                marginBottom: "25px",
              },
              success: {
                duration: 1500,
              },
            });
          } else {
            swal({
              title: data.data.data.nama,
              text:
                data.data.data.deskripsi +
                ", \nKlik tambah kelas untuk masuk kelas ini.",
              icon: "info",
              buttons: {
                cancel: "Batal",
                catch: {
                  text: "Tambah kelas",
                  value: "oke",
                  className: "ml-5",
                },
              },
            }).then((value) => {
              switch (value) {
                case "oke":
                  enrollKelas(data.data.data.id);
                  break;
                default:
                  return;
              }
            });
          }
        },
        error: (error) => {
          console.log(error);
          console.log(error.response);
          setLoad(false);
          return <b>{error.response.data.message}</b>;
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
        },
      }
    );
  };

  const enrollKelas = (idk) => {
    if (load) return;
    setLoad(true);

    const call = axios.post(
      `${API.HOST}/api/v2/course/enroll`,
      {
        kelas_id: idk,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );
    // Notif
    toast.promise(
      call,
      {
        loading: "Enroll kelas...",
        success: (data) => {
          setLoad(false);
          if (data.data.success) {
            // BERHAISL DITAMBAHKAN
            dispatch(refresh());
            toast.success(data.data.message, {
              style: {
                minWidth: "250px",
                border: "1px solid #1E40AF",
                padding: "16px",
                color: "#1E40AF",
                marginBottom: "25px",
              },
              success: {
                duration: 3500,
              },
            });
          } else {
            toast.error(data.data.message, {
              style: {
                minWidth: "250px",
                border: "1px solid #FF4C4D",
                padding: "16px",
                color: "#000",
                marginBottom: "25px",
              },
              error: {
                duration: 3500,
              },
            });
          }
        },
        error: (error) => {
          setLoad(false);
          console.log(error);
          return <b>{error.response.data.message}</b>;
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
        },
      }
    );
  };

  return (
    <>
      <div className="grow p-5 max-w-2xl">
        <div className="flex items-center bg-aliceblue rounded-full shadow">
          <input
            id="search"
            type="text"
            placeholder="Cari kode kelas"
            className="rounded-l-full w-full py-2 px-6 text-slate-700 bg-aliceblue leading-tight focus:outline-none focus:bg-aliceblue"
            value={incode}
            onChange={(event) => setIncode(event.target.value)}
          />

          <div className="p-2">
            <div
              className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                cari();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
